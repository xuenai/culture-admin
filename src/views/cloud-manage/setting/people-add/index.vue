<template>
  <div class="people">
    <Form :label-width="90" :model="form" :rules="validate" ref="form">
      <FormItem label="员工姓名：" prop="name">
        <Input v-model="form.name" class="ipt-max" placeholder="请输入姓名" />
      </FormItem>
      <FormItem label="性别：" prop="sex">
        <RadioGroup v-model="form.sex">
          <Radio :label="1">男</Radio>
          <Radio :label="2">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="手机号：" prop="account">
        <Input class="ipt-max" v-model="form.account" placeholder="请输入手机号" />
        <!-- <Button
          class="btn-code"
          :disabled="codeBtn.disabled"
          @click="getPoneMsg"
          :loading="codeBtn.loading"
        >{{codeBtn.text}}</Button> -->
      </FormItem>
      <!-- <FormItem label="验证码：" prop="code">
        <Input class="ipt-max" v-model="form.code" placeholder="请输入验证码" />
      </FormItem> -->
      <FormItem label="邮箱：" prop="email">
        <Input class="ipt-max" v-model="form.email" placeholder="请输入邮箱" />
      </FormItem>
      <FormItem label="所属机构：" prop="orgId" v-if="isCompany">
        <Select class="ipt-max" v-model="form.orgId" @on-open-change="onOrgIdChange">
          <Option v-for="org in orgList" :key="org.id" :value="org.id">{{org.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属机构：" prop="siteOrgId" v-else>
        <Select class="ipt-max" v-model="form.siteOrgId">
          <Option value="" :key="-1">请选择</Option>
          <Option v-for="org in siteOrgList" :key="org.id" :value="org.id">{{org.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="备注：">
        <Input
          class="ipt-max"
          type="textarea"
          v-model="form.remark"
          :autosize="{minRows: 4,maxRows: 4}"
          :maxlength="200"
          placeholder="备注不能超过200字"
        />
      </FormItem>
      <FormItem label="角色：" prop="roles">
        <Transfer
          :titles="titles"
          :data="roleDatas"
          :target-keys="targetRoleDatas"
          @on-change="handleTransferChange"
          class="role-box"
        ></Transfer>
        <div class="role-btns">
          <span class="role-btn" @click="getRoles(true)">刷新</span>
          <span class="role-btn" @click="addNewRole">新增</span>
        </div>
      </FormItem>
      <FormItem label="权限：">
        <div class="permissions">
          <Tree :data="menuRoles" :render="renderTree" empty-text="暂无权限"/>
        </div>
      </FormItem>
      <FormItem label="场所核销：" v-if="isCompany">
        <Ctransfer v-model="targetKeys"></Ctransfer>
      </FormItem>
      <FormItem>
        <Button class="btn" type="primary" @click="handleSave">保存</Button>
        <Button class="btn" @click="goBack">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { CreateElement } from "vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  saveUser,
  getRoleList,
  sendPhoneMsg,
  getMenuByRole,
  getChildOriginListById,

} from "@service/app";
import {AppModule} from '@store/modules/app';
import {Ctransfer} from '@components/index';
import { getSiteOrgList } from "@service/common"

interface operatesDataType {
  id: string | number;
  name: string;
  operateCode: string;
  sort: number;
}

interface treeDataType {
  id: string;
  title: string;
  expand: Boolean;
  children: Array<treeDataType>;
  operates: Array<operatesDataType>;
  indeterminate: Boolean;
  menuType: string;
}

interface ResourseDataType {
  name?: string;
  resourceId: string;
  resourceType:string;
  child: Array<ResourseDataType>;
  pid?:string;
  ptype?: string;
}

@Component({
  components: {Ctransfer}
})
export default class PeopleAdd extends Vue {
  private targetKeys:Array<ResourseDataType> = [];
  // 判断是否是企业端
  private isCompany:boolean = process.env.VUE_APP_STATUS === 'COMPANY';
  // 获取验证码相关的参数
  private codeBtn = {
    loading: false, // 加载中动画
    text: '获取验证码', // 显示的文本
    disabled: true, // 是否禁止点击
    count: 60, //倒计时时间
  }
  // 保存员工的参数
  private form = {
    name: "",
    sex: "",
    account: "", // 手机号就是账号
    // code: "",
    email: "",
    remark: "",
    status: 1,
    roles: "",
    dataType: process.env.VUE_APP_STATUS,
    sessionId: "",
    orgId: "", // 企业端所属组织机构id
    siteOrgId: "", // 站点段所属组织机构id
    powerParams: '', // 权限字符串
  };
  // 角色穿梭框右侧的数据
  private targetRoleDatas = [];
  // form的表单验证
  private validate = {
    name: [
      { required: true, message: "请输入姓名"},
      {
        type: "string",
        max: 10,
        message: "姓名不超过10个字符",
        trigger: "blur"
      }
    ],
    sex: [{ required: true, message: "请选择性别"}],
    account: [
      { required: true, validator: this.validatePhone}
    ],
    // code: [{ required: true, validator: this.validateCode}],
    email: [
      { required: true, message: "请输入邮箱"},
      { type: "email", message: "邮箱不正确"}
    ],
    unit: [{ required: true, message: "请选择所属机构"}],
    roles: [{ required: true, message: "请选择角色"}],
    orgId: [{ required: true, message: "请选择所属机构" }],
  };
  // 角色穿梭框左侧的角色列表
  private roleDatas: Array<any> = [];
  // 当前的角色穿梭框选中的角色的权限树
  private menuRoles: Array<treeDataType> = [];
  // 角色权限树的标题
  private titles = ["选择角色", "已授权角色"];
  // 当前企业的下属组织机构
  private orgList = [];
  private powerParams:Array<any> = [];
  // 监控角色穿梭框选中值的变化
  @Watch("targetRoleDatas", { immediate: true, deep: true })
  onTargetRoleDatasChange(val: any) {
    this.form.roles = val.join(",");
    this.getMenuByRole(this.form.roles);
    // 对表单单独验证
    let $form = this.$refs.form as Vue
    if ($form) {
      $form.validateField('roles')
    }
  }
  @Watch("targetKeys", { immediate: true, deep: true })
  onTargetKeysChange (val: Array<ResourseDataType>) {
    let datas:Array<ResourseDataType> = [];
    let first:Array<ResourseDataType> = JSON.parse(JSON.stringify(val.filter(data => !data.pid))) as Array<ResourseDataType>;
    let second:Array<ResourseDataType> = JSON.parse(JSON.stringify(val.filter(data => data.pid))) as Array<ResourseDataType>;
    datas = datas.concat(JSON.parse(JSON.stringify(first)) as Array<ResourseDataType>);
    second.map(data => {
      // 判断一级菜单中是否存在这条数据的父级
      let index = datas.findIndex(e => e.resourceId === data.pid);
      if (index > -1) {
        // @ts-ignore
        (datas[index].child as []).push(data);

      } else {
        // 没有这条数据的父级
        // @ts-ignore
        let fir = {  name: data.pname, resourceId: data.pid, resourceType: data.ptype, child: [data] };
        // @ts-ignore
        datas.push(fir)
      }
    })
    this.powerParams = datas;
  }
  // 通过roleId获取菜单目录
  private getMenuByRole(roleIds: string) {
    // roleIds 为空
    this.menuRoles = []
    if (!roleIds) {
      return false;
    }
    getMenuByRole({ roleIds }).then(res => {
      if (res.code === 0) {
        this.dataFormat(res.datas as [], this.menuRoles);
      }
    });
  }
  // 处理左侧用户菜单树 符合iview Tree的数据结果
  private dataFormat(datas: [], targetArr: Array<treeDataType>) {
    datas.map((data: any) => {
      let tree: treeDataType = {
        title: data.name,
        id: data.id,
        expand: false,
        children: [],
        indeterminate: false,
        menuType: data.menuType,
        operates: data.operates
      };
      if ((data.child as []).length) {
        this.dataFormat(data.child, tree.children);
      }
      targetArr.push(tree);
    });
  }
  // tree render渲染
  private renderTree(h: CreateElement, { root, node, data }: any) {
    let custom;
    let size;
    if (data.menuType === "MENU_CATALOG") {
      custom = "c-icon-Group-";
      size = 16;
    } else if (data.menuType === "MENU_OPERATION") {
      custom = "c-icon-neirong1";
      size = 12;
    }
    return h("span",
      {
        class: 'people-management-roles'
      },
      [
        h('span',
          {
            class: 'people-management-roles-name'
          },
          [
            h("Icon", {
              props: {
                custom: ` iconfont ${custom}`,
                size: size
              }
            }),
          h("span", { style: "margin-left:8px;" }, data.title),
        ]),
        h('span',
          {
            class: 'people-management-operates'
          },
          [
            data.operates.map(function(item: any, index: number) {
              return h(
                "span",
                {
                  class: 'people-management-operate'
                },
                item.name
              );
            })
          ]
        )
      ]
    );
  }
  // 手机号验证
  private validatePhone(rule: any, value: any, callback: any) {
    if (!value) {
      this.codeBtn.disabled = true;
      return callback(new Error("请输入手机号码"));
    } else if (!/^1\d{10}$/.test(value)) {
      this.codeBtn.disabled = true;
      callback(new Error("手机号不正确"));
    } else {
      this.codeBtn.disabled = false;
      callback();
    }
  }
  // 验证码验证
  private validateCode(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("请输入验证码"));
    } else if (!/\d{6}$/.test(value)) {
      callback("验证码不正确");
    } else {
      callback();
    }
  }
  // 获取验证码
  private getPoneMsg() {
    if (this.codeBtn.loading) {
      return false;
    }
    let type:'SEND_ACCOUNT_REGISTER' | 'SEND_ACCOUNT_REGISTER_COMPANY'  = 'SEND_ACCOUNT_REGISTER';
    if (this.isCompany) {
      type = 'SEND_ACCOUNT_REGISTER_COMPANY';
    }
    this.codeBtn.loading = true;
    sendPhoneMsg({
      phone: this.form.account,
      type,
      sessionId: this.$cookies.get("sessionId")
    }).then(res => {
        this.codeBtn.loading = false;
        if (res.code === 0) {
          this.$Message.success("验证码发送成功");
          this.codeBtn.disabled = true;
          this.countDownHandle();
        }
      })
      .catch(err => {
        this.codeBtn.loading = false;
      });
  }
  // 倒计时 验证码发送成功后的倒计时
  private countDownHandle () {
    if (this.codeBtn.count === 0) {
      this.codeBtn.text = '获取验证码';
      this.codeBtn.count = 60;
      (this.$refs.form as Vue).validateField('account');
      return false;
    }
    this.codeBtn.text = `${this.codeBtn.count}s`;
    this.codeBtn.count--;
    setTimeout(this.countDownHandle, 1000);
    // this.countDownHandle();
  }
  // 穿梭框选中值改变
  private handleTransferChange(
    newTargetKeys: any,
    direction: any,
    moveKeys: any
  ) {
    this.targetRoleDatas = newTargetKeys;
  }
  // 点击保存按钮 开始验证表格
  private handleSave() {
    (this.$refs.form as Vue).validate((valid: boolean) => {
      if (valid) {
        this.saveRequestHandle();
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  // 进行保存操作
  private saveRequestHandle() {
    AppModule.setAppFixedLoadingStatus(true);
    this.form.powerParams = JSON.stringify(this.powerParams);
    saveUser(this.form).then(res => {
      AppModule.setAppFixedLoadingStatus(false)
      if (res.code === 0) {
        (this.$refs.form as Vue).resetFields();
        this.$Message.success(`添加员工成功`);
        this.$router.go(-1);
      }
    }).catch(err => {
      AppModule.setAppFixedLoadingStatus(false)
    });
  }
  // 返回
  private goBack() {
    this.$router.go(-1);
  }
  /**
   * getRoles 获取角色列表
   * @params type {boolean} 是否有消息提示
   */
  private getRoles(type?:boolean) {
    // 不使用分页查询角色
    getRoleList({ enablePage: false }).then(res => {
      if (res.code === 0) {
        if(type) {
          this.$Message.success('刷新角色成功')
        }
        this.roleDatas = [];
        let { datas } = res;
        datas &&
          datas.map((data: any) => {
            let item = {
              key: data.id,
              label: data.name
            };
            this.roleDatas.push(item);
          });
      }
    });
  }
  /**
   * getOriginList 获取组织机构
   */
  private getOriginList () {
    getChildOriginListById({id: this.$store.state.app.userInfo.orgId}).then(res => {
      if (res.code === 0) {
        this.orgList = res.datas as []
      }
    })
  }
  /**
   * getSiteOrgList 获取站点端组织机构
   */
  private siteOrgList: any[] = []
  private getSiteOrgList () {
    getSiteOrgList({enablePage: false, queryType: 2}).then(res => {
      if (res.code === 0) {
        this.siteOrgList = res.datas as []
      }
    })
  }
  // 当前是企业短时需要执行的方法
  private isCompanyComplete () {
    // 获取组织机构
    if (this.isCompany) {
      this.getOriginList()
    }
  }
  // 监听orgId变化 进行form表单验证
  private onOrgIdChange (status: boolean) {
    // 下拉选框隐藏时 进行表单验证
    if (!status) {
      (this.$refs.form as Vue).validateField('orgId');
    }
  }
  // 跳转新增角色页面
  private addNewRole () {
    let {href} = window.location;
    href = href.split('#/')[0];
    window.open(`${href}#/role-add`, '_blank');
  }
  created() {
    this.form.sessionId = this.$cookies.get("sessionId");
    this.getRoles();
    if (this.isCompany) {
      // 企业端需要进行的操作
      this.isCompanyComplete()
    } else {
      this.getSiteOrgList()
    }
  }
}
</script>

<style lang="scss">
.people-management-roles {
  display: inline-flex;
  line-height:32px;
  flex-wrap:nowrap;
  .people-management-operates{
    white-space: pre-wrap;
  }
  .people-management-operate{
    margin-left:12px;
    color:#888;
  }
}
</style>

<style lang='scss' scoped>
.people {
  padding: 32px;
  .ipt-max {
    max-width: 240px;
  }
  .btn-code {
    margin-left: 16px;
    min-width:92px;
  }
  .btn {
    margin-right: 16px;
  }
  .role-box {
    display: inline-block;
  }
  .role-btns {
    vertical-align: top;
    display: inline-block;
    margin: 0 0 0 24px;
    .role-btn {
      margin-right: 8px;
      color: $theme;
      cursor: pointer;
      &:active {
        color: $theme-active;
      }
      &:hover {
        color: $theme-hover;
      }
    }
  }
  .permissions {
    max-width: 500px;
    height: 400px;
    padding: 16px 40px;
    border: 1px solid $borderLight;
    border-radius: 5px;
    overflow-y: auto;
    background: $bg;


  }
}
</style>
