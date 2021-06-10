<template>
  <div class="task">
    <!-- 功能菜单添加 -->
    <div class="task-top">
      功能菜单：<router-link to="/task-add"><Button type="primary">添加</Button></router-link>
    </div>
    <!-- 任务配置表格 -->
    <div class="task-tab">
      <BaseTable :configure="config" @getList="getList">
        <Table ref="selection" :columns="columns" :data="data" :loading="loading" @on-selection-change="selectionChange">
          <!-- 任务名称 -->
          <template slot-scope="{ row }" slot="name">
            <div class="name-box">
              <div class="img-box" :class="{'daq-no-photo': row.icon}">
                <img v-if="row.icon" :src="row.icon" alt="">
              </div>
              <div class="txt-box">
                <p class="tit" :title="row.name">
                  <router-link :to="{path: '/task-detail', query: {id: row.id}}">{{row.name}}</router-link>
                </p>
                <p class="summary" :title="row.synopsis">{{row.synopsis || '暂无任务简介'}}</p>
              </div>
            </div>
          </template>
          <!-- 任务奖励 -->
          <template slot-scope="{row}" slot="rewardIntegral">
            <span>积分：{{row.rewardIntegral}}</span>
          </template>
          <!-- 任务时间 -->
          <template slot-scope="{row}" slot="taskTime">
            <span v-if="row.taskLastStatus === 2">{{row.startTime.slice(0, 10)}}至{{row.endTime.slice(0, 10)}}</span>
            <span v-else-if="row.taskLastStatus === 1">长期</span>
          </template>
          <!-- 排序 -->
          <template slot-scope="{row}" slot="sort">
            <span v-if="!isSorting">{{row.sort || '-'}}</span>
            <InputNumber :min="0" :max="99999" :precision="0" v-else :value="row.sort"  @on-change="(e) => {sortInputChange(e, row)}"/>
          </template>
          <!-- 状态 -->
          <template slot-scope="{row}" slot="dataStatus">
            <span v-if="row.dataStatus === 3">已结束</span>
            <span class="status" v-else>
              <span class="switch-box">
                <i-switch class="tab-switch" :value="row.dataStatus === 1"></i-switch>
                <i class="mask" @click="statusChangeHandle(row)"></i>
              </span>
              <span class="status-txt">{{row.dataStatus === 1 ? '启用' : '关闭'}}</span>
            </span>
          </template>
          <!-- 操作 -->
          <template slot-scope="{row}" slot="operates">
            <div class="operates">
              <router-link :to="{path: '/task-edit', query: {id: row.id}}" class="operate">修改</router-link>
              <span class="operate" @click="deleteRow(row)">删除</span>
            </div>
          </template>
        </Table>
      </BaseTable>
    </div>
    <!-- 悬浮在底部的按钮 -->
    <div class="btns">
      <Button type="primary" class="btn" v-if="!isSorting" @click="startSort">排序</Button>
      <Button type="primary" class="btn" v-if="isSorting" @click="saveSort">保存</Button>
      <Button type="primary" class="btn" @click="changeStatusBatch(2)">批量禁用</Button>
      <Button type="primary" class="btn" @click="changeStatusBatch(1)">批量启用</Button>
      <Button type="primary" class="btn" @click="changeStatusBatch(0)">批量删除</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { ModalConfig } from "iview/types";

import { BaseTable } from "@components/index";
import {getTaskList, changeTaskStatus, changeTaskStatusType, saveTaskSort} from '@service/member';

