<template>
  <div class="authorized">
    <div class="item info">
      <div class="left">
        <div class="head-img">
          <img :src="data.headImg" :alt="data.nickName">
        </div>
      </div>
      <div class="right info-right">
        <p class="nickname">{{data.nickName}}</p>
        <p class="verify-txt">{{data.verifyServiceTypeInfo}}</p>
        <div class="btns">
          <Button class="btn" @click="update">更新授权</Button>
          <Button class="btn" @click="unAuthorized">取消授权</Button>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="left">已授权权限</div>
      <div class="right permissions">
        <p class="permission" v-for="fun in data.funcInfoList" :key="fun">{{fun}}</p>
      </div>
    </div>
    <!-- 产品要求这个隐藏 -->
    <!-- <div class="qrcode">
      <img :src="data.qrcodeUrl" alt="">
    </div> -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';
import {unAuthorized} from '@service/app';
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
};

@Component
export default class Authorized extends Vue {
  @Prop() readonly value!:AuthDataType;
  private data = {};
  @Watch("value", { immediate: true, deep: true })
  onValueChange (val: AuthDataType) {
    this.data = val
  }
  // 更新授权
  update () {
    this.$parent.auth();
  }
  /**
   * unAuthorized 弹窗提示用户前往微信公众平台操作取消授权
   */
  private unAuthorized () {
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否取消当前公众号对本站点的授权?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        // window.open("https://mp.weixin.qq.com/", '_blank');
        unAuthorized().then(res => {
          if(res.code === 0) {
            this.$Message.success('取消授权成功');
            this.$parent.getData();
          }
        })
      }
    };
    this.$Modal.confirm(config);
  }
}
</script>

<style lang='scss' scoped>
.authorized{
  padding: 40px;
  position:relative;
  .item{
    display:flex;
    margin-bottom:30px;
    .left{
      min-width:100px;
      width:100px;
      font-size:14px;
    }
    .head-img{
      width:80px;
      height:80px;
      border-radius:50%;
      overflow:hidden;
      font-size:0;
      img{
        width:80px;
        height:80px;
      }
    }
    .nickname{
      font-size:16px;
    }
    .verify-txt{
      padding:5px;
    }
    .btns{
      .btn{
        margin-right: 16px;
      }
    }
  }
  .qrcode{
    position:absolute;
    top:40px;
    right:40px;
    width:100px;
    height:100px;
    img{
      width:100px;
      height:100px;
    }
  }
}
</style>
