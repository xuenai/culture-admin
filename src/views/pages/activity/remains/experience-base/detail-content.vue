<template>
  <div class="list-panel">
    <!-- 基本信息 -->
    <Row class="item">
      <i-col span="2" class="item-name tit">基本信息</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">创建者</i-col>
      <i-col span="22" class="item-content">{{data.createUserName}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">基地名称</i-col>
      <i-col span="22" class="item-content">{{data.name}}</i-col>
    </Row>
    <Row class="item" v-if="data.tag">
      <i-col span="2" class="item-name">标签</i-col>
      <i-col span="22" class="item-content">
        <span
            class="choice-tag active"
            v-for="(item,index) in tagList"
            :key="index"
          >{{item.labelName}}</span>
      </i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">基地级别</i-col>
      <i-col span="22" class="item-content">{{data.levelName}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">申报地区</i-col>
      <i-col span="22" class="item-content">{{data.reportRegionName}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">申报单位</i-col>
      <i-col span="22" class="item-content">{{data.reportCompany}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">非遗体验项目</i-col>
      <i-col span="22" class="item-content">{{data.heritageItemName}}</i-col>
    </Row>
    <Row class="item" v-if="data.examineNumber">
      <i-col span="2" class="item-name">参加体验人数接口</i-col>
      <i-col span="22" class="item-content">{{data.examineNumber}}</i-col>
    </Row>
    <Row class="item" v-if="data.examineNumber">
      <i-col span="2" class="item-name">体验活动人数</i-col>
      <i-col span="22" class="item-content">{{data.activityNumber}}</i-col>
    </Row>
    <Row class="item" v-if="data.examineNumber">
      <i-col span="2" class="item-name">同时接纳人数</i-col>
      <i-col span="22" class="item-content">{{data.capacity}}</i-col>
    </Row>
    <Row class="item" v-if="data.contactName || data.contactPhone">
      <i-col span="2" class="item-name">联系人</i-col>
      <i-col span="22" class="item-content">{{data.contactName}} {{data.contactPhone}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">基地所在地</i-col>
      <i-col span="22" class="item-content">
        {{data.baseRegionName}} {{data.baseAddress}}
        <descMap id="map" :longitude="data.longitude" :latitude="data.latitude"></descMap>
      </i-col>
    </Row>

    <!-- 基地介绍 -->
    <Row class="item" v-if="data.images || data.voice || data.video || data.introduce">
      <i-col span="2" class="item-name tit">基地介绍</i-col>
    </Row>
    <Row class="item" v-if="data.images">
      <i-col span="2" class="item-name">图片</i-col>
      <i-col span="22" class="item-content img-list">
        <p class="img" v-for="(img,i) in data.images.split(',')" :key="i">
          <img @click="viewImgWin(data.images.split(','), i)" :src="img" alt>
        </p>
      </i-col>
    </Row>
    <Row class="item" v-if="data.voice">
      <i-col span="2" class="item-name">语音</i-col>
      <i-col span="22" class="item-content">
        <uploadAudio :defaultAudio="data.voice" :readonly="true"></uploadAudio>
      </i-col>
    </Row>
    <Row class="item" v-if="data.video">
      <i-col span="2" class="item-name">视频</i-col>
      <i-col span="22" class="item-content img-list">
        <p class="img daq-no-photo view-images-box" @click="show = true">
          <span class="cover"></span>
          <img :src="videoCover" alt v-if="videoCover" class="daq-img" />
        </p>
      </i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">介绍</i-col>
      <i-col span="22" class="item-content" v-html="data.introduce"></i-col>
    </Row>

    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <PreviewPics v-model="imgView" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { getParentsRegion } from "@util/comm";
import descMap from "@components/map/desc-map.vue";
import uploadAudio from "@components/upload/upload-audio.vue";
import VideoPlayer from "@components/video-play/video-play.vue";
import { PreviewPics } from "@components/index";
import { tagViewList } from "@service/common";
@Component({
  components: { PreviewPics, descMap, uploadAudio, VideoPlayer }
})
export default class ContentDetail extends Vue {
  @Prop() private data!: any;
  // 图片可显示
  private imgView: boolean = false;
  // 图
  private imgUrl: Array<string> = [];
  private currIndex = 0;
  private videoCover: string = ''

  private show: Boolean = false;
  private showVideo: any = {
    url: "",
    image: "",
    title: ""
  };
  created() {
    this.showVideo.url = this.data.video;
    this.getVideoImg(this.showVideo.url).then((res:any) => {
        if (res) this.videoCover = res.url
    })
    if (this.data.tag) this.getTags();
  }
  beforeDestroy() {
    URL.revokeObjectURL(this.videoCover);
  }
  
  // 预览图片
  private viewImgWin(src: Array<string>, idx: number) {
    this.imgUrl = src;
    this.imgView = true;
    this.currIndex = idx;
  }
  // 获取视频封面图
  private getVideoImg(url: string) {
    return new Promise((resolve, reject) => {
      let video = document.createElement("video");
      video.src = url;
      video.crossOrigin = 'Anonymous'
      video.addEventListener("loadeddata", function() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = this.videoWidth;
        canvas.height = this.videoHeight;
        // @ts-ignore
        ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight);
        setTimeout(() => {
          let duration = this.duration;
          canvas.toBlob(
            blob => {
              let url = URL.createObjectURL(blob)
              resolve({
                url,
                duration
              });
            },
            "image/jpeg",
            1
          );
        }, 20);
      });
      video.addEventListener("error", function() {
        resolve();
      });
    });
  }
    //标签列表
  private tagList:any=[];
  private getTags() {
    tagViewList({
      ids: this.data.tag
    }).then((res: any) => {
      this.tagList= res.datas;
    });
  }
}
</script>

<style scoped lang="scss">
.list-panel {
  margin-top: 10px;
  .item {
    padding: 10px 0;
    line-height: 25px;
    &.tit {
      border-top: 1px solid $borderLight;
    }
  }
  .red {
    vertical-align: middle;
  }
  .item-name {
    width: 150px;
    text-align: right;
    margin-right: 13px;
    font-weight: 600;
    color: $font01;
    &.tit {
      font-size: 1.2em;
    }
  }
  .item-content {
    width: 80%;
    color: $font05;
    .img {
      display: inline-block;
      width: 240px;
      height: 160px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
      & + .img {
        margin-left: 5px;
      }
    }
    &.simulate {
      p {
        display: inline-block;
        & + p {
          margin-left: 20px;
        }
      }
      .count {
        margin-left: 3px;
        width: 200px;
        text-align: left;
      }
    }
  }
}
</style>