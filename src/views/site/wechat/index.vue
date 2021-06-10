<template>
  <div class="wechat-wrapper">
    <div v-if="authStatus === 0">
      <NoAuthrized v-model="data" />
    </div>
    <div v-if="authStatus === 1">
      <Authorized v-model="data"  />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import {getWechatAuthData} from '@service/app';
import { AppModule } from "@store/modules/app";

import NoAuthrized from './no-authrized.vue';
import Authorized from './authorized.vue'


@Component({
  components: {
    NoAuthrized,
    Authorized
  }
})
export default class Wechat extends Vue {
  private authStatus = -1;
  private data = {
    authStatus: 0,
    componentAppid: '',
    preAuthCode: '',
    redirectUri: '',
    authType: 3, // 是否已经授权 0 为未授权 1 为已授权
    headImg: '',
    funcInfoList: [],
    nickName: '',
    verifyServiceTypeInfo: '',
    qrcodeUrl: '',
    url: '',
  };
  /**
   * getData 获取数据
   * @params flag {boolean} true: 提示更新授权 false: 仅仅是第一次获取数据
   */
  getData (flag?:boolean) {
    AppModule.setAppFixedLoadingStatus(true)
    getWechatAuthData().then(res => {
      AppModule.setAppFixedLoadingStatus(false)
      if (res.code === 0) {
        this.authStatus = res.data.authStatus as number;
        this.data = res.data
        if (flag) {
          this.$Message.success(`更新授权成功！`);
        }
      }
    }).catch(err => {
      AppModule.setAppFixedLoadingStatus(false)
    })
  }
  // 进行授权
  private auth () {
    let {url} = this.data as any
    let token = this.$store.state.app.token
    let backUrl = encodeURIComponent(window.location.href)
    // window.location.href = `${url}?token=${token}&backUrl=${backUrl}`
    window.open(`${url}?token=${token}&backUrl=${backUrl}`, '_blank')
  }
  created () {
    this.getData()
  }
}
</script>

<style lang='scss' scoped>
.wechat-wrapper {
  min-height: calc(100vh - 142px);
}
.wechat {
  padding: 40px 60px;
  .title {
    padding-bottom: 10px;
    font-size: 18px;
  }
  .txt {
    width: 330px;
    font-size: 14px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    height: 54px;
    padding: 0 20px;
    margin: 10px 0 20px;
    border: 1px solid $theme;
    font-size: 0;
    span {
      font-size: 16px;
    }
    .cloud-icon {
      margin-right: 10px;
      font-size: 30px;
    }
  }
}
</style>
