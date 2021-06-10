<template>
  <div class="detail-wrap">
    <!--审核结果-->
    <auditHead :data="headData" v-if="headData.status"></auditHead>
    <!--tab切换-->
    <Tabs active-key="key2" class="tab-wrap" :animated="false">
      <!--基础资料-->
      <Tab-pane label="基本资料" key="key1">
        <Row class="item mt20">
          <Col span="4" class="label-name">酒店名称</Col>
          <Col span="20" class="item-content">{{desc.name}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">酒店等级</Col>
          <Col span="20" class="btn-list" v-if="desc.level">
            <span class="choice-tag active" v-for="item in desc.level.split(',')">{{item}}</span>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">所在地区</Col>
          <Col span="20" class="item-content">{{desc.region}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">详细地址</Col>
          <Col span="20" class="item-content">{{desc.address}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.checkInTime">
          <Col span="4" class="label-name">入住时间</Col>
          <Col span="20" class="item-content">{{desc.checkInTime}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.checkOutTime">
          <Col span="4" class="label-name">离店时间</Col>
          <Col span="20" class="item-content">{{desc.checkOutTime}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.phone">
          <Col span="4" class="label-name">服务电话</Col>
          <Col span="20" class="item-content">{{desc.phone}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.openYear">
          <Col span="4" class="label-name">开业时间</Col>
          <Col span="20" class="item-content">{{desc.openYear}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.decorationTime">
          <Col span="4" class="label-name">最近装修</Col>
          <Col span="20" class="item-content">{{desc.decorationTime}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.roomNum">
          <Col span="4" class="label-name">房间数</Col>
          <Col span="20" class="item-content">{{desc.roomNum}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.resourceCode">
          <Col span="4" class="label-name">资源互通编码</Col>
          <Col span="20" class="item-content">{{desc.resourceCode}}</Col>
        </Row>
        <!--个性标签-->
        <div class="tips-panel clearfix">
          <span class="fl title">个性标签</span>
          <p class="fl tag-content">真实的选择个性信息，让游客更好了解酒店。</p>
        </div>
        <Row class="item mt20" v-if="desc.hotelEqtTag">
          <Col span="4" class="label-name">酒店设施</Col>
          <Col span="20" class="btn-list">
            <span
              class="choice-tag active"
              v-for="(item,index) in tagList.eqtTagList"
              :key="index"
            >{{item.labelName}}</span>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.type">
          <Col span="4" class="label-name">酒店类型</Col>
          <Col span="20" class="btn-list">
            <span
              class="choice-tag active"
              v-for="(item,index) in tagList.hotelTypeList"
              :key="index"
            >{{item.labelName}}</span>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.feature">
          <Col span="4" class="label-name">特色服务</Col>
          <Col span="20" class="btn-list">
            <span
              class="choice-tag active"
              v-if="desc.feature.split(',').indexOf(item.id.toString())>-1"
              v-for="(item,index) in tagList.featureList"
              :key="index"
            >{{item.labelName}}</span>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.longitude && desc.latitude">
          <Col span="4" class="label-name">酒店位置</Col>
          <Col span="20" class="map">
            <descMap id="map1" :longitude="desc.longitude" :latitude="desc.latitude"></descMap>
          </Col>
        </Row>
      </Tab-pane>
      <!--酒店介绍-->
      <Tab-pane label="酒店介绍" key="key2" class="item">
        <Row class="item mt20" v-if="desc.images">
          <Col span="4" class="label-name">酒店图片</Col>
          <Col span="22" class="item-content img-list">
            <p class="img" v-for="(item,index) in desc.images.split(',')" :key="index">
              <img @click="previewPic(index)" :src="item" alt />
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.audio">
          <Col span="4" class="label-name">语音介绍</Col>
          <Col span="22" class="item-content img-list">
            <uploadAudio :defaultAudio="desc.audio" :readonly="true"></uploadAudio>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.video">
          <Col span="4" class="label-name">视频</Col>
          <Col span="22" class="item-content img-list">
            <p class="img daq-no-photo view-images-box" @click="openVideo">
              <span class="cover"></span>
              <img :src="desc.videoCover" alt v-if="desc.videoCover" class="daq-img" />
            </p>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">720全景</Col>
          <Col span="20" class="item-content">
            <a class :href="desc.panoramaUrl" target="_blank">{{desc.panoramaUrl}}</a>
          </Col>
        </Row>
         <Row class="item mt20" v-if="desc.officialUrl">
          <Col span="4" class="label-name">公众号二维码</Col>
          <Col span="22" class="item-content img-list">
            <p class="img" >
              <img :src="desc.officialUrl" alt @click.stop="viewImage(desc.officialUrl.split(','), 0)" />
            </p>
          </Col>
        </Row>
         <Row class="item mt20" v-if="desc.officialName">
          <Col span="4" class="label-name">公众号名称</Col>
          <Col span="20" class="item-content">{{desc.officialName}}</Col>
        </Row>
         <Row class="item mt20" v-if="desc.websiteUrl">
          <Col span="4" class="label-name">官网地址</Col>
          <Col span="20" class="item-content">{{desc.websiteUrl}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">酒店概述</Col>
          <Col span="20" class="item-content">{{desc.briefing}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">酒店简介</Col>
          <Col span="20" class="item-content">{{desc.summary}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">酒店介绍</Col>
          <Col span="20" class="item-content" v-html="desc.introduce"></Col>
        </Row>
      </Tab-pane>
      <!--交通信息-->
      <Tab-pane label="交通信息" key="key3" class="item">
        <Row class="item mt20">
          <Col span="4" class="label-name">交通信息</Col>
          <Col span="22" class="item-content" v-html="desc.trafficInfo"></Col>
        </Row>
      </Tab-pane>
      <!--预订地址-->
      <Tab-pane label="预订地址" key="key4" class="item">
        <Table
          :columns="(orderList.length===1 && orderList[0].orderType==='ds')?columns2:columns1"
          :data="orderList"
        >
          <template slot-scope="{row}" slot="logo" v-if="row.orderType==='pt'">
            <p class="img daq-no-photo cloud-img">
              <img :src="row.logo" :alt="row.platformName" v-if="row.logo" class />
            </p>
          </template>
          <template slot-scope="{row}" slot="url" v-if="row.orderType==='pt'">
            <a :href="row.url">{{row.url}}</a>
          </template>
        </Table>
      </Tab-pane>
    </Tabs>
    <!--审核记录-->
    <div class="tips-panel clearfix" v-if="recordsLog.length">
      <span class="fl title">审核记录</span>
    </div>
    <Timeline class="pd20">
      <Timeline-item v-for="(item,index) in recordsLog" :key="index">
        <p class="time">{{item.createTime}}</p>
        <p class="content">
          由【{{item.name}}】【{{item.phone}}】审核，审核结果：{{getStatusTitle(item.auditStatus)}}。
          <span
            v-if="item.auditResult"
          >审核备注：{{item.auditResult}}</span>
        </p>
      </Timeline-item>
    </Timeline>
    <Row class="item mg20" v-if="!isAudit">
      <Col span="24">
        <Button
          type="primary"
          class="btn-cancel"
          v-if="operates.includes('edit') && desc.status==!4 && !$route.query.code"
          @click="goEdit"
        >修改</Button>
        <Button class="submit ml20" @click="goBack" v-if="showBackBtn">返回</Button>
      </Col>
    </Row>
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <PreviewPics v-model="previewPicShow" :imgs="imgUrl" :currIndex="previewPicIndex" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import descMap from "@components/map/desc-map.vue";
import VideoPlayer from "@components/video-play/video-play.vue";
import { orderAddress, getHotelView, basicView } from "@service/place";
import { getTagsSelect, tagViewList } from "@service/common";
import { AppModule } from "@store/modules/app";
import uploadAudio from "@components/upload/upload-audio.vue";
import { PreviewPics } from "@components/index";
interface videoType {
  url: String;
  image: String;
  title: String;
}
@Component({
  components: {
    auditHead,
    descMap,
    VideoPlayer,
    uploadAudio,
    PreviewPics
  }
})
export default class detail extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //是否从审核查看
  @Prop() private audit!: boolean;
  /** 图片浏览 S */
  private previewPicShow = false;
  private previewPicIndex = 0;
  private imgUrl: Array<string> = [];
  previewPic(idx: number) {
    this.previewPicShow = true;
    this.previewPicIndex = idx;
  }
  showBackBtn = true
  /** 图片浏览 E*/
  private isAudit: boolean = false;
  /*S 获取详情*/
  private headData: object = {
    remark: "", //审核备注
    date: "", //审核日期
    status: -1 //审核状态
  };
  //审核流程信息
  private recordsLog: Array<object> = [];
  private desc: object = {};
  //获取详情信息
  getHotelDesc(id: any) {
    let _this = this;
    getHotelView({ id: id }).then((res: any) => {
      if (res.code === 0) {
        _this.desc = res.data.ctcHotel;
        let _data = res.data.ctcHotel;
        _this.showVideo.url = _data.video as string;
        _this.showVideo.title = _data.name as string;
        _this.showVideo.image = _data.videoCover as string;
        _this.imgUrl = res.data.ctcHotel.images?res.data.ctcHotel.images.split(","):[];
        //审核结果信息
        this.headData = {
          remark: res.data.auditRecordsVo.currentAuditResult,
          date: res.data.auditRecordsVo.dateTime,
          status: res.data.auditRecordsVo.currentAuditStatus
        };
        //审核流程信息
        this.recordsLog = res.data.auditRecordsVo.recordsLog;
        //设施标签
        if (res.data.ctcHotel.hotelEqtTag) {
          this.getTags(res.data.ctcHotel.hotelEqtTag, "eqtTagList");
        }
        //类型标签
        if (res.data.ctcHotel.type) {
          this.getTags(res.data.ctcHotel.type, "hotelTypeList");
        }
        //特色标签
        if (res.data.ctcHotel.feature) {
          this.getTags(res.data.ctcHotel.feature, "featureList");
        }
      }
    });
  }
  //获取审核状态中文结果
  getStatusTitle(status: any) {
    switch (status) {
      case 7: {
        return "回退";
      }
      case 8: {
        return "撤回";
      }
      case 9: {
        return "终止";
      }
      case 6: {
        return "审核通过";
      }
    }
  }
  /*E 获取详情*/

  //   预订地址
  private orderList: Array<Object> = [];
  //   预订表头
  private columns1: Array<Object> = [
    {
      title: "名称",
      key: "platformName",
      align: "center"
    },
    {
      title: "封面图",
      slot: "logo",
      align: "center"
    },
    {
      title: "地址",
      slot: "url",
      align: "center"
    }
  ];
  private columns2: Array<Object> = [
    {
      title: "名称",
      key: "platformName",
      align: "center"
    }
  ];
  // 预订地址
  private getOrder(id: any) {
    orderAddress({
      id: id,
      resourceType: "CONTENT_TYPE_HOTEL"
    }).then((data: any) => {
      if (data.code === 0) {
        data.datas.forEach((item: any) => {
          if (item.status === 1) {
            this.orderList.push({
              platformName: item.platformName,
              logo: item.logo,
              url: item.url,
              status: item.status,
              orderType: item.orderType
            });
          }
        });
      }
    });
  }
  /*S 标签*/
  private tagList: object = {
    eqtTagList: [],
    hotelTypeList: [],
    featureList: [],
    labelType: ["HOTEL_FACILITIES", "HOTEL_TYPE", "SPECIAL_SERVICE"]
  };

  //标签列表
  private getTags(ids: any, type: any) {
    tagViewList({
      ids: ids
    }).then((res: any) => {
      (this.tagList as any)[type] = res.datas;
    });
  }
  /*E 标签*/

  //修改
  goEdit() {
    this.$router.push({
      path: "/hotel-edit",
      query: { id: this.$route.query.id,type:this.$route.query.type }
    });
  }
  //返回
  goBack() {
    this.$router.go(-1);
  }
  /*S视频*/
  private show: Boolean = false;
  private showVideo: videoType = {
    url: "",
    image: "",
    title: ""
  };
  private openVideo() {
    this.show = true;
  }
  /*E视频*/
  //资源详情
  private getBasicView() {
    basicView({
      resourceType: "CONTENT_TYPE_HOTEL",
      qyCode: this.$route.query.code
    }).then((res: any) => {
      this.desc = res.data;
      (this.desc as any).introduce = res.data.introduce
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      (this.desc as any).trafficInfo = res.data.trafficInfo
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      (this.desc as any).route = res.data.route
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    });
  }
  mounted() {
    let _this = this;
    //是否从审核详情查看
    if (_this.audit) {
      _this.isAudit = true;
    }
    this.showBackBtn = !this.$route.query.showBackBtn
    if (this.$route.query.id) {
      _this.getHotelDesc(this.$route.query.id);
      _this.getOrder(this.$route.query.id);
    } else {
      _this.getBasicView();
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  padding: 10px 15px;
}
</style>
<style lang="scss">
.detail-wrap {
  padding: 15px;
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
  .map {
    height: 430px;
  }
  .cloud-img {
    display: inline-block;
    width: 120px;
    height: 80px;
    margin: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .tips-panel {
    margin-top: 30px;
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

  .item-content {
    .button {
      & + .button {
        margin-left: 15px;
      }
    }
  }
  .w150 {
    width: 150px;
  }
}
</style>
