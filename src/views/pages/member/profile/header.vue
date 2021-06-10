<!--
 * @Author: 任智勇
 * @since: 2019-05-21 14:47:07
 * @LastAuthor: 任智勇
 * @lastTime: 2019-05-28 14:55:02
 -->
<template>
  <div class="header">
    <div class="imgDiv">
      <img
        src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1477188743,947637741&fm=27&gp=0.jpg"
        alt="企业头像"
      >
    </div>
    <div class="empInfo">
      <h3>企业名称</h3>
      <p>所属类型</p>
      <p>所属行政区</p>
    </div>
    <div class="dropDiv">
      <DropCode
        dropName="H5页面"
        value="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2153937626,1074119156&fm=27&gp=0.jpg"
        url="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2153937626,1074119156&fm=27&gp=0.jpg"
        tips="请使用微信扫描二维码"
      ></DropCode>
    </div>
    <div class="dropDiv">
      <DropCode
        dropName="小程序"
        value="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2153937626,1074119156&fm=27&gp=0.jpg"
        url="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2153937626,1074119156&fm=27&gp=0.jpg"
        tips="请使用微信扫描二维码"
      ></DropCode>
    </div>
    <div class="headerRight">
      <span class="num">5</span>
      <span>上云文旅企业</span>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import DropCode from "@components/DropCode/DropCode.vue";

@Component({
  components: {
    DropCode
  }
})
export default class Header extends Vue {}
</script>

<style lang='scss' scoped>
.header {
  background-color: $bg;
  color: #333;
  height: 140px;
  padding: 20px 36px;
  border-radius: 3px;
  > div {
    float: left;
  }
  .imgDiv {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid #d6d6d6;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .empInfo {
    margin-left: 15px;
    font-size: 14px;
    h3 {
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      font-weight: normal;
    }
    p {
      height: 24px;
      line-height: 24px;
    }
  }
  .dropDiv {
    font-size: 14px;
    margin-top: 76px;
    margin-left: 70px;
  }
  .headerRight {
    float: right;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 14px;
    .num {
      font-size: 24px;
    }
  }
}
</style>
