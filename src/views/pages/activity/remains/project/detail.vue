<template>
  <div class="detail-wrap">
    <!--审核结果-->
    <auditHead :data="headData" v-if="headData.status"></auditHead>
    <!--tab切换-->
    <Tabs active-key="key2" class="tab-wrap" :animated="false">
      <!--基础资料-->
      <Tab-pane label="基本资料" key="key1">
        <Row class="item mt20">
          <Col span="4" class="label-name">非遗项目名称</Col>
          <Col span="20" class="item-content">{{desc.name}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">创建者</Col>
          <Col span="20" class="item-content">{{desc.createUserName}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">非遗类别</Col>
          <Col span="20" class="btn-list">
            <span
              class="choice-tag active"
            >{{tagList.type.name}}</span>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">非遗级别</Col>
          <Col span="20" class="btn-list">
            <span
              class="choice-tag active"
            >{{tagList.level.name}}</span>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">非遗批次</Col>
          <Col span="20" class="btn-list">
            <span
              class="choice-tag active"
            >{{tagList.batch.name}}</span>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">申报地区</Col>
          <Col span="20" class="item-content">{{desc.reportRegion}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">申报单位</Col>
          <Col span="20" class="item-content">{{desc.reportCompany}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.reportCode">
          <Col span="4" class="label-name">项目编号</Col>
          <Col span="20" class="item-content">{{romaValue}} - {{desc.reportCode}}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.resourceCode">
          <Col span="4" class="label-name">资源互通编码</Col>
          <Col span="20" class="item-content">{{desc.resourceCode}}</Col>
        </Row>
        <!--所属传承人-->
        <div class="tips-panel clearfix" v-if="people&& people.length">
          <span class="fl title">所属传承人</span>
        </div>
        <ul class="item mt20">
          <li class="items" v-for="item in people" :key="item.id">
            <router-link
              tag="a"
              target="_blank"
              :to="{path: '/inheritor-detail', query: {pid:desc.id,id:item.id,type:'list'}}"
              class="cloud-img activity-room daq-no-photo"
            >
              <img :src="item.images.split(',')[0]" v-if="item.images" />
            </router-link>
            <router-link
              tag="a"
              target="_blank"
              class="activity-room-name"
              :to="{path: '/inheritor-detail', query: {pid:desc.id,id:item.id,type:'list'}}"
            >{{item.name}}</router-link>
          </li>
        </ul>
      </Tab-pane>
      <!--非遗介绍-->
      <Tab-pane label="非遗介绍" key="key2" class="item">
        <Row class="item mt20" v-if="desc.images">
          <Col span="4" class="label-name">酒店图片</Col>
          <Col span="22" class="item-content img-list">
            <p class="img" v-for="(item,index) in desc.images.split(',')" :key="index">
              <img @click="previewPic(index)" :src="item" alt />
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.voice">
          <Col span="4" class="label-name">语音介绍</Col>
          <Col span="22" class="item-content img-list">
            <uploadAudio :defaultAudio="desc.voice" :readonly="true"></uploadAudio>
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
          <Col span="4" class="label-name">非遗概述</Col>
          <Col span="20" class="item-content">{{desc.briefing}}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">非遗介绍</Col>
          <Col span="20" class="item-content" v-html="desc.introduce"></Col>
        </Row>
      </Tab-pane>
      <!--预订地址-->
      <Tab-pane label="预订地址" key="key3" class="item">
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
          v-if=" desc.status==!4 && !$route.query.code"
          @click="goEdit"
        >修改</Button>
        <Button class="submit ml20" @click="goBack">返回</Button>
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
import { orderAddress, basicView } from "@service/place";
import { ctcHeritageView } from "@service/activity";
import { getTagsSelect, tagViewList,dictView,dictValueToRoma } from "@service/common";
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
  private people: Array<any> = [];
  //获取详情信息
  getDesc(id: any) {
    let _this = this;
    ctcHeritageView({ id: id }).then((res: any) => {
      if (res.code === 0) {
        _this.people = res.data.people;
        _this.desc = res.data.ctcHeritageItem;
        let _data = res.data.ctcHeritageItem;
        _this.showVideo.url = _data.video as string;
        _this.showVideo.title = _data.name as string;
        _this.showVideo.image = _data.videoCover as string;
        _this.imgUrl = res.data.ctcHeritageItem.images.split(",");
        //审核结果信息
        this.headData = {
          remark: res.data.auditRecordsVo.currentAuditResult,
          date: res.data.auditRecordsVo.dateTime,
          status: res.data.auditRecordsVo.currentAuditStatus
        };
        //审核流程信息
        this.recordsLog = res.data.auditRecordsVo.recordsLog;
        //类别
        if (res.data.ctcHeritageItem.type) {
          this.getTags(res.data.ctcHeritageItem.type, "type");
        }
        //级别
        if (res.data.ctcHeritageItem.level) {
          this.getTags(res.data.ctcHeritageItem.level, "level");
        }
        //批次
        if (res.data.ctcHeritageItem.batch) {
          this.getTags(res.data.ctcHeritageItem.batch, "batch");
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
      resourceType: "CONTENT_TYPE_HERITAGE_ITEM"
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
  private tagList: any = {
    type: {},
    level: {},
    batch: {},
    labelType: ["HERITAGE_BATCH", "HERITAGE_TYPE", "HERITAGE_LEVEL"]
  };
  // 项目编号前缀
  private romaValue:any=''
  private reportCodeBefore() {
    if (this.tagList.type) {
      dictValueToRoma({
        value: this.tagList.type.value
      }).then((res: any) => {
        if (res.code === 0) {
          this.romaValue=res.data
        }
      })
    }
  }
  //标签列表
  private getTags(id: any, type: any) {
    dictView({
      id: id
    }).then((res: any) => {
      (this.tagList as any)[type] = res.data;
      if(type=='type') this.reportCodeBefore();//获取罗马数字
    });
  }
  /*E 标签*/

  //修改
  goEdit() {
    this.$router.push({
      path: "/project-edit",
      query: { id: this.$route.query.id }
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
      resourceType: "CONTENT_TYPE_HERITAGE_ITEM",
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
    if (this.$route.query.id) {
      _this.getDesc(this.$route.query.id);
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
  .items {
    display: inline-block;
    vertical-align: top;
    margin-right: 20px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }
  .cloud-img {
    display: block;
    margin: 0;
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
    display: block;
    font-size: 14px;
    color: $font01;
    margin-top: 12px;
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
