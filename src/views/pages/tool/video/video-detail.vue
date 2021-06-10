<template>
  <div class="pd20">
    <div class="tips-panel clearfix">
      <span class="fl title">基本信息</span>
    </div>
    <!--tab切换-->
    <!--基础资料-->
    <Row class="item mt20">
      <Col span="4" class="label-name">创建者</Col>
      <Col span="20" class="item-content">{{detail.data.createUserName}}</Col>
    </Row>
    <Row class="item mt20">
      <Col span="4" class="label-name">视频名称</Col>
      <Col span="20" class="item-content">{{detail.data.name}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.placeType">
      <Col span="4" class="label-name">场所类型</Col>
      <Col span="20" class="item-content">
        <span v-if="detail.data.placeType==='CONTENT_TYPE_VENUE'">场馆</span>
        <span v-if="detail.data.placeType==='CONTENT_TYPE_SCENERY'">景区</span>
        <span v-if="detail.data.placeType==='CONTENT_TYPE_HOTEL'">酒店</span>
        <span v-if="detail.data.placeType==='CONTENT_TYPE_RESTAURANT'">餐饮</span>
        <span v-if="detail.data.placeType==='CONTENT_TYPE_TOILET'">厕所</span>
        <span v-if="detail.data.placeType==='CONTENT_TYPE_PARKING'">停车场</span>
        <span v-if="detail.data.placeType==='CONTENT'">停车内容场</span>
      </Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.placeName">
      <Col span="4" class="label-name">所属场所</Col>
      <Col span="20" class="item-content">{{detail.data.placeName}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.duration">
      <Col span="4" class="label-name">视频时长</Col>
      <Col span="20" class="item-content">{{detail.data.duration}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.website">
      <Col span="4" class="label-name">视频网址</Col>
      <Col span="20" class="item-content">{{detail.data.website}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.description">
      <Col span="4" class="label-name">视频描述</Col>
      <Col span="20" class="item-content">{{detail.data.description}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.tags">
      <Col span="4" class="label-name">视频标签</Col>
      <Col span="20" class="item-content">
        <p
        class="fl tags-box"
        v-for="items in detail.tags"
        :key="items"
        >
            <span class="choice-tag active" v-if="items">{{items}}</span>
        </p>
      </Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.status">
      <Col span="4" class="label-name">状态</Col>
        <Col span="20" class="item-content">
        <span v-if="detail.data.status === 2">禁用</span>
        <span v-if="detail.data.status === 1">启用</span>
        </Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.sort">
      <Col span="4" class="label-name">排序</Col>
      <Col span="20" class="item-content">{{detail.data.sort}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.data.recommend">
      <Col span="4" class="label-name">推荐</Col>
      <Col span="20" class="item-content">
        <span v-if="detail.data.recommend === 0">未推荐</span>
        <span v-else-if="detail.data.recommend === 1">已推荐</span>
      </Col>
    </Row>
    <div class="tips-panel clearfix mt20">
      <span class="fl title">视频信息</span>
    </div>
    <Row class="item mt20" v-if="detail.data.url">
      <Col span="4" class="label-name">视频</Col>
      <Col span="20" class="item-content">
        <div
            class="img-cover img view-images-box"
            :class="{'daq-no-photo': !detail.data.imgUrl}"
            v-if="detail.data.name"
            @click.stop="openVideo(detail.data)"
            >
                <span class="cover"></span>
                <img :src="detail.data.imgUrl" alt v-if="detail.data.imgUrl" class="daq-img">
            </div>
        <!-- <p class="img daq-no-photo" v-for="item in detail.img" :key="item.id">
          <img :src="item.url" alt class="daq-img">
        </p> -->
      </Col>
    </Row>
    <Row class="item mg20">
      <Col span="24">
        <router-link :to="{path: '/video-edit', query:{id: detail.data.id}}">
          <Button class="btn-cance" type="primary" style="margin-left: 80px;">修改</Button>
        </router-link>
        <Button class="ml20" @click="goHistory">返回</Button>
      </Col>
    </Row>
    <!-- 视频播放 -->
    <VideoPlayer :showVideo="showVideoFun" @closePop="closePop" :show="showVideo" v-if="showVideoFun.url"></VideoPlayer>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import { getVideoInfo , getResourceByType } from "@service/tool";
import {getSiteAuditList} from '@service/cloud-manage';
import { AppModule } from "@store/modules/app";
interface videoType {
  url: String;
  image: String;
  title: String;
};
@Component({
    components: {
        VideoPlayer
    }
})
export default class VideoDetail extends Vue {
    private detail: any = {
        data:{},
        tags:{}
    }
    private goHistory() {
        this.$router.go(-1);
    }
    mounted() {
        this.getVideoInfo();
    }  
    // 获取当前站点
    get currSite () {
      if (AppModule.siteList) {
      return AppModule.siteList[AppModule.currSiteIndex]
      } else {
      return {}
      }
    }
    //   获取视频详情
    private getVideoInfo() {
        getVideoInfo({
        id: this.$route.query.id
        }).then(data => {
          if(data.data.res.orgId === -1){
            data.data.res.createUserName = this.currSite.name;
          }
          this.detail.data = data.data.res;
          this.detail.tags = data.data.label
        });
    }
    /* S 视频播放 */
    private showVideo: Boolean = false;
    private showVideoFun: videoType = {
        url: "",
        image: "",
        title: "",
    };
    private closePop(){
      this.showVideoFun.url = '';
      this.showVideoFun.image = '';
      this.showVideoFun.title = '';
      this.showVideo = false;
    }
    private openVideo(item: any) {
        this.showVideoFun.url = item.url;
        this.showVideoFun.image = item.imgUrl;
        this.showVideoFun.title = item.name;
        this.showVideo = true;
    }
    /* E 视频播放 */
}
</script>

<style lang='scss' scoped>
.tips-panel {
  margin-top: 10px;
  background-color: $grayLight;
  padding: 20px;
  .title {
    position: relative;
    padding-left: 10px;
    color: $font01;
    font-weight: 600;
    font-size: 16px;
    &:after {
      position: absolute;
      left: 0;
      top: 4px;
      content: "";
      width: 3px;
      height: 16px;
      border-radius: 1.5px;
      background-color: $theme;
    }
  }
  .tag-content {
    margin-left: 30px;
    color: $font02;
  }
}
.label-name {
  width: 100px;
  line-height: 25px;
  padding-right: 10px;
  vertical-align: middle;
  text-align: right;
  color: $font01;
  font-weight: 600;
}
.item-content {
  width: 80%;
  line-height: 25px;
  color: $font05;
  .img {
    position: relative;
    display: inline-block;
    width: 240px;
    height: 160px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
    & + .img {
      margin-left: 5px;
    }
  }
  &.simulate {
    p {
      display: inline-block;
      & + p {
        margin-left: 20px;
      }
    }
    .count {
      margin-left: 3px;
      width: 200px;
      text-align: left;
    }
  }
}
.cover{
    display: block !important;
}
</style>
