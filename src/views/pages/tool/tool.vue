<template>
  <div class="container">
    <!-- 文化工具 -->
    <div v-if="toolMenu.includes('志愿者') || toolMenu.includes('文化社团')">
      <p class="title-tool">
        <i class="cloud-icon">&#xe697;</i> 文化工具
      </p>
      <div class="ActivityType clearfix">
        <div class="items" v-if="toolMenu.includes('志愿者')">
          <router-link to="/volunteers-view">
            <img src="@/assets/image/tool-1-1.jpg" />
            <div>
              <p class="saleTitles">志愿者</p>
              <p>管理所有志愿者与志愿者社团</p>
            </div>
          </router-link>
        </div>
        <div class="items ml20" v-if="toolMenu.includes('文化社团')">
          <router-link to="/community-profile">
            <img src="@/assets/image/tool-1-2.jpg" />
            <div>
              <p class="saleTitles">文化社团</p>
              <p>管理各类文化社团资源</p>
            </div>
          </router-link>
        </div>
        <!--<div class="items ml20" v-show="!isCompany">-->
        <!--<router-link to="">-->
        <!--<img src="@/assets/image/tool-1-3.jpg">-->
        <!--<div >-->
        <!--<p class="saleTitles">非遗管理</p>-->
        <!--<p>管理非物资文化遗产与非物质文化传承人</p>-->
        <!--</div>-->
        <!--</router-link>-->
        <!--</div>-->
      </div>
    </div>
    <!-- 运营工具 -->
    <p class="title-tool mt20">
      <i class="cloud-icon">&#xe697;</i> 运营工具
    </p>
    <div class="ActivityType clearfix">
      <div class="items mr20 mb20" v-show="!isCompany">
        <router-link :to="{path:'/advert-list'}">
          <img src="@/assets/image/adv-list.jpg" />
          <div>
            <p class="saleTitles">广告管理</p>
            <p>传播品牌形象，引导用户精准体验</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20" v-show="!isCompany">
        <router-link :to="{path:'/tips-list'}">
          <img src="@/assets/image/tips-list.jpg" />
          <div>
            <p class="saleTitles">文化小贴士</p>
            <p>一句话讲述文化，传播文化</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20" v-if="toolMenu.includes('电子消费码核销')">
        <router-link :to="{path:'/order-verification'}">
          <img src="@/assets/image/code-list.jpg" />
          <div>
            <p class="saleTitles">电子消费码核销</p>
            <p>扫码核销用户电子消费码</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20" v-if="toolMenu.includes('标签管理')">
        <router-link :to="{path:'/content-tags'}">
          <img src="@/assets/image/review-list.jpg" />
          <div>
            <p class="saleTitles">标签管理</p>
            <p>管理所有自添加的标签</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20">
        <router-link :to="{path:'/verification-app'}">
          <img src="@/assets/image/code-list2.jpg" />
          <div>
            <p class="saleTitles">核销装备</p>
            <p>集分销系统、小电商、文旅云于一体的核销APP</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20" v-if="toolMenu.includes('导游导览')">
        <router-link :to="{path:'/tourguide-list'}">
          <img src="@/assets/image/daoyoudaolan.jpg" />
          <div>
            <p class="saleTitles">导游导览</p>
            <p>管理所有景区导览资源</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20" v-if="toolMenu.includes('上学堂')">
        <router-link :to="{path:'/course-list'}">
          <img src="@/assets/image/study.jpg" />
          <div>
            <p class="saleTitles">上学堂</p>
            <p>学文化，精华内容</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20" v-if="isSite && toolMenu.includes('智能行程')">
        <router-link :to="{path:'/itinerary-list'}">
          <img src="http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1583399576425/智能行程.jpg" />
          <div>
            <p class="saleTitles">智能行程</p>
            <p>个人行程，身随心动，想去哪就去哪</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20" v-if="isSite">
        <router-link :to="{path:'/robot-setting'}">
          <img src="@/assets/image/tool-ques-answer.jpg" />
          <div>
            <p class="saleTitles">智能问答</p>
            <p>客服机器人，自主学习，金牌服务永不离线</p>
          </div>
        </router-link>
      </div>
      <div class="items mr20 mb20" v-if="isSite">
        <router-link :to="{path:'/content-analysis'}">
          <img src="@/assets/image/analysis.jpg" />
          <div>
            <p class="saleTitles">数据分析</p>
            <p>数据洞察，精确运营</p>
          </div>
        </router-link>
      </div>
    </div>
    <!-- 管理工具 -->
    <div v-if="!isCompany&&(toolMenu.includes('产品内测')||toolMenu.includes('视频管理')||toolMenu.includes('音频管理')||toolMenu.includes('图库管理'))">
      <p class="title-tool mt20">
        <i class="cloud-icon">&#xe697;</i> 管理工具
      </p>
      <div class="ActivityType clearfix">
        <div class="items" v-if="toolMenu.includes('产品内测')">
          <router-link :to="{path:'/private-index'}">
            <img src="@/assets/image/product-private.jpg" />
            <div>
              <p class="saleTitles">产品内测</p>
              <p>产品体验先人一步</p>
            </div>
          </router-link>
        </div>
        <div class="items ml20"  v-if="toolMenu.includes('视频管理')">
          <router-link :to="{path:'/video-list'}">
            <img src="@/assets/image/video-list.jpg" />
            <div>
              <p class="saleTitles">视频管理</p>
              <p>管理所有视频资源</p>
            </div>
          </router-link>
        </div>
        <div class="items ml20"   v-if="toolMenu.includes('音频管理')">
          <router-link :to="{path:'/audio-list'}">
            <img src="@/assets/image/audio-list.jpg" />
            <div>
              <p class="saleTitles">音频管理</p>
              <p>管理所有音频资源</p>
            </div>
          </router-link>
        </div>
        <div class="items ml20"   v-if="toolMenu.includes('图库管理')">
          <router-link :to="{path:'/pic-list'}">
            <img src="@/assets/image/pic-list.jpg" />
            <div>
              <p class="saleTitles">图库管理</p>
              <p>管理所有图片资源</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

