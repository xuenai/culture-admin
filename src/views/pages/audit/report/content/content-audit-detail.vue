<template>
  <div class="pd20 container">
    <auditHead :data="headerData"></auditHead>
    <!--列表-->
    <List :data="data"></List>

    <!--审核记录-->
    <div class="audit-record" v-if="recordsLog">
      <h3 class="title">{{checked ? '处理记录' : '审核记录'}}</h3>
      <Timeline class="record-panel">
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
    </div>

    <Form
      :label-width="100"
      class="mt20"
      v-if="checked && data.auditRecordsVo && data.auditRecordsVo.currentAuditStatus === 4"
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
      <FormItem class="item" label>
        <Button type="primary" @click="submitChecked()">审核</Button>
        <Button v-if="isSITE && userInfo.superSubmitButton && batch === 6" @click="submitChecked(2)" type="info">审核并提交上级审核</Button>
        <router-link
          tag="a"
          :to="{path: '/con-add-content', query: {id: data.id}}"
          class="ml20"
        >
          <Button>修改</Button>
        </router-link>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import List from "./common-list.vue";
import { getContentDetial, audit } from "@service/audit";
import { AppModule } from "@store/modules/app";
@Component({
  components: {
    auditHead,
    List
  }
})
export default class contentAuditView extends Vue {
  get userInfo() {
    return AppModule.userInfo;
  }
  // 判断是否是站点端
  private isSITE:boolean = process.env.VUE_APP_STATUS === 'SITE';
  private headerData: object = {};
  private auditResult: String = "";
  private data: object = {};
  private recordsLog: Array<object> = []; // 审核记录列表
  mounted() {
    this.getContentDetial();
    if (this.$route.query.checked) {
      this.checked = true;
    }
  }
  private checked: Boolean = false;
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
  private submitChecked(auditType = 1) {
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
    audit({
      auditStatus: this.batch,
      id: this.$route.query.id,
      auditResult: this.auditResult,
      auditType
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("审核成功");
        this.getContentDetial();
        this.$router.go(-1);
      }
    });
  }
  // 获取详情数据
  private getContentDetial() {
    let id = this.$route.query.id || "";
    getContentDetial({ id: id }).then((res: any) => {
      if (res.code === 0) {
        this.data = res.data;
        this.headerData = {
          status: res.data.auditRecordsVo.currentAuditStatus,
          date: res.data.auditRecordsVo.dateTime,
          remark: res.data.auditRecordsVo.currentAuditResult
        };
        this.recordsLog = res.data.auditRecordsVo.recordsLog;
      }
    });
  }
}
</script>

<style scoped lang="scss">
.ml20 {
  margin-left: 20px;
}
.audit-record {
  padding-top: 20px;
  border-top: 1px solid $borderLight;
  border-bottom: 1px solid $borderLight;
  margin: 15px 0;
  .record-panel {
    padding: 20px 20px;
    .content {
      color: $font03;
    }
  }
}
</style>
