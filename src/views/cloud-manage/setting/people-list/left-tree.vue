<template>
  <Tree :data="baseData" :show-checkbox="false" @on-select-change="change"></Tree>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getSiteOrgList } from "@service/common"
import { AppModule } from "@store/modules/app";
@Component
export default class LeftTree extends Vue {
  private baseData:any = [];
  get userInfo() {
    return AppModule.userInfo;
  }
  mounted() {
    this.getList()
  }
  private getList() {
    getSiteOrgList({enablePage: false, queryType: 3}).then((res: any) => {
      if (res.code === 0) this.baseData = this.toTree(res.datas);
    })
  }
  // 一维数组转tree结构
  private toTree(datas: any[]): any[] {
    datas.forEach((d:any) => {
      d.title = d.name + '('+ d.userCount +')'
      d.expand = true
      if (d.pid) {
        let parentItem = datas.find((el:any) => el.id === d.pid)
        if (parentItem) {
          parentItem.children = parentItem.children || []
          parentItem.children.push(d)
        }
      }
    });
    let res = datas.filter((d:any) => d.level === 1).concat({
      title: AppModule.siteInfo.name + '组织机构',
      expand: true,
      level: 1,
      children: datas.filter((d:any) => d.level === 2)
    }).reverse()
    let unSet = res.find((d:any) => d.name ==='未分配人员' && d.level === 1)
    if (unSet) unSet.id = -1; // 未分配人员设置id为-1
    return res

    //totree的另一个方式
    // 二维数组，每个数组存对应level的项
    // let tmpArr: any[][] = []
    // datas.forEach((d:any) => {
    //   tmpArr[d.level - 1] = tmpArr[d.level - 1] || []
    //   tmpArr[d.level - 1].push(d)
    // });
    // level1可能不存在 过滤一下
    // tmpArr = tmpArr.filter((arr:any) => arr);
    // tmpArr.forEach((lvArr: any[], i: number) => {
    //   let nextLevel = tmpArr[i + 1] || []
    //   lvArr.forEach((d:any) => {
    //     d.child = nextLevel.filter((el:any) => el.pid === d.id)
    //   })
    // })
    // return tmpArr[0]
  }
  // 点击树结构
  private change(data: any) {
    this.bus.$emit("selectSiteOrgId", data.length && data[0].id);
  }
}
</script>

<style scoped>
</style>
