<template>
  <div class="container pd15">
    <div>
      <div class="wrap">
        <Form :label-width="100" inline>
          <FormItem class="item" label="关键字">
            <Input
              placeholder="姓名/单位/手机号"
              v-model.trim="params.keyword"
              @on-enter="handleSubmit"
              style="width:150px"
            />
          </FormItem>
          <FormItem class="item" label="使用状态">
            <Select
              class="w150"
              style="width:150px"
              v-model="params.useStatus"
              @on-change="handleSubmit"
            >
              <Option value="-1">不限</Option>
              <Option value="0">未使用</Option>
              <Option value="1">已使用</Option>
            </Select>
          </FormItem>
          <div class="submit">
            <Button type="primary" class @click="handleSubmit">搜索</Button>
            <Button
              type="primary"
              class="btn-primary ml10"
              @click="addModle = true;modalTitle='添加人员'"
            >添加</Button>
            <Button type="default" class="ml10 import-panel">
              <input class="upload-excel" type="file" @change="acceptExcel($event)" />导入
            </Button>
            <Button type="default" class="ml10 import-panel" @click="exportExcel">下载模板</Button>
          </div>
        </Form>
      </div>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          class="table"
          @on-selection-change="setChecked"
        >
          <template slot-scope="{ row }" slot="sex">
            <div>{{ setSex(parseInt(row.sex)) }}</div>
          </template>
          <template slot-scope="{ row }" slot="job">
            {{
            row.job || "-"
            }}
          </template>
          <template slot-scope="{ row }" slot="useStatus">
            <div v-if="row.useStatus == 0">未使用</div>
            <div v-if="row.useStatus == 1">已使用</div>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a class="theme-blue action-btn" @click="editModalData(row)">修改</a>
            <a class="theme-blue action-btn" @click="deleteRow(row, index)">删除</a>
            <a class="theme-blue action-btn" @click="seeCode(row)">查看邀请码</a>
            <a class="theme-blue action-btn" @click="refreshCode(row)">重新发码</a>
          </template>
        </Table>
      </baseTable>
    </div>
    <Modal v-model="addModle" :title="modalTitle" :width="400" footer-hide>
      <Form :model="modalData" :rules="modalDataValidate" ref="modalForm">
        <FormItem label="姓名：" :label-width="90" prop="name">
          <Input v-model="modalData.name" :maxlength="20" placeholder="请输入真实姓名" />
        </FormItem>
        <FormItem label="单位名称：" :label-width="90" prop="companyName">
          <Input v-model="modalData.companyName" :maxlength="50" placeholder="请输入单位名称" />
        </FormItem>
        <FormItem label="职务：" :label-width="90">
          <Input v-model="modalData.job" :maxlength="20" placeholder="请输入职务" />
        </FormItem>
        <FormItem label="性别：" :label-width="90">
          <Select class="w150" v-model="modalData.sex">
            <Option value="0">保密</Option>
            <Option value="1">男</Option>
            <Option value="2">女</Option>
          </Select>
        </FormItem>
        <FormItem label="联系电话：" :label-width="90" prop="phone">
          <Input v-model="modalData.phone" placeholder="请输入联系电话" />
        </FormItem>
        <FormItem :label-width="90">
          <Button class="btn" @click="onAddModalCancel">取消</Button>
          <Button class="btn" @click="onAddModalSave" type="primary" style="margin-left:20px;">确认</Button>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="addModalSpinShow"></Spin>
    </Modal>
    <Modal v-model="seeCodeModal" title="查看邀请码" :width="400" footer-hide>
      <div class="invite-code">
        邀请码： {
        <b>{{ inviteData.inviteCode }}</b> }
        <span v-if="inviteData.useStatus == 0" class="unused">未使用</span>
        <span v-if="inviteData.useStatus == 1" class="used">{{ inviteData.useTime }}已使用,邀请码失效</span>
      </div>
      <div class="text-center">
        <Button class="btn" @click="cancelSeeModal" type="primary" style="margin-left:20px;">知道了</Button>
      </div>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";
