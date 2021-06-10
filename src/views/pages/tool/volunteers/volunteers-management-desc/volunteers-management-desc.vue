<template>
  <div class="pd20" v-if="desc && desc.name">
    <!--审核结果-->
    <auditHead :data="headData" v-if="headData.status"></auditHead>
    <div class="tips-panel clearfix mt10">
      <span class="fl title">基本信息</span>
    </div>
    <Row>
      <i-col span="4">
        <div class="header" :class="{ 'no-photo': !desc.head }">
          <img v-if="desc.head" :src="desc.head" alt="" class="cloud-img" />
          <i v-else class="cloud-icon">&#xe6ee;</i>
        </div>
      </i-col>
      <i-col span="20">
        <ul class="message-list clearfix">
          <li class="item mt20">
            <i-col span="6" class="left">姓名：</i-col>
            <i-col span="18" class="right">{{ desc.name || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">性别：</i-col>
            <i-col span="18" class="right">{{ desc.sex || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">手机号：</i-col>
            <i-col span="18" class="right">{{ desc.phone || '-' }}</i-col>
          </li>

          <li class="item mt20">
            <i-col span="6" class="left">身份证号：</i-col>
            <i-col span="18" class="right">{{ desc.idCard || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">年龄：</i-col>
            <i-col span="18" class="right">{{ desc.age || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">民族：</i-col>
            <i-col span="18" class="right">{{ desc.nation || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">政治面貌：</i-col>
            <i-col span="18" class="right">{{
              desc.politicalAppearance || '-'
            }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">最高学历：</i-col>
            <i-col span="18" class="right">{{ desc.education || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">毕业院校</i-col>
            <i-col span="18" class="right">{{ desc.school || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">专业</i-col>
            <i-col span="18" class="right">{{ desc.discipline || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">从业状况：</i-col>
            <i-col span="18" class="right">{{
              desc.employmentStatus || '-'
            }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">单位名称：</i-col>
            <i-col span="18" class="right">{{ desc.company || '-' }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">职位职称：</i-col>
            <i-col span="18" class="right">{{
              desc.positionName || '-'
            }}</i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">紧急联系人：</i-col>
            <i-col span="18" class="right"
              >{{ desc.emergencyContactName }}({{
                desc.emergencyContactPhone
              }})</i-col
            >
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">个人特长：</i-col>
            <i-col span="18" class="right">
              <span
                v-for="item in desc.specialty"
                v-if="desc.specialty && desc.specialty.length"
                >{{ item }}、</span
              >
              <span v-else>-</span>
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">健康状态：</i-col>
            <i-col span="18" class="right">
              {{ desc.healthStatus || '-' }}
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">擅长语言：</i-col>
            <i-col span="18" class="right">
              <span
                v-for="item in desc.language"
                v-if="desc.language && desc.language.length"
                >{{ item }}、</span
              >
              <span v-else>-</span>
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">电子邮箱：</i-col>
            <i-col span="18" class="right">
              {{ desc.email || '-' }}
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">QQ：</i-col>
            <i-col span="18" class="right">
              {{ desc.qq || '-' }}
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">详细地址：</i-col>
            <i-col span="18" class="right"
              >{{ desc.regionName }} {{ desc.address || '-' }}</i-col
            >
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">身份证正面照：</i-col>
            <i-col span="18" class="right"
              ><img
                :src="desc.idCardPortrait"
                alt=""
                class="card"
                v-if="desc.idCardPortrait"
                @click.stop="
                  previewPic(desc.idCardPortrait.split(','), 0, '身份证正面照')
                "
              /><span v-if="!desc.idCardPortrait">-</span></i-col
            >
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">身份证反面照：</i-col>
            <i-col span="18" class="right">
              <img
                :src="desc.idCardNationalEmblem"
                alt=""
                class="card"
                v-if="desc.idCardNationalEmblem"
                @click.stop="
                  previewPic(
                    desc.idCardNationalEmblem.split(','),
                    0,
                    '身份证反面照'
                  )
                "
              /><span v-if="!desc.idCardNationalEmblem">-</span>
            </i-col>
          </li>
          <li class="item mt20 last">
            <i-col span="3" class="left">个人简介：</i-col>
            <i-col span="21" class="right">
              <Input
                class="intro"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 5 }"
                :placeholder="desc.personalProfile || '-'"
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
        <i-col span="4" class="left">加入时间：</i-col>
        <i-col span="20" class="right">{{ desc.createTime || '-' }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">服务地区：</i-col>
        <i-col span="20" class="right">{{
          desc.serviceRegionName || '-'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">归属：</i-col>
        <i-col span="20" class="right">{{ desc.attribution || '-' }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">志愿服务时间：</i-col>
        <i-col span="20" class="right">
          <span v-if="desc.serviceTimeType == 'WorkingDay'">工作日</span>
          <span v-if="desc.serviceTimeType == 'RestDay'">休息日</span>
          <span v-if="desc.serviceTimeType == 'Unlimited'">不限</span>
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">服务时长：</i-col>
        <i-col span="20" class="right">{{ desc.serviceTime || 0 }}小时</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">服务次数：</i-col>
        <i-col span="20" class="right">{{ desc.serviceNum || '-' }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">公益积分：</i-col>
        <i-col span="20" class="right">{{
          desc.cumulativeIntegral || '-'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">星级：</i-col>
        <i-col span="20" class="right">{{ setStar(desc.level) }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">志愿排名：</i-col>
        <i-col span="20" class="right">{{
          desc.ranking > 0 ? `${desc.ranking}次` : '无名次'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">所属团队：</i-col>
        <i-col span="20" class="right">
          <span
            v-for="item in desc.volunteerTeam"
            v-if="desc.volunteerTeam.length"
            >{{ item.teamName }}、</span
          >
          <span v-if="!desc.volunteerTeam.length">-</span>
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">志愿服务意向：</i-col>
        <i-col span="20" class="right">
          <span
            v-for="item in desc.serviceIntention"
            v-if="desc.serviceIntention.length"
            >{{ item }}</span
          >
          <span v-else>-</span>
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">志愿宣言：</i-col>
        <i-col span="20" class="right">
          {{ desc.declaration || '-' }}
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">是否接受异地服务：</i-col>
        <i-col span="20" class="right">
          {{ desc.offSiteService ? '是' : '否' }}
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">是否接受调配：</i-col>
        <i-col span="20" class="right">
          {{ desc.acceptDeployment ? '是' : '否' }}
        </i-col>
      </li>
      <li class="item mt20 last">
        <i-col span="2" class="left">所获荣誉：</i-col>
        <i-col span="20" class="right">
          <div>{{ desc.honor }}</div>
          <div class="mt10">
            <p class="img-box" v-for="(item, index) in desc.honorVoucher">
              <img
                :src="item"
                alt=""
                class="cloud-img"
                v-if="item"
                @click.stop="
                  previewPic(desc.honorVoucher, index, '所获荣誉凭证')
                "
              />
            </p>
          </div>
        </i-col>
      </li>
    </ul>
    <!-- 入团记录 -->
    <joinTeamRecord :volunteerId="$route.params.id"></joinTeamRecord>
    <div
      class="tips-panel clearfix mt20"
      v-if="dishonestyShow && creditStatus === 1"
    >
      <span class="fl title">失约记录</span>
    </div>
    <DishonestyList
      v-if="desc.phone && creditStatus === 1"
      :params="{ phone: desc.phone }"
      @getList="list => (dishonestyShow = !!list.length)"
    ></DishonestyList>
    <div class="audit-record" v-if="recordsLog.length && showChecked">
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
    <Button @click.stop="goHistory" v-if="showChecked && recordsLog.length"
      >返回</Button
    >
    <ul class="message-list clearfix" v-if="!showChecked">
      <li class="item mt20">
        <i-col span="4" class="left pr">
          <Button @click.stop="goHistory">返回</Button></i-col
        >
      </li>
    </ul>
    <PreviewPics
      v-model="previewPicShow"
      :imgs="imageUrls"
      :currIndex="previewPicIndex"
      :title="imgTitle"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getVolunteerDesc } from '@service/audit'
import { volunteerAuditRecord } from '@service/tool'
import { PreviewPics } from '@components/index'
import DishonestyList from '@components/dishonesty-list/list.vue'
import { AppModule } from '@store/modules/app'
import auditHead from '@views/pages/common/result-head.vue'
import joinTeamRecord from '@views/pages/tool/volunteers/common/join-teamRecord.vue'
@Component({
  components: {
    PreviewPics,
    DishonestyList,
    auditHead,
    joinTeamRecord
  }
})
export default class ComponentName extends Vue {
  get creditStatus() {
    return AppModule.siteInfo.creditStatus
  }
  // 设置通过 || 不通过
  private desc: Object = {}
  private recordsLog: Array<object> = []
  /** 图片浏览 S */
  private previewPicShow = false
  private imageUrls: Array<String> = []
  private imgTitle: string = ''
  private previewPicIndex: Number = 0
  private showChecked = false // 是否展示审核记录
  private dishonestyShow = false // 是否展示失约记录
  previewPic(urls: any, index: Number, title: any) {
    this.imgTitle = title
    this.imageUrls = urls
    this.previewPicShow = true
    this.previewPicIndex = index
  }
  mounted() {
    this.getVolunteerDesc()
    this.getRecord()
    if (this.$route.params.status === 'true') {
      this.showChecked = true
    }
  }
  // 星级
  private setStar(star: Number) {
    switch (star) {
      case 0:
        return '-'
      case 1:
        return '一星'
      case 2:
        return '二星'
      case 3:
        return '三星'
      case 4:
        return '四星'
      case 5:
        return '五星'
    }
  }
  // 详情
  private getVolunteerDesc() {
    getVolunteerDesc({
      [(this.$route.query.id_type as string) || 'id']: this.$route.params.id
    }).then((data: any) => {
      this.desc = data.data as Object
    })
  }
  // 审核记录
  private headData: object = {
    remark: '', //审核备注
    date: '', //审核日期
    status: -1 //审核状态
  }
  getRecord() {
    volunteerAuditRecord({
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
  goHistory() {
    this.$router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
.pr {
  padding-right: 5px;
}
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
