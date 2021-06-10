<!--
 * @Author: Hexg
 * @Date: 2019-07-11 14:54:36
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-25 10:09:29
 -->
<template>
  <div class="login">
    <div class="floor"></div>
    <div v-if="!siteLogo" class="logo"></div>
    <div v-else class="logo-custom">
      <img :src="siteLogo" alt="">
    </div>
    <div class="content">
      <div class="pic">
        <p class="pic-tit">{{siteName}}</p>
        <p class="txt">集公共文化旅游事业和文旅产业管理、展示、推广、交易为一体的综合服务平台。</p>
      </div>
      <div class="logDiv">
        <transition name="route">
          <div class="login-box" v-if="!foregot">
            <p class="tit">{{getTilte()}}</p>
            <Form v-model="params">
              <FormItem>
                <Input type="text" class="ipt" placeholder="请输入手机号码" v-model="params.username" @keyup.enter.native="doLogin">
                  <i class="cloud-icon" slot="prefix">&#xe701;</i>
                </Input>
              </FormItem>
              <FormItem>
                <Input type="password" class="ipt" placeholder="请输入密码" v-model="password" @keyup.enter.native="doLogin">
                  <i class="cloud-icon" slot="prefix">&#xe6fe;</i>
                </Input>
              </FormItem>
              <FormItem v-if="codeShow">
                <div class="inline">
                  <Input type="text" class="ipt code-ipt" placeholder="请输入验证码" v-model="params.code" @keyup.enter="doLogin">
                    <i class="cloud-icon" slot="prefix">&#xe700;</i>
                  </Input>
                  <Tooltip content="换一换" placement="top" class="code-btn">
                  <img
                    :src="codeImg"
                    alt
                    @click="getValidCodeImage"
                  >
                </Tooltip>
                </div>
              </FormItem>
              <FormItem>
                <Button type="primary" size="large" long @click="doLogin" @keyup.enter="doLogin">登录</Button>
                <p class="foregot"><span @click="foregot = true">忘记密码?</span></p>
              </FormItem>
            </Form>
          </div>
        </transition>
        <transition name="route">
          <div class="login-box" v-if="foregot">
            <p class="tit">忘记密码</p>
            <Form v-model="modifyParams">
              <FormItem>
                <Input type="text" class="ipt" @on-keypress="phoneChange" @on-blur="phoneChange" placeholder="请输入用户名" v-model="modifyParams.phone" @keyup.enter.native="modifyPass">
                  <i class=" cloud-icon" slot="prefix">&#xe701;</i>
                </Input>
              </FormItem>
              <FormItem>
                <Input type="text" class="ipt code-ipt" placeholder="请输入短信验证码" v-model="modifyParams.code" @keyup.enter.native="modifyPass">
                  <Button slot="append" class="sendMsg" v-if="!sendSuc" @click="sendMsg">获取验证码</Button>
                  <Button slot="append" class="sendMsg" :disabled="sendDisabled" v-else>{{timer}} s</Button>
                </Input>
              </FormItem>
              <FormItem>
                <Input type="password" class="ipt" placeholder="请输入新密码" v-model="newPwd" @keyup.enter.native="modifyPass">
                  <i class="cloud-icon" slot="prefix">&#xe6fe;</i>
                </Input>
              </FormItem>
              <FormItem>
                <Button type="primary" size="large" long @click="modifyPass" @keyup.enter="modifyPass">确定</Button>
                <p class="foregot"><span @click="foregot = false">返回登录</span></p>
              </FormItem>
            </Form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { LoginParams, login, forgetPassword, sendPhoneMsg, getValidCodeImage, getSiteInfoBySiteCode} from "@service/app";
import { AppModule } from "@store/modules/app";
import {Encrypt} from '@util/aes'

