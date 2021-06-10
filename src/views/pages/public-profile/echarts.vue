<!--
 * @Author: 任智勇
 * @since: 2019-05-29 15:44:26
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-02 20:36:44
 -->
<template>
  <div class="profile-chart-wrapper">
    <Title :data="titleData"></Title>
    <Chart :configure="configure" class="char-div"></Chart>
  </div>
</template>

<script lang='ts'>
import { Component,Prop, Vue } from "vue-property-decorator";
import Title from "@components/spaceCount/space.vue";
import Chart from "@components/groupChart/groupChart.vue";

@Component({ components: { Title, Chart } })
export default class ComponentName extends Vue {
  @Prop() private titleData: any; // 标题 配置
  @Prop() private configure: any; // echarts 配置
  mounted() {}
}
</script>

<style lang='scss' scoped>
.profile-chart-wrapper{
  padding-bottom:15px;
}
.char-div {
  height: 300px;
  width: calc(100% - 20px);
}
</style>
