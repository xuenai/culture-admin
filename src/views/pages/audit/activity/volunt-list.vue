<!--
 * @Author: 任智勇
 * @since: 2019-06-04 13:39:27
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-11 20:00:16
 -->
<template>
  <div class="content">
    <!--tab切换-->
    <Tabs active-key="key2" class="tab-wrap" :animated="false">
        <!--全部-->
        <Tab-pane label="全部" key="key1">
          <TabAll @onChange="getCount"></TabAll>
        </Tab-pane>
        <!--待审核-->
        <Tab-pane :label="waitNum>0?waitLabel:'待审核'" key="key2">
            <TabAll @onChange="getCount" :status="4"></TabAll>
        </Tab-pane>
        <!--不通过-->
        <Tab-pane label="不通过" key="key3">
            <TabAll :status="79"></TabAll>
        </Tab-pane>
    </Tabs>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import TabAll from './volunt-pane.vue'
import {getActiveOrderList} from '@service/activity'
@Component({
  components: {
    TabAll
  }
})
export default class ComponentName extends Vue {
    // 待审核数量
    private waitNum?: number = 0

    // 获取审核数量
    private getCount(){
        getActiveOrderList({orderStatus:4, resourceType: 'CONTENT_TYPE_ACTIVITY', valid: 2}).then((res:any) => {
            if(res.code === 0){
                this.waitNum = res.page.total
            }
        })
    }

    //tab 状态待审核数量
    private waitLabel(h: any) {
        return h("div", [
            h("span", "待审核 "),
            h("Badge", {
                props: {
                    count: this.waitNum
                }
            })
        ]);
    }
}
</script>

<style lang='scss' scoped>
.content{
    padding: 0 15px;
}
.tab-wrap {
    overflow: visible;
}
</style>
