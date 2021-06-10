<template>
    <div>
        <!-- 已上传列表 -->
        <ul class="images-list" ref="parentNode" :class="type ? type : ''">
            <li
                    class="item"
                    v-for="(item, index) in imagesList"
                    :key="item.id"
                    draggable="true"
                    v-dragging="{ list: imagesList, item: item, group: 'image' }"
            >
                <div class="view-images-box img-wrap daq-no-photo" @click.stop="currSource.play(item)">
                    <p v-if="sourceType !== 0" class="cover"></p>
                    <img v-if="item[currSource['imgKey']]" :src="item[currSource['imgKey']]" class="daq-img">
                </div>
                <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
                <!--<div v-else class="img-wrap" @click="currSourceType.play(item)">
                    <div class="view-images-box item daq-no-photo">
                        <img :src="item.imgUrl" :alt="item.name" class="daq-img" v-if="item.imgUrl">
                    </div>
                    <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
                </div>-->
                <span class="tag" :class="{checked: !!item.placeId}" @click="openPlacePop(item.id)">关联场所</span>
                <span class="tag" :class="{checked: !!item.description}" @click="descSelect(item.id)">描述</span>
                <span class="tag" :class="{checked: !!item.tags}" @click="showTagWin(item.id)">tag标签</span>
                <span class="tag" :class="{checked: !!item.imgUrl && !(/.{0,}base64.{0,}/.test(item.imgUrl))}" v-if="sourceType !== 0" @click="openViewImg(item.id)">设置封面</span>
                <Input placeholder="名称" class="width300" v-model="item.name" @on-change="update" :maxlength="40" />
            </li>
            <li class="item upload" v-if="imagesList.length < maxLength">
                <input type="file" :accept="currSource.accept" multiple ref="fileInput" @change="acceptImage($event)">+ 添加{{currSource.typeName}}
            </li>
        </ul>
        <p class="remind" v-if="maxLength && maxLength > 1">注：拖动可进行排序，最大上传数 {{maxLength}}</p>

        <!-- 预览图片 -->
        <PreviewPic v-model="visible" :imgUrl="imgUrl"></PreviewPic>
        <!-- 播放音频 -->
        <VoicePop :show="showVoice" :close="()=>{showVoice = false}" :voiceConf="voiceConf"></VoicePop>
        <!-- 播放视频 -->
        <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
        <!-- 场所 -->
        <UninPlace :show="showPlace" :isRadio="true" :defaultChoose="getPlaceIds.length && getPlaceIds" @onOkClick="placeChange" @onClose="showPlace=false"></UninPlace>
        <!-- tag弹窗 -->
        <PopTag :show="showTag" @getTagList="getTagList" resourceType="MEDIA" :labelType="currSource.labelType" :defaultTagList="defaultTagList"></PopTag>
        <!-- 添加封面图弹窗 -->
        <MediaPop :show="showMediaImg" :selectIds="getViewImgIds" :close="()=>{showMediaImg=false}" @onSure="receiveViewImg" :sourceType="0"></MediaPop>
        <!-- description弹窗 -->
        <PopDescribe :show="showDescribe" type="图片" @getDescript="getDescript" :defaultDescript="defaultDescript"></PopDescribe>
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {uploadImage, uploadBase} from "@service/content";
    import PopTag from "@components/pop/tag-pop.vue";
    import PopDescribe from "@components/pop/describe-pop.vue";
    import UninPlace from "@components/uninPlace/uninPlace.vue";
    import VoicePop from "@components/pop/voice-pop.vue";
    import VideoPlayer from "@components/video-play/video-play.vue";
    import MediaPop from "@components/pop/media-pop.vue";
    import {PreviewPic} from '@components/index'
    /**
     * prop参数
     * limit  最大上传数量
     * defaultImage: 默认图  支持多张和一张
     * type:  小号  small
     *
     * 事件
     * @getImagesList：返回数据[{id:'',...}]
     *
     * <UploadImages
     :limit="5"
     @getImagesList="getImagesList"
     :defaultImage=[{id:0,url:''}]
     :type="small"
     ></UploadImages>
     *
     */

    interface tagType {
        id: number,
        labelName?: string
    }

    interface imgType {
        id: string,
        url: string,
        indexI?: number,
        name?: string,
        imgUrl?: string,
        tags?:string,
        description?:string,
        placeType?:string,
        placeId?:number,
        placeObj?:placeType,
        viewImgId?:number,
        duration?:number,
    }

    interface placeType {
        address: string;
        id: number;
        images: string;
        name: string;
        resourceType: string;
        resourceTypeName: string;
        status: string
    }

    interface playVideoType {
        url: string;
        image: string;
        title: string;
    }

    @Component({
        components: {
            PopTag,
            PopDescribe,
            UninPlace,
            MediaPop,
            VideoPlayer,
            VoicePop,
            PreviewPic
        }
    })
    export default class UploadImages extends Vue {
        // 资源类型 0: 图片，1:视频，2: 音频
        @Prop({default: 0}) private sourceType!:number;
        // 限制个数
        @Prop() private limit!:number;
        // 默认数据
        @Prop() private defaultMedias!:Array<imgType>;
        // 显示样式
        @Prop({default: ''}) private type!:string;

        // 图片查看器的显示控制
        private visible: boolean = false;
        // 图片列表
        private imagesList: Array<imgType> = [];
        // 预览图片路径
        private imgUrl: string = "";
        // 限制个数
        private maxLength: number = 5;
        // 显示描述弹窗
        private showDescribe: boolean = false;
        // 标签
        private showTag = false;
        // 应该接受tag弹窗返回的tag的数据图片id
        private activeId?: string;
        // tag弹窗默认回显数据
        private defaultTagList: Array<tagType> = [];
        // 描述弹窗默认回显数据
        private defaultDescript: string = '';
        // 选择场所
        private showPlace: boolean = false;
        // 资源类型分类
        private sourceObjs = <any>[
            {
                typeName: '图片',
                accept: 'image/*',
                imgKey: 'url',
                labelType: 'IMAGE',
                play: this.viewImage
            },
            {
                typeName: '视频',
                accept: 'video/*',
                imgKey: 'imgUrl',
                labelType: 'VIDEO',
                play: this.viewVideo
            },
            {
                typeName: '音频',
                accept: 'audio/*',
                imgKey: 'imgUrl',
                labelType: 'AUDIO',
                play: this.viewVoice
            }
        ];
        // 当前资源类型对象
        private currSource: any = this.sourceObjs[this.sourceType+'']
        // 播放器参数
        private showVideo = <playVideoType>{
            url: "",
            image: "",
            title: ""
        };
        // 线上播放器
        private show: boolean = false
        // 显示弹窗声音
        private showVoice = false;
        // 显示弹窗声音
        private voiceConf:{src?: string, title?: string, pic?:string} = {};
        // 显示选择封面图资源
        private showMediaImg: boolean = false;

        // pop资源弹窗回显的封面图
        get getViewImgIds () {
            let curr = this.imagesList.filter((video:imgType) => video.id === this.activeId)
            return curr[0] ? [curr[0].viewImgId] : []
        }
        // pop资源弹窗回显的场所
        get getPlaceIds () {
            let curr = this.imagesList.filter((video:imgType) => video.id === this.activeId)
            let res:Array<any> = []
            if (curr[0]) {
                if (curr[0].placeObj) { // 存在说明不是回显数据是当前新添加操作的
                    res = [curr[0].placeObj]
                } else {
                    res = [ // 页面修改操作回显的数据
                        {
                            id: curr[0].placeId,
                            resourceType: curr[0].placeType
                        }
                    ]
                }
            }
            return res
        }

        created () {
            if (this.limit) {
                this.maxLength = this.limit;
            }
            if (this.defaultMedias) {
                this.changeImage(this.defaultMedias)
            }
        }

        mounted() {
            // 图片拖动
            this.$dragging.$on("dragend", () => {
                this.update()
            });
        }

        @Watch("defaultMedias")
        changeImage(val: Array<imgType>) {
            if (!val) {
                this.imagesList = [];
                return;
            }
            this.imagesList = val
        }

        // 接收封面图选择
        private receiveViewImg (res: any) {
            if (res && res.length) {
                if (res.length > 1) {
                    this.$Message.error("只能选择一张封面图！");
                } else {
                    let currVideo = this.imagesList.filter((media:any) => media.id === this.activeId)
                    if (currVideo[0]) {
                        currVideo[0].imgUrl = res[0].url
                        currVideo[0].viewImgId = res[0].id
                        this.imagesList = this.imagesList.concat([]);
                    }
                    this.update()
                }
            }
        }

        // 显示封面图弹窗
        private openViewImg (id: string) {
            this.activeId = id
            this.showMediaImg = true
        }

        // 查看大图
        private viewImage(item: {url: string}) {
            this.imgUrl = item.url;
            this.visible = true;
        }

        // viewVideo
        private viewVideo (item: any) {
            this.show = true;
            this.showVideo.url = item.url;
            this.showVideo.image = item.imgUrl;
            this.showVideo.title = item.name;
        }

        // viewVoice
        private viewVoice (item: any) {
            this.showVoice = true;
            this.voiceConf.src = item.url;
            this.voiceConf.pic = item.imgUrl;
            this.voiceConf.title = item.name;
        }

        // 选择资源
        private acceptImage(e: any) {
            let files = e.target.files;
            let len = files.length;
            let count: number = 0;
            let _input = this.$refs.fileInput as HTMLElement;
            let listTmp = this.imagesList.concat([]);
            _input.setAttribute("type", "text");

            for (let i = 0; i < len; i++) {
                let formData = new FormData();
                formData.append("Filedata", files[i]);
                formData.append("path", "cultural-tourism-cloud");
                let curr = {
                    url: '',
                    name: '',
                    id: '',
                    duration: 0
                } as imgType
                if (this.sourceType === 2) {
                    let url = window.URL.createObjectURL(files[i]);
                    let audio = document.createElement('audio');
                    audio.src = url;
                    audio.addEventListener('loadeddata', function () {
                        curr.duration = this.duration as number
                    })
                }

                uploadImage(formData).then((data: any) => {
                    Object.assign(curr, {
                        url: data.safeUrl,
                        name: data.safeUrl.split("/")[data.safeUrl.split("/").length - 1].split(".")[0].slice(0,40),
                        id: data.time + '-' + i,
                        indexI: i
                    })
                    listTmp.push(curr);

                    if (this.sourceType === 1) { // 视频取封面图
                        // @ts-ignore
                        this.getVideoImg(files[i]).then(this.uploadVideoImg).then((item: any) => {
                          curr.imgUrl = item.imgUrl
                          curr.duration = item.duration
                        }).finally(() => {
                            count++;
                            if (count === len) { // 资源上传完毕
                                this.imagesList = listTmp
                                this.update()
                                _input.setAttribute("type", "file");
                            }
                        })
                    } else {
                        count++;
                        if (count === len) { // 资源上传完毕
                            this.imagesList = listTmp
                            this.update()
                            _input.setAttribute("type", "file");
                        }
                    }
                });
            }
        }

        /*// 获取本地视频封面图
        private getVideoImg (files: Array<any>) {
            return new Promise((resolve, reject) => {
                let len = files.length;
                let resArr:any = {};
                let count = 0;
                for (let j = 0; j < len; j++) {
                    let video = document.createElement("video");
                    video.src = URL.createObjectURL(files[j]);
                    video.addEventListener("loadeddata", function() {
                        this.width = this.videoWidth;
                        this.height = this.videoHeight;
                        let canvas = document.createElement("canvas");
                        let ctx = canvas.getContext("2d");
                        canvas.width = this.width;
                        canvas.height = this.height;
                        // @ts-ignore
                        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                        let image = {
                            url: canvas.toDataURL("image/jpeg", 1),
                            width: this.width,
                            height: this.height,
                            currentTime: this.currentTime,
                            duration: this.duration,
                            blob: ''
                        };
                        resArr[j] = image
                        count++;
                        if (count === len) {
                            resolve(resArr)
                        }
                    });
                    video.addEventListener("error", function () {
                        count++;
                        if (count === len) {
                            resolve(resArr)
                        }
                    })
                }
            })
        }*/

        // 获取本地视频封面图
        private getVideoImg (file: any) {
            return new Promise((resolve, reject) => {
                let video = document.createElement("video");
                video.src = URL.createObjectURL(file);
                video.addEventListener("loadeddata", function () {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    let w = this.videoWidth;
                    let h = this.videoHeight;
                    this.width = canvas.width = w;
                    this.height = canvas.height = h;
                    // @ts-ignore
                    ctx.drawImage(this, 0, 0, w, h);
                    let imgUrl = canvas.toDataURL("image/jpeg", 1);
                    let duration = this.duration;

                    resolve({
                        data: imgUrl,
                        fileName: `${file.name}.jpg`,
                        duration
                    });
                });
                video.addEventListener("error", resolve)
            })
        }

        // 上传视频封面图
        private uploadVideoImg (img: any) {
            if (!img) return;
            return uploadBase([{
                data: img.data,
                path: 'cultural-tourism-cloud-admin',
                fileName: img.fileName
            }]).then((res:any) => ({
                imgUrl: res.safeUrl,
                duration: img.duration
            }))
        }

        //
        private update () {
            this.$emit("getMediaList", this.imagesList);
        }

        // 场所选择
        private placeChange (list:placeType[]) {
            /*if (list.length > 1) {
                this.$Message.error("只能选择一个场所！");
            } else {

            }*/
            let currImg = this.imagesList.filter((img:imgType) => img.id === this.activeId);
            if (currImg[0] && list[0]) {
                currImg[0].placeId = list[0].id
                currImg[0].placeObj = list[0]
                this.imagesList = this.imagesList.concat([]);
                this.update()
            }
        }

        // 打开场所弹窗
        private openPlacePop(id: string) {
            this.activeId = id
            this.showPlace = true
        }

        // tag选择
        private getTagList (list: Array<tagType>) {
            this.imagesList.forEach((data:imgType) => {
                if (data.id === this.activeId) {
                    data.tags = list.map((tag:tagType) => tag.id).join(',')
                }
            })
            this.update()
        }

        // 描述选择
        private descSelect (id: string) {
            this.activeId = id
            this.showDescribe = true
            let currImg = this.imagesList.filter((img:imgType) => img.id === id)
            if (currImg[0] && currImg[0].description) {
                this.defaultDescript = currImg[0].description
            } else {
                this.defaultDescript = ''
            }
        }

        // 获取描述
        private getDescript (des: string) {
            this.imagesList.forEach((data:imgType) => {
                if (data.id === this.activeId) {
                    data.description = des
                }
            })
            this.update()
        }

        // 显示tag弹窗
        private showTagWin (id: string) {
            let currImg = this.imagesList.filter((img:any) => img.id === id)
            if (currImg[0] && currImg[0].tags) {
                this.defaultTagList = currImg[0].tags.split(',').map((id:any) => ({id: Number(id)}));
            } else {
                this.defaultTagList = []
            }
            this.activeId = id
            this.showTag = true
        }

        // 删除图片
        private deleteFile(index: number) {
            this.imagesList.splice(index, 1);
            this.update()
        }
    }