@Component
export default class Login extends Vue {
  private codeShow = false  // 验证码是否展示
  private foregot = false  // 是否忘记密码
  private codeImg = ''
  private params = {
    username:'',
    password:'',
    code: '',
    loginSource: process.env.VUE_APP_STATUS
  };
  private modifyParams = {
    phone:'',
    code: '',
    newPwd:''
  }
  private password = '';
  @Watch('password')
  onPassWordChange (val: string) {
    this.params.password = Encrypt(val)
  }
  // 新密码
  private newPwd = '';
  @Watch('newPwd')
  onNewPwdChange (val: string) {
    this.modifyParams.newPwd = Encrypt(val)
  }
  get token() {
    return AppModule.token
  }
  // 获取标题
  getTilte () {
    let title = ''
    if (process.env.VUE_APP_STATUS === 'CLOUD') {
      title = '欢迎登录 - 云管理端'
    }
    if (process.env.VUE_APP_STATUS === 'COMPANY') {
      title = '文旅企业登录'
    }
    return title;
  }
  getValidCodeImage () {
    getValidCodeImage({type:'login', unique: this.params.username}).then(res => {
      this.codeShow = true
      // @ts-ignore
      this.codeImg = 'data:image/png;base64,' + btoa( new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), '') )
    })
  }
  private doLogin () {
    let {codeShow} = this;
    let {username, password, code} = this.params
    if (!username.length || !password.length) {
      this.$Message.error('请完善登录信息');
      return false
    }
    if (codeShow && !code.length) {
      this.$Message.error('请输入验证码');
      return false
    }
    AppModule.appLogout()
    login(this.params)
      .then(res => {
      if (res.code  === 0) {
        // this.$cookies.set(`${process.env.VUE_APP_STATUS}_TOKEN`, res.data.token)
        AppModule.setAppToken(res.data.token)
        let redirect = this.$route.query.redirect as string
        if (redirect) {
            this.$router.replace(redirect)
          } else {
            this.$router.replace({path: '/'})
          }
      } else if(res.code === 3) {
        if (this.codeShow === false) {
          this.$Message.error('请输入验证码');
        } else {
          this.$Message.error(res.message)
        }
        this.getValidCodeImage()
      }
    });
  }
  // 修改密码
  private modifyPass () {
    let {phone, newPwd, code} = this.modifyParams
    if (!phone.length || !newPwd.length) {
      this.$Message.error('请完善登录信息');
      return false
    }
    if (!code.length) {
      this.$Message.error('请输入验证码');
      return false
    }
    forgetPassword(this.modifyParams).then((res:any)=>{
      if(res.code === 0){
        this.$Message.success('修改成功');
        this.foregot = false;
      }
    })
  }
  private sendSuc = false; // 是否已发送验证码
  private timer = 60; // 验证码倒计时
  private sendDisabled = false; // 发送按钮是否可用
  // 发送验证码
  private sendMsg(){
    let phone = this.modifyParams.phone;
    let _this = this;
    if (phone.length !== 11) {
      this.$Message.error('请正确输入手机号');
      return false
    }
    // 设置点击间隔2s
    this.sendDisabled = true;
    setTimeout(() => {
      _this.sendDisabled = false;
    }, 2000);
    sendPhoneMsg({phone: phone, type: 'SEND_SMS_FORGET_PASSWORD'}).then((res:any)=>{
      if(res.code===0){
        this.$Message.success('发送成功');
        this.setTimer()
      }
    })
  }
  // 设置短信倒计时
  private setTimer(){
    let _this = this;
    if(this.timer > 1){
      this.sendSuc = true;
      this.timer--;
      setTimeout(() => {
        _this.setTimer()
      }, 1000);
    } else {
      this.sendSuc = false;
      this.timer = 60;
    }
  }
  private phoneChange(){
    this.modifyParams.phone = this.modifyParams.phone.replace(/[^\d]/g,'');
  }
  siteLogo = '';
  siteName = '文化旅游云'
  created () {
    // 是企业端 获取对应站点的logo
    if (process.env.VUE_APP_STATUS === 'COMPANY') {
      getSiteInfoBySiteCode().then(res => {
        if (res.code === 0) {
          this.siteLogo = res.data.siteLogo
          this.siteName = res.data.name
          let link = (document.querySelector("link[rel*='icon']") || document.createElement('link') )as HTMLLinkElement;
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          let href = 'http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1582805002396/favicon.ico';
          link.href = res.data.siteLogo;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login-box {
  .ivu-input {
    height: 40px;
  }
  .ivu-input-prefix i {
    line-height: 40px;
  }
  .ivu-btn{
    height:40px;
  }
}
</style>

<style lang='scss' scoped>
.route-enter-active, .route-leave-active {
  transition: all .8s;
}
.route-enter, .route-leave-to{
  opacity: 0;
  transform: rotateY(180deg);
}
.login {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url(../../assets/image/login-bg.jpg) no-repeat center top;
  background-size: 1920px 1080px;
  .floor {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url(../../assets/image/login-floor.png) no-repeat center top;
    background-size: 1920px 1080px;
  }
  .logo {
    position: absolute;
    left: 76px;
    top: 38px;
    width: 170px;
    height: 43px;
    background: url(../../assets/image/login-logo.png) no-repeat center center;
    background-size: 170px 43px;
  }
  .logo-custom{
    position: absolute;
    left: 76px;
    top: 38px;
    height: 50px;
    width: auto;
    img{
      height: 100%;
      width: auto;
    }
  }
  .content {
    position: absolute;
    top: 230px;
    left: 50%;
    max-width: 1366px;
    width: 100%;
    padding:0 30px;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    box-sizing:border-box;
  }
  .pic {
    height: 540px;
    padding-left:404px;
    color:#fff;
    font-size:38px;
    width: calc(100% - 405px);
    &-tit{
      padding-top:12px;
      line-height:80px;
    }
    .txt{
      font-size:18px;
      line-height:28px;
    }
  }
  .login-box {
    width: 400px;
    padding: 40px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 10px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 11px 14px 0px rgba(0, 67, 161, 0.2);
  }
  .tit {
    padding-bottom: 24px;
    text-align: center;
    font-size: 22px;
    font-family: "Microsoft Yahei";
  }
  .inline{
    display:flex;
    flex-wrap:nowrap;
  }
  .code-btn{
    margin-left:12px;
    max-width:100px;
    height: 38px;
    cursor:pointer;
    img{
      height: 38px;
      width:auto;
    }
  }
  .code-ipt{
    flex:1;
  }
}
.logDiv{
  position: absolute;
  top: 0;
  right: 420px;
}
.sendMsg{
  width: 100px;
}
.foregot{
  text-align: center;
  margin-top: 10px;
  span:hover{
    cursor: pointer;
    color: $theme;
  }
}
</style>
