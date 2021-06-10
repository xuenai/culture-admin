<!--
 * @Author: xulr
 * @since: 2019-06-04 09:14:58
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-31 17:07:29
 -->
<template>
  <div class="right-panel">
    <Form
      :label-width="80"
      inline
      class="form mt20"
      :model="params"
      :rules="ruleValidate"
    >
      <!--<FormItem class="item" label="编号">
                <i-input
                        placeholder="志愿者团队编号"
                        class="w200"
                        v-model="params.keyWord"
                ></i-input>
            </FormItem>-->
      <FormItem class="item" label="名称">
        <i-input
          placeholder="志愿团队名称"
          class="w300"
          v-model="params.name"
          @on-enter="
            () => {
              resetCurrPage = true
              search()
            }
          "
        ></i-input>
      </FormItem>
      <FormItem
        class="item"
        label="团队类型"
        v-if="typeList && typeList.length"
      >
        <Select
          class="w300"
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
      <FormItem class="item" label="服务区域">
        <VDistpicker
          @onChange="
            data => {
              params.serviceRegion = data.region
              search()
            }
          "
          :disabledByLevel="true"
          :default="regionPath"
        ></VDistpicker>
      </FormItem>
      <br />
      <FormItem class="item" label="状态">
        <Select
          class="w300"
          v-model="params.status"
          @on-change="
            () => {
              resetCurrPage = true
              search()
            }
          "
        >
          <Option value>全部</Option>
          <Option value="3">草稿</Option>
          <Option value="1">正常</Option>
          <Option value="2">禁用</Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="成立时间">
        <Date-picker
          class="w300"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择成立时间"
          @on-change="
            list => {
              params.startDate = list[0]
              params.endDate = list[1]
              resetCurrPage = true
              search()
            }
          "
        ></Date-picker>
      </FormItem>
      <FormItem class="item" label="提交时间">
        <Date-picker
          class="w300"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择提交时间"
          @on-change="
            list => {
              params.createStartDate = list[0]
              params.createEndDate = list[1]
              resetCurrPage = true
              search()
            }
          "
        ></Date-picker>
        <Button
          type="primary"
          class="ml20"
          @click="
            () => {
              resetCurrPage = true
              search()
            }
          "
          >搜索</Button
        >
        <Button
          type="primary"
          class="ml20"
          @click="$router.push({ path: '/volunteers-add-team' })"
          v-if="$store.state.app.userInfo.dataType !== 'SITE'"
          >添加</Button
        >
      </FormItem>
    </Form>

    <BaseTable :configure="tableConfig" @getList="search">
      <Table
        border
        :columns="tableData.headList"
        :data="tableData.bodyList"
        size="default"
        class="table"
        :loading="loading"
        ref="selection"
        @on-selection-change="list => (checkedBox = list)"
      >
        <template slot-scope="{ row }" slot="teamInfo">
          <div class="title fl">
            <span v-if="row.top" class="red">[置顶]</span>
            <span v-if="row.recommend" class="red">[推荐]</span>
            <router-link
              :to="{ path: '/volunteers-detail-team/' + row.id }"
              class="action-btn"
              :title="row.teamName"
              >{{ row.teamName }}</router-link
            >
            <p>
              <i class="cloud-icon">&#xe606;</i> {{ row.teamRegionName }}
              {{ row.teamAddress }}
            </p>
          </div>
        </template>
        <template slot-scope="{ row }" slot="memberNum">
          {{ row.teamVolunteerCountVo.memberNum }}
        </template>
        <template slot-scope="{ row }" slot="memberTotalServiceNum">
          {{ row.teamVolunteerCountVo.memberTotalServiceNum }}
        </template>
        <template slot-scope="{ row }" slot="sort">
          <span v-if="!sort">{{ row.sort }}</span>
          <InputNumber
            v-else
            @on-change="continueAddRowData = row"
            v-model="row.sort"
          />
        </template>

        <template slot-scope="{ row }" slot="status">
          <div v-if="row.status === 1">
            <span class="switchLabel">正常</span>
            <span class="switchBox" @click="changeStatus(row, '禁用')">
              <i-switch :value="true" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else-if="row.status === 2">
            <span class="switchLabel">禁用</span>
            <span class="switchBox" @click="changeStatus(row, '启用')">
              <i-switch :value="false" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else>{{ getStatusTxt(row.status) }}</div>
        </template>

        <template slot-scope="{ row }" slot="action">
          <dropCode
            v-if="[1, 2].includes(row.status)"
            class="action-btn"
            :id="'qrcode' + row.id"
            :key="'qrcode' + row.id"
            :value="
              $store.state.app.userInfo.h5Domain + '/#/team-desc/' + row.id
            "
          >
            <span class="theme-blue action-btn">预览</span>
          </dropCode>
           <router-link
            :to="{ path: '/volunteers-team-setting', query: { id: row.id } }"
            class="theme-blue"
            >配置</router-link
          >
          <a
            href="javascript:;"
            v-if="row.status === 3"
            class="theme-blue"
            @click="submitIds(row.id)"
            >提交</a
          >
          <a href="javascript:;" class="theme-blue" @click="deleteIds(row.id)"
            >删除</a
          >
          <router-link
            :to="{ path: '/volunteers-add-team', query: { id: row.id } }"
            class="theme-blue"
            >修改</router-link
          >
        </template>
      </Table>
    </BaseTable>

    <div class="operate text-center mt20">
      <Button
        type="primary"
        v-if="operates.includes('recommend')"
        :disabled="sort"
        @click="setStatus('recommend',1)"
        >推荐</Button
      >
      <Button
        class="ml10"
        type="primary"
        v-if="operates.includes('cancelRecommend')"
        :disabled="sort"
        @click="setStatus('recommend',0)"
        >取消推荐</Button
      >
      <Button
        class="ml10"
        type="primary"
        v-if="operates.includes('top')"
        :disabled="sort"
        @click="setStatus('top',1)"
        >置顶</Button
      >
      <Button
        class="ml10"
        type="primary"
        v-if="operates.includes('cancelTop')"
        :disabled="sort"
        @click="setStatus('top',0)"
        >取消置顶</Button
      >
      <Button
        class="ml10"
        type="primary"
        v-if="operates.includes('batchDelete')"
        :disabled="sort"
        @click="deleteIds(checkedBox)"
        >批量删除</Button
      >
      <Button
        class="ml10"
        type="primary"
        v-if="operates.includes('batchSave')"
        :disabled="sort"
        @click="submitIds(checkedBox)"
        >批量提交</Button
      >
      <a
        href="javascript:;"
        class="ivu-btn ivu-btn-default ml10"
        @click="outExcel"
        v-if="operates.includes('export')"
        :disabled="sort"
        >导出</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BaseTable from '@components/baseTable/baseTable.vue'
