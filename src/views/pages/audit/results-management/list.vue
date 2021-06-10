<template>
  <div class="content">
    <Tabs v-model="tabIndex" class="tab-warp" :animated="false" @on-click="setState">
      <Tab-pane label="全部" class="tab-pane"></Tab-pane>
      <Tab-pane :label="waitNum > 0 ? label : '待审核'"></Tab-pane>
      <Tab-pane label="不通过" class="tab-pane"></Tab-pane>
    </Tabs>
    <Form ref="formInline" :model="params" :rules="ruleValidate" :label-width="70" inline
      class="form">
      <FormItem label="活动名称" prop="keyword">
        <Input type="text" placeholder="请输入关键字" v-model="params.keyword" style="width: 350px"
          @on-enter="search()" />
      </FormItem>
      <FormItem label="活动分类" prop="activityClassify">
        <Select style="width: 350px" v-model="params.activityClassify" @on-change="search()">
          <Option value="-1">全部</Option>
          <Option :value="type.id" v-for="type in activityClassifys" :key="type.id">
            {{ type.labelName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="提交时间" prop="submitStart">
        <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择起始日期、时间"
          :value="[params.submitStart, params.submitEnd]"
          @on-change="t => { params.submitStart = t[0];params.submitEnd = t[1];search() }"
          style="width: 350px">
        </DatePicker>
        <Button type="primary" style="margin-left: 20px;" @click="search()">搜索</Button>
      </FormItem>
    </Form>

    <BaseTable :configure="tableConfig" @getList="search">
      <Table border :columns="data.header" :data="data.list" :loading="loading">
        <template slot-scope="{ row }" slot="info">
          <div class="story">
            <router-link :to="{
                path: '/audit-res-detail', 
               query: { id: row.activityId, rId: row.resultId, manageId: row.auditManageId }
              }" class="title">
              <span v-if="row.classifyName">【{{ row.classifyName }}】</span>{{ row.name }}
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
                    :key="imgItem"
                    @click="viewImage(row.images.split(','), row.name, index)">
                    <img :src="imgItem" class="cloud-img" alt />
                    <p v-if="index === row.images.split(',').length - 1 || index === 10 - row.videos.length - 1"
                      class="res">共{{row.images.split(',').length}}张</p>
                  </li>
                </template>
              </template>
            </ul>
            <p class="remark" v-if="row.auditResult">审核备注：{{ row.auditResult }}</p>
          </div>
        </template>
        <template slot-scope="{ row }" slot="status">
          <span>{{getStatusTxt[row.auditStatus]}}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <router-link v-if="row.auditStatus === 4" :to="{
              path: '/audit-activity-result-form',
              query: { id: row.activityId, rId: row.resultId, audit: true, manageId: row.auditManageId }
            }" class="theme-blue action-btn">审核</router-link>
          <a href="javascript:;" class="theme-blue action-btn" @click="deleteRow([row])" v-if="[7,8,9].includes(row.auditStatus)">删除</a>
        </template>
      </Table>
    </BaseTable>

    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle">
    </PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import VideoPlayer from "@components/video-play/video-play.vue";
import { PreviewPics } from "@components/index";
import { AppModule } from "@store/modules/app";
import { getStatusTxt } from "@util/comm";
import { getTagsSelect } from "@service/common";
import { getWaitActivityResultAuditList } from "@service/activity";
import { delActiveAudit } from "@service/audit";

@Component({
  components: {
    BaseTable,
    VideoPlayer,
    PreviewPics
  }
})
export default class ComponentName extends Vue {
  private tabIndex: any = 0
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
    keyword: "",
    status: "",
    activityClassify: "-1",
  };
  private siteInfo: any = this.$store.state.app.siteInfo;
  private ruleValidate: any = {};
  created() {
    this.tabIndex = this.$route.query.tabIndex || 0
    this.params.status = ['',4,79][this.tabIndex]
    this.search();
    this.getTagsSelect();
    this.getWaitNum();
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

  //删除行
  deleteRow(rows: any[]) {
    if (rows.length) {
      if (rows.some(d => ![7,8,9].includes(d.auditStatus))) {
        this.$Message.error("删除数据只能是回退、撤回、终止状态的数据");
      } else {
        let config: any = {
          title: "操作提示",
          content: `确认要删除所选数据吗？`,
          okText: "确认删除",
          cancelText: "取消",
          onOk: () => {
            delActiveAudit({
              ids: rows.map(row => row.auditManageId).toString()
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

  private waitNum: number = 0;
  private label(h: any) {
    return h("div", [
      h("span", "待审核"),
      h("Badge", {
        props: {
          count: this.waitNum
        }
      })
    ]);
  }
  private getWaitNum(): void {
    getWaitActivityResultAuditList({ status: 4 }).then((res: any) => {
      if (res.code === 0) {
        this.waitNum = res.page.total;
      }
    });
  }
  // tab
  private setState(index: Number) {
    switch (index) {
      case 0:
        this.params.status = "";
        break;
      case 1:
        this.params.status = 4;
        break;
      case 2:
        this.params.status = 79;
        break;
    }
    this.search();
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
  private data: any = {
    header: [
      {
        title: "成果信息",
        slot: "info",
        width: 600,
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

  private search(page?: any) {
    this.loading = true;
    if (page) {
      Object.assign(this.params, page);
    } else {
      this.params.currPage = 1;
    }
    let params = {...this.params}
    if (params.activityClassify === '-1') params.activityClassify = '';
    getWaitActivityResultAuditList(params)
      .then((res: any) => {
        if (res.code === 0) {
          res.datas.forEach((d:any) => {
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
}
</script>

<style lang='scss' scoped>
.remark {
  margin-top: 5px;
  background: #f8f8f9;
}
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
