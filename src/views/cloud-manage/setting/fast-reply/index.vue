<template>
  <div class="tags-page">
    <div class="top-con">
      <Form inline v-model="requestParams">
        <FormItem label="名称：" :label-width="80">
          <Input
            placeholder="请输入标签名称"
            :maxlength="10"
            v-model.trim="requestParams.reply"
            class="tags-ipt"
          />
        </FormItem>

        <FormItem
          label="状态："
          :label-width="80"
          v-if="tagTypes.length&&modalData.resourceType!=='CONTENT_TYPE_TOPIC'"
        >
          <Select v-model="requestParams.labelType" class="tags-ipt">
            <Option value>全部</Option>
            <Option v-for="type in tagTypes" :key="type.value" :value="type.value">{{type.name}}</Option>
          </Select>
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
          <Button type="primary" @click="onAddTagBtnHandle" style="margin-left: 15px;">添加</Button>
        </FormItem>
      </Form>
    </div>
    <div class="tables">
      <BaseTable :configure="configure" @getList="getList">
        <Table
          :columns="modalData.resourceType!=='CONTENT_TYPE_TOPIC'?columns:columns2"
          :data="datas"
          border
          :loading="loading"
          @on-selection-change="onTableSelectHandle"
        >
          <template slot-scope="{ row }" slot="sort">
            <!-- <InputNumber
              v-if="isSorting"
              :min="1"
              :max="999"
              v-model="row.sort"
              @on-change="inputChangeHandle(row)"
            ></InputNumber> -->
            <Input  v-if="isSorting" @on-change="inputChangeHandle(row)" v-model="row.sort" />
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
    <Modal v-model="addTagModle" :title="modalTitle" :width="400" footer-hide>
      <Form v-model="modalData">
        <FormItem label="标签名称：" :label-width="90">
          <Input v-model="modalData.reply" :maxlength="10" placeholder="请输入标签名称" />
        </FormItem>
        <FormItem :label-width="90">
          <Button class="btn" @click="onAddTagModalCancel">取消</Button>
          <Button
            class="btn"
            type="primary"
            @click="onAddTagModalConfirm"
            style="margin-left:20px;"
          >{{'确认'+modalTitle}}</Button>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="addTagSpinShow"></Spin>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { BaseTable } from "@components/index";
import {
  getTags,
  saveTags,
  deleteTag,
  updateTagsStatus,
  sortTags
} from "@service/common";
import {
  replyList,
  saveReply,
  replySetSort,
  replyUpdateStatus,
  replyDelete
} from "@service/cloud-manage";
import { ModalConfig, Input } from "iview/types";
import UploadImg from "@components/upload/upload-image.vue";

interface SaveTagParamType {
  resourceType: string;
  labelName: string;
  labelType: string;
  id: string;
}

interface LabelType {
  name: string;
  value: string;
}

