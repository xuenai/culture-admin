<template>
  <div class="content">
    <!--tab切换-->
    <Tabs active-key="key2" class="tab-wrap" :animated="false">
        <!--全部-->
        <Tab-pane label="全部" key="key1">
          <TabAll></TabAll>
        </Tab-pane>
        <!--待审核-->
        <Tab-pane :label="num4>0?numLabel({name:'待审核',count:num4}):'待审核'" key="key2">
            <TabAll :auditStatus="4" @change="getNum"></TabAll>
        </Tab-pane>
        <!--不通过-->
        <Tab-pane label="不通过" key="key3">
            <TabAll :auditStatus="79"></TabAll>
        </Tab-pane>
    </Tabs>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import TabAll from './pane.vue'
import {getConReportAuditList} from '@service/audit'

@Component({
  components: {
    TabAll
  }
})
export default class ComponentName extends Vue {
    // 待审核数量
    private num4?: number = 0

    private getNum () {
        getConReportAuditList({auditStatus: 4}).then((res:any) => {
            if (res.page) this.num4 = res.page.total
        });
    }

    //tab 数量
    private numLabel(opt: {name: string, count: number}) {
        return (h:any) => {
            return h("div", [
                h("span", `${opt.name} `),
                h("Badge", {
                    props: {
                        count: opt.count
                    }
                })
            ]);
        }
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
