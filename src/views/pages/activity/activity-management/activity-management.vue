<!--
 * @Author: sunxiaoqian
 * @since: 2019-05-29 20:19:06
 * @LastAuthor: 陈艳玲
 * @lastTime: 2019-11-22 12:39:10
 -->
<template>
  <div class="content">
    <div class="topic">
      <Form class="form" ref="formInline" inline :label-width="70">
        <div>
          <FormItem label="活动名称">
            <Input
              type="text"
              placeholder="请输入关键字"
              v-model="condition.name"
              @on-enter="getListReset"
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="活动类型" class="select">
            <Select
              style="width: 200px"
              v-model="condition.type"
              @on-change="getListReset"
            >
              <Option value>全部</Option>
              <Option v-for="(item, k) in ACTIVITY_TYPE" :key="k" :value="k">{{
                item
              }}</Option>
            </Select>
          </FormItem>
          <FormItem label="活动方式" class="select">
            <Select
              style="width: 200px"
              v-model="condition.method"
              @on-change="getListReset"
            >
              <Option value>全部</Option>
              <Option
                v-for="(item, k) in ACTIVITY_METHOD"
                :key="k"
                :value="k"
                >{{ item }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="活动分类" prop="classify">
            <Select
              style="width: 200px"
              v-model="condition.classify"
              @on-change="getListReset"
            >
              <Option value>全部</Option>
              <Option
                :value="item.id"
                v-for="item in activityClassify"
                :key="item.id"
                >{{ item.labelName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="活动状态" class="select">
            <Select
              style="width: 200px"
              v-model="condition.activityStatus"
              @on-change="getListReset"
            >
              <Option value>全部</Option>
              <Option value="0">未开始</Option>
              <Option value="1">进行中</Option>
              <Option value="2">已结束</Option>
              <Option value="3">招募中</Option>
            </Select>
          </FormItem>
        </div>
        <div>
          <FormItem label="审核状态" class="select">
            <Select
              style="width: 200px"
              v-model="condition.status"
              @on-change="getListReset"
            >
              <Option value>全部</Option>
              <Option
                v-for="(item, k) in AUDIT_DATA_STATUS"
                :value="k"
                :key="k"
                >{{ item }}</Option
              >
            </Select>
          </FormItem>

          <FormItem label="活动日期">
            <DatePicker
              type="daterange"
              separator=" 至 "
              @on-change="selectDate"
              placeholder="选择日期筛选"
              placement="bottom-end"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="提交日期">
            <DatePicker
              type="daterange"
              separator=" 至 "
              @on-change="selectTime"
              placeholder="选择日期筛选"
              placement="bottom-end"
              style="width: 200px"
            ></DatePicker>
            <Button
              type="primary"
              style="margin-left: 20px;"
              @click="getListReset"
              >搜索</Button
            >
          </FormItem>
        </div>
      </Form>
    </div>
    <div>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="data.header"
          :data="data.list"
          :loading="loading"
          :configure="tableConfig"
          @on-selection-change="selectionTable"
        >
          <template slot-scope="{ row }" slot="name">
            <div class="info-list clearfix">
              <div
                class="img-box fl"
                :class="{
                  'faith-audit': row.faithAuditStatus && row.faithAuditValue,
                  'faith-use': row.faithUseStatus && row.faithUseValue
                }"
              >
                <img v-if="row.images" :src="row.images.split(',')[0]" />
              </div>
              <div class="introduce-content nonedate fl">
                <p class="hot">
                  <span v-if="row.top">[置顶]</span>
                  <span v-if="row.re || row.channelRe">[推荐]</span>
                  <router-link
                    :to="{ path: '/ac-detail', query: { id: row.id, editButton: row.editButton } }"
                    >{{ row.name }}</router-link
                  >
                </p>
                <p v-if="row.type === 'ACTIVITY_TYPE_VOLUNT' && row.totalStock">
                  招募人数：{{ row.totalStock }}
                </p>
                <p v-if="row.type === 'ACTIVITY_TYPE_VOLUNT' && row.totalStock">
                  招募日期：{{ row.signStartTime.slice(0, 10) }}&nbsp;至&nbsp;{{
                    row.signEndTime.slice(0, 10)
                  }}
                </p>
                <!-- 预订活动或普通活动 -->
                <p
                  class="time"
                  v-if="
                    row.type === 'ACTIVITY_TYPE_RESERVE' ||
                      row.type === 'ACTIVITY_TYPE_PLAIN' ||
                      row.type === 'ACTIVITY_TYPE_SERVICE'
                  "
                >
                  活动时间：
                  <span>{{
                    `${row.useStartTime.slice(0, -3)}-${row.useEndTime.slice(
                      0,
                      -3
                    )}`
                  }}</span>
                </p>
                <!-- 志愿活动或报名活动 -->
                <p
                  class="time"
                  v-if="
                    row.type === 'ACTIVITY_TYPE_ENROLL' ||
                      row === 'ACTIVITY_TYPE_VOLUNT'
                  "
                >
                  <span v-if="row.type === 'ACTIVITY_TYPE_ENROLL'"
                    >报名时间：</span
                  >
                  <span v-if="row.type === 'ACTIVITY_TYPE_VOLUNT'"
                    >招募时间：</span
                  >
                  <span>{{
                    `${row.signStartTime.slice(0, -3)}-${row.signEndTime.slice(
                      0,
                      -3
                    )}`
                  }}</span>
                </p>
                <p class="add">
                  活动地点：
                  <span>{{ row.address }}</span>
                </p>
              </div>
            </div>
          </template>
          <template slot-scope="{row}" slot="showCount">{{row.showCount || 0}}</template>
          <template slot-scope="{ row }" slot="method">{{getStatusTxt[row.method]}}</template>
          <template slot-scope="{ row }" slot="activityResult"><span :style="{color: row.reportStatus==1?'red':'#515a6e'}">{{['已上报','未上报', '--'][row.reportStatus]}}</span></template>
          <template
            slot-scope="{ row }"
            slot="classify"
          >{{row.classifyName + (row.classifySiteId && row.classifySiteId != userInfo.siteId ? '(站点标签)' : '' )}}</template>
          <template slot-scope="{ row }" slot="sort">
            <span v-if="!order">{{ row.sort }}</span>
            <InputNumber
              :precision="0"
              v-else
              :min="1"
              :max="999"
              @on-change="changeSort(row)"
              v-model="row.sort"
            ></InputNumber>
          </template>
          <template slot-scope="{ row }" slot="standbyName">
            <span v-if="row.status == 4 || row.status == 5">{{
              row.standbyName
            }}</span>
            <span v-else-if="row.status == 3">无</span>
            <span v-else>已结束</span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <dropCode
              class="control"
              v-if="[1,6].includes(row.status) && row.activityStatus == 2"
              :id="'qrcode' + row.id"
              :value="
                $store.state.app.userInfo.h5Domain +
                  '/#/' +
                  (row.type === 'ACTIVITY_TYPE_VOLUNT'
                    ? 'volunteer-desc'
                    : 'activity-detail') +
                  '/' +
                  row.id
              "
            >
              <span class="control" v-if="operates.includes('list_detail')"
                >预览</span
              >
            </dropCode>
            <router-link
              tag="span"
              :to="{
                path: '/res-submit',
                query: { id: row.id, type: 'result' }
              }"
              class="control"
              v-if="row.submitResultStatus"
              >提交成果</router-link
            >
            <span
              class="control"
              v-if="
                row.status != 3 &&
                  row.status != 8 &&
                  operates.includes('process') &&
                  row.showProcess == 1
              "
              @click="getProcess(row)"
              >流程</span
            >
            <span
              class="control"
              v-if="row.activityStatus != 2 && [1,2].includes(row.status) && row.method === 'ACTIVITY_MODE_SERVICE'"
              @click="mdLiveUrl(row)"
            >{{ row.liveUrl ? '修改链接' : '添加链接' }}</span>
            <span
              class="control"
              v-if="(row.status === 4 || row.status === 5) && operates.includes('recall')"
              @click="getWithdraw(row)"
              >撤回</span
            >
            <span
              class="control"
              @click="goEdit(row)"
              v-if="row.editButton">修改</span>
            <span
              class="control"
              v-if="row.status === 3 && operates.includes('submit')"
              @click="activitySubmit(row)"
            >提交</span>
            
            <!-- 根据新的原型图原来的删除操作显示条件变成下面那样 v-if="(row.status < 4 || row.status > 7) && operates.includes('delete')" -->
            <span
              class="control"
              v-if="[3,8,9].includes(row.status) && row.ownFlag && operates.includes('delete')"
              @click="activityDelete(row)"
              >删除</span
            >
          </template>
          <template slot-scope="{ row }" slot="activityStatus">
            <span v-if="row.type==='ACTIVITY_TYPE_ENROLL'&& row.activityStatus===3">报名中</span>
            <span v-else-if="row.type==='ACTIVITY_TYPE_VOLUNT'&& row.activityStatus===3">招募中</span>
            <span v-else>{{activityStatus[row.activityStatus]}}</span>
          </template>
          <template slot-scope="{ row }" slot="status">
            <div v-if="row.status === 1">
              <span class="switchLabel">正常</span>
              <span class="switchBox" @click="changeStatus(row, '禁用')">
                <i-switch :value="row.status === 1" />
                <span class="cover"></span>
              </span>
            </div>
            <div v-else-if="row.status === 2">
              <span class="switchLabel">禁用</span>
              <span class="switchBox" @click="changeStatus(row, '启用')">
                <i-switch :value="row.status === 1" />
                <span class="cover"></span>
              </span>
            </div>
            <div v-else>{{ getStatusTxt[row.status] }}</div>
          </template>
        </Table>
      </baseTable>
    </div>
    <footerButtons
      type="CONTENT_TYPE_ACTIVITY"
      :selectionList="selectionList"
      :orderRowData="orderRowData"
      @changeOrder="changeOrder"
      @getList="getList"
    >
      <Button
        type="primary"
        v-if="operates.includes('batchDelete')"
        :disabled="order"
        @click="patchDelete"
        >批量删除</Button
      >
      <Button
        type="primary"
        v-if="operates.includes('batchSave')"
        :disabled="order"
        @click="patchSubmit"
        >批量提交</Button
      >
      <Button
        type="primary"
        v-if="operates.includes('report') && siteInfo.siteVersion === 'PLAIN'"
        :disabled="order"
        @click="reportSite"
        >上报</Button
      >
      <Button
        type="primary"
        v-if="operates.includes('cloudLeague') && userInfo.joinUnion"
        :disabled="order"
        @click="showAilenDialog"
        >云联盟</Button
      >
    </footerButtons>

    <Modal v-model="modal" title="审批流程" footer-hide>
      <auditProcess :data="processData"></auditProcess>
    </Modal>
    <Modal v-model="report" title="上报" @on-ok="sureReport">
      <Select v-model="reportSiteID">
        <Option v-for="item in reportList" :value="item.id" :key="item.id">{{
          item.name
        }}</Option>
      </Select>
    </Modal>
    <Modal
      class="cloudAilen"
      title="云联盟"
      width="1100"
      @on-ok="ailenDialogSure"
      v-model="cloudAilen"
      :mask-closable="false"
    >
      <ul class="ailenBox">
        <li
          v-for="(item, index) in ailenList"
          :key="item.id"
          :class="{ active: index === AilenIndex }"
          @click="clickAilen(item.id, index)"
        >
          {{ item.name }}
        </li>
      </ul>
      <Form :label-width="60" inline>
        <FormItem class="item" label="活动名称">
          <i-input
            style="width:120px"
            placeholder="请输入活动名称"
            v-model="conditionAilen.keyword"
          ></i-input>
        </FormItem>
        <FormItem class="item" label="活动方式">
          <Select style="width:120px" v-model="conditionAilen.method">
            <Option value>全部</Option>
            <Option v-for="(item, k) in ACTIVITY_METHOD" :value="k" :key="k">{{
              item
            }}</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="活动状态">
          <Select style="width:120px" v-model="conditionAilen.activityStatus">
            <Option value>全部</Option>
            <Option value="0">未开始</Option>
            <Option value="1">进行中</Option>
            <Option value="2">已结束</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="活动日期">
          <DatePicker
            @on-change="changeDate"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="选择活动日期"
            style="width:120px"
          ></DatePicker>
        </FormItem>
        <FormItem class="item" label="站点列表">
          <Select style="width:120px" v-model="conditionAilen.chooseSiteId">
            <Option value>全部</Option>
            <Option
              v-for="item in ailenSiteList"
              :key="item.id"
              :value="item.id"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <div class="mt10 submit">
          <Button type="primary" @click="getUnionList(undefined, true)"
            >搜索</Button
          >
        </div>
      </Form>
      <baseTable :configure="tableConfigAilen" @getList="getUnionList">
        <div class="tableOver">
          <Table
            border
            :columns="tableDataAilen.headList"
            :data="tableDataAilen.bodyList"
            @on-selection-change="selectionTableAilen"
            size="default"
            class="table"
          >
            <template slot-scope="{ row }" slot="name">
              <div class="info-list clearfix">
                <div class="img-box fl">
                  <img v-if="row.images" :src="row.images.split(',')[0]" />
                </div>
                <div class="introduce-content nonedate fl">
                  <p class="hot">
                    <span v-if="row.top">[置顶]</span>
                    <span v-if="row.recommend">[推荐]</span>
                    <router-link
                      :to="{ path: '/ac-detail', query: { id: row.id } }"
                      >{{ row.name }}</router-link
                    >
                  </p>
                  <p class="time">
                    活动日期：
                    <span>
                      {{ row.useStartTime.slice(0, -3) }} 至
                      {{ row.useEndTime.slice(0, -3) }}
                    </span>
                  </p>
                  <p class="add">
                    活动地点：
                    <span>{{ row.address }}</span>
                  </p>
                </div>
              </div>
            </template>

            <template slot-scope="{ row }" slot="method">{{
              getStatusTxt[row.method]
            }}</template>

            <template slot-scope="{ row }" slot="activityStatus">
              <span
                v-if="
                  row.method === 'ACTIVITY_MODE_VOLUNT' &&
                    row.activityStatus === 3
                "
                >招募中</span
              >
              <span v-else>{{ activityStatus[row.activityStatus] }}</span>
            </template>
          </Table>
        </div>
      </baseTable>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import BaseTable from '@components/baseTable/baseTable.vue'
import dropCode from '@components/DropCode/DropCode.vue'
import auditProcess from '@components/auditProcess/auditProcess.vue'
import footerButtons from '@components/footerButtons/footerButtons.vue'
import { AppModule } from '@store/modules/app'
import {
  ACTIVITY_TYPE,
  ACTIVITY_METHOD,
  AUDIT_DATA_STATUS
} from '@constant/index'
import { getActivityEditPath, getStatusTxt } from '@util/comm'

import {
  getActivityList,
  activitySubmit,
  getWithdraw,
  getProcess,
  activityReport,
  getActivityUnionList,
  concatUnionData,
  activityDelete,
  updateLiveUrl
} from "@service/activity";
import { getSiteUnionList, getUnionSiteList } from "@service/content";
import {
  getTagsSelect,
  getReportSiteList,
  updateStatus
} from "@service/common";
import { orderDelete } from "@service/tool";

@Component({
  components: {
    BaseTable,
    auditProcess,
    footerButtons,
    dropCode
  }
})
export default class ComponentName extends Vue {
  get siteInfo() {
    return AppModule.siteInfo
  }
  goEdit(row: any) {
    this.method = row.method
    this.$router.push({
      path: getActivityEditPath(row),
      query: { id: row.id, classify: row.type, method: row.method }
    })
  }
  beforeRouteLeave(to: any, from: any, next: Function) {
    to.meta.title = getStatusTxt[this.method]
    next()
  }
  method = ''
  // 获取vuex中的用户信息
  get userInfo() {
    return AppModule.userInfo
  }
  // 权限列表
  get operates() {
    return AppModule.operates
  }
  private getActivityEditPath = getActivityEditPath
  private ACTIVITY_TYPE = ACTIVITY_TYPE
  private ACTIVITY_METHOD = ACTIVITY_METHOD
  private AUDIT_DATA_STATUS = AUDIT_DATA_STATUS
  private getStatusTxt = getStatusTxt
  private siteType: string = this.$store.state.app.userInfo.dataType
  private columDiff = <any>{
    COMPANY: {
      title: '待办人',
      align: 'center',
      width: 100,
      slot: 'standbyName'
    },
    SITE: {
      title: "排序",
      align: "center",
      width: 80,
      slot: "sort"
    }
  }
  // 日期时间限制
  private options: any = {
    disabledDate(date: any) {
      const disabledDay = date.getDate()
      // 限制可选的开始日期及结束日期
      let b =
        date.getTime() < new Date('2018-12-31').getTime() ||
        (date && date.valueOf() > Date.now())
      return b
    }
  }

  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: 'right'
  }
  private loading = true
  private condition = <any>{
    name: '',
    method: '',
    classify: '',
    activityStatus: '',
    status: '',
    activityDate: '',
    submitDate: ''
  }
  private data = <any>{
    header: [
      {
        type: 'selection',
        width: 57,
        fixed: 'left'
      },
      {
        title: '活动信息',
        slot: 'name',
        width: 350,
        fixed: 'left'
      },
      {
        title: '创建者',
        align: 'center',
        key: 'createName',
        width: 150
      },
      {
        title: '活动方式',
        align: 'center',
        slot: 'method',
        width: 110
      },
      {
        title: '活动分类',
        align: 'center',
        slot: 'classify',
        width: 110
      },
      {
        title: '提交时间',
        key: 'createTime',
        align: 'center',
        width: 150
      },
      this.columDiff[this.siteType],
      {
        title: "活动成果",
        slot: "activityResult",
        align: "center",
        width: 100,
      },
      {
        title: "活动状态",
        slot: "activityStatus",
        align: "center",
        width: 100
      },
      {
        title: "审核状态",
        slot: "status",
        align: "center",
        width: 120
      },
      {
        title: '操作',
        slot: 'action',
        align: 'center',
        width: 200
      }
    ],
    list: []
  }
  // 活动分类
  private activityClassify = []

  // 活动状态
  private activityStatus = <object>{
    0: '未开始',
    1: '进行中',
    2: '已结束',
    3: '报名中'
  }

  mounted() {
    const newColumn = {
      title: "点击量",
      slot: "showCount",
      align: "center",
      width: 80
    };
    switch (process.env.VUE_APP_STATUS) {
      case 'COMPANY': {
        this.data.header.splice(
          this.data.header.findIndex((e: any) => e.title === '审核状态'),
          0,
          newColumn
        )
        break
      }
      case 'SITE': {
        this.data.header.splice(
          this.data.header.findIndex((e: any) => e.title === '排序'),
          0,
          newColumn
        )
        break
      }
    }
    this.getList()
    this.getActivityClassify()
    this.getReportSiteList()
  }

  private liveParams:any = {liveUrl: '', id: ''}
  private mdLiveUrl(row:any):void {
    this.liveParams = {liveUrl: row.liveUrl || '', id: row.id}
    this.$Modal.confirm({
      render: (h:any) => {
        return h('div', [
          h('p', {
            style: {
              marginBottom: '10px'
            },
          }, row.liveUrl ? '修改直播链接' : '添加直播链接'),
          h('Input', {
            props: {
              value: this.liveParams.liveUrl,
              autofocus: true,
              placeholder: '输入直播链接...'
            },
            on: {
              input: (val: string) => {
                  this.liveParams.liveUrl = val;
              }
            }
          })
        ])
      },
      onOk: () => {
        if (this.liveParams.liveUrl) {
          updateLiveUrl(this.liveParams).then((res:any) => {
            if (res.code === 0) {
              this.$Message.success('操作成功！')
              this.getList()
              this.loading = false
            }
          })
        } else {
          this.$Message.info('直播链接不能为空！')
        }
      }
    })
  }

  // 弹窗参数
  private cloudAilen: boolean = false
  // 打开云联盟弹窗
  private showAilenDialog() {
    this.cloudAilen = true
    this.getSiteUnionList()
  }

  private tableDataAilen = <any>{
    headList: [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '活动信息',
        width: 400,
        slot: 'name'
      },
      {
        title: '活动方式',
        slot: 'method',
        align: 'center'
      },
      {
        title: '活动状态',
        slot: 'activityStatus',
        align: 'center'
      },
      {
        title: '来源站点',
        key: 'sourceName',
        align: 'center'
      }
    ],
    bodyList: []
  }
  //表格分页信息
  private tableConfigAilen = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: 'right'
  }
  private conditionAilen = <any>{
    unionId: '',
    keyword: '',
    activityStatus: '',
    method: '',
    start: '',
    end: '',
    chooseSiteId: ''
  }
  private ailenList = [] // 已加入的联盟列表
  // 活动日期选择
  private changeDate(date: any) {
    this.conditionAilen.start = date[0]
    this.conditionAilen.end = date[1]
  }
  // 获取已加入的联盟列表
  private getSiteUnionList() {
    getSiteUnionList().then((res: any) => {
      if (res.code === 0) {
        if (!res.datas.length) return
        this.ailenList = res.datas
        // 初始化时，若联盟列表不为空，则查询第一条数据
        this.getUnionSiteList(res.datas[0].id)
        this.conditionAilen.unionId = res.datas[0].id
        this.unionListParams.unionId = res.datas[0].id
      }
    })
  }

  // 获取联盟站点列表
  private ailenSiteList = [] // 联盟站点列表
  private getUnionSiteList(id: Number) {
    getUnionSiteList({ unionId: id }).then((res: any) => {
      if (res.code === 0) {
        this.ailenSiteList = res.datas
      }
    })
    this.getUnionList(undefined, true)
  }

  // 获取列表数据的方法
  private loadingAilen: boolean = false
  private getUnionList(
    page: any = this.tableConfigAilen.page,
    resetPage?: boolean
  ) {
    this.loadingAilen = true
    Object.assign(this.conditionAilen, page)
    if (resetPage) this.conditionAilen.currPage = 1
    getActivityUnionList(this.conditionAilen)
      .then((res: any) => {
        if (res.code === 0) {
          res.page.pageSize = this.conditionAilen.pageSize // 当数据小于10的时候后台返回的pagesize不是我们设置的10，导致一直重复请求
          this.tableDataAilen.bodyList = res.datas
          this.tableConfigAilen.page = res.page
        }
      })
      .finally(() => {
        this.loadingAilen = false
      })
  }

  //   云联盟弹窗列表选择项数据变化
  private selectionListAilen: Array<any> = []
  private selectionTableAilen(data: Array<any>) {
    this.selectionListAilen = data
  }

  private unionListParams: {
    resourceType: string
    unionId: number
    resourceIds: string
  } = {
    resourceType: 'CONTENT_TYPE_ACTIVITY',
    unionId: 1,
    resourceIds: ''
  }
  // 云联盟列表 弹窗确认
  private ailenDialogSure() {
    if (this.selectionListAilen.length > 0) {
      this.unionListParams.resourceIds = this.selectionListAilen
        .map((data: any) => data.id)
        .join(',')
      concatUnionData(this.unionListParams).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success(res.message)
          this.getList()
        }
      })
    } else {
      this.$Message.error('请先选择需要拉取的数据')
    }
  }

  // 联盟列表名称切换
  private AilenIndex: Number = 0
  private clickAilen(id: number, index: Number) {
    this.conditionAilen.unionId = id
    this.unionListParams.unionId = id
    this.AilenIndex = index
    this.conditionAilen.chooseSiteId = ''
    this.getUnionSiteList(id)
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

  private getListReset() {
    this.tableConfig.page.currPage = 1
    this.getList()
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    this.loading = true
    this.selectionList = []
    Object.assign(this.condition, page)
    getActivityList(this.condition)
      .then((res: any) => {
        if (res.code === 0) {
          this.data.list = res.datas
          this.tableConfig.page = res.page
        }
      })
      .finally(() => {
        this.loading = false
      })
  }

  // 数据状态值切换
  private changeStatus(row: any, title: string) {
    let _this = this
    let config: any = {
      title: '风险操作提示',
      content: '确认是否' + title + '？',
      okText: '确认',
      cancelText: '关闭',
      onOk: () => {
        _this.updateStatus(row)
      }
    }
    this.$Modal.confirm(config)
  }

  // 开启、禁用
  private updateStatus(row: any) {
    let status = 2
    if (row.status === 2) {
      status = 1
    }
    let param = {
      id: row.id,
      status: status,
      resourceType: 'CONTENT_TYPE_ACTIVITY'
    }
    updateStatus(param).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success('更新状态成功!')
        this.getList()
      }
    })
  }

  // 日期选择
  private selectDate(date: Array<string>) {
    if (date.length > 1) {
      this.condition.activityStart = date[0] || ''
      this.condition.activityEnd = date[1] || ''
      this.getListReset()
    }
  }

  // 时间选择
  private selectTime(date: Array<string>) {
    if (date.length > 1) {
      this.condition.submitStart = date[0] || ''
      this.condition.submitEnd = date[1] || ''
      this.getListReset()
    }
  }

  // 提交
  private activitySubmit(row: any) {
    let _this = this
    let config: any = {
      title: '操作提示',
      okText: '确认提交',
      cancelText: '取消',
      onOk: () => {
        activitySubmit({ manageIds: row.manageId }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success('提交成功!')
            _this.getList()
          }
        })
      },
      render: (h: any, params: any) => {
        return h('p', '是否要提交数据？')
      }
    }
    this.$Modal.confirm(config)
  }

  // 删除
  private activityDelete(row: any) {
    let config: any = {
      title: '操作提示',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        activityDelete({ ids: row.id }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success('删除成功!')
            this.getList()
          }
        })
      },
      render: (h: any, params: any) => {
        return h('p', `是否要删除${row.name}活动？`)
      }
    }
    this.$Modal.confirm(config)
  }

  // 撤回
  private getWithdraw(row: any) {
    let _this = this
    let config: any = {
      title: '操作提示',
      okText: '确认撤回',
      cancelText: '取消',
      onOk: () => {
        getWithdraw({ manageId: row.manageId, activityId: row.id }).then(
          (res: any) => {
            if (res.code === 0) {
              _this.$Message.success('撤回成功!')
              _this.getList()
            }
          }
        )
      },
      render: (h: any, params: any) => {
        return h('p', '是否要撤回数据？')
      }
    }
    this.$Modal.confirm(config)
  }

  // 流程
  private modal: boolean = false
  private processData: any = {}

  private getProcess(row: any) {
    this.modal = true
    getProcess({ manageId: row.id, activityId: row.id }).then((res: any) => {
      this.processData = res.data
    })
  }

  // 底部操作栏
  /* S 排序 */
  private order: boolean = false // 是否开启排序功能
  private changeOrder(b: boolean) {
    this.order = b
  }

  // 修改排序行的数据
  private orderRowData: object = {}

  private changeSort(row: any) {
    this.orderRowData = row
  }

  /* E 排序 */

  /* S 批量删除 */
  private selectionList: Array<any> = []

  private getSelectIds() {
    // 获取表格选中的数据的 ids
    let ids = ''
    this.selectionList.forEach((item: any) => {
      ids += item.id + ','
    })
    ids = ids.substr(0, ids.length - 1)
    return ids
  }

  //   列表选择项数据变化
  private selectionTable(data: any) {
    this.selectionList = data
  }

  private patchDelete() {
    let _this = this
    let config: any = {
      title: '操作提示',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        activityDelete({ ids: _this.getSelectIds() }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success('删除成功')
            _this.getList()
          }
        })
      },
      render: (h: any, params: any) => {
        let str = '是否要删除[' + _this.selectionList[0].title + ']？'
        if (_this.selectionList.length > 1) {
          str = '是否要删除选中的' + _this.selectionList.length + '条数据？'
        }
        return h('p', str)
      }
    }
    if (_this.selectionList.length > 0) {
      if (_this.selectionList.some(d => ![3,8,9].includes(d.status))) {
        this.$Message.error("删除数据只能是草稿、撤回、终止状态的数据");
      } else if (_this.selectionList.some(d => !d.ownFlag)) {
        this.$Message.error("不能删除非自建数据");
      } else {
        this.$Modal.confirm(config);
      }
    } else {
      _this.$Message.error('请先选择需要删除的数据')
    }
  }

  /* E 批量删除 */

  // 批量提交
  private patchSubmit() {
    let params = {
      manageIds: this.selectionList.map((item: any) => item.manageId).join(',')
    }
    let _this = this
    let config: any = {
      title: '操作提示',
      okText: '确认提交',
      cancelText: '取消',
      onOk: () => {
        activitySubmit(params).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success('提交成功')
            _this.getList()
          }
        })
      },
      render: (h: any, params: any) => {
        let str = '是否要提交[' + _this.selectionList[0].title + ']？'
        if (_this.selectionList.length > 1) {
          str = '是否要提交选中的' + _this.selectionList.length + '条数据？'
        }
        return h('p', str)
      }
    }
    if (_this.selectionList.length > 0) {
      this.$Modal.confirm(config)
    } else {
      _this.$Message.error('请先选择需要提交的数据')
    }
  }

  /* S 上报 */
  private report: boolean = false // 上报弹窗
  private reportSiteID: any = '' // 选择的上报站点
  private reportList: Array<any> = [] // 可上报的站点列表
  // 获取上报站点list
  private getReportSiteList() {
    getReportSiteList()
      .then((res: any) => {
        if (res.code === 0) {
          this.reportList = res.datas
        } else {
          this.reportList = []
        }
      })
      .catch(() => {
        this.reportList = []
      })
  }

  private reportSite() {
    if (this.selectionList.length > 0) {
      this.report = true
    } else {
      this.$Message.error('请先选择需要上报的数据')
    }
  }

  // 确认上报站点
  private sureReport() {
    if (!this.reportSiteID) {
      this.$Message.error('选择上报对象！')
      return
    }
    let params = {
      resourceIds: this.getSelectIds(),
      siteId: this.reportSiteID,
      resourceType: 'CONTENT_TYPE_ACTIVITY'
    }
    activityReport(params).then((res: any) => {
      if (res.code === 0) {
        if (res.datas.length === 0) {
          this.$Notice.success({
            title: '提示信息',
            desc: '上报成功，请耐心等待审核！上报内容可在上报管理里查看！'
          })
        } else {
          if (this.selectionList.length === res.datas.length) {
            this.$Notice.error({
              title: res.datas.length + '条非正常数据，无法上报',
              desc: res.datas.join(' | ')
            })
          } else {
            let len = this.selectionList.length - res.datas.length
            this.$Notice.error({
              title:
                len +
                '条上报成功！' +
                res.datas.length +
                '条非正常数据，无法上报',
              desc: res.datas.join(' | ')
            })
          }
        }
        this.getList()
      }
    })
  }

  /* E 上报 */
}
</script>

