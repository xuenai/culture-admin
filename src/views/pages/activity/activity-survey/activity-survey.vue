<!--
 * @Author: 任智勇
 * @since: 2019-05-23 09:02:49
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-08 15:24:45
 -->
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
          <span>{{data.orderTotalCount}}</span>
          <p>活动预订数</p>
        </Col>
        <Col span="4" class="box">
          <span>{{data.orderWaitCount}}</span>
          <p>待消费</p>
        </Col>
        <Col span="4" class="box">
          <span>{{data.orderEndCount}}</span>
          <p>已完成</p>
        </Col>
        <Col span="4" class="box">
          <span>{{data.orderCancelCount}}</span>
          <p>已取消</p>
        </Col>
        <Col span="4" class="box">
          <span>{{data.orderInvalidCount}}</span>
          <p>已失效</p>
        </Col>
      </Row>
      <div class="clearfix mt15 content">
        <div class="left fl">
          <p class="title-ind">
            <span>活动类型占比情况</span>
          </p>
          <Echarts class="echart-box" :configure="pieData.type"></Echarts>
        </div>
        <div class="right fr">
          <p class="title-ind">
            <span>活动方式占比情况</span>
            <ul class="method">
              <li v-for="(item, k) in ACTIVITY_TYPE" :class="{active:method===k}" @click="checkMethod(k)">{{item}}</li>
            </ul>
          </p>
          <Echarts class="echart-box" :configure="pieData.method"></Echarts>
        </div>
      </div>
      <div class="chart-wrap">
        <div class="tips-title ">
            活动分类统计情况
        </div>
        <div class="chart" style="height: 400px">
            <LineEchart :configure="barData" class="chart-div"></LineEchart>
        </div>
      </div>
      <Mychart :configure="lineData" style="margin-top:15px;width:100%;"></Mychart>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getCountStatistics, getCountProportion,getMethodCountProportion,getClassifyCountProportion,getBrokenLineActivity } from "@service/activity";
import Echarts from "@components/pieChart/pieChart.vue";
import LineEchart from "@components/groupChart/groupChart.vue";
import Mychart from "./echart.vue";
import {ACTIVITY_TYPE} from '@constant/index'

@Component({
  components: {
    Echarts,
    LineEchart,
    Mychart
  }
})
export default class ComponentName extends Vue {
  private pieData: any = {
    type: {
      data: [
        {
          name: "预订活动",
          value: "10"
        },
        {
          name: "报名活动",
          value: "20"
        },
        {
          name: "报名活动",
          value: "20"
        },
        {
          name: "普通活动",
          value: "10"
        }
      ],
      label_line1: true,
      seriesName: "活动类型"
    },
    method: {
      data: [
        // {
        //   name: "预订活动",
        //   value: "56"
        // },
        // {
        //   name: "报名活动",
        //   value: "0"
        // },
        // {
        //   name: "普通活动",
        //   value: "0"
        // },
        // {
        //   name: "普通活动",
        //   value: "0"
        // }
      ],
      label_line1: true,
      seriesName: "活动方式"
    }
  };
  private barData: any = {
    //线状图配置2
    data: [
        // {ydata: "8989.99", series: [12, 12 + 20, 12 + 30, 12 + 5]},
    ], //动态数据
    title: "",
    seriesName: ["活动统计"], //系列名称
    seriesType: ["bar", "line", "line", "line","line"], //系列类型
    lengedPosition: ["bottom", "", "", "right"], // 上,右,下,左
    yCompany: ["单位：个"], // 如果不设置单位默认为个
  }
  private lineData: any = {
    data: [], //动态数据
    seriesName: ["活动预订数"], //系列名称
    seriesType: ["line", "line"], //系列类型
    lengedPosition: ["bottom", "", "", "center"], // 上,右,下,左
    yCompany: ["单位：条"], // 如果不设置单位默认为个
    xRotate:30,
    interval: 2
  }

  private ACTIVITY_TYPE = ACTIVITY_TYPE
  private data: any = {};
  mounted() {
    this.getCountStatistics();
    this.getCountProportion();
    this.getMethodCountProportion();
    this.getClassifyCountProportion();
    this.getBrokenLineActivity();
  }
  // 数量统计
  private getCountStatistics() {
    getCountStatistics().then((res: any) => {
      if (res.code === 0) {
        this.data = res.data;
      }
    });
  }
  // 活动类型 - 饼图
  private getCountProportion() {
    getCountProportion().then((res: any) => {
      if (res.code === 0) {
        this.pieData.type.data = res.datas.map((item: any) => {
          return {
            name: item.name,
            value: item.num
          };
        }).sort((a:any, b:any) => b.value - a.value);
      }
    });
  }
  // 活动方式
  private method = 'ACTIVITY_TYPE_RESERVE';
  private checkMethod(method:string){
    this.method = method;
    this.getMethodCountProportion();
  }
  // 活动方式 - 饼图
  private getMethodCountProportion() {
    getMethodCountProportion({type:this.method}).then((res: any) => {
      if (res.code === 0) {
        this.pieData.method.data = res.datas.map((item: any) => {
          return {
            name: item.name,
            value: item.num
          };
        }).sort((a:any, b:any) => b.value - a.value);
      }
    });
  }
  // 活动分类 - 柱图
  private getClassifyCountProportion() {
    getClassifyCountProportion().then((res: any) => {
      if (res.code === 0) {
        this.barData.data = res.datas.filter((item: any) => item.series[0] != 0)
      }
    });
  }
  // 最近一月活动 - 折线图
  private getBrokenLineActivity() {
    getBrokenLineActivity().then((res: any) => {
      if (res.code === 0) {
        this.lineData.data = res.datas
      }
    });
  }
}
</script>

<style lang='scss' scoped>
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
      padding:15px 15px 15px 10px;
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
      .method{
        float: right;
        display: flex;
        font-weight: normal;
        border: 1px solid $borderLight;
        border-left: none;
        li{
          border-left: 1px solid $borderLight;
          width: 100px;
          font-size: 14px;
          text-align: center;
          height: 26px;
          line-height: 26px;
          cursor: pointer;
          &:hover,&.active{
            background-color: $success;
            color: #fff;
          }
        }
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
      content: '';
      width: 3px;
      height: 16px;
      background-color: $theme;
      border-radius: 1.5px;
    }
    .tip{
      font-size: 12px;
      color:$lightGray;
    }
  }
  .chart{
      height: calc(100% - 60px);
  }
  .chart-div {
      height: 100%;
      width: 100%;
  }
}
</style>
