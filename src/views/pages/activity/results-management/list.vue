<template>
  <div class="content">
    <Form :model="params" :rules="ruleValidate" :label-width="70" inline class="form">
      <div>
        <FormItem label="关键字" prop="keyword">
          <Input type="text" placeholder="请输入关键字" v-model="params.keyword" style="width: 350px"
            @on-enter="search" />
        </FormItem>
        <FormItem label="活动分类" prop="activityClassify">
          <Select style="width: 350px" v-model="params.activityClassify" @on-change="search">
            <Option value="-1">全部</Option>
            <Option :value="type.id" v-for="type in activityClassifys" :key="type.id">
              {{ type.labelName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="地区">
          <VDistpicker @onChange="data => { params.region = data.region; search() }"
            :disabledByLevel="true"></VDistpicker>
        </FormItem>
      </div>

      <div>
        <FormItem label="状态" prop="status">
          <Select style="width: 350px" v-model="params.status" @on-change="search">
            <Option value="-1">全部</Option>
            <Option value="1">正常</Option>
            <Option value="3">草稿</Option>
            <Option value="8">撤回</Option>
            <Option value="9">终止</Option>
          </Select>
        </FormItem>
        <FormItem label="提交时间" prop="submitStart">
          <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择起始日期、时间"
            :value="[params.submitStart, params.submitEnd]"
            @on-change="t => { params.submitStart = t[0];params.submitEnd = t[1];search() }"
            style="width: 350px">
          </DatePicker>
          <Button type="primary" style="margin-left: 20px;" @click="search">搜索</Button>
        </FormItem>
      </div>
    </Form>

    <BaseTable :configure="tableConfig" @getList="search">
      <Table border :columns="data.header" :data="data.list" :loading="loading"
        @on-selection-change="list => checkedBox = list ">
        <template slot-scope="{ row }" slot="info">
          <div class="story">
            <router-link :to="{
                path: '/res-detail',
               query: { id: row.activityId, rId: row.id, canModify: countModify(row) }
              }" class="title">
              <span
                v-if="row.activityClassifyName">【{{ row.activityClassifyName }}】</span>{{ row.activityName }}
            </router-link>
            <div class="mt5">实际参加人数：{{ row.joinPeople }}</div>
            <div class="mt10 line5" :title="row.summary" v-html="row.summary"></div>
            <ul class="img-list mt10">
              <!-- 媒体资源显示规则：优先展示视频，图片排后，多余的提示共多少张，容器最多展示10条媒体数据 -->
              <template v-if="row.videos">
                <li class="img daq-no-photo view-images-box" v-for="videoItem in row.videos"
                  :key="videoItem.url"
                  @click="() => { showVideo.url = videoItem.url; show = true }">
                  <img :src="videoItem.cover" class="cloud-img" alt />
                  <span class="cover"></span>
                </li>
              </template>
              <template v-if="row.images">
                <template v-for="(imgItem, index) in row.images.split(',')">
                  <li class="img daq-no-photo"
                    v-if="(!row.videos && index < 10) || (row.videos && index < (10 - row.videos.length))"
                    :key="imgItem" @click="viewImage(row.images.split(','), row.name, index)">
                    <img :src="imgItem" class="cloud-img" alt />
                    <p v-if="index === row.images.split(',').length - 1 || index === 10 - row.videos.length - 1"
                      class="res">共{{row.images.split(',').length}}张</p>
                  </li>
                </template>
              </template>
            </ul>
          </div>
        </template>
        <template slot-scope="{ row }" slot="status">
          <span>{{getStatusTxt[row.status]}}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <router-link :to="{
              path: '/res-detail',
              query: { id: row.activityId, rId: row.id, canModify: countModify(row) }
            }" class="theme-blue action-btn">详情
          </router-link>
          <a class="theme-blue action-btn" @click="setWithdraw(row)" v-if="row.status === 4">撤回
          </a>
          <a class="theme-blue action-btn" @click="submitCol([row])" v-if="row.status === 3">提交
          </a>
          <router-link class="theme-blue action-btn" v-if="countModify(row)" :to="{
              path: '/res-submit-md',
              query: { id: row.activityId,rId:row.id,type: 'result' }
            }">修改
          </router-link>
          <a class="theme-blue action-btn" @click="deleteRow([row])" 
              v-if="[3,8,9].includes(row.status) && row.ownFlag">删除
          </a>
        </template>
      </Table>
    </BaseTable>

    <div style="text-align:center">
      <Button type="primary" @click="deleteRow(checkedBox)">批量删除</Button>
      <Button style="margin-left:15px" type="primary" @click="submitCol(checkedBox)">批量提交</Button>
    </div>

    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle">
    </PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import VDistpicker from "@components/distPicker/distPicker.vue";
