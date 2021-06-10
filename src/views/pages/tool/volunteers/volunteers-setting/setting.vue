<template>
  <div class="pd20">
    <div class="title-panel">
      <p class="title">志愿服务场所配置</p>
      <p class="tit-tip mt10">文化暖心·志愿为你</p>
    </div>
    <div class="content-list mt20">
      <p class="col">
        1、将志愿服务功能与文化场馆绑定，在文化场馆设置文化志愿组织总队、分队和支队；
      </p>
      <p class="col">
        2、总队、分队或支队使用文旅企业端即可处理服务区域的志愿者注册信息审核、志愿团队注册信息审核、志愿活动审核等工作；
      </p>
      <p class="col">
        3、总队可在文旅企业端查看并管理全省志愿服务相关工作信息。
      </p>
    </div>
    <div class="bind-company mt20">
      <p><span class="red">*</span> 请绑定文旅企业</p>
      <p class="mt15">
        <Input
          clearable
          readonly
          class="control"
          placeholder="请选择企业"
          v-model="companyName"
          @on-clear="orgIds = ''"
          @on-focus="show = true"
        />
      </p>
      <p class="mt15">
        <Button class="submit" type="primary" @click.stop="save">确认</Button>
      </p>
    </div>
    <div class="list-record mt20">
      <div class="title">操作记录</div>
      <Row class="mt20">
        <Col class="item" span="8">操作时间</Col>
        <Col class="item" span="8">操作人</Col>
        <Col class="item" span="8">绑定场所</Col>
      </Row>
      <Row class="body-list">
        <div v-for="(item, index) in configRecord" :key="index">
          <Col class="item" span="8">{{ item.operateTime }}</Col>
          <Col class="item" span="8">{{ item.operatePeople }}</Col>
          <Col class="item" span="8">{{ item.orgName }}</Col>
        </div>
      </Row>
    </div>
    <companyList
      :show="show"
      :selectIds="companyIds"
      @onClose="show = false"
      @onOkClick="getCompanyId"
    ></companyList>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import companyList from '@components/pop/company-list.vue'
import {
  volunteerSaveConfig,
  getVolunteerConfig,
  getConfigRecord
} from '@service/tool'
@Component({
  components: {
    companyList
  }
})
export default class LocalInfo extends Vue {
  private show: boolean = false
  private orgIds: string = ''
  get companyIds() {
    return this.orgIds.split(',')
  }
  private companyName: any = ''
  getCompanyId(list: Array<{ name: string; orgId: any }>) {
    this.orgIds = ''
    this.companyName = ''
    let names = this.companyName ? this.companyName.split(',') : []
    let ids = this.orgIds ? this.orgIds.split(',') : []
    list.forEach((item: { name: string; orgId: any }) => {
      if (!ids.includes(String(item.orgId))) {
        names.push(item.name)
        ids.push(item.orgId)
      }
    })
    this.companyName = names.toString()
    this.orgIds = ids.toString()
  }
  //绑定志愿者配置
  save() {
    let _this = this
    if (this.attribution && this.attribution.length) {
      let config = <any>{
        title: '操作提示',
        content: '确定要修改绑定场所？',
        okText: '确认',
        cancelText: '关闭',
        onOk: () => {
          _this.handleSubmit()
        }
      }
      this.$Modal.confirm(config)
    } else {
      _this.handleSubmit()
    }
  }
  handleSubmit() {
    if(!this.orgIds){
       this.$Message.error('请选企业！');
       return;
    }
    volunteerSaveConfig({ orgIds: this.orgIds }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success('绑定成功')
        this.getVolunteerConfig()
        this.getConfigRecord()
      }
    })
  }
  //获取志愿者配置
  attribution: any = []
  getVolunteerConfig() {
    getVolunteerConfig().then((res: any) => {
      if (res.code === 0) {
        this.attribution = res.datas
        this.companyName = this.attribution
          .map((item: any) => {
            return item.name
          })
          .toString()
        this.orgIds = this.attribution
          .map((item: any) => {
            return item.id
          })
          .toString()
      }
    })
  }
  //操作记录
  configRecord: any = []
  getConfigRecord() {
    getConfigRecord().then((res: any) => {
      if (res.code === 0) {
        this.configRecord = res.datas
      }
    })
  }
  created() {
    this.getVolunteerConfig()
    this.getConfigRecord()
  }
}
</script>
<style lang="scss">
.title-panel {
  padding: 30px;
  background: #f2f2f2;
  .title {
    font-weight: 700;
    font-size: 16px;
    line-height: 30px;
  }
}
.content-list {
  padding: 0 15px;
  .col {
    font-size: 13px;
    line-height: 25px;
  }
}
.bind-company {
  padding: 20px;
  .control {
    width: 300px;
  }
  .submit {
    width: 150px;
    padding: 8px 0;
  }
}
.list-record {
  .title {
    font-size: 15px;
    font-weight: 600;
  }
  .item {
    padding: 8px 0;
    border: 1px solid #bcbcbc;
    text-align: center;
    & + .item {
      margin-left: -1px;
    }
  }
  .body-list {
    .item {
      margin-top: -1px;
      padding: 12px 0;
    }
  }
}
</style>
