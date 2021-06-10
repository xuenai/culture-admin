<!--
 * @Author: Hexg
 * @Date: 2019-07-05 01:41:27
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-06 11:42:52
 -->
<template>
    <div>
        <!-- 已上传列表 -->
        <ul class="images-list" ref="parentNode">
            <li
                class="item"
                v-for="(item, index) in videoData.videoList"
                :key="name ? item.url : item"
                :data-url="name ? item.url : item"
                draggable="true"
                v-dragging="{ list: videoData.videoList, item: item, group: 'image' }"
            >
                <div
                    class="view-images-box daq-no-photo img-box"
                    @click="playVideo(!name ? item : item.url, index)"
                >
                    <p class="cover"></p>
                    <img :src="videoData.videoCover[index]" :alt="item.name" class="daq-img" v-if="videoData.videoCover[index]">
                </div>
                <Input
                    v-model="item.name"
                    placeholder="请输入名称"
                    style="width: 100%; margin-top: 10px;"
                    :maxlength="100"
                    v-if="name"
                />
                <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
            </li>
            <li class="item upload" v-if="videoData.videoList.length < maxLength">
                <div v-if="!loading">
                    <input type="file"
                    style="*outline:none;_border:0 none;"
                    accept="video/*"
                    multiple ref="fileInput"
                    @change="acceptImage($event)"
                    unselectable="on"
                    >+ 添加视频
                </div>
                <Icon custom="iconfont c-icon-jiazai upload-loading" size="24" v-if="loading"></Icon>
            </li>
        </ul>
        <p class="remind" v-if="maxLength">注：支持MP4格式<span v-if="maxLength > 1">，最多上传{{maxLength}}个</span></p>
        <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {uploadImage} from "@service/content";
    import {base64FileUpload} from "@service/common";
    import VideoPlayer from "@components/video-play/video-play.vue";

    /**
     * limit  最大上传数量  少于1不展示提示
     * defaultVideo: 默认视频 String  支持多 1 +
     * cover: 默认封面图 String  支持多 1 +
     * <UploadVideo
     :limit="1"
     @getVideoList="getLogo"
     :defaultVideo="params.getAudio"
     :cover="logo"
     ></UploadVideo>
     * 调用 getAudio()
     */
    interface videoType {
        url: String;
        image: String;
        title: String;
        duration: String;
    }

    @Component({components: {VideoPlayer}})
    export default class UploadVideo extends Vue {
        // 图片列表
        private videoData: object = {
            videoList: [],//url
            videoCover: []//封面图
        };
        //   限制个数
        private maxLength: any = 5;
        private sizeLimit: Number = 500;  // 文件大小限制  默认500M
        private show: Boolean = false;
        // 是否需要标题
        @Prop() private name!: Boolean;
        private showVideo: videoType = {
            url: "",
            image: "",
            title: "",
            duration: ""
        };
        @Prop() private limit!: Number;
        // 默认视频
        @Prop() private defaultVideo!: String;

        @Watch("defaultVideo")
        changeImage(val: any, oldVal: any) {
            let _this = this;
            if (!val) {
                return;
            }
            if (!this.name) {
                if (val.indexOf(",") !== -1) {
                    (_this.videoData as any).videoList = val.split(",");
                } else {
                    (_this.videoData as any).videoList = val.split(" ");
                }
            } else {
                (_this.videoData as any).videoList = val;
            }
        }
        // 默认封面图
        @Prop() private cover!: String;

        @Watch("cover")
        changeCover(val: any, oldVal: any) {
            let _this = this;
            if (!val) {
                return;
            }
            if (!this.name) {
                if (val.indexOf(",") !== -1) {
                    (_this.videoData as any).videoCover = val.split(",");
                } else {
                    (_this.videoData as any).videoCover = val.split(" ");
                }
            } else {
                (_this.videoData as any).videoCover = val;
            }
        }
        // 图片拖动
        mounted() {
            if (this.limit) {
                this.maxLength = this.limit;
            }
        }

        // 查看大图
        private playVideo(item: string, index: any) {
            this.show = true;
            this.showVideo.url = item;
            this.showVideo.image = (this.videoData as any).videoCover[index];
            this.showVideo.title = item.split("/")[item.split("/").length - 1].split(".")[0];
        }

        // 加载loading 图
        private loading:boolean=false;
        // 选择视频
        private acceptImage(e: any) {
            let files = e.target.files;
            let _this = this;
            let len = files.length;
            let _input = this.$refs.fileInput as HTMLElement;
            for(let i = 0,len = files.length; i < len;i++){
                // @ts-ignore
                if((files[i].size / 1024 / 1024).toFixed(0) >= _this.sizeLimit){
                    this.$Message.error(`文件大小不能超过${this.sizeLimit}M`);
                    return;
                }
            }
            // 超过最大数量限制
            let _limit = this.maxLength - (this.videoData as any).videoList.length;
            if ((this.videoData as any).length + len > this.maxLength) {
                this.$Message.error(
                    `您最多${this.maxLength === 1 ? "只" : "还"}能上传${_limit}个`
                );
                return;
            }
            _input.setAttribute("type", "text");
            _this.loading=true;
            for (let i = 0; i < len; i++) {
                let formData = new FormData();
                formData.append("Filedata", files[i]);
                formData.append("path", "cultural-tourism-cloud");
                uploadImage(formData).then((data: any) => {
                    if (!_this.name) {
                        (_this.videoData as any).videoList.push(data.safeUrl);
                    } else {
                        (_this.videoData as any).videoList.push({
                            url: data.safeUrl,
                            name: (files[i].name as any).substr(0,100)
                        });
                    }
                    this.getVideoImage(files[i], function (a: any) {
                        // 通过base64获取封面图
                        _this.getCoverVideo(a.url);
                        // 总时长 < 60s
                        if(Math.floor(a.duration / 60) === 0){
                            a.duration = "00:" + ('0' + Math.floor(a.duration)).slice(-2)
                        // 总时长 < 9分钟
                        }else if(Math.floor(a.duration / 60) <= 9){
                            a.duration = "0" + Math.floor(a.duration / 60) + ":" + ('0' + Math.floor(a.duration % 60)).slice(-2)
                        }else{
                        // 总时长 > 9分钟
                            a.duration = Math.floor(a.duration / 60) + ":" + ('0' + Math.floor(a.duration % 60)).slice(-2)
                        }
                        if(_this.name){
                            (_this.videoData as any).videoList[i].duration = a.duration;
                        }
                    });
                    if ((_this.videoData as any).videoList.length>=len) {
                        if (!this.name) {
                            (_this.videoData as any).videoList=(_this.videoData as any).videoList as Array<string>
                        } else {
                            (_this.videoData as any).videoList=(_this.videoData as any).videoList as Array<Object>
                        }
                    }
                });
            }
            _input.setAttribute("type", "file");
        }

        private getVideoImage(file: any, call: any) {
            let _this = this
            if (file && file.type.indexOf("video/") == 0) {
                var video = document.createElement("video");
                video.src = URL.createObjectURL(file);
                video.setAttribute('autoplay', 'true')
                video.addEventListener('canplaythrough', function () {
                    // @ts-ignore
                    let videoDom = this
                    videoDom.width = videoDom.videoWidth;
                    videoDom.height = videoDom.videoHeight;
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = videoDom.width;
                    canvas.height = videoDom.height;

                    // @ts-ignore
                    setTimeout(()=>{
                        // @ts-ignore
                        ctx.drawImage(videoDom, 0, 0, canvas.width, canvas.height);
                        let image = {
                            url: canvas.toDataURL("image/jpeg", 1),
                            width: videoDom.width,
                            height: videoDom.height,
                            currentTime: videoDom.currentTime,
                            duration: videoDom.duration
                        };
                        call.call(file, image);
                        // @ts-ignore
                        video = null
                        video.pause();
                    }, _this.isIE ? 200 : 0)
                });
                video.addEventListener('error', () => {
                    call.call(file, {duration: 0, url: ''})
                })
                // 不播放截取不到图片
                video.play();
            }
        }

        //base64获取封面图
        private getCoverVideo(imgUrl: any) {
            let _this = this;
            if (!imgUrl) {
                (_this.videoData as any).videoCover.push('')
                _this.$emit("getVideoList", _this.videoData);
                _this.loading=false;
                return
            }

            let img = new Image,
                width = 1024, // image resize   压缩后的宽
                quality = 0.8, // image quality  压缩质量
                canvas:any = document.createElement("canvas"),
                drawer:any = canvas.getContext("2d");
            img.src=imgUrl;
            img.onload = function () {
                canvas.width = width;
                canvas.height = width * (img.height / img.width);
                drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
                let base64 = canvas.toDataURL("image/jpeg", quality); // 这里就拿到了压缩后的base64图片
                // 调用接口获取图片
                base64FileUpload({
                    base64: base64
                }).then((res: any) => {
                    if (res.code === 0) {
                        (_this.videoData as any).videoCover.push(res.data)
                        _this.$emit("getVideoList", _this.videoData);
                        _this.loading=false;
                    } else {
                        (_this.videoData as any).videoCover.push('')
                        _this.$emit("getVideoList", _this.videoData);
                        _this.loading=false;
                    }
                }).catch((err: any) => {
                    (_this.videoData as any).videoCover.push('')
                    _this.$emit("getVideoList", _this.videoData);
                    _this.loading=false;
                })
            };
        }

        // 删除视频
        private deleteFile(index: Number) {
            let _this = this;
            (_this.videoData as any).videoList.splice(index, 1);
            (_this.videoData as any).videoCover.splice(index, 1);
            if (!_this.name) {
                (_this.videoData as any).videoList=(_this.videoData as any).videoList as Array<string>;
            } else {
                (_this.videoData as any).videoList=(_this.videoData as any).videoList as Array<Object>;
            }
            _this.$emit("getVideoList", _this.videoData);
        }

        // 是否是ie
        get isIE () {
            // @ts-ignore
          return !!window.ActiveXObject || "ActiveXObject" in window
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
            margin: 0 10px 10px 0;
            vertical-align: top;
            text-align: center;
            font-size: 12px;
            color: $theme;
            .img-box {
                width: 240px;
                height: 160px;
                border-radius: 4px;
                overflow: hidden;
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
                width: 240px;
                height: 160px;
                line-height: 160px;
                border-radius: 4px;
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
                    outline: none;
                    cursor: pointer;
                }
            }
            input {
                outline:medium; appearance: none;
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
