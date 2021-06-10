<template>
  <div class="container pd15">
    <div class="wrap">
      <Form :label-width="50" inline>
        <FormItem class="item" label="编号">
          <Input placeholder="请输入编号" v-model="params.code" @on-enter="getSearch" />
        </FormItem>
        <FormItem class="item" label="名称">
          <Input placeholder="请输入景区名称" v-model="params.name" @on-enter="getSearch" />
        </FormItem>
        <FormItem class="item" label="状态">
          <Select class="w150" v-model="params.status" @on-change="getSearch">
            <Option value selected>全部</Option>
            <Option value="1">正常</Option>
            <Option value="2">禁用</Option>
            <Option value="3">草稿</Option>
            <Option value="4">待审核</Option>
            <Option value="7">回退</Option>
            <Option value="8">撤回</Option>
            <Option value="9">终止</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="等级">
          <Select class="w150" v-model="params.level" @on-change="getSearch">
            <Option value>全部</Option>
            <Option value="AAAAA">AAAAA</Option>
            <Option value="AAAA">AAAA</Option>
            <Option value="AAA">AAA</Option>
            <Option value="AA">AA</Option>
            <Option value="A">A</Option>
            <Option value="无等级">无等级</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="时间">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            @on-change="changeDate"
          ></Date-picker>
        </FormItem>
        <div class="submit" @click="getSearch">
          <Button type="primary">搜索</Button>
          <!-- <router-link
            to="/scenic-add"
            class="btn-primary ml10"
            v-if="operates.includes('save') && $store.state.app.userInfo.dataType !== 'SITE'"
          >添加</router-link> -->
          <router-link
            to="/scenic-search"
            class="btn-primary ml10"
            v-if="operates.includes('save')"
          >添加</router-link>
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
        <template slot-scope="{row}" slot="scenicMsg">
          <div class="clearfix scenic-msg">
            <div class="fl msg-panel">
              <p class="scenic-name text-left">
                <span
                  class="red"
                  v-if="row.recommendHomePage === 1 ||row.recommendChannelHomePage === 1 "
                >[推荐]</span>
                <span class="red" v-if="row.top === 1">[置顶]</span>
                <router-link
                  :to="{path: '/scenic-detail', query: {id: row.id,type:'list'}}"
                  tag="a"
                  class="theme-blue venues-tag"
                >{{row.name}}({{row.code}})</router-link>
              </p>
              <p class="address" v-if="row.address">
                <i class="cloud-icon">&#xe606;</i>
                {{row.address}}
              </p>
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="level">{{row.level||'无'}}</template>
        <template slot-scope="{row,index}" slot="sort">
          <span v-if="!sort">{{row.sort}}</span>
          <InputNumber v-else @on-change="changeSort(row)" v-model="row.sort" />
        </template>
        <template slot-scope="{row,index}" slot="backlogName">
          <span v-if="row.status===4||row.status===5">{{row.backlogName}}</span>
          <span v-else-if="row.status===3">无</span>
          <span v-else>结束</span>
        </template>
        <template slot-scope="{row, index}" slot="status">
          <div v-if="row.status === 1">
            正常
            <span class="switch">
              <i-switch :value="true" />
              <i class="cover" @click="changeState(row, index)"></i>
            </span>
          </div>
          <div v-if="row.status === 2">
            禁用
            <span class="switch">
              <i-switch :value="false" />
              <i class="cover" @click="changeState(row, index)"></i>
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
        <template slot-scope="{row, index}" slot="action">
          <router-link
            class="theme-blue action-btn"
            tag="a"
            :to="{path: '/attractions-list', query: {id: row.id}}"
            v-if="operates.includes('attractions')&& row.status==1&&row.showProcess===1"
          >景点</router-link>
          <dropCode
            v-if="row.status === 1"
            :id="'qrcode' + row.id"
            :key="'qrcode' + row.id"
            :value="$store.state.app.userInfo.h5Domain+'/#/scenic-detail/' +row.id"
          >
            <span class="theme-blue action-btn">预览</span>
          </dropCode>
          <a
            href="javascript:;"
            class="theme-blue action-btn"
            v-if="row.status !== 3 && row.status !== 8 && operates.includes('process')&&row.showProcess===1"
            @click="getContentAuditProcess(row)"
          >流程</a>
          <a
            href="javascript:;"
            class="theme-blue action-btn"
            v-if="row.status === 3&& operates.includes('submit')"
            @click="changeState(row, index)"
          >提交</a>
          <router-link
            class="theme-blue action-btn"
            tag="a"
            :to="{path: '/scenic-edit', query: {id: row.id,type:'list'}}"
            v-if="operates.includes('edit') && row.status !== 6 && row.status !== 4&&row.status!==5&&row.showProcess===1"
          >修改</router-link>
          <a
            class="theme-blue action-btn"
            v-if="operates.includes('recall')&& row.status==4"
            @click="setWithdraw(row)"
          >撤回</a>
          <a
            to
            class="theme-blue action-btn"
            @click="del(row, index)"
            v-if="row.status !== 4 &&row.status!==5 && operates.includes('delete')"
          >删除</a>
        </template>
      </Table>
    </baseTable>
    <footerButtons
      type="CONTENT_TYPE_SCENERY"
      :selectionList="footerList"
      :orderRowData="orderRowData"
      @changeOrder="changeOrder"
      @getList="getList"
      class="operate"
    >
      <Button
        type="primary"
        v-if="operates.includes('batchSave')"
        :disabled="sort"
        class="ml10"
        @click="changeState(checkedBox, -1)"
      >批量提交</Button>
      <Button
        type="primary"
        v-if="operates.includes('batchDelete')"
        :disabled="sort"
        class="ml10"
        @click="del(checkedBox, -1)"
      >批量删除</Button>
      <Button
        type="default"
        class="ml10 import-panel"
        :disabled="sort"
        v-if="operates.includes('import')"
      >
        <input class="upload-excel" type="file" @change="acceptExcel($event)" />导入
      </Button>
      <Button
        type="default"
        class="ml10 outExcel"
        :disabled="sort"
        v-if="operates.includes('export')"
      >
        <a @click="outExcel($event)">导出</a>
      </Button>
    </footerButtons>
    <Modal v-model="modal" title="审批流程" footer-hide>
      <auditProcess :data="processData"></auditProcess>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getScenicList,
  deleteResourceById,
  commonUpdateStatus,
  getScenicAuditProcess,
  submitBatchById,
  scenicWithdraw,
  scenicImportExcel
} from "@service/place";
import baseTable from "@components/baseTable/baseTable.vue";
import footerButtons from "@components/footerButtons/footerButtons.vue";
import auditProcess from "@components/auditProcess/auditProcess.vue";
import dropCode from "@components/DropCode/DropCode.vue";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";
import { importExcelComplete } from "@util/comm";
interface paramsType {
  code: string;
  startTime: string;
  endTime: string;
  name: string;
  status: string;
  level: string;
}

