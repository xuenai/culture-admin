<!--
 * @Author: 任智勇
 * @since: 2019-05-21 14:02:13
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-27 16:47:30
 -->
<template>
  <div class="profile-box">
    <Header></Header>
    <Count class="count" :data="data.pendingAuditCount"></Count>
    <Space :data="data.spaceData" class="space"></Space>
    <Echarts
      v-if="!isSite"
      class="companyEchart"
      :titleData="data.titleData2"
      :configure="data.echartConfig.content"
    ></Echarts>
    <div class="echarts-box">
      <Echarts v-if="isSite" class="echart" :titleData="data.titleData1" :configure="data.echartConfig.member"></Echarts>
      <Echarts v-if="isSite" class="echart" :titleData="data.titleData2" :configure="data.echartConfig.content"></Echarts>
      <Echarts class="echart" :titleData="data.titleData3" :configure="data.echartConfig.activity"></Echarts>
      <Echarts class="echart" :titleData="data.titleData4" :configure="data.echartConfig.topic"></Echarts>
      <Echarts v-if="isSite" class="echart" :titleData="data.titleData5" :configure="data.echartConfig.volunteerView"></Echarts>
      <Echarts v-if="isSite" class="echart" :titleData="data.titleData6" :configure="data.echartConfig.volunteerTeamView"></Echarts>
      <Echarts v-if="isSite" class="echart" :titleData="data.titleData8" :configure="data.echartConfig.associationSummaryView"></Echarts>
      <Echarts v-if="isSite" class="echart" :titleData="data.titleData10" :configure="data.echartConfig.HeritageSummaryView"></Echarts>
    </div>
    <Echarts v-if="!isSite" class="companyEchart" :titleData="data.titleData7" :configure="data.echartConfig.companyVolunteerView"></Echarts>
    <Echarts v-if="!isSite" class="companyEchart" :titleData="data.titleData9" :configure="data.echartConfig.associationMonthView"></Echarts>
       <Echarts v-if="!isSite" class="companyEchart" :titleData="data.titleData11" :configure="data.echartConfig.HeritageMonthView"></Echarts>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './header.vue'
import Count from './count.vue'
import Space from '@components/spaceCount/space.vue'
import Echarts from './echarts.vue'
import { getPublicSurveyCount, getMemberInfos } from '@service/common'
import { getPieChart } from '@service/place'
import {
  getCountStatistics,
  getBrokenLineByLatelySeventh
} from '@service/activity'
import {
  getLatelyOneMonthVolunteer,
  getVolunteerSurveyCount,
  getCountLatelyVolunteer,
  getAssociationSummary,
  getAssociationMonth,
  getAssociationNum,
  getCountLatelyVolunteerTeam,
  getHeritageSummary,
  getHeritageMonth,
  getHeritageNum
} from '@service/tool'
import { getPlatformUserCount } from '@service/app'

