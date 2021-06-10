/*
 * @Author: Hexg 
 * @Date: 2019-06-28 10:38:37 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-12-27 17:22:25
 */
<template>
  <div class="dictionaries">
    <div class="top-con">
      <Form inline v-model="requestParams">
        <FormItem label="名称：" :label-width="50">
          <Input placeholder="字典名称" :maxlength="10" v-model.trim="requestParams.name" class="tags-ipt"/>
        </FormItem>
        <FormItem label="编码：" :label-width="50">
          <Input placeholder="字典编码" :maxlength="100" v-model.trim="requestParams.value" class="tags-ipt"/>
        </FormItem>
        <FormItem label="状态：" :label-width="50">
          <Select v-model="requestParams.status" class="tags-ipt">
            <Option value>不限</Option>
            <Option value="1">正常</Option>
            <Option value="2">禁用</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchHandle">搜索</Button>
          <Button class="ml20" type="primary" @click="onAddBtnHandle">添加</Button>
        </FormItem>
      </Form>
    </div>
    <div class="tables">
      <BaseTable :configure="configure" @getList="getList">
        <Table :columns="columns" :data="datas" :loading="loading" @on-selection-change="onTableSelectHandle">
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
              <span class="tab-btn" @click="editHandle(row)">修改</span>|
              <span class="tab-btn" @click="deleteNoticeHandle(row.id)">删除</span>
            </div>
          </template>
        </Table>
      </BaseTable>
      <div class="footer-btns">
        <Button type="primary" class="btn" v-if="!isSorting" @click="changeSortStatusHandle">排序</Button>
        <Button type="primary" class="btn" v-else @click="saveSortHandle">保存</Button>
        <Button type="primary" class="btn" @click="deleteSelectionHandle">批量删除</Button>
      </div>
    </div>
    <Modal v-model="addModle" :title="modalTitle" :width="400" :closable="false" :mask-closable="false" class="addModal-content">
      <Form :model="modalData" :rules="modalDataValidate" ref="modalForm">
        <FormItem label="字典名称：" :label-width="90" prop="name">
          <Input v-model="modalData.name" placeholder="请输入字典名称" :maxlength="100"/>
        </FormItem>
        <FormItem label="字典编码：" :label-width="90" prop="value">
          <Input v-model="modalData.value" placeholder="请输入字典编码" :maxlength="100"/>
        </FormItem>
        <FormItem label="字典类型：" :label-width="90" prop="type">
          <Input v-model="modalData.type" placeholder="请输入字典类型" :maxlength="100"/>
        </FormItem>
        <FormItem label="上级字典：" :label-width="90">
          <Select v-model="modalData.pid">
            <Option v-for="data in modalSelectList" :key="data.ID" :value='data.ID'>{{data.NAME}}</Option>
          </Select>
        </FormItem>
        <FormItem label="排序：" prop="sort" :label-width="90">
          <Input number type="number" v-model="modalData.sort" placeholder="请输入" :maxlength="20"/>
        </FormItem>
      </Form>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" @click="onAddTagModalCancel">取消</Button>
        <Button class="btn" type="primary" @click="onAddTagModalConfirm">确定</Button>
      </div>
      <Spin size="large" fix v-if="addSpinShow"></Spin>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { BaseTable } from "@components/index";
import { ModalConfig, Input } from "iview/types"
import {getDictList, updateDictStatus, getDictSelectList, saveOrEditDict, delDict, sortDict} from '@service/cloud-manage'

const defaultModalData = {
    name: '',
    value: '',
    type: '',
    pid: '',
    id: '',
    sort: 999
  }

