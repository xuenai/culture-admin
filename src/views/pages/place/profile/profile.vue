<!--
 * @Author: chenyl
 * @since: 2019-06-05 09:36:34
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-12 10:52:51
 -->
<template>
  <div class="container">
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{ venueNum.totalNum }}</p>
        <p class="item-name">共计场所</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ venueNum.venueNum }}</p>
        <p class="item-name">文化场馆</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ venueNum.scenicNum }}</p>
        <p class="item-name">景区</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ venueNum.hotelNum }}</p>
        <p class="item-name">酒店</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ venueNum.diningNum }}</p>
        <p class="item-name">餐饮</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ commonNum }}</p>
        <p class="item-name">公共资源</p>
      </Col>
    </Row>
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{ venueOrderData.total }}</p>
        <p class="item-name">场馆预约数</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ venueOrderData.waitTotal }}</p>
        <p class="item-name">待使用</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ venueOrderData.useTotal }}</p>
        <p class="item-name">已使用</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ venueOrderData.cancelTotal }}</p>
        <p class="item-name">已取消</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ venueOrderData.loseTotal }}</p>
        <p class="item-name">已失效</p>
      </Col>
    </Row>
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{ activityRoomNum.actTotalNum }}</p>
        <p class="item-name">活动室预约数</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ activityRoomNum.waitNum }}</p>
        <p class="item-name">待使用</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ activityRoomNum.endNum }}</p>
        <p class="item-name">已使用</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ activityRoomNum.cancelNum }}</p>
        <p class="item-name">已取消</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{ activityRoomNum.loseNum }}</p>
        <p class="item-name">已失效</p>
      </Col>
    </Row>
    <Row class="row chart-container">
      <Col span="10" class="col-item">
        <div class="chart-wrap">
          <div class="tips-title">
            各类型占比情况
          </div>
          <div class="chart">
            <PieChart class="chart-div" :configure="pieChartConfig"></PieChart>
          </div>
        </div>
      </Col>
      <Col span="14" class="col-item">
        <div class="chart-wrap ml10">
          <div class="tips-title ">
            近7天新增场所
          </div>
          <div class="chart">
            <LineEchart
              :configure="lineEchartConfig"
              class="chart-div"
            ></LineEchart>
          </div>
        </div>
      </Col>
      <Col span="24" class="mt15">
        <div class="chart-wrap">
          <div class="tips-title ">
            最近一月预约数量统计
          </div>
          <ul class="method ml20">
            <li
              :class="{ active: activityType == item.name }"
              v-for="item in types"
              :key="item.name"
              @click="changeTab(item)"
            >
              {{ item.name }}
            </li>
          </ul>
          <div class="chart mt30" style="height: 400px">
            <LineEchart
              :configure="lineEchartConfig2"
              class="chart-div"
            ></LineEchart>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LineEchart from '@components/groupChart/groupChart.vue'
import PieChart from '@components/pieChart/pieChart.vue'
import {
  getPieChart,
  getLineChart,
  getActivityRoomOrderMonthData,
  getVenueOrderNum,
  getVenueOrderMonth
} from '@service/place'

@Component({
  components: {
    LineEchart,
    PieChart
  }
})
export default class profile extends Vue {
  /*S饼图和数量*/
  //饼图配置
  private pieChartConfig: any = {
    data: [
      { value: 0, name: '文化场馆' },
      { value: 0, name: '酒店' },
      { value: 0, name: '景区' },
      { value: 0, name: '餐饮' }
    ],
    type: 'pie',
    seriesName: '场所类型',
    color: ['#2fa6ef', '#20daa3', '#9e84e7', '#9de192'] //颜色数组
  }
  //场所数量
  private venueNum: object = {}
  private activityRoomNum: object = {}
  private commonNum: number = 0
  private getOverview() {
    let _this = this
    getPieChart().then((res: any) => {
      this.venueNum = res.data.venueNum
      this.activityRoomNum = res.data.activityRoomNum
      _this.pieChartConfig.data[0].value = (_this.venueNum as any).venueNum
      _this.pieChartConfig.data[1].value = (_this.venueNum as any).hotelNum
      _this.pieChartConfig.data[2].value = (_this.venueNum as any).scenicNum
      _this.pieChartConfig.data[3].value = (_this.venueNum as any).diningNum
      //公共资源
      _this.commonNum =
        (this.venueNum as any).parkingNum + (this.venueNum as any).toiletNum
    })
  }
  /*E饼图*/

