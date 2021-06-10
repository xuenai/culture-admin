<template>
  <div class="container">
    <!-- 审核-内容审核-投诉详情 -->
    <div class="list-panel">
      <div class="tips-panel clearfix">
        <span class="fl title">基本信息</span>
      </div>
      <Row class="item">
        <i-col span="2" class="item-name">姓名：</i-col>
        <i-col span="22" class="item-content">{{detail.name}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">手机号：</i-col>
        <i-col span="22" class="item-content">{{detail.phone}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">性别：</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex === 0">保密</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex === 1">男</i-col>
        <i-col span="22" class="item-content" v-if="detail.sex === 2">女</i-col>
      </Row>
      <div class="tips-panel clearfix">
        <span class="fl title">投诉事件</span>
      </div>
      <Row class="item">
        <i-col span="2" class="item-name">投诉类型：</i-col>
        <i-col span="22" class="item-content" v-if="detail.complaintsType === 'personnel'">人员</i-col>
        <i-col span="22" class="item-content" v-if="detail.complaintsType === 'service'">服务</i-col>
        <i-col span="22" class="item-content" v-if="detail.complaintsType === 'environment'">环境</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">被投诉方：</i-col>
        <i-col span="22" class="item-content">{{detail.respondent}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">事件发生地：</i-col>
        <i-col span="22" class="item-content">{{detail.address}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">发生时间：</i-col>
        <i-col span="22" class="item-content">{{detail.incidentTime}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">投诉事由：</i-col>
        <i-col span="22" class="item-content">{{detail.complaintsReasons}}</i-col>
      </Row>
      <Row class="item" v-if="detail.evidenceImages && detail.evidenceImages.length>=1">
        <i-col span="2" class="item-name">上传凭证：</i-col>
        <i-col span="22" class="item-content img-list">
          <div class="img-list fl">
            <p class="img" v-for="(items , picIndex) in detail.evidenceImages" :key="items" >
              <img :src="items" alt class="daq-img" @click.stop="viewImage(detail.evidenceImages, picIndex)">
            </p>
            <p class="img view-images-box" v-for="(ele) in detail.evidenceVideo" :key="ele.url" @click.stop="openVideo(ele.url, '投诉凭据')">
              <img :src="ele.cover" alt class="daq-img">
              <span class="cover"></span>
            </p>
          </div>
        </i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">是否允许公开：</i-col>
        <i-col span="22" class="item-content" v-if="detail.isPublic === true">公开</i-col>
        <i-col span="22" class="item-content" v-if="detail.isPublic === false">不公开</i-col>
      </Row>
      <div class="tips-panel clearfix" v-if="detail.satisfied">
        <span class="fl title">处理结果评价</span>
      </div>
      <div class="item-btn mt20" v-if="detail.satisfied">
        <Button
        v-show='detail.satisfied'
        :class="detail.satisfied === 1 ? 'active' : ''"
        type="primary"
        icon="ios-thumbs-up"
        ghost
        >满意</Button>
        <Button
        icon="ios-thumbs-down"
        v-show='detail.satisfied'
        :class="detail.satisfied === 0 ? 'active' : ''"
        >不满意</Button>
      </div>
    </div>
    <!-- 进度 -->
    <div class="audit-record ml20">
      <div class="tips-panel clearfix">
        <span class="fl title">处理记录</span>
      </div>
      <Timeline class="record-panel" v-if="detail.recordsLogs && detail.recordsLogs.length >= 1">
        <Timeline-item v-for="(row,accInd) in detail.recordsLogs" :key="accInd">
          <p class="time">{{row.createTime}}</p>
          <p class="content">由【{{row.name}}】【{{row.phone.substr(row.phone.length-4,row.phone.length)}}】{{auditStatus}}，{{auditStatus}}结果：{{getAuditStatusTxt(row.auditStatus)}}。
            <span v-if="row.auditResult">{{auditStatus}}备注：{{row.auditResult}}</span>
          </p>
        </Timeline-item>
      </Timeline>
      <Form :label-width="100">
        <div class="mt20">
          <FormItem class="item" label="处理结果:">
            <Button @click="setStatus(4)" :class="replayArr.status === 4 ? 'active' : ''">待处理</Button>
            <Button class="ml20" @click="setStatus(5)" :class="replayArr.status === 5 ? 'active' : ''">已受理</Button>
            <Button class="ml20" @click="setStatus(6)" :class="replayArr.status === 6 ? 'active' : ''">已处理</Button>
          </FormItem>
          <FormItem class="item" label="处理备注：">
            <Input
              type="textarea"
              v-model="replayArr.handleResults"
              placeholder="请填写处理意见"
              :autosize="{minRows: 5,maxRows: 5}"
              :maxlength="200"
            />
            <span>200字以内</span>
          </FormItem>
          <!-- 快捷回复 -->
          <fastReply @reply="getReply"></fastReply>
        </div>
        <FormItem class="item mt20">
          <Button type="primary" class="fl" @click="handleSubmit">处理</Button>
          <Button class="fl ml20" @click="goback">返回</Button>
        </FormItem>
      </Form>
    </div>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="picIndex"></PreviewPics>
    <VideoPlayer :showVideo="showVideo" :show="showPlayer" v-if="showVideo.url"></VideoPlayer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import fastReply from "@views/pages/common/fast-reply.vue";
import {PreviewPics} from '@components/index';
import { getVideoCover } from "@util/comm";
import {
  getComplaintsDetail,
  saveComplaints  
   } from "@service/content";
@Component({
  components: {
    VideoPlayer,
    getComplaintsDetail,
    saveComplaints,
    PreviewPics,
    fastReply
  }
})
export default class Complaint extends Vue {
  private loading: Boolean = true; // 数据是否加载中
  mounted() {
    this.getDetail();
  }
   //设置快捷回复
    getReply(item:any){
        (this.replayArr as any).handleResults=item;
    }
  /**
   * Tab
   */
  private getStatusTxt(status: number) {
    switch (status) {
      case 4: {
        return "审核通过";
      }
      case 6: {
        return "审核不通过";
      }
      default: {
        return "待审核";
      }
    }
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
  /* S 获取详情 */
  private detail: any = {
    status: ''
  };
  // 获取处理结果
  private setStatus(num: number){
    this.replayArr.status = num;
  }
  /**
   * 投诉详情
   */
  private auditStatus: string = ''; // 处理状态
  private getDetail() {
    getComplaintsDetail({
      id: this.$route.query.id
    }).then((data: any) => {
      if(data.code === 0){
        if((data.data as any).recordsLogs){
          (data.data as any).recordsLogs.forEach((data: any) => {
            data.auditStatus === 5 ? this.auditStatus = '受理' : this.auditStatus = '处理';
          });
        }
        this.detail = data.data;
        this.detail.evidenceVideo = this.detail.evidenceVideo.map((url:string) =>({url, cover: ''}))
        if (this.detail.evidenceVideo) {
          if (!this.detail.evidenceVideoCover || this.detail.evidenceVideoCover.length != this.detail.evidenceVideo.length) {
            this.detail.evidenceVideo.forEach( (ele: any, i: number) => getVideoCover(ele.url).then((res: any) => ele.cover = res.cover) )
          } else if (this.detail.evidenceVideoCover.length) {
            this.detail.evidenceVideo.forEach((e:any, i:number) => e.cover = this.detail.evidenceVideoCover[i])
          }
        }
        // 受理结果
        this.replayArr.status = data.data.status;
      }
    });
  }
  /* E 获取详情 */

  /* S 提交处理 */
  private replayArr: any ={
    status: '', // 处理结果
    handleResults: '' // 处理备注
  }
  private handleSubmit(){
    saveComplaints({
      id: this.$route.query.id,// ID
      status: this.replayArr.status, // 处理状态
      handleResult: this.replayArr.handleResults // 处理结果
    }).then((data: any) => {
      if (data.code === 0) {
        this.$Message.success("操作成功");
        this.goback();
      }
    });
  }
  /* E 处理 */

  /* S 查看大图 */
  private imgUrl:Array<string> = []
  private visible: Boolean = false // 图片查看
  private picIndex = 0
  private viewImage(url: Array<string>, index:number) {
    this.imgUrl = url;
    this.visible = true;
    this.picIndex = index
  }
  /* E 查看大图 */

  // 返回
  private goback () {
    this.$router.go(-1)
  }
  /*S视频*/
  private showPlayer: boolean = false;
  private showVideo: any = {
      url: "",
      image: "",
      title: ""
  };

  private openVideo(url: any, name: string) {
    this.showPlayer = true;
    this.showVideo.url = url;
    this.showVideo.title = name;
  }

  /*E视频*/
}
</script>

<style scoped lang="scss">
.container{
  .cover{
    display: block;
  }
  padding: 15px;
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
    .item {
      padding: 10px 0;
      line-height: 25px;
    }
    .red {
      vertical-align: middle;
    }
    .item-btn {
      button {
        margin-left: 80px;
        &:hover{
        }
      }
    }
    .item-name {
      width: 150px;
      text-align: right;
      margin-right: 5px;
      font-weight: 600;
      color: $font01;
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
    padding-top: 20px;
    border-top: 1px solid $borderLight;
    margin: 15px 0 15px 20px;
    .record-panel {
      padding: 20px 20px 0 20px;
      margin-bottom: 20px;
      // border-bottom: 1px solid #e2e2e2;
      .content {
        color: $font03;
      }
    }
  }
  .btn-group {
    width: 100px;
    padding-bottom: 20px;
    text-align: right;
  }
  .title-tool {
    position: relative;
    width: 100%;
    line-height: 16px;
    i {
      font-size: 20px;
      color: $theme;
      vertical-align: middle;
    }
  }
}
.active{
  background: none !important;
}
</style>
