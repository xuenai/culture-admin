/*
 * @Author: Hexg
 * @Date: 2019-07-08 14:39:00
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-07-09 10:14:42
 */

<template>
  <div>
    <Header :data="data"></Header>
    <Tabs :animated="false" class="tabs">
      <TabPane label="机审充值">
        <meassageAcout @onChange="getSiteAuditDetials" type="AUDIT" :num="data.auditNum" class="mt20"></meassageAcout>
      </TabPane>
      <TabPane label="短信充值">
        <meassageAcout @onChange="getSiteAuditDetials" type="SHORT" :num="data.smsNum" class="mt20"></meassageAcout>
      </TabPane>
      <TabPane label="关联店铺">
        <Store :code='data.shopCode'></Store>
      </TabPane>
      <TabPane label="打标签">
        <AddTag :params='{id: data.id, tags: data.tags}'></AddTag>
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Header from "./header.vue";
import meassageAcout from "./meassageAcout.vue";
import Store from './store.vue';
import AddTag from './addTag.vue';
import { getSiteAuditDetials } from "@service/cloud-manage";

@Component({ components: { Header, meassageAcout, Store, AddTag } })
export default class ComponentName extends Vue {
  private data: any = {};
  private getSiteAuditDetials() {
    getSiteAuditDetials({ id: this.$route.query.id }).then((res: any) => {
      this.data = res.data;
    });
  }
  mounted() {
    this.getSiteAuditDetials();
  }
}
</script>

<style lang='scss' scoped>
.tabs{
  padding:24px 15px 0;
}
.mt20 {
  margin-top: 20px;
}
</style>
