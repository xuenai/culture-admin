<!--
 * @Author: Hexg
 * @Date: 2019-07-05 01:41:28
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-27 17:00:37
 -->
<template>
  <div class="role">
    <Form :label-width="130" :model="params" :rules="validate" ref="form">
      <FormItem label="角色名称：" prop="name">
        <Input placeholder="请输入角色名称" :maxlength="20" class="ipt-max" v-model="params.name" />
      </FormItem>
      <FormItem label="角色描述：">
        <Input
          v-model="params.remark"
          :maxlength="50"
          type="textarea"
          class="ipt-max"
          :autosize="{minRows: 4,maxRows: 4}"
        />
        <p>50字以内</p>
      </FormItem>
      <!-- <FormItem label="角色类型：" prop="systemRole">
        <Select v-model="params.systemRole" class="ipt-max" filterable>
          <Option :value="1">内置角色</Option>
          <Option :value="0">用户自建</Option>
        </Select>
      </FormItem>-->
      <FormItem label="数据类型：" prop="dataType" v-if="isCloud">
        <Select v-model="params.dataType" class="ipt-max" @on-change="onDataTypeChange" filterable>
          <Option value="SITE">站点端</Option>
          <Option value="COMPANY">文旅企业端</Option>
        </Select>
      </FormItem>
      <FormItem label="排序：">
        <Input v-model="params.sort" class="ipt-max" type="number" />
      </FormItem>
      <FormItem label="角色编码：" prop="code">
        <Input v-model="params.code" class="ipt-max" :maxlength="50" placeholder="请输入角色编码：" />
      </FormItem>
      <FormItem label="权限：" prop="operates">
        <Tree
          :data="roles"
          :render="renderTree"
          show-checkbox
          multiple
          @on-check-change="onCheckChange"
        ></Tree>
      </FormItem>
      <!-- 站点端企业端单独添加栏目控制 -->
      <FormItem label="内容栏目控制：" v-if="!params.systemRole">
        <Tree :data="channelList" show-checkbox multiple @on-check-change="onChannelCheckChange"></Tree>
      </FormItem>
      <FormItem label="活动栏目控制：" >
        <Tree
          :data="activityTypes"
          show-checkbox
          multiple
          @on-check-change="onActivityTpeCheckChange"
        ></Tree>
      </FormItem>
      <FormItem>
        <Button type="primary" class="role-btn" @click="handleSave">保存</Button>
        <Button class="role-btn" @click="goback">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { CreateElement } from "vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  getUserMenu,
  saveRole,
  checkRoleCode,
  getRoleActivityTypeList
} from "@service/app";
import { getChannelList } from "@service/content";

