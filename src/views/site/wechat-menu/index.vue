<template>
  <div>
    <div v-if="authStatus === 0">
      <NoAuthrized v-model="data" />
    </div>
    <div v-if="authStatus === 1">
      <Authorized v-model="data.nickName"/>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getWechatAuthData } from "@service/app";
import { AppModule } from "@store/modules/app";

import NoAuthrized from "@views/site/wechat/no-authrized.vue";
import Authorized from "./authorized.vue";

@Component({
  components: { NoAuthrized, Authorized }
})
export default class WechatMenu extends Vue {
  private authStatus = -1;
  private data = {
    authStatus: 0,
    componentAppid: "",
    preAuthCode: "",
    redirectUri: "",
    authType: 3, // 是否已经授权 0 为未授权 1 为已授权
    headImg: "",
    funcInfoList: [],
    nickName: "",
    verifyServiceTypeInfo: "",
    qrcodeUrl: ""
  };
  private auth () {
    let {url} = this.data as any
    let token = this.$store.state.app.token
    let backUrl = encodeURIComponent(window.location.href)
    // window.location.href = `${url}?token=${token}&backUrl=${backUrl}`
    window.open(`${url}?token=${token}&backUrl=${backUrl}`, '_blank')
  }
  created() {
    AppModule.setAppFixedLoadingStatus(true);
    getWechatAuthData()
      .then(res => {
        AppModule.setAppFixedLoadingStatus(false);
        if (res.code === 0) {
          this.authStatus = res.data.authStatus as number;
          this.data = res.data;
        }
      })
      .catch(err => {
        AppModule.setAppFixedLoadingStatus(false);
      });
  }
}
</script>

<style lang='scss' scoped></style>