import BaseTable from "@components/baseTable/baseTable.vue";
import VideoPlayer from "@components/video-play/video-play.vue";
import { PreviewPics } from "@components/index";
import { AppModule } from "@store/modules/app";
import { getStatusTxt, getVideoCover } from "@util/comm";
import { getTagsSelect } from "@service/common";
import { resultList, resUpdateStatus, getWithdraw, resultSubmit } from "@service/activity";

@Component({
  components: {
    VDistpicker,
    BaseTable,
    VideoPlayer,
    PreviewPics
  }
})
export default class ComponentName extends Vue {
  // 视频参数
  private showVideo = <any>{
    url: "",
    image: "",
    title: ""
  };
  // 是否显示视频
  private show: Boolean = false;
  private params: any = {
    pageSize: 10,
    currPage: 1,
    submitStart: "",
    submitEnd: "",
    region: "",
    keyword: "",
    status: "-1",
    activityClassify: "-1"
  };
  private siteInfo: any = this.$store.state.app.siteInfo;
  private ruleValidate: any = {};

  created() {
    sessionStorage.setItem("activity-result-list-params", JSON.stringify(this.params));
  }
  mounted() {
    this.search();
    this.getTagsSelect();
  }
  beforeDestroy() {
    sessionStorage.setItem("activity-result-list-params", '');
  }

  private activityClassifys: any[] = [];
  private getTagsSelect(): void {
    getTagsSelect({
      resourceType: "CONTENT_TYPE_ACTIVITY",
      labelType: "ACTIVITY_CLASSIFY"
    }).then((res: any) => {
      if (res.code === 0) {
        this.activityClassifys = res.datas;
      }
    });
  }

