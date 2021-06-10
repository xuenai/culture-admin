<template>
  <div class="content">
    <Tabs
      :animated="false"
      @on-click="
        i => {
          params.status = [, 4, 79][i]
          search()
        }
      "
    >
      <Tab-pane label="全部"></Tab-pane>
      <Tab-pane :label="number04 > 0 ? label04 : '待审核'"></Tab-pane>
      <Tab-pane label="不通过"></Tab-pane>
    </Tabs>
    <Form
      :label-width="64"
      inline
      ref="formInline"
      :model="params"
      :rules="ruleInline"
    >
      <FormItem label="关键字">
        <i-input
          class="w200"
          placeholder="用户昵称/姓名/身份证号"
          v-model="params.keyWord"
          @on-enter="search"
          :maxlength="50"
        ></i-input>
      </FormItem>
      <FormItem label="申请时间">
        <Date-picker
          class="w200"
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          @on-change="
            t => {
              params.startTime = t[0]
              params.endTime = t[1]
              search()
            }
          "
        ></Date-picker>
        <Button class="ml20" type="primary" @click="search">搜索</Button>
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
      >
        <template slot-scope="{ row }" slot="head">
          <div
            class="img-box daq-no-header"
            :class="{volunteer:row.volunteerStatus == 1}"
          >
          <img class="cloud-img" :src="row.headImg" v-if="row.headImg" alt="">
          <span class="cloud-icon" v-else>&#xe6ee;</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="cardPhoto">
          <div class="cardPhoto">
            <img :src="row.idCardUp" @click.stop="viewImage(row, 0)" alt="" />
            <img :src="row.idCardDown" @click.stop="viewImage(row, 1)" alt="" />
          </div>
        </template>
        <template slot-scope="{ row }" slot="status">
          {{ status[row.status] }}
        </template>
        <template slot-scope="{ row }" slot="action">
          <a
            class="theme-blue"
            href="javascript:;"
            @click="
              () => {
                auditParams.id = row.id
                audit = true
                auditParams.auditResult = ''
                auditParams.auditStatus = 6
              }
            "
          >
            {{ row.status === 4 ? '审核' : '重审' }}
          </a>
        </template>
      </Table>
    </baseTable>

    <Modal footer-hide v-model="audit" title="审核">
      <Form
        :label-width="80"
        :model="auditParams"
        :rules="auditParams.auditStatus === 6 ? ruleValidate6 : ruleValidate79"
        ref="auditParams"
      >
        <FormItem label="审核结果">
          <RadioGroup v-model="auditParams.auditStatus">
            <Radio :label="6">通过</Radio>
            <Radio :label="79">不通过</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          v-if="auditParams.auditStatus === 6"
          :key="6"
          label="审核备注"
          prop="auditResult"
        >
          <Input
            v-model="auditParams.auditResult"
            type="textarea"
            :maxlength="200"
            style="width: 390px;"
            :autosize="{ minRows: 4, maxRows: 5 }"
            placeholder="请写下审核备注，不通过时审核备注必须填写。"
          />
        </FormItem>
        <FormItem
          v-if="auditParams.auditStatus === 79"
          :key="79"
          label="审核备注"
          prop="auditResult"
        >
          <Input
            v-model="auditParams.auditResult"
            type="textarea"
            :maxlength="200"
            style="width: 390px;"
            :autosize="{ minRows: 4, maxRows: 5 }"
            placeholder="请写下审核备注，不通过时审核备注必须填写。"
          />
        </FormItem>
        <FormItem :label-width="338">
          <Button class="btn" @click="audit = false">取消</Button>
          <Button
            class="btn"
            type="primary"
            @click="auditAction"
            style="margin-left:20px;"
            >确认</Button
          >
        </FormItem>
      </Form>
    </Modal>
    <!-- 图片预览 -->
    <PreviewPics
      v-model="visible"
      :imgs="imgUrl"
      :currIndex="currIndex"
    ></PreviewPics>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import baseTable from '@components/baseTable/baseTable.vue'
import {
  auditRealName,
  getRealNameList,
  getRealNameWaitAuditNum
} from '@service/audit'
import { PreviewPics } from '@components/index'

