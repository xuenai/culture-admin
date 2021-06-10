<template>
  <Form :label-width="80" ref="params" :model="formParams"
    :rules="resCode === 0 ? ruleValidate0 : ruleValidate1">
    <FormItem label="审核结果">
      <Button @click="resCode = 0" :type="resCode === 0 ? 'primary' : undefined">通过</Button>
      <Button class="ml20" @click="resCode = 1"
        :type="resCode === 1 ? 'primary' : undefined">不通过</Button>
    </FormItem>
    <template v-if="resCode === 0">
      <FormItem label="审核备注" class="mt20" prop="auditResult" :key="1">
        <Input :key="11" v-model="formParams.auditResult" type="textarea" :maxlength="150"
          style="width: 250px;" :autosize="{minRows: 5, maxRows: 10}"
          placeholder="请写下审核备注，不通过时审核备注必须填写。" />
        <span style="margin-left:15px;">150字以内</span>
      </FormItem>
      <FormItem label="">
        <Button class="mr20" @click="audit(6)" type="info">审核</Button>
        <Button v-if="isSITE && userInfo.superSubmitButton" @click="audit(6, 2)" type="info">审核并提交上级审核</Button>
        <Button class="mr20" @click="$emit('turnPage')" v-if="editBtnStatus">修改</Button>
        <Button @click="back">返回</Button>
      </FormItem>
    </template>
    <template v-else-if="resCode === 1">
      <FormItem label="状态选择" prop="auditStatus">
        <RadioGroup v-model="formParams.auditStatus">
          <Radio :value="7" :label="7">回退</Radio>
          <Radio :value="9" :label="9">终止</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="审核备注" class="mt20" :key="2" prop="auditResult">
        <Input :key="21" v-model="formParams.auditResult" type="textarea" :maxlength="150"
          style="width: 250px;" :autosize="{minRows: 5,maxRows: 10}"
          placeholder="请输入活动参与成功需要注意的特殊信息" />
        <span>150字以内</span>
      </FormItem>
      <FormItem label="">
        <Button class="mr20" @click="audit(formParams.auditStatus)" type="info">审核</Button>
        <Button @click="back">返回</Button>
      </FormItem>
    </template>
  </Form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { saveAuditProcess } from "@service/audit";
import { AppModule } from "@store/modules/app";

@Component({
  components: {}
})
export default class auditResultHead extends Vue {
  get userInfo() {
    return AppModule.userInfo;
  }
  // 判断是否是站点端
  private isSITE:boolean = process.env.VUE_APP_STATUS === 'SITE';
  @Prop() private params!: {
    resourceName: string;
    resourceType: string;
    resourceId: number;
  };
  // 修改按钮是否展示
  @Prop({ default: true }) private editBtnStatus!: boolean;
  // 通过0 不通过1
  private resCode: number = 0;
  // 审核params
  private formParams: {
    auditResult: string;
    auditStatus: number;
    auditType: number;
  } = {
    auditResult: "",
    auditStatus: 7,
    auditType: 1
  };
  // 验证规则
  private ruleValidate0 = <any>{
    auditStatus: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ]
  };
  // 验证规则
  private ruleValidate1 = <any>{
    auditResult: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      },
      {
        message: "最多150个字符",
        trigger: "blur",
        pattern: /.{1,150}$/
      }
    ],
    auditStatus: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ]
  };
  goEditPage () {
    // @ts-ignore
    let path = {
      // 非遗保护基地
      CONTENT_TYPE_HERITAGE_PROTECT_BASE: `/protect-add/?id=${this.params.resourceId}&saveType=audit`,
      // 非遗传习基地
      CONTENT_TYPE_HERITAGE_TEACHING_BASE: `/inherit-add/?id=${this.params.resourceId}&saveType=audit`,
      // 非遗体验基地
      CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE: `/experience-add/?id=${this.params.resourceId}&saveType=audit`,
      // 非遗传承人
      CONTENT_TYPE_HERITAGE_PEOPLE: `/audit-inheritor-modify?id=${this.params.resourceId}&pid=65&type=audit`,
      // 非遗项目
      CONTENT_TYPE_HERITAGE_ITEM: `/audit-project-modify?id=${this.params.resourceId}&type=audit`,
    }[this.params.resourceType]

    this.$router.push(path);
  }
  // 保存审核
  private audit(auditStatus: number, auditType = 1) {
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请将信息填写完整！");
        return;
      }
      this.formParams.auditStatus = auditStatus;
      this.formParams.auditType = auditType;
      saveAuditProcess({ ...this.params, ...this.formParams }).then(
        (res: any) => {
          if (res.code === 0) {
            this.$Message.success("操作成功!");
            this.back();
          }
        }
      );
    });
  }
  // back
  private back() {
    this.$router.go(-1);
  }
}
</script>

<style scoped lang="scss">
.mr20 {
  margin-right: 20px;
}
</style>
