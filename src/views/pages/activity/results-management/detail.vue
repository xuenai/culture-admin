<template>
  <div class="perform-wrap" style="padding:20px">
    <!-- 状态 -->
    <auditHead v-if="headData" :data="headData"></auditHead>
    <!--活动详情-->
    <div class="tips-panel clearfix">
      <span class="fl title">活动信息</span>
    </div>
    <!-- <activityDesc></activityDesc> -->
    <OrdinaryActivityDetail v-if="activityData" :data="activityData" :openAll="false"></OrdinaryActivityDetail>
    <!-- 进度 -->
    <div
      class="audit-record"
      v-if="recordList.length"
      style="padding:20px"
    >
      <h3 class="title" style="margin-bottom:20px">审核记录</h3>
      <Timeline class="record-panel">
        <Timeline-item v-for="(record, i) in recordList" :key="i">
          <p class="time">{{ record.updateTime }}</p>

          <p class="content">
            由【{{ record.handlerName }}】【{{
              record.handlerPhone.substr(
                record.handlerPhone.length - 4,
                record.handlerPhone.length
              )
            }}】审核，审核结果：{{
              AUDIT_DATA_STATUS[record.auditStatus]
            }}。审核备注：{{ record.result || '暂无' }}
          </p>
        </Timeline-item>
      </Timeline>
    </div>

    <AuditForm v-if="$route.query.audit" :auditParams="auditParams" :editBtnStatus="editBtnStatus" :goEdit="goEdit"></AuditForm>
    <Row class="item mg20 submit-panel" v-else>
      <i-col span="24">
        <Button
          type="primary"
          class="btn-cancel"
          style="margin-right:20px"
          v-if="editBtnStatus"
          @click="goEdit"
          >修改</Button
        >
        <Button class="submit" @click="goBack">返回</Button>
      </i-col>
    </Row>
    <VideoPlayer
      :showVideo="showVideo"
      :show="show"
      v-if="showVideo.url"
    ></VideoPlayer>
    <PreviewPics
      v-model="visible"
      :imgs="imgUrl"
      :currIndex="currIndex"
    ></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import activityDesc from '@views/pages/activity/activity-management/activity-detail.vue'
import { getActivityDetial, resultView, getRecords } from '@service/activity'
import { PreviewPics } from '@components/index'
import VideoPlayer from "@components/video-play/video-play.vue";
import AuditForm from "./audit-form.vue";
import DetailRes from "./detail-res.vue";
import {AUDIT_DATA_STATUS} from "@constant/index"
import OrdinaryActivityDetail from "@views/pages/activity/activity-management/ordinary-detail.vue";
import auditHead from "@views/pages/common/result-head.vue";

interface videoType {
  url: String
  image: String
  title: String
}
@Component({
  components: {
    activityDesc,
    PreviewPics,
    VideoPlayer,
    AuditForm,
    DetailRes,
    OrdinaryActivityDetail,
    auditHead
  }
})
export default class auditPerform extends Vue {
  // 修改按钮是否展示
  private editBtnStatus: any = false;
  private auditParams:any = {}
  // 状态
  private AUDIT_DATA_STATUS = AUDIT_DATA_STATUS
  private resourceType: string = 'CONTENT_TYPE_ACTIVITY_RESULT'
  // 获取成果审核记录
  recordList: any = []
  private getRecords() {
    getRecords({ activityId: this.$route.query.rId, resourceType: this.resourceType }).then((res: any) => {
      if (res.datas && res.datas.length) {
        this.recordList = res.datas
      } else {
        this.recordList = []
      }
    })
  }

  private activityData:any = null
  private getActivityDetial() {
    getActivityDetial({id: this.$route.query.id}).then((res: any) => {
        if (res.code === 0) {
          res.data.resultId = this.$route.query.rId
          this.activityData = res.data;
          this.auditParams.resourceName = res.data.name
        }
    });
  }

  /* S 查看大图 */
  private visible: Boolean = false
  private imgUrl: Array<string> = []
  private currIndex = 0
  private viewImage(url: Array<string>, idx: number) {
    this.imgUrl = url
    this.visible = true
    this.currIndex = idx
  }
  /* E 查看大图 */
  /*S视频*/
  private show: Boolean = false
  private showVideo: videoType = {
    url: '',
    image: '',
    title: ''
  }

  //审核状态
  private headData = <any>null;
  getDesc() {
    resultView({ id: this.$route.query.rId, auditFlag: 1, manageId: this.$route.query.manageId }).then((res: any) => {
      if (res.code === 0) {
        this.headData = {
          status: res.data.manageAuditStatus,
          date: res.data.manageUpdateTime,
          remark: res.data.manageAuditResult
        };
      }
    })
  }
  goEdit() {
    this.$router.push({
      path: '/res-submit-md',
      query: { id: this.$route.query.id,rId:this.$route.query.rId }
    })
  }
  //返回
  goBack() {
    this.$router.go(-1)
  }
  mounted() {
    this.editBtnStatus = this.$route.query.canModify
    this.auditParams.resourceId = this.$route.query.rId
    this.auditParams.resourceType = this.resourceType
    this.getDesc()
    this.getRecords()
    this.getActivityDetial()
  }
}
</script>

<style lang="scss" scoped>
.perform-wrap {
  padding-bottom: 30px;
  .control {
    width: 300px;
  }
}
.tips-panel {
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
      content: '';
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
.list-panel {
  margin-top: 10px;
  .item {
    padding: 10px 0;
    line-height: 25px;
    &.tit {
      border-top: 1px solid $borderLight;
    }
  }
  .red {
    vertical-align: middle;
  }
  .item-name {
    width: 150px;
    text-align: right;
    margin-right: 13px;
    font-weight: 600;
    color: $font01;
    &.tit {
      font-size: 1.2em;
    }
  }
  .item-content {
    width: 80%;
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
}
</style>
