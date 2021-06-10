
<template>
    <div>
        <!-- 已上传列表 -->
        <ul class="images-list" ref="parentNode">
            <li
                    class="item"
                    v-for="(item, index) in videoList"
                    :key="item.id || item.virtualId"
                    :data-url="item.imgUrl"
                    draggable="true"
                    v-dragging="{ list: videoList, item: item, group: 'video' }"
            >
                <div class="img-wrap"
                     @click="currSourceType.play(item)">
                    <div class="view-images-box item daq-no-photo">
                        <p class="cover"></p>
                        <img :src="item.imgUrl" :alt="item.name" class="daq-img" v-if="item.imgUrl">
                    </div>
                    <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
                </div>
                <span class="tag" :class="{checked: !!item.placeId}" @click="openPlacePop(item.id || item.virtualId)">关联场所</span>
                <span class="tag" :class="{checked: !!item.description}" @click="descSelect(item.id || item.virtualId)">描述</span>
                <span class="tag" :class="{checked: !!item.tags}" @click="showTagWin(item.id || item.virtualId)">tag标签</span>
                <span class="tag" :class="{checked: !!item.imgUrl}" @click="openViewImg(item.id || item.virtualId)">设置封面</span>
                <Input placeholder="视频名称" class="width300" v-model="item.name" @on-change="update" :maxlength="40" />
            </li>
            <li class="item upload" @click="showMedia = true"  v-if="videoList.length < maxLength">
                <div class="img-wrap">+ 添加{{currSourceType.typeName}}</div>
            </li>
        </ul>
        <p class="remind" v-if="maxLength">注：支持{{allSourceType[this.sourceType].sourceType}}格式，最多上传{{maxLength}}个</p>

        <!-- 场所 -->
        <UninPlace :show="showPlace"  :isRadio="true" :defaultChoose="getPlaceIds.length && getPlaceIds" @onOkClick="placeChange" @onClose="showPlace=false"></UninPlace>
        <!-- 播放音频 -->
        <VoicePop :show="showVoice" :close="()=>{showVoice = false}" :voiceConf="voiceConf"></VoicePop>
        <!-- 播放视频 -->
        <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
        <!-- 添加视频/音频弹窗 -->
        <MediaPop :show="showMedia" :saveToSource="saveToSource" :selectIds="getVideoIds" :close="()=>{showMedia=false}" @onSure="selectSourceDatas" :sourceType="currSourceType.typeIndex"></MediaPop>
        <!-- 添加封面图弹窗 -->
        <MediaPop :show="showMediaImg" :selectUrls="getViewImgIds" :close="()=>{showMediaImg=false}" @onSure="receiveViewImg" :sourceType="0"></MediaPop>
        <!-- 添加描述弹窗 -->
        <PopDescribe :show="showDescribe" :type="currSourceType.typeName" @getDescript="getDescript" :defaultDescript="defaultDescript"></PopDescribe>
        <!-- 添加tag弹窗 -->
        <PopTag :show="showTag" @getTagList="getTagList" resourceType="MEDIA" :labelType="currSourceType.labelType"  :defaultTagList="defaultTagList"></PopTag>
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import VideoPlayer from "@components/video-play/video-play.vue";
    import MediaPop from "@components/pop/media-pop.vue";
    import PopTag from "@components/pop/tag-pop.vue";
    import PopDescribe from "@components/pop/describe-pop.vue";
    import VoicePop from "@components/pop/voice-pop.vue";
    import UninPlace from "@components/uninPlace/uninPlace.vue";
    /**
     * limit  最大上传数量
     * defaultVideo: 默认数据[{id:0,url:'',imgUrl:''}]
     * getVideoList: 返回数据
     * <UploadVideo
     :limit="1"
     @getVideoList="getVideoList"
     :defaultVideo=[{id:0,url:'',imgUrl:''}]
     ></UploadVideo>
     *
     */


    interface tagType {
        id: number,
        labelName?: string
    }

    interface playVideoType {
        url: String;
        image: String;
        title: String;
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

    interface videoType {
        id: number,
        imgUrl: string,
        url: string,
        name?: string,
        tags?:string,
        description?:string,
        placeType?:string,
        placeId?:number,
        placeObj?:placeType,
        viewImgId?:number, // 封面图id
        virtualId?:any
    }

    @Component({components: {
        VideoPlayer,
        MediaPop,
        PopTag,
        PopDescribe,
        VoicePop,
        UninPlace
    }})
    export default class UploadVideo extends Vue {
        // 是否保存到资源库 默认不保存到资源库
        @Prop({default: false}) private saveToSource!:boolean;
        // 条数限制
        @Prop() private limit!:Number;
        // 默认video
        @Prop() private defaultVideo!:Array<videoType>;
        // 资源类型 默认video
        @Prop({default: 'video'}) private sourceType!:string;

        // pop资源弹窗回显的id
        get getVideoIds () {
            return this.videoList.map((data:any)=>data.id)
        }
        // pop资源弹窗回显的id
        get getViewImgIds () {
            let curr = this.videoList.filter((video:videoType) => (video.id === this.activeId || video.virtualId === this.activeId))
            return curr[0] ? [curr[0].imgUrl] : []
        }
        // pop资源弹窗回显的id
        get getPlaceIds () {
            let curr = this.videoList.filter((video:videoType) => (video.id === this.activeId || video.virtualId === this.activeId))
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

        // video列表
        private videoList: Array<videoType> = [];
        // 限制个数
        private maxLength: any = 5;
        // 播放器显示
        private show: Boolean = false;
        // 播放器参数
        private showVideo = <playVideoType>{
            url: "",
            image: "",
            title: ""
        };
        // 显示选择多媒体资源
        private showMedia: boolean = false;
        // 显示选择封面图资源
        private showMediaImg: boolean = false;
        // 应该接受tag弹窗返回的tag的数据图片id
        private activeId?: number | string = '';
        // 显示描述弹窗
        private showDescribe: boolean = false;
        // 描述弹窗默认回显数据
        private defaultDescript: string = '';
        // 描述弹窗默认回显数据
        private defaultViewImgId: number | undefined;
        // tag弹窗默认回显数据
        private defaultTagList: Array<tagType> = [
            /*{
             labelName: "标签1",
             id: 1
             },
             {
             labelName: "标签2",
             id: 2
             }*/
        ];
        // 标签
        private showTag = false;
        // 显示弹窗声音
        private showVoice = false;
        // 显示弹窗声音
        private voiceConf:{src?: string, title?: string, pic?:string} = {};
        // 选择场所
        private showPlace: boolean = false;
        // 资源类型
        private allSourceType = <any>{
            video: {
                typeName: '视频',
                typeIndex: 1,
                play: this.playVideo,
                labelType: "VIDEO",
                sourceType: 'MP4'
            },
            voice: {
                typeName: '音频',
                typeIndex: 2,
                play: this.playVoice,
                labelType: "AUDIO",
                sourceType: 'MP3'
            }
        }
        // 当前资源类型
        private currSourceType: any = this.allSourceType[this.sourceType]

        @Watch("defaultVideo")
        changeVideo(val: Array<videoType>) {
            if (!val) {
                this.videoList = [];
                return;
            }
            val.forEach((item: videoType) => {
                if (!item.id) item.virtualId = item.url + '_' + new Date().getTime()
            });
            this.videoList = val
        }

        created () {
            if (this.limit) {
                this.maxLength = this.limit;
            }
            if (this.defaultVideo) {
                this.changeVideo(this.defaultVideo)
            }
        }

        mounted() {
            // 拖动
            // 拖动结束
            this.$dragging.$on("dragend", () => {
                this.$emit("getVideoList", this.videoList);
            });
        }

        // 打开场所弹窗
        private openPlacePop(id: number) {
            this.activeId = id
            this.showPlace = true
        }

        // 场所选择
        private placeChange (list:placeType[]) {
            /*if (list.length > 1) {
                this.$Message.error("只能选择一个场所！");
            } else {

            }*/
            let currVideo = this.videoList.filter((video:videoType) => (video.id === this.activeId || video.virtualId === this.activeId))
            if (currVideo[0]) {
                currVideo[0].placeId = list[0].id
                currVideo[0].placeObj = list[0]
                this.videoList = this.videoList.concat([]);
            }
            this.$emit("getVideoList", this.videoList);
        }

        // 接收封面图选择
        private receiveViewImg (res: any) {
            if (res && res.length) {
                if (res.length > 1) {
                    this.$Message.error("只能选择一张封面图！");
                } else {
                    let currVideo = this.videoList.filter((video:videoType) => (video.id === this.activeId || video.virtualId === this.activeId))
                    if (currVideo[0]) {
                        currVideo[0].imgUrl = res[0].url
                        currVideo[0].viewImgId = res[0].id
                        this.videoList = this.videoList.concat([]);
                    }
                    this.$emit("getVideoList", this.videoList);
                }
            }
        }

        // 显示封面图弹窗
        private openViewImg (id: number) {
            this.activeId = id
            let currVideo = this.videoList.filter((video:videoType) => (video.id === this.activeId || video.virtualId === this.activeId))
            if (currVideo[0] && currVideo[0].imgUrl) {
                this.defaultViewImgId = currVideo[0].id
            } else {
                this.defaultViewImgId = undefined
            }
            this.showMediaImg = true
        }

        // 显示tag弹窗
        private showTagWin (id: number) {
            this.activeId = id
            let currVideo = this.videoList.filter((video:videoType) => (video.id === this.activeId || video.virtualId === this.activeId))
            if (currVideo[0] && currVideo[0].tags) {
                this.defaultTagList = currVideo[0].tags.split(',').map((id:any) => ({id: Number(id)}));
            } else {
                this.defaultTagList = []
            }
            this.showTag = true
        }

        // tag选择
        private getTagList (list: Array<tagType>) {
            this.videoList.forEach((data:videoType) => {
                if (data.id === this.activeId || data.virtualId === this.activeId) {
                    data.tags = list.map((tag:tagType) => tag.id).join(',')
                }
            })
            this.$emit("getVideoList", this.videoList);
        }

        // 显示描述窗口
        private descSelect (id: number) {
            this.activeId = id
            this.showDescribe = true
            let currVideo = this.videoList.filter((video:videoType) => (video.id === this.activeId || video.virtualId === this.activeId))
            if (currVideo[0] && currVideo[0].description) {
                this.defaultDescript = currVideo[0].description
            } else {
                this.defaultDescript = ''
            }
        }

        // 接收描述
        private getDescript (des: string) {
            this.videoList.forEach((data:videoType) => {
                if (data.id === this.activeId || data.virtualId === this.activeId) {
                    data.description = des
                }
            })
            this.$emit("getVideoList", this.videoList);
        }

        // 播放video
        private playVideo(item: videoType) {
            this.show = true;
            this.showVideo.url = item.url;
            this.showVideo.image = item.imgUrl;
            this.showVideo.title = item.url.split("/")[item.url.split("/").length - 1].split(".")[0];
        }

        // 播放video
        private playVoice(item: videoType) {
            this.showVoice = true;
            this.voiceConf.src = item.url;
            this.voiceConf.pic = item.imgUrl;
            this.voiceConf.title = item.url.split("/")[item.url.split("/").length - 1].split(".")[0];
        }

        // 多媒体弹窗选择资源
        private selectSourceDatas (res: any) {
            res = res.filter((data:any) => {
                return data.isLocalAdd || !this.videoList.some((data2:any) => {
                    return (data2.id === data.id || data2.url === data.url)
                })
            })
            res.forEach((data:any) => {
                if (!data.id) data.virtualId = data.url + '_' + new Date().getTime()
            })
            if ((res.length + this.videoList.length) > this.maxLength) {
                this.$Message.error("已超出最大条数限制！");
                return
            }
            this.videoList = this.videoList.concat(res);
            this.$emit("getVideoList", this.videoList);
        }

        // 删除图片
        private deleteFile(index: number) {
            this.videoList.splice(index, 1);
            this.$emit("getVideoList", this.videoList);
        }

        //
        private update () {
            this.$emit("getVideoList", this.videoList);
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
            /*height: 160px;*/
            border-radius: 4px;
            margin: 0 10px 10px 0;
            vertical-align: top;
            text-align: center;
            font-size: 12px;
            color: $theme;
            .img-wrap {
                height: 160px;
            }
            .view-images-box {
                height: 100%;
            }
            .tag {
                display: inline-block;
                height: 22px;
                line-height: 22px;
                margin: 2px 4px;
                padding: 0 4px;
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
                line-height: 160px;
                border: 1px dashed #dee3ed;
                cursor: pointer;
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
    }

    .remind {
        font-size: 12px;
        line-height: 14px;
        color: #999;
        margin-top: 12px;
    }
</style>
