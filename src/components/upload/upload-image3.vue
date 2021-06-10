<template>
    <div>
        <!-- 已上传列表 -->
        <ul class="images-list" ref="parentNode" :class="type ? type : ''">
            <li
                    class="item"
                    v-for="(item, index) in imagesList"
                    :key="item.id || item.virtualId"
                    :data-url="item.url"
                    draggable="true"
                    v-dragging="{ list: imagesList, item: item, group: 'image' }"
            >
                <div class="img-wrap" @click.stop="viewImage(item)">
                    <img :src="item.url" :alt="item.url" class="daq-img">
                    <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
                </div>
                <span class="tag" :class="{checked: !!item.placeId}" @click="openPlacePop(item.id || item.virtualId)">关联场所</span>
                <span class="tag" :class="{checked: !!item.description}" @click="descSelect(item.id || item.virtualId)">描述</span>
                <span class="tag" :class="{checked: !!item.tags}" @click="showTagWin(item.id || item.virtualId)">tag标签</span>
                <Input placeholder="图片名称" class="width300" v-model="item.name" @on-change="update" :maxlength="40" />
            </li>
            <li class="item upload" @click="showMedia = true" v-if="imagesList.length < maxLength">
                <div class="img-wrap">+ 添加图片</div>
            </li>
        </ul>
        <p class="remind" v-if="maxLength && maxLength > 1">注：拖动图片可进行排序，最多上传{{maxLength}}张</p>
        <PreviewPic v-model="visible" :imgUrl="imgUrl"></PreviewPic>
        <!-- 场所 -->
        <UninPlace :show="showPlace" :isRadio="true" :defaultChoose="getPlaceIds.length && getPlaceIds" @onOkClick="placeChange" @onClose="showPlace=false"></UninPlace>
        <!-- 资源选择弹出 -->
        <MediaPop :show="showMedia" :saveToSource="saveToSource" :close="()=>{showMedia=false}" @onSure="selectSourceDatas" :sourceType="0"></MediaPop>
        <!-- tag弹窗 -->
        <PopTag :show="showTag" @getTagList="getTagList" resourceType="MEDIA" labelType="IMAGE" :defaultTagList="defaultTagList"></PopTag>
        <!-- description弹窗 -->
        <PopDescribe :show="showDescribe" type="图片" @getDescript="getDescript" :defaultDescript="defaultDescript"></PopDescribe>
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {uploadImage} from "@service/content";
    import MediaPop from "@components/pop/media-pop.vue";
    import PopTag from "@components/pop/tag-pop.vue";
    import PopDescribe from "@components/pop/describe-pop.vue";
    import UninPlace from "@components/uninPlace/uninPlace.vue";
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

    interface placeType {
        address: string;
        id: number;
        images: string;
        name: string;
        resourceType: string;
        resourceTypeName: string;
        status: string
    }

    interface imgType {
        id: number,
        url: string,
        name?: string,
        tags?:string,
        description?:string,
        placeType?:string,
        placeId?:number,
        placeObj?:placeType
        virtualId?:any
    }

    @Component({
        components: {
            MediaPop,
            PopTag,
            PopDescribe,
            UninPlace,
            PreviewPic
        }
    })
    export default class UploadImages extends Vue {
        // 图片查看器的显示控制
        private visible: boolean = false;
        // 图片列表
        private imagesList: Array<imgType> = [];
        // 预览图片路径
        private imgUrl: string = "";
        // 限制个数
        private maxLength: number = 5;
        // 选择多媒体资源
        private showMedia: boolean = false;
        // 显示描述弹窗
        private showDescribe: boolean = false;
        // 标签
        private showTag = false;
        // 应该接受tag弹窗返回的tag的数据图片 用id或者virtualId(自定虚拟id,本地添加数据)来做唯一判断条件
        private activeId?: number | string = '';
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
        // 描述弹窗默认回显数据
        private defaultDescript: string = '';
        // 选择场所
        private showPlace: boolean = false;

        // 是否保存到资源库 默认不保存到资源库
        @Prop({default: false}) private saveToSource!:boolean;
        // 限制个数
        @Prop() private limit!:number;
        // 显示样式
        @Prop({default: ''}) private type!:string;
        // 默认图
        @Prop() private defaultImage!:Array<imgType>;

        // pop资源弹窗回显的id
        public get getPlaceIds () {
            let curr = this.imagesList.filter((img:imgType) => (img.id === this.activeId || img.virtualId === this.activeId))
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
            if (this.defaultImage) {
                this.changeImage(this.defaultImage)
            }
        }

        mounted() {
            // 图片拖动
            this.$dragging.$on("dragend", () => {
                this.$emit("getImagesList", this.imagesList);
            });
            // 拖动结束
        }

        @Watch("defaultImage")
        changeImage(val: Array<imgType>) {
            if (!val) {
                this.imagesList = [];
                return;
            }
            val.forEach((item: imgType) => {
                if (!item.id) item.virtualId = item.url + '_' + new Date().getTime()
            });
            this.imagesList = val
        }

        //
        private update () {
            this.$emit("getImagesList", this.imagesList);
        }

        // 场所选择
        private placeChange (list:Array<placeType>) {
            let currImg = this.imagesList.filter((img:imgType) => (img.id === this.activeId || img.virtualId === this.activeId))
            if (currImg[0]) {
                currImg[0].placeId = list[0].id
                currImg[0].placeObj = list[0]
                this.imagesList = this.imagesList.concat([]);
            }
            this.$emit("getImagesList", this.imagesList);
        }

        // 打开场所弹窗
        private openPlacePop(id: number) {
            this.activeId = id
            this.showPlace = true
        }

        // tag选择
        private getTagList (list: Array<tagType>) {
            this.imagesList.forEach((data:imgType) => {
                if (data.id === this.activeId || data.virtualId === this.activeId) {
                    data.tags = list.map((tag:tagType) => tag.id).join(',')
                }
            })
            this.$emit("getImagesList", this.imagesList);
        }

        // 描述选择
        private descSelect (id: number) {
            this.activeId = id
            this.showDescribe = true
            let currImg = this.imagesList.filter((img:imgType) => (img.id === id || img.virtualId === id))
            if (currImg[0] && currImg[0].description) {
                this.defaultDescript = currImg[0].description
            } else {
                this.defaultDescript = ''
            }
        }

        // 获取描述
        private getDescript (des: string) {
            this.imagesList.forEach((data:imgType) => {
                if (data.id === this.activeId || data.virtualId === this.activeId) {
                    data.description = des
                }
            })
            this.$emit("getImagesList", this.imagesList);
        }

        // 显示tag弹窗
        private showTagWin (id: number) {
            let currImg = this.imagesList.filter((img:imgType) => (img.id === id || img.virtualId === id))
            if (currImg[0] && currImg[0].tags) {
                this.defaultTagList = currImg[0].tags.split(',').map((id:any) => ({id: Number(id)}));
            } else {
                this.defaultTagList = []
            }
            this.activeId = id
            this.showTag = true
        }

        // 多媒体弹窗选择资源
        private selectSourceDatas (res: any) {
            // 过滤已选项
            res = res.filter((data:any) => {
                return data.isLocalAdd || !this.imagesList.some((data2:imgType) => {
                    return (data2.id === data.id || data2.url === data.url)
                })
            })
            res.forEach((data:any) => {
                if (!data.id) data.virtualId = data.url + '_' + new Date().getTime()
            })
            // 条数限制
            if ((res.length + this.imagesList.length) > this.maxLength) {
                this.$Message.error("已超出最大条数限制！");
                return
            }
            //
            this.imagesList = this.imagesList.concat(res);
            this.$emit("getImagesList", this.imagesList);
        }

        // 查看大图
        private viewImage(item: {url: string}) {
            this.imgUrl = item.url;
            this.visible = true;
        }

        // 删除图片
        private deleteFile(index: number) {
            this.imagesList.splice(index, 1);
            this.$emit("getImagesList", this.imagesList);
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
                padding: 0 8px;
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
            background: rgba(0, 0, 0, 0.6);
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
