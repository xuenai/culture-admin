<template>
  <div class="people">
    <Form :label-width="90" :model="form" :rules="validate" ref="form">
      <FormItem label="员工姓名：" prop="name">
        <Input v-model="form.name" class="ipt-max" placeholder="请输入姓名" disabled/>
      </FormItem>
      <FormItem label="性别：" prop="sex">
        <RadioGroup v-model="form.sex">
          <Radio :label="1" disabled>男</Radio>
          <Radio :label="2" disabled>女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="手机号：" prop="account">
        <Input class="ipt-max" disabled v-model="form.account" placeholder="请输入手机号" />
      </FormItem>
      <FormItem label="邮箱：" prop="email">
        <Input class="ipt-max" v-model="form.email" placeholder="请输入邮箱" disabled/>
      </FormItem>
      <FormItem label="备注：">
        <Input
          class="ipt-max"
          type="textarea"
          disabled
          v-model="form.remark"
          :autosize="{minRows: 4,maxRows: 4}"
        />
      </FormItem>
      <FormItem label="角色：" prop="roles">
        <Transfer
          :titles="titles"
          :data="roleDatas"
          :target-keys="targetRoleDatas"
          @on-change="handleTransferChange"
          disabled
          class="role-box"
        ></Transfer>
        <div class="role-btns">
          <!-- <span class="role-btn" @click="getRoles">刷新</span> -->
          <!-- <span class="role-btn">新增</span> -->
        </div>
      </FormItem>
      <FormItem label="权限：">
        <div class="permissions">
          <Tree :data="menuRoles" :render="renderTree" empty-text="暂无权限"/>
        </div>
      </FormItem>
      <FormItem>
        <!-- <Button class="btn" type="primary" @click="handleSave">保存</Button> -->
        <Button class="btn" @click="goBack">返回</Button>
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
  getUserInfo
} from "@service/app";
import {AppModule} from '@store/modules/app';
import axios from 'axios';

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

@Component
export default class PeopleEdit extends Vue {
  // 获取验证码按钮 是否可以点击
  private codeBtnDisabled = true;
  // 获取验证码按钮 loading动画
  private codeBtnLoading = false;
  private form = {
    name: "",
    sex: "",
    account: "", // 手机号就是账号
    email: "",
    remark: "",
    status: 1,
    roles: "",
    dataType: process.env.VUE_APP_STATUS,
    sessionId: ""
  };
  private targetRoleDatas:Array<number> = [];
  private validate = {
    name: [
      { required: true, message: "请输入姓名", trigger: "blur" },
      {
        type: "string",
        max: 10,
        message: "姓名不超过10个字符",
        trigger: "blur"
      }
    ],
    sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
    account: [
      { required: true, validator: this.validatePhone, trigger: "blur" }
    ],
    code: [{ required: true, validator: this.validateCode, trigger: "blur" }],
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      { type: "email", message: "邮箱不正确", trigger: "blur" }
    ],
    unit: [{ required: true, message: "请选择所属机构", trigger: "blur" }],
    roles: [{ required: true, message: "请选择角色", trigger: "blur" }]
  };
  private roleDatas: Array<any> = [];
  private menuRoles: Array<treeDataType> = [];
  private titles = ["选择角色", "已授权角色"];
  @Watch("targetRoleDatas", { deep: true })
  onTargetRoleDatasChange(val: any) {
    this.form.roles = val.join(",");
    this.getMenuByRole(this.form.roles);
    // 对表单单独验证
    (this.$refs.form as Vue).validateField('roles')
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
      this.codeBtnDisabled = true;
      return callback(new Error("请输入手机号码"));
    } else if (!/^1\d{10}$/.test(value)) {
      this.codeBtnDisabled = true;
      callback(new Error("手机号不正确"));
    } else {
      this.codeBtnDisabled = false;
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
    if (this.codeBtnLoading) {
      return false;
    }
    this.codeBtnLoading = true;
    sendPhoneMsg({
      phone: this.form.account,
      type: "SEND_ACCOUNT_REGISTER",
      sessionId: this.$cookies.get("sessionId")
    })
      .then(res => {
        this.codeBtnLoading = false;
        if (res.code === 0) {
          this.$Message.success("验证码发送成功");
        }
      })
      .catch(err => {
        this.codeBtnLoading = false;
      });
  }
  // 获取
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
    AppModule.setAppFixedLoadingStatus(true)
    saveUser(this.form).then(res => {
      AppModule.setAppFixedLoadingStatus(false)
      if (res.code === 0) {
        (this.$refs.form as Vue).resetFields();
        this.$Message.success(`编辑员工成功`);
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
  // 获取角色列表
  private getRoles() {
    // 不使用分页查询角色
    getRoleList({ enablePage: false }).then(res => {
      if (res.code === 0) {
        this.$Message.success('刷新角色成功')
        this.roleDatas = [];
        let { datas } = res;
        datas &&
          datas.map((data: any) => {
            let item = {
              key: data.id,
              label: data.name,
              disabled: true
            };
            this.roleDatas.push(item);
          });
      }
    });
  }
  // 获取员工信息
  private getUserInfo () {
    let userId = this.$route.query.id as string
    getUserInfo({userId}).then(res => {
      if (res.code === 0) {
        Object.assign(this.form, res.data);
        this.targetRoleDatas = res.data.roles.split(',');
      }
    })
  }
  created() {
    this.form.sessionId = this.$cookies.get("sessionId");
    let userId = this.$route.query.id as string
    // this.getUserInfo()
    // this.getRoles();
    axios.all([
      getUserInfo({userId}),
      getRoleList({ enablePage: false })
    ]).then(axios.spread((infoRes, listRes) => {
      if (infoRes.code === 0 && listRes.code === 0) {
        Object.assign(this.form, infoRes.data);
        let selectedRoles = infoRes.data.roles.split(',');
        this.roleDatas = [];
        let { datas } = listRes;
        datas && datas.map((data: any) => {
                  let item = {
                    key: data.id,
                    label: data.name,
                    disabled: true
                  };
                  this.roleDatas.push(item);
                });
        selectedRoles.map((e: number) => {
          this.targetRoleDatas.push(e - 0)
        })
      }
    }))
    
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
