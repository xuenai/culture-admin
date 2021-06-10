<template>
  <div class="role">
    <Form inline class="form">
      <FormItem label="角色名称：" :label-width="80">
        <Input v-model.trim="params.keyword" :maxlength="20" />
      </FormItem>
      <FormItem>
        <Button type="primary" @click="searchHandle">搜索</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="goToAdd">添加角色</Button>
      </FormItem>
      <FormItem v-if="!isSorting">
        <Button type="primary"  @click="changeSortStatusHandle">排序</Button>
      </FormItem>
      <FormItem v-else>
        <Button type="primary" @click="saveSortHandle">保存</Button>
      </FormItem>
      <FormItem>
        <Button @click="handleDeleteSelection">删除</Button>
      </FormItem>
    </Form>
    <Table :columns="columns" :data="datas" class="table" @on-selection-change="onTableSelectHandle" :loading="loading">
      <template slot-scope="{ row }" slot="sort">
        <Input v-if="isSorting" number type="number" :value="row.sort" @on-change="inputChangeHandle($event, row.id)"/>
        <span v-else>{{row.sort}}</span>
      </template>
      <template slot-scope="{ row }" slot="operate">
        <span class="operate-btn" @click="goDetail(row.id, row.dataType)">查看</span>
        <span class="operate-btn" @click="goEdit(row.id, row.dataType)">编辑</span>
        <span class="operate-btn" @click="deleteHandle(row.id, row._index)">删除</span>
      </template>
    </Table>
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
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ModalConfig } from "iview/types";
import {getRoleList, deleteRole, updateRoleSort} from '@service/app'

@Component
export default class RoleManage extends Vue {
  private loading = true
  private total = 0
  private selectedDatas = []
  // 是否正在排序中 
  private isSorting = false
  private columns = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "角色名称",
      key: "name"
    },
    {
      title: "员工数量",
      key: "staffCount",
      align: "center"
    },
    {
      title: '排序',
      slot: 'sort',
      align: 'center'
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
    keyword: ''
  }
  private saveSortParams:any = {}
  // 点击排序按钮
  private changeSortStatusHandle () {
    this.isSorting = true
  }
  // 排序输入框改变
  private inputChangeHandle(e: any, id: string) {
    let val = (e.target as HTMLInputElement).value
    if (!val) {
      this.$Message.error(`排序必须为大于0的数值`);
      return false
    }
    this.saveSortParams[id] = val
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
    updateRoleSort({params: JSON.stringify(this.saveSortParams) as string}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`保存排序成功`);
        this.params.currPage = 1
        this.getRoleList()
      }
    })
  }
  // 前往详情页
  private goDetail (id: string, dataType: string) {
    this.$router.push({path: '/role-detail', query: {id, dataType}})
  }
  // 前往编辑页
  private goEdit (id: string, dataType: string) {
    this.$router.push({path: '/role-edit', query: {id, dataType}})
  }
  // 当前页改变
  private pageChangeHandle (page: number) {
    this.params.currPage = page
    this.getRoleList()
  }
  // 每页显示条数改变
  private sizeChangeHandle (size: number) {
    this.params.pageSize = size
    this.getRoleList()
  }
  // 前往添加页面
  private goToAdd () {
    this.$router.push({path: `/role-add`})
  }
  // 获取列表
  private getRoleList () {
    this.loading = true
    getRoleList(this.params).then(res => {
      this.datas = res.datas || []
      this.loading = false
      if (res.page) {
          this.total = (res.page as any).total
        }
    })
  }
  // 搜索
  private searchHandle () {
    this.getRoleList()
  }
  // table中选中
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
        _this.deleteRole(ids.join(','))
      }
    };
    this.$Modal.confirm(config);
  }
  // table中删除点击
  private deleteHandle (id: string | number, _index: number) {
    let _this = this
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.deleteRole(id);
      }
    };
    this.$Modal.confirm(config);
  }
   // 删除菜单事件
  private deleteRole (ids: string | number) {
    deleteRole({ids: ids}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`删除成功`);
        this.params.currPage = 1
        this.getRoleList()
      }
    })
  }
  mounted () {
    this.getRoleList()
  }
}
</script>

<style lang='scss' scoped>
.role {
  padding: 15px;
  .form{
    padding: 15px 15px 0;
    background: $grayLight;
    margin-bottom: 15px;
  }
  .operate-btn {
    margin:0 4px;
    color: $theme;
    cursor: pointer;
    &:hover {
      color: $theme-hover;
    }
    &:active {
      color: $theme-active;
    }
  }
  .table{
    margin-bottom:24px;
  }
  .page{
    text-align:right;
  }
}
</style>
