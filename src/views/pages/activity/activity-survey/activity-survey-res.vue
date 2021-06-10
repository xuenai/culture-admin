<template>
  <div>
    <div class="activity-survey">
      <Row type="flex" class="list">
        <Col span="4" class="ind">
        <span>{{data.activityTotalCount}}</span>
        <p>共计活动</p>
        </Col>
        <Col span="4" class="box">
        <span>{{data.waitActivityCount}}</span>
        <p>待审核活动</p>
        </Col>
        <Col span="4" class="box">
        <span>{{data.notStartCount}}</span>
        <p>未开始活动</p>
        </Col>
        <Col span="4" class="box">
        <span>{{data.startCount}}</span>
        <p>进行中活动</p>
        </Col>
        <Col span="4" class="box">
        <span>{{data.endCount}}</span>
        <p>已结束活动</p>
        </Col>
      </Row>
      <Row type="flex" class="list">
        <Col span="4" class="ind">
        <span>{{data.totalActivityResultCount}}</span>
        <p>共计成果</p>
        </Col>
        <Col span="4" class="box">
        <span>{{data.waitActivityResultCount}}</span>
        <router-link style="color: #23a1ee;cursor: pointer" tag="p"
          :to="{path: '/audit-activity-result',query: {tabIndex: 1}}">待审核成果</router-link>
        </Col>
        <!-- <Col span="4" class="box">
        <span>{{data.alreadyHandlerAuditCount}}</span>
        <p>已审核成果</p>
        </Col> -->
      </Row>
      <div class="clearfix mt15 content">
        <div class="left fl">
          <p class="title-ind">
            <span>活动分类统计情况</span>
          </p>
          <LineEchart :configure="barData" class="echart-box"></LineEchart>
        </div>
        <div class="right fr">
          <p class="title-ind">
            <span>活动分类占比情况</span>
          </p>
          <Echarts class="echart-box" :configure="pieData.type"></Echarts>
        </div>
      </div>
      <div class="chart-wrap" v-if="isSite">
        <div class="tips-title ">
          活动数据填报排行榜
        </div>
        <div class="top-wrap">
          <ul class="tab clearfix">
            <li class="fl" v-for="(tab, i) in tabList" :key="i">
              <span class="item" :class="{active: currTabIndex === i}" @click="()=>{ currTabIndex = i; changeTime(tab.time) }">{{ tab.name }}</span>
            </li>
            <li class="fl">
              <span class="item">自定义时间</span>
              <DatePicker type="daterange" placement="bottom-end" placeholder="选择时间范围"
                :value="[topParams.startTime, topParams.endTime]" @on-change="time => {
                                if (!time[0]) return;
                                currTabIndex = 4;
                                changeTime(time);
                            }" style="position:relative;top: -2px;"></DatePicker>
            </li>
          </ul>

          <Select style="width: 120px;margin-right:15px;" v-model="topParams.type" @on-change="() => { if (topParams.type == 'company') { $refs.distpicker.refreshData(regionPath); topParams.region = siteRegion }; getTopList() }">
            <Option value="region">按地区查询</Option>
            <Option value="company">按直属单位查询</Option>
          </Select>
          <div class="top-select" :class="{shadow: topParams.type == 'company'}">
            <distPicker ref="distpicker" :default="regionPath" @onChange="data => { topParams.region = data.region; getTopList() }" :disabledByLevel="true"></distPicker>
          </div>
          <Button type="primary" style="margin-left: 20px;" @click="getTopList()">搜索</Button>
          <Button style="margin-left: 20px;" @click="exportExcel()">导出</Button>
        </div>
        <BaseTable :configure="tableConfig" @getList="getTopList">
          <Table border :columns="columns" :data="topList" size="small">
            <template slot-scope="{ row }" slot="sort">
              {{ (topParams.currPage - 1) * topParams.pageSize + row._index + 1 }}
            </template>
            <template slot-scope="{ row }" slot="activityJoinRate">
              {{ (row.activityJoinRate * 100).toFixed(1) }}%
            </template>
            <template slot-scope="{ row }" slot="resultReportRate">
              {{ (row.resultReportRate * 100).toFixed(1) }}%
            </template>
          </Table>
        </BaseTable>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import {
  getCountStatistics,
  getClassifyCountProportion,
  getActivityRanking
} from "@service/activity";
import Echarts from "@components/pieChart/pieChart.vue";
import LineEchart from "@components/groupChart/groupChart.vue";
import distPicker from "@components/distPicker/distPicker.vue";
import BaseTable from "@components/baseTable/baseTable.vue";
import { exportExcel, getRegionLevel, formatterDate } from "@util/comm"
import CONFIG from "@/util/config";
import { AppModule } from "@store/modules/app";

