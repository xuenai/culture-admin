<template>
  <div v-if="detail" class="pd20">
    <auditHead :data="headData" v-if="headData.status"></auditHead>
    <div class="list-panel">
      <Row class="item" v-if="detail.channelName">
        <i-col span="2" class="item-name">栏目</i-col>
        <i-col span="22" class="item-content">{{detail.channelName}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">标题</i-col>
        <i-col span="22" class="item-content">{{detail.title}}</i-col>
      </Row>
      <Row class="item" v-if="detail.author">
        <i-col span="2" class="item-name">作者</i-col>
        <i-col span="22" class="item-content">{{detail.author}}</i-col>
      </Row>
      <Row class="item" v-if="detail.source">
        <i-col span="2" class="item-name">来源\来源地址</i-col>
        <i-col span="22" class="item-content">{{detail.source}}</i-col>
      </Row>
      <Row class="item" v-if="detail.summary">
        <i-col span="2" class="item-name">摘要</i-col>
        <i-col span="22" class="item-content">{{detail.summary}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">创建者</i-col>
        <i-col span="22" class="item-content">{{detail.createCompanyName}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">内容</i-col>
        <i-col span="22" class="item-content" v-html="detail.content"></i-col>
      </Row>
      <Row class="item" v-if="detail.tagName && detail.tagName.length">
        <i-col span="2" class="item-name">标签</i-col>
        <i-col span="22" class="item-content">
          <span class="choice-tag" v-for="item in detail.tagName" :key="item">{{item}}</span>
        </i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">发布时间</i-col>
        <i-col span="22" class="item-content">{{detail.publishTime}}</i-col>
      </Row>
      <Row class="item" v-if="detail.imageUrls && detail.imageUrls.length">
        <i-col span="2" class="item-name">图集</i-col>
        <i-col span="22" class="item-content img-list">
          <p class="img" v-for="(items,picInd) in detail.imageUrls" :key="picInd">
            <img :src="items" alt @click.stop="viewImage(detail.imageUrls,picInd)">
          </p>
        </i-col>
      </Row>
      <Row class="item" v-if="detail.video">
        <i-col span="2" class="item-name">视频</i-col>
        <i-col span="22" class="item-content img-list">
          <p class="img daq-no-photo view-images-box" @click="openVideo(detail)">
            <span class="cover"></span>
            <img :src="detail.videoCover" alt v-if="detail.images" class="daq-img">
          </p>
        </i-col>
      </Row>
      <Row class="item" v-if="detail.annex && detail.annex.length">
        <i-col span="2" class="item-name">附件</i-col>
        <i-col span="22" class="item-content img-list">
          <a :href="detail.annex" target="_blank">{{detail.annex}}</a>
        </i-col>
      </Row>
      <!-- <Row class="item" v-if="detail.showNum || detail.likeNum || detail.collectionNum">
        <i-col span="2" class="item-name">模拟数据</i-col>
        <i-col span="22" class="item-content simulate">
          <p v-if="detail.showNum">
            浏览量
            <Button class="count" disabled>{{detail.showNum}}</Button>
          </p>
          <p v-if="detail.likeNum">
            点赞量
            <Button class="count" disabled>{{detail.likeNum}}</Button>
          </p>
          <p v-if="detail.collectionNum">
            收藏量
            <Button class="count" disabled>{{detail.collectionNum}}</Button>
          </p>
        </i-col>
      </Row> -->
    </div>
    <!--审核记录-->
    <div
      class="audit-record pd20"
      v-if="detail.auditRecordsVo && detail.auditRecordsVo.recordsLog &&  detail.auditRecordsVo.recordsLog.length"
    >
      <h3 class="title">审核记录</h3>
      <Timeline class="record-panel">
        <Timeline-item v-for="item in detail.auditRecordsVo.recordsLog" :key="item.createTime">
          <p class="time">{{item.createTime}}</p>
          <p class="content">
            由【{{item.name}}】【{{item.phone.substr(item.phone.length - 4, 4)}}】审核，审核结果：
            <span
              v-if="item.auditStatus === 1"
            >正常</span>
            <span v-if="item.auditStatus === 2">禁用</span>
            <span v-if="item.auditStatus === 3">草稿</span>
            <span v-if="item.auditStatus === 4">待审核</span>
            <span v-if="item.auditStatus === 5">审核中</span>
            <span v-if="item.auditStatus === 6">审核通过</span>
            <span v-if="item.auditStatus === 7 || item.auditStatus === 79">审核不通过</span>
            <span v-if="item.auditStatus === 8">已撤回</span>
            <span v-if="item.auditStatus === 9">终止</span>
            。审核备注：{{item.auditResult}}
          </p>
        </Timeline-item>
      </Timeline>
    </div>
    <Button class="w150" type="primary" @click="goHistory">返回</Button>
    <router-link
      :to="{path: '/con-add-content', query: {id :detail.id}}"
      v-if="detail.contentType === 'CONTENT' && detail.status === 6"
    >
      <Button class="w150 ml20 btn-cancel">修改</Button>
    </router-link>
    <router-link
      :to="{path: '/con-add-image', query: {id :detail.id}}"
      v-if="detail.contentType === 'IMAGE' && detail.status === 6"
    >
      <Button class="w150 ml20 btn-cancel">修改</Button>
    </router-link>
    <router-link
      :to="{path: '/con-add-video', query: {id :detail.id}}"
      v-if="detail.contentType === 'VIDEO' && detail.status === 6"
    >
      <Button class="w150 ml20 btn-cancel">修改</Button>
    </router-link>
    <router-link
      :to="{path: '/con-add-audio', query: {id :detail.id}}"
      v-if="detail.contentType === 'AUDIO' && detail.status === 6"
    >
      <Button class="w150 ml20 btn-cancel">修改</Button>
    </router-link>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" ></PreviewPics>
    <!-- 视频播放 -->
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import { getReportDesc } from "@service/content";
import VideoPlayer from "@components/video-play/video-play.vue";
import {PreviewPics} from '@components/index';
interface videoType {
  url: String;
  image: String;
  title: String;
}
@Component({
  components: { 
    auditHead,
    VideoPlayer,
    PreviewPics
    }
})
export default class commonList extends Vue {
  
  private headData: object = {
    remark: "",
    date: "",
    status: 0
  };
  private detail: Object = {};
  private goHistory() {
    this.$router.go(-1);
  }
  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private currIndex = 0
  private viewImage(url: Array<string>, idx: number) {
    this.imgUrl = url;
    this.visible = true;
    this.currIndex = idx
  }
  /* E 查看大图 */
  /* S 视频播放 */
  private show: Boolean = false;
  private showVideo: videoType = {
    url: "",
    image: '',
    title: "",
  };
  private openVideo(item: any) {
    this.showVideo.url = item.videoUrl;
    this.showVideo.image = item.videoCover;
    this.showVideo.title = "视频";
    this.show = true;
  }
  /* E 视频播放 */
  mounted() {
    this.getDesc();
  }
  private getDesc() {
    getReportDesc({
      id: this.$route.query.id
    }).then(data => {
      this.detail = data.data;
      let _data = data.data;
      this.showVideo.url = _data.video as string;
      this.showVideo.title = _data.name as string;
      this.showVideo.image = _data.images ? _data.images.split(",")[0] : "";
      this.headData = {
        remark: _data.auditRecordsVo.currentAuditResult,
        date: _data.auditRecordsVo.dateTime,
        status: _data.auditRecordsVo.currentAuditStatus
      };
    });
  }
}
</script>

<style scoped lang="scss">
.audit-record {
  border-top: 1px solid $borderLight;
  margin: 15px 0;
  .record-panel {
    padding: 20px 20px;
    .content {
      color: $font03;
    }
  }
}
.list-panel {
  margin-top: 10px;
  .item {
    padding: 10px 0;
    line-height: 25px;
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