import { AppModule } from "@store/modules/app";

@Component({ components: {} })
export default class Tool extends Vue {
  // 判断是否是站点端
  isSite = process.env.VUE_APP_STATUS === "SITE";
  private isCompany: boolean = false; //判断是否是站点端
  get toolMenu() {
    return AppModule.nav
      .filter((e: any) => e.name === "工具")[0]
      .child.map((e: any) => e.name);
  }
  mounted() {
    this.isCompany = this.$store.state.app.userInfo.dataType === "COMPANY";
    // console.log(this.isCompany)
  }
}
</script>

<style lang='scss' scoped>
.mb20 {
  margin-bottom: 20px;
}
.mr20 {
  margin-right: 20px;
}
.container {
  padding: 15px;
  .title-tool {
    position: relative;
    width: 100%;
    line-height: 16px;
    font-size: 14px;
    font-weight: bold;
    padding-left: 10px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #dedede;
    i {
      position: absolute;
      top: 0;
      left: -8px;
      font-size: 20px;
      color: $theme;
    }
  }
  //运营工具
  .ActivityType {
    max-width: 1270px;
    .items {
      float: left;
      width: 293px;
      //   min-height: 261px;
      background: $bg01;
      border: 1px solid $borderLight;
      border-radius: 5px;
      padding: 10px;
      cursor: pointer;
      position: relative;
      &:hover {
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1),
          -5px 0 10px rgba(0, 0, 0, 0.1);
      }
      img {
        display: block;
        width: 271px;
        height: 152px;
        border-radius: 5px;
      }
      div {
        .saleTitles {
          color: $font01;
          font-size: 14px;
          margin-top: 10px;
        }
        p {
          padding: 0;
          margin: 0;
          font-size: $f12;
          color: $font03;
          line-height: 22px;
          text-align: center;
        }
      }
    }
  }
}
</style>