interface treeDataType {
  id: string;
  title: string;
  expand: Boolean;
  children: Array<treeDataType>;
  indeterminate: Boolean;
  menuType: string;
  checked: boolean;
}
@Component
export default class RoleAdd extends Vue {
  private isCloud = process.env.VUE_APP_STATUS === "CLOUD";
  private roles: Array<treeDataType> = [];
  private treeSelection: Array<string> = [];
  private params = {
    status: 1,
    id: "",
    remark: "",
    name: "",
    dataType: "",
    operates: "",
    sort: 999,
    code: "",
    systemRole: process.env.VUE_APP_STATUS === "CLOUD" ? 1 : 0,
    channelIds: "",
    activityTypes: ""
  };
  // 数据处理过后的内容栏目列表（符合Tree控件）
  channelList: Array<any> = [];
  // 数据处理后的活动栏目列表
  activityTypes: Array<any> = [];
  private validate = {
    name: [
      { required: true, message: "请输入角色名称", trigger: "blur" },
      { max: 10, message: "角色名称不超过10个字符", trigger: "blur" }
    ],
    systemRole: [{ required: true, message: "请选择角色类型" }],
    code: [{ required: true, validator: this.validateCode, trigger: "blur" }],
    operates: [{ required: true, message: "请选择权限" }],
    dataType: [{ required: true, message: "请选择数据类型" }]
  };
  // 取消
  private goback() {
    this.$router.go(-1);
  }
  @Watch("treeSelection", { immediate: true, deep: true })
  private onTreeSelectionChange(val: []) {
    this.params.operates = val.join(",");
  }
  // 异步验证菜单编码是否重复
  private validateCode(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("请输入角色编码"));
    }
    let { code, dataType } = this.params;
    // 检查菜单编码是否重复
    checkRoleCode({ code, dataType }).then(res => {
      if (res.code === 0) {
        callback();
      } else {
        callback(new Error(res.message));
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
        checked: false,
        menuType: data.menuType
      };
      if ((data.child as []).length) {
        this.dataFormat(data.child, tree.children);
      }
      if (data.menuType === "MENU_OPERATION") {
        data.operates.map((operate: any) => {
          let operateItems: treeDataType = {
            title: operate.name,
            id: operate.id,
            expand: false,
            children: [],
            indeterminate: false,
            checked: false,
            menuType: "operate"
          };
          tree.children.push(operateItems);
        });
      }
      targetArr.push(tree);
    });
  }
  // 获取当前用户的权限列表
  private getUserMenu() {
    this.roles = [];
    getUserMenu({ type: this.params.dataType, firstShow: true }).then(res => {
      let { datas } = res;
      if (datas) {
        this.dataFormat(datas, this.roles);
      }
    });
  }
  // 保存菜单时 进行表单整体验证
  private handleSave() {
    (this.$refs.form as Vue).validate((valid: boolean) => {
      if (valid) {
        this.saveRole();
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  // 保存提交操作
  private saveRole() {
    saveRole(this.params).then(res => {
      if (res.code === 0) {
        this.$Message.success(`操作成功`);
        // 修改当前数组中的值
        // (this.$refs.form as Vue).resetFields();
        this.goback();
      }
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
    return h("span", { style: "display:inline-block;line-height:32px;" }, [
      h("Icon", {
        props: {
          custom: ` iconfont ${custom}`,
          size: size
        }
      }),
      h("span", { style: "margin-left:8px;" }, data.title)
    ]);
  }
  private onCheckChange(val: any) {
    this.treeSelection = [];
    val.map((item: any) => {
      if (item.menuType === "operate") {
        this.treeSelection.push(item.id);
      }
    });
  }
  // 端选择
  private onDataTypeChange(val: string) {
    this.params.dataType = val;
    this.getUserMenu();
  }
  // 获取内容栏目列表
  getChannelList() {
    getChannelList().then(res => {
      let datas = res.datas as Array<any>;
      this.channelList.push({
        title: "待发布内容",
        expand: false,
        selected: false,
        id: -1,
        children: []
      });
      this.formatData(datas, this.channelList);
    });
  }
  onChannelCheckChange(val: Array<any>) {
    this.params.channelIds = val.map(v => v.id).join(",");
  }
  formatData(datas: Array<any>, targetArr: Array<any>) {
    datas.forEach(element => {
      targetArr.push({
        title: element.name,
        expand: false,
        selected: false,
        id: element.id,
        children: []
      });
      if (element.subset.length) {
        this.formatData(
          element.subset as Array<any>,
          targetArr[targetArr.length - 1].children
        );
      }
    });
  }
  onActivityTpeCheckChange(val: Array<any>) {
    this.params.activityTypes = val.map(v => v.activityType).join(",");
  }
  formatActivityList(datas: Array<any>, targetArr: Array<any>) {
    datas.forEach(element => {
      targetArr.push({
        title: element.name,
        expand: false,
        selected: false,
        activityType: element.activityType,
        children: []
      });
      if (element.childs.length) {
        this.formatActivityList(
          element.childs as Array<any>,
          targetArr[targetArr.length - 1].children
        );
      }
    });
  }
  getActivityTypes() {
    getRoleActivityTypeList().then(res => {
      let datas = res.datas as Array<any>;
      this.formatActivityList(datas, this.activityTypes);
    });
  }
  created() {
    this.getActivityTypes();
    if (process.env.VUE_APP_STATUS !== "CLOUD") {
      this.params.dataType = process.env.VUE_APP_STATUS;
      this.getUserMenu();
      this.getChannelList();
      this.getActivityTypes();
    }
  }
}
</script>

<style lang='scss' scoped>
.role {
  padding: 36px;
  .ipt-max {
    max-width: 240px;
  }
  .role-btn {
    // min-width: 150px;
    margin-right: 36px;
  }
}
</style>