@Component({
  components: {
    BaseTable
  }
})
export default class Task extends Vue {
  config =  {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "right"
  };
  // 请求参数
  params = {
    publishChannel: 'CULTURAL',
    cruxValue: this.$store.state.app.userInfo.siteId,
    currPage: 1,
    pageSize: 10,
  };
  // 表格数据
  data = [];
  // 表单表头
  columns = [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      title: '任务名称',
      slot: 'name',
      align: 'center',
    },
    {
      title: '任务类型',
      key: 'taskTypeName',
      align: 'center',
      width: 100,
    },
    {
      title: '任务奖励',
      slot: 'rewardIntegral',
      align: 'center',
      width: 150,
    },
    {
      title: '任务时间',
      slot: 'taskTime',
      align: 'center',
      width: 200,
    },
    {
      title: '排序',
      slot: 'sort',
      align: 'center',
      width: 120,
    },
    {
      title: '状态',
      slot: 'dataStatus',
      align: 'center',
      width: 120,
    },
    {
      title: '操作',
      slot: 'operates',
      align: 'center',
      width: 100,
    },
  ];
  // 表格加载动画
  loading = false;
  // 表单选中项
  selection = [];
  // 是否在排序状态
  isSorting = false;
  // 排序参数
  sortParams:any = {};
  /**
   * sortInputChange 排序输入框值改变
   */
  sortInputChange (val: number, row:any ) {
    this.sortParams[row.id] = val;
  }
  /**
   * startSort 开始排序
   */
  startSort () {
    this.isSorting = true;
  }
  /**
   * saveSort 保存排序
   */
  saveSort () {
    if (!Object.keys(this.sortParams).length) {
      this.$Message.error('请更改任务排序后再进行保存！')
      return false;
    }
    saveTaskSort({params: JSON.stringify(this.sortParams), userId: this.$store.state.app.userInfo.id}).then(res => {
      if (res.code === 0) {
        this.$Message.success('任务排序保存成功！');
        this.getList();
      }
    }).finally(() => {
      this.isSorting = false;
    })
  }
  /**
   * selectionChange 表格选中项变化
   */
  selectionChange (selection: any) {
    this.selection = selection;
  }
  /**
   * delectBatch 批量改变状态
   */
  changeStatusBatch (status: number) {
    if (!this.selection.length) {
      this.$Message.error('请选择需要选中的任务！');
      return false;
    }
    let word = "";
    switch(status) {
      case 0: {
        word = '删除';
        break;
      }
      case 1: {
        word = '开启';
        break;
      }
      case 2: {
        word = '关闭';
        break;
      }
    }
    let ids = this.selection.map((e:any) => e.id).join(',');
    this.operateModal( `请确认是否${word}选中的任务?`,status , ids, () => {
      this.$Message.success(`批量${word}任务成功`);
        this.getList();
    },`${word}任务`)
  }
  /**
   * deleteRow 删除单行数据
   */
  deleteRow (row: any) {
    this.operateModal( `请确认是否删除此项任务?`,0 , row.id, () => {
      this.$Message.success(`删除任务成功`);
        this.getList();
    }, '删除任务')
  }
  /**
   * operateModal 状态改变的弹窗
   */
  operateModal (content: string, status: number ,ids: string | number, callback: () => void, title?: string, ) {
    let config: ModalConfig = {
      title: title || "操作提示",
      content,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        this.statusChangeRequest({status, userId: this.$store.state.app.userInfo.id, ids}, callback)
      }
    };
    this.$Modal.confirm(config);
  }
  /**
   * statusChangeHandle 列表中的改变状态按钮点击
   */
  statusChangeHandle (row: any) {
    let title = row.dataStatus === 1 ? "关闭" : "开启";
    let status = row.dataStatus === 1 ? 2 : 1;
    let {_index, _rowKey, ...rest} = row;
    rest.dataStatus = status;
    this.operateModal( `请确认是否要${title}此项任务?` ,status , row.id, () => {
      this.$Message.success(`${title}任务成功`);
      this.$set(this.data, _index, rest);
    })
  }
  /**
   * statusChangeRequest 状态改变请求（包括 删除 启用 禁用）
   */
  statusChangeRequest (params: changeTaskStatusType, callback: () => void) {
    changeTaskStatus(params).then(res => {
      if (res.code === 0) {
        callback && callback();
      }
    })
  }
  /**
   * getList 获取列表
   * @params page {page对象} 可选
   */
  getList (page?: any) {
    this.loading = true;
    if (page) {
      this.params.currPage = page.currPage as number;
      this.params.pageSize = page.pageSize as number;
    }
    getTaskList(this.params).then(res => {
      // console.log(res);
      if (res.code === 0) {
        this.data = res.datas as [];
        let {page} = res;
        if (page) {
          this.config.page = page as any;
        }
      }
    }).finally(() => {
      this.loading = false;
      this.sortParams = {};
    })
  }
  created () {
    this.getList();
  }
}
</script>

<style lang='scss' scoped>
.task{
  position:relative;
  // height: calc(100vh - 245px);
  padding:0 15px 15px;
  .btns{
    margin:0 auto;
    text-align: center;
    // position:absolute;
    // left:50%;
    // bottom:0;
    // transform: translateX(-50%);
  }
  .btn{
    min-width:48px;
    margin: 0 8px;
  }
}
.task-top{
  padding:5px 10px 20px;
}
.status{
  display: flex;
  align-items: center;

  .switch-box{
    position:relative;
    margin-right:8px;
  }
  .mask{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    cursor: pointer;
  }
}
.operates{
  .operate{
    margin:0 4px;
    color:$theme;
    cursor: pointer;
    &:hover{
      color:$theme-hover;
    }
    &:active{
      color:$theme-active;
    }
  }
}
.name-box{
  display: block;
  text-align: left;
  padding:15px 0;
  overflow:hidden;
  &::after{
    content: "\200B";
    display: block;
    height: 0;
    clear: both;
  }
  .img-box{
    float:left;
    height:60px;
    width:60px;
    img{
      width: 100%;
      height:100%;
    }
  }
  .txt-box{
    height:60px;
    padding:8px 0 0 84px;
  }
  .tit{
    padding-bottom:5px;
    @include ellipsis();
  }
  .summary{
    @include ellipsis();
  }
}
</style>
