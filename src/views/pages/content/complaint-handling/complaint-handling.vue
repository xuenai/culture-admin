<template>
<!-- 内容-投诉管理 -->
  <div class="review-audit">
    <div class="content">
      <div class="search">
        <Form :label-width="100" inline>
          <FormItem class="item" label="投诉关键字">
            <i-input class="w200" placeholder="投诉内容/投诉者/投诉者手机号" v-model="params.name" :maxlength="20"></i-input>
          </FormItem>
          <FormItem class="item" label="投诉类型">
            <Select class="w200" v-model="params.complaintsType">
              <Option v-for="item in complaintsType" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem class="item" label="投诉时间">
            <Date-picker class="w200" type="daterange" placement="bottom-end" placeholder="选择日期" @on-change="setTime"></Date-picker>
            <Button class="ml20" type="primary" @click="search">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <baseTable :configure="tableConfig" @getList="getList">
        <ul class="tab-list">
          <li class="item header">
            <p class="comment-content items">投诉内容</p>
            <p class="items time">投诉者</p>
            <p class="items time">投诉者手机号</p>
            <p class="items status">投诉类型</p>
            <p class="time items">被投诉者</p>
            <p class="items time">事件发生时间</p>
            <p class="items time">投诉时间</p>
            <p class="items status">处理状态</p>
            <p class="items change">操作</p>
          </li>
          <li
          class="item"
          v-for="(item) in tableData.bodyList"
          :key="item.id"
          :loading="loading"
          >
            <div class="item-box">
              <div class="comment-content items">
                <p class="summary">{{item.complaintsReasons}}</p>
                <div class="clearfix">
                  <!-- 图片证据 -->
                  <div class="img-list fl" v-if="item.evidenceImages && item.evidenceImages.length>=1">
                    <p class="img" v-for="(items, idx) in item.evidenceImages" :key="items" >
                      <img :src="items" alt class="daq-img" @click.stop="viewImage(item.evidenceImages, idx)">
                    </p>
                  </div>
                  <!-- 视频证据 -->
                  <div v-if="item.evidenceVideo && item.evidenceVideo.length>=1"></div>
                  <div class="daq-no-photo view-images-box fl" v-for="(col,videoInd) in item.evidenceVideo" :key='videoInd' @click="openVideo(item)">
                    <span class="cover"></span>
                    <img :src="item.evidenceVideoCover[videoInd]" alt v-if="item.evidenceVideoCover" class="daq-img">
                  </div>
                </div>
              </div>
              <!-- 投诉者 -->
              <p class="time items">{{item.name}}</p>
              <!-- 投诉手机号 -->
              <p class="time items">{{item.phone}}</p>
              <!-- 投诉类型 -->
              <p class="status items">
                <span v-if="item.complaintsType === 'personnel'">人员</span>
                <span v-if="item.complaintsType === 'service'">服务</span>
                <span v-if="item.complaintsType === 'environment'">环境</span>
                </p>
              <!-- 被投诉者 -->
              <p class="time items">{{item.respondent}}</p>
              <!-- 事件发生事件 -->
              <p class="time items">{{item.incidentTime}}</p>
              <!-- 投诉时间 -->
              <p class="time items">{{item.createTime}}</p>
              <!-- 处理状态 -->
              <p class="status items">
                <span v-if="item.status === 4">待处理</span>
                <span v-if="item.status === 5">已受理</span>
                <span v-if="item.status === 6">已处理</span>
              </p>
              <!-- 操作 -->
              <p class="change items">
                <router-link
                :to="{path: '/con-complaint-detail', query: {id: item.id}}"
                class="theme-blue action-btn"
                v-if="operates.includes('list_detail')"
                >查看</router-link>
              </p>
            </div>
            <p class="reply" v-if="item.handleResult">
              <span>处理意见：</span>
              {{item.handleResult}}
            </p>
          </li>
          <li v-if="!tableData.bodyList.length" class="no-data">暂无数据</li>
        </ul>
      </baseTable>
    </div>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" ></PreviewPics>
    <!-- 视频播放 -->
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import baseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import {PreviewPics} from '@components/index'
import {
  COMPLAINTS_TYPES,
  DEAL_STATUS
  } from '@constant/index';
import {  getComplaintsList } from "@service/content";
interface videoType {
  url: String;
  image: String;
  title: String;
};
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
  private loading: Boolean = true; // 数据是否加载中
  private complaintsType: any = COMPLAINTS_TYPES; // 投诉类型
  // 接口请求params
  private params: any = {
    status: '6', // 处理状态
    complaintsType: '', // 投诉类型
    name: '', // 关键字
    startDate: '', // 开始时间
    endDate: '' // 结束时间
  }
  // 时间
  private setTime(e: any) {
    this.params.startDate = e[0];
    this.params.endDate = e[1];
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
    getComplaintsList(this.params).then(data => {
      console.log(data)
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
    image: '',
    title: "",
  };
  private openVideo(item: any) {
    this.showVideo.url = item.evidenceVideo[0];
    this.showVideo.image = item.evidenceVideoCover[0];
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
      span {
        color: $theme;
      }
    }
    .summary {
      margin-top: 10px;
      font-size: 12px;
      line-height: 18px;
      color: #333;
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
        &:last-child {
          margin-right: 0;
        }
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
      .view-images-box{
        width: 50px;
        height: 50px;
        margin: 13px 0 0 8px;
        cursor: pointer;
        .cover{
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
      width: 5%;
      text-align: center;
    }
    .time {
      width: 10%;
      text-align: center;
      font-size: 12px;
      color: #333;
      white-space:normal;
      word-break:break-all;
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
