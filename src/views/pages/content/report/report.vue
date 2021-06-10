<!--
 * @Author: sunxiaoqian
 * @since: 2019-06-03 17:57:38
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-01 11:18:45
 -->
<template>
  <div class="wrap">
    <div class="search">
      <Form :label-width="80" inline>
        <FormItem class="item" label="标题：">
          <i-input placeholder="请输入标题" v-model="params.title"></i-input>
        </FormItem>
        <FormItem class="item" label="创建者：">
          <i-input placeholder="请输入创建者" v-model="params.createCompany"></i-input>
        </FormItem>
        <FormItem class="item" label="类型：">
          <Select style="width:150px" v-model="params.contentType">
            <Option value>全部</Option>
            <Option value="CONTENT">内容</Option>
            <Option value="IMAGE">图片</Option>
            <Option value="AUDIO">音频</Option>
            <Option value="VIDEO">视频</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="上报时间">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            @on-change="setTime"
          ></Date-picker>
        </FormItem>
        <FormItem class="item" label="状态：">
          <Select style="width:150px" v-model="params.auditStatus">
            <Option value>全部</Option>
            <Option value="4">待审核</Option>
            <Option value="79">不通过</Option>
            <Option value="6">通过</Option>
          </Select>
        </FormItem>
        <div class="mt10 submit">
          <Button type="primary" @click="getSearch">搜索</Button>
        </div>
      </Form>
    </div>
    <div>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          size="default"
          class="table"
          :loading="loading"
          @on-selection-change="setChecked"
        >
          <template slot-scope="{ row}" slot="title" class="clearfix">
            <router-link
              tag="a"
              :to="{path:'/con-report-desc', query:{id: row.id}}"
              href="javascript:;"
              class="theme-blue action-btn"
            >{{row.title}}</router-link>
            <i class="cloud-icon titleIcon" v-if="row.images">&#xe6f8;</i>
            <i class="cloud-icon titleIcon" v-if="row.video">&#xe6fa;</i>
            <i class="cloud-icon titleIcon" v-if="row.audio">&#xe6fb;</i>
          </template>
          <template slot-scope="{ row}" slot="contentType" class="clearfix">
            <p v-if="row.contentType === 'CONTENT'">内容</p>
            <p v-if="row.contentType === 'IMAGE'">图片</p>
            <p v-if="row.contentType === 'VIDEO'">视频</p>
            <p v-if="row.contentType === 'AUDIO'">音频</p>
          </template>
          <template slot-scope="{ row}" slot="status">
            <span v-if="row.status === 3">草稿</span>
            <span v-if="row.status === 4">待审核</span>
            <span v-if="row.status === 5">审核中</span>
            <span v-if="row.status === 6">审核通过</span>
            <span v-if="row.status === 7">审核不通过</span>
            <span v-if="row.status === 8">已撤回</span>
            <span v-if="row.status === 9">终止</span>
            <span v-if="row.status === 79">审核不通过</span>
          </template>
          <template slot-scope="{row, index}" slot="action">
            <!-- 待审核 -->
            <div v-if="row.status === 4">
              <a
                href="javascript:;"
                class="theme-blue action-btn"
                @click="delReport(row)"
                v-if="operates.includes('recall')"
              >撤回</a>
              <dropCode
                class="action-btn"
                v-if="row.status===1"
                :id="'qrcode' + row.id"
                :key="'qrcode' + row.id"
                :value="$store.state.app.userInfo.h5Domain+'/#/news-detail/' +row.id"
              >
                <span class="theme-blue action-btn">预览</span>
              </dropCode>
            </div>
            <div v-else>
              <router-link
                :to="{path: '/con-add-content', query: {id :row.resourceId}}"
                class="theme-blue action-btn"
                v-if="row.contentType === 'CONTENT' && operates.includes('edit') && row.status === 6"
              >
                修改
              </router-link>
              <router-link
                :to="{path: '/con-add-image', query: {id :row.resourceId}}"
                class="theme-blue action-btn"
                v-if="row.contentType === 'IMAGE' && operates.includes('edit') && row.status === 6"
              >
                修改
              </router-link>
              <router-link
                :to="{path: '/con-add-video', query: {id :row.resourceId}}"
                class="theme-blue action-btn"
                v-if="row.contentType === 'VIDEO' && operates.includes('edit') && row.status === 6"
              >
                修改
              </router-link>
              <router-link
                :to="{path: '/con-add-audio', query: {id :row.resourceId}}"
                class="theme-blue action-btn"
                v-if="row.contentType === 'AUDIO' && operates.includes('edit') && row.status === 6"
              >
                修改
              </router-link>
              <dropCode
                class="action-btn"
                v-if="row.status===1"
                :id="'qrcode' + row.id"
                :value="$store.state.app.userInfo.h5Domain+'/#/news-detail/' +row.id"
              >
                <span class="theme-blue action-btn">预览</span>
              </dropCode>
              <a
                to
                class="theme-blue action-btn"
                @click="delReport(row, index)"
                v-if="row.status !== 4 && operates.includes('delete')"
              >删除</a>
            </div>
          </template>
        </Table>
      </baseTable>
      <div class="btn-box">
        <Button v-if="operates.includes('export')">导出</Button>
        <Button @click="delReport(checkedBox, -1)" v-if="operates.includes('batchDelete')">批量删除</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getReportList, withdrawReport, deleteReport } from "@service/content";
