<template>
  <div class="container pd15">
    <Alert
      >搜索关键字：{{ params.name || '无' }}，行政区域：{{
        cityName || '无'
      }}</Alert
    >
    <baseTable class="mt15" :configure="tableConfig" @getList="getList">
      <Table
        border
        :columns="tableData.headList"
        :data="tableData.bodyList"
        class="table"
        :loading="loading"
        @on-selection-change="setChecked"
      >
        <template slot-scope="{ row }" slot="msg">
          <div class="clearfix scenic-msg">
            <div class="fl msg-panel">
              <p class="scenic-name text-left">
                <!--已经拉取到站点的场馆-->
                <router-link
                  :to="{
                    path: '/venues-detail',
                    query: { id: row.resourceId, type: 'list' }
                  }"
                  tag="a"
                  class="theme-blue venues-tag"
                  v-if="row.useStatus === '已使用'"
                  >{{ row.name }}({{ row.qyCode }})
                </router-link>
                <!--还未拉取的场馆-->
                <router-link
                  :to="{
                    path: '/venues-detail',
                    query: { type: 'basic', code: row.qyCode }
                  }"
                  tag="a"
                  class="theme-blue venues-tag"
                  v-if="row.useStatus === '未使用'"
                  >{{ row.name }}({{ row.qyCode }})
                </router-link>
              </p>
              <p class="address" v-if="row.address">
                <i class="cloud-icon">&#xe606;</i>
                {{ row.address }}
              </p>
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="level">
          {{ row.level || '无星级' }}
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <a
            class="theme-blue action-btn"
            href="javascript:;"
            @click="basicBind(row, index)"
            v-if="row.useStatus === '未使用'"
            >使用</a
          >
          <span class="used" v-else>{{ row.useStatus }}</span>
        </template>
      </Table>
    </baseTable>
    <Button
      type="primary"
      @click="basicBind(checkedIds, -1)"
      v-if="tableData.bodyList && tableData.bodyList.length"
      >批量使用</Button
    >
    <div v-if="!loading">
      <router-link
        :to="{
          path: '/venues-add',
          query: { dictType: $route.query.dictType }
        }"
        class="btn-primary mt20"
        >没有我想要的，去添加 》</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import baseTable from '@components/baseTable/baseTable.vue'
import { basicList, basicBind } from '@service/place'

@Component({
  components: {
    baseTable
  }
})
export default class list extends Vue {
  /*S 列表*/
  private params: any = {
    name: '',
    region: '',
    queryParam: '',
    resourceType: 'CONTENT_TYPE_VENUE'
  }
  private cityName: any = ''
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: 'right'
  }
  private tableData: any = {
    headList: [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '场馆信息',
        key: 'msg',
        slot: 'msg',
        align: 'left'
      },
      {
        title: '场馆类型',
        key: 'venueType',
        align: 'center'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        slot: 'action',
        width: 150
      }
    ],
    bodyList: []
  }
  private loading: boolean = false

  private getList(page: any = this.tableConfig.page) {
    let _this = this
    _this.loading = true
    Object.assign(_this.params, page)
    basicList(_this.params).then(data => {
      _this.tableConfig.page = data.page ? data.page : {}
      _this.tableData.bodyList = data.datas as []
      _this.loading = false
       //已使用的设置不可选
      _this.tableData.bodyList.forEach((item:any)=>{
        if(item.useStatus=='已使用'){
          item._disabled=true;
        }
      })
    })
  }
  /*E 列表*/
  // 复选框
  private checkedIds: string = ''
  private setChecked(e: any) {
    let checkedIds: any = []
    e.map((item: any) => {
      checkedIds.push(item.qyCode as Number)
    })
    this.checkedIds = checkedIds.join(',')
  }
  /*S 拉取资源库资源*/
  private basicBind(row: any, index: any) {
    let _this = this,
      checkedLen = _this.checkedIds ? _this.checkedIds.split(',').length : 0
    if (index === -1 && !checkedLen) {
      _this.$Message.error('请选择你要使用数据')
      return
    }
    let config: any = {
      title: '使用生态数据',
      content: `确认要使用“${row.name ||
        '选中的' + checkedLen + '条'}”数据吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        basicBind({
          resourceType: _this.params.resourceType,
          qyCode: index == -1 ? _this.checkedIds : row.qyCode
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success('拉取成功')
            _this.getList()
          }
        })
      }
    }
    this.$Modal.confirm(config)
  }
  /*E 拉取资源库资源*/

  mounted() {
    this.tableConfig.page.currPage = 1
    this.params.name = this.$route.query.name
    this.params.queryParam = this.$route.query.dictType
    this.params.region = this.$route.query.region
    this.cityName = this.$route.query.cityName
    this.getList()
  }
}
</script>

<style scoped lang="scss">
.used {
  color: $font06;
}
</style>
