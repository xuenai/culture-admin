<!--
 * @Author: 任智勇
 * @since: 2019-06-13 15:35:59
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-23 14:11:20
 -->
<template>
  <div class="processDiv">
    <h3 class="title" v-if="defaultData.h">{{defaultData.h}}</h3>
    <p class="status">
      <span :class="'status-' + defaultData.status">{{getStatusTxt(defaultData.status)}}</span>
      <span v-if="defaultData.auditResult" class="info">({{defaultData.auditResult}})</span>
    </p>
    <h3 class="contentTitle" v-if="defaultData.title">{{defaultData.title}}</h3>
    <p class="autitInfo">
      <span>创建者：{{defaultData.createCompany}}</span>
      <span class="createTime">提交时间：{{defaultData.createTime}}</span>
    </p>
    <div class="processBox" v-if="defaultData.auditProcess.length > 0">
      <ul>
        <li
          v-for="(item,index) in defaultData.auditProcess"
          :key="index"
          :class="'status'+item.status"
        >
          <div class="icon">
            <i class="cloud-icon success" v-if="item.status === 6">&#xe61e;</i>
            <i class="cloud-icon error" v-else-if="item.status > 6">&#xe622;</i>
            <i class="cloud-icon" v-else>&#xe61e;</i>
          </div>
          <p class="name">{{item.name}}</p>
          <p class="time" v-if="item.dateTime">{{item.dateTime}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
/**
 * 使用
 * <auditProcess :data="processData"></auditProcess>
 *
 * 参数
 * defaultData:  /res/site/content/getContentAuditProcess 此接口返回的参数
 */
@Component({ components: {} })
export default class ComponentName extends Vue {
  private defaultData: any = {
    h: "",
    title: "",
    status: 4,
    name: "",
    createTime: "",
    auditResult: "",
    auditProcess: []
  };
  @Prop() private data: any;
  @Watch("data", { immediate: true, deep: true })
  refreshData() {
    Object.assign(this.defaultData, this.data);
  }
  mounted() {}

  // 根据code获取状态描述
  private getStatusTxt(code: any) {
    switch (code) {
      case 1:
        return "正常";
      case 2:
        return "禁用";
      case 3:
        return "草稿";
      case 4:
        return "待审核";
      case 5:
        return "审核中";
      case 6:
        return "审核通过";
      case 7:
        return "回退";
      case 8:
        return "撤回";
      case 9:
        return "终止";
      case "CONTENT":
        return "内容";
      case "IMAGE":
        return "图片";
      case "VIDEO":
        return "视频";
      case "AUDIO":
        return "音频";
    }
  }
}
</script>

<style lang='scss' scoped>
.processDiv {
  font-size: 14px;
  color: $font01;
  .status {
    color: $theColor2;
    &-6 {
      color: $success;
    }
    .info {
      color: $font01;
    }
  }
  .contentTitle {
    @include ellipsisLn(2);
  }
  .autitInfo {
    margin: 5px 0 20px;
    color: $font03;
    .createTime {
      margin-left: 20px;
    }
  }
  .processBox {
    margin: 10px 0;
    border-top: 1px solid $borderLight;
    ul {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      li {
        flex: 1;
        text-align: center;
        .time {
          color: $font03;
        }
        &:first-child {
          .cloud-icon::before {
            visibility: hidden;
          }
        }
        &:last-child {
          .cloud-icon::after {
            visibility: hidden;
          }
        }
        .cloud-icon {
          color: $font05;
          font-size: 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &.success {
            color: $success;
          }
          &.error {
            color: $danger;
          }
          &:after,
          &::before {
            content: "";
            width: 40%;
            height: 3px;
            display: inline-block;
            background-color: $font05;
          }
        }
        &.status6 .cloud-icon::after,
        &.status6 + li .cloud-icon::before {
          background-color: $success;
        }
        &.status7,
        &.status8,
        &.status9 {
          color: $danger;
          .time {
            color: $danger;
          }
        }
      }
    }
  }
}
</style>