@Component({components:{BaseTable}})
export default class Dictionaries extends Vue {
  // 添加弹窗是否显示
  private addModle = false;
  // 弹窗中的数据表单
  private modalData = {
    name: '',
    value: '',
    type: '',
    pid: '',
    id: '',
    sort: 999
  };
  // 弹窗标题
  private modalTitle = ''
  // 弹窗表单验证
  private modalDataValidate = {
    name: [
      { required: true, message: "请输入字典名称", trigger: "blur" },
      { max: 100, message: "字典名称不超过100个字符", trigger: "blur" }
    ],
    value: [
      {required: true, message:"请输入字典编码", trigger: "blur"}
    ],
    type: [
      {required: true, message:"请输入字典类型", trigger: "blur"}
    ]
  }
  // 弹窗中字典列表（不带分页的列表）
  private modalSelectList = []
  // 弹窗的加载动画
  private addSpinShow = false
  // 请求字典列表的参数
  private requestParams = {
    currPage: 1,
    pageSize: 10,
    value: '',
    name: '',
    status: ''
  };
  // baseTable组件需要的参数
  private configure = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "right"
  };
  // 表格加载数据动画
  private loading = false
  // 列表 表头
  private columns = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "字典名称",
      key: "name"
    },
    {
      title: "字典编码",
      key: "value",
      align: "center"
    },
    {
      title: "字典类型",
      key: "type",
      align: "center"
    },
    {
      title: "上级字典",
      key: "pname",
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
      align: "center"
    },
    {
      title: "操作",
      slot: "operate",
      align: "center"
    }
  ];
  // 字典列表
  private datas = [];
  // 选中的
  private selectedDatas = []
  // 是否在排序中
  private isSorting = false;
  // 用于保存排序的对象
  private saveSortParams:any = []
  // 获取列表
  private getList (page?:any) {
    this.loading = true;
    if (page) {
      this.requestParams.currPage = page.currPage;
      this.requestParams.pageSize = page.pageSize;
    }
    getDictList(this.requestParams).then(res => {
      this.loading = false
      this.selectedDatas = []
        let { page, datas } = res;
        if (page) {
          this.configure.page = page as any;
        }
        if (datas) {
          this.datas = datas;
        }
    }).catch(err =>{
      this.loading = false
    })
  }
  // 获取不带分页列表
  private getSelectList (excludeId?: number|string) {
    getDictSelectList({excludeId}).then(res => {
      let {datas} = res
      if (datas) {
        this.modalSelectList = datas
      }
    })
  }
  // 表单选择框选中
  private onTableSelectHandle (selection: []) {
    this.selectedDatas = selection
  }
  // 点击添加按钮
  private onAddBtnHandle () {
    this.modalTitle = '添加字典'
    this.getSelectList()
    this.addModle = true;
  }
  // 重新设置添加编辑弹窗的form表单值
  private resetModalData () {
    setTimeout(() => {
      (this.$refs.modalForm as Vue).resetFields()
      this.modalData = defaultModalData
      this.modalData.id = ''
      this.modalSelectList = []
    }, 100)
  }
  // 弹窗取消点击
  private onAddTagModalCancel () {
    this.addModle = false
    this.resetModalData()
  }
  // 弹窗点击确认
  private onAddTagModalConfirm () {
    (this.$refs.modalForm as Vue).validate((valid: boolean) => {
      if (valid) {
        // this.addSpinShow = true
        this.saveDictionaries()
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  // 添加字典请求
  private saveDictionaries () {
    this.addModle = false
    saveOrEditDict(this.modalData).then(res => {
      if (res.code === 0) {
        // this.addModle = false
        this.$Message.success(`${this.modalTitle}成功`);
        this.resetModalData()
        this.resetRequestCurrPage()
        // 重新获取列表
        this.getList()
      }
    }).catch(err => {
      this.addSpinShow = false
    })
  }
  // 重置请求页数
  private resetRequestCurrPage () {
    this.requestParams.currPage = 1
    this.configure.page.currPage = 1
  }
  // 搜索
  private searchHandle () {
    this.resetModalData()
    this.resetRequestCurrPage()
    this.getList()
  }
  // 点击状态按钮按钮触发
  private statusChangeHandle(row: any) {
    let _this = this;
    let title = row.status === 1 ? "禁用" : "启用";
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否${title}?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        let { id, status } = row as any;
        if (status === 1) {
          status = 2;
        } else if (status === 2) {
          status = 1;
        }
        _this.statusChangeRequest({ id, status, title });
      }
    };
    this.$Modal.confirm(config);
  }
  // 保存状态更改
  private statusChangeRequest(option: any) {
    let { id, status, title } = option;
    let params = {
      status,
      id: id
    };
    updateDictStatus(params).then(res => {
      if (res.code === 0) {
        this.$Message.success(`${title}成功`);
        // 修改当前数组中的值
        this.getList()
      }
    });
  }
  // 点击排序按钮
  private changeSortStatusHandle () {
    this.isSorting = true
  }
  // 排序输入框值发生改变
  private inputChangeHandle (e: Input, id: string) {
    let val = (e.target as HTMLInputElement).value
    if (!val) {
      this.$Message.error(`排序必须为大于0的数值`);
      return false
    }
    let index = this.saveSortParams.findIndex((item:any) => item.id == id)
    // 判断当前改变的对象在数组中是否存在
    if (index !== -1) {
      // 对对象重新赋值
      this.saveSortParams[index].sort = val
    } else {
      // 像数组中添加新的值
      this.saveSortParams.push({sort: val, id})
    }
  }
  // 点击保存按钮 进行保存排序操作
  private saveSortHandle () {
    let len = this.saveSortParams.length
    if (len) {
      let _this = this
      let config: ModalConfig = {
        title: "操作提示",
        content: `是否保存排序修改?`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          _this.sortDict();
        }
      };
      this.$Modal.confirm(config);
    }
    this.isSorting = false
  }
  private sortDict () {
     sortDict({jsonDto: JSON.stringify(this.saveSortParams)}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`保存排序成功`);
        this.resetRequestCurrPage()
        this.getList()
      }
    })
  }
  // 点击修改按钮
  private editHandle (row: any) {
    this.modalData.name = row.name
    this.modalData.value = row.value
    this.modalData.type = row.type
    this.modalData.pid = row.pid
    this.modalData.id = row.id
    this.modalTitle = '修改'
    this.getSelectList(row.id)
    this.addModle = true;
  }
  // 点击删除按钮显示弹窗
  private deleteNoticeHandle (id: string | number) {
    let _this = this
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.deleteHandle(id);
      }
    };
    this.$Modal.confirm(config);
  }
  // 批量删除
  private deleteSelectionHandle () {
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
        _this.deleteHandle(ids.join(','))
      }
    };
    this.$Modal.confirm(config);
  }
  // 删除标签请求
  private deleteHandle (ids:string | number) {
    delDict({ids}).then(res => {
      if (res.code === 0) {
        this.$Message.success(`删除成功`);
        this.resetRequestCurrPage()
        this.getList()
      }
    })
  }
  created () {
    this.getList()
  }

}
</script>

<style lang='scss' scoped>
.dictionaries {
  padding: 15px 15px 0;
  .ivu-form {
    .ivu-form-item-label {
      padding-right: 10px;
    }
    .ivu-form-item {
      margin-bottom: 20px;
    }
  }
}
.top-con {
  padding: 20px 20px 0;
  background: $grayLight;
}
.tables {
  padding: 15px 0 20px;
  min-height: 400px;
}
.footer-btns {
  padding-top: 10px;
  text-align: center;
  .btn {
    margin: 0 6px;
  }
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
.addModal-content{
  .addModal-footer{
    text-align:center;
  }
  .btn{
    margin: 0 10px;
  }
}
.tags-ipt{
  min-width:162px;
}
</style>
