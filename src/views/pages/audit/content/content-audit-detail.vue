<!--
 * @Author: 陈艳玲
 * @since: 2019-05-30 09:28:25
 * @LastAuthor   : 任智勇
 * @lastTime     : 2020-02-13 17:13:46
 -->
<template>
  <div class="container">
    <auditHead :data="headerData"></auditHead>
    <!--列表-->
    <List :data="data"></List>

    <!--审核记录-->
    <div class="audit-record" v-if="recordsLog.length">
      <h3 class="title">{{checked ? '处理记录' : '审核记录'}}</h3>
      <Timeline class="record-panel">
        <Timeline-item v-for="(item,index) in recordsLog" :key="index">
          <p class="time">{{item.createTime}}</p>
          <p class="content">
            由【{{item.name}}】【{{item.phone.substr(item.phone.length-4,item.phone.length)}}】审核，审核结果：{{getStatusTxt(item.auditStatus)}}。
            <span v-if="item.auditResult">审核备注：{{item.auditResult}}</span>
          </p>
        </Timeline-item>
      </Timeline>
    </div>

    <div v-if="auditType === '1'">
      <Form ref="params" :label-width="100" class="mt20" :model="params" :rules="params.batch === 6 ? ruleValidate0 : ruleValidate1" v-if="checked && data.auditRecordsVo && data.auditRecordsVo.currentAuditStatus === 4">
        <FormItem class="item" label="处理结果：">
          <span class="choice-tag" @click="params.batch = 6" :class="params.batch === 6 ? 'active' : ''">通过</span>
          <span class="choice-tag" @click="params.batch = 7" :class="[7,9].includes(params.batch) ? 'active' : ''">不通过</span>
        </FormItem>
        <FormItem v-if="[7,9].includes(params.batch)" label="状态选择：" prop="batch">
          <RadioGroup v-model="params.batch">
            <Radio :label="7">回退</Radio>
            <Radio :label="9">终止</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem v-if="params.batch === 6" :key="6" class="item" label="处理备注：" prop="auditResult">
          <Input type="textarea" :rows="4" :maxlength="150" placeholder="请填写处理意见" style="width: 500px;" v-model="params.auditResult" />
        </FormItem>
        <FormItem v-if="[7,9].includes(params.batch)" :key="79" class="item" label="处理备注：" prop="auditResult">
          <Input type="textarea" :rows="4" :maxlength="150" placeholder="请填写处理意见" style="width: 500px;" v-model="params.auditResult" />
        </FormItem>
        <!-- 快捷回复 -->
        <fastReply @reply="getReply"></fastReply>
        <FormItem class="item mt20" label>
          <Button type="primary" @click="submitChecked()">审核</Button>
          <Button v-if="isSITE && userInfo.superSubmitButton && params.batch === 6" @click="submitChecked(2)" type="info">审核并提交上级审核</Button>
          <!-- 条件1：内容管理进去 $route.query.modify === '1' && [1,2,3,7,8].includes(data.status) -->
          <!-- 条件1：内容管理进去 $route.query.auditId && [4].includes(data.status) -->
          <a @click="routeUpdate" href="javascript:;" class="theme-blue action-btn ml20">
            <!-- v-if="($route.query.modify === '1' && [1,2,3,7,8].includes(data.status)) || ($route.query.auditId && [4].includes(data.status))" -->
            <Button type="primary">修改</Button>
          </a>
          <Button v-if="historyLength > 1" type="primary" @click="goBack" class="ml20">返回</Button>
        </FormItem>
      </Form>
      <div v-else>
        <!-- 条件1：内容管理进去 $route.query.modify === '1' && [1,2,3,7,8].includes(data.status) -->
        <!-- 条件1：内容管理进去 $route.query.auditId && [4].includes(data.status) -->
        <a @click="routeUpdate" href="javascript:;" class="theme-blue action-btn ml20">
          <Button type="primary" v-if="($route.query.modify === '1' && [1,2,3,7,8].includes(data.status)) || ($route.query.auditId && [4].includes(data.status))">修改</Button>
        </a>
        <Button v-if="historyLength > 1" type="primary" @click="goBack" class="ml20">返回</Button>
      </div>
    </div>
    <From2 v-else-if="auditType === '2'" :id="Number($route.query.auditId)" :resourceName="data.title"></From2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import List from "./common-list.vue";
