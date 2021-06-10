<template>
  <div class="container">
    <!-- 互动-意见反馈-详情 -->
    <div class="tips-panel clearfix">
      <span class="fl title">反馈人信息</span>
    </div>
    <div class="list-panel">
      <Row class="item">
        <i-col span="2" class="item-name">姓名</i-col>
        <i-col span="22" class="item-content">
          {{ detail.nickName }}
          <span v-if="detail.name">( 真实姓名：{{ detail.name }} )</span>
        </i-col>
      </Row>

      <Row class="item" v-if="detail.phone">
        <i-col span="2" class="item-name">手机号</i-col>
        <i-col span="22" class="item-content">{{ detail.phone }}</i-col>
      </Row>
      <Row class="item" v-if="detail.sex">
        <i-col span="2" class="item-name">性别</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex == 0">保密</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex == 1">男</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex == 2">女</i-col>
      </Row>
      <div class="tips-panel clearfix">
        <span class="fl title">反馈信息</span>
      </div>
      <Row class="item" v-if="detail.type">
        <i-col span="2" class="item-name">反馈类型</i-col>
        <i-col span="22" class="item-content" v-if="detail.type === 'EXPERIENCE'">体验问题</i-col>
        <i-col span="22" class="item-content" v-if="detail.type === 'FUNCTION'">功能建议</i-col>
        <i-col span="22" class="item-content" v-if="detail.type === 'SERVICE'">服务建议</i-col>
        <i-col span="22" class="item-content" v-if="detail.type === 'OTHER'">其他</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">反馈内容</i-col>
        <i-col span="22" class="item-content">{{ detail.content }}</i-col>
      </Row>
      <Row class="item" v-if="detail.image || detail.video">
        <i-col span="2" class="item-name">反馈素材</i-col>
        <i-col span="22" class="item-content img-list">
          <!-- 图片证据 -->
          <div class="img-list fl" v-if="detail.image">
            <p class="img" v-for="(items, picIndex) in detail.image.split(',')" :key="items">
              <img
                :src="items"
                alt
                class="daq-img"
                @click.stop="viewImage(detail.image.split(','), picIndex)"
              />
            </p>
          </div>
          <!-- 视频证据 -->
          <div class="img-list fl" v-if="detail.video">
            <p
              class="img daq-no-photo view-images-box"
              @click="openVideo(url)"
              v-for="url in detail.video.split(',')"
              :key="url"
            >
              <span class="cover"></span>
              <img :src="detail.coverImage" alt v-if="detail.coverImage" class="daq-img" />
            </p>
          </div>
        </i-col>
      </Row>
      <div class="tips-panel clearfix" v-if="detail.replyContent">
        <span class="fl title">官方回复</span>
      </div>
      <Row class="item" v-if="detail.replyContent">
        <i-col span="2" class="item-name">回复内容</i-col>
        <i-col span="22" class="item-content">
          <div style="word-break:break-all;">{{ detail.replyContent }}</div>
          <p class="time">
            {{ detail.replyTime }}由【{{ detail.replyUserName }}】【{{
            detail.replyUserPhone
            }}】回复
          </p>
        </i-col>
      </Row>
    </div>
    <Row class="item reply" v-if="!detail.replyContent">
      <i-col span="2" class="item-name">回复</i-col>
      <i-col span="22" class="item-content">
        <Input
          type="textarea"
          :rows="4"
          placeholder="回复内容必填"
          :maxlength="500"
          v-model="params.content"
        />
      </i-col>
    </Row>
    <div class="btn-group" v-if="detail.replyContent">
      <Button @click="goback">返回</Button>
    </div>
    <div class="btn-group reply-btn" v-if="!detail.replyContent">
      <Button type="primary" @click="submit">回复</Button>
      <Button @click="goback" class="ml10">取消</Button>
    </div>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="picIndex"></PreviewPics>
    <!-- 视频播放 -->
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import { PreviewPics } from "@components/index";
import { feedBackView, feedBackReply } from "@service/content";
interface videoType {
  url: String;
  image: String;
  title: String;
}
@Component({
  components: {
    VideoPlayer,
    PreviewPics
  }
})
export default class Complaint extends Vue {
  private loading: Boolean = true; // 数据是否加载中
  mounted() {
    this.getDetail();
  }
  /* S 获取详情 */
  private detail: Object = {};
  private auditStatus: string = ""; // 处理状态
  private getDetail() {
    feedBackView({
      id: this.$route.query.id
    }).then(data => {
      if ((data.data as any).recordsLogs) {
        (data.data as any).recordsLogs.forEach((data: any) => {
          data.auditStatus === 5
            ? (this.auditStatus = "受理")
            : (this.auditStatus = "处理");
        });
      }
      this.detail = data.data;
    });
  }
  /* E 获取详情 */

