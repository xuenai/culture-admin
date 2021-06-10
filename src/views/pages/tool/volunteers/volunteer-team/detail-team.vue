<template>
  <div class="detail-wrap pd20">
    <!--审核结果-->
    <auditHead :data="headData" v-if="headData.status"></auditHead>
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
          <li class="item mt20 last">
            <i-col span="3" class="left">团队负责人：</i-col>
            <i-col span="21" class="right">
              <p
                v-for="item in desc.teamResponsiblePeople"
                v-if="
                  desc.teamResponsiblePeople &&
                    desc.teamResponsiblePeople.length
                "
              >
                {{ item.name }}({{ item.phone }})
                <router-link
                  :to="'/volunteers-management-desc/' + item.id + '/true'"
                  >查看详情</router-link
                >
              </p>
              <p
                v-if="
                  desc.teamResponsiblePeople &&
                    !desc.teamResponsiblePeople.length
                "
              >
                -
              </p>
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
            <p
              class="img-box"
              v-for="(item, index) in desc.teamHonorVoucher.split(',')"
            >
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
    <!--个性标签-->
    <div class="tips-panel clearfix" v-if="Volunteers && Volunteers.length">
      <span class="fl title">团队成员（{{ Volunteers.length }}）</span>
    </div>
    <ul class="volunteers clearfix" v-if="Volunteers && Volunteers.length">
      <router-link
        v-for="item in Volunteers"
        :to="{ path: `/volunteers-management-desc/${item.id}/false` }"
        :key="item.id"
        tag="li"
        class="item fl"
      >
        <div
          class="photo"
          :style="{ backgroundImage: `url(${item.head})` }"
        ></div>
        <p class="name line1" :title="item.name">{{ item.name }}</p>
        <p
          class="name line1"
          v-if="$store.state.app.siteInfo.creditStatus === 1"
        >
          诚信分：{{ item.creditScore + '（' + item.creditLevelName + '）' }}
        </p>
      </router-link>
    </ul>

    <div class="audit-record" v-if="recordsLog && recordsLog.length">
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

    <Row class="item mg20 mt20 submit-panel">
      <Col span="24">
        <!-- <Button
          type="primary"
          v-if="operates.includes('edit')"
          class="btn-cancel"
          @click="goEdit"
          >修改</Button
        > -->
        <Button class="submit ml20" @click="$router.go(-1)">返回</Button>
      </Col>
    </Row>

    <PreviewPics
      v-model="imgView"
      :imgs="imgUrl"
      :currIndex="currIndex"
    ></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import descMap from '@components/map/desc-map.vue'
import { PreviewPics } from '@components/index'

import {
  getVolunteerTeam,
  teamVolunteerList,
  volunteerTeamAuditRecord
} from '@service/tool'
import auditHead from '@views/pages/common/result-head.vue'
import { AppModule } from '@store/modules/app'
interface videoType {
  url: String
  image: String
  title: String
}