@Component({
  components: { BaseTable, UploadImg }
})
export default class CloudTags extends Vue {
  // 用于保存排序的对象
  private saveSortParams: any = {};
  // 是否在排序中
  private isSorting = false;
  // table中选中的项
  private selectedDatas = [];
  // 添加弹窗和 修改弹窗的title
  private modalTitle = "";
  // 修改 新增标签需要的值
  private modalData = {
    reply: "",
    id: ""
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
  // 请求参数
  private requestParams = {
    reply: "",
    pageSize: 10,
    currPage: 1,
    status: ""
  };
  // 表格加载动画
  private loading = false;
  // 表格头部
  private columns = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "标签名称",
      key: "reply"
    },
    // {
    //   title: "标签类型",
    //   key: "labelType",
    //   slot: "labelType"
    // },
    {
      title: "创建时间",
      key: "createTime",
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
  // 表格头部（无标签类型）
  private columns2 = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "标签名称",
      key: "reply"
    },
    {
      title: "创建时间",
      key: "createTime",
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
  // 表格数组
  private datas = [];
  // 添加标签弹窗是否显示
  private addTagModle = false;
  // 添加弹窗loading动画
  private addTagSpinShow = false;
  private tagTypes: Array<LabelType> = [];
  @Watch("addTagModle")
  modalChangeHandle(val: boolean) {
    if (!val) {
      setTimeout(() => {
        this.resetModalData();
      }, 300);
    }
  }
  // 重新设置添加编辑弹窗的form表单值
  private resetModalData() {
    this.modalData.id = "";
    this.modalData.reply = "";
  }
  // 重新设置请求页数为1
  private resetRequestCurrPage() {
    this.requestParams.currPage = 1;
    this.configure.page.currPage = 1;
  }
  // 获取列表
  private getList(page?: any) {
    this.loading = true;
    if (page) {
      this.requestParams.currPage = page.currPage;
      this.requestParams.pageSize = page.pageSize;
    }
    replyList(this.requestParams)
      .then(res => {
        this.loading = false;
        // 重置选中的数组
        this.selectedDatas = [];
        let { page, datas } = res;
        if (page) {
          this.configure.page = page as any;
        }
        if (datas) {
          this.datas = datas;
        }
      })
      .catch(err => {
        this.loading = false;
      });
  }
  // 点击添加标签展示弹窗
  private onAddTagBtnHandle() {
    this.modalTitle = "添加";
    this.addTagModle = true;
  }
  // 点击取消按钮隐藏弹窗
  private onAddTagModalCancel() {
    this.addTagModle = false;
    this.resetModalData();
  }
  // 点击确定按钮 进行添加操作
  private onAddTagModalConfirm() {
    this.addTagSpinShow = true;
    saveReply(this.modalData)
      .then(res => {
        this.addTagSpinShow = false;
        if (res.code === 0) {
          this.addTagModle = false;
          this.$Message.success(`${this.modalTitle}成功`);
          this.resetModalData();
          // 重新获取列表
          this.getList();
        }
      })
      .catch(err => {
        this.addTagSpinShow = false;
        this.addTagModle = false;
      });
  }
  // 点击编辑按钮 展示弹窗 并设置对应的值
  private editHandle(row: any) {
    this.modalData.id = row.id;
    this.modalData.reply = row.reply;
    this.modalTitle = "修改";
    this.addTagModle = true;
  }
  private onTableSelectHandle(selection: any) {
    this.selectedDatas = selection;
  }
  // 删除提示
  private deleteNoticeHandle(id: string | number) {
    let _this = this;
    let config: ModalConfig = {
      title: "操作提示",
      content: `删除此标签后，此标签将不在后台/用户端进行展示?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.deleteReply(id);
      }
    };
    this.$Modal.confirm(config);
  }
  // 批量删除
  private deleteSelectionHandle() {
    let ids: string[] = [];
    let { selectedDatas } = this;
    if (selectedDatas.length === 0) {
      this.$Message.error("未选中需要删除的项");
      return false;
    }
    let _this = this;
    let config: ModalConfig = {
      title: "操作提示",
      content: `删除此标签后，此标签将不在后台/用户端进行展示?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        selectedDatas.map((e: any) => {
          ids.push(e.id as string);
        });
        _this.deleteReply(ids.join(","));
      }
    };
    this.$Modal.confirm(config);
  }
  // 删除请求
  private deleteReply(ids: string | number) {
    replyDelete({ ids }).then(res => {
      if (res.code === 0) {
        this.$Message.success(`删除成功`);
        this.resetRequestCurrPage();
        this.getList();
      }
    });
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
  // 更改是否禁用请求
  private statusChangeRequest(option: any) {
    let { id, status, title } = option;
    let params = {
      status,
      id: id
    };
    replyUpdateStatus(params).then(res => {
      if (res.code === 0) {
        this.$Message.success(`${title}成功`);
        // 修改当前数组中的值
        this.getList();
      }
    });
  }
  // 点击排序按钮
  private changeSortStatusHandle() {
    this.isSorting = true;
  }
  // 排序输入框改变
  private inputChangeHandle(row: any) {
    this.saveSortParams[row.id] = row.sort;
  }
  // 点击保存排序
  private saveSortHandle() {
    if(JSON.stringify(this.saveSortParams) != '{}'){
      replySetSort({ params: JSON.stringify(this.saveSortParams) }).then(res => {
        if (res.code === 0) {
          this.$Message.success(`保存排序成功`);
          this.resetRequestCurrPage();
          this.getList();
        }
      });
       this.saveSortParams = {};
       this.isSorting = false;
    }
  }
  // 搜索
  private searchHandle() {
    this.resetModalData();
    this.resetRequestCurrPage();
    this.getList();
  }
  created() {
    let { path } = this.$route;
    this.getList();
  }
}
</script>

<style lang='scss' scoped>
.tags-page {
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
  padding: 15px 15px 0;
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
.addModal-content {
  .addModal-footer {
    text-align: center;
  }
  .btn {
    margin: 0 10px;
  }
}
.tags-ipt {
  min-width: 162px;
}
</style>
