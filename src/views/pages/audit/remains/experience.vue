<template>
  <div class="venues-audit">
    <Tabs active-key="key1" class="tab-wrap" :animated="false" @on-click="setStatus"
      v-model="currTab">
      <Tab-pane label="全部" key="key1"></Tab-pane>
      <Tab-pane :label="waitNum>0?waitLabel:'待审核'" key="key2"></Tab-pane>
      <Tab-pane label="不通过" key="key3"></Tab-pane>
    </Tabs>
    <Form :label-width="80" inline class="wrap">
      <FormItem class="item" label="编号">
        <i-input placeholder="请输入编号" v-model="params.code" @on-enter="getList()"></i-input>
      </FormItem>
      <FormItem class="item" label="基地名称">
        <i-input placeholder="请输入基地名称" v-model="params.name" @on-enter="getList()"></i-input>
      </FormItem>
      <FormItem class="item" label="审核状态">
        <Select class="w150" v-model="params.status" style="width:150px" @on-change="getList()">
          <Option value="-1">全部</Option>
          <Option value="4">待审核</Option>
          <Option value="7">回退</Option>
          <Option value="9">终止</Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="时间">
        <Date-picker type="daterange" @on-change="getDate" placement="bottom-start"
          placeholder="选择日期" :value="selectDate"></Date-picker>
        <Button class="ml20" type="primary" @click="getList()">搜索</Button>
        <Button class="ml20" type="primary" @click="deleteRow(checkedList)">批量删除</Button>
      </FormItem>
    </Form>
    <baseTable :configure="tableConfig" @getList="getList">
      <Table :columns="tableData.headList" :data="tableData.bodyList" class="table" :border="true"
        :loading="loading" @on-selection-change="arr => checkedList = arr">
        <template slot-scope="{row}" slot="name">
          <router-link :to="{path:currObj.detailUrl + row.resourceId}" class="theme-blue">
            {{row.name}}{{row.code ? `(${row.code})` : ''}}
          </router-link>
        </template>
        <template slot-scope="{row}" slot="percent">
          <Progress :percent="parseInt(row.percent)" :stroke-width="5"></Progress>
        </template>
        <template slot-scope="{row}" slot="status">
          {{AUDIT_DATA_STATUS[row.status]}}
        </template>
        <template slot-scope="{row}" slot="action">
          <router-link :to="{path:currObj.detailUrl + row.resourceId,query:{isAudit:true}}"
            v-if="row.status==4" class="theme-blue action-btn">审核
          </router-link>
          <router-link :to="{path:currObj.addUrl,query:{id:row.resourceId,saveType: 'audit'}}"
            v-if="![7,9].includes(row.status)" class="theme-blue action-btn ml5">修改
          </router-link>
          <a class="theme-blue action-btn ml5" v-if="operates.includes('process') "
            @click="getVenueAuditProcess(row.resourceId)">流程</a>
          <dropCode class="control" v-if="row.status===1 && operates.includes('list_detail')" :id="'qrcode' + row.resourceId"
            :value="$store.state.app.userInfo.h5Domain+'/#' + currObj.viewUrl +row.id">
            <span class="control">预览</span>
          </dropCode>
          <a class="theme-blue action-btn ml5" v-if="row.status!=4"
            @click="deleteRow(row.resourceId)">删除</a>
        </template>
      </Table>
    </baseTable>
    <Modal v-model="modal" title="审批流程" footer-hide>
      <auditProcess :data="processData"></auditProcess>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auditProcess from "@components/auditProcess/auditProcess.vue";
import baseTable from "@components/baseTable/baseTable.vue";
import { delVenuesAuditList, getAuditBaseList } from "@service/audit";
import { getVenueAuditProcess } from "@service/place";
import { AppModule } from "@store/modules/app";
import { AUDIT_DATA_STATUS } from "@constant/index";

