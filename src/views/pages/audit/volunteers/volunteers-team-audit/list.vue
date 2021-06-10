<!--
 * @Author: xulr
 * @since: 2019-06-04 09:14:58
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-31 17:07:29
 -->
<template>
  <Row class="wrap">
    <div class="right-panel">
      <Tabs
        active-key="key1"
        class="tab-warp"
        :animated="false"
        @on-click="setState"
      >
        <Tab-pane label="全部" class="tab-pane"></Tab-pane>
        <Tab-pane :label="number > 0 ? label : '待审核'"></Tab-pane>
        <Tab-pane label="不通过" class="tab-pane"></Tab-pane>
      </Tabs>
      <Form :label-width="80" inline class="form">
        <FormItem class="item" label="关键字">
          <i-input
            placeholder="志愿者名称/手机号/身份证号"
            class="w200"
            v-model="params.keyWord"
          ></i-input>
        </FormItem>
        <FormItem
          class="item"
          label="团队类型"
          v-if="typeList && typeList.length"
        >
          <Select
            class="w200"
            v-model="params.teamType"
            @on-change="
              () => {
                resetCurrPage = true
                search()
              }
            "
          >
            <Option value>全部</Option>
            <Option :value="item" v-for="item in typeList" :key="item"
              >{{ item }}
            </Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="申请时间">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择申请时间"
            @on-change="changeDate"
          ></Date-picker>
          <Button type="primary" class="ml20" @click="getSearch">搜索</Button>
        </FormItem>
      </Form>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          size="default"
          class="table"
          :loading="loading"
          ref="selection"
          @on-selection-change="setChecked"
        >
          <template slot-scope="{ row }" slot="title">
            <div class="topic-msg">
              <div class="msg-panel">
                <p class="topic-name">
                  <span class="theme-blue topicTag">
                    <router-link
                      tag="a"
                      :to="'' + row.id"
                      class="theme-blue"
                      >{{ row.teamName }}</router-link
                    >
                  </span>
                </p>
                <p class="date">
                  {{ row.serviceRegionName }}
                </p>
              </div>
            </div>
            <p
              class="reply line1"
              v-if="row.auditRemark && row.status === 79"
              :title="`审核备注${row.auditRemark}`"
            >
              <span>审核备注：</span>{{ row.auditRemark }}
            </p>
          </template>
          <template slot-scope="{ row, index }" slot="volunteerName">
            <span v-for="item in row.teamResponsiblePeople" v-if="row.teamResponsiblePeople.length">{{item.name}}{{row.teamResponsiblePeople.length>1?'，':''}}</span>
            <span v-if="!row.teamResponsiblePeople.length">-</span>
          </template>
           <template slot-scope="{ row, index }" slot="establishTime">
           {{row.establishTime||'-'}}
          </template>
           <template slot-scope="{ row, index }" slot="peopleNum">
           {{row.teamVolunteerCountVo.memberNum}}
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 4">待审核</span>
            <span v-if="row.status === 6">审核通过</span>
            <span v-if="row.status === 79">不通过</span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div>
              <router-link
                :to="'/team-audit-desc/' + row.id"
                class="theme-blue"
                >{{
                  row.status === 4 ? '审核' : row.status !== 4 ? '重审' : '-'
                }}</router-link
              >
            </div>
          </template>
        </Table>
      </baseTable>
    </div>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getTeamAuditNum } from '@service/audit'
