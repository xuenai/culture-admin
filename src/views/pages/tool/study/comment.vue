<template>
  <div>
    <Form class="form" ref="params" inline :model="params" :label-width="90">
      <FormItem label="关键字" prop="name">
        <Input placeholder="请输入关键字" v-model="params.name" :maxlength="30" class="w300" @on-enter="getList()" />
        <Button @click="getList()" type="primary" class="ml10">搜索</Button>
      </FormItem>
    </Form>
    
    <BaseTable class="list-box" :configure="tableConfig" @getList="getList">
      <Table :columns="tableData.headList" :data="tableData.bodyList" border size="default" :loading="loading">
        <template slot-scope="{ row }" slot="status">
          <!-- <div v-if="row.status === 1">
            <span class="switchLabel">正常</span>
            <span class="switchBox" @click="changeStatus(row,'禁用')">
              <i-switch :value="true" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else-if="row.status === 2">
            <span class="switchLabel">禁用</span>
            <span class="switchBox" @click="changeStatus(row,'启用')">
              <i-switch :value="false" />
              <span class="cover"></span>
            </span>
          </div> -->
          <div >{{getStatusTxt[row.status]}}</div>
        </template>

        <!-- <template slot-scope="{ row }" slot="action">
          <a href="javascript:;" class="theme-blue" @click="deleteIds(row.id)">删除</a>
        </template> -->
      </Table>
    </BaseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getSchoolCommentList } from "@service/tool"
import { getStatusTxt } from "@util/comm";
import BaseTable from "@components/baseTable/baseTable.vue";

@Component({
  components: {
    BaseTable,
  }
})
export default class BrandAdd extends Vue {
  // 提交参数
  private params = <any>{
    name: "",
    pageSize: 10,
  };
  // 状态值
  private getStatusTxt: any = getStatusTxt;
  // 表格分页信息
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: "right"
  };
  //
  private tableData = <any>{
    headList: [
      {
        title: "评论",
        key: "content",
        width: 500,
        align: "left"
      },
      {
        title: "课程名称",
        key: "courseName",
        width: 300,
        align: "center"
      },
      {
        title: "评论用户",
        key: "userName",
        align: "center"
      },
      {
        title: "评论时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "状态",
        align: "center",
        slot: "status"
      },
      // {
      //   title: "操作",
      //   align: "center",
      //   slot: "action",
      //   width: 200
      // }
    ],
    bodyList: []
  }
  //
  private loading = false;

  created() {
    this.params.courseId = this.$route.query.id
    this.getList()
  }

  // 获取列表
  private getList(page?: any) {
    if (page) {
      Object.assign(this.params, page)
    } else {
      this.params.currPage = 1
    }
    this.loading = true
    getSchoolCommentList(this.params).then((res:any) => {
      if (res.code === 0) {
        this.tableData.bodyList = res.datas
        this.tableConfig.page = res.page
      }
    }).finally(() => this.loading = false)
  }
  // 删除
  // private deleteIds(id: any) {
  //   let config = <any>{
  //     title: "操作提示",
  //     okText: "确认删除",
  //     cancelText: "取消",
  //     onOk: () => {
  //       this.updateCommentStatus(id, 3)
  //     },
  //     render: (h: any, params: any) => {
  //       return h("p", `是否要删除？`);
  //     }
  //   }
  //   this.$Modal.confirm(config)
  // }
  // 数据状态值切换
  // private changeStatus(row: any, title: string) {
  //   let config = <any>{
  //     title: "操作提示",
  //     content: "确认是否" + title + "？",
  //     okText: "确认",
  //     cancelText: "关闭",
  //     onOk: () => this.updateCommentStatus(row.id, [2, 1][row.status - 1])
  //   };
  //   this.$Modal.confirm(config);
  // }
  // 更新状态
  // private updateCommentStatus(id:any, status: number) {
  //   updateCommentStatus({
  //     id,
  //     status
  //   }).then((res:any) => {
  //     if (res.code === 0) {
  //       this.$Message.success("操作成功!");
  //       this.getList();
  //       this.loading = false;
  //     }
  //   })
  // }
}
</script>

<style lang='scss' scoped>
.w300 {
  width: 300px;
}
.w360 {
  width: 360px;
}
.form {
  padding-top: 24px;
}
.list-box {
  padding: 0 24px;
  .switchLabel {
    margin-right: 5px;
  }
  .switchBox {
    position: relative;
    display: inline-block;
    .cover {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
