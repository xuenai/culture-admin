<template>
    <div>
        <!-- 已上传列表 -->
        <ul class="images-list" ref="parentNode" :class="type ? type : ''">
            <li
                    class="item"
                    v-for="(item, index) in imagesList"
                    :key="item.id"
                    @click.stop="viewImage(item)"
                    v-dragging="{ list: imagesList, item: item, group: 'image' }"
            >
                <img :src="item.url" :alt="item.name" class="daq-img">
                <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
            </li>
            <li class="item upload" @click="showMedia = true" v-if="imagesList.length < maxLength">
                + 添加图片
            </li>
        </ul>
        <p class="remind" v-if="maxLength && maxLength > 1">注：拖动图片可进行排序，最多上传{{maxLength}}张</p>
        <PreviewPic v-model="visible" :imgUrl="imgUrl"></PreviewPic>
        <!-- <MediaPop :show="showMedia" :selectUrls="defaultMedia" @onSure="selectSourceDatas" :sourceType="0"></MediaPop> -->
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import MediaPop from "@components/pop/media-pop.ts";
    import {PreviewPic} from '@components/index'
    /**
     * limit  最大上传数量
     * defaultImage: 默认图  支持多张和一张
     * type:  小号  small
     * @getImagesList：返回数据[{id:'',...}]
     * <UploadImages
     :limit="5"
     @getImagesList="getImagesList"
     :defaultImage=[{id:0,url:''}]
     :type="small"
     ></UploadImages>
     *
     */

    interface imgType {
        id: number,
        url: string,
        name?: string
    }

    @Component({
        components: {
            // MediaPop,
            PreviewPic
        }
    })
    export default class UploadImages extends Vue {
        // 图片查看器的显示控制
        private visible: boolean = false;
        // 图片列表
        private imagesList: any = [];
        // 预览图片路径
        private imgUrl: string = "";
        // 限制个数
        private maxLength: number = 5;
        // 选择多媒体资源
        private showMedia: boolean = false;

        // 限制个数
        @Prop() private limit!:number;
        // 显示样式
        @Prop() private type!:string;
        // 默认图
        @Prop() private defaultImage!:Array<imgType>;

        get defaultMedia() {
            return this.imagesList.map((item:imgType) => item.url)
        }

        private mediaPopObj: any = {
            instance: null,
            destroy: () => {}
        }
        @Watch('showMedia')
        wMedia (v:any) {
            MediaPop({
                show: v,
                sourceType: 0,
                close: ()=>{ this.showMedia = false },
                // createUser: '-1',
                saveToSource: false,
                // selectIds: [],
                selectUrls: this.defaultMedia,
                onSure: this.selectSourceDatas
            }, this.mediaPopObj)
        }

        beforeDestroy() {
            this.mediaPopObj.destroy()
        }

        created () {
            if (this.limit) {
                this.maxLength = this.limit;
            }
            if (this.type) {
                this.type = this.type;
            }
            if (this.defaultImage) {
                this.changeImage(this.defaultImage as Array<imgType>)
            }
        }

        mounted() {
            // 图片拖动
            // 拖动结束
            this.$dragging.$on("dragend", () => {
                this.$emit("getImagesList", this.imagesList);
            });
        }

        @Watch("defaultImage")
        changeImage(val: Array<{id: number, url: string}>) {
            if (!val) {
                this.imagesList = [];
                return;
            }
            this.imagesList = val
        }

        // 多媒体弹窗选择资源
        private selectSourceDatas (res: any) {
            res = res.filter((data:any) => {
                return data.isLocalAdd || !this.imagesList.some((data2:any) => {
                    return (data2.id === data.id || data2.url === data.url)
                })
            })
            if ((res.length + this.imagesList.length) > this.maxLength) {
                this.$Message.error("已超出最大条数限制！");
                return
            }
            this.imagesList = this.imagesList.concat(res);
            this.$emit("getImagesList", this.imagesList);
        }

        // 查看大图
        private viewImage(item: imgType) {
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
            height: 160px;
            border-radius: 4px;
            margin: 0 10px 10px 0;
            vertical-align: top;
            text-align: center;
            line-height: 160px;
            font-size: 12px;
            color: $theme;
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
