<template>
  <div class="wechat">
    <p class="title">绑定微信公众号，把平台和微信打通</p>
    <p class="txt">绑定后即可在这里管理你的公众号，文化旅游云提供比微信官方后台更强大的功能</p>
    <a href="javascript:void(0);" class="btn" @click="auth">
      <i class="cloud-icon">&#xe629;</i>
      <span>已有公众号，立即绑定</span>
    </a>
    <p class="txt">
      没有公众号，请在
      <a href="https://mp.weixin.qq.com/?token=&lang=zh_CN" target="_blank">微信公众平台</a>申请新的公众号，成功后再进行绑定
    </p>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch} from "vue-property-decorator";
import { ModalConfig} from "iview/types";

interface AuthDataType {
  authStatus: number;
  componentAppid: string;
  preAuthCode:string;
  redirectUri: string;
  authType: number;
  headImg: string;
  funcInfoList: Array<string>;
  nickName: string;
  verifyServiceTypeInfo: string;
  qrcodeUrl: string;
  url: string;
};

@Component
export default class NoAuthrized extends Vue {
  @Prop() readonly value!:AuthDataType;
  private data = {};
  @Watch("value", { immediate: true, deep: true })
  onValueChange (val: AuthDataType) {
    this.data = val
  }
  // 微信授权
  private auth () {
    let config: ModalConfig = {
      title: "微信授权",
      content: `请在新打开的页面中使用微信扫描并授权`,
      okText: "已授权",
      cancelText: "取消",
      onOk: () => {
        this.$parent.getData()
      }
    };
    this.$parent.auth();
    this.$Modal.confirm(config);
  }
  created () {
    this.data = this.value
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
