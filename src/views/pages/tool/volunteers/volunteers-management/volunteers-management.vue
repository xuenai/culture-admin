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
            placeholder="志愿者名称/手机号/身份证号"
            class="w200"
            v-model="params.name"
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
        <FormItem
          class="item"
          label="服务类别"
          v-if="typeList && typeList.length"
        >
          <Select class="w150" v-model="params.serviceType" @on-change="getSearch">
            <Option value="">全部</Option>
            <Option
              :value="item.value"
              v-for="item in typeList"
              :key="item.value"
              >{{ item.name }}</Option
            >
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
        <FormItem class="item" label="提交时间">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择提交时间"
            @on-change="changeDate"
          ></Date-picker>
          <Button type="primary" class="ml20" @click="getSearch()">搜索</Button>
          <router-link
            to="/volunteers-edit"
            class="btn-primary ml10"
            v-if="$store.state.app.userInfo.dataType !== 'SITE'"
            >添加</router-link
          >
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
          @on-selection-change="setChecked"
        >
          <template slot-scope="{ row }" slot="title">
            <div class="topic-msg">
              <div class="msg-panel">
                <p class="topic-name">
                  <span class="theme-blue topicTag">
                    <span
                      class="red"
                      v-if="
                        row.recommendHomePage === 1 ||
                          row.recommendChannelHomePage === 1
                      "
                      >[推荐]</span
                    >
                    <router-link
                      tag="a"
                      :to="'/volunteers-management-desc/' + row.id + '/true'"
                      class="theme-blue"
                      >{{ row.name }}</router-link
                    >
                  </span>
                </p>
                <p class="date">
                  {{ row.serviceRegionName }}
                </p>
              </div>
            </div>
            <p class="reply" v-if="row.auditRemark && row.status === 79">
              <span>审核备注：</span>{{ row.auditRemark }}
            </p>
          </template>
          <template slot-scope="{ row }" slot="level">
            <span>{{ setStar(row.level) }}</span>
          </template>
          <template slot-scope="{ row }" slot="point">
            <span>{{ row.creditScore + '（' + row.creditLevelName + '）' }}</span>
          </template>
          <template slot-scope="{ row }" slot="sort">
            <span v-if="!sort">{{ row.sort }}</span>
            <InputNumber
              v-else
              @on-change="changeSort(row)"
              v-model="row.sort"
            />
          </template>
          <template slot-scope="{ row }" slot="volunteerTeam">
            <span
              v-for="item in row.volunteerTeam"
              v-if="row.volunteerTeam.length"
              >{{ item.teamName }},</span
            >
            <span v-if="!row.volunteerTeam.length">暂无</span>
          </template>
          <template slot-scope="{ row, index }" slot="status">
            <div v-if="row.status == 1">
              <span class="switchLabel">正常</span>
              <span class="switchBox" @click="changeStatus(row, '禁用')">
                <i-switch :value="row.status === 1" />
                <span class="cover"></span>
              </span>
            </div>
            <div v-else-if="row.status == 2">
              <span class="switchLabel">禁用</span>
              <span class="switchBox" @click="changeStatus(row, '启用')">
                <i-switch :value="row.status === 1" />
                <span class="cover"></span>
              </span>
            </div>
            <div v-else-if="row.status == 3">草稿</div>
            <div v-else-if="row.status == 4">待审核</div>
            <div v-else-if="row.status == 8">已撤回</div>
            <div v-else-if="row.status == 79">审核不通过</div>
          </template>
          <template slot-scope="{ row,index }" slot="action">
            <div>
              <router-link
                :to="'/volunteers-audit-desc/' + row.id"
                class="theme-blue"
                >{{
                  row.status === 4 ? "审核" : row.status !== 4 ? "重审" : "-"
                }}</router-link
              >
              <dropCode
                v-if="row.status === 1"
                :id="'qrcode' + row.id"
                :key="'qrcode' + row.id"
                :value="
                  $store.state.app.userInfo.h5Domain +
                    '/#/volunteer-desc/' +
                    row.id
                "
              >
                <span class="theme-blue action-btn">预览</span>
              </dropCode>
              <a
                class="theme-blue action-btn ml5"
                v-if="row.status === 3"
                @click="submitCol(row, index)"
                >提交</a
              >
              <a
                class="theme-blue action-btn ml5"
                 v-if="row.sourcePlatform !== 'CulturalTourismCloudApi'&&row.status===4"
              @click="setWithdraw(row)"
                >撤回</a
              >
              <router-link
                :to="{path:'/volunteers-edit',query:{id:row.id}}"
                v-if="row.sourcePlatform !== 'CulturalTourismCloudApi'&&row.status!==4"
                class="theme-blue action-btn ml5"
                >修改</router-link
              >
              <a
                href="javascript:;"
                class="theme-blue action-btn ml5"
                v-if="row.sourcePlatform !== 'CulturalTourismCloudApi'&&row.status!==4"
                @click="deleteRow(row, index)"
                >删除</a
              >
            </div>
          </template>
        </Table>
      </baseTable>
      <footerButtons
        type="CONTENT_TYPE_SCENERY"
        :selectionList="footerList"
        :orderRowData="orderRowData"
        @changeOrder="changeOrder"
        @getList="getList"
        class="operate"
      >
        <a
          class="ivu-btn ivu-btn-default ml10"
          @click="outExcel($event)"
          :disabled="sort"
          v-if="operates.includes('export')"
          >导出</a
        >
      </footerButtons>
    </div>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getVolunteerManList,
  getVolunteerManType,
  getVolunteerDictValue,
  volunteerDelete,
  volunteerSubmit,
  setVolunteerStatus,
  volunteerWithdraw
} from '@service/tool'
import baseTable from '@components/baseTable/baseTable.vue'
import footerButtons from './footer.vue'
import { AppModule } from '@store/modules/app'
import CONFIG from '@/util/config'
import VDistpicker from '@components/distPicker/distPicker.vue'
import dropCode from '@components/DropCode/DropCode.vue'
@Component({
  components: {
    baseTable,
    footerButtons
  }
})
// v-if="operates.includes('audit')"
export default class volAuditList extends Vue {
  get creditStatus() {
    return AppModule.siteInfo.creditStatus;
  }
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 获取审核流程信息
  private loading = true;
  private typeList = [];
  private sort: boolean = false; // 是否开启排序功能
  // 复选框ID
  private checkedBox: Array<Number> = [];
  private footerList: Array<Object> = [];
  private orderRowData: object = {};
  // 导出
  private outExcelApi: string =
    CONFIG.defaultUrl + "/res/volunteer/exportExcel?";
  //表格分页信息
  private params: any = {
    name: "",
    serviceType: "",
    level: "",
    sex: "",
    startDate: "",
    endDate: ""
  };
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData: any = {
    headList: [],
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
  // 排序
  /* S 排序 */
  private changeOrder(b: boolean) {
    this.sort = b;
  }
  // 修改排序行的数据
  private changeSort(row: any) {
    this.orderRowData = row;
  }
  // 搜索
  private getSearch() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  //   改变日期
  private changeDate(e: any) {
    this.params.startDate = e[0];
    this.params.endDate = e[1];
    this.getSearch()
  }
  // 复选框
  private setChecked(e: any) {
    this.checkedBox = [];
    this.footerList = e;
    e.map((item: any) => {
      this.checkedBox.push(item.id as Number);
    });
  }
   //撤回
  setWithdraw(item: any) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      content: `确认要撤回？`,
      okText: "确认撤回",
      cancelText: "取消",
      onOk: () => {
        volunteerWithdraw({
          id: item.id
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("操作成功");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  mounted() {
    this.getList();
    this.getVolunteerManType();
  }
  // 类型
  private getVolunteerManType() {
    getVolunteerManType({
      type: "VOLUNTEER_SERVICE_TYPE"
    }).then((data: any) => {
      this.typeList = data.datas as [];
    });
  }
  /**
   * 设置表头
   */
  setTableHeader () {
    let columns = [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "志愿信息",
        key: "title",
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
        title: "身份证号",
        key: "idCard",
        align: "center"
      },
      {
        title: "星级",
        key: "level",
        align: "center",
        slot: "level"
      },
      {
        title: "服务类别",
        key: "serviceType",
        align: "center"
      },
      {
        title: "加入时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "诚信分值",
        slot: "point",
        align: "center"
      },
      {
        title: "排序",
        key: "sort",
        align: "center",
        slot: "sort"
      },
      {
        title: "操作",
        key: "action",
        width: 100,
        align: "center",
        slot: "action"
      }
    ];
    if (this.creditStatus === 2) {
      columns = columns.filter((c:any) => c.title !== '诚信分值' )
    }
    this.tableData.headList = columns;
  }
  // 列表
  private getList(page: any = this.tableConfig.page) {
    if (!this.tableData.headList.length) {
      this.setTableHeader();
    }
    this.loading = true;
    Object.assign(this.params, page);
    getVolunteerManList(this.params).then(data => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = data.datas;
      this.loading = false;
      this.checkedBox = [];
    });
  }
  // 导出
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
