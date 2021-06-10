<!--
 * @Author: 任智勇
 * @since: 2019-05-21 14:47:07
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-06 19:28:23
 -->
<template>
  <div class="header">
    <div class="imgDiv" :class="{'daq-no-photo': !data.siteLogo}">
      <img
        v-if="data.siteLogo"
        :src="data.siteLogo"
        :alt="data.name"
      >
      <img v-else src="@assets/image/site-default.png" :alt="data.name">
    </div>
    <div class="empInfo">
      <h3>{{data.name}}</h3>
      <p>
        <span class="type" v-if="data.belongtype">所属类型：
          <span>{{data.belongtype}}</span>
        </span>
        <span>所属行政区：{{data.regionName}}</span>
        <span class="codeBox" style="margin-left:100px;" v-if="!isCompany">
          <DropCode1
            :value="data.companyDomain"
            position="bottom"
            >
            <i class="cloud-icon leftIcon">&#xe812;</i>
            文旅企业端
            <i class="cloud-icon rightIcon">&#xe66f;</i>
          </DropCode1>
        </span>
        <span class="codeBox">
          <dropCode
            :id="'qrcodeh5Domain'"
            :value="`${data.h5Domain}/#/index`"
            position="bottom"
            >
            <i class="cloud-icon leftIcon">&#xe7e2;</i>
            H5用户端
            <i class="cloud-icon rightIcon">&#xe66f;</i>
          </dropCode>
        </span>
        <!-- <span class="codeBox">
          <dropCode
            :id="'qrcodeprogramDomain'"
            :value="data.programDomain"
            position="bottom"
            >
              <i class="cloud-icon leftIcon">&#xe6f0;</i> 
              小程序用户端
              <i class="cloud-icon rightIcon">&#xe66f;</i>
          </dropCode>
        </span> -->
      </p>
    </div>

    <div class="headerRight" v-if="!isCompany">
      <div class="leve">
        <h3>{{data.companyCount||0}}</h3>
        <p>上云文旅企业</p>
      </div>
      <div class="integral">
        <h3>{{data.smsNum||0}}</h3>
        <p>短信剩余条数</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component,Watch,Prop, Vue } from "vue-property-decorator";
import dropCode from "@components/DropCode/DropCode.vue";
import DropCode1 from "@components/DropCode/index.vue";
import { getSiteUserInfo } from "@service/common"
import { AppModule } from "@store/modules/app";

@Component({
  components: {
    dropCode,
    DropCode1
  }
})
export default class Header extends Vue {
  mounted(){
    this.getSiteUserInfo()
  }
  // 判断是否是 企业端
  isCompany = process.env.VUE_APP_STATUS === 'COMPANY';
  private data:any = {
    siteLogo:'',
    name:'',
    siteType:'',
    regionName:'',
    smsNum:0,
    companyCount:0,
    companyDomain: '',
    h5Domain: '',
    programDomain: '',
  }
  // 获取类型
  getTypeName (data: any) {
    let type = '';
    switch (process.env.VUE_APP_STATUS) {
      case 'COMPANY': {
        type = this.$store.state.app.userInfo.roleNames;
        break;
      }
      case 'SITE': {
        if (data.siteType && data.siteType.toLowerCase() === 'scenic') {
          type = '景区'
        }
        if (data.siteType && data.siteType.toLowerCase() === 'government') {
          type = '政府'
        }
        break;
      }
    }
    return type;
  }
  private getSiteUserInfo(){
    let _this = this;
    getSiteUserInfo({id: this.$store.state.app.userInfo.siteId}).then((res:any)=>{
      if(res.code===0){
        let data = res.data;
        data.belongtype = this.getTypeName(data);
        _this.data = data
        AppModule.setAppSiteInfo(data)
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.header {
  background-color: $bg01;
  height: 140px;
  padding: 20px 15px 20px 35px;
  border-radius: 3px;
  > div {
    float: left;
  }
  .imgDiv {
    width: 72px;
    height: 72px;
    margin-top:14px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .empInfo {
    margin-left: 15px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    h3 {
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      color: $font01;
    }
    p {
      height: 24px;
      line-height: 24px;
      .type{
        margin-right: 20px;
      }
    }
    .codeBox {
      position: relative;
      margin-left: 24px;
      cursor: pointer;
      line-height: 35px;
      display: inline-block;
      &:hover{
        .code-box{
          display: block;
        }
      }
      .code-box{
        position: absolute;
        left: -30%;
        top: 30px;
        display: none;
        min-height: 206px;
        min-width: 226px;
        overflow: auto;
        padding: 10px;
        background: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        .code-img{
          width: 110px;
          height: 110px;
          margin: 0 auto;
          img{
            width: 110px;
            height: 110px;
          }
        }
      }
    }
    .leftIcon {
      color: $theme;
    }
    .rightIcon {
      font-size: 10px;
    }
  }

  .headerRight {
    height: 100%;
    width: 250px;
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    .leve {
      border-right: 1px solid $borderLight;
    }
    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h3 {
        color: $theme;
        font-size: 24px;
      }
      p {
        color: $font04;
        font-size: 14px;
        height: 36px;
        line-height: 36px;
      }
    }
  }
}
</style>
