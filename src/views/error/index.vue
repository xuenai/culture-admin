/*
 * @Author: Hexg
 * @Date: 2019-07-01 19:28:06
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-07-24 19:53:02
 */
<template>
  <div class="error-page">
    <img src="@image/error.png" alt="">
    <p>{{msg}}</p>
    <div class="btn">
      <Button type="primary" @click="refreshPage">点击刷新页面</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class NotFoundPage extends Vue {
  private msg = ''
  private refreshPage () {
    let JSESSIONID = this.$route.query.JSESSIONID
    if (JSESSIONID) {
      this.$router.push({path: '/', query: {JSESSIONID}})
    } else {
      this.$router.push({path: '/'})
    }
  }
  created () {
    this.msg = (this.$route.query.msg ? this.$route.query.msg : '网络出错啦，程序员哥哥正在努力修复中！') as string
  }
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
    width:556px;
    height:auto;
    margin-bottom:32px;
  }
  p{
    font-size:18px;
    line-height:38px;
    padding-bottom:16px;
  }
}
</style>
