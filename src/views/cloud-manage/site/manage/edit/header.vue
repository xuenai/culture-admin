<!--
 * @Author: 任智勇
 * @since: 2019-05-31 10:51:35
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-27 11:01:34
 -->
<template>
  <div class="header">
    <div class="imgDiv">
      <img
        v-if="data.siteLogo"
        :src="data.siteLogo"
      >
      <img v-else src="@assets/image/site-default.png" :alt="data.name">
    </div>
    <div class="empInfo">
      <h3>{{data.companyName}}</h3>
      <p>
        <span class="type">{{data.siteIntroduce}}</span>

        <span class="codeBox">
          <i class="cloud-icon leftIcon">&#xe7e2;</i>
          站长手机号：{{data.sitePhone}}
        </span>
        <span>
          <i class="cloud-icon leftIcon">&#xe812;</i>
          站点类型：{{getSiteTypeName(data.siteType)}}
        </span>
        <span>
          <i class="cloud-icon leftIcon">&#xe671;</i>
          开站时间：{{data.createTime}}
        </span>
      </p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component,Prop, Vue } from "vue-property-decorator";
import DropCode from "@components/DropCode/DropCode.vue";

@Component({
  components: {
    DropCode
  }
})
export default class Header extends Vue {
  @Prop() private data:any

  // 匹配站点类型
  private getSiteTypeName(code: string) {
    if (code === "scenic") {
      return "景区";
    } else {
      return "政府";
    }
  }
}
</script>

<style lang='scss' scoped>
.header {
  background-color: $bg01;
  height: 140px;
  padding: 20px 15px;
  border-radius: 3px;
  > div {
    float: left;
  }
  .imgDiv {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background: $grayLight;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .empInfo {
    margin-left: 15px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    h3 {
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: $font01;
    }
    p {
      height: 24px;
      line-height: 24px;
      .type {
        margin-right: 20px;
      }
    }
    .codeBox {
      margin-left: 50px;
      cursor: pointer;
    }
    .leftIcon {
      color: $theme;
      margin-left: 60px;
    }
  }
}
</style>
