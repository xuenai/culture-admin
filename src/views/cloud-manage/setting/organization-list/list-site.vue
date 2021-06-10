<template>
  <div class="manage">
    <Form ref="searchForm" :model="searchForm" inline class="searchForm operate">
      <FormItem>
        <Input v-model="searchForm.name" :maxlength="20" @on-enter="search()">
          <span slot="prepend">机构名称</span>
        </Input>
      </FormItem>
      <FormItem class="select-box" label="类型">
        <Select v-model="searchForm.status" class="select" @on-change="search()">
          <Option :value="-1">全部</Option>
          <Option :value="1">正常</Option>
          <Option :value="2">禁用</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" class="mr15" @click="search()">搜索</Button>
        <Button type="primary" class="mr15" @click="popUp()">添加</Button>
      </FormItem>
    </Form>

    <div class="list">
      <div class="item title">
        <div class="name">机构名称</div>
        <div class="status">状态</div>
        <div class="operates">操作</div>
      </div>
      <template v-if="datas.length">
        <div class="item" v-for="item in datas" :key="item.id">
          <div class="name" :class="{em: item.level === 2}" :style="{'padding-left': (item.level - 2) * 16 + 'px'}">
            {{item.level > 2 ? '|- ' + item.name : item.name}}
          </div>
          <div class="status">
            {{item.dataStatus === 1 ? '正常' : '禁用'}}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="item.dataStatus === 1"></i-switch>
              <i class="mask" @click="statusChangeHandle(item)"></i>
            </span>
          </div>
          <div class="operates">
            <span @click="popUp(item)">编辑</span>
            <i> | </i>
            <span  @click="deleteHandle(item)">删除</span>
          </div>
        </div>
      </template>
      <div v-else class="item no-data">暂无数据</div>
    </div>
    <!-- 弹窗 -->
    <Modal v-model="modal" width="600" class="pop" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <Form ref="formPop" :model="formPop" :rules="ruleValidate" :label-width="120">
        <FormItem class="pop-item" label="组织机构名称：" prop="name">
          <Input v-model="formPop.name" placeholder="请输入组织机构名称" />
        </FormItem>
        <FormItem class="pop-item" label="上级组织机构：" prop="pid">
          <Select v-model="formPop.pid">
            <Option v-for="p in allOrg" :value="p.id" :key="p.id" :style="{'padding-left': (p.level) * 8 + 'px'}">
              {{p.level > 2 ? '|- ' : ''}}{{p.name}}  
            </Option>
          </Select>
        </FormItem>
        <FormItem class="pop-item" label="上级审批：" prop="auditParent">
          <Select v-model="formPop.auditParent">
            <Option v-if="auditOrg.length" :value="-1" :key="-1" style="padding-left:8px">请选择</Option>
            <Option v-for="audit in auditOrg" :value="audit.id" :key="audit.id" :style="{'padding-left': (audit.level) * 8 + 'px'}">{{audit.level > 2 ? '|- ' : ''}}{{audit.name}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="pop-footer">
        <Button type="primary" @click="handleSubmit()">确定</Button>
        <Button @click="modal = false">取消</Button>
      </div>
      <Spin size="large" fix v-if="ModalSpinShow"></Spin>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { ModalConfig, Input } from "iview/types";
import { AppModule } from "@store/modules/app";
import CONFIG from '@util/config'
import { getSiteOrgList, saveSiteOrg, updateSiteOrg } from "@service/common"

@Component
export default class OrganizationManage extends Vue {
  get userInfo() {
    return AppModule.userInfo;
  }
  private modal = false;
  private searchForm: any = {
    name: "",
    status: -1,
    enablePage: false
  };
  private formPop = {
    id: '',
    auditParent: -1, // 上级审批id
    pid: "", // 父级id
    name: "" // 组织机构名称
  };
  // 弹窗验证
  private ruleValidate = {
    name: [
      { required: true, message: "请输入组织机构名称", trigger: "blur" },
      { type: "string",max: 20,message: "组织机构名称不能超过20个字符",trigger: "blur" }
    ],
    pid: [{ required: true, message: "请选择上级组织机构" }]
  };
  // 组织机构列表
  private datas = [];
  // 弹窗标题
  private modalTitle = '添加';
  // 弹窗加载提示
  private ModalSpinShow = false;
  // 添加弹窗
  private popUp(item ?: any) {
    if (item) {
      this.getAllOrg({excludeId: item.id})
      this.modalTitle = '编辑';
      this.formPop.id = item.id as string;
      this.formPop.pid = item.pid; // pid重新赋值后 触发获取auditOrg列表
      this.formPop.auditParent = item.auditId || -1;
      this.formPop.name = item.name;
    } else {
      this.getAllOrg().then((list: any[]) => {
        // 新增的时候 上报审核列表可直接和上报组织机构相同 就不再去获取了
        if (list[0]) {
          this.formPop.pid = list[0].id;
        } else {
          this.formPop.pid = '';
        }
      })
      this.modalTitle = '添加';
      this.formPop.id = '';
      this.formPop.name = "";
      this.formPop.auditParent = -1;
    }
    this.modal = true;
  }
  @Watch('modal')
  wModal(v: boolean) {
    if (!v) (this.$refs.formPop as any).resetFields();
  }
  // 点击弹窗确定
  private handleSubmit(name: string) {
    (this.$refs.formPop as Vue).validate((valid: boolean) => {
      if (valid) {
        this.saveSiteOrg()
      } else {
        this.$Message.error("请将信息补充完整！");
      }
    })
  }
  // 保存 新增、编辑操作
  private saveSiteOrg() {
    this.ModalSpinShow = true;
    let params = {...this.formPop}
    if (params.auditParent === -1) delete params.auditParent;
    saveSiteOrg(params).then(res => {
      if (res.code ===0) {
        this.$Message.success(`${this.modalTitle}成功`);
        this.modal = false;
        this.search()
      }
    }).finally(() => {
      this.ModalSpinShow = false
    })
  }
  // 删除操作弹窗
  private deleteHandle (item: any) {
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除${item.name}?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.updateSiteOrg({
          type: 'STATUS',
          params: JSON.stringify({ [item.id]: 0 })
        }).then((status: boolean) => {
          if (status) {
            this.$Message.success('删除成功！')
            this.search()
          }
        })
      }
    };
    this.$Modal.confirm(config);
  }
  // 更新组织机构状态
  private updateSiteOrg (params:any): Promise<boolean> {
    return updateSiteOrg(params).then(res => {
      if (res.code === 0) {
        this.search()
        return true
      } else {
        return false
      }
    })
  }
  // 禁用启用状态改变
  private statusChangeHandle(item: any) {
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否${item.dataStatus === 1 ? "禁用" : "启用"}${item.name}?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.updateSiteOrg({
          type: 'STATUS',
          params: JSON.stringify({ [item.id]: item.dataStatus === 1 ? 2 : 1 })
        }).then((status: boolean) => {
          if (status) {
            this.$Message.success('操作成功！')
            this.search()
          }
        })
      }
    };
    this.$Modal.confirm(config);
  }
  // 获取展示列表
  private search() {
    let params = {...this.searchForm}
    if (params.status === -1) delete params.status
    this.getData(params).then((list: any)=> {
      if (list) this.datas = list
    })
  }
  
  private getData(params: any): Promise<any[]|undefined> {
    return getSiteOrgList(params).then(res => {
      if (res.code === 0) return res.datas as []
    })
  }
  // （上级组织机构）
  private allOrg: any[] = []
  private getAllOrg(params: any = {}): Promise<any> {
    return this.getData({enablePage: false, queryType: 4, ...params}).then((list:any) => {
      if (list) {
        this.allOrg = list
        return list
      }
    })
  }
  // （上级审批）
  private auditOrg: any[] = []
  @Watch("formPop.pid", { immediate: true, deep: true })
  wFormPopPid(pid: any) {
    if (pid) {
      this.getData({
        enablePage: false,
        siteOrgId: pid,
        queryType: 1
      }).then((list: any)=> {
        if (list) {
          this.auditOrg = list
          if (this.formPop.auditParent === -1 && list[0]) this.formPop.auditParent = list[0].id 
        }
      })
    }
  }
  // 当前登陆账号的orgId
  // get topOrg() {
  //   return {id: this.userInfo.siteOrgId, name: this.userInfo.roleNames}
  // }

  created() {
    this.search()
  }
}
</script>

<style lang='scss' scoped>
.mr15 {
  margin-right: 15px;
}
.manage {
  padding: 15px;
  position: relative;
  .operate {
    padding-top: 25px;
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
