<!--
 * @Author: 任智勇
 * @since: 2019-05-31 10:04:22
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-12 10:53:42
 -->
<template>
  <div class="container pd15">
    <div class="wrap">
      <Form :label-width="80" inline>
        <FormItem class="item" label="关键字">
          <Input placeholder="请输入关键字" v-model="params.name"/>
        </FormItem>
        <FormItem class="item" label="话题状态">
          <Select class="w150" v-model="params.topicStatus">
            <Option value="">全部</Option>
            <Option value="0">未开始</Option>
            <Option value="1">进行中</Option>
            <Option value="2">已结束</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="状态">
          <Select class="w150" v-model="params.status">
            <Option value="">全部</Option>
            <Option value="4">待审核</Option>
            <Option value="8">已撤回</Option>
            <Option value="1">正常</Option>
            <Option value="2">禁用</Option>
            <Option value="7">退回</Option>
            <Option value="9">终止</Option>
            <Option value="3">草稿</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="活动日期">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择活动日期"
            @on-change="changeDate"
          ></Date-picker>
        </FormItem>
        <FormItem class="item" label="提交日期">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择提交日期"
            @on-change="changeDate1"
          ></Date-picker>
        </FormItem>
        <div class="submit">
          <Button type="primary" class @click="getSearch">搜索</Button>
        </div>
      </Form>
    </div>
    <baseTable :configure="tableConfig" @getList="getList">
      <Table
        border
        :columns="tableData.headList"
        :data="tableData.bodyList"
        class="table"
        :loading="loading"
        @on-selection-change="setChecked"
      >
        <template slot-scope="{row}" slot="topicMsg">
          <div class="topic-msg">
            <div class="img daq-no-photo">
              <img class="cloud-img" :src="row.image.split(',')[0]" alt v-if="row.image">
            </div>
            <div class="msg-panel">
              <p class="topic-name">
                <span class="red" v-if="row.top === 1">[置顶]</span>
                <span
                  class="red"
                  v-if="row.recommendChannelHomePage === 1 || row.recommendHomePage === 1"
                >[推荐]</span>
                <router-link
                  :to="{path: '/topic-detail', query:{id: row.id}}"
                  class="theme-blue topicTag ml5"
                ># {{row.name}} #</router-link>
              </p>
              <p class="date">
                活动时间：{{row.startDate}}
                <span v-if="row.startDate && row.endDate">至</span>
                {{row.endDate}}
              </p>
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="topicStatus">
          <span v-if="row.topicStatus === 0">未开始</span>
          <span v-if="row.topicStatus === 1">进行中</span>
          <span v-if="row.topicStatus === 2">已结束</span>
        </template>
        <template slot-scope="{row}" slot="sort">
          <span v-if="!sort">{{row.sort}}</span>
          <InputNumber :min="1" :max="999" v-else @on-change="changeSort(row)" v-model="row.sort"/>
        </template>
        <template slot-scope="{row}" slot="backlogName">
          <span v-if="row.status == 4 || row.status == 5">{{row.backlogName}}</span>
          <span v-else-if="row.status == 3">无</span>
          <span v-else>已结束</span>
        </template>
        <template slot-scope="{row}" slot="status">
          <div v-if="row.status === 1">
            正常
            <span class="switch">
              <i-switch :value="true"/>
              <i class="cover" @click="changeState(row)"></i>
            </span>
          </div>
          <div v-if="row.status === 2">
            禁用
            <span class="switch">
              <i-switch :value="false"/>
              <i class="cover" @click="changeState(row)"></i>
            </span>
          </div>
          <span v-if="row.status === 3">草稿</span>
          <span v-if="row.status === 4">待审核</span>
          <span v-if="row.status === 5">审核中</span>
          <span v-if="row.status === 6">审核通过</span>
          <span v-if="row.status === 7">退回</span>
          <span v-if="row.status === 8">已撤回</span>
          <span v-if="row.status === 9">终止</span>
        </template>
        <template slot-scope="{row,index}" slot="action">
          <dropCode
            class="action-btn"
            v-if="row.status === 1"
            :id="'qrcode' + row.id"
            :key="'qrcode' + row.id"
            :value="$store.state.app.userInfo.h5Domain+'/#/topic-detail/' +row.id"
          >
            <span class="theme-blue action-btn">预览</span>
          </dropCode>
          <a
            href="javascript:;"
            class="theme-blue action-btn"
            v-if="row.status !== 3 && row.status !== 8  && operates.includes('process') "
            @click="getContentAuditProcess(row)"
          >流程</a>
          <a class="theme-blue action-btn" v-if="row.status === 3 && operates.includes('submit')" @click="returnTopic(row)">提交</a>
          <a class="theme-blue action-btn" v-if="row.status === 4 && operates.includes('recall')" @click="returnTopic(row)">撤回</a>
          <!-- 点击用户，打开故事管理页，搜索此话题下的故事。 -->
          <a class="theme-blue action-btn" v-if="row.status === 2 && operates.includes('user')">用户</a>
          <a class="theme-blue action-btn" v-if="(row.status < 4 || row.status > 7) && operates.includes('delete')" @click="del(row, index)">删除</a>
          <router-link
            :to="{path: '/topic-edit', query:{id: row.id}}"
            class="theme-blue action-btn"
            v-if="(row.status===7 || row.status===8 || row.status < 4) && operates.includes('edit') "
          >修改</router-link>
        </template>
      </Table>
    </baseTable>
    <footerButtons
      type="CONTENT_TYPE_TOPIC"
      :selectionList="footerList"
      :orderRowData="orderRowData"
      @changeOrder="changeOrder"
      @getList="getList"
      class="operate"
    >
      <Button type="primary" :disabled="sort" class="ml10" @click="returnTopic(1)" v-if="operates.includes('batchSave')">批量提交</Button>
      <Button type="primary" :disabled="sort" class="ml10" @click="del(checkedBox, -1)" v-if="operates.includes('batchDelete')">批量删除</Button>
    </footerButtons>
    <Modal v-model="modal" title="审批流程" footer-hide>
      <auditProcess :data="processData"></auditProcess>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import dropCode from "@components/DropCode/DropCode.vue";
