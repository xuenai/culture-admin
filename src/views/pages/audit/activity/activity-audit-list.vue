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
          <TabAll @onChange="onChange" :activityClassify="activityClassify"></TabAll>
        </Tab-pane>
        <!--待审核-->
        <Tab-pane :label="waitNum>0?waitLabel:'待审核'" key="key2">
            <TabAll @onChange="onChange" :dataStatus="4" :activityClassify="activityClassify"></TabAll>
        </Tab-pane>
        <!--不通过-->
        <Tab-pane label="不通过" key="key3">
            <TabAll :dataStatus="79" :activityClassify="activityClassify"></TabAll>
        </Tab-pane>
    </Tabs>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import TabAll from './list.vue'
import {getActiveList} from '@service/audit'
import {getTagsSelect} from "@service/common";
@Component({
  components: {
    TabAll
  }
})
export default class ComponentName extends Vue {
    // 待审核数量
    private waitNum?: number = 0
    // 活动分类
    private activityClassify:Array<{labelName: string, id: number}> = []

    created () {
        this.getActivityClassify();
    }
    // 获取审核数量
    private getCount(){
        getActiveList({status:4}).then((res:any) => {
            if(res.code === 0){
                this.waitNum = res.page.total
            }
        })
    }
    // 列表数据发生变化时重新获取数量
    private onChange(){
        this.getCount()
    }

    // 获取活动分类
    private getActivityClassify() {
        getTagsSelect({
            resourceType: 'CONTENT_TYPE_ACTIVITY',
            labelType: 'ACTIVITY_CLASSIFY'
        }).then((res: any) => {
            if (res.code === 0) {
                this.activityClassify = res.datas
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