import From2 from "./audit-form2.vue";
import fastReply from "@views/pages/common/fast-reply.vue";
import { getContentDetial, audit } from "@service/audit";
import { AppModule } from "@store/modules/app";

/**
 * 页面参数：
 * modify：0不能修改操作
 * auditType：默认不传为1，上报审核中的内容审核就传2
 * auditId：审核id
 * id：内容id
 * checked：auditType为1的 显示为内容审核
 * contentId：auditType为1的 内容审核id
 * */

@Component({
  components: {
    auditHead,
    List,
    From2,
    fastReply
  }
})
export default class contentAuditView extends Vue {
  get userInfo() {
    return AppModule.userInfo;
  }
  // 判断是否是站点端
  private isSITE:boolean = process.env.VUE_APP_STATUS === 'SITE';
  // 历史记录长度
  historyLength = window.history.length;
  // 当前审核类型（上报2、原来活动审核的1）
  private auditType: string | undefined = "";
  private headerData: object = {};
  private auditResult: String = "";
  private data: any = {};
  private recordsLog: Array<object> = []; // 审核记录列表
  private id: string | undefined = "";
  mounted() {
    this.getContentDetial();
    this.auditType = (this.$route.query.auditType as string) || "1";
    this.id = this.$route.query.id as string;
    if (this.$route.query.checked) {
      this.checked = true;
    }
  }
  //设置快捷回复
  getReply(item: any) {
    (this.params as any).auditResult = item;
  }
  private params: {
    auditResult?: any;
    batch: any;
  } = {
    auditResult: "",
    batch: 6
  };
  // 验证规则 通过
  private ruleValidate0 = <any>{
    auditResult: [
      {
        message: "最多150个字符",
        trigger: "blur",
        pattern: /^.{0,150}$/
      }
    ]
  };
  // 验证规则 不通过
  private ruleValidate1 = <any>{
    auditResult: [
      {
        required: true,
        message: "最大字符数150",
        trigger: "blur",
        pattern: /^.{0,150}$/
      }
    ],
    batch: [
      {
        required: true,
        message: "请选择操作结果"
      }
    ]
  };
  // 进入修改页
  private routeUpdate() {
    let path = "";
    switch ((this.data as any).contentType) {
      case "CONTENT":
        {
          path = "/con-add-content";
        }
        break;
      case "IMAGE":
        {
          path = "/con-add-image";
        }
        break;
      case "VIDEO":
        {
          path = "/con-add-video";
        }
        break;
      case "AUDIO":
        {
          path = "/con-add-audio";
        }
        break;
    }
    // audit 表示是审核跳转的详情
    this.$router.push({
      path: path,
      query: {
        id: (this.data as any).id,
        audit: "true",
        auditId: this.$route.query.auditId
      }
    });
  }
  // 返回上一页
  private goBack() {
    this.$router.go(-1);
  }

  private checked: Boolean = false;
  private getStatusTxt(status: number) {
    switch (status) {
      case 6: {
        return "审核通过";
      }
      case 7: {
        return "审核不通过";
      }
      case 9: {
        return "审核不通过";
      }
      case 79: {
        return "审核不通过";
      }
      default: {
        return "待审核";
      }
    }
  }
  // 审核
  private submitChecked(auditType = 1) {
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请将信息填写完整！");
        return;
      }

      audit({
        auditStatus: this.params.batch,
        id: this.$route.query.auditId,
        auditResult: this.params.auditResult,
        resourceName: this.data.title,
        auditType
      }).then((data: any) => {
        if (data.code === 0) {
          this.$Message.success("审核成功");
          this.getContentDetial();
          this.$router.go(-1);
        }
      });
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
.container {
  padding: 15px;
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
