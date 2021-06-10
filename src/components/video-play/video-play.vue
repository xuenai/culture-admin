<!--
 * @Author: xulr
 * @since: 2019-06-11 15:46:52
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-05 10:10:34
 -->
<template>
  <div class="video-global">
    <Dialog :configer="dialogConfig" @onClose="closePop" v-if="playerOptions.sources[0].src">
      <div class="content">
        <video-player ref="videoPlayer" :options="playerOptions"></video-player>
      </div>
    </Dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Dialog from "@components/Dialog/Dialog.vue";
// @ts-ignore
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
/**
 *  <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
 * showVideo为一个对象
 *
 *   private showVideo: videoType = {
    url: "",
    image: "",
    title: ""
  };
 */
@Component({
  components: {
    Dialog,
    videoPlayer
  }
})
export default class VideoPlay extends Vue {
  //   弹窗配置
  private dialogConfig: any = {
    title: "视频",
    show: false,
    ok: false,
    cancel: false,
  };
  private playerOptions: any = {
    start: 0,
    playsinline: false,
    muted: true,
    language: "en",
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    sources: [
      {
        type: "video/mp4",
        src: ""
      }
    ],
    poster:
      "http://file.geeker.com.cn/uploadfile/hzcloud/zxw/content/1502331111653/1502332139757/15164441hdf0.jpg"
  };
  // 监听显示隐藏
  @Prop() private showVideo!: any;
  @Prop() private show!: Boolean;
  @Watch("showVideo", {deep: true})
  setValue(val: any, oldValue: any) {
    this.dialogConfig.title = val.title || '视频播放';
    this.playerOptions.sources[0].src = val.url;
    this.playerOptions.poster = val.image;
  }
  mounted() {
    this.dialogConfig.show = this.show;
    this.dialogConfig.title = this.showVideo.title || '视频播放';
    this.playerOptions.sources[0].src = this.showVideo.url;
    this.playerOptions.poster = this.showVideo.image;
  }
  @Watch("show")
  setShow(val: Boolean, oldValue: Boolean) {
      this.dialogConfig.show = val;
      this.dialogConfig.title = this.showVideo.title || '视频播放';
      this.playerOptions.sources[0].src = this.showVideo.url;
      this.playerOptions.poster = this.showVideo.image;
  }
  // 关闭弹窗
  private closePop() {
    this.$parent.show = false;
    this.playerOptions.sources[0].src = "";
    this.playerOptions.poster = "";
    this.$emit('closePop');
    // this.$parent.showVideo.url = "";
    // this.$parent.showVideo.image = "";
    // this.$parent.showVideo.title = "";
  }
}
</script>
<style lang='scss'>
.video-global {
  .video-js {
    width: 100% !important;
    height: 100% !important;
  }
  .footer {
    display: none !important;
  }
}
</style>

<style lang='scss' scoped>
.video-box {
  width: 800px;
  height: 540px;
}
.content,
.video-player {
  position: relative;
  width: 800px;
  height: 540px;
}
</style>
