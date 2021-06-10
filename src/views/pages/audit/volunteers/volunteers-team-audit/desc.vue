<template>
  <div class="pd20" v-if="desc && desc.id">
    <div class="tips-panel clearfix mt10">
      <span class="fl title">基本信息</span>
    </div>
    <Row>
      <i-col span="4">
        <div class="header" :class="{ 'no-photo': !desc.teamIcon }">
          <img
            v-if="desc.teamIcon"
            :src="desc.teamIcon"
            alt=""
            class="cloud-img"
          />
          <i v-else class="cloud-icon">&#xe6ee;</i>
        </div>
      </i-col>
      <i-col span="20">
        <ul class="message-list clearfix">
          <li class="item mt20">
            <i-col span="6" class="left">团队名称：</i-col>
            <i-col span="18" class="right">{{ desc.teamName || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">服务地区：</i-col>
            <i-col span="18" class="right">{{
              desc.serviceRegionName || '-'
            }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">团队归属：</i-col>
            <i-col span="18" class="right">{{ desc.attribution || '-' }}</i-col>
          </li>

          <li class="item mt20">
            <i-col span="6" class="left">团队类型：</i-col>
            <i-col span="18" class="right">{{ desc.teamType || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">团队成立日期：</i-col>
            <i-col span="18" class="right">{{
              desc.establishTime || '-'
            }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">主管单位名称：</i-col>
            <i-col span="18" class="right">{{ desc.manageUnit || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">团队人数：</i-col>
            <i-col span="18" class="right">{{ desc.memberNum || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">团队志愿宣言：</i-col>
            <i-col span="18" class="right">{{ desc.teamSlogan || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">团队邮箱：</i-col>
            <i-col span="18" class="right">{{ desc.teamEmail || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">团队QQ：</i-col>
            <i-col span="18" class="right">{{ desc.teamQQ || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">志愿服务时间：</i-col>
            <i-col span="18" class="right">
              <span v-if="desc.teamServiceTimeType == 'WorkingDay'"
                >工作日</span
              >
              <span v-if="desc.teamServiceTimeType == 'RestDay'">休息日</span>
              <span v-if="desc.teamServiceTimeType == 'Unlimited'">不限</span>
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">团队地址：</i-col>
            <i-col span="18" class="right"
              >{{ desc.teamRegionName }}{{ desc.teamAddress }}</i-col
            >
          </li>
          <li class="item mt20 last"  v-if="desc.sourcePlatform!=='CulturalTourismCloudApi'">
            <i-col span="3" class="left">团队负责人：</i-col>
            <i-col span="21" class="right">
              <p
                v-for="item in desc.teamResponsiblePeople"
                v-if="desc.teamResponsiblePeople.length"
              >
                {{ item.name }}({{ item.phone }})
                <router-link
                  :to="'/volunteers-management-desc/' + item.id + '/true'"
                  >查看详情</router-link
                >
              </p>
              <p v-if="!desc.teamResponsiblePeople.length">-</p>
            </i-col>
          </li>
          <li class="item mt20 last">
            <i-col span="3" class="left">团队具备的特长或专业：</i-col>
            <i-col span="21" class="right">
              <Input
                class="intro"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 5 }"
                :placeholder="desc.teamSpecialty || '-'"
                readonly
              />
            </i-col>
          </li>
          <li class="item mt20 last">
            <i-col span="3" class="left">团队志愿服务工作经历：</i-col>
            <i-col span="21" class="right">
              <Input
                class="intro"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 5 }"
                :placeholder="desc.teamExperience || '-'"
                readonly
              />
            </i-col>
          </li>
          <li class="item mt20 last">
            <i-col span="3" class="left">团队简介：</i-col>
            <i-col span="21" class="right">
              <Input
                class="intro"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 5 }"
                :placeholder="desc.teamIntroduce || '-'"
                readonly
              />
            </i-col>
          </li>
        </ul>
      </i-col>
    </Row>
    <div class="tips-panel clearfix mt20">
      <span class="fl title">志愿资料</span>
    </div>
    <ul class="message-list clearfix">
      <li class="item mt20">
        <i-col span="6" class="left">团队累计服务时长：</i-col>
        <i-col span="18" class="right" v-if="desc.teamVolunteerCountVo">{{
          desc.teamVolunteerCountVo.memberTotalServiceTime
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">团队累计服务次数：</i-col>
        <i-col span="18" class="right" v-if="desc.teamVolunteerCountVo">{{
          desc.teamVolunteerCountVo.memberTotalServiceNum
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">团队志愿排名：</i-col>
        <i-col span="18" class="right">{{ desc.ranking }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">团队累计公益积分：</i-col>
        <i-col span="18" class="right" v-if="desc.teamVolunteerCountVo">{{
          desc.teamVolunteerCountVo.memberTotalIntegralNum
        }}</i-col>
      </li>
      <li class="item mt20 last">
        <i-col span="3" class="left">所获荣誉：</i-col>
        <i-col span="21" class="right">
          <div>{{ desc.teamHonor || '-' }}</div>
          <div class="mt10">
            <p class="img-box" v-for="(item, index) in desc.teamHonorVoucher">
              <img
                :src="item"
                alt=""
                class="cloud-img"
                v-if="item"
                @click.stop="previewPic(desc.teamHonorVoucher, index)"
              />
            </p>
          </div>
        </i-col>
      </li>
    </ul>
    <div class="tips-panel clearfix mt20" v-if="desc.sourcePlatform=='CulturalTourismCloudApi'&&!desc.volunteer">
      <span class="fl title">负责人信息</span>
    </div>
    <ul class="message-list clearfix" v-if="desc.sourcePlatform=='CulturalTourismCloudApi'&&!desc.volunteer">
      <li class="item mt20">
        <i-col span="6" class="left">姓名：</i-col>
        <i-col span="18" class="right" >{{
          desc.teamResponsiblePeople[0].name
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">性别：</i-col>
        <i-col span="18" class="right">{{
          desc.teamResponsiblePeople[0].sex
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">手机号：</i-col>
        <i-col span="18" class="right">{{ desc.teamResponsiblePeople[0].phone }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">身份证号：</i-col>
        <i-col span="18" class="right">{{
          desc.teamResponsiblePeople[0].idCard
        }}</i-col>
      </li>
       <li class="item mt20">
        <i-col span="6" class="left">年龄：</i-col>
        <i-col span="18" class="right">{{
          desc.teamResponsiblePeople[0].age
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">民族：</i-col>
        <i-col span="18" class="right">{{
          desc.teamResponsiblePeople[0].nation
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">政治面貌：</i-col>
        <i-col span="18" class="right">{{
          desc.teamResponsiblePeople[0].politicalAffiliation
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">最高学历：</i-col>
        <i-col span="18" class="right">{{
          desc.teamResponsiblePeople[0].education
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="6" class="left">从业状况：</i-col>
        <i-col span="18" class="right">{{
          desc.teamResponsiblePeople[0].employmentStatus
        }}</i-col>
      </li>
      <li class="item mt20">
            <i-col span="6" class="left">身份证正面照：</i-col>
            <i-col span="18" class="right"
              ><img
                :src="desc.teamResponsiblePeople[0].idCardPortrait"
                alt=""
                class="card"
                v-if="desc.teamResponsiblePeople[0].idCardPortrait"
                @click.stop="
                  previewPic(desc.teamResponsiblePeople[0].idCardPortrait.split(','), 0)
                "
              /><span v-if="!desc.teamResponsiblePeople[0].idCardPortrait">-</span></i-col
            >
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">身份证反面照：</i-col>
            <i-col span="18" class="right">
              <img
                :src="desc.teamResponsiblePeople[0].idCardNationalEmblem"
                alt=""
                class="card"
                v-if="desc.teamResponsiblePeople[0].idCardNationalEmblem"
                @click.stop="
                  previewPic(
                    desc.teamResponsiblePeople[0].idCardNationalEmblem.split(','),
                    0
                  )
                "
              /><span v-if="!desc.teamResponsiblePeople[0].idCardNationalEmblem">-</span>
            </i-col>
          </li>
    </ul>
    <div class="audit-record" v-if="recordsLog.length">
      <h3 class="title">审核记录</h3>
      <Timeline class="record-panel">
        <Timeline-item v-for="(item, index) in recordsLog" :key="index">
          <p class="time">{{ item.createTime }}</p>
          <p class="content">
            由【{{ item.name }}】【{{
              item.phone.substr(item.phone.length - 4, item.phone.length)
            }}】审核，审核结果：{{
              item.auditStatus === 6 ? '通过' : '不通过'
            }}。
            <span v-if="item.auditResult"
              >审核备注：{{ item.auditResult }}</span
            >
          </p>
        </Timeline-item>
      </Timeline>
    </div>
    <Form :label-width="100" class="mt20">
      <FormItem class="item" label="处理结果：">
        <Button
          class="pass"
          :class="params.auditStatus === 6 ? 'active' : ''"
          @click="setPass(true)"
          >通过</Button
        >
        <Button
          class="un-pass ml20"
          :class="params.auditStatus === 79 ? 'active' : ''"
          @click="setPass(false)"
          >不通过
        </Button>
      </FormItem>
      <FormItem class="item" label="处理备注：">
        <Input
          type="textarea"
          :rows="4"
          :maxlength="200"
          placeholder="请填写处理意见"
          style="width: 500px;"
          v-model="params.auditResult"
        />
      </FormItem>
      <FormItem class="item" label>
        <Button type="primary" @click.stop="saveAudit">审核</Button>
        <Button type="default" class="ml20" @click.stop="$router.go(-1)"
          >返回</Button
        >
      </FormItem>
    </Form>
     <PreviewPics
      v-model="imgView"
      :imgs="imageUrls"
      :currIndex="currIndex"
    ></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { setTeamChecked } from '@service/audit'
import { PreviewPics } from '@components/index'
import DishonestyList from '@components/dishonesty-list/list.vue'
import { AppModule } from '@store/modules/app'
import { getVolunteerTeam, volunteerTeamAuditRecord } from '@service/tool'

@Component({
  components: { PreviewPics, DishonestyList }
})
export default class ComponentName extends Vue {
  get creditStatus() {
    return AppModule.siteInfo.creditStatus
  }
  // 设置通过 || 不通过
  private batch: Number = 6
  private desc: Object = {}
  private params: any = {
    auditStatus: 6, //审核状态
    id: '', //资源ID
    auditResult: '' //审核内容
  }
  private dishonestyShow = false // 是否展示失约记录
  /** 图片浏览 S */
  private imgView = false
  private imageUrls: Array<String> = []
  private currIndex: Number = 0
  private previewPic(src: Array<string>, idx: number) {
    this.imageUrls = src
    this.imgView = true
    this.currIndex = idx
  }
  //设置是否选择通过审核
  setPass(isPass: boolean) {
    this.params.auditStatus = isPass ? 6 : 79
  }
  mounted() {
    this.params.id = this.$route.params.id
    this.getVolunteerDesc()
    this.getRecord()
  }
  // 详情
  private getVolunteerDesc() {
    getVolunteerTeam({
      id: this.$route.params.id
    }).then((data: any) => {
      this.desc = data.data as Object
    })
  }
  private recordsLog: Array<object> = []
  getRecord() {
    volunteerTeamAuditRecord({
      id: this.$route.params.id
    }).then((res: any) => {
      if (res.code === 0) {
        this.recordsLog = res.data.recordsLog
      }
    })
  }
  // 审核
  saveAudit() {
    let _this = this
    if (this.params.auditStatus === 79 && !this.params.auditResult) {
      _this.$Message.error('请填写备注信息')
      return
    }
    //验证并保存
    setTeamChecked(_this.params).then((res: any) => {
      if (res.code === 0) {
        if ((_this.params as any).auditStatus == 6) {
          _this.$Message.success('审核成功')
          _this.$router.go(-1)
        } else {
          _this.$Message.success('操作成功')
          _this.$router.go(-1)
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.time-line {
  margin: 15px;
}
.w300 {
  width: 300px;
}
.message-list {
  .item {
    width: 50%;
    float: left;
    &.last {
      width: 100%;
    }
  }
  .intro {
    max-width: 80%;
  }
  .left {
    text-align: right;
    font-weight: 600;
    color: #263b4d;
  }
  .right {
    padding: 0 10px;
    color: #6b7f8f;
    .img {
      display: inline-block;
      width: 180px;
      height: 120px;
      margin: 0 15px 15px 0;
      vertical-align: middle;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
    }
    .card {
      width: 240px;
      height: 160px;
      cursor: pointer;
      border-radius: 4px;
    }
  }
}
.header {
  width: 100px;
  height: 100px;
  margin: 20px auto 0;
  overflow: hidden;
  border-radius: 50%;
}
.tips-panel {
  background-color: $grayLight;
  padding: 20px;
  .title {
    position: relative;
    padding-left: 10px;
    color: $font01;
    font-weight: 600;
    font-size: 16px;
    &:after {
      position: absolute;
      left: 0;
      top: 4px;
      content: '';
      width: 3px;
      height: 16px;
      border-radius: 1.5px;
      background-color: $theme;
    }
  }
}
.audit-record {
  padding-top: 20px;
  border-top: 1px solid $borderLight;
  border-bottom: 1px solid $borderLight;
  margin: 15px 0;
  .record-panel {
    padding: 20px 20px;
    .content {
      color: $font03;
    }
  }
}
</style>
