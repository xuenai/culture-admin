/*
 * @Author: Hexg
 * @Date: 2019-07-01 19:28:06
 * @Last Modified by:   Hexg
 * @Last Modified time: 2019-07-01 19:28:06
 */
<template>
  <div class="error-page">
    <img src="@image/404.png" alt="">
    <p>您的网页乘飞船飞走啦，程序员哥哥正在努力修复中！</p>
    <!-- <p>返回首页看看其他内容吧~</p> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class NotFoundPage extends Vue {

}
</script>

<style lang='scss' scoped>
.error-page{
  position:absolute;
  left:0;
  top:0;
  width: 100%;
  height:100%;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img{
    width:701px;
    height:auto;
    margin-bottom:32px;
  }
  p{
    font-size:18px;
    line-height:38px;
  }
}
</style>
