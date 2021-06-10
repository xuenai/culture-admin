<template>
  <div class="perform-wrap">
    <!--活动成果详情-->
    <div class="tips-panel clearfix">
      <span class="fl title">活动成果反馈</span>
    </div>
    <div class="list-panel">
      <Row class="item">
        <i-col span="2" class="item-name">实际参加人数</i-col>
        <i-col span="22" class="item-content">{{ data.joinPeople }}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">成果介绍</i-col>
        <i-col span="22" class="item-content">{{ data.summary }}</i-col>
      </Row>
      <Row class="item" v-if="data.images">
        <i-col span="2" class="item-name">活动图片</i-col>
        <i-col span="22" class="item-content img-list">
          <p
            class="img daq-no-photo"
            v-for="(item, index) in data.images.split(',')"
            :key="index"
            @click.stop="viewImage(data.images.split(','), index)"
          >
            <img
              :src="item"
              alt
            />
          </p>
        </i-col>
      </Row>
      <Row class="item" v-if="data.videos">
        <i-col span="2" class="item-name">活动视频</i-col>
        <i-col span="22" class="item-content img-list">
          <p v-for="(item,i) in data.videos.split(',')" :key="item" class="img daq-no-photo view-images-box" @click="() => {
            show = true; showVideo.url=item}">
            <span class="cover"></span>
            <img
              :src="data.videoCover.split(',')[i]"
              alt
              v-if="data.videoCover"
              class="daq-img"
            />
          </p>
        </i-col>
      </Row>
    </div>

    <VideoPlayer
      :showVideo="showVideo"
      :show="show"
      v-if="showVideo.url"
    ></VideoPlayer>
    <PreviewPics
      v-model="visible"
      :imgs="imgUrl"
      :currIndex="currIndex"
    ></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { resultView } from '@service/activity'
import { PreviewPics } from '@components/index'
import VideoPlayer from "@components/video-play/video-play.vue";

interface videoType {
  url: String
  image: String
  title: String
}
@Component({
  components: {
    PreviewPics,
    VideoPlayer,
  }
})
export default class auditPerform extends Vue {
  @Prop() rId!: string // 成果id
  /*S视频*/
  private show: Boolean = false
  private showVideo: videoType = {
    url: '',
    image: '',
    title: ''
  }

  private data: any = {}
  getDesc() {
    resultView({ id: this.rId }).then((res: any) => {
      if (res.code === 0) {
        this.data = res.data;
      }
    })
  }
  //返回
  goBack() {
    this.$router.go(-1)
  }
  mounted() {
    this.getDesc()
  }
  
  /* S 查看大图 */
  private visible: Boolean = false
  private imgUrl: Array<string> = []
  private currIndex = 0
  private viewImage(url: Array<string>, idx: number) {
    this.imgUrl = url
    this.visible = true
    this.currIndex = idx
  }
  /* E 查看大图 */
}
</script>

<style lang="scss" scoped>
.perform-wrap {
  padding-bottom: 30px;
  .control {
    width: 300px;
  }
  .submit-panel{
    padding-left:30px;
  }
}
.tips-panel {
  background-color: $grayLight;
  padding: 20px;
  .title {
    position: relative;
    padding-left: 10px;
    color: $font01;
    font-weight: 600;
    font-size: 16px;
    &:after {
      position: absolute;
      left: 0;
      top: 4px;
      content: '';
      width: 3px;
      height: 16px;
      border-radius: 1.5px;
      background-color: $theme;
    }
  }
  .tag-content {
    margin-left: 30px;
    color: $font02;
  }
}
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
