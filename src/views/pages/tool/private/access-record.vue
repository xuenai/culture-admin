<template>
  <div class="container pd15">
    <div>
      <div class="wrap">
        <Form :label-width="80" inline class="form">
          <span
            ref="7day"
            class="time-item"
            :class="{active: currTabIndex === 0}"
            @click="()=>{
                currTabIndex = 0;
                changeTime([new Date().getTime(), new Date().getTime()])
            }"
          >今日</span>
          <span
            ref="7day"
            class="time-item"
            :class="{active: currTabIndex === 1}"
            @click="()=>{
                currTabIndex = 1;
                changeTime([new Date().getTime()-1* 24 * 60 * 60 * 1000, new Date().getTime()-1* 24 * 60 * 60 * 1000])
            }"
          >昨日</span>
          <span
            ref="7day"
            class="time-item"
            :class="{active: currTabIndex === 2}"
            @click="()=>{
                currTabIndex = 2;
                changeTime([new Date().getTime() - 6 * 24 * 60 * 60 * 1000, new Date().getTime()])
            }"
          >最近7天</span>
          <span
            class="time-item"
            :class="{active: currTabIndex === 3}"
            @click="()=>{
                currTabIndex = 3;
                changeTime([new Date().getTime() - 29 * 24 * 60 * 60 * 1000, new Date().getTime()])
            }"
          >最近30天</span>
          <FormItem class="item" label="自定义时间">
            <Date-picker
              type="daterange"
              placement="bottom-start"
              placeholder="选择日期"
              @on-change="getDate"
              :value="[params.startDate, params.endDate]"
            ></Date-picker>
          </FormItem>
          <FormItem class="item" label="关键字：">
            <Input placeholder="姓名/单位/手机号" v-model="params.keyword" @on-enter="handleSubmit" />
          </FormItem>
          <div class="submit">
            <Button type="primary" class @click="handleSubmit">搜索</Button>
            <Button class="ml10 outExcel" v-if="tableData.bodyList.length">
              <a @click="outExcel($event)">导出</a>
            </Button>
          </div>
        </Form>
      </div>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          class="table"
          @on-selection-change="setChecked"
        >
          <template slot-scope="{row}" slot="phone">
            <div>{{row.phone.replace(row.phone.substr(3,4),'****')}}</div>
          </template>
        </Table>
      </baseTable>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";
import { formatterDate } from "@util/comm";
import { visitList, exportUserVisitList } from "@service/tool";
@Component({
  components: {
    baseTable
  }
})
export default class peopleManagement extends Vue {
  checkedIds = ''
  footerList:Array<any> = [];
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //获取token
  get token() {
    return AppModule.token;
  }
  /*S 导出*/
  private outExcelApi: string =
    CONFIG.defaultUrl + "/user/betaUser/exportUserVisitList?";
  outExcel(e: any) {
    let _target = e.target as HTMLInputElement,
      _this = this;
    if (_this.params.startDate && _this.params.endDate) {
      _target.setAttribute(
        "href",
        _this.outExcelApi +
          "token=" +
          _this.token +
          "&startDate=" +
          _this.params.startDate +
          "&endDate=" +
          _this.params.endDate
      );
    }
  }
  /*E 导出*/
  //登录端判断
  private isSite: boolean = this.$store.state.app.userInfo.dataType === "SITE";
  //表格加载动画
  private loading: boolean = true;
  //表格数据
  private tableData: any = {
    headList: [],
    bodyList: []
  };
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  /*S 搜索 */
  // 当前tab索引
  private currTabIndex = 0;
  // 时间切换
  private changeTime(time: Array<number | string>) {
    this.params.startDate =
      typeof time[0] === "string"
        ? time[0]
        : formatterDate(time[0] as number).split(" ")[0];
    this.params.endDate =
      typeof time[1] === "string"
        ? time[1]
        : formatterDate(time[1] as number).split(" ")[0];
    // 其他函数调用
    this.getList();
  }
  // 选择时间段
  private params: any = {
    startDate: formatterDate(new Date().getTime()).split(" ")[0], //开始时间
    endDate: formatterDate(new Date().getTime()).split(" ")[0], //结束时间
    keyword: "" //关键字
  };
  getDate(date: any) {
    this.params.startDate = date[0];
    this.params.endDate = date[1];
    this.handleSubmit();
  }

  handleSubmit() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  /*E 搜索 */
  //表格数据
  getList(data: any = this.tableConfig.page) {
    let _this = this;
    if (_this.isSite) {
      //站点端
      _this.tableData.headList = [
        {
          title: "姓名",
          key: "name",
          align: "center"
        },
        {
          title: "联系电话",
          key: "phone",
          slot: "phone",
          align: "center"
        },
        {
          title: "访问时间",
          key: "visitTime",
          align: "center"
        }
      ];
    }
    this.params = Object.assign(this.params, data); //搜索条件
    visitList(this.params).then((res: any) => {
      if (res.code === 0) {
        _this.tableData.bodyList = res.datas as [];
        _this.loading = false;
        _this.checkedIds = "";
        _this.footerList = [];
        _this.tableConfig.page = res.page ? res.page : {};
      }
    });
  }
  // 复选框
  private setChecked(e: any) {
    let checkedIds: any = [];
    this.footerList = e;
    e.map((item: any) => {
      checkedIds.push(item.id as Number);
    });
    this.checkedIds = checkedIds.join(",");
  }
  mounted() {
    this.getList();
  }
}
</script>

<style scoped lang="scss">
.wrap {
  padding: 15px 15px 0 15px;
  background-color: $grayLight;
  .submit {
    display: inline-block;
    margin: 0 0 15px 10px;
  }
  .ivu-form-item {
    margin-bottom: 15px !important;
  }
}
.table {
  margin-top: 15px;
  .action-btn {
    cursor: pointer;
    white-space: nowrap;
    & + .action-btn {
      margin-left: 5px;
    }
  }
  .venues-msg {
    padding: 8px 0;
    .img {
      width: 100px;
      height: 60px;
    }
    .venues-name {
      margin-top: 7px;
      text-align: left;
    }
    .venues-tag {
      display: inline-block;
    }
    .address {
      margin-top: 7px;
      white-space: normal;
      color: $font06;
    }
  }
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
.import-panel {
  position: relative;
  .upload-excel {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
}
.outExcel {
  a {
    color: #515a6e;
  }
}
.invite-code {
  height: 50px;
}
.form {
  .time-item {
    padding: 10px 12px 10px 0;
    font-size: 12px;
    color: #148cf3;
    cursor: pointer;
    vertical-align: middle;
    &.active {
      color: #fc8675;
      font-weight: bold;
    }
  }
}
</style>
