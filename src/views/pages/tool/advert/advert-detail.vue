<template>
  <div class="content">
    <div class="tips-panel clearfix">
      <span class="fl title">基本信息</span>
    </div>
    <!--tab切换-->
    <!--基础资料-->
    <Row class="item mt20" v-if="detail.createUserName">
      <Col span="4" class="label-name">创建者</Col>
      <Col span="20" class="item-content">{{detail.createUserName}}</Col>
    </Row>
    <Row class="item mt20">
      <Col span="4" class="label-name">广告名称</Col>
      <Col span="20" class="item-content">{{detail.name}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.publishChannel">
      <Col span="4" class="label-name">发布渠道</Col>
      <Col span="20" class="item-content">{{getPubChannelTxt(detail.publishChannel)}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.adPositionName">
      <Col span="4" class="label-name">所属广告位</Col>
      <Col span="20" class="item-content">{{detail.adPositionName}}</Col>
    </Row>
    <Row class="item mt20">
      <Col span="4" class="label-name">有效期</Col>
      <Col span="20" class="item-content">{{detail.startTime.substr(0,10)}} - {{detail.endTime.substr(0,10)}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.status">
      <Col span="4" class="label-name">状态</Col>
        <Col span="20" class="item-content">
        <span v-if="detail.status === 2">禁用</span>
        <span v-if="detail.status === 1">启用</span>
        </Col>
    </Row>
    <Row class="item mt20" v-if="detail.sort">
      <Col span="4" class="label-name">排序</Col>
      <Col span="20" class="item-content">{{detail.sort}}</Col>
    </Row>
    <div class="tips-panel clearfix mt20">
      <span class="fl title">图片信息</span>
    </div>
    <Row class="item mt20" v-if="detail.img && detail.img.length">
      <Col span="4" class="label-name">广告图</Col>
      <Col span="20" class="item-content">
        <p class="img daq-no-photo" v-for="(item,picIndex) in detail.img" :key="item.id">
          <img :src="item.url" alt class="daq-img" v-if="item.url" @click.stop="viewImage(detail.img,detail.name,picIndex)">
        </p>
      </Col>
    </Row>
    <Row class="item mg20">
      <Col span="24">
        <router-link :to="{path: '/advert-edit', query:{id: detail.id}}">
          <Button class="btn-cancel" type="primary" style='margin-left: 80px;'>修改</Button>
        </router-link>
        <Button class="ml20" @click="goHistory">返回</Button>
      </Col>
    </Row>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getAdDesc } from "@service/tool";
import {PreviewPics} from '@components/index';
@Component({
  components:{
    PreviewPics
  }
})
export default class AdvertDetail extends Vue {
  private detail: Object = {};
  private goHistory() {
    this.$router.go(-1);
  }
  mounted() {
    this.getAdDesc();
  }
  // 获取发布渠道
  getPubChannelTxt(txt: string){
    switch (txt) {
      case "MICRO_SITE": {
        return "微网站"
      }
      case "SMALL_PROGRAM": {
        return "小程序"
      }
      default:{
        return txt;
      }
    }
  }
  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private imgTitle: String = '';
  private currIndex = 0;
  private viewImage(url: any,name: String, index?: number) {
    // 判断url的类型 如果是数组 则直接赋值 如果不是数组 则先清空数组 再将url写到数组里面去
    if (Object.prototype.toString.call(url) === '[object Array]') {
      this.imgUrl = []
      url.map((item: any) => {
        this.imgUrl.push(item.url as any);
      });
    }
    if (Object.prototype.toString.call(url) === '[object String]') {
      this.imgUrl = []
      this.imgUrl.push(url)
    }
    this.imgTitle = name;
    this.visible = true;
    this.currIndex = index || 0
  }
  /* E 查看大图 */

  /* S 获取详情 */
  private getAdDesc() {
    getAdDesc({
      id: this.$route.query.id
    }).then((data:any) => {
      if(data.code === 0){
        this.detail = data.data;
      }
    });
  }
  /* E 获取详情 */
}
</script>

<style lang='scss' scoped>
.content{
  padding: 15px;
}
.tips-panel {
  background-color: $grayLight;
  padding: 15px;
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
</style>