import FooterButtons from './footer.vue'
import dropCode from '@components/DropCode/DropCode.vue'
import { AppModule } from '@store/modules/app'
import CONFIG from '@/util/config'
import VDistpicker from '@components/distPicker/distPicker.vue'
import {
  getVolunteerManType,
  getVolunteerTeamList,
  deleteVolunteerTeam,
  submitVolunteerTeam,
  getVolunteerDictValue,
  setTeamStatus
} from '@service/tool'
import { exportExcel } from '@util/comm'

@Component({
  components: {
    BaseTable,
    FooterButtons,
    dropCode,
    VDistpicker
  }
})
export default class volAuditList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates
  }
  //地区编码
  private regionPath: string = AppModule.regionPath
  // 参数对象
  private params = <any>{
    currPage: 1,
    pageSize: 10
  }
  // 验证
  private ruleValidate = <any>{
    /*name: [
                {required: true, message: '名称不能为空', trigger: 'blur'},
                {type:'string',max: 100,message:'最多输入100个字符'}
            ],
            region: [
                {required: true, message: '请选择所在地区', trigger: 'change'}
            ],
            address: [
                {required: true, message: '详细地址不能为空', trigger: 'blur'},
                {type:'string',max:100, message:'最多输入100个字符'}
            ],
            joinStatus: [
                {required: true, message: '请选择是否允许志愿者加入', trigger: 'blur'}
            ]*/
  }
  // 表格分页信息
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: 'right'
  }
  //
  private tableData = <any>{
    headList: [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '志愿团队信息',
        align: 'left',
        width: 400,
        slot: 'teamInfo'
      },
      {
        title: '成立时间',
        key: 'establishTime',
        align: 'center'
      },
      {
        title: '团队类型',
        key: 'teamType',
        align: 'center'
      },
      {
        title: '团队人数',
        slot: 'memberNum',
        align: 'center'
      },
      {
        title: '服务次数',
        slot: 'memberTotalServiceNum',
        align: 'center'
      },
      {
        title: '提交时间',
        key: 'createTime',
        align: 'center'
      },
      {
        title: '排序',
        key: 'sort',
        align: 'center',
        slot: 'sort'
      },
      {
        title: '状态',
        key: 'status',
        align: 'center',
        slot: 'status'
      },
      {
        title: '操作',
        align: 'center',
        slot: 'action',
        width: 200
      }
    ],
    bodyList: []
  }
  //
  private loading = true
  // 是否开启排序功能
  private sort: boolean = false
  // 服务类型
  private typeList = []
  // 持续添加数据
  private continueAddRowData: object = {}
  // 选中数据
  private checkedBox: Array<any> = []
  // 导出
  private outExcelApi: string =
    CONFIG.defaultUrl + '/res/volunteerTeam/exportExcel?'

  mounted() {
    this.getVolunteerManType()
    this.search()
  }

  // 删除
  private deleteIds(ids: any | Array<any>) {
    if (!/^\d+$/.test(String(ids))) {
      // 传递的数组
      if (!ids.length) {
        this.$Message.info('请选择要删除的数据！')
        return
      }
      ids = ids.map((item: any) => item.id).toString()
    }
    deleteVolunteerTeam({ ids }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success('删除成功！')
      }
    })
  }

  // 提交
  private submitIds(ids: any | Array<any>) {
    if (!/^\d+$/.test(String(ids))) {
      // 传递的数组
      if (!ids.length) {
        this.$Message.info('请选择要提交的数据！')
        return
      }
      ids = ids.map((item: any) => item.id).toString()
    }
    submitVolunteerTeam({ ids }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success('提交成功！')
      }
    })
  }

  // 数据状态值切换
  private changeStatus(row: any, title: string) {
    let config = <any>{
      title: '操作提示',
      content: '确认是否' + title + '？',
      okText: '确认',
      cancelText: '关闭',
      onOk: () =>
        this.updateStatus(
          { ids: row.id, status: row.status === 2 ? 1 : 2 },
          '更改状态成功!'
        )
    }
    this.$Modal.confirm(config)
  }
  //置顶，推荐
  setStatus(type:any,status:number){
    let ids:any=this.checkedBox.map((item: any) => item.id).toString();
    if(!ids){
       this.$Message.error('请选择需要操作的数据');
       return;
    }
    if(type=='top'){
      this.updateStatus({top:status,ids:ids},status==1?'置顶成功':'取消置顶成功')
    }else{
       this.updateStatus({recommend:status,ids:ids},status==1?'推荐成功':'取消推荐成功')
    }
  }
  // 修改状态（启用，禁用，置顶，推荐）
  private updateStatus(params: any, message: any) {
    setTeamStatus(params).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success(message)
        this.search()
        this.loading = false
      }
    })
  }

  // 根据code获取状态描述
  private getStatusTxt(code: any) {
    switch (code) {
      case 1:
        return '正常'
      case 2:
        return '禁用'
      case 3:
        return '草稿'
      case 4:
        return '待审核'
      case 5:
        return '审核中'
      case 6:
        return '审核通过'
      case 7:
        return '回退'
      case 8:
        return '撤回'
      case 9:
        return '终止'
      case 'CONTENT':
        return '内容'
      case 'IMAGE':
        return '图片'
      case 'VIDEO':
        return '视频'
      case 'AUDIO':
        return '音频'
    }
  }

  // 类型
  private getVolunteerManType() {
    getVolunteerDictValue({
      dictType: 'VOLUNTEER_SERVICE_TYPE'
    }).then((data: any) => {
      this.typeList = data.datas as []
    })
  }

  // 列表
  private resetCurrPage: boolean = true // 是否要重置页码，默认需要
  private search(page?: any) {
    this.loading = true
    if (page) {
      Object.assign(this.params, page)
    }
    if (this.resetCurrPage) {
      this.params.currPage = 1
    }
    getVolunteerTeamList(this.params)
      .then((data: any) => {
        if (data.code === 0) {
          this.tableConfig.page = data.page
        }
        this.tableData.bodyList = data.datas
        this.checkedBox = []
      })
      .catch(() => {
        this.checkedBox = []
        this.tableData.bodyList = []
      })
      .finally(() => {
        this.loading = false
        this.resetCurrPage = false
      })
  }

  // 导出
  //获取token
  get token() {
    return AppModule.token
  }

  // 导出点击
  private outExcel() {
    if (!this.checkedBox.length) {
      this.$Message.info('请选择需要导出的数据！')
    } else {
      exportExcel(
        this.outExcelApi +
          'token=' +
          this.token +
          '&ids=' +
          this.checkedBox.map((item: any) => item.id)
      )
    }
  }
}
</script>

<style scoped lang="scss">
.w200 {
  width: 200px;
}

.w300 {
  width: 300px;
}

.w150 {
  width: 150px;
}

.title {
  padding: 5px 0;
  p {
    margin-top: 3px;
  }
  i {
    color: #4fa6f3;
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

.theme-blue {
  margin-left: 5px;
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

.right-panel {
  padding: 0 15px;
  overflow: hidden;
  .form {
    background: $grayLight;
    margin-bottom: 15px;
    padding-top: 15px;
  }
}

.wrap {
  padding-bottom: 20px;
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

.red {
  padding-right: 5px;
}
</style>
