<template>
  <Row class="wrap">
    <div class="right-panel">
      <Tabs
        active-key="key1"
        class="tab-warp"
        :animated="false"
        @on-click="setState"
      >
        <Tab-pane label="全部" class="tab-pane"></Tab-pane>
        <Tab-pane :label="waitNumber > 0 ? label : '待审核'"></Tab-pane>
        <Tab-pane label="不通过" class="tab-pane"></Tab-pane>
      </Tabs>

      <Form :label-width="80" inline class="form">
        <FormItem class="item" label="关键字">
          <i-input
            placeholder="课程名称"
            class="w200"
            v-model="params.name"
            @on-enter="getList()"
          ></i-input>
          <Button type="primary" class="ml20" @click="getList()">搜索</Button>
        </FormItem>
      </Form>

      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          size="default"
          class="table"
          :loading="loading"
          ref="selection"
        >

          <template slot-scope="{ row }" slot="info">
            <div class="title">
              <router-link :to="{path:'/course-detail-audit/' + row.resourceId}" class="action-btn hot"
                :title="row.name">
                <span v-if="row.top">[置顶]</span>
                <span v-if="row.recommendHomePage||row.recommendChannelHomePage">[推荐]</span>{{row.name}}</router-link>
            </div>
          </template>

          <template slot-scope="{ row }" slot="status">
            <span>{{getStatusTxt[row.status]}}</span>
          </template>

          <template slot-scope="{ row }" slot="totalDuration">
            <span>{{`${Math.floor( (row.totalDuration||0) / 60 )}分钟`}}</span>
          </template>

          <template slot-scope="{ row }" slot="action">
            <div>
              <router-link
                :to="'/course-detail-audit/' + row.resourceId + '?isAudit=true'"
                class="theme-blue"
                >{{
                  row.status === 4 ? "审核" : "重审"
                }}</router-link>
            </div>
          </template>
        </Table>
      </baseTable>
    </div>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getSchoolCourseAuditList } from "@service/tool";
import baseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import { getStatusTxt } from "@util/comm";
@Component({
  components: {
    baseTable
  }
})
export default class volAuditList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 状态对象
  private getStatusTxt: any = getStatusTxt;
  // 获取审核流程信息
  private loading = true;
  // 待审核
  private waitNumber: Number = 0;
  //表格分页信息
  private params: any = {
    name: ""
  };
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData: any = {
    headList: [
      {
        title: "课程名称",
        align: "left",
        slot: "info"
      },
      {
        title: "类型",
        key: "typeName",
        align: "center"
      },
      {
        title: "主讲人",
        key: "lecturerName",
        align: "center"
      },
      {
        title: "课时",
        key: "chapterNum",
        align: "center"
      },
      {
        title: "总时长",
        key: "totalDuration",
        slot: "totalDuration",
        align: "center"
      },
      {
        title: "来源",
        key: "source",
        align: "center",
      },
      {
        title: "状态",
        align: "center",
        slot: "status"
      },
      {
        title: "操作",
        width: 100,
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  created() {
    this.getList();
    this.getWait();
  }
  // 待审核label
  private label(h: any) {
    return h("div", [
      h("span", "待审核"),
      h("Badge", {
        props: {
          count: this.waitNumber
        }
      })
    ]);
  }
  // tab
  private setState(index: Number) {
    switch (index) {
      case 0:
        this.params.auditStatus = "";
        break;
      case 1:
        this.params.auditStatus = 4;
        break;
      case 2:
        this.params.auditStatus = 79;
        break;
    }
    this.getList();
  }
  // 获取待审核
  private getWait () {
    getSchoolCourseAuditList({auditStatus: 4}).then((res:any) => {
      if (res.code === 0) {
        this.waitNumber = res.page.total
      }
    })
  }
  // 获取列表
  private getList(page?: any) {
    if (page) {
      Object.assign(this.params, page);
    } else {
      this.params.currPage = 1
    }
    this.loading = true;
    getSchoolCourseAuditList(this.params).then((res:any) => {
      if (res.code === 0) {
        this.tableConfig.page = res.page;
        this.tableData.bodyList = res.datas;
      }
    }).finally(() => this.loading = false);
  }
}
</script>

<style scoped lang="scss">
.w200 {
  width: 200px;
}
.wrap {
  padding-bottom: 20px;
  .right-panel {
    padding: 0 15px;
    overflow: hidden;
    .form {
      background: $grayLight;
      margin-bottom: 15px;
      padding-top: 15px;
    }
  }
}
</style>