@Component({
  components: {
    Echarts,
    LineEchart,
    distPicker,
    BaseTable
  }
})
export default class ComponentName extends Vue {
  private regionPath: string = AppModule.regionPath
  private siteRegion: string = AppModule.siteInfo.region
  private isSite: boolean = this.$store.state.app.userInfo.dataType === 'SITE';
  private columns: any = [
        {
            "title": "序号",
            "slot": "sort",
            "align": "center",
            "width": 60
        },
        {
            "title": "名称",
            "key": "name",
            "width": 250,
        },
        {
            "title": "活动上报数量",
            "key": "activityNum",
            "align": "center",
            "sortable": true
        },
        {
            "title": "实际参与人数",
            "key": "joinPeople",
            "align": "center",
            "sortable": true
        },
        {
            "title": "活动参与率",
            "key": "activityJoinRate",
            "slot": "activityJoinRate",
            "align": "center",
            "sortable": true
        },
        {
            "title": "活动成果上报数",
            "key": "resultReportCount",
            "align": "center",
            "sortable": true
        },
        {
            "title": "活动成果上报率",
            "key": "resultReportRate",
            "slot": "resultReportRate",
            "align": "center",
            "sortable": true
        }
    ]
  // 排行数据
  private topList: any = []
  // 当前tab索引
  private currTabIndex = 2;
  private tabList: any = [
    {
      time: [new Date(new Date().toLocaleDateString()).getTime(), new Date().getTime()],
      name: '今天'
    },
    {
      time: [new Date(new Date().toLocaleDateString()).getTime() - 1 * 24 * 60 * 60 * 1000, new Date(new Date().toLocaleDateString()).getTime() - 1 * 24 * 60 * 60 * 1000],
      name: '昨天'
    },
    {
      time: [new Date().getTime() - 6 * 24 * 60 * 60 * 1000, new Date().getTime()],
      name: '最近7天'
    },
    {
      time: [new Date().getTime() - 29 * 24 * 60 * 60 * 1000, new Date().getTime()],
      name: '最近30天'
    }
  ]
  private pieData: any = {
    type: {
      data: [
        // {
        //   name: "预订活动",
        //   value: "10"
        // },
        // {
        //   name: "报名活动",
        //   value: "20"
        // },
        // {
        //   name: "报名活动",
        //   value: "20"
        // },
        // {
        //   name: "普通活动",
        //   value: "10"
        // }
      ],
      seriesName: "活动分类"
    }
  };
  private barData: any = {
    //线状图配置2
    data: [
      // {ydata: "8989.99", series: [12, 12 + 20, 12 + 30, 12 + 5]},
    ], //动态数据
    title: "",
    seriesName: ["活动统计"], //系列名称
    seriesType: ["bar", "line", "line", "line", "line"], //系列类型
    lengedPosition: ["bottom", "", "", "right"], // 上,右,下,左
    yCompany: ["单位：个"] // 如果不设置单位默认为个
  };
  private lineData: any = {
    data: [], //动态数据
    seriesName: ["活动预订数"], //系列名称
    seriesType: ["line", "line"], //系列类型
    lengedPosition: ["bottom", "", "", "center"], // 上,右,下,左
    yCompany: ["单位：条"], // 如果不设置单位默认为个
    xRotate: 30,
    interval: 2
  };
  // 请求参数
  private topParams = <any>{
    countForm: '',
    region: '',
    startTime: '',
    endTime: '',
    currPage: 1,
    pageSize: 10,
    type: 'region'
  }
  private data: any = {};
  mounted() {
    this.topParams.region = AppModule.siteInfo.region
    this.changeTime(this.tabList[this.currTabIndex].time);

    this.getCountStatistics();
    this.getClassifyCountProportion();
    this.getClassifyCountProportionPie();
  }
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  // 获取活动数据填报排行榜
  private getTopList(page?: any):void {
    if (this.topParams.region) {
      // 姑且考虑省的时候值为1，后台没定这个值
      let level = getRegionLevel(this.topParams.region)
      this.topParams.countForm = [3,2,1][level]
    }
    if (page) {
      Object.assign(this.topParams, page)
    } else {
      this.topParams.currPage = 1
    }
    let params = {...this.topParams}
    if (params.type === 'company') delete params.region
    getActivityRanking(params).then((res:any) => {
      if (res.code === 0) {
        this.tableConfig.page = res.page
        this.topList = res.datas
      }
    })
  }
  // 导出数据
  private exportExcel() {
    let { startTime, endTime, region, countForm, type } = this.topParams
    exportExcel(
      `${CONFIG.defaultUrl}/res/activity/exportActivityDataRanking?token=${this.$cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`)}&startTime=${startTime}&endTime=${endTime}&region=${region}&countForm=${countForm}&type=${type}`
    )
  }
  // 时间切换
  private changeTime (time: Array<number | string>) {
      this.topParams.startTime = typeof time[0] === 'string' ? time[0] : formatterDate(time[0] as number).split(' ')[0]
      this.topParams.endTime = typeof time[1] === 'string' ? time[1] : formatterDate(time[1] as number).split(' ')[0]
      this.getTopList()
  }
  // 数量统计
  private getCountStatistics() {
    getCountStatistics({resultFlag: 1}).then((res: any) => {
      if (res.code === 0) {
        this.data = res.data;
      }
    });
  }
  // 活动分类 - 柱图
  private getClassifyCountProportion() {
    getClassifyCountProportion({activityType: 'ACTIVITY_TYPE_SERVICE'}).then((res: any) => {
      if (res.code === 0) {
        this.barData.data = res.datas;
      }
    });
  }
  // 活动分类 - 饼图
  private getClassifyCountProportionPie() {
    getClassifyCountProportion({ countForm: 1,activityType: 'ACTIVITY_TYPE_SERVICE' }).then((res: any) => {
      if (res.code === 0) {
        this.pieData.type.data = res.datas.map((item: any) => ({
          name: item.name,
          value: item.num
        }));
      }
    });
  }
}
</script>

<style lang='scss' scoped>
.top-select {
  display:inline-block;
  position:relative;
  &.shadow::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: not-allowed;
  }
}
.top-wrap {
  display: flex;
  margin-bottom: 20px;
  .tab {
      .fl {
          margin-right: 15px;
          line-height: 32px;
          &:last-child {
              .item {
                  margin-right: 5px;
                  color: #263b4d;
                  cursor: default;
              }
          }
          .item {
              font-size: 16px;
              color: #148cf3;
              cursor: pointer;
              &.active {
                  color: #FC8675;
                  font-weight: bold;
              }
          }
      }
  }
}
.activity-survey {
  width: 100%;
  background-color: $grayDark;
  .list {
    height: 150px;
    background: #fff;
    text-align: center;
    span {
      font-size: 26px;
      display: block;
      margin-top: 35px;
    }
    p {
      font-size: 16px;
      color: #263b4d;
    }
    .ind {
      position: relative;
      :after {
        position: absolute;
        top: 50%;
        right: 0;
        width: 1px;
        height: 80px;
        margin-top: -45px;
        content: "";
        border-right: 1px solid #dee3ed;
      }
      span {
        color: red;
      }
    }
    .box {
      span {
        color: #23a1ee;
      }
    }
  }
  .content {
    .title-ind {
      position: relative;
      padding: 15px 15px 15px 10px;
      color: #263b4c;
      font-size: 16px;
      font-weight: bold;
      .icon-line {
        position: absolute;
        top: 3px;
        left: 0;
        width: 3px;
        height: 16px;
        content: "";
        display: block;
        background: #23a1ee;
      }
    }
    .left {
      position: relative;
      width: 50%;
      padding: 20px;
      background: #fff;
    }
    .right {
      position: relative;
      width: 50%;
      padding: 20px;
      background: #fff;
    }
  }
}
.echart-box {
  height: 300px;
}
.chart-wrap {
  height: 100%;
  padding: 20px;
  margin-top: 15px;
  background-color: $bg01;
  .tips-title {
    position: relative;
    padding: 15px 15px 15px 30px;
    font-weight: 600;
    font-size: 16px;
    color: $font01;
    &:after {
      position: absolute;
      left: 20px;
      top: 18px;
      content: "";
      width: 3px;
      height: 16px;
      background-color: $theme;
      border-radius: 1.5px;
    }
    .tip {
      font-size: 12px;
      color: $lightGray;
    }
  }
  .chart {
    height: calc(100% - 60px);
  }
  .chart-div {
    height: 100%;
    width: 100%;
  }
}
</style>
