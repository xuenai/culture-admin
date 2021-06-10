<!--
 * @Author: 任智勇
 * @since: 2019-05-27 08:54:07
 * @LastAuthor: 任智勇
 * @lastTime: 2019-05-28 20:33:22
 -->
<template>
  <div class="pd20">
    <div class="banner">
      <img src="./image/banner.jpg">
    </div>
    <ol class="rule">
      <li>
        <h3>· 会员营销</h3>
        <p>激励会员、引导会员行为、提升会员活跃度的一种有效营销机制。可建立会员体系，可动态添加会员等级，可自定义编辑等级名称、等级积分段、等级图标等，让会员营销更具灵活性。</p>
      </li>
      <li>
        <h3>· 成长体系</h3>
        <p>可以对会员积分的获取与消耗方式进行自定义。比如通过签到、消费、参与活动获得积分。</p>
      </li>
      <li>
        <h3>· 积分兑换</h3>
        <p>会员可通过积分商城兑换商品，消耗积分。</p>
      </li>
    </ol>
    <div class="btn-div">
      <router-link :to="{path: '/member-rule'}">
        <Button type="primary">确认开通</Button>
      </router-link>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component({ components: {} })
export default class MemberList extends Vue {
  mounted() {}
}
</script>

<style lang='scss' scoped>
.banner img{
    width: 100%;
}
.rule {
  color: $font04;
  font-size: 14px;
  li{
      margin: 10px 0;
  }
  h3 {
    color: $font01;
    height: 26px;
    line-height: 26px;
  }
  p{
      text-indent: 10px;
      line-height: 26px;
  }
}
</style>