  /* S 视频播放 */
  private show: Boolean = false;
  private showVideo: videoType = {
    url: "",
    image: "",
    title: ""
  };
  private openVideo(url: string) {
    this.showVideo.url = url;
    this.showVideo.image = (this.detail as any).coverImage;
    this.showVideo.title = "视频";
    this.show = true;
  }
  /* E 视频播放 */
  /* S 查看大图 */
  private imgUrl: Array<string> = [];
  private visible: Boolean = false; // 图片查看
  private picIndex = 0;
  private viewImage(url: Array<string>, index: number) {
    this.imgUrl = url;
    this.visible = true;
    this.picIndex = index;
  }
  /* E 查看大图 */
  /*S 回复 */
  private spinShow = false;
  private params = {
    feedBackId: "",
    content: ""
  };
  private submit() {
    (this.params as any).feedBackId = this.$route.query.id;
    if (!this.params.content) {
      this.$Message.error("请填写回复内容!");
      return;
    }
    this.spinShow = true;
    feedBackReply(this.params)
      .then((res: any) => {
        if (res.code === 0) {
          this.spinShow = false;
          this.params.content = "";
          this.getDetail();
        }
      })
      .catch(err => {
        this.spinShow = false;
      });
  }
  /*E 回复 */
  // 返回
  private goback() {
    this.$router.go(-1);
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 10px 15px;

  .tips-panel {
    margin-top: 10px;
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
        content: "";
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
    .red {
      vertical-align: middle;
    }
    .item-btn {
      button {
        margin: 10px 0 0 30px;
        &:hover {
          cursor: text;
        }
      }
      .satisf-btn {
        box-shadow: none;
        &:hover {
          border: 1px solid #2db7f5;
          color: #2db7f5;
        }
      }
      .satisfied-btn {
        box-shadow: none;
        &:hover {
          border: 1px solid #dcdee2;
          color: #515a6e;
        }
      }
    }
  }
  .item {
    padding: 10px 0;
    line-height: 25px;
  }
  .item-name {
    width: 90px;
    text-align: right;
    margin-right: 10px;
  }
  .reply {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    .item-content {
      width: 40%;
    }
  }
  .item-content {
    width: 80%;
    color: $font05;
    word-break: break-all;
    .img {
      display: inline-block;
      width: 120px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      margin-right: 8px;
    }
    .time {
      color: #ccc;
    }
  }
  .audit-record {
    .record-panel {
      padding: 20px 20px 0 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e2e2e2;
      .content {
        color: $font03;
      }
    }
  }
  .btn-group {
    padding: 20px 30px;
    text-align: left;
    &.reply-btn {
      margin-left: 80px;
    }
  }
}
//标题
.title-tool {
  position: relative;
  width: 100%;
  line-height: 16px;
  font-size: 14px;
  font-weight: bold;
  padding: 0 0 10px 10px;
  margin: 0 20px 20px 0;
  border-bottom: 1px solid #dee3ed;
  i {
    position: absolute;
    top: 0;
    left: -8px;
    font-size: 20px;
    color: $theme;
  }
}
</style>
