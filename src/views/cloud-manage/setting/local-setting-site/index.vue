<template>
  <div class="local">
    <Tabs :animated="false">
      <TabPane label="基本资料">
        <LocalInfo></LocalInfo>
      </TabPane>
      <TabPane label="名片">
        <VisitingCard></VisitingCard>
      </TabPane>
      <TabPane label="乡村旅游名片">
        <AgritainmentVisitingCard></AgritainmentVisitingCard>
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import LocalInfo from './info.vue'
import VisitingCard from './visiting-card.vue'
import AgritainmentVisitingCard from './agritainment-visiting-card.vue';

@Component({components: {LocalInfo, VisitingCard, AgritainmentVisitingCard}})
export default class LocalSetting extends Vue {
  
}
</script>

<style lang='scss' scoped>
.local {
  position: relative;
  padding: 24px 15px 24px;
}
</style>
