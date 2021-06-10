<template>
  <!-- 互动-意见反馈 -->
  <div class="review-audit">
    <div class="content">
      <div class="search">
        <Form :label-width="100" inline>
          <FormItem class="item" label="反馈关键字">
            <i-input
              class="w200"
              placeholder="反馈内容/反馈者/联系电话"
              v-model.trim="params.name"
              :maxlength="20"
            ></i-input>
          </FormItem>
          <FormItem class="item" label="反馈类型">
            <Select class="w200" v-model="params.type">
              <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem class="item" label="内容状态">
            <Select class="w200" v-model="params.replyStatus">
              <Option value>全部</Option>
              <Option value="0">未回复</Option>
              <Option value="1">已回复</Option>
            </Select>
          </FormItem>
          <FormItem class="item" label="反馈时间">
            <Date-picker
              class="w200"
              type="daterange"
              placement="bottom-end"
              placeholder="选择日期"
              @on-change="setTime"
            ></Date-picker>
            <Button class="ml20" type="primary" @click="search">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <baseTable :configure="tableConfig" @getList="getList">
        <ul class="tab-list">
          <li class="item header">
            <p class="comment-content items">反馈内容</p>
            <p class="items time">反馈者</p>
            <p class="items time">联系电话</p>
            <p class="items status">反馈类型</p>
            <p class="items time">反馈时间</p>
            <p class="items change">操作</p>
          </li>
          <li class="item" v-for="item in tableData.bodyList" :key="item.id" :loading="loading">
            <div class="item-box">
              <div class="comment-content items">
                <p class="summary" :title="item.content">{{ item.content }}</p>
                <div class="clearfix">
                  <!-- 图片证据 -->
                  <div class="img-list fl" v-if="item.image">
                    <p class="img" v-for="(items, idx) in item.image.split(',')" :key="items">
                      <img
                        :src="items"
                        alt
                        class="daq-img"
                        @click.stop="viewImage(item.image.split(','), idx)"
                      />
                    </p>
                  </div>
                  <!-- 视频证据 -->
                  <div v-if="item.video">
                    <div
                      class="daq-no-photo view-images-box fl"
                      v-for="(url,videoInd) in item.video.split(',')"
                      :key="videoInd"
                      @click="openVideo(url, item.evidenceVideoCover && item.evidenceVideoCover[videoInd])"
                    >
                      <span class="cover"></span>
                      <img
                        :src="item.evidenceVideoCover[videoInd]"
                        alt
                        v-if="item.evidenceVideoCover"
                        class="daq-img"
                      />
                    </div>
                  </div>
                </div>
                <p
                  style="color:#999;font-size:12px;padding-top:4px;"
                  v-if="item.image || item.video"
                >
                  共
                  <span v-if="item.image">{{item.image.split(',').length}}张图片</span>
                  <span v-if="item.image && item.video">,</span>
                  <span v-if="item.video">{{item.video.split(',').length}}个视频</span>
                </p>
              </div>
              <!-- 反馈者 -->
              <p class="time items">{{ item.nickName }}</p>
              <!-- 联系电话 -->
              <p class="time items">{{ item.phone }}</p>
              <!-- 反馈类型 -->
              <p class="status items">
                <span v-if="item.type === 'EXPERIENCE'">体验问题</span>
                <span v-if="item.type === 'FUNCTION'">功能建议</span>
                <span v-if="item.type === 'SERVICE'">服务建议</span>
                <span v-if="item.type === 'OTHER'">其他</span>
              </p>
              <!-- 反馈时间 -->
              <p class="time items">{{ item.createTime }}</p>
              <!-- 操作 -->
              <p class="change items">
                <router-link
                  :to="{ path: '/feedback-detail', query: { id: item.id } }"
                  class="theme-blue action-btn"
                >查看</router-link>
                <router-link
                  class="theme-blue action-btn ml10"
                  :to="{
                    path: '/feedback-detail',
                    query: { id: item.id, type: 'reply' }
                  }"
                  v-if="isSite && !item.replyStatus"
                >回复</router-link>
              </p>
            </div>
            <p class="reply" v-if="item.replyContent">
              <span>回复：</span>
              {{ item.replyContent }}
            </p>
          </li>
          <li v-if="!tableData.bodyList.length" class="no-data">暂无数据</li>
        </ul>
      </baseTable>
    </div>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
    <!-- 视频播放 -->
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import baseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import { PreviewPics } from "@components/index";
import { FEEDBACK_TYPES, DEAL_STATUS } from "@constant/index";
import { feedBackList } from "@service/content";
interface videoType {
  url: String;
  image: String;
  title: String;
}
@Component({
  components: {
    VideoPlayer,
    baseTable,
    PreviewPics
  }
})
export default class Complaint extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //登录端判断
  private isSite: boolean = this.$store.state.app.userInfo.dataType === "SITE";
  private loading: Boolean = true; // 数据是否加载中
  private type: any = FEEDBACK_TYPES; // 投诉类型
  // 接口请求params
  private params: any = {
    type: "", // 反馈类型
    replyStatus: "", // 内容状态
    name: "", // 关键字
    startDate: "", // 开始时间
    endDate: "" // 结束时间
  };
  // 时间
  private setTime(e: any) {
    this.params.startDate = e[0];
    this.params.endDate = e[1];
  }
  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private currIndex = 0;
  private viewImage(url: Array<string>, idx: number) {
    this.imgUrl = url;
    this.visible = true;
    this.currIndex = idx;
  }
  /* E 查看大图 */

  /* S 列表数据 */
  //分页
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: "right"
  };
  private tableData: any = {
    bodyList: []
  };
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.params, page);
    feedBackList(this.params).then(data => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = data.datas as [];
      this.loading = false;
    });
  }
  /* E 列表数据 */

  /* S 搜索 */
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  /* E 搜索 */

  /* S 视频播放 */
  private show: Boolean = false;
  private showVideo: videoType = {
    url: "",
    image: "",
    title: ""
  };
  private openVideo(url: string, image: string) {
    this.showVideo.url = url;
    this.showVideo.image = image;
    this.showVideo.title = "视频";
    this.show = true;
  }
  /* E 视频播放 */

  mounted() {
    this.getList();
  }
}
</script>

