<template>
  <div class="container">
    <resultHead :data="headData" v-if="headData.status"></resultHead>
    <div class="list-panel">
      <Row class="item">
        <Col span="2" class="item-name">创建者</Col>
        <Col span="22" class="item-content">{{detail.createCompanyName}}</Col>
      </Row>
      <Row class="item">
        <Col span="2" class="item-name">话题名称</Col>
        <Col span="22" class="item-content">{{detail.name}}</Col>
      </Row>
      <Row class="item">
        <Col span="2" class="item-name">话题类型</Col>
        <Col span="22" class="item-content">{{topicType}}</Col>
      </Row>
      <Row class="item" v-if="detail.image">
        <Col span="2" class="item-name">话题主图</Col>
        <Col span="22" class="item-content img-list">
          <p class="img daq-no-photo" v-for="(item, idx) in detail.image.split(',')" :key="`${item}${idx}`">
            <img :src="item" @click="previewPic(idx)" alt>
          </p>
        </Col>
      </Row>
      <Row class="item">
        <Col span="2" class="item-name">活动日期</Col>
        <Col span="22" class="item-content">
          {{detail.startDate}}
          <span v-if="detail.startDate && detail.endDate">-</span>
          {{detail.endDate}}
        </Col>
      </Row>
      <Row class="item">
        <Col span="2" class="item-name">活动时间</Col>
        <Col span="22" class="item-content">
          {{detail.startTime}}
          <span v-if="detail.startTime && detail.endTime">-</span>
          {{detail.endTime}}
        </Col>
      </Row>
      <Row class="item" v-if="detail.introduce">
        <Col span="2" class="item-name">话题介绍</Col>
        <Col span="22" class="item-content" v-html="detail.introduce"></Col>
      </Row>
      <Row class="item" v-if="detail.rule">
        <Col span="2" class="item-name">话题规则</Col>
        <Col span="22" class="item-content" v-html="detail.rule"></Col>
      </Row>
      <Row class="item" v-if="detail.sort && $store.state.app.userInfo.dataType == 'SITE'">
        <Col span="2" class="item-name">话题排序</Col>
        <Col span="22" class="item-content">{{detail.sort}}</Col>
      </Row>
    </div>
    <!--审核记录-->
    <div
      class="tips-panel clearfix"
      v-if="detail.auditRecordsVo && detail.auditRecordsVo.recordsLog.length"
    >
      <span class="fl title">审核记录</span>
    </div>
    <Timeline class="pd20" v-if="detail.auditRecordsVo && detail.auditRecordsVo.recordsLog.length">
      <Timeline-item v-for="item in detail.auditRecordsVo.recordsLog" :key="item.createTime">
        <p class="time">{{item.createTime}}</p>
        <p class="content">
          由【{{item.name}}】【{{item.phone.substr(item.phone.length - 4, 4)}}】审核，审核结果：
          <span
            v-if="item.auditStatus === 1"
          >正常</span>
          <span v-if="item.auditStatus === 2">禁用</span>
          <span v-if="item.auditStatus === 3">草稿</span>
          <span v-if="item.auditStatus === 4">待审核</span>
          <span v-if="item.auditStatus === 5">审核中</span>
          <span v-if="item.auditStatus === 6">审核通过</span>
          <span v-if="item.auditStatus === 7 || item.auditStatus === 79">审核不通过</span>
          <span v-if="item.auditStatus === 8">已撤回</span>
          <span v-if="item.auditStatus === 9">终止</span>
          。审核备注：{{item.auditResult}}
        </p>
      </Timeline-item>
    </Timeline>
    <!-- 普通修改 -->
    <Row class="item mg20" v-if="!topicId">
      <Col span="24">
        <Button v-if="historyLength > 1" type="primary" @click="goHistory">返回</Button>
        <router-link :to="{path: '/topic-edit', query: {id: detail.id}}">
          <Button class="btn-cancel ml20" v-if="$route.query.from !== 'analysis'">修改</Button>
        </router-link>
      </Col>
    </Row>
    <!-- 审核预览 -->
    <Row class="item mg20" v-if="topicId && !checked">
      <Col span="24">
        <Button type="primary" @click="goHistory">返回</Button>
        <router-link
          :to="{path: '/topic-edit', query: {id: detail.id, topicId: topicId}}"
          v-if="detail.auditRecordsVo && detail.auditRecordsVo.currentAuditStatus === 4"
        >
          <Button class="btn-cancel ml20">修改</Button>
        </router-link>
      </Col>
    </Row>
    <!-- 审核后 -->
    <Row class="item mg20" v-if="topicId && checked && detail.auditRecordsVo && detail.auditRecordsVo.currentAuditStatus !== 4">
      <Col span="24">
        <Button type="primary" @click="goHistory">返回</Button>
      </Col>
    </Row>
    <!-- 审核 -->
    <Form
      :label-width="100"
      class="form"
      v-if="checked && detail.auditRecordsVo && detail.auditRecordsVo.currentAuditStatus === 4"
    >
      <FormItem class="item" label="处理结果：">
        <span class="choice-tag" @click="setBatch(6)" :class="batch === 6 ? 'active' : ''">通过</span>
        <span
          class="choice-tag"
          @click="setBatch(1)"
          :class="batch !== 6 && batch !== 0 ? 'active' : ''"
        >不通过</span>
        <p v-show="batch !== 6 && batch !== 0">
          <RadioGroup @on-change="setBatch($event)">
            <Radio label="回退"></Radio>
            <Radio label="终止" class="ml20"></Radio>
          </RadioGroup>
        </p>
      </FormItem>
      <FormItem class="item" label="处理备注：">
        <Input
          type="textarea"
          :rows="4"
          :maxlength="200"
          placeholder="请填写处理意见"
          style="width: 500px;"
          v-model="auditResult"
        />
      </FormItem>
       <!-- 快捷回复 -->
      <fastReply @reply="getReply" class="mt10" ></fastReply>
      <FormItem class="item" label>
        <Button type="primary" @click="submitChecked">审核</Button>
        <router-link :to="{path: '/topic-edit', query: {id: detail.id, topicId: topicId}}">
          <Button class="btn-cancel ml20">修改</Button>
        </router-link>
        <Button v-if="historyLength > 1" class="ml20" @click="goHistory">返回</Button>
      </FormItem>
    </Form>
    <PreviewPics v-model="previewPicShow" :imgs="images" :currIndex="previewPicIndex"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import resultHead from "@views/pages/common/result-head.vue";
