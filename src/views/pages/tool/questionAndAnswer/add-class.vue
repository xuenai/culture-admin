<template>
  <div class="content">
    <Form ref="formInline" :model="searchParams" :rules="ruleValidate" :label-width="70" inline
      class="form">
      <FormItem label="分类名称" prop="name">
        <Input type="text" placeholder="请输入分类名称" v-model="searchParams.name" class="w250"
          @on-enter="search()" />
        <Button type="primary" style="margin-left: 20px;" @click="search()">搜索</Button>
        <Button type="primary" style="margin-left: 20px;" @click="() => { showModal = true; saveParams.id = '' }">添加</Button>
        <Button type="primary" style="margin-left: 20px;" @click="deleteFn()">批量删除</Button>
      </FormItem>
    </Form>

    <BaseTable :configure="tableConfig" @getList="search">
      <Table border :columns="tableData.header" :data="tableData.list" :loading="loading"
        @on-selection-change="list => checkedList = list">
        <template slot-scope="{ row }" slot="action">
          <a href="javascript:;"
            @click="() => { saveParams = {qaTypeName: row.name, id: row.id};showModal = true }">修改</a>
          <a href="javascript:;" @click="deleteFn(row)"> 删除</a>
        </template>
      </Table>
    </BaseTable>

    <Modal v-model="showModal" title="添加分类" :loading="true" @on-ok="asyncOK">
      <Input type="text" placeholder="请输入分类名称" v-model="saveParams.qaTypeName" />
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import { saveQaType, getQaselectListPage, deleteQaType } from "@service/tool";

@Component({
  components: {
    BaseTable
  }
})
export default class ComponentName extends Vue {
  private showModal: boolean = false;
  private saveParams: any = { qaTypeName: "" };
  private asyncOK(): void {
    saveQaType(this.saveParams)
      .then((res: any) => {
        if (res.code === 0) {
          this.$Message.success("保存成功");
          this.search({});
        }
      })
      .finally(() => (this.showModal = false));
  }
  private tableData: any = {
    header: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "分类名称",
        key: "name",
        align: "left"
      },
      {
        title: "包含词条数",
        key: "entryNum",
        align: "left"
      },
      {
        title: "创建时间",
        key: "createTime",
        width: 300,
        align: "center"
      },
      {
        title: "操作",
        width: 200,
        slot: "action",
        align: "center"
      }
    ],
    list: []
  };
  private searchParams: any = {
    pageSize: 10,
    currPage: 1,
    name: ""
  };
  private ruleValidate: any = {};
  created() {
    this.search();
  }
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private loading: boolean = false;
  private checkedList: any[] = [];

  // 删除
  private deleteFn(row?: any, i?: number) {
    let title = "",
      ids = "";
    if (row) {
      title = `确认是否删除“${row.name as string}”？`;
      ids = row.id;
    } else {
      if (this.checkedList.length) {
        title = `确认是否删除${this.checkedList.length}条数据？`;
        ids = this.checkedList.map((d: any) => d.id).toString();
      } else {
        this.$Message.info("请选择要删除的数据！");
        return;
      }
    }
    this.$Modal.confirm({
      title: "风险操作提示",
      content: title,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        deleteQaType({ ids }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("删除成功!");
            this.search({});
            this.checkedList = []
          }
        });
      }
    });
  }
  private search(page?: any) {
    this.loading = true;
    if (page) {
      Object.assign(this.searchParams, page);
    } else {
      this.searchParams.currPage = 1;
    }
    getQaselectListPage(this.searchParams)
      .then((res: any) => {
        if (res.code === 0) {
          this.tableData.list = res.datas;
          this.tableConfig.page = res.page;
        }
      })
      .finally(() => (this.loading = false));
  }
}
</script>

<style lang='scss' scoped>
.w250 {
  width: 250px;
}
.content {
  padding: 20px 15px;
  .form {
    background: $grayLight;
    padding: 15px 0 0;
    margin-bottom: 15px;
  }
}
</style>
