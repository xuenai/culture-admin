<template>
  <div class="wrap">
    <Tree
      :data="channelList"
      :show-checkbox="false"
      class="left-panel"
      v-if="channelList.length"
      @on-select-change="setChannel"
      :loading="loading"
    ></Tree>
    <div class="right-panel">
      <Alert type="warning" show-icon>提示: 在此编辑内容模型字段,子栏目中内容字段默认继承父栏目内容字段设置。</Alert>
      <router-link :to="{path: '/con-fields-add', query: {channelId: params.channelId}}" v-if="operates.includes('save')">
        <Button type="primary" class="mt15">添加</Button>
      </router-link>
      <Table
        :columns="tableData.headList"
        :data="tableData.bodyList"
        class="mt20"
        :loading="loading"
      >
        <template slot-scope="{ row}" slot="validate">{{row.validate ? '启用' : '禁用'}}</template>
        <template
          slot-scope="{ row}"
          slot="must"
        >{{row.must ? '是' : (row.must === false ? '否' : '-')}}</template>
        <template slot-scope="{ row}" slot="action">
          <a to class="theme-blue action-btn" href="javascript:;" @click="del(row)" v-if="operates.includes('delete')">删除</a>
        </template>
      </Table>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";
import {
  getExtendFieldList,
  getFielChannelList,
  deleteExtendFieldList
} from "@service/cloud-manage";
@Component
export default class ContentFields extends Vue {
    // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private channelList: any = [];
  private params: any = {
    channelId: ""
  };
  private loading: Boolean = false;
  private tableData: any = {
    headList: [
      {
        title: "显示名称",
        key: "fieldName",
        align: "center"
      },
      {
        title: "字段代码",
        key: "fieldCode",
        align: "center"
      },
      {
        title: "表单提交类型",
        key: "fieldType",
        align: "center"
      },
      {
        title: "是否启用表单验证",
        key: "validate",
        align: "center",
        slot: "validate"
      },
      {
        title: "是否为必填项",
        key: "must",
        align: "center",
        slot: "must"
      },
      {
        title: "操作",
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  mounted() {
    this.getChannelList();
    this.getList();
  }
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.params, page);
    getExtendFieldList({
      channelId: this.params.channelId
    }).then(data => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = data.datas as [];
      this.loading = false;
    });
  }
  // 删除
  private del(item: any) {
    let _this = this;
    let config: any = {
      title: "删除配置",
      content: `确认要删除“${item.fieldName}”配置？删除后将无法恢复！`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.delField(item.id);
      }
    };
    this.$Modal.confirm(config);
  }
  private delField(id: Number) {
    deleteExtendFieldList({
      id: id
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("删除成功！");
        this.getList();
        this.getChannelList();
      }
    });
  }
  // 内容栏目列表
  private getChannelList() {
    let _this = this;
    getFielChannelList().then(data => {
      let _data = data.datas as [];
      _data.filter((item: any, index: any) => {
        if (index === 0) {
          item.selected = true;
          this.params.channelId = item.id;
        } else {
          item.selected = false;
        }
        item.children = item.subset;
        item.expand = true;
        item.title = item.name + `（${item.num}）`;
        _this.filterObj(item);
        if (index === _data.length - 1) {
          _this.channelList = _data;
        }
      });
    });
  }
  private filterObj(item: any) {
    let _this = this;
    if (item.hasOwnProperty("subset")) {
      item.subset.filter(function(child: any) {
        child.children = child.subset;
        child.title = child.name + `（${child.num}）`;
        child.checked = false;
        child.expand = true;
        if (child.hasOwnProperty("subset")) {
          return _this.filterObj(child);
        }
      });
    }
  }
  // 栏目筛选
  private setChannel(e: any) {
    if (e.length) {
      this.params.channelId = e[0].id;
    } else {
      this.params.channelId = this.channelList[0].id;
      this.channelList[0].selected = true;
    }
    this.getList();
  }
}
</script>

<style lang='scss' scoped>
.mt15 {
  margin-top: 15px;
}
.wrap {
  display: flex;
  .left-panel {
    padding: 0 10px;
    min-width: 180px;
    background: #f8fafe;
    min-height: calc(100vh - 142px);
    max-width: 400px;
  }
  .right-panel {
    flex: 1;
    padding: 20px;
    overflow: hidden;
    .tab-warp {
      padding: 20px;
      background-color: $bg01;
    }
  }
}
</style>
