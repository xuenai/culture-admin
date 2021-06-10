<template>
  <div class="detail-wrap pd20">
    <!--审核结果-->
    <auditHead :data="headData" v-if="headData.status"></auditHead>
    <!--基本信息-->
    <div class="scenic">
      <p class="left daq-no-photo">
        <img :src="scenic.images.split(',')[0]" alt class="daq-img" v-if="scenic.images" />
      </p>
      <div class="right">
        <p class="name">{{scenic.name}}</p>
        <p class="level choice-tag active" v-if="scenic.level">{{scenic.level}}</p>
        <p class="address" v-if="scenic.address">
          <i class="cloud-icon">&#xe606;</i>
          {{scenic.address}}
        </p>
      </div>
    </div>
    <div class="tips-panel clearfix">
      <span class="fl title">基本信息</span>
    </div>
    <Row class="item mt20">
      <Col span="4" class="label-name">景点名称</Col>
      <Col span="20" class="item-content">{{detail.name}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.elevation">
      <Col span="4" class="label-name">海拔高度</Col>
      <Col span="20" class="item-content">{{detail.elevation}}m</Col>
    </Row>
    <Row class="item mt20" v-if="detail.radiationDis">
      <Col span="4" class="label-name">辐射距离(m)</Col>
      <Col span="20" class="item-content">{{detail.radiationDis}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.address">
      <Col span="4" class="label-name">详细地址</Col>
      <Col span="20" class="item-content">{{detail.address}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.openTimeStart">
      <Col span="4" class="label-name">开放时间</Col>
      <Col span="20" class="item-content">{{detail.openTimeStart}}-{{detail.openTimeEnd}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.suggestedTime">
      <Col span="4" class="label-name">建议游玩时长</Col>
      <Col span="20" class="item-content">{{detail.suggestedTime}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.ticketPolicy">
      <Col span="4" class="label-name">门票政策</Col>
      <Col span="20" class="item-content">{{detail.ticketPolicy}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.phone">
      <Col span="4" class="label-name">服务电话</Col>
      <Col span="20" class="item-content">{{detail.phone}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.resourceCode">
      <Col span="4" class="label-name">资源互通编码</Col>
      <Col span="20" class="item-content">{{detail.resourceCode}}</Col>
    </Row>
    <!--景点信息-->
    <div class="tips-panel clearfix">
      <span class="fl title">景点信息</span>
    </div>
    <Row class="item mt20" v-if="detail.images">
      <Col span="4" class="label-name">景点图片</Col>
      <Col span="20" class="item-content img-list">
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
      <Col span="4" class="label-name">语音导览</Col>
      <Col span="20" class="item-content">
        <uploadAudio :defaultAudio="detail.audio" :readonly="true"></uploadAudio>
      </Col>
    </Row>
    <Row class="item mt20" v-if="detail.liveUrl">
      <Col span="4" class="label-name">实景直播</Col>
      <Col span="20" class="item-content">
        <a class="img daq-no-photo view-images-box" :href="detail.liveUrl" target="_blank">
          <p class="cover"></p>
          <img :src="detail.images.split(',')[0]" alt v-if="detail.images" class="daq-img" />
        </a>
      </Col>
    </Row>
    <Row class="item mt20" v-if="detail.panoramaUrl">
      <Col span="4" class="label-name">720全景</Col>
      <Col span="20" class="item-content">
        <a :href="detail.panoramaUrl" target="_blank">{{detail.panoramaUrl}}</a>
      </Col>
    </Row>
    <Row class="item mt20" v-if="detail.briefing">
      <Col span="4" class="label-name">景点概述</Col>
      <Col span="20" class="item-content">{{detail.briefing}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.summary">
      <Col span="4" class="label-name">景点简介</Col>
      <Col span="20" class="item-content">{{detail.summary}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.introduce">
      <Col span="4" class="label-name">景点介绍</Col>
      <Col span="20" class="item-content" v-html="detail.introduce"></Col>
    </Row>
    <Row class="item mt20" v-if="detail.longitude">
      <Col span="4" class="label-name">景点位置</Col>
      <Col span="20" class="item-content">
        <mapMarker
          :longitude="detail.longitude"
          :latitude="detail.latitude"
          :id="'map1'"
          v-if="detail.latitude && detail.longitude"
        ></mapMarker>
      </Col>
    </Row>
    <!--最佳拍摄位-->
    <div
      class="tips-panel clearfix"
      v-if="detail.shootPointIntroduce||detail.shootTime||detail.shootImgExample"
    >
      <span class="fl title">最佳拍摄位</span>
    </div>
    <Row class="item mt20" v-if="detail.shootPointIntroduce">
      <Col span="4" class="label-name">拍摄点介绍</Col>
      <Col span="20" class="item-content" v-html="detail.shootPointIntroduce"></Col>
    </Row>
    <Row class="item mt20" v-if="detail.shootTime">
      <Col span="4" class="label-name">拍摄时间</Col>
      <Col span="20" class="item-content">{{detail.shootTime}}</Col>
    </Row>
    <Row class="item mt20" v-if="detail.shootImgExample">
      <Col span="4" class="label-name">拍照示例</Col>
      <Col span="20" class="item-content img-list">
        <p class="img" v-for="(item,index) in detail.shootImgExample.split(',')" :key="item">
          <img
            :src="item"
            :alt="detail.name"
            @click.stop="viewImage(detail.shootImgExample.split(','), index)"
          />
        </p>
      </Col>
    </Row>
    <!--审核记录-->
    <div class="tips-panel clearfix" v-if="recordsLog.length">
      <span class="fl title">审核记录</span>
    </div>
    <Timeline class="pd20">
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
          :to="{path: '/attractions-edit', query: {scenicId: this.$route.query.scenicId,id: detail.id,type: 'list'}}"
          v-if="operates.includes('edit') && detail.status !== 4 && id"
        >
          <Button type="primary" class="btn-cancel ml20">修改</Button>
        </router-link>
        <Button class="submit ml20" @click="goHistory">返回</Button>
      </Col>
    </Row>
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import mapMarker from "@components/map/desc-map.vue";
import uploadAudio from "@components/upload/upload-audio.vue";
import { getScenicPointDesc, getScenicPoint, basicView } from "@service/place";
import { AppModule } from "@store/modules/app";
import { PreviewPics } from "@components/index";
@Component({
  components: {
    auditHead,
    mapMarker,
    uploadAudio,
    PreviewPics
  }
})
export default class detail extends Vue {
  @Prop() private audit!: boolean;
  private isAudit: boolean = false;

  // 权限列表
  get operates() {
    return AppModule.operates;
  }

  private headData: object = {};
  private recordsLog: Array<object> = []; // 审核记录列表
  private show: Boolean = false;
  private detail: Object = {};
  private scenic: Object = {};
  private id: any = "";
  mounted() {
    this.id = this.$route.query.id;
    this.getScenic();
    if (this.id) {
      this.getDesc();
    } else {
      this.getBasicView();
    }
    //是否从审核详情查看
    if (this.audit) {
      this.isAudit = true;
    }
  }

  // 详情
  private getDesc() {
    getScenicPointDesc({
      id: this.$route.query.id
    }).then(data => {
      if (data.code === 0) {
        this.detail = data.data.ctcScenicSpots;
        (this
          .detail as any).introduce = data.data.ctcScenicSpots.introduce
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");
        this.headData = {
          status: data.data.auditRecordsVo.currentAuditStatus,
          date: data.data.auditRecordsVo.dateTime,
          remark: data.data.auditRecordsVo.currentAuditResult
        };
        this.recordsLog = data.data.auditRecordsVo.recordsLog;
      }
    });
  }
  //资源详情
  private getBasicView() {
    basicView({
      resourceType: "CONTENT_TYPE_SCENIC_SPOTS",
      qyCode: this.$route.query.code
    }).then((res: any) => {
      this.detail = res.data;
      (this.detail as any).introduce = res.data.introduce
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    });
  }

  // 父级景区
  private getScenic() {
    getScenicPoint({
      id: this.$route.query.scenicId
    }).then(data => {
      this.scenic = data.data;
    });
  }

  private goHistory() {
    this.$router.go(-1);
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
  //修改
  goEdit() {
    this.$router.push({
      path: "/attractions-edit",
      query: { id: this.$route.query.id ,type:this.$route.query.type}
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
<style scoped lang="scss">
.container {
  padding: 10px 15px;
}
</style>
<style lang="scss">
.footer {
  display: none !important;
}

.scenic {
  margin-top: 20px;
  display: flex;
  align-items: center;
  .left {
    width: 160px;
    height: 120px;
    border-radius: 5px;
    margin-right: 20px;
    overflow: hidden;
  }
  .right {
    position: relative;
    flex: 1;
    overflow: hidden;
    .name {
      font-size: 14px;
      font-weight: bold;
      line-height: 18px;
    }
    .address {
      margin-top: 18px;
      font-size: 14px;
      color: #999;
    }
    .level {
      padding: 0 12px;
      display: inline-block;
      margin: 20px 8px 0 0;
      font-size: 12px;
      color: #5ac858;
      height: 20px;
      line-height: 20px;
      background: rgba(90, 200, 88, 0.15);
    }
  }
}

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
