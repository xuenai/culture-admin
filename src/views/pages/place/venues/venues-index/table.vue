<template>
  <div>
    <div>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          class="table"
          :loading="loading"
          @on-selection-change="setChecked"
        >
          <template slot-scope="{row,index}" slot="venuesMsg">
            <div class="clearfix venues-msg">
              <div class="msg-panel">
                <p class="venues-name">
                  <span
                    class="red"
                    v-if="row.recommendHomePage === 1 ||row.recommendChannelHomePage === 1 "
                  >[推荐]</span>
                  <span class="red" v-if="row.top === 1">[置顶]</span>
                  <router-link
                    :to="{path:'/venues-detail',query:{id:row.id,type:'list'}}"
                    class="theme-blue venues-tag"
                  >{{row.name}}（{{row.code}}）</router-link>
                </p>
                <p class="address">
                  <i class="cloud-icon">&#xe606;</i>
                  {{row.regionName}} {{row.address}}
                </p>
              </div>
            </div>
          </template>
           <template slot-scope="{row,index}" slot="venueLevel">
            {{row.venueLevel||'-'}}
          </template>
          <template slot-scope="{row,index}" slot="sort">
            <span v-if="!order">{{row.sort}}</span>
            <Input v-else @on-change="changeSort(row)" v-model="row.sort" />
          </template>
          <template slot-scope="{row,index}" slot="backlogName">
            <span v-if="row.status===4||row.status===5">{{row.backlogName}}</span>
            <span v-else-if="row.status===3">无</span>
            <span v-else>结束</span>
          </template>
          <template slot-scope="{row,index}" slot="status">
            <div v-if="row.status == 1">
              <span class="switchLabel">正常</span>
              <span class="switchBox" @click="changeStatus(row,'禁用')">
                <i-switch :value="row.status == 1" />
                <span class="cover"></span>
              </span>
            </div>
            <div v-else-if="row.status == 2">
              <span class="switchLabel">禁用</span>
              <span class="switchBox" @click="changeStatus(row,'启用')">
                <i-switch :value="row.status == 1" />
                <span class="cover"></span>
              </span>
            </div>
            <div v-else-if="row.status==3">草稿</div>
            <div v-else-if="row.status==4">待审核</div>
            <div v-else-if="row.status==5">审核中</div>
            <div v-else-if="row.status==6">审核通过</div>
            <div v-else-if="row.status==7">回退</div>
            <div v-else-if="row.status==8">撤回</div>
            <div v-else-if="row.status==9">终止</div>
            <div v-else-if="row.status==10">等待回调</div>
          </template>
          <template slot-scope="{row,index}" slot="action">
            <router-link
              tag="a"
              :to="{path:'/venues-reserve',query:{venueId:row.id}}"
              class="theme-blue action-btn"
              v-if="operates.includes('venue_book')&&row.status==1"
            >场馆预约</router-link>
            <router-link
              tag="a"
              :to="{path:'/room-list',query:{venueId:row.id}}"
              v-if="operates.includes('activity_room') && row.status===1&&row.showProcess===1"
              class="theme-blue action-btn"
            >活动室</router-link>
            <dropCode
              v-if="row.status === 1"
              :id="'qrcode' + row.id"
              :key="'qrcode' + row.id"
              :value="$store.state.app.userInfo.h5Domain+'/#/venues-detail/' +row.id"
            >
              <span class="theme-blue action-btn">预览</span>
            </dropCode>
            <a
              class="theme-blue action-btn"
              v-if="operates.includes('submit')&&row.status===3"
              @click="submitCol(row,index)"
            >提交</a>
            <router-link
              tag="a"
              :to="{path:'/venues-edit',query:{id:row.id,type:'list'}}"
              v-if="operates.includes('edit')&&row.status!==9 && row.status!==4&&row.status!==5&&row.showProcess===1"
              class="theme-blue action-btn"
            >修改</router-link>
            <a
              class="theme-blue action-btn"
              v-if="operates.includes('process')&& row.status!==3&&row.showProcess===1"
              @click="getAuditProcess(row.id)"
            >流程</a>
            <a
              class="theme-blue action-btn"
              v-if="operates.includes('recall')&& row.status===4"
              @click="setWithdraw(row)"
            >撤回</a>
            <a
              class="theme-blue action-btn"
              v-if="operates.includes('delete')&&row.status!==4 &&row.status!==5"
              @click="deleteRow(row,index)"
            >删除</a>
          </template>
        </Table>
      </baseTable>
      <footerButtons
        type="CONTENT_TYPE_VENUE"
        :selectionList="footerList"
        :orderRowData="orderRowData"
        @changeOrder="changeOrder"
        @getList="getList"
      >
        <Button
          type="primary"
          :disabled="order"
          v-if="operates.includes('batchDelete')"
          @click="deleteRow(checkedIds,-1)"
        >批量删除</Button>
        <Button
          type="primary"
          :disabled="order"
          v-if="operates.includes('batchSave')"
          @click="submitCol(checkedIds,-1)"
        >批量提交</Button>
        <Button
          type="default"
          class="ml10 import-panel"
          v-if="operates.includes('import')"
          :disabled="order"
        >
          <input class="upload-excel" type="file" @change="acceptExcel($event)" />导入
        </Button>
        <Button
          type="default"
          class="ml10 outExcel"
          :disabled="order"
          v-if="operates.includes('export')"
        >
          <a @click="outExcel($event)">导出</a>
        </Button>
      </footerButtons>
    </div>
    <Modal v-model="modal" title="审批流程" footer-hide>
      <auditProcess :data="processData"></auditProcess>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import auditProcess from "@components/auditProcess/auditProcess.vue";
