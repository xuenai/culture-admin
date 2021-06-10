<!--
 * @Author: 任智勇
 * @since: 2019-05-21 14:07:13
 * @LastAuthor: SXQ
 * @lastTime: 2019-07-01 15:28:02
 -->
<template>
  <div class="container">
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{totalNums.total}}</p>
        <p class="item-name">累计会员</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{totalNums.today_new}}</p>
        <p class="item-name">今日新增会员</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{totalNums.pre_new}}</p>
        <p class="item-name">昨日新增会员</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{totalNums.today_activity}}</p>
        <p class="item-name">今日活跃会员</p>
      </Col>
    </Row>
    <Row class="row count-wrap" v-if="siteInfo.creditStatus == 1">
      <Col span="4" class="summary item">
        <p class="item-count">{{integrityData.totalCreditUser}}</p>
        <p class="item-name">诚信会员</p>
      </Col>
      <Col span="2" class="item" v-for="item in integrityData.levelCount" :key="item.level">
        <p class="item-count">{{item.num}}</p>
        <p class="item-name">诚信{{item.level}}</p>
      </Col>
      <Col span="2" class="item">
        <p class="item-count">{{integrityData.losePromiseCount}}</p>
        <p class="item-name">失约用户</p>
      </Col>
      <Col span="2" class="item">
        <p class="item-count">{{integrityData.loseCreditCount}}</p>
        <p class="item-name">失信用户</p>
      </Col>
    </Row>
    <Echarts></Echarts>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Echarts from "./echarts.vue";
import {
  getTotalList,
  getNewNumsList,
  getExportExcel,
  getNumsList,
  getPlatformUserCount
} from "@service/member";
import { AppModule } from "@store/modules/app";

@Component({
  components: {
    Echarts
  }
})
export default class MemberList extends Vue {
  mounted() {
    this.getTotalList(); //获取统计数据
    this.getPlatformUserCount();
  }
  get siteInfo() {
    return AppModule.siteInfo;
  }
  /* S 获取统计数据 */
  private totalNums: any = {
    today_activity: "", //今日活跃数量
    today_new: "", //今日新增数量
    total: "", //	累计会员数量
    pre_new: "" //昨日新增数量
  };

  private getTotalList() {
    getTotalList().then((res: any) => {
      if (res.code === 0) {
        this.totalNums = res.data;
      }
    });
  }

  /* E 获取统计数据 */

  /* S 获取平台诚信用户概况统计*/
  private integrityData: object = {};
  getPlatformUserCount() {
    getPlatformUserCount({
      platformChannel: "cultural", //平台渠道
      platformCode: this.$store.state.app.userInfo.siteCode //平台code
    }).then((res: any) => {
      if (res.code === 0) {
        this.integrityData = res.data;
      }
    });
  }
  /* E 获取平台诚信用户概况统计*/
}
</script>

<style lang='scss' scoped>
.container {
  padding: 20px;
}

.row {
  border-bottom: 1px solid #dedede;
  padding-bottom: 30px;
  margin-bottom: 30px;
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
    margin-top: 35px;
  }
}
</style>