import auditProcess from "@components/auditProcess/auditProcess.vue";
import footerButtons from "@components/footerButtons/footerButtons.vue";
import {
  getTopicList,
  deleteTopicList,
  withdrawTopicList,
  submitTopicList,
  getTopicAuditProcess
} from "@service/topic";
import { updateStatus } from "@service/common";
import { AppModule } from "@store/modules/app";
@Component({
  components: {
    baseTable,
    auditProcess,
    footerButtons,
    dropCode
  }
})
export default class list extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 排序
  private orderRowData: object = {};
  private footerList: Array<Object> = [];
  private sort: boolean = false; // 是否开启排序功能
  // 流程
  private processData: any = {};
  private modal: boolean = false;
  private loading: Boolean = true;
  private params: any = {
    createEndDate: "", // 提交结束时间
    createStartDate: "", // 提交开始时间
    endDate: "", // 活动结束时间
    startDate: "", // 活动开始时间
    status: "", // 数据状态
    name: "", // 话题名称
    topicStatus: "" // 话题状态  0：未开始 1：进行中 2：已结束
  };
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData: any = {
    headList: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "话题信息",
        key: "topicMsg",
        slot: "topicMsg",
        align: "center",
        width: 350
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center"
      },
      {
        title: "提交时间",
        key: "createTime",
        align: "center",
        width: 100
      },
      {
        title: "话题状态",
        key: "topicStatus",
        align: "center",
        slot: "topicStatus"
      },
      {
        title: "参与数",
        key: "participateNum",
        align: "center"
      },
      {
        title: "排序",
        key: "sort",
        align: "center",
        slot: "sort"
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
    headListCompany: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "话题信息",
        key: "topicMsg",
        slot: "topicMsg",
        align: "center",
        width: 350
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center"
      },
      {
        title: "提交时间",
        key: "createTime",
        align: "center",
        width: 100
      },
      {
        title: "话题状态",
        key: "topicStatus",
        align: "center",
        slot: "topicStatus"
      },
      {
        title: "参与数",
        key: "participateNum",
        align: "center"
      },
      {
        title: "待办人",
        key: "backlogName",
        align: "center",
        slot: "backlogName"
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
        slot: "action",
      }
    ],
    bodyList: []
  };
  // 搜索
  private getSearch() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  // 复选框ID
  private checkedBox: Array<Number> = [];
  mounted() {
    // 企业端改变表格
    if(this.$store.state.app.userInfo.dataType == 'COMPANY'){
      this.tableData.headList = this.tableData.headListCompany
    }
    this.getList();
  }
  // 审批流程
  private getContentAuditProcess(row: any) {
    getTopicAuditProcess({ id: row.id }).then((res: any) => {
      this.processData = res.data;
      this.modal = true;
    });
  }
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.params, page);
    getTopicList(this.params).then(data => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = data.datas as [];
      this.loading = false;
    });
  }
  // 排序
  /* S 排序 */
  private changeOrder(b: boolean) {
    this.sort = b;
  }
  // 修改排序行的数据
  private changeSort(row: any) {
    this.orderRowData = row;
  }
  // 改变状态
  private changeState(item: any) {
      // @ts-ignore
    if (!this.operates.includes("status")) {
      return;
    }
    let content =
      item.status === 2
        ? `确认是否启用“${item.name}话题`
        : `确认要禁用“${item.name}”话题？禁用后用户端将不显示该话题！`;
    let config: any = {
      title: item.status === 2 ? "启用话题" : "禁用话题",
      content: content,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        this.setStatus(item);
      }
    };
    this.$Modal.confirm(config);
  }
  // 启用禁用
  private setStatus(item: any) {
    let params = {
      id: item.id,
      status: item.status === 2 ? 1 : 2,
      resourceType: "CONTENT_TYPE_TOPIC"
    };
    updateStatus(params).then(data => {
      if (data.code === 0) {
        this.$Message.success("修改成功！");
        if (item.status === 2) {
          item.status = 1;
        } else {
          item.status = 2;
        }
      }
    });
  }
  //   改变日期
  private changeDate(e: any) {
    this.params.startDate = e[0];
    this.params.endDate = e[1];
  }
  // 复选框
  private setChecked(e: any) {
    this.checkedBox = [];
    this.footerList = e;
    e.map((item: any) => {
      this.checkedBox.push(item.id as Number);
    });
  }
  //   改变日期
  private changeDate1(e: any) {
    this.params.createStartDate = e[0];
    this.params.createEndDate = e[1];
  }
  // 删除
  private del(item: any, index: Number) {
    let _this = this;
    if (index === -1 && !this.checkedBox.length) {
      this.$Message.error("请选择你要删除的话题");
      return;
    }
    let config: any = {
      title: `删除话题`,
      content: `确认要删除“${item.name || "选中"}”话题？删除后数据将无法恢复！`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.delField(item.id, index);
      }
    };
    this.$Modal.confirm(config);
  }
  //   撤回话题
  private returnTopic(item: any) {
    let _this = this;
    if (item === 1 && !this.checkedBox.length) {
      this.$Message.error("请选择提交话题！");
      return;
    }
    let _name = item.status === 3 || item === 1 ? "提交" : "撤回";
    let config: any = {
      title: `${_name}话题`,
      content: `确认要${_name}“${item.name || "选中"}”话题？`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        if (item.status !== 3 && item !== 1) {
          _this.withdrawTopicList(item);
        } else {
          _this.summitTopic(item);
        }
      }
    };
    this.$Modal.confirm(config);
  }
  //   提交话题
  private summitTopic(item: any) {
    submitTopicList({
      ids: item !== 1 ? item.id : this.checkedBox.toString()
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("提交成功！");
        if (item.id && item !== 1) {
          item.status = 4;
        } else {
          this.tableConfig.page.currPage = 1;
          this.getList();
        }
      }
    });
  }
  //   撤回话题
  private withdrawTopicList(item: any) {
    withdrawTopicList({
      id: item.id
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("撤回成功！");
        item.status = 8;
      }
    });
  }
  // 删除
  private delField(id: Number, index: Number) {
    deleteTopicList({
      ids: index !== -1 ? id : this.checkedBox.toString()
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("删除成功！");
        if (index !== -1) {
          this.tableData.bodyList.splice(index, 1);
        } else {
          this.tableConfig.page.currPage = 1;
          this.getList();
        }
      }
    });
  }
}
</script>

<style scoped lang="scss">
.operate {
  padding-bottom: 20px;
  text-align: center;
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
.inp-control {
  width: 70%;
}

.w150 {
  width: 150px;
}

.wrap {
  padding: 15px 15px 0 15px;
  background-color: $grayLight;
  .submit{
    display: inline-block;
    margin:0 0 15px 10px;
  }
  .ivu-form-item{
    margin-bottom: 15px!important;
  }
}

.table {
  margin-top: 15px;
  .action-btn {
    cursor:pointer;
    & + .action-btn {
      margin-left: 5px;
    }
  }
  .topic-msg {
    display: flex;
    padding: 8px 0;
    .img {
      width: 70px;
      height: 50px;
      margin-right: 10px;
      overflow: hidden;
    }
    .msg-panel {
      flex: 1;
      overflow: hidden;
      text-align: left;
    }
    .topic-name {
      margin-top: 3px;
      text-align: left;
    }
    .topicTag {
      display: inline-block;
    }
    .date {
      margin-top: 7px;
      white-space: normal;
    }
  }
}
</style>
