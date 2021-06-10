<!--
 * @Author: 陈艳玲
 * @since: 2019-05-31 10:04:22
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-17 09:41:46
 -->
<template>
  <!--审核结果状态-->
  <div class="head clearfix" :class="headBg" v-if="title">
    <span class="cloud-icon fl" :class="headBg" v-html="icon"></span>
    <div class="panel fl">
      <p class="title item">{{title}}</p>
      <p class="item">
        <span class="date" v-if="data.date && data.status===6">通过时间：{{data.date}}</span>
        <span class="date" v-if="data.date && data.status!==6">提交审核时间：{{data.date}}</span>
        <span class="remark" v-if="data.remark">审核备注：{{data.remark}}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

/**
 * title:审核信息  审核通过、驳回、审核不通过
 * date: 提交审核时间
 * remark: 备注信息
 * status: 1.通过  2.不通过  3.待审核  4.审核异常
 */
@Component
export default class auditResultHead extends Vue {
  @Prop() private data!: any;
  @Watch("data", { immediate: true, deep: true })
  refreshData() {
    this.getStatus();
  }
  private headBg: string = "";
  private title: string = "";
  private icon: string = "";

  mounted() {
    this.getStatus();
  }
  //获取状态值
  getStatus() {
    let _this = this;
    let status = parseInt(_this.data.status);
    switch (status) {
      case 1:
        this.title = "正常";
        break;
      case 2:
        this.title = "禁用";
        break;
      case 3:
        this.title = "草稿";
        break;
      case 4:
        this.title = "待审核";
        break;
      case 5:
        this.title = "审核中";
        break;
      case 6:
        this.title = "审核通过";
        break;
      case 7:
        this.title = "审核不通过";
        break;
      case 79:
        this.title = "审核不通过";
        break;
      case 8:
        this.title = "已撤回";
        break;
      case 9:
        this.title = "终止";
      case 500:
        this.title = "审核异常";
        break;
    }
    if (status === 1 || status === 6) {
      _this.headBg = "pass";
      _this.icon = "&#xe61e;";
      return;
    }
    if (
      status === 2 ||
      status === 3 ||
      status === 7 ||
      status === 79 ||
      status === 9 ||
      status === 8 ||
      status === 500
    ) {
      _this.headBg = "un-pass";
      _this.icon = "&#xe622;";
      return;
    }
    if (status === 4 || status === 5) {
      _this.headBg = "wait";
      _this.icon = "&#xe6d9;";
      return;
    }
  }
}
</script>

<style scoped lang="scss">
.head {
  padding: 20px;
  border-radius: 3px;
  &.pass {
    background-color: #f0fbef;
  }
  &.un-pass {
    background-color: #ffeeee;
  }
  &.wait {
    background-color: #e9f5fd;
  }
}
.cloud-icon {
  display: block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 40px;
  margin-top: 5px;
  &.pass {
    color: #6ed35e;
  }
  &.un-pass {
    color: #ff5b5b;
  }
  &.wait {
    color: $theme;
  }
}
.panel {
  margin-left: 15px;
  .item {
    line-height: 30px;
  }
  .title {
    color: #333333;
    font-size: 18px;
    font-weight: 600;
  }
  .date {
    color: $font01;
  }
  .remark {
    border-left: 1px solid $font01;
    margin-left: 10px;
    padding-left: 10px;
    color: $font01;
  }
}
</style>
