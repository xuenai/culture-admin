<!--
 * @Author: 任智勇
 * @since: 2019-05-29 14:40:36
 * @LastAuthor   : 任智勇
 * @lastTime     : 2020-01-16 10:19:10
 -->
<template>
  <div>
    <ul class="count-box" :class="{cursor: adiutMenu.length}">
      <li>
        <div class="icon" @click="gotoAuditPage('场所审核')">
          <i class="cloud-icon">&#xe7c9;</i>
        </div>
        <div class="info">
          <h3 @click="gotoAuditPage('场所审核')">{{defaultData.placeTotal}}</h3>
          <p @click="gotoAuditPage('场所审核')">待审核场所</p>
        </div>
      </li>
      <li>
        <div class="icon" @click="gotoAuditPage('内容审核')">
          <i class="cloud-icon">&#xe677;</i>
        </div>
        <div class="info">
          <h3 @click="gotoAuditPage('内容审核')">{{defaultData.contentTotal}}</h3>
          <p @click="gotoAuditPage('内容审核')">待审核内容</p>
        </div>
      </li>
      <li>
        <div class="icon" @click="gotoAuditPage('活动审核')">
          <i class="cloud-icon">&#xe7d0;</i>
        </div>
        <div class="info">
          <h3 @click="gotoAuditPage('活动审核')">{{defaultData.activityTotal}}</h3>
          <p @click="gotoAuditPage('活动审核')">待审核活动</p>
        </div>
      </li>
      <li>
        <div class="icon" @click="gotoAuditPage('话题审核')">
          <i class="cloud-icon">&#xe7c8;</i>
        </div>
        <div class="info">
          <h3 @click="gotoAuditPage('话题审核')">{{defaultData.topicTotal}}</h3>
          <p @click="gotoAuditPage('话题审核')">待审核话题</p>
        </div>
      </li>
      <li>
        <div class="icon" @click="gotoAuditPage('志愿者审核')">
          <i class="cloud-icon">&#xe705;</i>
        </div>
        <div class="info">
          <h3 @click="gotoAuditPage('志愿者审核')">{{defaultData.volunteerTotal}}</h3>
          <p @click="gotoAuditPage('志愿者审核')">待审核志愿者</p>
        </div>
      </li>
      <router-link tag="li" to="/alarm">
        <div class="icon">
          <i class="cloud-icon">&#xe70d;</i>
        </div>
        <div class="info">
          <h3>{{defaultData.emergencyNumber}}</h3>
          <p>紧急求助</p>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";

@Component({ components: {} })
export default class Count extends Vue {
  get adiutMenu() {
    return AppModule.nav.filter(e => e.name === "审核");
  }
  private defaultData: any = {
    placeTotal: 0,
    contentTotal: 0,
    activityTotal: 0,
    topicTotal: 0,
    volunteerTotal: 0
  };
  @Prop() data!: any;
  @Watch("data", { immediate: true, deep: true })
  refrshData() {
    console.log(this.data);
    Object.assign(this.defaultData, this.data);
  }
  /**
   * gotoAuditPage 前往审核页面
   */
  gotoAuditPage(
    type: "场所审核" | "内容审核" | "活动审核" | "话题审核" | "志愿者审核"
  ) {
    // 没有审核权限
    if (!this.adiutMenu.length) {
      return false;
    }
    let menus = this.adiutMenu[0].child.filter((e: any) => e.name === type);
    if (!menus.length) {
      return false;
    }
    // if (type === '活动审核') {
    //   this.$router.push({path: menus[0].url})
    //   return false;
    // }
    if (type === "内容审核") {
      this.$router.push({ path: menus[0].url });
      return false;
    }
    if (!menus[0].child.length) {
      return false;
    }
    this.$router.push({ path: menus[0].child[0].url });
  }
}
</script>

<style lang='scss' scoped>
.count-box {
  height: 105px;
  background-color: $bg01;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  > li {
    flex: 1;
    display: flex;
    align-items: center;
    &:nth-child(1) .icon {
      background-color: $theme;
    }
    &:nth-child(2) .icon {
      background-color: $theColor8;
    }
    &:nth-child(3) .icon {
      background-color: $theColor4;
    }
    &:nth-child(4) .icon {
      background-color: $theColor7;
    }
    &:nth-child(5) .icon {
      background-color: $theColor2;
    }
    &:nth-child(6) .icon {
      background-color: $theColor1;
    }
    .icon {
      width: 56px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      margin-right: 20px;
      i {
        color: #fff;
        font-size: 24px;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      h3 {
        font-size: 26px;
        color: $font01;
      }
    }
  }
  &.cursor {
    .icon,
    h3,
    p {
      cursor: pointer;
    }
  }
}
</style>
