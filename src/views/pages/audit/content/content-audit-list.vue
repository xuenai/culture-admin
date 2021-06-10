<!--
 * @Author: 任智勇
 * @since: 2019-05-29 09:28:53
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-01 11:11:48
 -->
<template>
  <Row class="wrap">
    <Tree
      :data="channelList"
      :show-checkbox="false"
      :render="renderTreeNode"
      class="left-panel"
      v-if="channelList.length"
    ></Tree>
    <!--@on-select-change="setChannel"-->
    <div class="right-panel">
      <Tabs active-key="key1" class="tab-warp" :animated="false" @on-click="setState" v-model="currTab">
        <Tab-pane label="全部" class="tab-pane"></Tab-pane>
        <Tab-pane :label="number > 0 ?  label : `待${auditActionTxt}`"></Tab-pane>
        <Tab-pane label="不通过"></Tab-pane>
      </Tabs>
      <Form :label-width="80" inline class="form">
        <FormItem class="item" label="标题">
          <i-input placeholder="请输入标题" v-model="params.title"></i-input>
        </FormItem>
        <FormItem class="item" label="创建者">
          <i-input placeholder="请输入创建者" v-model="params.createCompany"></i-input>
        </FormItem>
        <FormItem class="item" label="提交时间">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            @on-change="changeDate"
          ></Date-picker>
        </FormItem>
        <FormItem class="item" label="类型">
          <Select v-model="params.contentType" style="width:150px">
            <Option value="CONTENT">内容</Option>
            <Option value="IMAGE">图片</Option>
            <Option value="AUDIO">音频</Option>
            <Option value="VIDEO">视频</Option>
          </Select>
        </FormItem>
        <div class="mt10 submit">
          <Button type="primary" @click="getSearch">搜索</Button>
          <Button
            type="primary"
            @click="batchAudit"
            class="ml20"
            v-show="params.auditStatus === 4 && operates.includes('batchCheck')"
          >批量审核</Button>
          <!--<Button
            type="primary"
            class="ml20"
            @click="delReport(checkedBox, -1)"
            v-if="operates.includes('batchDelete')"
          >批量删除</Button>-->
        </div>
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
            <router-link
              tag="a"
              :to="{path: detailPath, query: {id: row.contentId, checked: true, auditId: row.id}}"
              class="theme-blue action-btn"
            >{{row.title}}</router-link>
          </template>
          <template slot-scope="{ row}" slot="contentType">
            <p v-if="row.contentType === 'CONTENT'">内容</p>
            <p v-if="row.contentType === 'IMAGE'">图片</p>
            <p v-if="row.contentType === 'VIDEO'">视频</p>
            <p v-if="row.contentType === 'AUDIO'">音频</p>
          </template>
          <template slot-scope="{ row}" slot="status">
            <span v-if="row.status === 3">草稿</span>
            <span v-if="row.status === 4">{{`待${auditActionTxt}`}}</span>
            <span v-if="row.status === 7">回退</span>
            <span v-if="row.status === 8">已撤回</span>
            <span v-if="row.status === 9">终止</span>
            <span v-if="row.status === 79">审核不通过</span>
          </template>
          <template slot-scope="{row}" slot="createCompany">{{row.createCompany || '-'}}</template>
          <template slot-scope="{ row}" slot="action">
            <p v-if="row.contentType === 'CONTENT'">内容</p>
            <p v-if="row.contentType === 'IMAGE'">图片</p>
            <p v-if="row.contentType === 'VIDEO'">视频</p>
            <p v-if="row.contentType === 'AUDIO'">音频</p>
          </template>
          <template slot-scope="{ row}" slot="action">
            <div v-if="row.status === 7 || row.status === 79 || row.status === 9">
              <a
                href="javascript:;"
                class="theme-blue action-btn"
                @click="getContentAuditProcess(row)"
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
                :to="{path: detailPath, query: {id: row.contentId, checked: true, auditId: row.id}}"
                href="javascript:;"
                class="theme-blue action-btn"
                v-if="row.status === 4 && operates.includes('audit')"
              >{{ auditActionTxt }}</router-link>
              <a
                href="javascript:;"
                @click="routeUpdate(row)"
                class="theme-blue action-btn"
                v-if="operates.includes('edit') "
              >修改</a>
              <a
                href="javascript:;"
                class="theme-blue action-btn"
                @click="getContentAuditProcess(row)"
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
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getContentAuditList,
  delContentAuditList,
  getChannelList,
  batchAudit
} from "@service/audit";
import { getContentAuditProcess } from "@service/content";
import baseTable from "@components/baseTable/baseTable.vue";
import auditProcess from "@components/auditProcess/auditProcess.vue";
import Dialog from "@components/Dialog/Dialog.vue";
import { AppModule } from "@store/modules/app";
@Component({
  components: {
    baseTable,
    auditProcess,
    Dialog
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
  private isShow = false;
  private loading = true;
  private number: Number = 0;
  // 栏目
  private channelList: any = [];
  //表格分页信息
  private params: any = {
    channelId: "",
    endDate: "",
    startDate: "",
    title: "",
    createCompany: "",
    contentType: "",
    auditStatus: ""
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
        title: "标题",
        key: "title",
        align: "center",
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
        align: "center",
        slot: "createCompany"
      },
      {
        title: "类型",
        key: "contentType",
        align: "center",
        slot: "contentType"
      },
      {
        title: "提交时间",
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
  // 复选框ID
  private checkedBox: Array<any> = [];
  // 关闭弹窗
  private closePop() {
    this.dialogConfig.show = false;
  }
  private currTab: number = 0
  beforeRouteLeave (to:any, from:any, next: Function) {
    this.setPageData(to.path);
    if (['/audit-content-company','/audit-content-site','/audit-content'].includes(to.path)) this.reset();
    next();
  }
  private reset():void {
    this.currTab = 0
    this.params.auditStatus = "";
    this.tableConfig.page.currPage = 1;
    this.setChannel();
  }
  // 待审核
  private label(h: any) {
    let _this = this;
    return h("div", [
      h("span", `待${this.auditActionTxt}`),
      h("Badge", {
        props: {
          count: _this.number
        }
      })
    ]);
  }
  // 搜索
  private getSearch() {
    this.tableConfig.page.currPage = 1;
    this.getList();
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
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  // 审批流程
  private getContentAuditProcess(row: any) {
    getContentAuditProcess({ id: row.contentId }).then((res: any) => {
      this.processData = res.data;
      this.modal = true;
    });
  }
  // 批量审核
  private batchAudit() {
    if (!this.checkedBox.length) {
      this.$Message.error("请选择需要审核的内容！");
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
    batchAudit({
      auditStatus: this.batch,
      resourceNames: JSON.stringify(this.checkedBox.map((item:any) => item.title)),
      ids: this.checkedBox.map((item:any) => item.id).toString()
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

  // 列表操作 - 编辑
  private routeUpdate(row: any) {
    let path = "";
    switch (row.contentType) {
      case "CONTENT":
        {
          path = "/con-edit-content";
        }
        break;
      case "IMAGE":
        {
          path = "/con-edit-image";
        }
        break;
      case "VIDEO":
        {
          path = "/con-edit-video";
        }
        break;
      case "AUDIO":
        {
          path = "/con-edit-audio";
        }
        break;
    }
    // audit 表示是审核跳转的详情
    this.$router.push({
      path: path,
      query: { id: row.contentId, audit: "true", auditId: row.id }
    });
  }

  // 删除
  private delReport(item: any, index: Number) {
    if (index === -1 && !this.checkedBox.length) {
      this.$Message.error("请选择需要删除的内容");
      return;
    }
    let _this = this;
    let config: any = {
      title: `删除内容`,
      content: `确认删除“${item.title || "选中"}”内容？删除内容后将无法恢复`,
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
    delContentAuditList({
      ids: index !== -1 ? id : this.checkedBox.map((item:any) => item.id).toString()
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
    this.checkedBox = e || [];
    /*e.map((item: any) => {
      this.checkedBox.push(item.id as Number);
    });*/
  }
  private auditActionTxt: string = '审核'
  private detailPath: string = '/audit-content-detail'
  private setPageData(path: string):void {
    this.auditActionTxt = '审核'
    if (path === '/audit-content') {
      this.params.findCurrent = null
      this.channelParams.findCurrent = null
      this.detailPath = '/audit-content-detail'
    } else if (path === '/audit-content-site') {
      this.params.findCurrent = true
      this.channelParams.findCurrent = true
      this.detailPath = '/audit-content-detail-site'
    } else if (path === '/audit-content-company') {
      this.params.findCurrent = false
      this.channelParams.findCurrent = false
      this.auditActionTxt = '发布'
      this.detailPath = '/audit-content-detail-company'
    }
  }
  // 批量删除
  mounted() {
    this.setPageData(this.$route.path);
    this.getList();
    this.getChannelList();
  }
  // 获取待审核数量
  private getListSet() {
    getContentAuditList({
      auditStatus: 4,
      channelId: this.params.channelId,
      findCurrent: this.params.findCurrent
    }).then((data: any) => {
      this.number = data.page ? (data.page.total as Number) : 0;
    });
  }
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.params, page);
    getContentAuditList(this.params).then((data:any) => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = data.datas;
      this.loading = false;
      this.checkedBox = [];
    });
    this.getListSet();
  }
  // 内容栏目列表
  private channelParams: any = {
    auditCount: true,
    findCurrent: null
  }
  private getChannelList() {
    let _this = this;
    getChannelList(this.channelParams).then(data => {
      let _data = data.datas as [];

      _data.filter((item: any, index: any) => {
        item.children = item.subset;
        item.expand = true;
//        item.title = item.name + `（${item.num}）`;
//        item.render = (h:any) => {
//            let hasCheck = item.id === this.params.channelId
//              return h('span', {
//                  class: {
//                      'ivu-tree-title': true,
//                      'ivu-tree-title-selected': hasCheck
//                  },
//                  attrs: {
//                      title: `${item.name}(${item.num})`
//                  },
//                  on: {
//                      click: (e?:any) => {
//                          if (e) {
//                              e.stopPropagation();
//                              e.preventDefault();
//                          } else {
//                              window.event.returnValue = false;
//                              window.event.cancelBubble = true;
//                          }
//                          if (hasCheck) {
//                              this.setChannel()
//                          } else {
//                              this.setChannel(item)
//                          }
//                      }
//                  }
//              }, `${item.name}(${item.num})`)
//        }
        _this.filterObj(item);
        if (index === _data.length - 1) {
          _this.channelList = _data;
        }
      });
    });
  }
  private filterObj(item: any) {
    let _this = this;
    if (item.hasOwnProperty("subset")) {
      item.subset.filter((child: any) => {
        child.children = child.subset;
//        child.title = child.name + `（${child.num}）`;
//          child.render = (h:any, {root, node, data}) => {
//                console.log(root, node, data)
//              let hasCheck = child.id === this.params.channelId
//              return h('span', {
//                  class: {
//                    'ivu-tree-title': true,
//                    'ivu-tree-title-selected': hasCheck
//                  },
//                  attrs: {
//                      title: `${child.name}(${child.num})`
//                  },
//                  on: {
//                      click: (e?:any) => {
//                          if (e) {
//                              e.stopPropagation();
//                              e.preventDefault();
//                          } else {
//                              window.event.returnValue = false;
//                              window.event.cancelBubble = true;
//                          }
//                          if (hasCheck) {
//                              this.setChannel()
//                          } else {
//                              this.setChannel(child)
//                          }
//                      }
//                  }
//              }, `${child.name}(${child.num})`)
//          }
        item.expand = true;
        if (child.hasOwnProperty("subset")) {
          return _this.filterObj(child);
        }
      });
    }
  }
  // 渲染树节点

    // @ts-ignore
    private renderTreeNode (h:any, {root, node, data}) {
        let hasCheck = data.id === this.params.channelId
        // @ts-ignore
        return h('span', {
            class: {
                'ivu-tree-title': true,
                'ivu-tree-title-selected': hasCheck
            },
            style: {
                maxWidth: '250px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                wordWrap: 'normal'
            },
            attrs: {
                title: `${data.name}(${data.num})`
            },
            on: {
                click: (e?:any) => {
                    if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    } else {
                        (window as any).event.returnValue = false;
                        (window as any).event.cancelBubble = true;
                    }
                    if (hasCheck) {
                        this.setChannel()
                    } else {
                        this.setChannel(data)
                    }
                }
            }
        }, `${data.name}(${data.num})`)
    }
  // 栏目筛选
  private setChannel(e?: any) {
    if (e) {
      this.params.channelId = e.id;
    } else {
      this.params.channelId = "";
    }
    this.getList();
  }
}
</script>

<style scoped lang="scss">
.describe {
  width: 400px;
  height: 150px;
  text-align: center;
  overflow: hidden;
  padding: 20px;
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
  display: flex;
  .item {
    margin-top: 10px;
  }
  .submit {
    display: inline-block;
    margin-left: 10px;
  }
}
.left-panel {
  overflow: scroll;
  padding: 0 10px;
  min-width: 180px;
  background: #f8fafe;
  // min-height: 100vh;
  max-width: 400px;
  height: calc(100vh - 142px);
  max-height: calc(100vh - 142px);
  min-height: calc(100vh - 142px);
}
.right-panel {
  flex: 1;
  padding: 0 15px;
  overflow: hidden;
  // min-height: 100vh;
  .tab-warp {
    background-color: $bg01;
  }
  .form{
    background: $grayLight;
    margin-bottom: 15px;
    padding-top: 10px;
  }
}
.action-btn {
  cursor: pointer;
  margin: 0 5px;
}
</style>
