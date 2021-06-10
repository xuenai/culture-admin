<!--
 * @Author: xulr
 * @since: 2019-06-04 09:14:58
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-31 17:07:29
 -->
<template>
  <Row class="wrap">
    <div class="right-panel">
      <Form :label-width="80" inline class="form mt20">
        <FormItem class="item" label="关键字">
          <i-input
            placeholder="志愿者名称/手机号"
            class="w200"
            v-model="params.keyWord"
            @on-enter="getSearch"
          ></i-input>
        </FormItem>
        <FormItem class="item" label="性别">
          <Select class="w150" v-model="params.sex" @on-change="getSearch">
            <Option value="">全部</Option>
            <Option value="1">男</Option>
            <Option value="2">女</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="星级">
          <Select class="w150" v-model="params.level" @on-change="getSearch">
            <Option value="">全部</Option>
            <Option value="5">五星</Option>
            <Option value="4">四星</Option>
            <Option value="3">三星</Option>
            <Option value="2">二星</Option>
            <Option value="1">一星</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="加入时间">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择时间"
            @on-change="changeDate"
          ></Date-picker>
          <Button type="primary" class="ml20" @click="getSearch">搜索</Button>
            <a
                    class="ivu-btn ivu-btn-default ml10"
                    @click="outExcel($event)"
                    v-if="operates.includes('export')"
            >导出</a>
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
          @on-selection-change="list => checkedBox = list.map(item => item.volunteerId)"
        >
          <template slot-scope="{ row }" slot="title">
            <div class="topic-msg">
              <div class="msg-panel">
                <p class="topic-name">
                  <span class="theme-blue topicTag">
                    <router-link
                      tag="a"
                      :to="'/volunteers-management-desc/' + row.volunteerId + '/true'"
                      class="theme-blue"
                      >{{ row.name }}</router-link
                    >
                  </span>
                </p>
                <p class="date">{{ row.regionName }}</p>
              </div>
            </div>
            <p class="reply" v-if="row.auditRemark && row.status === 79">
              <span>审核备注：</span>{{ row.auditRemark }}
            </p>
          </template>
          <template slot-scope="{ row }" slot="level">
            <span>{{ setStar(row.level) }}</span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div>
              <router-link
                :to="'/team-audit-desc/' + row.id"
                class="theme-blue"
                >{{
                  row.status === 4 ? "审核" : row.status !== 4 ? "重审" : "-"
                }}</router-link
              >
            </div>
          </template>
        </Table>
      </baseTable>
    </div>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getTeamCheckedList } from "@service/audit";
import baseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";

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
  // 获取审核流程信息
  private loading = true;
  private typeList = [];
  // 复选框ID
  private checkedBox: Array<Number> = [];
  private params = <any>{
    keyWord: "",
    level: "",
    sex: "",
      status: 1,
      createStartDate: "",
      createEndDate: ""
  };
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData = <any>{
    headList: [
      {
        title: "志愿信息",
        align: "center",
        width: 400,
        slot: "title"
      },
      {
        title: "手机号",
        key: "phone",
        align: "center"
      },
      {
        title: "性别",
        key: "sex",
        align: "center"
      },
      {
        title: "年龄",
        key: "age",
        align: "center"
      },
      {
        title: "星级",
        key: "level",
        align: "center",
        slot: "level"
      },
      {
        title: "服务类型",
        key: "serviceType",
        align: "center"
      },
      {
        title: "申请团队名称",
        key: "applyTeamName",
        align: "center"
      },
      {
        title: "加入时间",
        key: "applyTime",
        align: "center"
      },
      {
        title: "操作",
        key: "action",
        width: 100,
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
   // 星级
  private setStar(star: Number) {
    switch (star) {
      case 0:
        return "-";
      case 1:
        return "一星";
      case 2:
        return "二星";
      case 3:
        return "三星";
      case 4:
        return "四星";
      case 5:
        return "五星";
    }
  }
  // 搜索
  private getSearch() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  // 改变日期
  private changeDate(e: any) {
    this.params.createStartDate = e[0];
    this.params.createEndDate = e[1];
    this.getSearch()
  }
  mounted() {
    this.getList();
  }
    // 导出
    private outExcelApi: string = CONFIG.defaultUrl + "/res/volunteer/exportExcel?";
    //获取token
    get token() {
        return AppModule.token;
    }
    outExcel(e: any) {
        let _target = e.target as HTMLInputElement,
                _this = this;
        if (_this.checkedBox.length < 1) {
            this.$Message.error("请选择需要导出的数据！");
        } else {
            _target.setAttribute(
                    "href",
                    this.outExcelApi +
                    "token=" +
                    this.token +
                    "&ids=" +
                    this.checkedBox.join(",")
            );
        }
    }
  // 列表
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.params, page);
      getTeamCheckedList(this.params).then(data => {
          this.tableConfig.page = data.page ? data.page : {};
          this.tableData.bodyList = data.datas;
          this.loading = false;
          this.checkedBox = [];
      });
  }
}
</script>

<style scoped lang="scss">
.w200 {
  width: 200px;
}
.w150 {
  width: 150px;
}
.describe {
  width: 400px;
  height: 150px;
  text-align: center;
  overflow: hidden;
  padding: 20px 15px;
  .item {
    width: 30%;
    display: inline-block;
    line-height: 50px;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    height: 50px;
    font-size: 14px;
    cursor: pointer;
    &:first-child {
      margin-right: 20px;
    }
    &:hover,
    &.active {
      color: $theme;
      border-color: $theme;
    }
  }
  .mt20 {
    text-align: left;
    margin-left: calc(20% - 10px);
  }
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

.topic-msg {
  display: flex;
  padding: 8px 0;
  .msg-panel {
    flex: 1;
    overflow: hidden;
    text-align: left;
  }
  .topic-name {
    margin-top: 7px;
    text-align: left;
  }
  .topicTag {
    display: inline-block;
  }
  .date {
    margin-top: 7px;
    white-space: normal;
  }
}
.reply {
  margin-bottom: 8px;
  padding: 8px 10px;
  text-align: left;
  font-size: 12px;
  line-height: 18px;
  color: #333;
  background: #f7f7f7;
  span {
    color: $theme;
  }
}
.red {
  padding-right: 5px;
}
</style>
