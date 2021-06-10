<template>
  <div class="people">
    <Form :label-width="110" :model="form" :rules="validate" ref="form">
      <FormItem label="操作名称：" prop="name">
        <Input v-model="form.name" class="ipt-max" placeholder="请输入"/>
      </FormItem>
      <FormItem label="所属菜单：" prop="menu">
        <Select v-model="form.menu" class="ipt-max">
          <OptionGroup :label="menu.name" v-for="(menu,i) in menuList" :key="i">
            <Option :value="menu.id" v-if="menu.menuType !== 'MENU_CATALOG'">{{menu.name}}</Option>
            <Option v-for="m in menu.child" :key="m.id" v-if="m.menuType !== 'MENU_CATALOG'" :value="m.id">{{m.name}}</Option>
          </OptionGroup>
        </Select>
      </FormItem>
      <FormItem label="操作代码：" prop="operateCode">
        <Select v-model="form.operateCode" class="ipt-max" filterable>
          <Option
            v-for="operate in operates"
            :key="operate.code"
            :value="operate.code"
          >{{operate.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="路径链接：" prop="url">
        <Input :maxlength="50" v-model="form.url" class="ipt-max" placeholder="请输入"/>
      </FormItem>
      <FormItem label="排序：" prop="sort">
        <Input class="ipt-max" number type="number" v-model="form.sort" placeholder="请输入"/>
      </FormItem>
      <!-- 按钮和权限挂钩 有对应权限就能执行对应操作 -->
      <!-- <FormItem label="是否显示按钮：" prop="show">
        <RadioGroup v-model="form.show">
          <Radio label="1">
            <span>显示</span>
          </Radio>
          <Radio label="0">
            <span>不显示</span>
          </Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem>
        <Button class="btn" type="primary" @click="handleSave">保存</Button>
        <Button class="btn" @click="handleGoBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch} from "vue-property-decorator";
import {OPERATES_CODES} from '@constant/index'
import {saveOperate, getUserMenu} from "@service/app";

interface menuType {
  name: string
  id: string | number
  menuType: string
  child: Array<menuType>
}

@Component
export default class OperateAdd extends Vue {
  private menuList: Array<menuType> = []
  private form = {
    name: "", // 名称
    operateCode: "", // 操作代码
    status: 1,
    menu: "", // 菜单id
    sort: 9999, // 排序
    dataType: process.env.VUE_APP_STATUS, // 数据类型
    url: "", // 页面路由
    show: 1, // 是否显示按钮
  };
  private validate = {
    name: [
      { required: true, message: "请输入菜单名称", trigger: "blur" },
      { max: 10, message: "菜单名称不超过10个字符", trigger: "blur" }
    ],
    menu: [{ required: true, message: "请选择所属菜单" }],
    operateCode: [{ required: true, message: "请选择操作代码" }],
    sort: [
      { type: "number", required: true, message: "请输入排序", trigger: "blur" }
    ],
    url: [{ required: true, message: "请选择所属菜单" }],
    show: [{ required: true, message: "请选择是否显示按钮" }]
  };
  // 项目中需要用到的权限列表
  private operates = OPERATES_CODES;
  /**
   * 处理用户菜单 让菜单能够显示在select中
   * @params list getuserList 获取到的数组
   * @target 目标数组
   */
  private resetArray(list:[], target:Array<menuType>):void {
    list.map((data:any) => {
      let item: menuType = {
          child: [],
          name: data.name,
          menuType: data.menuType,
          id: data.id
        }
        if (data.child.length) {
          this.resetArray(data.child, target)
        }
        target.push(item)
    })
  }
  // 保存菜单时 进行表单整体验证
  private handleSave() {
    (this.$refs.form as Vue).validate((valid: boolean) => {
      if (valid) {
        this.saveMenu();
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  // 进行保存菜单请求
  private saveMenu() {
    saveOperate(this.form).then(res => {
      if (res.code === 0) {
        this.$Message.success(`操作成功`);
        // 修改当前数组中的值
       this.handleGoBack()
      }
    });
  }
  // 返回
  private handleGoBack() {
    this.$router.go(-1);
  }
  // 获取数据类型dataType 三种不同的路由 都是跳转的这个页面  要根据路由来判断当前需要请求哪个端的数据
  private getDataTypeOrPath (str: string) {
    let dataType = ''
    switch (str) {
      case '/cloud-operate-add':
        dataType = 'CLOUD'
        break;
      case '/site-operate-add':
        dataType = 'SITE'
        break;
      case '/company-operate-add':
        dataType = 'COMPANY'
        break;
    }
    this.form.dataType = dataType
    return dataType
  }
  created () {
    let {path} = this.$route
    let type = this.getDataTypeOrPath(path)
    getUserMenu({type}).then(res => {
      // this.formatMenuList(res.datas as [])
      let {datas} = res
      // 对数据进行处理
      let list: Array<menuType> = []
      datas && datas.map((data: any) => {
        let item: menuType = {
          child: [],
          name: data.name,
          menuType: data.menuType,
          id: data.id
        }
        if (data.child.length) {
          this.resetArray(data.child, item.child)
        }
        list.push(item)
      })
      this.menuList = list
    })
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
