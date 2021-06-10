<template>
  <div class="people">
    <div class="sidebar" ref="Sidebar" :style="sideBarWidth">  
      <Tree :data="userMenu" @on-select-change="onTreeSelected" empty-text="暂无菜单"></Tree>
    </div>
    <div class="article" :style="paddingLeft">
      <div class="top">
        <Form ref="searchForm" :model="params" inline class="searchForm">
          <FormItem>
            <Input v-model.trim="params.menuName" :maxlength="20">
              <span slot="prepend">所属菜单</span>
            </Input>
          </FormItem>
          <FormItem>
            <Input v-model.trim="params.name" :maxlength="10">
              <span slot="prepend">操作名称</span>
            </Input>
          </FormItem>
          <FormItem>
            <Input v-model.trim="params.code">
              <span slot="prepend" :maxlength="20">操作编码</span>
            </Input>
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <Select v-model="params.status" placeholder="请选择">
              <Option value="">不限</Option>
              <Option value="1">正常</Option>
              <Option value="2">禁用</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" @click="searchHandle">搜索</Button>
            <Button class="ml20" type="primary" @click="goAddPage">添加</Button>
          </FormItem>
        </Form>
      </div>
      <Table class="people-tab" ref="selection" :columns="columns" :data="datas" @on-selection-change="onTableSelectHandle" :loading="loading">
        <template slot-scope="{ row }" slot="buShow">
          <span>{{row.buShow ? '显示': '不显示'}}</span>
        </template>
        <template slot-scope="{ row }" slot="sort">
          <Input v-if="isSorting" number type="number" :value="row.sort" @on-change="inputChangeHandle($event, row.id)" />
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
            <span class="tab-btn" @click="goEidtPage(row.id)">编辑</span>|
            <span class="tab-btn" @click="deleteHandle(row.id, row._index)">删除</span>
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
    <Spin fixed v-if="spinShow"></Spin>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { ModalConfig, Input } from "iview/types";

import { getUserMenu, getOperateList, upDateOperateStatus, deleteOperate, updateOperateSorts } from "@service/app";

interface treeDataType {
  id: string;
  title: string;
  expand: Boolean;
  children: Array<treeDataType>;
}

interface statusRequestParamsType {
  id: string
  status: number
  _index: number
  title: string
}