import { importExcelComplete, validate, exportExcel } from "@util/comm";
import { cookies } from "@util/util";
import {
  betaUserList,
  betaUserSave,
  betaUserDelete,
  betaUserImportUser,
  refreshCode
} from "@service/tool";
@Component({
  components: {
    baseTable
  }
})
export default class peopleManagement extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //获取token
  get token() {
    return AppModule.token;
  }
  private exportExcel() {
    exportExcel(
      CONFIG.defaultUrl +
        "/user/betaUser/excelTemplate?token=" +
        cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`)
    );
    return false;
  }
  /*S 新增弹窗 */
  private addModle = false;
  private modalTitle = "添加人员";
  // 添加弹窗loading动画
  private addModalSpinShow = false;
  // 弹窗表单验证
  private modalDataValidate = {
    name: [
      { required: true, message: "请输入姓名", trigger: "blur" },
      { max: 20, message: "名称不超过10个字符", trigger: "blur" }
    ],
    companyName: [
      { required: true, message: "请输入单位名称", trigger: "blur" },
      { max: 50, message: "单位名称不超过50个字符", trigger: "blur" }
    ],
    phone: [
      {
        required: true,
        message: "号码填写错误",
        trigger: "blur",
        validator: this.checkedPhone
      }
    ]
  };
  // 手机号
  private checkedPhone(rule: any, value: any, callback: any) {
    if (value) {
      if (!validate(value, "phone")) {
        return callback(new Error("号码填写错误"));
      }
      callback();
    }
    callback();
  }
  private modalData = {
    name: "",
    companyName: "",
    job: "",
    sex: "",
    phone: "",
    id: ""
  };
  // 点击取消按钮隐藏弹窗
  private onAddModalCancel() {
    this.addModle = false;
    this.resetModalData();
  }
  // 设置性别
  private setSex(sex: number) {
    if (!sex && sex !== 0) {
      return "-";
    }
    switch (sex) {
      case 0:
        return "保密";
      case 1:
        return "男";
      case 2:
        return "女";
      default:
        break;
    }
  }

  // 点击确定按钮
  private onAddModalSave() {
    (this.$refs.modalForm as Vue).validate((valid: boolean) => {
      if (valid) {
        this.addModalSpinShow = true;
        this.saveModal();
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  //保存人员
  saveModal() {
    betaUserSave(this.modalData)
      .then((res: any) => {
        this.addModalSpinShow = false;
        if (res.code === 0) {
          this.addModle = false;
          this.$Message.success(`${this.modalTitle}成功`);
          this.resetModalData();
          // 重新获取列表
          this.getList();
        }
      })
      .catch(err => {
        this.addModalSpinShow = false;
      });
  }
  editModalData(row: any) {
    this.modalTitle = "修改资料";
    this.addModle = true;
    this.modalData.name = row.name;
    this.modalData.companyName = row.companyName;
    this.modalData.job = row.job;
    this.modalData.sex = row.sex;
    this.modalData.id = row.id;
    this.modalData.phone = row.phone;
  }
  /*E 新增弹窗 */
  // 重新设置添加编辑弹窗的form表单值
  private resetModalData() {
    (this.$refs.modalForm as Vue).resetFields();
    this.modalData.job = "";
    this.modalData.sex = "";
    this.modalData.id = "";
  }
  /*S 重新发码*/
  private refreshCode(row: any) {
    this.spinShow = true;
    refreshCode({
      id: row.id
    })
      .then((res: any) => {
        if (res.code === 0) {
          this.$Message.success("重新发码成功");
          this.getList();
        }
      })
      .finally(() => {
        this.spinShow = false;
      });
  }
  /*E 重新发码*/
  /* S 导入 */
  private spinShow: boolean = false;
  private acceptExcel(e: any) {
    let _this = this;
    let files = e.target.files;
    let formData = new FormData();

    formData.append("file", files[0]);
    formData.append("token", this.token);
    this.spinShow = true;
    betaUserImportUser(formData)
      .then((blob: any) => {
        importExcelComplete(blob)
          .then(res => {
            this.$Message.success("导入成功");
            _this.tableConfig.page.currPage = 1;
            _this.getList();
          })
          .catch(res => {
            this.$Message.error(res.message);
          });
      })
      .finally(() => {
        _this.spinShow = false;
        e.target.value = null;
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
  /*S 搜索 */
  private params: any = {
    useStatus: "-1", //使用状态 0未用 1已使用 用-1来处理下拉选中，在请求前再将-1替换""
    keyword: "" //关键字
  };
  handleSubmit() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  /*E 搜索 */
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
          title: "姓名",
          key: "name",
          align: "left",
          width: 150
        },
        {
          title: "性别",
          key: "sex",
          slot: "sex",
          align: "center"
        },
        {
          title: "单位名称",
          key: "companyName",
          align: "center"
        },
        {
          title: "职务",
          key: "job",
          slot: "job",
          align: "center"
        },
        {
          title: "电话",
          key: "phone",
          align: "center",
          width: 120
        },
        {
          title: "时间",
          key: "createTime",
          align: "center"
        },
        {
          title: "邀请码状态",
          key: "useStatus",
          slot: "useStatus",
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
    betaUserList({
      ...this.params,
      useStatus: this.params.useStatus === "-1" ? "" : this.params.useStatus
    })
      .then((res: any) => {
        if (res.code === 0) {
          _this.tableData.bodyList = res.datas as [];
          _this.checkedIds = "";
          _this.footerList = [];
          _this.tableConfig.page = res.page ? res.page : {};
        }
      })
      .finally(() => {
        _this.loading = false;
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

  //删除行
  deleteRow(item: any, index: any) {
    let _this: any = this,
      checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
    if (index === -1 && !checkedLen) {
      _this.$Message.error("请选择你要删除的人员");
      return;
    }
    let config: any = {
      title: "操作提示",
      content: `确认要删除“${item.name ||
        "选中的" + checkedLen + "条"}”数据吗？`,
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        betaUserDelete({
          ids: index == -1 ? _this.checkedIds : item.id
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
  //查看邀请码
  private seeCodeModal = false;
  private inviteData = {
    inviteCode: "", //邀请码
    useStatus: -1, //邀请码使用状态
    useTime: "" //邀请码使用时间
  };

  seeCode(row: any) {
    this.seeCodeModal = true;
    this.inviteData.inviteCode = row.inviteCode;
    this.inviteData.useStatus = row.useStatus;
    this.inviteData.useTime = row.useTime;
  }
  cancelSeeModal() {
    this.seeCodeModal = false;
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
        // submitBatch({
        //   ids: index == -1 ? _this.checkedIds : item.id,
        //   type: "CONTENT_TYPE_VENUE" //场馆资源类型
        // }).then((res: any) => {
        //   if (res.code === 0) {
        //     _this.$Message.success("提交成功");
        //     _this.getList();
        //   }
        // });
      }
    };
    this.$Modal.confirm(config);
  }

  /*E 底部操作按钮*/
  mounted() {
    this.getList();
  }
}
</script>

<style scoped lang="scss">
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
.invite-code {
  height: 50px;
  color: #333;
  b {
    color: #000;
  }
  .unused {
    color: red;
  }
  .used {
    color: #ccc;
  }
}
</style>