import { AppModule } from "@store/modules/app";
import dropCode from "@components/DropCode/DropCode.vue";
interface paramsType {
  endReportDate: string;
  startReportDate: string;
  endPublishDate: string;
  startPublishDate: string;
  contentType: string;
  createCompany: string;
  title: string;
  auditStatus: string;
}
@Component({
  components: {
    baseTable,
    dropCode
  }
})
export default class Content extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private loading: Boolean = true;
  private checkedBox: any;
  private tableData: any = {
    headList: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "标题",
        key: "title",
        width: 300,
        slot: "title"
      },
      {
        title: "栏目",
        key: "channelName",
        align: "center"
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center"
      },
      {
        title: "类型",
        key: "contentType",
        align: "center",
        slot: "contentType"
      },
      {
        title: "上报时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "状态",
        key: "status",
        align: "center",
        slot: "status"
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  private params: paramsType = {
    endReportDate: "",
    startReportDate: "",
    endPublishDate: "",
    startPublishDate: "",
    contentType: "",
    createCompany: "",
    title: "",
    auditStatus: ""
  };
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: "right"
  };
  mounted() {
    this.getList();
  }
  // 搜索
  private getSearch() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  private delReport(item: any, index: Number) {
    let _this = this;
    if (index === -1 && !this.checkedBox.length) {
      this.$Message.error("请选择您要删除的上报！");
      return;
    }
    let config: any = {
      title: `${!index && index !== 0 ? "撤回" : "删除"}上报`,
      content: `确认是否${
        !index && index !== 0 ? "撤回" : "删除"
      }“${item.title || "选中"}”上报？`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        // 撤回
        if (!index && index !== 0) {
          _this.withdrawReport(item);
        } else {
          _this.delNowReport(item, index);
        }
      }
    };
    this.$Modal.confirm(config);
  }
  // 复选框
  private setChecked(e: any) {
    this.checkedBox = [];
    e.map((item: any) => {
      this.checkedBox.push(item.id as Number);
    });
  }
  // 删除上报
  private delNowReport(item: any, index: Number) {
    deleteReport({
      ids: index !== -1 ? item.id : this.checkedBox.toString()
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("删除成功");
        if (index !== -1) {
          this.tableData.bodyList.splice(index, 1);
        } else {
          this.tableConfig.page.currPage = 1;
          this.getList();
        }
      }
    });
  }
  // 撤回上报
  private withdrawReport(item: any) {
    withdrawReport({
      id: item.id
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("撤回成功");
        item.status = 8;
      }
    });
  }
  // 列表
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.params, page);
    getReportList(this.params).then(data => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = data.datas as [];
      this.loading = false;
      this.checkedBox = [];
    });
  }
  // 时间
  private setTime(e: any) {
    this.params.startReportDate = e[0];
    this.params.endReportDate = e[1];
  }
}
</script>

<style scoped lang="scss">
.search {
  padding-top: 20px;
  background-color: #f8f8f8;
}
.inp-control {
  width: 70%;
}
.switch {
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  position: relative;
  width: 44px;
  height: 22px;
  .cover {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
  }
}
.wrap {
  padding: 15px;
  overflow: hidden;
  .item {
    margin-top: 10px;
  }
  .submit {
    display: inline-block;
    margin-left: 10px;
  }
}
.table {
  margin-top: 15px;
  .title {
    display: inline-block;
    @include ellipsis(65%);
    line-height: 40px;
    vertical-align: middle;
  }
  .cloud-img {
    display: inline-block;
    width: 40px;
    height: 40px;
    vertical-align: middle;
    margin-left: 10px;
  }
  .action-btn {
    cursor: pointer;
    margin: 0 5px;
  }
  .dropDiv-panel {
    border: 1px solid black;
  }
}
.btn-box {
  margin-top: 12px;
  button {
    margin: 0 6px;
  }
}
.msg-panel {
  padding: 10px 10px 15px;
  .msg-title {
    font-weight: 600;
  }
}
.titleIcon{
  color: $theme;
  position: relative;
  // top: 10px;
  left: 5px;
}
</style>
