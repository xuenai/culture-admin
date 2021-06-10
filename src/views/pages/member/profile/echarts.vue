<!--
 * @Author: 任智勇
 * @since: 2019-05-22 09:46:59
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-29 11:05:42
 -->
<template>
  <div style="width:100%;">
    <div class="title">
      <h3 class="cloud-icon">新增会员</h3>
      <div class="condition">
        <span @click="getNearSevenDay" :class="{active: selectMod.indexOf('seven') > -1}">7天</span>
        <span @click="getCurrentMonth" :class="{active: selectMod.indexOf('current') > -1}">本月</span>
        <span @click="getPrveMonth" :class="{active: selectMod.indexOf('prve') > -1}">上月</span>
        <DatePicker
          type="daterange"
          :value="value"
          :options="options"
          @on-change="selectDate"
          :placeholder="dateTips"
          placement="bottom-end"
          style="width: 200px"
        ></DatePicker>
        <Button type="primary" class="ml20" @click="search">搜索</Button>
      </div>
    </div>
    <mych :configure="data.echartConfig" class="myChart"></mych>
    <div class="table">
      <div class="clearfix">
        <h3 class="cloud-icon fl">数据详情</h3>

        <a class="cloud-icon right fr" @click="outExcel($event)">&#xe817;</a>
        <!-- <a class="cloud-icon right fr" @click="outExcel($event)" v-if="operates.includes('export')">&#xe817;</a> -->
      </div>
      <baseTable :configure="tableConfig" @getList="getListInfo">
        <Table border :columns="data.header" :loading="loading" :data="data.list" ref="table"></Table>
      </baseTable>
    </div>
    <div class="table" v-if="siteInfo.creditStatus == 1">
      <div class="clearfix">
        <h3 class="cloud-icon ">失约会员统计</h3>
        <baseTable :configure="tableConfig2" @getList="getLosePromiseUserList">
          <Table border :columns="tableData.headList" :loading="loading2" :data="tableData.bodyList" ref="table">
              <template slot="head" slot-scope="{row}">
                  <div class="info-list title" :class="{'daq-no-photo': !row.headImg}">
                       <img v-if="row.headImg" :src="row.headImg" :alt="row.nickName">
                       <img v-else src="@assets/image/site-default.png" alt="">
                  </div>
              </template>
              <template slot="probability" slot-scope="{row}">
                  <span v-if="row.losePromiseCount>0">
                      {{Math.floor((row.losePromiseCount/(row.losePromiseCount+row.keepPromiseCount))*100)}}%
                  </span>
                  <span v-else>
                      {{row.losePromiseCount}}
                  </span>
              </template>
          </Table>
        </baseTable>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import mych from "@components/groupChart/groupChart.vue";
import baseTable from "@components/baseTable/baseTable.vue";
import {getNewNumsList , getNumsList,getLosePromiseUserList} from '@service/member';
import { AppModule } from "@store/modules/app";
import CONFIG from '@/util/config';

@Component({
  components: {
    mych,
    baseTable
  }
})
export default class VipMember extends Vue {
  // 权限列表
  get operates() {
      return AppModule.operates;
  }
  get siteInfo() {
    return AppModule.siteInfo;
  }
  //获取token
  get token() {
      return AppModule.token;
  }
  private selectMod: string = "";
  private dateTips: string = "请选择日期";
  private loading: Boolean = false;//数据是否加载中
  private loading2: Boolean = false;//数据是否加载中
  private data: any = {
    header: [
      {
        title: "日期",
        key: "recordDate"
      },
      {
        title: "新增会员",
        key: "newNums"
      },
      {
        title: "日活跃会员",
        key: "activeNums"
      },
      {
        title: "累计会员",
        key: "totelNums"
      }
    ],
    list: [],
    echartConfig: {
      data: [], // 动态数据
      seriesName: ["新增会员数"], // 系列名称
      seriesType: ["line", "line"], // 系列类型
      isLenged: true, // 是否开启图例
      xRotate:15,
      interval: 2
    }
  };

  /* S 获取数据详情列表数据 */
  // 分页
  private tableConfig: any = {
    page: {},
    pagePosition: "right"
  };
    // 分页
    private tableConfig2: any = {
        page: {},
        pagePosition: "right"
    };
  private params: any = {};
  private getListInfo(page: any = this.tableConfig.page) {
    Object.assign(this.params , page)
    getNumsList(this.params).then((data: any) => {
      let datas: any = [];
      if (data.code === 0){
        this.loading = false;
        this.data.list = data.datas;
        this.tableConfig.page = data.page;
      }
    });
  }
  /* E 获取数据详情列表数据 */

  /* S 获取失约统计列表数据 */
    private tableData: any = {
        headList: [
            {
                title: "序号",
                type: "index",
                width: "60",
                align: "center"
            },
            {
                title: "头像",
                key: "head",
                slot:"head"
            },
            {
                title: "手机号",
                key: "phone",
                width:115,
            },
            {
                title: "昵称",
                key: "nickName"
            },
            {
                title: "性别",
                key: "sex"
            },
            {
                title: "所在地区",
                key: "location"
            },
            {
                title: "会员等级",
                key: "pointLevel"
            },
            {
                title: "积分",
                key: "point"
            },
            {
                title: "诚信分值",
                key: "creditScore"
            },
            {
                title: "失约数",
                key: "losePromiseCount"
            },
            {
                title: "失约率",
                key: "probability",
                slot:"probability"
            },
            {
                title: "最近失约时间",
                key: "losePromiseTime",
                width: 150
            },
        ],
        bodyList: [],
    };
    private getLosePromiseUserList(page: any = this.tableConfig2.page){
        getLosePromiseUserList(page).then((res:any)=>{
            if(res.code===0){
                this.tableData.bodyList=res.datas as [];
                this.tableConfig2.page = res.page;
            }
        }).finally(()=>{
            this.loading2=false;
        })
    }
  /* E 获取失约统计列表数据 */