import { getVolunteerTeamList,  getVolunteerDictValue } from '@service/tool'
import baseTable from '@components/baseTable/baseTable.vue'
import { AppModule } from '@store/modules/app'
@Component({
  components: {
    baseTable
  }
})
export default class volAuditList extends Vue {
  get creditStatus() {
    return AppModule.siteInfo.creditStatus
  }
  // 权限列表
  get operates() {
    return AppModule.operates
  }
  // 获取审核流程信息
  private loading = true
  private number: Number = 0
  //表格分页信息
  private params: any = {
    status: '',
    keyWord: '',
    teamType: '',
    startDate: '',
    endDate: '',
    auditListQuery: true
  }
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: 'right'
  }
  private tableData: any = {
    headList: [],
    bodyList: []
  }
  // 复选框ID
  private checkedBox: Array<Number> = []
  private label(h: any) {
    let _this = this
    return h('div', [
      h('span', '待审核'),
      h('Badge', {
        props: {
          count: _this.number
        }
      })
    ])
  }
  // tab
  private setState(index: Number) {
    switch (index) {
      case 0:
        this.params.status = ''
        break
      case 1:
        this.params.status = 4
        break
      case 2:
        this.params.status = 79
        break
    }
    this.tableConfig.page.currPage = 1
    this.getList()
  }
  // 搜索
  private getSearch() {
    this.tableConfig.page.currPage = 1
    this.getList()
  }
  //   改变日期
  private changeDate(e: any) {
    this.params.startDate = e[0]
    this.params.endDate = e[1]
  }
  // 复选框
  private setChecked(e: any) {
    this.checkedBox = []
    e.map((item: any) => {
      this.checkedBox.push(item.id as Number)
    })
  }
  // 批量删除
  mounted() {
    this.getVolunteerManType();
    this.getList()
    this.getListSet()
  }
  // 获取通过的数量
  private getListSet() {
    getTeamAuditNum().then((data: any) => {
      this.number = data.data ? (data.data as Number) : 0
    })
  }
  setTableHeader() {
    let columns = [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '志愿团队信息',
        key: 'title',
        align: 'center',
        width: 400,
        slot: 'title'
      },
      {
        title: '负责人',
        key:'volunteerName',
        slot: 'volunteerName',
        align: 'center'
      },
      {
        title: '团队类型',
        key: 'teamType',
        align: 'center'
      },
      {
        title: '成立时间',
        slot: 'establishTime',
        align: 'center'
      },
      {
        title: '团队人数',
        slot: 'peopleNum',
        align: 'center'
      },
      {
        title: '申请时间',
        key: 'createTime',
        align: 'center'
      },
      {
        title: '状态',
        key: 'status',
        align: 'center',
        slot: 'status'
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        align: 'center',
        slot: 'action'
      }
    ]
    this.tableData.headList = columns
  }
  private getList(page: any = this.tableConfig.page) {
    if (!this.tableData.headList.length) {
      this.setTableHeader()
    }
    this.loading = true
    Object.assign(this.params, page)
    getVolunteerTeamList(this.params).then(data => {
      this.tableConfig.page = data.page ? data.page : {}
      let phones: any = (data as any).datas.map((item: any) => {
        return item.phone
      })
      this.tableData.bodyList = data.datas
      this.loading = false
      this.checkedBox = []
    })
  }
    // 类型
   private typeList:any=[];
  private getVolunteerManType() {
    getVolunteerDictValue({
      dictType: 'VOLUNTEER_SERVICE_TYPE'
    }).then((data: any) => {
      this.typeList = data.datas as []
    })
  }
}
</script>

<style scoped lang="scss">
.w200 {
  width: 200px;
}
.w150 {
  width: 150px;
}
.describe {
  width: 400px;
  height: 150px;
  text-align: center;
  overflow: hidden;
  padding: 20px 15px;
  .item {
    width: 30%;
    display: inline-block;
    line-height: 50px;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    height: 50px;
    font-size: 14px;
    cursor: pointer;
    &:first-child {
      margin-right: 20px;
    }
    &:hover,
    &.active {
      color: $theme;
      border-color: $theme;
    }
  }
  .mt20 {
    text-align: left;
    margin-left: calc(20% - 10px);
  }
}
.wrap {
  padding-bottom: 20px;
  .right-panel {
    padding: 0 15px;
    overflow: hidden;
    .form {
      background: $grayLight;
      margin-bottom: 15px;
      padding-top: 15px;
    }
  }
}

.topic-msg {
  display: flex;
  padding: 8px 0;
  .msg-panel {
    flex: 1;
    overflow: hidden;
    text-align: left;
  }
  .topic-name {
    margin-top: 7px;
    text-align: left;
  }
  .topicTag {
    display: inline-block;
  }
  .date {
    margin-top: 7px;
    white-space: normal;
  }
}
.reply {
  margin-bottom: 8px;
  padding: 8px 10px;
  text-align: left;
  font-size: 12px;
  line-height: 18px;
  color: #333;
  background: #f7f7f7;
  span {
    color: $theme;
  }
}
</style>
