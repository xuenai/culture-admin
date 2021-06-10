<template>
  <div class="people">
    <Form :label-width="90" :model="form" :rules="validate" ref="form">
      <FormItem label="菜单名称：" prop="name">
        <Input v-model="form.name" disabled class="ipt-max" placeholder="请输入菜单名称"/>
      </FormItem>
      <FormItem label="菜单编码：" prop="code">
        <Input class="ipt-max" disabled v-model="form.code" placeholder="请输入菜单编码"/>
      </FormItem>
      <FormItem label="菜单类型：" prop="menuType">
        <Select v-model="form.menuType" class="ipt-max" disabled>
          <Option v-for="type in MENU_TYPES" :key="type.value" :value="type.value">{{type.name}}</Option>
        </Select>
      </FormItem>
      <!-- <FormItem label="数据类型：" prop="dataType">
        <Select v-model="form.dataType" class="ipt-max" @on-change="dataTypeChangeHandle">
          <Option value="CLOUD">云端管理</Option>
          <Option value="SITE">站点端</Option>
          <Option value="COMPANY">文旅企业端</Option>
        </Select>
      </FormItem> -->
      <FormItem label="菜单图标：">
        <MenuCronSelect v-model="form.cron" :disabled="true"></MenuCronSelect>
      </FormItem>
      <FormItem label="上级菜单：">
        <Select v-model="form.pid" filterable class="ipt-max" disabled>
          <Option :value="TOP_MENU_VALUE">-顶级菜单-</Option>
          <Option v-for="menu in menuList" :key="menu.id" :value="menu.id">{{menu.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="菜单地址：">
        <Input class="ipt-max" v-model="form.menuUrl" placeholder="请输入" disabled/>
      </FormItem>
      <FormItem label="排序：" prop="sort">
        <Input class="ipt-max" disabled  number type="number" v-model="form.sort" placeholder="请输入"/>
      </FormItem>
      <FormItem>
        <!-- <Button class="btn" type="primary" @click="handleSave">保存</Button> -->
        <Button class="btn" @click="handleGoBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import {saveMenu, checkMenuCode, getMenuView, getMenuList} from '@service/app'
import { TOP_MENU_VALUE, MENU_TYPES } from '@constant/index'
import { MenuCronSelect } from '@components/index'

@Component({
  components: {MenuCronSelect}
})
export default class MenuAdd extends Vue {
  // 顶级菜单的值
  private TOP_MENU_VALUE = TOP_MENU_VALUE
  // 菜单的类型 数组
  private MENU_TYPES = MENU_TYPES
  private form = {
    name: "",
    code: "",
    status: 1,
    sort: 9999,
    menuUrl: '',
    menuType: "",
    dataType: '', // process.env.VUE_APP_STATUS
    pid: "",
    pName: ""
  };
  private menuList = []
  private validate = {
    name: [
      { required: true, message: "请输入菜单名称", trigger: "blur" },
      { max: 10, message: "菜单名称不超过10个字符", trigger: "blur" }
    ],
    code: [{required:true, validator: this.validateCode, trigger: 'blur'}],
    menuType: [{ required: true, message: "请选择菜单类型", }],
    dataType: [{ required: true, message: "请选择数据类型", }],
    sort: [
      { type: "number", required: true, message: "请输入排序", trigger: "blur" }
    ],
  };
  private roleDatas = [];
  // 异步验证菜单编码是否重复
  private validateCode (rule: any, value: any, callback: any) {
    if (!value) {
        return callback(new Error('请输入菜单编码'));
    }
    let {code, dataType} = this.form
    // 检查菜单编码是否重复
    checkMenuCode({code, dataType}).then(res => {
      if (res.code === 0) {
        callback()
      } else {
        callback(new Error(res.message));
      }
    })

  }
  // 保存菜单时 进行表单整体验证
  private handleSave() {
    (this.$refs.form as Vue).validate((valid: boolean) => {
      if (valid) {
        this.saveMenu()
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  // 进行保存菜单请求
  private saveMenu () {
    saveMenu(this.form).then(res => {
      if (res.code === 0) {
        this.$Message.success(`操作成功`);
        // 修改当前数组中的值
      }
    })
  }
  // 获取菜单列表
  private getMenuList () {
    getMenuList({pageSize: 200, currPage:1, menuType: 'MENU_CATALOG', dataType: this.form.dataType}).then(res => {
      this.menuList = res.datas as []
    })
  }
  // 返回
  private handleGoBack () {
    this.$router.go(-1)
  }
  // 获取菜单详情
  private getMenuView () {
    getMenuView({id: this.$route.query.id}).then(res => {
      this.form = res.data
    })
  }
  // 获取数据类型dataType 三种不同的路由 都是跳转的这个页面  要根据路由来判断当前需要请求哪个端的数据
  private getDataTypeOrPath (str: string) {
    let dataType = ''
    switch (str) {
      case '/cloud-menu-add':
        dataType = 'CLOUD'
        break;
      case '/site-menu-add':
        dataType = 'SITE'
        break;
      case '/company-menu-add':
        dataType = 'COMPANY'
        break;
    }
    return dataType
  }
  created () {
    let {path} = this.$route
    let type = this.getDataTypeOrPath(path)
    this.form.dataType = type
    this.getMenuView()
    this.getMenuList()
  }

}
</script>

<style lang='scss' scoped>
.people {
  padding: 32px;
  .ipt-max {
    max-width: 240px;
  }
  .btn-code {
    margin-left: 16px;
  }
  .permissions {
    max-width: 500px;
    height: 400px;
    padding: 16px 40px;
    border: 1px solid $borderLight;
    border-radius: 5px;
    overflow-y: auto;
    background: $bg;
    .list {
      .card {
        .list {
          padding-left: 20px;
        }
        position: relative;
        &.has-child {
          &::before {
            content: "";
            position: absolute;
            left: -16px;
            top: 13px;
            width: 0;
            height: 0;
            border: 5px solid transparent;
            border-top-color: #ddd;
          }
        }
      }
    }
  }
  .btn {
    min-width: 150px;
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
}
</style>
