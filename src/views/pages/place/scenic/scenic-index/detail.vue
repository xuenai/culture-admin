<template>
  <div class="detail-wrap">
    <!--审核结果-->
    <auditHead :data="headData" v-if="headData.status"></auditHead>
    <!--tab切换-->
    <Tabs active-key="key2" class="tab-wrap" :animated="false">
      <!--基础资料-->
      <Tab-pane label="基本资料" key="key1">
        <Row class="item mt20">
          <Col span="4" class="label-name">景区名称</Col>
          <Col span="20" class="item-content">{{detail.name}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">景区等级</Col>
          <Col span="20" class="item-content">{{detail.level}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">所在地区</Col>
          <Col span="20" class="item-content">{{detail.regionName}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.address">
          <Col span="4" class="label-name">详细地址</Col>
          <Col span="20" class="item-content">{{detail.address}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.openTimeEnd || detail.openTimeStart">
          <Col span="4" class="label-name">开放时间</Col>
          <Col span="20" class="item-content">{{detail.openTimeStart}} - {{detail.openTimeEnd}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.tourGuide">
          <Col span="4" class="label-name">导游导览</Col>
          <Col span="20" class="item-content">{{detail.tourGuide}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.suggestedTime">
          <Col span="4" class="label-name">建议游玩时长</Col>
          <Col span="20" class="item-content">{{detail.suggestedTime}} {{detail.suggestedHour}}小时</Col>
        </Row>
        <Row class="item mt20" v-if="detail.suggestedTime">
          <Col span="4" class="label-name">最佳旅游时间</Col>
          <Col span="20" class="item-content">{{detail.bestTravelTime}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.phone">
          <Col span="4" class="label-name">服务电话</Col>
          <Col span="20" class="item-content">{{detail.phone}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.ticketPolicy">
          <Col span="4" class="label-name">门票政策</Col>
          <Col span="20" class="item-content">{{detail.ticketPolicy}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.resourceCode">
          <Col span="4" class="label-name">资源互通编码</Col>
          <Col span="20" class="item-content">{{detail.resourceCode}}</Col>
        </Row>
        <!--个性标签-->
        <div class="tips-panel clearfix">
          <span class="fl title">个性标签</span>
        </div>
        <Row class="item mt20" v-if="detail.theme">
          <Col span="4" class="label-name">景区主题</Col>
          <Col span="20" class="btn-list">
            <span
              class="choice-tag active"
              v-for="(item,index) in tagList.themeList"
              :key="index"
            >{{item.labelName}}</span>
          </Col>
        </Row>
        <Row class="item mt20" v-if="detail.crowd">
          <Col span="4" class="label-name">适合人群</Col>
          <Col span="20" class="btn-list">
            <span
              class="choice-tag active"
              v-for="(item,index) in tagList.crowdList"
              :key="index"
            >{{item.labelName}}</span>
          </Col>
        </Row>
        <Row class="item mt20" v-if="detail.latitude && detail.longitude">
          <Col span="4" class="label-name">景区位置</Col>
          <Col span="20" class="map">
            <mapMarker
              :longitude="detail.longitude"
              :latitude="detail.latitude"
              :id="'map1'"
              v-if="detail.latitude && detail.longitude"
            ></mapMarker>
          </Col>
        </Row>
        <!--下属景点-->
        <div class="tips-panel clearfix" v-if="spot.length">
          <span class="fl title">下属景点</span>
          <p class="fl tag-content">真实的选择个性信息，让游客更好了解景区。</p>
        </div>
        <ul class="item mt20" v-if="spot.length">
          <li class="items" v-for="item in spot" :key="item.id" v-if="id">
            <router-link
              tag="p"
              :to="{path: '/attractions-detail', query: {id: item.id, scenicId: detail.id}}"
              class="cloud-img activity-room daq-no-photo"
            >
              <img :src="item.images.split(',')[0]" :alt="item.name" v-if="item.images" />
            </router-link>
            <router-link
              class="activity-room-name"
              tag="p"
              :to="{path: '/attractions-detail', query: {id: item.id, scenicId: detail.id}}"
            >{{item.name}}</router-link>
          </li>
          <li class="items" v-for="item in spot" :key="item.resourceCode" v-if="!id">
            <p class="cloud-img activity-room daq-no-photo">
              <img :src="item.images.split(',')[0]" :alt="item.name" v-if="item.images" />
            </p>
            <p class="activity-room-name">{{item.name}}</p>
          </li>
        </ul>
      </Tab-pane>
      <!--景区介绍-->
      <Tab-pane label="景区介绍" key="key2" class="item">
        <Row class="item mt20" v-if="detail.images">
          <Col span="4" class="label-name">景区图片</Col>
          <Col span="22" class="item-content img-list">
            <p class="img" v-for="(item,index) in detail.images.split(',')" :key="item">
              <img
                :src="item"
                :alt="detail.name"
                @click.stop="viewImage(detail.images.split(','), index)"
              />
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="detail.audio">
          <Col span="4" class="label-name">语音介绍</Col>
          <Col span="22" class="item-content img-list">
            <uploadAudio :defaultAudio="detail.audio" :readonly="true"></uploadAudio>
          </Col>
        </Row>
        <Row class="item mt20" v-if="detail.video">
          <Col span="4" class="label-name">视频</Col>
          <Col span="22" class="item-content img-list">
            <p class="img daq-no-photo view-images-box" @click="openVideo">
              <span class="cover"></span>
              <img :src="detail.videoCover" alt v-if="detail.videoCover" class="daq-img" />
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="detail.panoramaUrl">
          <Col span="4" class="label-name">720全景</Col>
          <Col span="20" class="item-content">
            <a :href="detail.panoramaUrl" target="_blank">{{detail.panoramaUrl}}</a>
          </Col>
        </Row>
        <Row class="item mt20" v-if="detail.maxNum">
          <Col span="4" class="label-name">最大承载量</Col>
          <Col span="20" class="item-content">{{detail.maxNum}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.elevation">
          <Col span="4" class="label-name">海拔高度</Col>
          <Col span="20" class="item-content">{{detail.elevation}}m</Col>
        </Row>
         <Row class="item mt20" v-if="detail.officialUrl">
          <Col span="4" class="label-name">公众号二维码</Col>
          <Col span="22" class="item-content img-list">
            <p class="img" >
              <img :src="detail.officialUrl" alt @click.stop="viewImage(detail.officialUrl.split(','), 0)" />
            </p>
          </Col>
        </Row>
         <Row class="item mt20"  v-if="detail.officialName">
          <Col span="4" class="label-name">公众号名称</Col>
          <Col span="20" class="item-content">{{detail.officialName}}</Col>
        </Row>
         <Row class="item mt20" v-if="detail.websiteUrl">
          <Col span="4" class="label-name">官网地址</Col>
          <Col span="20" class="item-content">{{detail.websiteUrl}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.briefing">
          <Col span="4" class="label-name">景区概述</Col>
          <Col span="20" class="item-content">{{detail.briefing}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.summary">
          <Col span="4" class="label-name">景区简介</Col>
          <Col span="20" class="item-content">{{detail.summary}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.introduce">
          <Col span="4" class="label-name">景区介绍</Col>
          <Col span="20" class="item-content" v-html="detail.introduce"></Col>
        </Row>
      </Tab-pane>
      <!--游玩线路-->
      <Tab-pane label="游玩线路" key="key3" class="item">
        <Row class="item mt20">
          <Col span="4" class="label-name">游玩路线</Col>
          <Col span="22" class="item-content" v-html="detail.route||'暂无'"></Col>
        </Row>
      </Tab-pane>
      <!--交通信息-->
      <Tab-pane label="交通信息" key="key4" class="item">
        <Row class="item mt20">
          <Col span="4" class="label-name">交通信息</Col>
          <Col span="22" class="item-content" v-html="detail.trafficInfo||'暂无'"></Col>
        </Row>
      </Tab-pane>
      <!--地理文化-->
      <Tab-pane label="地理文化" key="key5" class="item">
        <Row class="item mt20">
          <Col span="4" class="label-name">地理文化</Col>
          <Col span="22" class="item-content" v-html="detail.geogCulture||'暂无'"></Col>
        </Row>
      </Tab-pane>
      <!--预订地址-->
      <Tab-pane label="预订地址" key="key6" class="item">
        <Table
          :columns="(orderList.length===1 && orderList[0].orderType==='ds')?columns2:columns1"
          :data="orderList"
        >
          <template slot-scope="{row}" slot="logo" v-if="row.orderType==='pt'">
            <p
              class="img daq-no-photo cloud-img"
              style="display:inline-block; width: 120px; height: 80px;"
            >
              <img :src="row.logo" :alt="row.platformName" v-if="row.logo" />
            </p>
          </template>
          <template slot-scope="{row}" slot="url" v-if="row.orderType==='pt'">
            <a :href="row.url">{{row.url}}</a>
          </template>
        </Table>
      </Tab-pane>
      <!--游客中心-->
      <Tab-pane label="游客中心" key="key7" class="item">
        <Row class="item mt20" v-if="detail.centerAddress">
          <Col span="4" class="label-name">所在地址</Col>
          <Col span="22" class="item-content">{{detail.centerAddress||'暂无'}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.centerPhone">
          <Col span="4" class="label-name">服务电话</Col>
          <Col span="22" class="item-content">{{detail.centerPhone||'暂无'}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.centerTimeStart || detail.centerTimeEnd">
          <Col span="4" class="label-name">营业时间</Col>
          <Col span="22" class="item-content">{{detail.centerTimeStart}}至{{detail.centerTimeEnd}}</Col>
        </Row>
        <Row class="item mt20" v-if="detail.centerImage">
          <Col span="4" class="label-name">图片介绍</Col>
          <Col span="22" class="item-content img-list">
            <p class="img daq-no-photo" v-for="item in detail.centerImage.split(',')" :key="item">
              <img :src="item" alt />
            </p>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">地理位置</Col>
          <Col
            span="22"
            class="item-content"
            :class="detail.centerLongitude && detail.centerLatitude?'map':''"
          >
            <mapMarker
              :id="'map2'"
              :longitude="detail.centerLongitude"
              :latitude="detail.centerLatitude"
              v-if="detail.centerLongitude && detail.centerLatitude"
            ></mapMarker>
            <span v-else>暂无</span>
          </Col>
        </Row>
      </Tab-pane>
    </Tabs>
    <!--审核记录-->
    <div class="tips-panel clearfix" v-if="recordsLog.length">
      <span class="fl title">审核记录</span>
    </div>
    <Timeline class="pd20" v-if="recordsLog.length">
      <Timeline-item v-for="(item,index) in recordsLog" :key="index">
        <p class="time">{{item.createTime}}</p>
        <p class="content">
          由【{{item.name}}】【{{item.phone.substr(item.phone.length-4,item.phone.length)}}】审核，审核结果：{{getStatusTxt(item.auditStatus)}}。
          <span
            v-if="item.auditResult"
          >审核备注：{{item.auditResult}}</span>
        </p>
      </Timeline-item>
    </Timeline>
    <Row class="item mg20" v-if="!isAudit">
      <Col span="24">
        <router-link
          :to="{path: '/scenic-edit', query: {id: detail.id}}"
          class="theme-blue action-btn"
          v-if="operates.includes('edit') && detail.status !== 4 && id"
        >
          <Button class="btn-cancel" type="primary" @click="goEdit">修改</Button>
        </router-link>
        <Button class="submit ml20" @click="goHistory" v-if="showBackBtn">返回</Button>
      </Col>
    </Row>
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import mapMarker from "@components/map/desc-map.vue";
import VideoPlayer from "@components/video-play/video-play.vue";
import uploadAudio from "@components/upload/upload-audio.vue";
import { getTagsSelect, tagViewList } from "@service/common";
import { AppModule } from "@store/modules/app";
import { PreviewPics } from "@components/index";
import {
  getScenicDesc,
  getScenicPointList,
  orderAddress,
  basicView
} from "@service/place";

interface videoType {
  url: String;
  image: String;
  title: String;
}

@Component({
  components: {
    auditHead,
    mapMarker,
    VideoPlayer,
    PreviewPics,
    uploadAudio
  }
})
export default class detail extends Vue {
  @Prop() private audit!: boolean;
  private isAudit: boolean = false;

  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  showBackBtn = true;
  private recordsLog: Array<object> = []; // 审核记录列表
  private headData: object = {};
  private detail: Object = {};
  // 视频
  private show: Boolean = false;
  private showVideo: videoType = {
    url: "",
    image: "",
    title: ""
  };

  private goHistory() {
    this.$router.go(-1);
  }

  private openVideo() {
    this.show = true;
  }

  private spot: Array<Object> = [];
  private orderList: Array<Object> = [];
  private data: any;
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
  private id: any = "";
  mounted() {
    let _this = this;
    //是否从审核详情查看
    if (_this.audit) {
      _this.isAudit = true;
    }
    this.id = this.$route.query.id;
    this.showBackBtn = !this.$route.query.showBackBtn
    if (this.id) {
      _this.getDesc(this.id);
      _this.getScenicPointList();
      _this.getOrder();
    } else {
      _this.getBasicView();
    }
  }

  private getStatusTxt(status: number) {
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

  //   预订地址
  private getOrder() {
    orderAddress({
      id: this.$route.query.id,
      resourceType: "CONTENT_TYPE_SCENERY"
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

  //标签
  private tagList: object = {
    themeList: [],
    crowdList: []
  };
  // 获取标签
  getTagList(ids: any, type: any) {
    tagViewList({
      ids: ids
    }).then((res: any) => {
      (this.tagList as any)[type] = res.datas;
    });
  }
  // 详情
  private getDesc(id: any) {
    getScenicDesc({
      id: id
    }).then(data => {
      if (data.code === 0) {
        this.detail = data.data.ctcScenic;
        (this.detail as any).introduce = data.data.ctcScenic.introduce
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
        (this
          .detail as any).trafficInfo = data.data.ctcScenic.trafficInfo
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
        (this
          .detail as any).geogCulture = data.data.ctcScenic.geogCulture
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
        (this.detail as any).route = data.data.ctcScenic.route
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
        let _data = data.data.ctcScenic;
        this.showVideo.url = _data.video as string;
        this.showVideo.title = _data.name as string;
        this.showVideo.image = _data.videoCover as string;
        this.data = data.data;
        this.headData = {
          status: data.data.auditRecordsVo.currentAuditStatus,
          date: data.data.auditRecordsVo.dateTime,
          remark: data.data.auditRecordsVo.currentAuditResult
        };
        this.recordsLog = data.data.auditRecordsVo.recordsLog;
        //类型标签
        if (data.data.ctcScenic.theme) {
          this.getTagList(data.data.ctcScenic.theme, "themeList");
        }
        //设备标签
        if (data.data.ctcScenic.crowd) {
          this.getTagList(data.data.ctcScenic.crowd, "crowdList");
        }
      }
    });
  }

  //资源详情
  private getBasicView() {
    basicView({
      resourceType: "CONTENT_TYPE_SCENERY",
      qyCode: this.$route.query.code
    }).then((res: any) => {
      this.detail = res.data.basicResource;
      (this.detail as any).introduce = res.data.basicResource.introduce
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      (this
        .detail as any).trafficInfo = res.data.basicResource.trafficInfo
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      (this
        .detail as any).geogCulture = res.data.basicResource.geogCulture
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      (this.detail as any).route = res.data.basicResource.route
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      this.spot = res.data.childResource;
    });
  }
  //   详情景点
  private getScenicPointList() {
    getScenicPointList({
      scenicId: this.$route.query.id,
      pageSize: 100
    }).then(data => {
      this.spot = data.datas as [];
    });
  }
  //修改
  goEdit() {
    this.$router.push({
      path: "/scenic-edit",
      query: { id: this.$route.query.id,type:this.$route.query.type}
    });
  }
  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private currIndex = 0;
  private viewImage(url: Array<string>, idx: number) {
    this.imgUrl = url;
    this.visible = true;
    this.currIndex = idx;
  }
  /* E 查看大图 */
}
</script>
<style lang="scss">
.container {
  padding: 10px 15px;
}

.items {
  display: inline-block;
  vertical-align: top;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
}

.detail-wrap {
  padding: 15px;
  .tab-wrap {
    margin-top: 5px;
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
    &.activity-room {
      width: 200px;
      height: 150px;
      border-radius: 4px;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .activity-room-name {
    font-size: 14px;
    color: $font01;
    margin-top: 12px;
    cursor: pointer;
    &:hover {
      color: $theme-hover;
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
