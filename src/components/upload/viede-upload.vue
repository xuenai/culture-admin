<!--
 * @Author: Hexg
 * @Date: 2019-07-10 19:21:57
 * @LastEditors: Hexg
 * @LastEditTime: 2019-07-11 14:03:40
 -->
<template>
  <div>
    <!-- 已上传列表 -->
    <ul class="images-list" ref="parentNode">
      <li
        class="item"
        v-for="(item, index) in list"
        :key="`${item.url}${index}`"
      >
        <div
          class="view-images-box daq-no-photo img-box"
          @click="playVideo(item)"
        >
          <p class="cover"></p>
          <img :src="item.image" class="daq-img" v-if="item.image">
        </div>
        <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
      </li>
      <li class="item upload" v-if="list.length < 1">
        <div v-if="!loading">
          <input type="file" accept="video/*" ref="fileInput" @change="acceptImage($event)">+ 添加视频
        </div>
        <Icon custom="iconfont c-icon-jiazai upload-loading" size="24" v-if="loading"></Icon>
      </li>
    </ul>
    <p class="remind" v-if="!list.length">注：支持MP4格式，最多上传1个</p>
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import axios from 'axios'
import { uploadImage, uploadBase} from "@service/content";
import VideoPlayer from "@components/video-play/video-play.vue";

interface VedioListType {
  url: string;
  image: string;
  title?: string;
}

// 用法
// <VedioUpload v-model="videoData"></VedioUpload>
// private videoData = {
//     url: '',
//     image: ''
//   }
//   @Watch("videoData", { immediate: true, deep: true })
//   onVideoDataChange (val: any) {
//     if (val) {
//       this.data['videoCover'] = val.image
//       this.data['video'] = val.url
//     }
//   }

@Component({ components: { VideoPlayer } })
export default class VedioUpload extends Vue {
  @Prop() readonly value !: Array<VedioListType>;
  // 列表
  private list: Array<VedioListType> = [];
  private show = false;
  private showVideo = {
    url: "",
    image: "",
    title: ""
  };
  loading = false;
  @Watch('value', {immediate: true, deep: true})
  onValueChange (val:Array<VedioListType>){
    this.list = val
  }
  @Watch("list", { immediate: true, deep: true })
  onListChange (val:Array<VedioListType>) {
    this.input()
  }
  @Emit()
  input () {
    return this.list
  }
  // 点击删除
  private deleteFile (index: number) {
    this.list.splice(index, 1);
  }
  // 选择视频
  private acceptImage(e: any) {
    let files = e.target.files;
    let _this = this;
    let len = files.length;
    // 超过最大限制
    let _limit = 1
    if (this.list.length + len > 1 ){
      this.$Message.error(`您最多${this.maxLength === 1 ? "只" : "还"}能上传${_limit}个`);
      return;
    }
    let _input = this.$refs.fileInput as HTMLElement;
    _input.setAttribute("type", "text");
    _this.loading = true;
    for (let i = 0; i < len; i++) {
      let formData = new FormData();
      formData.append("Filedata", files[i]);
      formData.append("path", "cultural-tourism-cloud-admin");
      // 截取封面图 然后再上传视频和封面图
      this.getVideoCover(files[i], function(image: any) {
        axios.all([uploadImage(formData), uploadBase([image])])
          .then(axios.spread((videoRes: any, base64Res:any)=> {
            _this.list.push({
                url: videoRes.safeUrl,
                image: base64Res.safeUrl,
                title: ''
              })
          })).finally(() => {
            _this.loading = false;
            _input.setAttribute("type", "file");
          })
      });
    }
  }
  // 获取视频中的图片
  private getVideoCover(file: any, callback: any) {
    if (file && file.type.indexOf("video/") == 0) {
      let video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.play();
      video.addEventListener("loadeddata", function() {
        setTimeout(() => {
          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          canvas.width = this.videoWidth;
          canvas.height = this.videoHeight;
          // @ts-ignore
          ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight);

          let imgUrl = canvas.toDataURL();
          let time = (new Date()).getTime();
          let filename = file.name.split(".")[0]
          let image = {
            data: imgUrl,
            path: 'cultural-tourism-cloud-admin',
            fileName: `${filename}-${time}.jpg`
          }
          callback && callback(image)
          this.pause();
        }, 250)
      });
    }
  }
  // 播放视频
  private playVideo(item: VedioListType) {
    this.show = true;
    this.showVideo.url = item.url;
    this.showVideo.image = item.image;
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
