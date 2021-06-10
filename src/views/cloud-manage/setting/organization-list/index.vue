<template>
  <div class="manage">
    <div class="operate">
      <Form ref="searchForm" :model="searchForm" inline class="searchForm">
        <FormItem>
          <Input v-model="searchForm.name" :maxlength="20">
            <span slot="prepend">机构名称</span>
          </Input>
        </FormItem>
        <FormItem class="select-box" label="类型">
          <Select v-model="searchForm.status" placeholder="请选择" class="select">
            <Option value>全部</Option>
            <Option :value="1">正常</Option>
            <Option :value="2">禁用</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search">搜索</Button>
        </FormItem>
      </Form>
      <div class="bottom">
        <Button type="primary" @click="popUp('add')">添加</Button>
        <Button class="btn" @click="exportExcel">导出</Button>
      </div>
    </div>
    <div class="list">
      <div class="item title">
        <div class="name">机构名称</div>
        <div class="status">状态</div>
        <div class="operates">操作</div>
      </div>
      <div v-if="datas.length">
        <div class="item" v-for="item in datas" :key="item.id">
        <div class="name" :class="{em: item.orgLevel === 2}" :style="getPaddingLeft(item.orgLevel - 2)">{{item.orgLevel > 2 ? '|-' + item.name :item.name}}</div>
        <div class="status">
          {{item.status === 1 ? '正常' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="item.status === 1"></i-switch>
            <i class="mask" @click="statusChangeHandle(item)"></i>
          </span>
        </div>
        <div class="operates">
          <span @click="popUp('edit',item.id)">编辑</span>
          <i>|</i>
          <span  @click="deleteHandle(item.id)">删除</span>
        </div>
      </div>
      </div>
      <div v-else class="item no-data">暂无数据</div>
    </div>
    <!-- 弹窗 -->
    <Modal v-model="modal" width="400" class="pop" @on-cancel="handleCancel" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <Form ref="formPop" :model="formPop" :rules="ruleValidate" :label-width="120">
        <FormItem class="pop-item" label="组织机构名称：" prop="name">
          <Input v-model="formPop.name" placeholder="请输入" />
        </FormItem>
        <FormItem class="pop-item" label="上级组织机构：" prop="pid">
          <Select v-model="formPop.pid">
            <Option :value="userInfo.orgId">{{userInfo.name}}</Option>
            <Option v-for="p in modalPidDatas" :value="p.id" :key="p.id">{{p.name}}</Option>
          </Select>
        </FormItem>
        <FormItem class="pop-item" label="上级审批：" prop="auditObj">
          <Select v-model="formPop.auditObj">
            <Option :value="userInfo.orgId">{{userInfo.name}}</Option>
            <Option :value="audit.id" v-for="audit in modalAuditDatas" :key="audit.id">{{audit.name}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="pop-footer">
        <Button type="primary" @click="handleSubmit()">确定</Button>
        <Button @click="handleCancel">取消</Button>
      </div>
      <Spin size="large" fix v-if="ModalSpinShow"></Spin>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { ModalConfig, Input } from "iview/types";
import {
  GetChildOriginDataType,
  getChildOriginListById,
  getParentOriginListById,
  saveOrigin,
  deleteOrigin,
  updateStatusOrigin,
  exportOriginExcel
} from "@service/app";
import { AppModule } from "@store/modules/app";
import {exportExcel} from '@util/util'
import CONFIG from '@util/config'

interface statusRequestParamsType {
  id: string
  status: number
  title: string
}

@Component
export default class OrganizationManage extends Vue {
  get userInfo() {
    return AppModule.userInfo;
  }
  private modal = false;
  private searchForm: GetChildOriginDataType = {
    name: "",
    status: '',
    id: this.$store.state.app.userInfo.orgId
  };
  private formPop = {
    id: '',
    auditObj: "", // 上级审批id
    pid: "", // 父级id
    name: "" // 组织机构名称
  };
  // 弹窗验证
  private ruleValidate = {
    name: [
      { required: true, message: "请输入组织机构名称", trigger: "blur" },
      {
        type: "string",
        max: 20,
        message: "组织机构名称不能超过20个字符",
        trigger: "blur"
      }
    ],
    pid: [{ required: true, message: "请选择上级组织机构" }],
    auditObj: [{ required: true, message: "请选择上级组织机构" }]
  };
  // 组织机构列表
  private datas = [];
  // 父级组织机构列表
  private parentDatas = [];
  // 审核机构
  private auditDatas = [];
  // 弹窗父级机构列表
  private modalPidDatas = [];
  // 弹窗上级审核机构列表
  private modalAuditDatas = [];
  // 弹窗标题
  private modalTitle = '添加';
  // 弹窗加载提示
  private ModalSpinShow = false;
  // 弹窗pid变化
  @Watch("formPop.pid", { immediate: true, deep: true })
  private onModalPidChange(val: string | number) {
    this.modalPidDatas = [];
    this.modalAuditDatas =[];
    // 监听弹窗是否显示
    if (this.modal) {
      this.modalPidDatas = this.parentDatas.filter((data: any) => data.id !== this.formPop.id);
      if (val !== this.userInfo.orgId) {
        let orgLevel = (this.parentDatas.filter((data: any) => data.id == val)[0] as any).orgLevel;
        this.modalAuditDatas = this.auditDatas.filter((item: any) => item.orgLevel <= orgLevel + 1 && item.id !== this.formPop.id);
      } else {
        this.modalAuditDatas = [];
      }
    }
  }
  // 列表距离左边的距离
  private getPaddingLeft(idx: number) {
    let left = (idx + 1) * 8;
    return `padding-left:${left}px`;
  }
  // 搜索
  private search () {
    this.getDatas(true)
  }
  // 导出
  private exportExcel () {
    let _this = this;
    exportOriginExcel({id: this.$store.state.app.userInfo.orgId}).then(res => {
      if (res.code === 0) {
        this.$Message.success('导出组织机构成功！')
      }
    })
  }
  // 添加弹窗
  private popUp(type: 'add' | 'edit' ,id ?: string) {
    if (id) {
      this.modalTitle = '编辑';
      let selectItem:any = this.datas[this.datas.findIndex((e:any)=> e.id === id) as number];
      this.formPop.id = id as string;
      this.formPop.pid = selectItem.pid;
      this.formPop.auditObj = selectItem.auditObj;
      this.formPop.name = selectItem.name;
    } else {
      this.modalTitle = '添加';
      (this.$refs.formPop as any).resetFields();
      this.formPop.id = ''
      this.formPop.pid = this.userInfo.orgId;
      this.formPop.auditObj = this.userInfo.orgId;
    }
    this.modal = true;
  }
  // 点击弹窗确定
  private handleSubmit(name: string) {
    (this.$refs.formPop as Vue).validate((valid: boolean) => {
      if (valid) {
        this.saveOrigin()
      } else {
        this.$Message.error("请将信息补充完整！");
      }
    });
  }
  // 弹窗关闭
  private handleCancel(name: string) {
    this.modal = false;
    setTimeout(() => {
      (this.$refs.formPop as Vue).resetFields();
    }, 200);
  }
  // 保存 新增、编辑操作
  private saveOrigin() {
    this.ModalSpinShow = true;
    saveOrigin(this.formPop).then(res => {
      this.ModalSpinShow = false
      if (res.code ===0) {
        this.$Message.success(`${this.modalTitle}成功`);
        this.modal = false;
        this.getDatas()
      }
    }).catch(err => {
      this.ModalSpinShow = false
    })
  }
  // 删除操作弹窗
  private deleteHandle (id:string | number) {
    let _this = this
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        _this.deleteORigin(id);
      }
    };
    this.$Modal.confirm(config);
  }
  // 删除 请求
  private deleteORigin (ids: string | number) {
    deleteOrigin({ids}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`删除成功`);
        this.getDatas()
      }
    })
  }
  // 禁用启用状态改变
  private statusChangeHandle(item: any) {
    let _this = this;
    let title = item.status === 1 ? "禁用" : "启用";
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否${title}?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        let { id, status } = item as any;
        if (status === 1) {
          status = 2;
        } else if (status === 2) {
          status = 1;
        }
        _this.statusChangeRequest({ id, status, title });
      }
    };
    this.$Modal.confirm(config);
  }
  // 更改状态
  private statusChangeRequest (option: statusRequestParamsType) {
    // UpdateStatusOriginDataType
    let { id, status, title } = option;
    let params = {
      status,
      ids: id
    };
    updateStatusOrigin(params).then(res => {
      if (res.code === 0) {
        this.$Message.success(`${title}成功`);
        this.getDatas(true)
      }
    });
  }
  /**
   * getOriginListById 通过参数获取子级组织机构列表
   * @params params {GetChildOriginDataType} 参数
   * @params code 获取的数组需要赋值的变量
   * @params type 是获取父级id 还是子级id
   */
  private getOriginListById(params: GetChildOriginDataType, code: string) {
    getChildOriginListById(params).then(res => {
      if (res.code === 0) {
        this[code] = res.datas;
      }
    });
  }
  // 通过id 获取父级最顶级
  private getParentOriginListById(id: number | string) {
    getParentOriginListById({ id }).then(res => {
      if (res.code === 0 && res.datas) {
        // @ts-ignore
        let id = res.datas[0].id
        this.getOriginListById({id}, 'auditDatas');
      }
    })
  }
  // 获取展示列表
  private getDatas(onlyGetList?: boolean) {
    AppModule.setAppFixedLoadingStatus(true)
    getChildOriginListById(this.searchForm).then(res => {
      AppModule.setAppFixedLoadingStatus(false)
      if (res.code === 0) {
        this.datas = res.datas as [];
        if (!onlyGetList) {
          this.parentDatas = res.datas as []
        }
      }
    }).catch(err => {
      AppModule.setAppFixedLoadingStatus(false)
    });
    if (!onlyGetList) {
      this.getParentOriginListById(this.$store.state.app.userInfo.orgId);
    }
  }
  created() {
    this.getDatas()
  }
}
</script>