import fastReply from "@views/pages/common/fast-reply.vue";
import { getTopicDesc } from "@service/topic";
import { saveTopicAuditList } from "@service/audit";
import { PreviewPics } from "@components/index";
import { tagView } from "@service/common";
@Component({
  components: {
    resultHead,
    PreviewPics,
    fastReply
  }
})
export default class detail extends Vue {
  //设置快捷回复
  getReply(item:any){
      this.auditResult=item;
  }
  historyLength = window.history.length;
  private headData: object = {};
  private detail: object = {};
  private checked: Boolean = false;
  private topicId: any = "";
  private auditResult: String = "";
  mounted() {
    this.getDesc();
    if (this.$route.query.checked) {
      this.checked = true;
    }
    if (this.$route.query.topicId) {
      this.topicId = this.$route.query.topicId;
    }
  }
  /** 图片浏览 S */
  private previewPicShow = false;
  private previewPicIndex = 0;
  private images:Array<string> = [];
  previewPic (idx: number) {
    this.previewPicShow = true;
    this.previewPicIndex = idx;
  }
  /** 图片浏览 E*/
  private getDesc() {
    getTopicDesc({
      id: this.$route.query.id
    }).then(data => {
      this.detail = data.data as Object;
      let _data = data.data;
      this.images = data.data.image.split(',');
      this.headData = {
        remark: _data.auditRecordsVo.currentAuditResult,
        date: _data.auditRecordsVo.dateTime,
        status: _data.auditRecordsVo.currentAuditStatus
      };
      this.getTagView(this.$route.query.id);
    });
  }
  //   返回
  private goHistory() {
    this.$router.go(-1);
  }
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
  // 设置通过 || 不通过
  private batch: Number = 0;
  private setBatch(type: any) {
    if (type === "回退") {
      this.batch = 7;
      return;
    }
    if (type === "终止") {
      this.batch = 9;
      return;
    }
    if (type !== "回退" || type !== "终止") {
      this.batch = type;
      return;
    }
  }
  // 审核
  private submitChecked() {
    if (this.batch === 0) {
      this.$Message.error("请选择是否通过！");
      return;
    }
    if (this.batch === 1) {
      this.$Message.error("不通过请选择类型！");
      return;
    }
    if (this.batch !== 6 && !this.auditResult) {
      this.$Message.error("请填写处理备注");
      return;
    }
    saveTopicAuditList({
      auditStatus: this.batch,
      id: this.$route.query.topicId,
      auditResult: this.auditResult,
      resourceName: this.$route.query.resourceName
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("审核成功");
        this.$router.go(-1)
      }
    });
  }
  //类型标签详情
  private topicType:string='';
  getTagView(id:any){
    tagView({
      id
    }).then((res:any)=>{
      if(res.code===0){
      this.topicType=res.data.labelName
      }
    })
  }
}
</script>

<style scoped lang="scss">
.container{
  padding: 15px;
}
.form {
  padding-top: 20px;
  border-top: 1px solid #e2e2e2;
}
.w150 {
  width: 150px;
}
.ml20 {
  margin-left: 20px;
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
  .item-name {
    width: 80px;
    text-align: right;
    margin-right: 13px;
    font-weight: 600;
    color: $font01;
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
</style>
