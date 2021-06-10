<template>
  <div class="container">
    <Transfer
      class="fl"
      :data="companyList"
      :target-keys="targetKeys"
      :list-style="listStyle"
      :titles="['当前站点下属企业端账号列表', '待转移账号列表']"
      filterable
      @on-selected-change="selectChange"
      @on-change="handleChange">
    </Transfer>
    <Button class="move" :type="(siteId && targetSelectedKeys.length) ? 'primary' : 'default'" :disabled="!siteId || !targetSelectedKeys.length" @click="saveCompanyTransfer">👉转移到👉</Button>
    <Select filterable v-model="siteId" class="w300" placeholder="请选择目标站点">
      <Option :value="site.id" v-for="site in siteList" :key="site.id">{{ site.name }}</Option>
    </Select>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { getUserList } from "@service/upcloud"
import { getSiteChild, saveCompanyTransfer } from "@service/common"

@Component({
  components: {
  }
})
export default class MoveCompany extends Vue {
  // 框框样式
  private listStyle:any = { width: '500px', height: '600px' }

  created() {
    this.getUserList()
    this.getSiteChild()
  }
  
  // 右边key
  private targetKeys: number[] = []
  private handleChange (newTargetKeys: number[], direction: string, moveKeys: number[]) {
    this.targetKeys = newTargetKeys
  }

  // 待转列表选中项
  private targetSelectedKeys: number[] = []
  private selectChange (sourceSelectedKeys: number[], targetSelectedKeys: number[]) {
    this.targetSelectedKeys = targetSelectedKeys
  }

  // 获取企业账号列表
  private companyList: any[] = []
  private getUserList() {
    getUserList({pageSize: 9999}).then((res:any) => {
      if (res.code === 0) {
        this.companyList = res.datas.map((company:any) =>({
          key: company.orgId,
          label: company.name
        }))
      }
    })
  }

  // 获取站点列表
  private siteList: any[] = []
  private getSiteChild() {
    getSiteChild({notContainSelf: 1}).then((res:any) => {
      if (res.code === 0) {
        this.siteList = res.datas
      }
    })
  }

  private siteId: string = ''
  // 保存转移
  private saveCompanyTransfer() {
    let params = {
      types: "CONTENT_TYPE_VENUE",
      transferMap: {}
    }
    // @ts-ignore
    this.targetSelectedKeys.forEach((orgId: number) => params.transferMap[orgId] = this.siteId)
    saveCompanyTransfer({...params, transferMap: JSON.stringify(params.transferMap)}).then((res:any) => {
      if (res.code === 0) {
        this.$Message.success('转移成功！')
        this.companyList = this.companyList.filter((company:any) => !this.targetSelectedKeys.includes(company.key))
        this.targetKeys = this.targetKeys.filter((orgId:number) => !this.targetSelectedKeys.includes(orgId))
        this.targetSelectedKeys = []
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.w300 {
  width: 300px;
}
.container {
  padding: 30px;
  overflow: hidden;
  display: flex;
  align-items: center;
  .move {
    margin: 0 16px;
  }
}
</style>