<template>
  <div class="detail-wrap pd20">
    <!--审核结果-->
    <auditHead :data="headData" v-if="headData.status"></auditHead>
    <Head class="mt20"></Head>
    <div class="enter-container">
      <Row class="item mt20">
        <Col span="4" class="label-name">传承人名称</Col>
        <Col span="20" class="item-content">{{desc.name}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">传承人类型</Col>
        <Col span="20" class="item-content">{{desc.type}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">传承人性别</Col>
        <Col span="20" class="item-content">{{desc.gender}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">级别</Col>
        <Col span="20" class="item-content">{{desc.level}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">批次</Col>
        <Col span="20" class="item-content">{{desc.batch}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">申报地区</Col>
        <Col span="20" class="item-content">{{desc.region}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">申报单位</Col>
        <Col span="20" class="item-content">{{desc.reportCompany}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">联系电话</Col>
        <Col span="20" class="item-content">{{desc.phone}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">民族</Col>
        <Col span="20" class="item-content">{{desc.nationality}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">身份证号</Col>
        <Col span="20" class="item-content">{{desc.idCard}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">所在地区</Col>
        <Col span="20" class="item-content">{{desc.region}}</Col>
      </Row>
      <Row class="item mt20">
        <Col span="4" class="label-name">详细地址</Col>
        <Col span="20" class="item-content">{{desc.address}}</Col>
      </Row>
      <Row class="item mt20" v-if="desc.images">
        <Col span="4" class="label-name">传承人图片</Col>
        <Col span="22" class="item-content img-list">
          <p class="img" v-for="(item,index) in desc.images.split(',')" :key="item">
            <img :src="item" alt @click.stop="viewImage(desc.images.split(','), index)" />
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
        <Col span="4" class="label-name">房型视频</Col>
        <Col span="22" class="item-content img-list">
          <p class="img daq-no-photo view-images-box" @click="openVideo">
            <span class="cover"></span>
            <img :src="desc.videoCover" alt v-if="desc.videoCover" class="daq-img" />
          </p>
        </Col>
      </Row>
    </div>
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
          v-if="operates.includes('edit')&& desc.status==!4"
          @click="goEdit"
        >修改</Button>
        <Button class="submit ml20" @click="goBack">返回</Button>
      </Col>
    </Row>
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import Head from "./head.vue";
import VideoPlayer from "@components/video-play/video-play.vue";
import { ctcHeritagePeopleView } from "@service/activity";
import { PreviewPics } from "@components/index";
import { AppModule } from "@store/modules/app";
import { dictView } from "@service/common";
import uploadAudio from "@components/upload/upload-audio.vue";
interface videoType {
  url: String;
  image: String;
  title: String;
}
@Component({
  components: {
    auditHead,
    Head,
    VideoPlayer,
    PreviewPics,
    uploadAudio
  }
})
export default class detail extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //是否从审核查看
  @Prop() private audit!: boolean;
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

  //详情
  getHotelRoomDesc(id: any) {
    let _this = this;
    ctcHeritagePeopleView({ id: id }).then((res: any) => {
      if (res.code === 0) {
        _this.desc = res.data.ctcHeritagePeople;
        let _data = res.data.ctcHeritagePeople;
        this.showVideo.url = _data.video as string;
        this.showVideo.title = _data.name as string;
        this.showVideo.image = _data.videoCover as string;
        //级别
        if(res.data.ctcHeritagePeople.level){
        this.getTagList(res.data.ctcHeritagePeople.level, "level")
        }
        //批次
         if(res.data.ctcHeritagePeople.batch){
        this.getTagList(res.data.ctcHeritagePeople.batch, "batch")
        }
        //审核结果信息
        _this.headData = {
          remark: res.data.auditRecordsVo.currentAuditResult,
          date: res.data.auditRecordsVo.dateTime,
          status: res.data.auditRecordsVo.currentAuditStatus
        };
        //审核流程信息
        _this.recordsLog = res.data.auditRecordsVo.recordsLog;
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
   // 获取标签
  getTagList(id: any, type: any) {
    dictView({
      id: id
    }).then((res: any) => {
      (this.desc as any)[type] = res.data.name;
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

  //返回
  goBack() {
    this.$router.go(-1);
  }
  //编辑
  goEdit() {
    this.$router.push({
      path: "/guestroom-edit",
      query: { id: this.$route.query.id }
    });
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
  mounted() {
    let _this = this;
    //是否从审核详情查看
    if (_this.audit) {
      _this.isAudit = true;
    }
    //编辑
    if (_this.$route.query.id) {
      _this.getHotelRoomDesc(this.$route.query.id);
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