@Component({
  components: {
    baseTable,
    footerButtons,
    auditProcess,
    dropCode
  }
})
export default class list extends Vue {
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
    CONFIG.defaultUrl + "/res/site/ctcScenic/exportExcel?";
  outExcel(e: any) {
    let _target = e.target as HTMLInputElement,
      _this = this;
    if (_this.checkedBox.length < 1) {
      this.$Message.error("请选择需要导出的数据！");
    } else {
      _target.setAttribute(
        "href",
        this.outExcelApi +
          "token=" +
          this.token +
          "&ids=" +
          this.checkedBox.join(",")
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
    scenicImportExcel(formData).then((blob: any) => {
      _this.spinShow = false;
      // importExcelComplete(blob, function () {
      //     _this.$Message.success('导入成功');
      //     _this.tableConfig.page.currPage = 1;
      //     _this.getList();
      // })
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
  // 排序
  private orderRowData: object = {};
  private footerList: Array<Object> = [];
  private sort: boolean = false; // 是否开启排序功能
  // 流程
  private processData: any = {};
  private modal: boolean = false;
  // 列表参数
  private loading: Boolean = true;
  private params: paramsType = {
    code: "", // 编码
    name: "", // 名称
    status: "", // 状态
    level: "", // 等级
    startTime: "", // 开始时间
    endTime: "" // 结束时间
  };
  // 复选框ID
  private checkedBox: Array<Number> = [];

  // 复选框
  private setChecked(e: any) {
    this.checkedBox = [];
    this.footerList = e;
    e.map((item: any) => {
      this.checkedBox.push(item.id as Number);
    });
  }

  //   日历
  private changeDate(e: Array<string>) {
    this.params.startTime = e[0];
    this.params.endTime = e[1];
    this.getSearch();
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
  private changeState(item: any, index: any) {
    // @ts-ignore
    if (!this.operates.includes("status")) {
      return;
    }
    if (index === -1 && item.status !== 3 && !this.checkedBox.length) {
      this.$Message.error("请选择要提交的景区！");
      return;
    }
    let config: any = {
      title:
        index !== -1 && item.status !== 3
          ? item.status === 2
            ? "启用景区"
            : "禁用景区"
          : "提交景区",
      content:
        index !== -1 && item.status !== 3
          ? item.status === 2
            ? `确认是否启用“${item.name || ""}”景区？`
            : `确认要禁用“${item.name || ""}”景区？禁用后用户端将不显示景区！`
          : `确定要提交${item.name || "选中"}景区？`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        // 改变状态
        if (index !== -1 && item.status !== 3) {
          this.commonUpdateStatus(item);
        } else {
          this.submitBatchById(item, index);
        }
      }
    };
    this.$Modal.confirm(config);
  }

  // 批量或者单个提交
  private submitBatchById(item: any, index: any) {
    submitBatchById({
      ids: index !== -1 ? item.id : this.checkedBox.toString(),
      type: "CONTENT_TYPE_SCENERY"
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("提交成功！");
        if (index !== -1) {
          item.status = 4;
        } else {
          this.tableConfig.page.currPage = 1;
          this.getList();
        }
      }
    });
  }

  private commonUpdateStatus(item: any) {
    let params = {
      id: item.id,
      status: item.status === 2 ? 1 : 2,
      resourceType: "CONTENT_TYPE_SCENERY"
    };
    commonUpdateStatus(params).then(data => {
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

  //   分页
  private tableData: any = {
    headList: [],
    bodyList: []
  };

  // 删除
  private del(item: any, index: Number) {
    let _this = this;
    if (index === -1 && !this.checkedBox.length) {
      this.$Message.error("请选择你要删除的景区");
      return;
    }
    let config: any = {
      title: "删除景区",
      content: `确认要删除“${item.name ||
        "选中的" +
          this.checkedBox.length +
          "条"}”数据吗？删除后用户端将不再展示该景区！`,
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        _this.delField(item.id, index);
      }
    };
    this.$Modal.confirm(config);
  }

  // 删除
  private delField(id: Number, index: Number) {
    deleteResourceById({
      ids: index !== -1 ? id : this.checkedBox.toString(),
      type: "CONTENT_TYPE_SCENERY"
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

  // 审批流程
  private getContentAuditProcess(row: any) {
    getScenicAuditProcess({ id: row.id }).then((res: any) => {
      this.processData = res.data;
      this.modal = true;
    });
  }

  private getList(page: any = this.tableConfig.page) {
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
          title: "景区信息",
          key: "scenicMsg",
          slot: "scenicMsg",
          align: "left",
          width: 350
        },
        {
          title: "等级",
          key: "level",
          slot: "level",
          align: "center",
          width: 150
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
          width: 70
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
          title: "景区信息",
          key: "scenicMsg",
          slot: "scenicMsg",
          align: "left",
          width: 350
        },
        {
          title: "等级",
          key: "level",
          slot: "level",
          align: "center",
          width: 150
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
    _this.loading = true;
    Object.assign(_this.params, page);
    getScenicList(_this.params).then(data => {
      _this.tableConfig.page = data.page ? data.page : {};
      _this.tableData.bodyList = data.datas as [];
      _this.loading = false;
      _this.checkedBox = [];
    });
  }

  // 搜索
  private getSearch() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  //撤回
  private setWithdraw(item: any) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      content: `确认要撤回？`,
      okText: "确认撤回",
      cancelText: "取消",
      onOk: () => {
        scenicWithdraw({
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
}
</script>

<style scoped lang="scss">
.operate {
  padding-bottom: 20px;
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

.table {
  margin-top: 15px;
  .action-btn {
    cursor: pointer;
    white-space: nowrap;
    & + .action-btn {
      margin-left: 5px;
    }
  }
  .scenic-msg {
    padding: 8px 0;
    .scenic-name {
      margin-top: 7px;
      text-align: left;
    }
    .scenic-tag {
      display: inline-block;
    }
    .address {
      margin-top: 7px;
      white-space: normal;
      color: $font06;
    }
  }
}

.inp-control {
  width: 70%;
}

.label-name {
  width: 75px;
  line-height: 35px;
}

.w150 {
  width: 150px;
}

.wrap {
  padding: 15px 15px 0 15px;
  background-color: $grayLight;
  .submit {
    display: inline-block;
    margin: 0 0 15px 10px;
  }
  .ivu-form-item {
    margin-bottom: 15px !important;
  }
}

.red {
  padding-right: 5px;
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
