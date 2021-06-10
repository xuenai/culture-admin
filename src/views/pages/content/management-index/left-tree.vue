<!--
 * @Author: 任智勇
 * @since: 2019-06-03 17:57:38
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-14 11:37:39
 -->
<template>
  <Tree :data="baseData" :show-checkbox="false"></Tree>
    <!-- @on-select-change="change"-->
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getChannelList } from "@service/content";
@Component
export default class LeftTree extends Vue {
  private baseData = [];
  mounted() {
    this.getList();
    // 列表数据发生转移时重新刷新树
    this.bus.$on("changeChannel", () => {
      this.getList();
    });
  }
  private getList() {
    getChannelList().then((res: any) => {
      this.baseData = this.anasysData(res.datas || []);
    });
  }
  // 点击树结构
  private change(data: any) {
    if (data.length) {
        this.channelId = data[0].id
    } else {
        this.channelId = ''
    };
    this.baseData = Object.assign([], this.baseData)
    this.bus.$emit("changeTreeId", data);
  }
  // 用来记录选中的栏目
    private channelId:any | string
  //   递归解析数据为 iview树需要的结构
  private anasysData(data: Array<any>) {
    let _this = this;
    if (data.length > 0) {
      let treeData: any = [];
      data.forEach((top: any) => {
        treeData.push({
          expand: true,
          id: top.id,
          name: top.name,
          num: top.num,
          render:
          // @ts-ignore
          (h:any, {root, node, data}) => {
              let hasCheck = top.id === this.channelId
              return h('span', {
                  class: {
                      'ivu-tree-title': true,
                      'ivu-tree-title-selected': hasCheck
                  },
                  attrs: {
                      title: `${data.name}(${data.num})`
                  },
                  on: {
                      click: (e?:any) => {
                          if (e) {
                              e.stopPropagation();
                              e.preventDefault();
                          } else {
                              (window as any).event.returnValue = false;
                              (window as any).event.cancelBubble = true;
                          }
                          if (hasCheck) {
                              this.change([])
                          } else {
                              this.change([data])
                          }
                      }
                  }
              }, `${data.name}(${data.num})`)
          },
          children: _this.anasysData(top.subset)
        });
      });
      return treeData;
    } else {
      return [];
    }
  }
}
</script>

<style scoped>
</style>