  // 计算能否修改
  private countModify(row:any): boolean {
    return [3,8].includes(row.status) || ([7].includes(row.status) && row.ownFlag) || ([1,2].includes(row.status) && row.ownFlag)
  }

  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private loading: boolean = false;
  private getStatusTxt: Object = getStatusTxt as Object;
  // 选中数据
  private checkedBox: Array<any> = [];
  private data: any = {
    header: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "成果信息",
        slot: "info",
        width: 500,
        align: "left"
      },
      {
        title: "创建者",
        key: "createName",
        align: "center"
      },
      {
        title: "提交时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "状态",
        slot: "status",
        align: "center"
      },
      {
        title: "操作",
        slot: "action",
        align: "center"
      }
    ],
    list: []
  };

  @Watch("params", { deep: true, immediate: true })
  wParams(v: any) {
    sessionStorage.setItem("activity-result-list-params", JSON.stringify(v));
  }

  private search(page?: any) {
    setTimeout(() => {
      this.loading = true;
      let p = sessionStorage.getItem("activity-result-list-params") as string
      let params = p ? JSON.parse(p) : {pageSize: 10, currPage: 1};
      if (params.activityClassify === "-1") params.activityClassify = "";
      if (params.status === "-1") params.status = "";
      if (page && page.currPage) {
        Object.assign(params, page);
      } else {
        params.currPage = 1;
      }
      resultList(params)
        .then((res: any) => {
          if (res.code === 0) {
            res.datas.forEach((d: any) => {
              if (d.videos) {
                let covers = d.videoCover ? d.videoCover.split(",") : [];
                d.videos = d.videos
                  .split(",")
                  .map((url: string, i: number) => ({ url, cover: covers[i] }));
              }
            });
            this.tableConfig.page = res.page;
            this.data.list = res.datas;
          }
        })
        .finally(() => (this.loading = false));
    });
  }

  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private imgTitle: String = "";
  private currIndex = 0;
  private viewImage(url: any, name: String, index?: number) {
    // 判断url的类型 如果是数组 则直接赋值 如果不是数组 则先清空数组 再将url写到数组里面去
    if (Object.prototype.toString.call(url) === "[object Array]") {
      this.imgUrl = url;
    }
    if (Object.prototype.toString.call(url) === "[object String]") {
      this.imgUrl = [];
      this.imgUrl.push(url);
    }
    this.imgTitle = name;
    this.visible = true;
    this.currIndex = index || 0;
  }
  /* E 查看大图 */

  //撤回
  setWithdraw(item: any) {
    let config: any = {
      title: "操作提示",
      content: `确认要撤回？`,
      okText: "确认撤回",
      cancelText: "取消",
      onOk: () => {
        getWithdraw({
          activityId: item.id,
          resourceType: "CONTENT_TYPE_ACTIVITY_RESULT"
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("操作成功");
            this.search();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  //删除行
  deleteRow(rows: any[]) {
    if (rows.length) {
      if (rows.some(d => ![3,8,9].includes(d.status))) {
        this.$Message.error("删除数据只能是草稿、撤回、终止状态的数据");
      } else if (rows.some(d => !d.ownFlag)) {
        this.$Message.error("不能删除非自建数据");
      } else {
        let config: any = {
          title: "操作提示",
          content: `确认要删除所选数据吗？`,
          okText: "确认删除",
          cancelText: "取消",
          onOk: () => {
            resUpdateStatus({
              ids: rows.map(row => row.id).toString(),
              status: 0
            }).then((res: any) => {
              if (res.code === 0) {
                this.$Message.success("删除成功");
                this.search();
              }
            });
          }
        };
        this.$Modal.confirm(config);
      }
    } else {
      this.$Message.error("请选择你要删除的项");
    }
  }

  //提交||批量提交
  submitCol(rows: any[]) {
    if (rows.length) {
      if (rows.some(d => d.status !== 3)) {
        this.$Message.error("提交数据只能是草稿数据");
      } else {
        let config: any = {
          title: "操作提示",
          content: `确认要提交所选数据吗？`,
          okText: "确认提交",
          cancelText: "取消",
          onOk: () => {
            resultSubmit({
              manageIds: rows.map(row => row.manageId).toString()
            }).then((res: any) => {
              if (res.code === 0) {
                this.$Message.success("提交成功");
                this.search();
              }
            });
          }
        };
        this.$Modal.confirm(config);
      }
    } else {
      this.$Message.error("请选择你要提交的项");
    }
  }
}
</script>

<style lang='scss' scoped>
.res {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}
.view-images-box {
  .cover {
    display: block;
    background-size: 24px;
  }
}
.content {
  padding: 20px 15px;
  .story {
    padding: 8px 0;
    .img-list {
      @include clearfix;
      .img {
        position: relative;
        float: left;
        width: 50px;
        height: 50px;
        overflow: hidden;
        cursor: pointer;
        & + .img {
          margin-left: 5px;
        }
      }
    }
    .info {
      @include clearfix;
    }
    .address {
      float: left;
      background-color: $bg;
      padding: 2px 5px;
      border-radius: 4px;
      color: $font02;
    }
    .count-panel {
      float: left;
      margin-top: 2px;
      li {
        display: inline-block;
        margin-left: 10px;
        & + li {
          position: relative;
          padding-left: 8px;
          &:after {
            position: absolute;
            left: 0;
            top: 3px;
            content: "";
            height: 12px;
            width: 1px;
            background-color: $borderDark;
          }
        }
      }
    }
    .trip-panel {
      /*border:1px solid red;*/
      margin-bottom: 15px;
    }
    .trip-list {
      @include clearfix;
      .item {
        vertical-align: top;
        position: relative;
        display: inline-block;
        height: 1px;
        border-top: 1px solid $borderLight;
        min-width: 70px;
        max-width: 150px;
        margin: 30px 0;
        text-align: center;
        &:before {
          top: -5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid $borderLight;
        }
        &:first-of-type {
          &:before {
            position: absolute;
            content: "";
            left: -10px;
          }
        }
        &:last-of-type {
          &:before {
            position: absolute;
            content: "";
            right: -10px;
          }
        }
        &:after {
          position: absolute;
          left: 50%;
          top: 0;
          content: "";
          height: 10px;
          width: 1px;
          border-left: 1px dashed $borderLight;
        }
      }
      .day {
        position: absolute;
        width: 100%;
        text-align: center;
        top: -20px;
        left: 0;
      }
      .scenic-name {
        display: block;
        width: 100%;
        text-align: center;
        padding-top: 10px;
        @include ellipsis();
      }
    }
  }
  .switchBox {
    position: relative;
    .cover {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .form {
    background: $grayLight;
    padding: 15px 0 0;
    margin-bottom: 15px;
  }
  .hot {
    margin-top: 5px;
    & + p {
      margin-bottom: 5px;
    }
    span {
      color: $danger;
    }
  }
  .switchLabel {
    margin-right: 5px;
  }
  .control {
    color: $theme;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
