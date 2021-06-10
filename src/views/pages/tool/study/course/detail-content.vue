<template>
  <Tabs class="tabs">
    <TabPane label="1. 基本信息" style="padding-right: 130px;">
      <Row class="item">
        <i-col span="2" class="item-name">课程名称</i-col>
        <i-col span="22" class="item-content">{{data.name}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">所属分类</i-col>
        <i-col span="22" class="item-content">{{data.typeName}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">主讲人</i-col>
        <i-col span="22" class="item-content">{{data.lecturerName}}</i-col>
      </Row>
      
      <Row class="item" v-if="data.image">
        <i-col span="2" class="item-name">图片</i-col>
        <i-col span="22" class="item-content img-list">
          <p class="img" v-for="(img,i) in data.image.split(',')" :key="i">
            <img @click="viewImgWin(data.image.split(','), i)" :src="img" alt>
          </p>
        </i-col>
      </Row>

      <Row class="item">
        <i-col span="2" class="item-name">排序</i-col>
        <i-col span="22" class="item-content">{{data.sort}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">课程简介</i-col>
        <i-col span="22" class="item-content">{{data.introduction}}</i-col>
      </Row>
      <Row class="item" v-if="data.courseAims">
        <i-col span="2" class="item-name">课程目标</i-col>
        <i-col span="22" class="item-content" v-html="data.courseAims"></i-col>
      </Row>
      <Row class="item" v-if="data.content">
        <i-col span="2" class="item-name">主要内容</i-col>
        <i-col span="22" class="item-content" v-html="data.content"></i-col>
      </Row>
      <Row class="item" v-if="data.thinkingProblem">
        <i-col span="2" class="item-name">思考问题</i-col>
        <i-col span="22" class="item-content" v-html="data.thinkingProblem"></i-col>
      </Row>
      <Row class="item" v-if="data.objectOriented">
        <i-col span="2" class="item-name">面向对象</i-col>
        <i-col span="22" class="item-content">{{data.objectOriented}}</i-col>
      </Row>
    </TabPane>

    <TabPane label="2. 课程信息">
      <Card v-for="chapter in data.chapterTypeVOS" :key="chapter.id" class="card">
        <h3 slot="title">章名称：{{ chapter.name }}</h3>
        <Row class="item" v-for="(section, i) in chapter.ctcSchoolChapterVOS" :key="i">
          <i-col span="8" class="item-name right">节名称：{{ section.name }}</i-col>
          <i-col span="2" class="item-content" v-if="section.duration">时长：{{ formatt(section.duration) }}</i-col>
          <i-col span="14" class="item-content"><Icon class="play" type="logo-youtube" @click="()=>{show=true; showVideo.url = section.address}" /></i-col>
        </Row>
      </Card>
    </TabPane>

    <VideoPlayer id="videoPlayer" :showVideo="showVideo" :show="show" @closePop="show = false"></VideoPlayer>
    <PreviewPics v-model="imgView" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
  </Tabs>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import { PreviewPics } from "@components/index";
@Component({
  components: { PreviewPics, VideoPlayer }
})
export default class ContentDetail extends Vue {
  @Prop() private data!: any;
  // 图片可显示
  private imgView: boolean = false;
  // 图
  private imgUrl: Array<string> = [];
  private currIndex = 0;
  private show: Boolean = false;
  private showVideo: any = {
    url: "",
    image: "",
    title: ""
  }
  private videoPlayer: Node | null = null

  created() {
    this.showVideo.url = this.data.chapterTypeVOS[0].ctcSchoolChapterVOS[0].address;
  }

  beforeDestroy() {
    window.document.body.removeChild(this.videoPlayer as Node)
  }
  
  mounted() {
    this.videoPlayer = document.getElementById('videoPlayer') as Node
    window.document.body.appendChild(this.videoPlayer)
  }

  // 格式化时间
  private formatt(second: number): string {
    let arr: string[] = []
    if (second) {
      arr.push(('0' + (second % 60)).slice(-2) + '秒');
      arr.push(('0' + (Math.floor(second / 60) % 60)).slice(-2) + '分');
      arr.push(Math.floor(second / 60 / 60) + '小时');
      arr.reverse()
    }
    return arr.filter((e: string) => /[1-9]+/.test(e)).join('') || '0'
  }
  
  // 预览图片
  private viewImgWin(src: Array<string>, idx: number) {
    this.imgUrl = src;
    this.imgView = true;
    this.currIndex = idx;
  }
}
</script>

<style scoped lang="scss">
.tabs {
  .item {
    padding: 10px 0;
    line-height: 25px;
  }
  .item-name {
    padding-right: 20px;
    text-align: right;
    font-weight: 600;
    color: $font01;
    &.right {
      text-align: left;
    }
  }
  .card {
    margin-bottom: 20px;
    .play {
      cursor: pointer;
    }
  }
  .img {
    width: 300px;
    box-shadow: 0 2px 10px 0px #eee;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
}
</style>