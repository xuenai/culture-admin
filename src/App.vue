<template>
  <div>
    <!-- 有token的时候会加载外框 -->
    <div v-if="userLoginStatus">
      <Home></Home>
    </div>
    <!-- 没有token的时候不加载外框 -->
    <div v-else>
      <router-view></router-view>
    </div>
    <input type="hidden" v-model="siteName" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from "@store/modules/app";
import Home from "@views/home/home.vue"

@Component({ components: { Home } })
export default class App extends Vue {
  // 获取token
  get userLoginStatus() {
    return AppModule.userLoginStatus || false;
  }
  get siteName () {
    let siteName = Object.keys(AppModule.siteInfo).length ? AppModule.siteInfo.name : '文化旅游云'
    document.title = siteName
    return siteName
  }

}
</script>
<style lang="scss">
html,body,#app {
  min-height: 100%;
  font-family: Helvetica,STHeiti,Microsoft YaHei,Verdana,Arial,Tahoma,sans-serif;
}
.pic-preview-modal{
  .ivu-modal-header {
    border-bottom: none !important;
  }
  .ivu-modal-footer {
    border-top: none !important;
  }
}
</style>
<style lang='scss' scoped>
</style>