@Component
export default class OperateList extends Vue {
  private dataType = ''
  private spinShow = true
  private sideBarWidth = ''
  private loading = true
  // 是否展示排序
  private isSorting = false;
  private selectedDatas = []
  private total = 0
  private userMenu: Array<treeDataType> = [];
  private paddingLeft = "";
  private columns = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "所属菜单",
      key: "menuName"
    },
    {
      title: "操作名称",
      key: "name",
      align: "center"
    },
    {
      title: "操作编码",
      key: "operateCode",
      align: "center"
    },
    {
      title: "路径链接",
      key: "url",
      align: "center"
    },
    {
      title: "按钮状态",
      slot: "buShow",
      align: "center"
    },
    {
      title: "排序",
      slot: "sort",
      align: "center"
    },
    {
      title: "状态",
      slot: "status",
      width: 110,
      align: "center"
    },
    {
      title: "操作",
      slot: "operate",
      align: "center"
    }
  ];
  private datas = [];
  private params = {
    currPage: 1,
    pageSize: 10,
    name: '',
    menuId: '',
    status: '',
    code: '',
    menuName: '',
    dataType: ''
  }
   // 用于保存排序的对象
  private saveSortParams:any = {}
  // 左侧树形结构点击选中时
  private onTreeSelected(data: Array<treeDataType>) {
    if (data.length) {
      this.params.menuId = data[0].id
    } else {
      this.params.menuId = ''
    }
    this.params.currPage = 1
    this.getOperateList()
  }
  // 获取权限列表
  private getOperateList () {
    this.loading = true
    getOperateList(this.params)
      .then(res => {
        this.datas = res.datas as []
        this.loading = false
        if (res.page) {
          this.total = (res.page as any).total
        }
      })
  }
  // 前往添加页面
  private goAddPage() {
    this.$router.push({ path: `/${this.dataType}-operate-add` });
  }
  // 前往修改页面
  private goEidtPage (id: string) {
    this.$router.push({path: `/${this.dataType}-operate-edit`, query: {id}})
  }
  // 点击搜索
  private searchHandle () {
    this.params.currPage = 1;
    this.getOperateList()
  }
  // 权限禁用启用状态改变
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
  // 改变权限状态
  private statusChangeRequest (option: statusRequestParamsType) {
    let { id, status, _index, title } = option;
    let params = {
      status,
      ids: id
    };
    upDateOperateStatus(params).then(res => {
      if (res.code === 0) {
        this.$Message.success(`${title}成功`);
        // 修改当前数组中的值
        let data = this.datas[_index] as any
        data.status = status
        this.$set(this.datas, data, _index)
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
        children: []
      };
      if ((data.child as []).length) {
        tree.expand = true;
        this.dataFormat(data.child, tree.children);
      }
      targetArr.push(tree);
      setTimeout(() => {
        this.setMarginLeft();
      }, 200)
    });
  }
  // 设置右侧表单和左侧的左边距
  private setMarginLeft() {
    this.$nextTick(() => {
      let Sidebar = this.$refs.Sidebar as Vue;
      this.paddingLeft = `margin-left:${Sidebar.offsetWidth}px;`;
      // this.sideBarWidth = `width:${Sidebar.offsetWidth}px;`
    })
  }
  // 列表当前页改变
  private pageChangeHandle(page: number) {
    this.params.currPage = page
    this.getOperateList()
  }
  // 每页显示条数改变
  private sizeChangeHandle(size: number) {
    this.params.pageSize = size
    this.params.currPage = 1
    this.getOperateList()
  }
  // 点击保存排序
  private saveSortHandle() {
    let len = Object.keys(this.saveSortParams).length
    if (len) {
      let _this = this
      let config: ModalConfig = {
        title: "操作提示",
        content: `是否保存排序修改?`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          _this.updateSorts();
        }
      };
      this.$Modal.confirm(config);
    }
    this.isSorting = false
  }
  // 保存排序
  private updateSorts () {
    updateOperateSorts({params: JSON.stringify(this.saveSortParams) as string}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`保存排序成功`);
        this.params.currPage = 1
        this.getOperateList()
      }
    })
  }
  // 点击排序 开启全部排序状态
  private changeSortStatusHandle() {
    this.isSorting = true
  }
  private inputChangeHandle(e: Input, id: string) {
    let val = (e.target as HTMLInputElement).value
    if (!val) {
      this.$Message.error(`排序必须为大于0的数值`);
      return false
    }
    this.saveSortParams[id] = val
  }
  // 表格选中
  private onTableSelectHandle (selection: []) {
    this.selectedDatas = selection
  }
  // 点击批量删除按钮
  private handleDeleteSelection() {
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
      cancelText: "取消",
      onOk: () => {
        selectedDatas.map((e:any) => {
          ids.push(e.id as string)
        })
        _this.deleteOperate(ids.join(','))
      }
    };
    this.$Modal.confirm(config);
  }
  // 删除菜单事件
  private deleteOperate (ids: string | number) {
    deleteOperate({ids: ids}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`删除成功`);
        this.params.currPage = 1
        this.getOperateList()
      }
    })
  }
   // 删除菜单提示
  private deleteHandle (id: string | number, _index: number) {
    let _this = this
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.deleteOperate(id);
      }
    };
    this.$Modal.confirm(config);
  }
  // 点击表单下方的全选按钮
  private handleSelectAll(value: Boolean) {
    (this.$refs.selection as Vue).selectAll(value);
  }
  @Watch('$route')
  onRouteChange () {
    this.params = {
      currPage: 1,
      pageSize: 10,
      name: '',
      menuId: '',
      status: '',
      code: '',
      menuName: '',
      dataType: ''
    };
    this.total = 0;
    this.getPageData()
  }
  // 获取数据类型dataType 三种不同的路由 都是跳转的这个页面  要根据路由来判断当前需要请求哪个端的数据
  private getDataTypeOrPath (str: string) {
    let dataType = ''
    switch (str) {
      case '/cloud-operate':
        dataType = 'CLOUD'
        break;
      case '/site-operate':
        dataType = 'SITE'
        break;
      case '/company-operate':
        dataType = 'COMPANY'
        break;
    }
    return dataType
  }
  // 当前页面获取数据所需要执行的方法
  private getPageData () {
    // 获取当前的路由path 然后判断当前是哪个端
    let {path} = this.$route
    let type = this.getDataTypeOrPath(path)
    this.dataType = type.toLowerCase()
    this.params.dataType = type
    this.getOperateList()
    getUserMenu({type}).then(res => {
      let { datas } = res;
      this.spinShow = false
      if (datas && datas.length) {
        this.userMenu = []
        this.dataFormat(datas, this.userMenu);
      } else {
        this.userMenu = []
        setTimeout(() => {
          this.setMarginLeft();
        }, 50)
      }
    }).catch(err => {
      this.spinShow = false
    });
  }
  mounted() {
    this.getPageData()
  }
}
</script>
<style lang='scss' scoped>
.people {
  position: relative;
  height: 100%;
  .sidebar {
    position: fixed;
    left: 285px;
    top: 127px;
    height: calc(100vh - 142px);
    padding: 16px;
    min-width: 120px;
    box-sizing:border-box;
    background: $bg;
    overflow-y:auto;
    transition: width .3s;
  }
  .article {
    position: relative;
    padding: 8px;
    z-index: 1;
    margin-left: 120px;
    transition: margin .3s;
  }
  .top {
    padding: 15px 10px 0;
    background: $grayLight;
  }
  .people-tab {
    margin-top: 8px;
    margin-bottom:12px;
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
  .table-foot {
    padding-left: 24px;
    padding-bottom: 24px;
    .check {
      margin-right: 16px;
    }
    .btn {
      margin-right: 16px;
    }
  }
  .page {
    text-align: center;
  }
}
</style>