  /*S折线图*/
  //线状图配置
  private lineEchartConfig: any = {
    data: [
      // {ydata: "4.5", series: [12, 12 + 20, 12 + 30, 12 + 5]}
    ], //动态数据
    color: ['#2fa6ef', '#20daa3', '#9e84e7', '#9de192', '#E95351'], //颜色数组
    seriesName: ['文化场馆', '酒店', '景区', '餐饮', '公共资源'], //系列名称
    seriesType: ['line', 'line', 'line', 'line', 'line'], //系列类型
    isLenged: true, //是否开启图例
    lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
    // isLable:true,
    yCompany: ['单位：条'] // 如果不设置单位默认为个
  }
  getLineChart() {
    let _this = this,
      data: Array<object> = []
    getLineChart().then((res: any) => {
      for (let i = 0; i < 7; i++) {
        data.push({
          ydata: '',
          series: []
        })
      }
      res.datas.forEach((item: any, parentIndex: any) => {
        switch (item.type) {
          //场所
          case 'CONTENT_TYPE_VENUE':
            {
              item.series.forEach((item: any, index: any) => {
                ;(data as any)[index].ydata = item.createTime
                ;(data as any)[index].series[0] = item.totalNum
              })
            }
            break
          //酒店
          case 'CONTENT_TYPE_HOTEL':
            {
              item.series.forEach((item: any, index: any) => {
                ;(data as any)[index].ydata = item.createTime
                ;(data as any)[index].series[1] = item.totalNum
              })
            }
            break
          //景区
          case 'CONTENT_TYPE_SCENERY':
            {
              item.series.forEach((item: any, index: any) => {
                ;(data as any)[index].ydata = item.createTime
                ;(data as any)[index].series[2] = item.totalNum
              })
            }
            break
          //餐饮
          case 'CONTENT_TYPE_RESTAURANT':
            {
              item.series.forEach((item: any, index: any) => {
                ;(data as any)[index].ydata = item.createTime
                ;(data as any)[index].series[3] = item.totalNum
              })
            }
            break
          // //停车场
          case 'CONTENT_TYPE_PARKING':
            {
              item.series.forEach((item: any, index: any) => {
                ;(data as any)[index].ydata = item.createTime
                ;(data as any)[index].series[4] = item.totalNum
              })
            }
            break
          // //厕所
          case 'CONTENT_TYPE_TOILET':
            {
              item.series.forEach((item: any, index: any) => {
                ;(data as any)[index].ydata = item.createTime
                ;(data as any)[index].series[4] =
                  item.totalNum + (data as any)[index].series[4]
              })
            }
            break
        }
        _this.lineEchartConfig.data = data
      })
    })
  }
  //线状图配置2
  private lineEchartConfig2: any = {
    data: [
      // {ydata: "4.5", series: [12, 12 + 20, 12 + 30, 12 + 5]},
    ], //动态数据
    color: ['#2fa6ef'], //颜色数组
    seriesName: ['预约数量'], //系列名称
    seriesType: ['line', 'line', 'line', 'line', 'line'], //系列类型
    isLenged: true, //是否开启图例
    lengedPosition: ['bottom', '', '', 'right'], // 上,右,下,左
    // isLable:true,
    yCompany: ['单位：个'], // 如果不设置单位默认为个
    xRotate: 30,
    interval: 2
  }
  //场馆
  getVenueMonthData() {
    let _this = this,
      data: Array<object> = []
    getVenueOrderMonth().then((res: any) => {
      res.datas.forEach((item: any, index: any) => {
        data.push({
          ydata: item.time,
          series: [item.num]
        })
      })
      _this.lineEchartConfig2.data = data
    })
  }
  //活动室
  getRoomMonthData() {
    let _this = this,
      data: Array<object> = []
    getActivityRoomOrderMonthData().then((res: any) => {
      res.datas.forEach((item: any, index: any) => {
        data.push({
          ydata: item.createTime,
          series: [item.num]
        })
      })
      _this.lineEchartConfig2.data = data
    })
  }
  /*E折线图*/
  /*S 单选切换 */
  private types: any = [
    { name: '文化场馆', method: 'getVenueMonthData' },
    { name: '活动室', method: 'getRoomMonthData' }
  ]
  private activityType: string = '文化场馆'
  changeTab(item: any) {
    this.activityType = item.name
    this[item.method]()
  }
  /*E 单选切换 */
  /**S 场馆预约数量 */
  venueOrderData: any = {}
  getVenueOrderNum() {
    getVenueOrderNum().then((res: any) => {
      if (res.code === 0) {
        this.venueOrderData = res.data
      }
    })
  }
  /**E 场馆预约数量 */
  created() {
    //共计场所
    this.getOverview()
    //折线图
    this.getLineChart()
    //活动室预约统计折线图
    this.getVenueMonthData()
    this.getVenueOrderNum()
  }
  mounted() {}
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  background-color: $grayDark;
  padding: 0 !important;
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
      content: '';
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
  .method {
    position: relative;
    z-index: 999;
    float: left;
    display: flex;
    font-weight: normal;
    border: 1px solid $borderLight;
    border-left: none;
    li {
      border-left: 1px solid $borderLight;
      width: 100px;
      font-size: 14px;
      text-align: center;
      height: 26px;
      line-height: 26px;
      cursor: pointer;
      &:hover,
      &.active {
        background-color: $success;
        color: #fff;
      }
    }
  }
  .count-wrap {
    background-color: $bg01;
    padding: 25px 15px;
  }
  .row {
    .item {
      text-align: center;
    }
    .item-count {
      font-size: 26px;
      color: $theme;
    }
    .item-name {
      font-size: 16px;
      color: $font01;
      margin-top: 10px;
    }
    .summary {
      position: relative;
      .item-count {
        color: $danger !important;
      }
      &:after {
        content: '';
        position: absolute;
        top: 10px;
        right: 1px;
        height: 70px;
        width: 1px;
        background-color: $borderLight;
      }
    }
    & + .row {
      margin-top: 15px;
    }
  }
  .chart-container {
    position: relative;
    height: calc(75% - 180px);
    .col-item {
      height: 100%;
    }
  }
  .chart-wrap {
    height: 100%;
    padding-top: 5px;
    background-color: $bg01;
    .chart {
      height: calc(100% - 60px);
      margin-right: 20px;
    }
    .chart-div {
      height: 100%;
    }
    .mt30 {
      margin-top: 30px;
    }
  }
  .topic-msg {
    padding: 8px 0;
    .img {
      width: 100px;
      height: 60px;
    }
    .msg-panel {
      margin-left: 8px;
    }
    .topic-name {
      margin-top: 7px;
    }
    .date {
      margin-top: 7px;
    }
  }
  // .active-wrap{
  //     background-color: $bg01;
  //    .progress{
  //        width: 30%;
  //    }
  //     .item{
  //         padding: 20px;
  //     }
  //    .label-name{
  //         width: 100px;
  //        text-align: right;
  //    }
  // }
}
</style>
