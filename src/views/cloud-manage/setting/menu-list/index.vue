<template>
  <div class="people">
    <div class="article">
      <div class="top">
        <Form ref="searchForm" :model="params" inline class="searchForm" >
          <FormItem>
            <Input v-model.trim="params.keyword" placeholder="菜单名称" :maxlength="10">
              <span slot="prepend">名称</span>
            </Input>
          </FormItem>
          <FormItem>
            <Input v-model.trim="params.code" placeholder="菜单编码" :maxlength="20">
              <span slot="prepend">编码</span>
            </Input>
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <Select v-model="params.status" class="ipt-max">
              <Option value="">不限</Option>
              <Option value="1">正常</Option>
              <Option value="2">禁用</Option>
            </Select>
          </FormItem>
          <FormItem label="菜单类型" :label-width="60">
            <Select v-model="params.menuType" class="ipt-max">
              <Option value="">不限</Option>
              <Option value="MENU_CATALOG">目录</Option>
              <Option value="MENU_OPERATION">操作菜单</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" @click="searchHandle">搜索</Button>
            <Button type="primary" class="ml20" @click="goAddPage">添加</Button>
          </FormItem>
        </Form>
      </div>
      <Table class="people-tab" ref="selection" :columns="columns" :data="datas"  @on-selection-change="onTableSelectHandle" :loading="loading">
        <template slot-scope="{row}" slot="name">
          <router-link :to="{path: `/${dataType}-menu-detail`, query: {id: row.id}}">
            <span>{{row.name}}</span>
          </router-link>
        </template>
        <template slot-scope="{row}" slot="menuType">
          <span>{{getMenuType(row.menuType)}}</span>
        </template>
        <template slot-scope="{row}" slot="remark" >
          {{row.remark || '—'}}
        </template>
        <!-- <template slot-scope="{row}" slot="dataType">
          <span>{{getDataType(row.dataType)}}</span>
        </template> -->
        <template slot-scope="{ row }" slot="sort">
          <Input v-if="isSorting" number type="number" :value="row.sort" @on-change="inputChangeHandle($event, row.id)"/>
          <span v-else>{{row.sort}}</span>
        </template>
        <template slot-scope="{ row }" slot="status">
          <div class="table-status">
            {{row.status === 1 ? '正常' : '禁用'}}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="row.status === 1"></i-switch>
              <i class="mask" @click="statusChangeHandle(row)"></i>
            </span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="operate">
          <div class="table-operate">
            <span class="tab-btn" @click="goEidtPage(row.id)">修改</span>|
            <span class="tab-btn" @click="deleteMenuHandle(row.id)">删除</span>
          </div>
        </template>
      </Table>
      <div class="table-foot">
        <span class="check">
          <Checkbox @on-change="handleSelectAll">全选</Checkbox>
        </span>
        <Button class="btn" @click="handleDeleteSelection">批量删除</Button>
        <Button class="btn" v-if="!isSorting" @click="changeSortStatusHandle">排序</Button>
        <Button class="btn" v-else @click="saveSortHandle">保存</Button>
      </div>
      <Page
        class="page"
        :total="total"
        show-sizer
        show-elevator
        show-total
        :page-size-opts="[10,20,50,100]"
        @on-change="pageChangeHandle"
        @on-page-size-change="sizeChangeHandle"
      />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { ModalConfig, Input } from "iview/types";

import { getMenuList, upDateMenuStatus, deleteMenu, updateMenuSorts } from "@service/app";

