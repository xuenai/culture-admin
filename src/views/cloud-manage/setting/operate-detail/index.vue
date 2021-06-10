<template>
  <div class="people">
    <Form :label-width="110" :model="form" :rules="validate" ref="form">
      <FormItem label="操作名称：" prop="name">
        <Input v-model="form.name" class="ipt-max" placeholder="请输入"/>
      </FormItem>
      <FormItem label="所属菜单：" prop="menu">
        <Select v-model="form.menu" class="ipt-max">
          <OptionGroup :label="menu.name" v-for="(menu,i) in menuList" :key="i">
            <Option :value="menu.id">{{menu.name}}</Option>
            <Option v-for="m in menu.child" :key="m.id" :value="m.id">{{m.name}}</Option>
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
        <Input v-model="form.url" class="ipt-max" placeholder="请输入"/>
      </FormItem>
      <FormItem label="排序：" prop="sort">
        <Input class="ipt-max" number type="number" v-model="form.sort" placeholder="请输入"/>
      </FormItem>
      <FormItem label="是否显示按钮：" prop="show">
        <RadioGroup v-model="form.show">
          <Radio label="1">
            <span>显示</span>
          </Radio>
          <Radio label="0">
            <span>不显示</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button class="btn" type="primary" @click="handleSave">保存</Button>
        <Button class="btn" @click="handleGoBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

import {getUserMenu, saveOperate} from "@service/app";

@Component
export default class MenuAdd extends Vue {
  private form = {
    name: "", // 名称
    operateCode: "", // 操作代码
    status: 1,
    menu: "", // 菜单id
    sort: 9999, // 排序
    dataType: process.env.VUE_APP_STATUS, // 数据类型
    url: "", // 页面路由
    show: "" // 是否显示按钮
  };
  private menuList = [];
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
  private roleDatas = [
    {
      key: "123",
      label: "角色",
      description: "asdaada",
      disabled: false
    }
  ];
  private operates = [
    {
      code: "edit",
      name: "修改"
    },
    {
      code: "list",
      name: "列表"
    },
    {
      code: "detail",
      name: "查看"
    },
    {
      code: "delete",
      name: "删除"
    },
    {
      code: "cancel",
      name: "取消"
    },
    {
      code: "save",
      name: "提交"
    },
    {
      code: "process",
      name: "流程"
    },
    {
      code: "audit",
      name: "审核"
    },
    {
      code: "setting",
      name: "配置"
    },
    {
      code: "visit",
      name: "回访"
    },
    {
      code: "recommend",
      name: "推荐"
    },
    {
      code: "cancelRecommend",
      name: "取消推荐"
    },
    {
      code: "top",
      name: "置顶"
    },
    {
      code: "cancelTop",
      name: "取消置顶"
    },
    {
      code: "sort",
      name: "排序"
    },
    {
      code: "batchDelete",
      name: "批量删除"
    },
    {
      code: "batchSave",
      name: "批量提交"
    },
    {
      code: "transfer",
      name: "转移"
    },
    {
      code: "report",
      name: "上报"
    },
    {
      code: "cloudLeague",
      name: "云联盟"
    },
    {
      code: "import",
      name: "导入"
    },
    {
      code: "export",
      name: "导出"
    }
  ];
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
      console.log(res);
      if (res.code === 0) {
        this.$Message.success(`操作成功`);
        // 修改当前数组中的值
      }
    });
  }
  // 获取菜单列表
  private getMenuList() {
    getUserMenu(null).then(res => {
      console.log(res);
      this.menuList = res.datas as [];
    });
  }
  // 返回
  private handleGoBack() {
    this.$router.go(-1);
  }
  created() {
    this.getMenuList();
    //console.log(this.$router);
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