<style lang='scss' scoped>
.manage {
  padding: 15px;
  position: relative;
  .operate {
    padding-top: 36px;
    background: $bg;
  }
  .searchForm {
    padding-left: 24px;
  }
  .select-box {
    display: inline-flex;
    align-items: center;
    .select {
      min-width: 200px;
    }
  }
  .button {
    margin-left: 24px;
  }
  .bottom {
    padding: 0 24px 16px;
    .btn {
      margin-left: 12px;
    }
  }
}
.list {
  position:relative;
  padding: 0 12px;
  .item {
    display: flex;
    padding: 16px 0;
    line-height: 20px;
    align-items: center;
    border-bottom: 1px solid $borderLight;
    &.title {
      color: $font01 !important;
      font-weight: bold;
    }
    &.no-data{
      align-items: center;
      justify-content: center;
      color:#999;
    }
  }
  .name {
    width: 60%;
    &.em {
      font-weight: bold;
    }
  }
  .status {
    width: 20%;
    display: inline-flex;
    align-items: center;
    .tab-switch {
      margin-left: 4px;
    }
    .switch-box {
      position: relative;
    }
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
  .operates {
    width: 20%;
    text-align: center;
    i {
      color: $theme;
    }
    span {
      margin: 0 4px;
      color: $theme;
      text-decoration: underline;
      text-decoration-color: $theme;
      cursor:pointer;
      &:hover {
        color: $theme-hover;
        text-decoration-color: $theme-hover;
      }
      &:active {
        color: $theme-active;
        text-decoration-color: $theme-active;
      }
    }
  }
}
.pop {
  .pop-footer {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .pop-item {
    margin-bottom: 24px;
  }
}
</style>
