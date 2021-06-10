<!--
 * @Author: 任智勇
 * @since: 2019-05-29 19:57:22
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-08 15:27:00
 -->
<template>
  <div class="content">
    <h1>
      <span></span>最近一月（{{month}}月）活动预订数量统计
    </h1>
    <Chart :configure="configure" class="char-div"></Chart>
  </div>
</template>

<script lang='ts'>
import { Component,Prop, Vue } from "vue-property-decorator";
import Chart from "@components/groupChart/groupChart.vue";

@Component({ components: {Chart} })
export default class Echarts extends Vue {
  @Prop() private configure:any;
  private month:any = 0;
  mounted() {
    let d = new Date();
    this.month = d.getMonth() + 1
  }
}
</script>

<style lang='scss' scoped>
h1 {
  height: 40px;
  line-height: 30px;
  font-size: 16px;
  color: $font01;
  padding-left: 30px;
  span {
    display: inline-block;
    width: 5px;
    height: 18px;
    border-radius: 2px;
    background-color: $theme;
    margin-right: 10px;
    position: relative;
    top: 3px;
  }
}
.content{
    background-color: $bg01;
    padding: 15px;
    .char-div{
        height: 560px;
        width: 100%;
    }
}
</style>
