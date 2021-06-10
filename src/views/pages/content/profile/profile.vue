<!--
 * @Author: 任智勇
 * @since: 2019-05-29 19:36:45
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-12 10:54:04
 -->
<template>
  <div class="div-box">
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{resData.countContent.total}}</p>
        <p class="item-name">内容总数</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countContent.videoTotal}}</p>
        <p class="item-name">视频</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countContent.audioTotal}}</p>
        <p class="item-name">音频</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countContent.imageTotal}}</p>
        <p class="item-name">图片</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countContent.contentTotal}}</p>
        <p class="item-name">内容</p>
      </Col>
    </Row>
    <!-- <Row class="row count-wrap" v-if="siteType">
      <Col span="4" class="summary item">
        <p class="item-count">{{resData.countComment.total}}</p>
        <p class="item-name">点评总数</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countComment.contentTotal}}</p>
        <p class="item-name">内容点评</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countComment.placeTotal}}</p>
        <p class="item-name">场所点评</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countComment.activityTotal}}</p>
        <p class="item-name">活动点评</p>
      </Col>
    </Row>
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{resData.countComplaints.total}}</p>
        <p class="item-name">投诉总数</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countComplaints.personnelTotal}}</p>
        <p class="item-name">人员</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countComplaints.serviceTotal}}</p>
        <p class="item-name">服务</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{resData.countComplaints.environmentTotal}}</p>
        <p class="item-name">环境</p>
      </Col>
    </Row> -->
    <Mychart :configure="data.echartConfig" style="margin-top:15px;width:100%;"></Mychart>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Mychart from "./echart.vue";
import ueditor from "@components/ueditor/ueditor.vue";
import { getContentSurveyCount } from "@service/content";

@Component({ components: { Mychart, ueditor } })
export default class Profile extends Vue {
  private data: any = {
    echartConfig: {
      data: [{ ydata: "4.5", series: [12] }], //动态数据
      color: ["#987de6", "#13d89e"], //颜色数组
      seriesName: ["自发布", "场所上报"], //系列名称
      seriesType: ["line", "line"], //系列类型
      isLenged: true, //是否开启图例
      lengedPosition: ["top", "", "", "center"], // 上,右,下,左
      // isLable:true,
      yCompany: ["单位：条"], // 如果不设置单位默认为个
      xRotate:15,
      interval: 2,
    }
  };
  private resData: any = {
    countContent: {
      total: 0,
      videoTotal: 0,
      audioTotal: 0,
      imageTotal: 0,
      contentTotal: 0
    },
    countComment: {
      total: 0,
      contentTotal: 0,
      placeTotal: 0,
      activityTotal: 0
    },
    countComplaints: {
      total: 0,
      personnelTotal: 0,
      serviceTotal: 0,
      environmentTotal: 0
    }
  };

  // 站点类型
  private siteType = this.$store.state.app.userInfo.dataType == "SITE";
  mounted() {
    this.getContentSurveyCount();
  }

  // 获取数据
  getContentSurveyCount() {
    getContentSurveyCount().then((res: any) => {
      this.resData = res.data;
      this.data.echartConfig.data = this.resData.countLatelyJanuary;
    });
  }
}
</script>

<style lang='scss' scoped>
.div-box {
  background-color: $grayDark;
  .header {
    margin-bottom: 15px;
  }
  .count-wrap {
    background-color: $bg01;
    padding: 25px 20px;
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
        content: "";
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
}
</style>