import footerButtons from "@components/footerButtons/footerButtons.vue";
import dropCode from "@components/DropCode/DropCode.vue";
import { updateStatus } from "@service/common";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";
import { importExcelComplete } from "@util/comm";
import {
  getVenuesList,
  deleteCol,
  submitBatch,
  venueWithdraw,
  getVenueAuditProcess,
  venueImportExcel
} from "@service/place";
@Component({
  components: {
    baseTable,
    auditProcess,
    footerButtons,
    dropCode
  }
})
export default class topicTable extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //获取token
  get token() {
    return AppModule.token;
  }
  /*S 导出*/
  private outExcelApi: string =
    CONFIG.defaultUrl + "/res/site/ctcVenue/exportExcel?";
  outExcel(e: any) {
    let _target = e.target as HTMLInputElement,
      _this = this;

    let checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
    if (checkedLen < 1) {
      this.$Message.error("请选择需要导出的数据！");
    } else {
      _target.setAttribute(
        "href",
        this.outExcelApi + "token=" + this.token + "&ids=" + this.checkedIds
      );
    }
  }
  /*E 导出*/
  /* S 导入 */
  private spinShow: boolean = false;
  private acceptExcel(e: any) {
    let _this = this;
    let files = e.target.files;
    let formData = new FormData();
    formData.append("file", files[0]);
    formData.append("token", this.token);
    this.spinShow = true;
    venueImportExcel(formData).then((blob: any) => {
      _this.spinShow = false;
      importExcelComplete(blob)
        .then(res => {
          this.$Message.success("导入成功");
        })
        .finally(() => {
          _this.tableConfig.page.currPage = 1;
          _this.getList();
        });
    });
  }
  /* E 导入 */
  //登录端判断
  private isSite: boolean = this.$store.state.app.userInfo.dataType === "SITE";
  //弹窗是否显示
  private disableShow: boolean = false;
  //表格加载动画
  private loading: boolean = true;
  //switch 切换状态
  private statusShow: boolean = false;
  //表格数据
  private tableData: any = {
    headList: [],
    bodyList: []
  };
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  private params: any = {};

  //表格数据
  getList(data: any = this.tableConfig.page) {
    let _this = this;
    if (_this.isSite) {
      //站点端
      _this.tableData.headList = [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "场馆信息",
          key: "venuesMsg",
          slot: "venuesMsg",
          align: "left",
          width: 400
        },
        {
          title: "类型",
          key: "type",
          align: "center"
        },
        {
          title: "等级",
          slot: "venueLevel",
          align: "center"
        },
        {
          title: "时间",
          key: "createTime",
          align: "center"
        },
        {
          title: "创建者",
          key: "createUser",
          align: "center"
        },
        {
          title: "排序",
          key: "sort",
          slot: "sort",
          align: "center",
          width: 120
        },
        {
          title: "状态",
          key: "status",
          slot: "status",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          slot: "action"
        }
      ];
    } else {
      //企业端
      _this.tableData.headList = [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "场馆信息",
          key: "venuesMsg",
          slot: "venuesMsg",
          align: "left",
          width: 400
        },
        {
          title: "类型",
          key: "type",
          align: "center"
        },
        {
          title: "时间",
          key: "createTime",
          align: "center"
        },
        {
          title: "创建者",
          key: "createUser",
          align: "center"
        },
        {
          title: "待办人",
          key: "backlogName",
          slot: "backlogName",
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          slot: "status",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          slot: "action"
        }
      ];
    }
    this.params = Object.assign(this.params, data); //搜索条件
    getVenuesList(this.params).then((res: any) => {
      if (res.code === 0) {
        _this.tableData.bodyList = res.datas as [];
        _this.loading = false;
        _this.checkedIds = "";
        _this.footerList = [];
        _this.tableConfig.page = res.page ? res.page : {};
      }
    });
  }

  //  更新状态值
  private changeStatus(row: any, title: string) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      content: "确认是否" + title + "？",
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.adPosition(row);
      }
    };
    this.$Modal.confirm(config);
  }

  //   广告位开启、禁用
  private adPosition(row: any) {
    let _this = this;
    let status = 2;
    if (row.status == 2) {
      status = 1;
    }
    let param = {
      id: row.id,
      status: status,
      resourceType: "CONTENT_TYPE_VENUE"
    };
    updateStatus(param).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("更新成功!");
        _this.getList();
      }
    });
  }

  //删除行
  deleteRow(item: any, index: any) {
    let _this: any = this,
      checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
    if (index === -1 && !checkedLen) {
      _this.$Message.error("请选择你要删除的场馆");
      return;
    }
    let config: any = {
      title: "操作提示",
      content: `确认要删除“${item.name ||
        "选中的" + checkedLen + "条"}”数据吗？删除后用户端将不再展示！`,
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        deleteCol({
          ids: index == -1 ? _this.checkedIds : item.id,
          type: "CONTENT_TYPE_VENUE" //场馆资源类型
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("删除成功");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  // 获取审核流程信息
  private modal: boolean = false;
  private processData: any = {};

  private getAuditProcess(id: any) {
    this.modal = true;
    getVenueAuditProcess({ id: id }).then((res: any) => {
      this.processData = res.data;
    });
  }

  //撤回
  setWithdraw(item: any) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      content: `确认要撤回？`,
      okText: "确认撤回",
      cancelText: "取消",
      onOk: () => {
        venueWithdraw({
          resourceId: item.id
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("操作成功");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  /*S 底部操作按钮*/
  private order: boolean = false; // 是否开启排序功能
  private changeOrder(b: boolean) {
    this.order = b;
  }

  // 修改排序行的数据
  private orderRowData: object = {};

  private changeSort(row: any) {
    this.orderRowData = row;
  }

  private footerList: Array<Object> = [];
  // 复选框ID
  private checkedIds: string = "";

  // 复选框
  private setChecked(e: any) {
    let checkedIds: any = [];
    this.footerList = e;
    e.map((item: any) => {
      checkedIds.push(item.id as Number);
    });
    this.checkedIds = checkedIds.join(",");
  }

  //提交||批量提交
  submitCol(item: any, index: any) {
    let _this = this,
      checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
    if (index === -1 && !checkedLen) {
      _this.$Message.error("请选择你要提交的场馆");
      return;
    }
    let config: any = {
      title: "操作提示",
      content: `确认要提交“${item.name ||
        "选中的" + checkedLen + "条"}”数据吗？`,
      okText: "确认提交",
      cancelText: "取消",
      onOk: () => {
        submitBatch({
          ids: index == -1 ? _this.checkedIds : item.id,
          type: "CONTENT_TYPE_VENUE" //场馆资源类型
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("提交成功");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  /*E 底部操作按钮*/
  mounted() {
    let _this = this;
    //搜索条件
    _this.bus.$on("requestVenuesList", (res: any) => {
      this.tableConfig = {
        page: {
          currPage: 1,
          pageSize: 10,
          total: 6
        },
        pagePosition: "right"
      };
      _this.params = res;
      _this.getList();
    });
    _this.getList();
  }
}
</script>

<style scoped lang="scss">
.table {
  margin-top: 15px;
  .action-btn {
    cursor: pointer;
    white-space: nowrap;
    & + .action-btn {
      margin-left: 5px;
    }
  }
  .venues-msg {
    padding: 8px 0;
    .img {
      width: 100px;
      height: 60px;
    }
    .venues-name {
      margin-top: 7px;
      text-align: left;
    }
    .venues-tag {
      display: inline-block;
    }
    .address {
      margin-top: 7px;
      white-space: normal;
      color: $font06;
    }
  }
  .switchLabel {
    margin-right: 5px;
  }
  .switchBox {
    position: relative;
    display: inline-block;
    .cover {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.import-panel {
  position: relative;
  .upload-excel {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
}
.outExcel {
  a {
    color: #515a6e;
  }
}
</style>