</script>

<style lang='scss' scoped>
    .images-list {
        font-size: 0;
        .item {
            cursor: pointer;
            position: relative;
            display: inline-block;
            width: 240px;
            border-radius: 4px;
            margin: 0 10px 10px 0;
            vertical-align: top;
            text-align: center;
            font-size: 12px;
            color: $theme;
            .img-wrap {
                height: 160px;
            }
            .tag {
                display: inline-block;
                height: 22px;
                line-height: 22px;
                margin: 2px 4px 2px 0;
                padding: 0 5px;
                border: 1px solid #e8eaec;
                border-radius: 3px;
                background: #f7f7f7;
                font-size: 12px;
                vertical-align: middle;
                opacity: 1;
                overflow: hidden;
                cursor: pointer;
                color: #515a6e;
                &.checked {
                    color: #fff;
                    background: $theme;
                    border-color: $theme;
                }
            }
            .icon {
                position: absolute;
                right: -12px;
                top: -12px;
                z-index: 1;
                color: #90a0b9;
                font-size: 24px;
                &:hover {
                    color: $theme;
                }
            }
            &.upload {
                border: 1px dashed #dee3ed;
                cursor: pointer;
                line-height: 160px;
                &:hover {
                    border-color: $theme;
                }
                input {
                    opacity: 0;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
            }
        }
        .cover {
            position: absolute;
            left: 0;
            top: 0;
            /*background: rgba(0, 0, 0, 0.6);*/
        }
        &.small {
            .item {
                width: 90px;
                height: 60px;
                line-height: 60px;
            }
        }
    }

    .remind {
        font-size: 12px;
        line-height: 14px;
        color: #999;
        margin-top: 12px;
    }
</style>