  /* S 搜索 */
  private search(){
    this.getNewNumsLists();//获取新增会员数量
  }
  /* E 搜索 */

  // 导出数据
  private outExcelApi: string = CONFIG.defaultUrl + '/user/consumUserRecord/exportExcel?';
  private outExcel(e:any){
    let _target = e.target as HTMLInputElement , _this = this;
    _target.setAttribute("href" , this.outExcelApi + "token=" + this.token);
  }

  // 日期框默认展示 最近一个月
  private value: any = [
    new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  ];

  private options = {
    disabledDate(date: any) {
      const disabledDay = date.getDate();
      // 限制可选的开始日期及结束日期
      let b =
        date.getTime() < new Date("2018-12-31").getTime() ||
        (date && date.valueOf() > Date.now());
      return b;
    }
  };
  //公用参数
  private dataFun(dataObj: string) {
    let date = new Date();
    switch(dataObj){
      case "sevenday"://最近7天
      this.newNums.endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + ('0' + date.getDate()).slice(-2);
      date.setDate(date.getDate()-6);
      this.newNums.startDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      break;
      case "currentmuonth"://本月
      this.newNums.startDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01';
      this.newNums.endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + ('0' + date.getDate()).slice(-2);
      break;
      case "prvemonth"://上月
      this.newNums.startDate = date.getFullYear() + '-' + date.getMonth() + '-01';
      this.newNums.endDate = date.getFullYear() + '-' + date.getMonth() + '-31';
      break;
      case "prvTocurrent"://最近30天
      // var tt = new Date().getTime() - 30*24*60*60*1000
      // new Date(tt).toLocaleString()
      this.newNums.endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      date.setDate(date.getDate()-30);
      this.newNums.startDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      // this.newNums.startDate = date.getFullYear() + '-' + (date.getMonth() ) + '-15';
      // this.newNums.endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-15';
      break;
    }
  }

  // 7天
  private getNearSevenDay() {
    this.selectMod = "sevenday";
    let preSeven = new Date().getTime() - 6 * 24 * 60 * 60 * 1000;
    this.value = [preSeven, new Date()];
    this.dataFun("sevenday");
    this.getNewNumsLists(); // 获取新增会员数量
  }
  // 本月
  private getCurrentMonth() {
    this.selectMod = "currentmuonth";
    let preSeven: any = new Date(new Date().setDate(1));
    this.value = [preSeven, new Date()];
    this.dataFun("currentmuonth");
    this.getNewNumsLists(); // 获取新增会员数量
  }
  // 上月
  private getPrveMonth() {
    this.selectMod = "prvemonth";
    let prevMonthLastday: any = new Date(new Date().setDate(0)); // 上个月的最后一天
    // 上个月的第一天
    let prevMonthFirstday: any = new Date(
      new Date(new Date().setDate(0)).setDate(1)
    );
    this.value = [prevMonthFirstday, prevMonthLastday];
    this.dataFun("prvemonth");
    this.getNewNumsLists(); // 获取新增会员数量
  }

  // 日期选择
  private selectDate(date: any) {
    this.newNums.endDate = date[1];
    this.newNums.startDate = date[0];
    this.selectMod = "";
    let start = new Date(date[0]).getTime();
    let end = new Date(date[1]).getTime();
    // 自定义选择的时间不能超过31天
    if (end - start > 31 * 24 * 3600 * 1000) {
      this.value = "";
      this.dateTips = "自选日期不能超过31天";
      this.$Notice.error({
        title: "自选日期不能超过31天"
      });
    }
  }

  /* S 获取新增会员 */
  private newNums: any = {
    endDate: '',// 结束时间
    startDate: '',// 开始时间
  }
  private getNewNumsLists(){
    getNewNumsList(this.newNums).then((res: any)=>{
      if (res.code === 0){
        this.data.echartConfig.data = res.datas;
      }
    })
  }
  /* E 获取新增会员 */

  mounted() {
    this.dataFun("prvTocurrent");
    this.getListInfo();// 获取数据详情列表
    this.getNewNumsLists();// 获取新增会员数量
      this.getLosePromiseUserList();
  }
}
</script>

<style lang='scss' scoped>
h3.cloud-icon::before {
  content: "\e697";
  font-size: 20px;
  color: $theme;
  margin-right: 10px;
}
.title {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  h3{
    color: $font01;
    font-weight: bold;
    font-size: 16px;
  }
  .condition {
    min-width: 320px;
    display: flex;
    justify-content: space-between;
    > span {
      margin-right: 10px;
      cursor: pointer;
      &:hover,
      &.active {
        color: $theme-hover;
      }
    }
  }
}
.myChart {
  width: 95%;
  height: 300px;
  margin: 10px auto;
}
.table {
  border-top: 1px solid #dedede;
  padding-top: 30px;
  margin-bottom: 30px;
  h3 {
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    font-weight: bold;
    color: $font01;
  }
  .right {
    cursor: pointer;
    margin-right: 10px;
  }
}
.info-list {
    // margin: 15px 0;
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 50%;
    margin: 0 auto;
    img {
        height: 100%;
        min-width: 100%;
        border-radius: 50%;
        border: none;
    }
}
</style>
