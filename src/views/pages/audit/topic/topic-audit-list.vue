<!--
 * @Author: xulr
 * @since: 2019-06-04 09:14:58
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-31 17:07:29
 -->
<template>
  <Row class="wrap">
    <div class="right-panel">
      <Tabs active-key="key1" class="tab-warp" :animated="false" @on-click="setState">
        <Tab-pane label="全部" class="tab-pane"></Tab-pane>
        <Tab-pane :label="number > 0 ?  label : '待审核'"></Tab-pane>
        <Tab-pane label="不通过" class="tab-pane"></Tab-pane>
      </Tabs>
      <Form :label-width="80" inline class='form'>
        <FormItem class="item" label="关键字">
          <i-input placeholder="请输入关键字" v-model="params.name"></i-input>
        </FormItem>
        <FormItem class="item" label="活动日期">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择活动日期"
            @on-change="changeDate"
          ></Date-picker>
        </FormItem>
        <FormItem class="item" label="提交时间">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择提交时间"
            @on-change="changeDate1"
          ></Date-picker>
          <Button type="primary" class="ml20" @click="getSearch">搜索</Button>
          <Button type="primary" class="ml20" @click="delReport(checkedBox, -1)" v-if="operates.includes('batchDelete')">批量删除</Button>
          <Button
            type="primary"
            @click="batchAudit"
            class="ml20"
            v-show="params.auditStatus === 4 && operates.includes('batchCheck')"
          >批量审核</Button>
        </FormItem>
      </Form>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          size="default"
          class="table"
          :loading="loading"
          ref="selection"
          @on-selection-change="setChecked"
        >
          <template slot-scope="{ row}" slot="title">
            <div class="topic-msg">
              <div class="img daq-no-photo">
                <img class="cloud-img" :src="row.image.split(',')[0]" alt v-if="row.image"  @click.stop="viewImage(row.image.split(',')[0],'图片查看')">
              </div>
              <div class="msg-panel">
                <p class="topic-name">
                  <span class="red" v-if="row.top === 1">[置顶]</span>
                  <span
                    class="red"
                    v-if="row.recommendChannelHomePage === 1 || row.recommendHomePage === 1"
                  >[推荐]</span>
                  <span class="theme-blue topicTag ml5">
                    <router-link
                      tag="a"
                      :to="{path: '/audit-topic-detail', query: {id: row.topicId, topicId: row.id, resourceName: row.name, checked: true}}"
                      class="theme-blue action-btn"
                    ># {{row.name}} #</router-link>
                  </span>
                </p>
                <p class="date">
                  活动时间：{{row.startDate}}
                  <span v-if="row.startDate && row.endDate">至</span>
                  {{row.endDate}}
                </p>
              </div>
            </div>
            <p class="reply" v-if="row.auditResult">
              <span>审核备注：</span>{{row.auditResult}}</p>
          </template>
          <template slot-scope="{ row}" slot="status">
            <span v-if="row.status === 3">草稿</span>
            <span v-if="row.status === 4">待审核</span>
            <span v-if="row.status === 5">审核中</span>
            <span v-if="row.status === 6">审核通过</span>
            <span v-if="row.status === 7">回退</span>
            <span v-if="row.status === 8">已撤回</span>
            <span v-if="row.status === 9">终止</span>
            <span v-if="row.status === 79">审核不通过</span>
          </template>
          <template slot-scope="{row}" slot="createCompany">{{row.createCompany || '-'}}</template>
          <template slot-scope="{ row, index}" slot="action">
            <div v-if="row.status === 7 || row.status === 79 || row.status === 9">
              <a
                href="javascript:;"
                class="theme-blue action-btn"
                @click="getTopicAuditProcess(row)"
                  v-if="operates.includes('process') "
              >流程</a>
              <a
                href="javascript:;"
                class="theme-blue action-btn"
                @click="delReport(row, index)"
                v-if="operates.includes('delete')"
              >删除</a>
            </div>
            <div v-else>
              <router-link
                tag="a"
                :to="{path: '/audit-topic-detail', query: {id: row.topicId, topicId: row.id, resourceName: row.name, checked: true}}"
                href="javascript:;"
                class="theme-blue action-btn"
                v-if="row.status === 4 && operates.includes('audit')"
              >审核</router-link>
              <a
                href="javascript:;"
                class="theme-blue action-btn"
                @click="getTopicAuditProcess(row)"
                v-if="operates.includes('process') "
              >流程</a>
            </div>
          </template>
        </Table>
      </baseTable>
      
    </div>
    <Modal v-model="modal" title="审批流程" footer-hide>
      <auditProcess :data="processData"></auditProcess>
    </Modal>
    <!-- 审核 -->
    <Dialog
      :configer="dialogConfig"
      @onClose="closePop"
      v-if="dialogConfig.title"
      @onOk="submitChecked"
      @onCancel="close"
    >
      <div class="describe">
        <span class="item" @click="setBatch(6)" :class="batch === 6 ? 'active' : ''">通过</span>
        <span
          type="primary"
          class="item"
          @click="setBatch(1)"
          :class="batch !== 6 && batch !== 0 ? 'active' : ''"
        >不通过</span>
        <p class="mt20" v-show="batch !== 6 && batch !== 0">
          <RadioGroup @on-change="setBatch($event)">
            <Radio label="回退"></Radio>
            <Radio label="终止" class="ml20"></Radio>
          </RadioGroup>
        </p>
      </div>
    </Dialog>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getTopicAuditList,
  delTopicAuditList,
  batchAuditTopicAuditList
} from "@service/audit";
import {
  getTopicAuditProcess
} from "@service/topic";
import baseTable from "@components/baseTable/baseTable.vue";
import auditProcess from "@components/auditProcess/auditProcess.vue";
import Dialog from "@components/Dialog/Dialog.vue";
import { AppModule } from "@store/modules/app";
import { PreviewPics} from '@components/index';
@Component({
  components: {
    baseTable,
    auditProcess,
    Dialog,
    PreviewPics
  }
})
export default class contentAuditList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //   弹窗配置
  private dialogConfig: any = {
    title: "批量审核",
    show: false,
    size: "default"
  };
  // 获取审核流程信息
  private batch: Number = 0;
  private processData: any = {};
  private modal: boolean = false;
  private loading = true;
  private number: Number = 0;
  //表格分页信息
  private params: any = {
    createEndDate: "",
    createStartDate: "",
    endDate: "",
    startDate: "",
    auditStatus: "",
    name: ""
  };
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
        key: "title",
        align: "center",
        width: 500,
        slot: "title"
      },

      {
        title: "提交时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center",
        slot: "createCompany"
      },
      {
        title: "状话题态",
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
  // 复选框ID
  private checkedBox: Array<Number> = [];
  // 关闭弹窗
  private closePop() {
    this.dialogConfig.show = false;
  }
  private label(h: any) {
    let _this = this;
    return h("div", [
      h("span", "待审核"),
      h("Badge", {
        props: {
          count: _this.number
        }
      })
    ]);
  }
  // tab
  private setState(index: Number) {
    switch (index) {
      case 0:
        this.params.auditStatus = "";
        break;
      case 1:
        this.params.auditStatus = 4;
        break;
      case 2:
        this.params.auditStatus = 79;
        break;
    }
    this.tableConfig.page.currPage = 1
    this.getList();
  }
  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private imgTitle: String = '';
  private currIndex = 0;
  private viewImage(url: any,name: String, index?: number) {
      // 判断url的类型 如果是数组 则直接赋值 如果不是数组 则先清空数组 再将url写到数组里面去
      if (Object.prototype.toString.call(url) === '[object Array]') {
          this.imgUrl = url;
      }
      if (Object.prototype.toString.call(url) === '[object String]') {
          this.imgUrl = []
          this.imgUrl.push(url)
      }
      this.imgTitle = name;
      this.visible = true;
      this.currIndex = index || 0
  }
  /* E 查看大图 */
    // 搜索
  private getSearch() {
   this.tableConfig.page.currPage = 1;
    this.getList()
  }
  // 审批流程
  private getTopicAuditProcess(row: any) {
    getTopicAuditProcess({ id: row.topicId }).then((res: any) => {
      this.processData = res.data;
      this.modal = true;
    });
  }
  // 批量审核
  private batchAudit() {
    if (!this.checkedBox.length) {
      this.$Message.error("请选择需要审核的话题！");
      return;
    }
    this.dialogConfig.show = true;
  }
  // 设置通过 || 不通过
  private setBatch(type: any) {
    if (type === "回退") {
      this.batch = 7;
      return;
    }
    if (type === "终止") {
      this.batch = 9;
      return;
    }
    if (type !== "回退" || type !== "终止") {
      this.batch = type;
      return;
    }
  }
  private close() {
    this.batch = 0;
    this.dialogConfig.show = false;
    this.checkedBox = [];
  }
  private submitChecked() {
    if (this.batch === 0) {
      this.$Message.error("请选择是否通过！");
      return;
    }
    if (this.batch === 1) {
      this.$Message.error("不通过请选择类型！");
      return;
    }
    batchAuditTopicAuditList({
      auditStatus: this.batch,
      ids: this.checkedBox.toString()
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("审核成功");
         this.tableConfig.page.currPage = 1;
        this.getList();
        this.batch = 0;
        this.dialogConfig.show = false;
      }
    });
  }
  //   改变日期
  private changeDate(e: any) {
    this.params.startDate = e[0];
    this.params.endDate = e[1];
  }
  //   改变日期
  private changeDate1(e: any) {
    this.params.createStartDate = e[0];
    this.params.createEndDate = e[1];
  }
  // 删除
  private delReport(item: any, index: Number) {
    if (index === -1 && !this.checkedBox.length) {
      this.$Message.error("请选择需要删除的话题！");
      return;
    }
    let _this = this;
    let config: any = {
      title: `删除话题`,
      content: `确认删除“${item.title || "选中"}”话题？删除话题后将无法恢复`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        if (index !== -1) {
          _this.delList(item.id, index);
        } else {
          _this.delList(item, -1);
        }
      }
    };
    this.$Modal.confirm(config);
  }
  // 删除
  private delList(id: any, index: Number) {
    delTopicAuditList({
      ids: index !== -1 ? id : this.checkedBox.toString()
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
  // 复选框
  private setChecked(e: any) {
    this.checkedBox = [];
    e.map((item: any) => {
      this.checkedBox.push(item.id as Number);
    });
  }
  // 批量删除
  mounted() {
    this.getList();
  }
  // 获取通过的数量
  private getListSet() {
    getTopicAuditList({
      auditStatus: 4
    }).then((data: any) => {
      this.number = data.page ? (data.page.total as Number) : 0;
    });
  }
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.params, page);
    getTopicAuditList(this.params).then(data => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = data.datas;
      this.loading = false;
      this.checkedBox = [];
    });
    this.getListSet();
  }
}
</script>

