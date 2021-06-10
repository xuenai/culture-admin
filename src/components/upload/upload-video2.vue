<template>
    <div>
        <!-- 已上传列表 -->
        <ul class="images-list" ref="parentNode">
            <li
                    class="item"
                    v-for="(item, index) in videoList"
                    :key="item.id"
                    @click="playVideo(item)"
                    v-dragging="{ list: videoList, item: item, group: 'video' }"
            >
                <div class="view-images-box item daq-no-photo">
                    <p class="cover"></p>
                    <img :src="item.imgUrl" :alt="item.name" class="daq-img"
                         v-if="item.imgUrl">
                </div>
                <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
            </li>
            <li class="item upload" @click="showMedia = true"  v-if="videoList.length < maxLength">
                + 添加视频
            </li>
        </ul>
        <p class="remind" v-if="maxLength && maxLength > 1">注：支持MP4格式，最多上传{{maxLength}}个</p>
        <VideoPlayer id="uploadVideo2VideoPlayer" :showVideo="showVideo" :show="show"></VideoPlayer>
        <!-- <MediaPop :show="showMedia" :selectUrls="defaultMedia" @onSure="selectSourceDatas" :sourceType="1"></MediaPop> -->
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import VideoPlayer from "@components/video-play/video-play.vue";
    import MediaPop from "@components/pop/media-pop.ts";
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
    interface playVideoType {
        url: String;
        image: String;
        title: String;
    }

    interface videoType {
        id: number,
        imgUrl: string,
        url: string,
        name?: string
    }

    @Component({components: {VideoPlayer}})
    export default class UploadVideo extends Vue {
        // video列表
        private videoList: any = [];
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

        // 条数限制
        @Prop() private limit!:Number;
        // 默认video
        @Prop() private defaultVideo!:Array<videoType>;

        @Watch("defaultVideo")
        changeVideo(val: Array<videoType>) {
            if (!val) {
                this.videoList = [];
                return;
            }
            this.videoList = val
        }

        get defaultMedia() {
            return this.videoList.map((item:videoType) => item.url)
        }

        private mediaPopObj: any = {
            instance: null,
            destroy: () => {}
        }
         @Watch('showMedia')
         wMedia (v:any) {
             MediaPop({
                 show: v,
                 sourceType: 1,
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
            window.document.body.removeChild(this.uploadVideo2VideoPlayer as Node)
         }

        created () {
            if (this.limit) {
                this.maxLength = this.limit;
            }
            if (this.defaultVideo) {
                this.changeVideo(this.defaultVideo)
            }
        }

        private uploadVideo2VideoPlayer: Node | null = null
        mounted() {
            // 拖动
            this.$dragging.$on("dragend", () => {
                this.$emit("getVideoList", this.videoList);
            });
            this.uploadVideo2VideoPlayer = document.getElementById('uploadVideo2VideoPlayer') as Node
            window.document.body.appendChild(this.uploadVideo2VideoPlayer)
        }

        // 播放video
        private playVideo(item: videoType) {
            this.show = true;
            this.showVideo.url = item.url;
            this.showVideo.image = item.imgUrl;
            this.showVideo.title = item.name || item.url.split("/")[item.url.split("/").length - 1].split(".")[0];
        }

        // 多媒体弹窗选择资源
        private selectSourceDatas (res: any) {
            res = res.filter((data:any) => {
                return data.isLocalAdd || !this.videoList.some((data2:any) => {
                    return (data2.id === data.id || data2.url === data.url)
                })
            })
            if ((res.length + this.videoList.length) > this.maxLength) {
                this.$Message.error("已超出最大条数限制！");
                return
            }
            this.videoList = this.videoList.concat(res);
            this.$emit("getVideoList", this.videoList);
        }

        // 删除图片
        private deleteFile(index: Number) {
            this.videoList.splice(index, 1);
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
    }

    .remind {
        font-size: 12px;
        line-height: 14px;
        color: #999;
        margin-top: 12px;
    }
</style>