@Component({
  components: {
    baseTable,
    PreviewPics
  }
})
export default class Certification extends Vue {
  visible = false
  imgUrl: any = []
  currIndex = 0
  // 查看大图
  private viewImage(row: any, index: number) {
    this.imgUrl = [row.idCardUp, row.idCardDown]
    this.currIndex = index
    setTimeout(() => {
      this.visible = true
    }, 100)
  }
  private params: object = {
    status: '',
    keyWord: '',
    startTime: '',
    endTime: ''
  }
  private ruleInline: object = {}
  private number04: number = 0
  // 状态
  private status = <object>{
    1: '正常',
    2: '禁用',
    3: '草稿',
    4: '待审核',
    5: '审核中',
    6: '审核通过',
    7: '回退',
    79: '审核不通过',
    8: '已撤回',
    9: '终止'
  }
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: 'right'
  }
  private tableData = <any>{
    headList: [
      {
        title: '用户头像',
        align: 'center',
        slot: 'head',
        width: 100
      },
      {
        title: '用户昵称',
        key: 'nickName',
        align: 'center'
      },
      {
        title: '真实姓名',
        key: 'name',
        align: 'center'
      },
      {
        title: '认证证件',
        key: 'cardType',
        align: 'center'
      },
      {
        title: '身份证号',
        key: 'idCard',
        align: 'center'
      },
      {
        title: '证件照片',
        align: 'center',
        slot: 'cardPhoto'
      },
      {
        title: '提交时间',
        key: 'createTime',
        align: 'center'
      },
      {
        title: '状态',
        align: 'center',
        slot: 'status'
      },
      {
        title: '操作',
        width: 100,
        align: 'center',
        slot: 'action'
      }
    ],
    bodyList: []
  }
  private loading: boolean = false
  private audit: boolean = false

  created() {
    this.getRealNameWaitAuditNum()
    this.search()
  }

  // 待审核
  private getRealNameWaitAuditNum() {
    getRealNameWaitAuditNum().then((res: any) => {
      if (res.code === 0) {
        this.number04 = res.data
      }
    })
  }
  private search() {
    this.tableConfig.page.currPage = 1
    this.getList()
  }
  private getList(page: any = this.tableConfig.page) {
    this.loading = true
    getRealNameList({ ...this.params, ...page })
      .then((res: any) => {
        if (res.code === 0) {
          this.tableData.bodyList = res.datas
        }
      })
      .finally(() => (this.loading = false))
  }
  private auditParams: object = {
    id: '',
    auditStatus: 6,
    auditResult: ''
  }
  // 验证规则
  private ruleValidate6 = <any>{
    auditResult: [
      {
        message: '最多150个字符',
        trigger: 'blur',
        pattern: /.{0,150}$/
      }
    ]
  }
  // 验证规则
  private ruleValidate79 = <any>{
    auditResult: [
      {
        required: true,
        message: '审核备注不能为空',
        trigger: 'blur|change'
      }
    ]
  }
  // 实名认证
  private auditAction() {
    ;(this.$refs.auditParams as any).validate((valid: any) => {
      if (!valid) {
        //                    this.$Message.error("请将信息填写完整！");
        return
      }
      auditRealName(this.auditParams).then(res => {
        if (res.code === 0) {
          this.$Message.success('操作成功!')
          this.audit = false
          this.getRealNameWaitAuditNum()
          this.getList()
          this.loading = false
        }
      })
    })
  }
  // 待审核label
  private label04(h: Function) {
    return h('div', [
      h('span', '待审核'),
      h('Badge', {
        props: {
          count: this.number04
        }
      })
    ])
  }
}
</script>
<style lang="scss" scoped>
.content {
  padding: 0 15px;
}
.img-box {
  position: relative;
  z-index: 2;
  width: 60px;
  height: 60px;
  margin: 5px auto;
  // background: url('../../../../assets/image/daq-no-data.png') no-repeat
  //   center/cover;
  border-radius: 50%;
  &.volunteer:after {
    content: '';
    position: absolute;
     z-index: 99;
    top:0;
    right: -10px;
    width: 30px;
    height: 30px;
    background: url('../../../../assets/image/volunteer-log.png') no-repeat
      center/cover;
      
  }
  &.daq-no-header {
    position: relative;
    z-index: 2;
    background:rgba(54, 205, 100, .1);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: $theme;
  }
}
.cardPhoto {
  img {
    width: calc(50% - 10px);
    margin: 5px;
    cursor: pointer;
  }
}
.w200 {
  width: 200px;
}
</style>