<style scoped lang="scss">
.describe {
  width: 400px;
  height: 150px;
  text-align: center;
  overflow: hidden;
  padding: 20px 15px;
  .item {
    width: 30%;
    display: inline-block;
    line-height: 50px;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    height: 50px;
    font-size: 14px;
    cursor: pointer;
    &:first-child {
      margin-right: 20px;
    }
    &:hover,
    &.active {
      color: $theme;
      border-color: $theme;
    }
  }
  .mt20 {
    text-align: left;
    margin-left: calc(20% - 10px);
  }
}
.wrap {
  padding-bottom: 20px;
    .right-panel {
    padding: 0 15px;
    overflow: hidden;
    .form{
      background: $grayLight;
      margin-bottom: 15px;
      padding-top: 15px;
    }
  }
}

.action-btn {
  cursor:pointer;
  margin: 0 3px;
}
.topic-msg {
  display: flex;
  padding: 8px 0;
  .img {
    width: 100px;
    height: 60px;
    margin-right: 10px;
    overflow: hidden;
  }
  .msg-panel {
    flex: 1;
    overflow: hidden;
    text-align: left;
  }
  .topic-name {
    margin-top: 7px;
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
.reply {
  margin-bottom: 8px;
  padding: 8px 10px;
  text-align: left;
  font-size: 12px;
  line-height: 18px;
  color: #333;
  background: #f7f7f7;
  span {
    color: $theme;
  }
}
</style>