@Component({
  components: {
    descMap,
    PreviewPics,
    auditHead
  }
})
export default class detail extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates
  }
  // 详情数据
  private desc: object = {}
  // 是否预览图片
  private imgView: boolean = false
  // 预览图片索引
  private currIndex = 0
  // 预览图片集
  private imgUrl: Array<string> = []
  // 志愿团成员
  private Volunteers: Array<any> = []
  // 数据id
  private id: string | number = ''
  // 是否显示视频
  private show: Boolean = false

  created() {
    this.id = this.$route.params.id
    this.getVolunteerTeam(this.id)
    this.getVolunteerTeamItem(this.id)
    this.getRecord()
  }

  //去修改
  goEdit() {
    this.$router.push({
      path: '/volunteers-add-team',
      query: { id: this.id as string }
    })
  }

  // 预览图片
  private previewPic(src: Array<string>, idx: number) {
    this.imgUrl = src
    this.imgView = true
    this.currIndex = idx
  }
  // 审核记录
  private headData: object = {
    remark: '', //审核备注
    date: '', //审核日期
    status: -1 //审核状态
  }
  private recordsLog: Array<object> = []
  getRecord() {
    volunteerTeamAuditRecord({
      id: this.$route.params.id
    }).then((res: any) => {
      if (res.code === 0) {
        this.recordsLog = res.data.recordsLog
        //审核结果信息
        this.headData = {
          remark: res.data.currentAuditResult,
          date: res.data.dateTime,
          status: res.data.currentAuditStatus
        }
      }
    })
  }
  // 详情
  private getVolunteerTeam(id: string | number) {
    getVolunteerTeam({ id }).then((res: any) => {
      if (res.code === 0) {
        this.desc = res.data
      }
    })
  }

  // 志愿团成员
  private getVolunteerTeamItem(teamId: string | number) {
    teamVolunteerList({ teamId }).then((res: any) => {
      if (res.code === 0) {
        this.Volunteers = res.datas
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.message-list {
  .item {
    width: 50%;
    float: left;
    &.last {
      width: 100%;
    }
    .img-box {
      display: inline-block;
      width: 240px;
      height: 160px;
      margin: 0 10px 10px 0;
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
  line-height: 100px;
  text-align: center;
  &.no-photo {
    border: 1px solid #eee;
    box-shadow: 0 0 10px #eee;
  }
  .cloud-icon {
    font-size: 60px;
  }
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
.mt20 {
  margin-top: 10px;
}
.line1 {
  @include ellipsis();
}

.volunteers {
  margin-left: 18px;
  .item {
    width: 125px;
    margin: 15px 15px 0 0;
    cursor: pointer;
  }
  .photo {
    width: 70px;
    height: 70px;
    margin: 0 auto;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .name {
    margin-top: 5px;
    text-align: center;
    line-height: 18px;
  }
}

.detail-wrap {
  padding: 10px 15px 0;
  .label-name {
    width: 100px;
    line-height: 25px;
    padding-right: 10px;
    vertical-align: middle;
    text-align: right;
    color: $font01;
    font-weight: 600;
  }
  .no {
    display: inline-block;
    line-height: 25px;
  }
  .item-content {
    width: 65%;
    line-height: 25px;
    color: $font05;
    .img {
      display: inline-block;
      width: 240px;
      height: 160px;
      margin-right: 10px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &.simulate {
      p {
        display: inline-block;
        & + p {
          margin-left: 20px;
        }
      }
      .count {
        margin-left: 3px;
        width: 200px;
        text-align: left;
      }
    }
  }
  .map {
    height: 450px;
  }
  .items {
    display: inline-block;
    vertical-align: top;
    margin-right: 20px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }
  .cloud-img {
    display: block;
    &.activity-room {
      width: 200px;
      height: 150px;
      border-radius: 4px;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .activity-room-name {
    display: block;
    font-size: 14px;
    color: $font01;
    margin-top: 12px;
  }
  .tips-panel {
    margin-top: 30px;
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
    .tag-content {
      margin-left: 30px;
      color: $font02;
      line-height: 24px;
    }
  }
  .item-content {
    .button {
      & + .button {
        margin-left: 15px;
      }
    }
  }
  .w150 {
    width: 150px;
  }
  .submit-panel {
    margin-top: 40px;
  }
  .t-wrap {
    display: inline-block;
    width: 100%;
    .title {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid $borderLight;
      background-color: #f2f4f7;
    }
    .item-time {
      width: 100%;
      padding: 10px;
      border: 1px solid $borderLight;
      margin-top: -1px;
      word-wrap: break-word;
    }
    .item {
      width: 14%;
      & + .item {
        margin-left: -1px;
      }
    }
  }
  .timeLine {
    padding: 20px 20px 0;
  }
}
.audit-record {
  padding: 20px 0 0 10px;
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
