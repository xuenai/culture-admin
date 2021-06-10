<template>
  <div class="pd20">
    <!-- 状态 -->
    <auditHead v-if="headData" :data="headData"></auditHead>
    <!-- 内容 -->
    <detailContent v-if="data" :data="data"></detailContent>
    <!-- 审核记录 -->
    <div class="audit-record ml20" v-if="recordList.length">
      <h3 class="title">审核记录</h3>
      <Timeline class="record-panel">
        <Timeline-item v-for="(record, i) in recordList" :key="i">
          <p class="time">{{record.createTime}}</p>
          <p class="content">
            由【{{record.name}}】【{{record.phone.substr(record.phone.length-4,record.phone.length)}}】审核，审核结果：{{AUDIT_DATA_STATUS[record.auditStatus]}}。审核备注：{{record.auditResult || '暂无'}}
          </p>
        </Timeline-item>
      </Timeline>
    </div>
    <!-- 审核 -->
    <detailAudit v-if="isAudit" :editBtnStatus="editBtnStatus" :params="auditParams"
      @turnPage="turnPage"></detailAudit>
    <div v-else class="btn-group">
      <Button v-if="editBtnStatus" type="info" @click="turnPage">修改</Button>
      <Button @click="back">返回</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import detailContent from "./detail-content.vue";
import detailAudit from "@components/audit-form/form.vue";
import { AUDIT_DATA_STATUS } from "@constant/index";
import { getProtectBase, getHeritageItem } from "@service/activity";
import { dictType } from "@service/common";
@Component({
  components: {
    auditHead,
    detailContent,
    detailAudit
  }
})
export default class auditResultHead extends Vue {
  // 内容
  private data: object | null = null;
  //审核状态
  private headData: object | null = null;
  // 审核记录
  private recordList: object[] = [];
  // 状态
  private AUDIT_DATA_STATUS = AUDIT_DATA_STATUS;
  private isAudit: boolean = false; // 是不是审核
  private editBtnStatus: boolean = true; // 能否修改
  private auditParams: object = {};
  private type: string = "CONTENT_TYPE_HERITAGE_PROTECT_BASE";

  created() {
    this.getProtectBase(this.$route.params.id).then(() => {
      let data: any = this.data as any
      if (data) {
        this.getDictType("HERITAGE_LEVEL").then(
          (datas: any) => datas.forEach((d: any) => (d.id === data.level && (data.level = d.name)))
        );
        this.getDictType("HERITAGE_BATCH").then(
          (datas: any) => datas.forEach((d: any) => (d.id === data.batch && (data.batch = d.name)))
        );
        this.getDictType("HERITAGE_TYPE").then(
          (datas: any) => datas.forEach((d: any) => (d.id === data.type && (data.type = d.name)))
        );
        //
        Promise.all(
                    data.heritageItem
                      .split(",")
                      .map((id: number) => this.getHeritageItem(id))
                  ).then((arr: any[]) => (data.heritageItem = arr.map((d:any) => d.name).toString()));
      }
    });
    this.isAudit = String(this.$route.query.isAudit) === "true";
  }
  // 根据id获取非遗项目详情
  private getHeritageItem(id: number): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      getHeritageItem({ id })
        .then((res: any) => {
          if (res.code === 0) {
            resolve({ name: res.data.ctcHeritageItem.name, id });
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  }
  // 获取详情
  private getProtectBase(id: any) {
    return getProtectBase({ id }).then((res: any) => {
      if (res.code === 0) {
        let auditData = res.data.auditRecordsVo;
        this.headData = {
          status: auditData.currentAuditStatus,
          date: auditData.dateTime,
          remark: auditData.currentAuditResult
        };
        this.data = res.data.ctcHeritageProtectBase;
        this.recordList = res.data.auditRecordsVo.recordsLog;
        this.editBtnStatus = ![7,9].includes(auditData.currentAuditStatus);
        this.auditParams = {
          resourceName: (this.data as any).name,
          resourceType: this.type,
          resourceId: (this.data as any).id
        };
      }
    });
  }

  private getDictType(type: string) {
    return dictType({ type }).then((res: any) => {
      if (res.code === 0) {
        return res.datas;
      } else {
        return [];
      }
    });
  }

  private turnPage() {
    if (this.data) {
      this.$router.push({
        path: "/protect-add",
        query: { id: (<any>this.data).id }
      });
    }
  }

  private back() {
    window.history.back();
  }
}
</script>

<style scoped lang="scss">
.audit-record {
  padding-top: 20px;
  border-top: 1px solid $borderLight;
  margin: 15px 0 15px 20px;
  .record-panel {
    padding: 20px 20px;
    .content {
      color: $font03;
    }
  }
}

.btn-group {
  margin-left: 20px;
  button {
    margin-left: 20px;
  }
}
</style>