<style lang='scss' scoped>
.tab-list {
  width: 100%;
  .item {
    margin-top: 15px;
    padding: 14px 0 20px;
    font-size: 0;
    border: 1px solid #e2e2e2;
    .star-box {
      margin-top: 35%;
    }
    .stars {
      font-size: 22px;
      color: #e3e2e5;
      &.active {
        color: #feb133;
      }
    }
    .reply {
      margin: 20px 10px;
      padding: 8px 10px;
      font-size: 12px;
      line-height: 18px;
      color: #333;
      background: #f7f7f7;
      word-break: break-all;
      span {
        color: $theme;
      }
    }
    .summary {
      margin-top: 10px;
      font-size: 12px;
      line-height: 18px;
      color: #333;
      @include ellipsisLn(5);
      span {
        display: inline-block;
        height: 16px;
        padding: 0 4px;
        margin-right: 5px;
        color: #fff;
        line-height: 16px;
        font-size: 10px;
        background: #feb133;
        vertical-align: top;
        border-radius: 4px;
      }
    }
    .img-list {
      margin-top: 5px;
      font-size: 0;
      .img {
        display: inline-block;
        width: 50px;
        height: 50px;
        margin: 8px 8px 0 0;
        cursor: pointer;
      }
    }
    .item-box {
      display: flex;
      align-items: center;
      font-size: 0;
      .items {
        font-size: 12px;
        color: #333;
        &:first-child {
          border: none;
        }
      }
    }
    .title-box {
      flex: 1;
      margin-left: 5%;
      padding-bottom: 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e2e2e2;
      .img-cover {
        width: 66px;
        height: 66px;
        margin-right: 15px;
        overflow: hidden;
        vertical-align: middle;
      }
      .title {
        flex: 1;
        color: $theme;
        font-size: 12px;
        line-height: 24px;
        overflow: hidden;
        &:hover {
          color: $theme-hover;
        }
      }
    }

    .items {
      display: inline-block;
      vertical-align: top;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
    }
    .comment-content {
      width: 30%;
      margin-left: 10px;
      .view-images-box {
        width: 50px;
        height: 50px;
        margin: 13px 8px 0 0;
        cursor: pointer;
        .cover {
          background-size: 50% 50%;
          display: block !important;
        }
      }
    }
    .change {
      text-align: center;
      a {
        color: $theme;
        font-size: 12px;
        &:hover {
          color: $theme-hover;
        }
      }
    }
    .status,
    .change {
      width: 10%;
      text-align: center;
    }
    .time {
      width: 15%;
      text-align: center;
      font-size: 12px;
      color: #333;
      white-space: normal;
      word-break: break-all;
    }
    &.header {
      padding: 14px 0;
      align-items: center;
      background: #f2f2f2;
      border: none;
      .items {
        line-height: 18px;
        font-size: 12px;
        color: #333;
        border: none;
      }
    }
  }
}
.w200 {
  min-width: 200px;
}
.review-audit {
  background: $grayDark;
  .content {
    padding: 15px;
    background: #fff;
    min-height: calc(100vh - 142px);
  }
  .search {
    padding: 20px 0 0;
    background: #f8fafe;
  }
}
.tag-list {
  margin-top: 12px;
  font-size: 0;
  .tags {
    padding: 0 12px;
    display: inline-block;
    margin: 8px 8px 0 0;
    font-size: 12px;
    color: #5ac858;
    height: 20px;
    line-height: 20px;
    background: rgba(90, 200, 88, 0.15);
  }
}
.no-data {
  height: 48px;
  line-height: 48px;
  color: #999;
  text-align: center;
  border: 1px solid #e2e2e2;
  border-top: 0;
}
</style>