@Component
export default class MenuList extends Vue {
  private dataType = ''
  // table加载动画
  private loading = true
  // 是否正在排序中 
  private isSorting = false
  // 总条数
  private total = 0
  // 请求列表的参数
  private params = {
    pageSize: 10,
    currPage: 1,
    status: "",
    keyword: "",
    menuType: "",
    dataType: '',
  };
  // table显示的内容
  private columns = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "菜单名称",
      slot: "name"
    },
    {
      title: "菜单编码",
      key: "code",
      align: "center"
    },
    {
      title: "菜单类型",
      slot: "menuType",
      align: "center"
    },
    {
      title: "菜单备注",
      slot: "remark",
      align: 'center'
    },
    // {
    //   title: "数据类型",
    //   slot: "dataType",
    //   align: "center"
    // },
    {
      title: "排序",
      slot: "sort",
      align: "center"
    },
    {
      title: "状态",
      slot: "status",
      align: "center"
    },
    {
      title: "操作",
      slot: "operate",
      align: "center"
    }
  ];
  // 用于保存排序的对象
  private saveSortParams:any = {}
  // 列表数据
  private datas = [];
  // 选中的数据
  private selectedDatas = []
  // 前往添加页面
  private goAddPage() {
    this.$router.push({ path: `/${this.dataType}-menu-add` });
  }
  // 前往修改页面
  private goEidtPage (id: string) {
    this.$router.push({path: `/${this.dataType}-menu-edit`, query: {id}})
  }
  // 删除菜单提示
  private deleteMenuHandle (id: string | number, _index: number) {
    let _this = this
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.deleteMenu(id);
      }
    };
    this.$Modal.confirm(config);
  }
  // 删除菜单事件
  private deleteMenu (ids: string | number) {
    deleteMenu({ids: ids}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`删除成功`);
        this.params.currPage = 1
        this.getMenuList()
      }
    })
  }
  // 点击switch按钮触发
  private statusChangeHandle(row: any) {
    let _this = this;
    let title = row.status === 1 ? "禁用" : "启用";
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否${title}?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        let { id, status, _index } = row as any;
        if (status === 1) {
          status = 2;
        } else if (status === 2) {
          status = 1;
        }
        _this.statusChangeRequest({ id, status, _index, title });
      }
    };
    this.$Modal.confirm(config);
  }
  // 更改是否禁用
  private statusChangeRequest(option: any) {
    let { id, status, _index, title } = option;
    let params = {
      status,
      ids: id
    };
    upDateMenuStatus(params).then(res => {
      if (res.code === 0) {
        this.$Message.success(`${title}成功`);
        // 修改当前数组中的值
        let data = this.datas[_index] as any
        data.status = status
        this.$set(this.datas, data, _index)
      }
    });
  }
  // 页码切换
  private pageChangeHandle(page: number) {
    this.params.currPage = page
    this.getMenuList()
  }
  // 单页显示条数改变
  private sizeChangeHandle(size: number) {
    this.params.pageSize = size
    this.params.currPage = 1
    this.getMenuList()
  }
  // 获取菜单类型
  private getMenuType(type: string) {
    return type === "MENU_CATALOG" ? "目录" : "操作菜单";
  }
  // 获取菜单列表
  private getMenuList() {
    this.loading = true
    getMenuList(this.params).then(res => {
      let { page, datas } = res;
      this.datas = datas as [];
      this.total = (page as any).total
      this.loading = false
    });
  }
  // 设置全选
  private handleSelectAll (value: Boolean) {
    (this.$refs.selection as Vue).selectAll(value);
  }
  // 搜索
  private searchHandle() {
    this.params.currPage = 1
    this.getMenuList()
  }
  // 表格选中
  private onTableSelectHandle (selection: []) {
    this.selectedDatas = selection
  }
  // 批量删除
  private handleDeleteSelection () {
    let ids:string[] = []
    let {selectedDatas} = this
    if(selectedDatas.length === 0) {
      this.$Message.error("未选中需要删除的项");
      return false
    }
    let _this = this
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除选中项?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        selectedDatas.map((e:any) => {
          ids.push(e.id as string)
        })
        _this.deleteMenu(ids.join(','))
      }
    };
    this.$Modal.confirm(config);
  }
  // 排序输入框改变
  private inputChangeHandle(e: Input, id: string) {
    let val = (e.target as HTMLInputElement).value
    if (!val) {
      this.$Message.error(`排序必须为大于0的数值`);
      return false
    }
    this.saveSortParams[id] = val
  }
  // 点击排序按钮
  private changeSortStatusHandle () {
    this.isSorting = true
  }
  // 点击保存
  private saveSortHandle () {
    let len = Object.keys(this.saveSortParams).length
    if (len) {
      let _this = this
      let config: ModalConfig = {
        title: "操作提示",
        content: `是否保存排序修改?`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          _this.updateMenuSorts();
        }
      };
      this.$Modal.confirm(config);
    }
    this.isSorting = false
  }
  // 保存排序
  private updateMenuSorts () {
    updateMenuSorts({params: JSON.stringify(this.saveSortParams) as string}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`保存排序成功`);
        this.params.currPage = 1
        this.getMenuList()
      }
    })
  }
  // 获取数据类型dataType 三种不同的路由 都是跳转的这个页面  要根据路由来判断当前需要请求哪个端的数据
  private getDataTypeOrPath (str: string) {
    let dataType = ''
    switch (str) {
      case '/cloud-menu':
        dataType = 'CLOUD'
        break;
      case '/site-menu':
        dataType = 'SITE'
        break;
      case '/company-menu':
        dataType = 'COMPANY'
        break;
    }
    return dataType
  }
  // 因为3个路由共用一个页面 当那3个路由中切换的时候 不会再执行create了
  @Watch('$route')
  onRouteChange () {
    this.params = {
      pageSize: 10,
      currPage: 1,
      status: "",
      keyword: "",
      menuType: "",
      dataType: '',
    }
    this.total = 0;
    this.getPageData()
  }
  // 当前页面获取数据所需要执行的方法
  private getPageData () {
    // 获取当前的路由path 然后判断当前是哪个端
    let {path} = this.$route
    let type = this.getDataTypeOrPath(path)
    this.dataType = type.toLowerCase()
    // 请求对应端的列表数据
    this.params.dataType = type
    this.getMenuList();
  }
  created() {
    this.getPageData()
  }
}
</script>
<style lang='scss' scoped>
.people {
  position: relative;
  height: 100%;
  padding: 15px 15px 0;
  .article {
    position: relative;
    padding-bottom: 24px;
    z-index: 1;
  }
  .top {
    padding: 15px 15px 0;
    background: $grayLight;
  }
  .people-tab {
    margin-top: 15px;
    margin-bottom: 12px;
  }
  .table-status {
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
  .table-operate {
    display: inline-flex;
    align-items: center;
    color: $theme;
    .tab-btn {
      margin: 0 2px;
      text-decoration: underline;
      text-decoration-color: $theme;
      cursor: pointer;
      &:active {
        color: $theme-active;
        text-decoration-color: $theme-active;
      }
      &:hover {
        color: $theme-hover;
        text-decoration-color: $theme-hover;
      }
    }
  }
  .table-foot{
    padding-left:24px;
    padding-bottom:24px;
    .check{
      margin-right:16px;
    }
    .btn{
      margin-right:16px;
    }
  }
}
.page {
  text-align: center;
}
</style>