@Component({
  components: {
    baseTable,
    auditProcess
  }
})
export default class vunuesAudit extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private loading: boolean = true;
  private AUDIT_DATA_STATUS: any = AUDIT_DATA_STATUS;
  private tableData: any = {
    headList: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "",
        align: "left",
        slot: "name"
      },
      {
        title: "资料完整度",
        align: "left",
        slot: "percent"
      },
      {
        title: "提交时间",
        key: "createTime",
        align: "center",
        sortable: true
      },
      {
        title: "创建者",
        key: "userName",
        align: "center"
      },
      {
        title: "审核状态",
        slot: "status",
        align: "center"
      },
      {
        title: "操作",
        width: 200,
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  private selectDate = ["", ""];
  private params: any = {
    type: "",
    code: "", //编号
    name: "", //名称
    status: "-1", //审核状态
    startTime: "", //开始时间
    endTime: "" //结束时间
  };
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };

  private resourceObjs: any = {
    experience: {
      name: "体验基地名称",
      type: "CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE",
      detailUrl: "/experience-detail/",
      addUrl: "/experience-add/",
      viewUrl: "/experience-desc/"
    },
    inherit: {
      name: "传习保护示范基地名称",
      type: "CONTENT_TYPE_HERITAGE_TEACHING_BASE",
      detailUrl: "/inherit-detail/",
      addUrl: "/inherit-add/",
      viewUrl: "/inheritance-desc/"
    },
    protect: {
      name: "生产性保护示范基地名称",
      type: "CONTENT_TYPE_HERITAGE_PROTECT_BASE",
      detailUrl: "/protect-detail/",
      addUrl: "/protect-add/",
      viewUrl: "/inheritance-desc/"
    }
  };
  private currObj: any;
  created() {
    this.init();
  }
  beforeRouteUpdate(to:any, from:any, next: Function) {
    this.reset();
    this.init(to.params.resourceType as string);
    next();
  }
  beforeRouteLeave (to:any, from:any, next: Function) {
    if ( /(-detail\/\d+)|(-add)/.test(to.path) ) {
      to.meta.menu = from.path
    }
    next()
  }
  private init(resourceType?: string): void {
    this.currObj = this.resourceObjs[
      resourceType || this.$route.params.resourceType
    ];
    this.params.type = this.currObj.type;
    this.tableData.headList[1].title = this.currObj.name;
    this.getList();
  }
  private reset(): void {
    this.params = {
      type: "",
      code: "", //编号
      name: "", //名称
      status: "-1", //审核状态
      startTime: "", //开始时间
      endTime: "" //结束时间
    };
    this.selectDate = ["", ""];
    this.currTab = 0;
  }

  private currTab: number = 0;
  //表格数据
  getList(page?: any) {
    if (page) {
      Object.assign(this.params, page);
    } else {
      this.params.currPage = 1;
    }
    this.loading = true;
    let parmas = { ...this.params };
    if (parmas.status == "-1") delete parmas.status;
    getAuditBaseList(parmas)
      .then((res: any) => {
        if (res.code === 0) {
          res.datas.forEach((d: any) => {
            if (d.status === 4) d._disabled = true;
          });
          this.tableData.bodyList = res.datas;
          this.tableConfig.page = res.page;
        }
      })
      .finally(() => {
        this.loading = false;
        this.getAuditCount();
      });
  }

  private waitNum: any = 0; //待审核
  //待审核数量/不通过数量
  private getAuditCount() {
    getAuditBaseList({
      type: this.params.type,
      status: 4
    }).then((res: any) => {
      if (res.code === 0) {
        this.waitNum = res.page.total;
      }
    });
  }

  private checkedList: any[] = [];
  //删除行
  deleteRow(ids: number | any[]): void {
    if (Object.prototype.toString.call(ids) === "[object Number]") {
      ids = ids;
    } else if (Object.prototype.toString.call(ids) === "[object Array]") {
      if ((ids as any).length === 0) {
        this.$Message.info("请选勾选数据！");
        return;
      } else {
        ids = (ids as any).map((d: any) => d.id).toString();
      }
    } else {
      return;
    }
    let config: any = {
      title: "操作提示",
      content: `确认要删除所选数据？`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        delVenuesAuditList({
          ids,
          type: this.params.type
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("删除成功");
            this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  //获取时间
  getDate(value: any) {
    (this.params as any).startTime = value[0];
    (this.params as any).endTime = value[1];
    this.getList();
  }

  //获取状态
  setStatus(index: number) {
    this.params.status = [, 4, 79][index];
    this.getList();
  }

  //tab 状态待审核数量
  private waitLabel(h: any) {
    return h("div", [
      h("span", "待审核"),
      h("Badge", {
        props: {
          count: this.waitNum
        }
      })
    ]);
  }

  // 获取审核流程信息
  private modal: boolean = false;
  private processData: any = {};

  private getVenueAuditProcess(id: any, resourceType: string) {
    this.modal = true;
    getVenueAuditProcess({ id }).then((res: any) => {
      if (res.code === 0) {
        this.processData = res.data;
      }
    });
  }
}
</script>

<style scoped lang="scss">
.venues-audit {
  padding: 0 15px 15px;
  .wrap {
    background: $grayLight;
    margin-bottom: 15px;
    padding-top: 15px;
  }
  .page {
    float: right;
    margin-top: 20px;
  }
  .table {
    .child {
      color: $theme;
      padding-left: 30px;
      position: relative;
      margin-left: 10px;
    }
  }
}
</style>