@Component({
  components: {
    Header,
    Count,
    Space,
    Echarts
  }
})
export default class PublicProfile extends Vue {
  private isSite = this.$store.state.app.userInfo.dataType === 'SITE'
  private data = <any>{
    countLatelySevenDayContent: [], // 企业端最近7天内容统计
    pendingAuditCount: {},
    spaceData: {
      title: '场所概要',
      list: [
        { name: '共计场所', value: 256 },
        { name: '文化场馆', value: 43 },
        { name: '景区', value: 59 },
        { name: '酒店', value: 121 },
        { name: '餐饮', value: 23 },
        { name: '公共场所', value: 23 }
      ]
    },
    echartConfig: {
      member: {
        data: [], //动态数据
        title: '最近7天访人数/浏览量分析',
        seriesName: ['浏览量', '访问人数'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: true,
        yCompany: ['单位：条'] // 如果不设置单位默认为个
      },
      content: {
        data: [], //动态数据
        title: '最近7天新增内容',
        seriesName: ['自发布', '企业上报'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: true,
        yCompany: ['单位：条'] // 如果不设置单位默认为个
      },
      activity: {
        data: [], //动态数据
        title: '最近7天新增活动',
        seriesName: ['自发布', '企业上报'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: true,
        yCompany: ['单位：条'] // 如果不设置单位默认为个
      },
      topic: {
        data: [], //动态数据
        title: '最近7天新增话题',
        seriesName: ['自发布', '企业上报'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: true,
        yCompany: ['单位：条'] // 如果不设置单位默认为个
      },
      volunteerView: {
        data: [], //动态数据
        title: '最近7天新增志愿者',
        seriesName: ['数量'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: false,
        yCompany: ['单位：条'] // 如果不设置单位默认为个
      },
      volunteerTeamView: {
        data: [], //动态数据
        title: '最近7天新增志愿团队',
        seriesName: ['自发布', '企业上报'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: true,
        yCompany: ['单位：条'] // 如果不设置单位默认为个
      },
      companyVolunteerView: {
        data: [], //动态数据
        title: '最近1个月志愿团队与团队人数统计',
        seriesName: ['志愿者', '志愿团队'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: true,
        yCompany: ['单位：个'] // 如果不设置单位默认为个
      },
      associationMonthView: {
        data: [], //动态数据
        title: '最近1个月社团统计',
        seriesName: ['社团'], //系列名称
        seriesType: ['line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: false,
        yCompany: ['单位：个'] // 如果不设置单位默认为个
      },
      associationSummaryView: {
        data: [], //动态数据
        title: '最近7天新增社团',
        seriesName: ['自发布', '企业上报'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: true,
        yCompany: ['单位：个'] // 如果不设置单位默认为个
      },
      HeritageSummaryView: {
        data: [], //动态数据
        title: '最近7天新增非遗',
        seriesName: ['自发布', '企业上报'], //系列名称
        seriesType: ['line', 'line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: true,
        yCompany: ['单位：个'] // 如果不设置单位默认为个
      },
      HeritageMonthView: {
        data: [], //动态数据
        title: '最近1个月非遗统计',
        seriesName: ['非遗'], //系列名称
        seriesType: ['line'], //系列类型
        lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
        isLenged: false,
        yCompany: ['单位：个'] // 如果不设置单位默认为个
      }
    },
    titleData1: {
      title: '访问/会员',
      list: [
        { name: '共计会员', value: 0 },
        { name: '今日浏览量', value: 0 },
        { name: '今日访问人数', value: 0 },
        { name: '今日新增会员', value: 0 },
        { name: '失约会员', value: 0 },
        { name: '失信会员', value: 0 }
      ]
    },
    titleData2: {
      title: '内容概要',
      list: [
        { name: '共计内容', value: 0 },
        { name: '自发布', value: 0 },
        { name: '企业上报', value: 0 }
      ]
    },
    titleData3: {
      title: '活动概要',
      list: [
        { name: '共计活动', value: 0 },
        { name: '未开始活动', value: 0 },
        { name: '进行中活动', value: 0 },
        { name: '已结束活动', value: 0 }
      ]
    },
    titleData4: {
      title: '话题概要',
      list: [
        { name: '共计话题', value: 0 },
        { name: '共计标签', value: 0 }
      ]
    },
    titleData5: {
      title: '志愿者概要',
      list: [
        { name: '共计志愿者', value: 0 },
        { name: '加入团队数', value: 0 },
        { name: '未加入团队数', value: 0 }
      ]
    },
    titleData6: {
      title: '志愿团队概要',
      list: [
        { name: '共计志愿团队', value: 0 },
        { name: '自添加', value: 0 },
        { name: '企业上报', value: 0 }
      ]
    },
    titleData7: {
      title: '志愿者概要',
      list: [
        { name: '共计志愿团队', value: 0 },
        { name: '共计志愿者', value: 0 }
      ]
    },
    titleData8: {
      title: '社团概要',
      list: [
        { name: '共计社团', value: 0 },
        { name: '自添加', value: 0 },
        { name: '企业上报', value: 0 }
      ]
    },
    titleData9: {
      title: "社团概要",
      list: [{ name: "共计社团", value: 0 }, { name: "共计粉丝", value: 0 }]
    },
    titleData10: {
      title: "非遗概要",
      list: [{ name: "共计非遗", value: 0 }, { name: "自添加", value: 0 }, { name: "企业上报", value: 0 }]
    },
    titleData11: {
      title: "非遗概要",
      list: [{ name: "共计非遗", value: 0 }, { name: "共计非遗传承人", value: 0 }]
    }
  };

  mounted() {
    this.getPublicSurveyCount()
    this.getCountStatistics()
    this.getBrokenLineByLatelySeventh()
    this.getPieChart()
    if (this.isSite) {
      this.getMemberInfos()
      this.getCountLatelyVolunteer()
      this.getCountLatelyVolunteerTeam()
      this.getAssociationSummary()
      this.getPlatformUserCount()
      this.getHeritageSummary()
    } else {
      this.getLatelyOneMonthVolunteer()
      this.getAssociationMonth()
      this.getAssociationNum()
      this.getHeritageMonth()
      this.getHeritageNum()
    }
  }

  // 平台诚信用户概况统计
  private getPlatformUserCount() {
    getPlatformUserCount({
      platformCode: this.$store.state.app.userInfo.siteCode,
      platformChannel: 'cultural'
    }).then((res: any) => {
      if (res.code === 0) {
        this.data.titleData1.list[4].value = res.data.losePromiseCount
        this.data.titleData1.list[5].value = res.data.loseCreditCount
      }
    })
  }
  // 获取会员数据
  private getMemberInfos() {
    getMemberInfos().then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.member.data = res.data.list
        this.data.titleData1.list[0].value = res.data.totalUser
        this.data.titleData1.list[1].value = res.data.todayPv
        this.data.titleData1.list[2].value = res.data.todayUv
        this.data.titleData1.list[3].value = res.data.newUser
      }
    })
  }
  // 获取内容、话题数据
  private getPublicSurveyCount() {
    getPublicSurveyCount().then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.content.data =
          res.data.countLatelySevenDayContent
        this.data.echartConfig.topic.data = res.data.countLatelySevenDayTopic
        this.data.pendingAuditCount = res.data.pendingAuditCount

        // 内容图表上面统计
        this.data.titleData2.list[0].value = res.data.countContent.total
        this.data.titleData2.list[1].value =
          res.data.countContent.selfPublishNum
        this.data.titleData2.list[2].value =
          res.data.countContent.placeReportNum
        // 企业端内容图表统计
        if (!this.isSite) {
          this.data.titleData2.list = [
            { name: '共计内容', value: res.data.countContent.total },
            { name: '今日新增', value: res.data.countContent.todayReleased }
          ]
        }

        // 话题图表上面统计
        this.data.titleData4.list[0].value = res.data.countTopic.total
        this.data.titleData4.list[1].value = res.data.countTopic.storyTagTotal
        // 企业端-话题图表上面统计
        if (!this.isSite) {
          this.data.titleData4.list = [
            { name: '共计话题', value: res.data.countTopic.total },
            { name: '未开始话题', value: res.data.countTopic.notStartTotal },
            { name: '进行中话题', value: res.data.countTopic.startTotal }
          ]
        }
      }
    })
  }
  // 获取场所数据
  private getPieChart() {
    getPieChart().then((res: any) => {
      if (res.code === 0) {
        this.data.spaceData.list[0].value = res.data.venueNum.totalNum
        this.data.spaceData.list[1].value = res.data.venueNum.venueNum
        this.data.spaceData.list[2].value = res.data.venueNum.scenicNum
        this.data.spaceData.list[3].value = res.data.venueNum.hotelNum
        this.data.spaceData.list[4].value = res.data.venueNum.diningNum
        this.data.spaceData.list[5].value =
          res.data.venueNum.toiletNum + res.data.venueNum.parkingNum
      }
    })
  }
  // 获取活动数据
  private getBrokenLineByLatelySeventh() {
    getBrokenLineByLatelySeventh().then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.activity.data = res.datas
      }
    })
  }
  // 活动数量
  private getCountStatistics() {
    getCountStatistics().then((res: any) => {
      if (res.code === 0) {
        this.data.titleData3.list[0].value = res.data.activityTotalCount
        this.data.titleData3.list[1].value = res.data.notStartCount
        this.data.titleData3.list[2].value = res.data.startCount
        this.data.titleData3.list[3].value = res.data.endCount
      }
    })
  }

  // 获取最近7天新增志愿者
  private getCountLatelyVolunteer() {
    getCountLatelyVolunteer().then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.volunteerView.data =
          res.data.countLatelySevenDayVolunteer
        this.data.titleData5.list[0].value =
          res.data.countVolunteerJoinTeam.total
        this.data.titleData5.list[1].value =
          res.data.countVolunteerJoinTeam.joinTame
        this.data.titleData5.list[2].value =
          res.data.countVolunteerJoinTeam.total -
          res.data.countVolunteerJoinTeam.joinTame
      }
    })
  }
  // 获取最近7天发布志愿者团队
  private getCountLatelyVolunteerTeam() {
    getCountLatelyVolunteerTeam().then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.volunteerTeamView.data =
          res.data.countLatelySevenDayVolunteerTeam
        this.data.titleData6.list[0].value =
          res.data.siteVolunteerTeamSummaryCount.total
        this.data.titleData6.list[1].value =
          res.data.siteVolunteerTeamSummaryCount.selfPublishNum
        this.data.titleData6.list[2].value =
          res.data.siteVolunteerTeamSummaryCount.placeReportNum
      }
    })
  }
  // 企业端最近一个月志愿者统计
  private getLatelyOneMonthVolunteer() {
    getLatelyOneMonthVolunteer().then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.companyVolunteerView.data =
          res.data.companyCountLatelyOneMonthVolunteer
        this.data.titleData7.list[0].value =
          res.data.companyVolunteerSummaryCount.total
        this.data.titleData7.list[1].value =
          res.data.companyVolunteerSummaryCount.teamVolunteerNum
      }
    })
  }
  // 最近7天新增社团
  private getAssociationSummary() {
    getAssociationSummary().then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.associationSummaryView.data = res.data.echartsData.map(
          (item: any) => ({
            ydata: item.time,
            series: [item.selfPublishNum, item.placeReportNum]
          })
        )
        this.data.titleData8.list[0].value = res.data.countNum.totalNum
        this.data.titleData8.list[1].value = res.data.countNum.selfPublishNum
        this.data.titleData8.list[2].value = res.data.countNum.placeReportNum
      }
    })
  }
  // 最近1个月社团统计
  private getAssociationMonth() {
    getAssociationMonth().then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.associationMonthView.data = res.datas.map(
          (item: any) => ({
            ydata: item.time,
            series: [item.num]
          })
        )
      }
    })
  }
  // 统计社团总数和关注数量
  private getAssociationNum() {
    getAssociationNum().then((res: any) => {
      if (res.code === 0) {
        this.data.titleData9.list[0].value = res.data.associaNum
        this.data.titleData9.list[1].value = res.data.associaNumFans
      }
    })
  }
  // 最近7天新增非遗
  private getHeritageSummary() {
    getHeritageSummary({}).then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.HeritageSummaryView.data = res.data.echartsData.map(
          (item: any) => ({
            ydata: item.time,
            series: [item.selfPublishNum, item.placeReportNum]
          })
        )
        this.data.titleData10.list[0].value = res.data.countNum.totalNum
        this.data.titleData10.list[1].value = res.data.countNum.selfPublishNum
        this.data.titleData10.list[2].value = res.data.countNum.placeReportNum
      }
    })
  }
  // 最近1个月非遗统计
  private getHeritageMonth() {
    getHeritageMonth({}).then((res: any) => {
      if (res.code === 0) {
        this.data.echartConfig.HeritageMonthView.data = res.datas.map(
          (item: any) => ({
            ydata: item.time,
            series: [item.num]
          })
        )
      }
    })
  }
  // 统计非遗总数和关注数量
  private getHeritageNum() {
    getHeritageNum().then((res: any) => {
      if (res.code === 0) {
        this.data.titleData11.list[0].value = res.data.total
        this.data.titleData11.list[1].value = res.data.num
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.profile-box {
  background-color: $grayDark;
  color: $font04;
  .count {
    margin: 15px 0;
  }
  .space {
    margin-bottom: 15px;
  }
  .companyEchart {
    background-color: $bg01;
    margin-bottom: 15px;
  }
  .echarts-box {
    overflow: auto;
    overflow-x: hidden;
    background-color: $grayDark;
    .echart {
      background-color: $bg01;
      float: left;
      width: calc(100% / 2 - 5px);
      margin-right: 10px;
      margin-bottom: 10px;
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
}
</style>
