/*
 * @Author: Hexg
 * @Date: 2019-07-01 17:27:38
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-07-01 20:45:57
 */
<template>
  <div class="areas">
    <BaseTable :configure="configure" @getList="getList">
      <Table :columns="columns" :data="datas" :loading="loading">
        
      </Table>
    </BaseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { BaseTable } from "@components/index";
import {getRegionList} from '@service/place'

@Component({
  components: {BaseTable}
})
export default class Areas extends Vue {
  private configure = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "right"
  }
  private requestParams = {
    currPage: 1,
    pageSize: 10
  }
  private loading = false
  private datas = []
  private columns = [
    {
      title: "地区名称",
      key: "name",
      align: "center",
    },
    {
      title: "地区编码",
      key: "region",
      align: "center",
    },
    {
      title: "经度",
      key: "longitude",
      align: "center",
    },
    {
      title: "纬度",
      key: "latitude",
      align: "center",
    }
  ]
  private getList (page?:any) {
    this.loading = true;
    if (page) {
      this.requestParams.currPage = page.currPage;
      this.requestParams.pageSize = page.pageSize;
    }
    getRegionList(this.requestParams).then(res => {
      this.loading = false
        let { page, datas } = res;
        if (page) {
          this.configure.page = page as any;
        }
        if (datas) {
          this.datas = datas;
        }
    }).catch(err =>{
      this.loading = false
    })
  }
  created () {
    this.getList()
  }
}
</script>

<style lang='scss' scoped>
.areas {
  padding: 20px 20px 0;
  
}
</style>
