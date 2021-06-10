<template>
  <div class="container">
    <!-- 内容-投诉管理-详情 -->
    <div class="tips-panel clearfix">
      <span class="fl title">基本信息</span>
    </div>
    <div class="list-panel">
      <Row class="item">
        <i-col span="2" class="item-name">姓名</i-col>
        <i-col span="22" class="item-content">{{detail.name}}</i-col>
      </Row>

      <Row class="item" v-if="detail.phone">
        <i-col span="2" class="item-name">手机号</i-col>
        <i-col span="22" class="item-content">{{detail.phone}}</i-col>
      </Row>
      <Row class="item" v-if="detail.sex">
        <i-col span="2" class="item-name">性别</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex === 0">保密</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex === 1">男</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex === 2">女</i-col>
      </Row>
      <div class="tips-panel clearfix">
        <span class="fl title">投诉事件</span>
      </div>
      <Row class="item" v-if="detail.complaintsType">
        <i-col span="2" class="item-name">投诉类型</i-col>
        <i-col span="22" class="item-content" v-if="detail.complaintsType === 'personnel'">人员</i-col>
        <i-col span="22" class="item-content" v-if="detail.complaintsType === 'service'">服务</i-col>
        <i-col span="22" class="item-content" v-if="detail.complaintsType === 'environment'">环境</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">被投诉方</i-col>
        <i-col span="22" class="item-content">{{detail.respondent}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">事件发生地</i-col>
        <i-col span="22" class="item-content">{{detail.address}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">发生时间</i-col>
        <i-col span="22" class="item-content">{{detail.incidentTime}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">投诉事由</i-col>
        <i-col span="22" class="item-content">{{detail.complaintsReasons}}</i-col>
      </Row>
      <Row class="item" v-if="detail.evidenceImages && detail.evidenceImages.length>=1">
        <i-col span="2" class="item-name">上传凭证</i-col>
        <i-col span="22" class="item-content img-list">
          <!-- 图片证据 -->
          <div class="img-list fl">
            <p class="img" v-for="(items , picIndex) in detail.evidenceImages" :key="items" >
              <img :src="items" alt class="daq-img" @click.stop="viewImage(detail.evidenceImages, picIndex)">
            </p>
          </div>
        </i-col>
      </Row>
      <Row class="item" v-if="detail.isPublic">
        <i-col span="2" class="item-name">是否允许公开</i-col>
        <i-col span="22" class="item-content" v-if="detail.isPublic === true">公开</i-col>
        <i-col span="22" class="item-content" v-if="detail.isPublic === false">不公开</i-col>
      </Row>
      <div class="tips-panel clearfix" v-if="detail.satisfied === 0 || detail.satisfied === 1">
        <span class="fl title">处理结果评价</span>
      </div>
      <div class="item-btn" v-if="detail.satisfied === 0 || detail.satisfied === 1">
        <Button
        class="satisf-btn"
        v-show="detail.satisfied === 1 "
        type="info"
        icon="ios-thumbs-up"
        ghost
        >满意</Button>
        <Button
        class="satisfied-btn"
        icon="ios-thumbs-down"
        v-show="detail.satisfied === 0 "
        >不满意</Button>
      </div>
    </div>
    <!-- 进度 -->
    <div class="tips-panel clearfix">
      <span class="fl title">处理记录</span>
    </div>
    <div class="audit-record">      
      <Timeline class="record-panel" v-if="detail.recordsLogs && detail.recordsLogs.length >= 1">
        <Timeline-item v-for="(row,accInd) in detail.recordsLogs" :key="accInd">
          <p class="time">{{row.createTime}}</p>
          <p class="content">由【{{row.name}}】【{{row.phone.substr(row.phone.length-4,row.phone.length)}}】{{auditStatus}}，{{auditStatus}}结果：{{getAuditStatusTxt(row.auditStatus)}}。
            <span v-if="row.auditResult">{{auditStatus}}备注：{{row.auditResult}}</span>
          </p>
        </Timeline-item>
      </Timeline>
    </div>
    <div class="btn-group">
      <Button @click="goback">返回</Button>
    </div>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="picIndex"></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import {PreviewPics} from '@components/index';
import {
  getComplaintsDetail,
  saveComplaints  
   } from "@service/content";
@Component({
  components: {
    VideoPlayer,
    getComplaintsDetail,
    saveComplaints,
    PreviewPics
  }
})
export default class Complaint extends Vue {
  private loading: Boolean = true; // 数据是否加载中
    // 接口请求params
  private params: any = {
    status: '6', // 处理状态
    complaintsType: '', // 投诉类型
    keyWord: '', // 关键字
    startDate: '', // 开始时间
    endDate: '' // 结束时间
  }
  // 获取审核状态 
  private getAuditStatusTxt(status: number) {
    switch (status) {
      case 4: {
        return "待处理";
      }
      case 5: {
        return "已受理";
      }
      case 6: {
        return "已处理";
      }
    }
  }
  mounted() {
    this.getDetail();
  }
  /* S 获取详情 */
  private detail: Object = {};
  private auditStatus: string = ''; // 处理状态
  private getDetail() {
    getComplaintsDetail({
      id: this.$route.query.id
    }).then(data => {
      if((data.data as any).recordsLogs){
        (data.data as any).recordsLogs.forEach((data: any) => {
          data.auditStatus === 5?this.auditStatus = '受理':this.auditStatus = '处理';
        });
      }
      this.detail = data.data;
    });
  }
  /* E 获取详情 */

  /* S 查看大图 */
  private imgUrl:Array<string> = []
  private visible: Boolean = false; // 图片查看
  private picIndex = 0;
  private viewImage(url: Array<string>, index:number) {
    this.imgUrl = url;
    this.visible = true;
    this.picIndex = index;
  }
  /* E 查看大图 */

  // 返回
  private goback () {
    this.$router.go(-1)
  }
}
</script>

<style scoped lang="scss">
.container{
  padding: 10px 15px;
  
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
  .list-panel {
    margin-top: 10px;
    .item {
      padding: 10px 0;
      line-height: 25px;
    }
    .red {
      vertical-align: middle;
    }
    .item-btn {
      button{
        margin: 10px 0 0 30px;
        &:hover{
          cursor: text;
        }
      }
      .satisf-btn{
        box-shadow: none;
        &:hover{
          border: 1px solid #2db7f5;
          color: #2db7f5;
        }
      }
      .satisfied-btn{
        box-shadow: none;
        &:hover{
          border: 1px solid #dcdee2;
          color: #515a6e;
        }
      }
    }
    .item-name {
      width: 90px;
      text-align: right;
      margin-right: 10px;
    }
    .item-content {
      width: 80%;
      color: $font05;
      .img {
        display: inline-block;
        width: 120px;
        height: 80px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        margin-right: 8px;
      }
    }
  }

  .audit-record {
    .record-panel {
      padding: 20px 20px 0 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e2e2e2;
      .content {
        color: $font03;
      }
    }
  }
  .btn-group {
    width: 100px;
    padding: 20px 30px;
    text-align: left;
  }
}
//标题
.title-tool {
    position: relative;
    width: 100%;
    line-height: 16px;
    font-size: 14px;
    font-weight: bold;
    padding: 0 0 10px 10px;
    margin: 0 20px 20px 0;
    border-bottom: 1px solid #dee3ed;
    i {
        position: absolute;
        top: 0;
        left: -8px;
        font-size: 20px;
        color: $theme;
    }
}
</style>
