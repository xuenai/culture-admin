<!--
 * @Author: 任智勇
 * @since: 2019-05-30 11:38:22
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-31 11:10:17
 -->
<template>
  <div class="content">
    <Tabs value="name1" :animated="false" @on-click="changeBack">
      <TabPane :label="label.label1" name="name1">
          <Audit @onChange="onchange"></Audit>
      </TabPane>
      <TabPane :label="label.label2" name="name2">
          <Back @onChange="onchange"></Back>
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getSiteAuditList } from "@service/cloud-manage";
import Audit from './audit.vue';
import Back from './back.vue';
@Component({ components: {Audit,Back} })
export default class ComponentName extends Vue {
  private label: any = {
    label1: (h: any) => {
      return h("div", [
        h("span", "待审核"),
        h("Badge", {
          props: {
            count: this.label.label4
          }
        })
      ]);
    },
    label2: (h: any) => {
      return h("div", [
        h("span", "已驳回"),
        h("Badge", {
          props: {
            count: this.label.label7
          }
        })
      ]);
    },
    label4: 0,
    label7: 0
  };
  mounted() {
    this.getSiteAuditList4();
    this.getSiteAuditList7();
  }
  private onchange(){
    this.getSiteAuditList4();
    this.getSiteAuditList7();
  }
  private getSiteAuditList4(){
    getSiteAuditList({status:4}).then((res: any) => {
        if (res.code === 0) {
          this.label.label4 = res.page.total
        }
      });
  }
  private getSiteAuditList7(){
    getSiteAuditList({status:7}).then((res: any) => {
        if (res.code === 0) {
          this.label.label7 = res.page.total
        }
      });
  }

  // 点击切换tab
  private changeBack(e:any){
    this.bus.$emit("onChangeBackList");
  }
}
</script>

<style lang='scss' scoped>
.content{
  padding: 0 15px 15px;
}

</style>
