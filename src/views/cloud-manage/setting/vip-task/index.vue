/*
 * @Author: Hexg 
 * @Date: 2019-06-28 10:38:37 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-08-28 17:52:27
 */
<template>
  <div class="dictionaries">
    <div class="tables">
        <Form inline v-model="params">
            <FormItem label="发布渠道" :label-width="70">
                <Select v-model="params.publishChannel" class="tags-ipt" placeholder="全部"
                    @on-change="getList">
                    <Option value="-">全部</Option>
                    <Option value="CULTURAL">文化云</Option>
                    <Option value="JKB">集客宝</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="getList">搜索</Button>
            </FormItem>
        </Form>
      <Table :columns="columns" :data="datas" :loading="loading" border>
          <template slot-scope="{ row }" slot="defaultIcon">
              <div v-if="row.defaultIcon" class="defaultIcon"><img :src="row.defaultIcon" alt=""></div>
              <template v-else>--</template>
          </template>
          <template slot-scope="{ row }" slot="operate">
              <div class="table-operate">
                 <span class="tab-btn" @click="editHandle(row)">编辑</span>
              </div>
          </template>
          <template slot-scope="{ row }" slot="publishChannel">
              <span>{{publishChannel[row.publishChannel]}}</span>
          </template>
        </Table>
    </div>
    <Modal v-model="addModle" :title="modalTitle" :width="600" :closable="false" :mask-closable="false" class="addModal-content">
      <Form :model="modalData" :rules="modalDataValidate" ref="modalForm">
        <FormItem label="h5链接地址：" :label-width="100" prop="h5Url">
          <Input v-model="modalData.h5Url" placeholder="请输入h5链接地址"/>
        </FormItem>
      </Form>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" @click="addModle = false">取消</Button>
        <Button class="btn" type="primary" @click="onAddTagModalConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ModalConfig, Input } from "iview/types"
import {getTaskTypeList, updateTaskType} from '@service/common'

interface parmasType {
    publishChannel: string | undefined;
}

@Component({components:{}})
export default class Viptask extends Vue {
  // 弹窗是否显示
  private addModle = false;
  // 弹窗中的数据表单
  private modalData = {
    h5Url: '',
    id: '',
  };
  // 弹窗标题
  private modalTitle = ''
  // 弹窗表单验证
  private modalDataValidate = {
    h5Url: [
      { required: true, message: "请输入h5链接地址", trigger: "blur" }
    ]
  }
  //
  private publishChannel: object = {
      JKB: '集客宝',
      CULTURAL: '文化云'
  }
  // 表格加载数据动画
  private loading = false
  // 列表 表头
  private columns = [
    {
      title: "默认图标",
      key: "defaultIcon",
      align: "center",
      slot: 'defaultIcon',
      width: 150
    },
    {
      title: "任务类型名称",
      align: "center",
      key: "name",
      width: 300
    },
    {
      title: "h5链接地址",
      key: "h5Url",
      align: "center"
    },
    {
      title: "发布渠道",
      align: "center",
      slot: 'publishChannel'
    },
    {
      title: "操作",
      slot: "operate",
      align: "center",
      width: 150
    }
  ];
  // 列表
  private datas:Array<any> = [];
  // 获取列表
  private params: parmasType = {publishChannel: '-'}
  private getList () {
    this.loading = true;
    let parmas = {...this.params}
    if (parmas.publishChannel === '-') parmas.publishChannel = undefined;
    getTaskTypeList(parmas).then(res => {
      if (res.code === 0) {
        this.datas = res.datas as Array<any>
      } else {
        this.datas = []
      }
    }).finally(() => {this.loading = false})
  }
  // 弹窗点击确认
  private onAddTagModalConfirm () {
    (this.$refs.modalForm as Vue).validate((valid: boolean) => {
      if (valid) {
        this.saveDictionaries()
      }
    });
  }
  // 添加请求
  private saveDictionaries () {
    updateTaskType(this.modalData).then(res => {
      if (res.code === 0) {
        this.addModle = false
        this.$Message.success(`${this.modalTitle}成功`);
        // 重新获取列表
        this.getList()
      }
    })
  }
  // 点击修改按钮
  private editHandle (row: any) {
    this.modalData.id = row.id
    this.modalData.h5Url = row.h5Url
    this.modalTitle = '编辑'
    this.addModle = true;
  }
  created () {
    this.getList()
  }
}
</script>

<style lang='scss' scoped>
.defaultIcon {
    width: 48px;
    height: 48px;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    border-radius:50%;
    img {
        width: 100%;
    }
}
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