<style lang="scss" scoped>
.cloudAilen {
  .ailenBox {
    overflow: auto;
    margin-bottom: 10px;
    li {
      display: inline-block;
      margin-right: 10px;
      padding: 5px 10px;
      color: $font01;
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid $theme;
      &:hover,
      &.active {
        color: #fff;
        background-color: $theme;
      }
    }
  }
  .submit {
    display: inline;
  }
  .tableOver {
    max-height: 329px;
    overflow-y: auto;
    overflow-x: hidden;
    border-top: 1px solid $borderLight;
    border-bottom: 1px solid $borderLight;
    .table {
      margin-top: 0;
    }
  }
}

.control {
  color: $theme;
  margin-right: 5px;
  cursor: pointer;
}

.content {
  padding: 0 15px 50px;
  overflow: hidden;
  height: auto !important;
  .topic {
    width: 100%;
    padding-top: 15px;
    background: $grayLight;
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .opation-group {
    a {
      margin-right: 8px;
    }
  }
  .btn-group {
    text-align: center;
    .ivu-btn {
      margin-right: 10px;
    }
  }
  .remove-desc {
    font-size: 16px;
    .cloud-icon {
      color: red;
    }
  }
}

.switchLabel {
  margin-right: 5px;
}

.switchBox {
  position: relative;
  display: inline-block;
  .cover {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

.info-list {
  padding: 20px 0;
  .img-box {
    position: relative;
    width: 90px;
    height: 60px;
    overflow: hidden;
    &.faith-use:after {
      content: '诚信优享';
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 0 5px;
      color: #fff;
      background: rgba(255, 102, 0, 1);
      line-height: 20px;
      text-align: center;
      border-radius: 4px;
    }
    &.faith-audit:after {
      content: '诚信免审';
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 0 5px;
      color: #fff;
      background: rgba(20, 204, 86, 1);
      line-height: 20px;
      text-align: center;
      border-radius: 4px;
    }
    img {
      width: 100%;
    }
  }
  .hot {
    span {
      color: $danger;
    }
  }
  .time,
  .add {
    margin-top: 3px;
    span {
      color: $font03;
    }
  }
  .introduce-content {
    position: relative;
    margin-left: 10px;
    width: calc(100% - 100px);
  }
}
</style>
