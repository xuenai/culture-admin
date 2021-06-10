<template>
  <div class="pd20" v-if="volunteerDesc && volunteerDesc.id">
    <div class="tips-panel clearfix">
      <span class="fl title">基本信息</span>
    </div>
    <Row>
      <i-col span="4">
        <div class="header">
          <img :src="volunteerDesc.head" alt="" class="cloud-img" />
        </div>
      </i-col>
      <i-col span="20">
        <div class="message-list clearfix">
          <div class="item mt20">
            <i-col span="6" class="left">姓名：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.name || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">性别：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.sex || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">手机号：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.phone || '-'
            }}</i-col>
          </div>

          <div class="item mt20">
            <i-col span="6" class="left">身份证号：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.idCard || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">年龄：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.age || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">民族：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.nation || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">政治面貌：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.politicalAppearance || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">最高学历：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.education || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">毕业院校及专业：</i-col>
            <i-col
              span="18"
              class="right"
              v-if="volunteerDesc.school || volunteerDesc.discipline"
              >{{ volunteerDesc.school
              }}{{
                volunteerDesc.discipline ? `(${volunteerDesc.discipline})` : ''
              }}</i-col
            >
            <i-col
              span="18"
              class="right"
              v-if="!volunteerDesc.school && !volunteerDesc.discipline"
              >-</i-col
            >
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">从业状况：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.employmentStatus || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">单位名称：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.company || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">职位职称：</i-col>
            <i-col span="18" class="right">{{
              volunteerDesc.positionName || '-'
            }}</i-col>
          </div>
          <div class="item mt20">
            <i-col span="6" class="left">紧急联系人：</i-col>
            <i-col span="18" class="right"
              >{{ volunteerDesc.emergencyContactName }}({{
                volunteerDesc.emergencyContactPhone
              }})</i-col
            >
          </div>
          <li class="item mt20">
            <i-col span="6" class="left">个人特长：</i-col>
            <i-col span="18" class="right">
              <span
                v-for="item in volunteerDesc.specialty"
                v-if="volunteerDesc.specialty && volunteerDesc.specialty.length"
                >{{ item }}、</span
              >
              <span v-if="!volunteerDesc.specialty.length">-</span>
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">健康状态：</i-col>
            <i-col span="18" class="right">
              {{ volunteerDesc.healthStatus || '-' }}
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">擅长语言：</i-col>
            <i-col span="18" class="right">
              <span
                v-for="item in volunteerDesc.language"
                v-if="volunteerDesc.language && volunteerDesc.language.length"
                >{{ item }}、</span
              >
              <span v-if="!volunteerDesc.language.length">-</span>
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">电子邮箱：</i-col>
            <i-col span="18" class="right">
              {{ volunteerDesc.email || '-' }}
            </i-col>
          </li>
          <li class="item mt20">
            <i-col span="6" class="left">QQ：</i-col>
            <i-col span="18" class="right">
              {{ volunteerDesc.qq || '-' }}
            </i-col>
          </li>
          <div class="item mt20">
            <i-col span="6" class="left">详细地址：</i-col>
            <i-col span="18" class="right"
              >{{ volunteerDesc.regionName }} {{ volunteerDesc.address }}</i-col
            >
          </div>
          <div
            class="clearfix"
            style="display:block;width:100%;overflow:hidden;"
          >
            <div class="item mt20">
              <i-col span="6" class="left">身份证正面照：</i-col>
              <i-col span="18" class="right"
                ><img
                  :src="volunteerDesc.idCardPortrait"
                  alt=""
                  class="card"
                  v-if="volunteerDesc.idCardPortrait"
                  @click.stop="
                    previewPic(
                      volunteerDesc.idCardPortrait.split(','),
                      0,
                      '身份证正面照'
                    )
                  "
                /><span v-if="!volunteerDesc.idCardPortrait">-</span></i-col
              >
            </div>
            <div class="item mt20">
              <i-col span="6" class="left">身份证反面照：</i-col>
              <i-col span="18" class="right">
                <img
                  :src="volunteerDesc.idCardNationalEmblem"
                  alt=""
                  class="card"
                  v-if="volunteerDesc.idCardNationalEmblem"
                  @click.stop="
                    previewPic(
                      volunteerDesc.idCardPortrait.split(','),
                      0,
                      '身份证反面照'
                    )
                  "
                /><span v-if="!volunteerDesc.idCardNationalEmblem">-</span>
              </i-col>
            </div>
          </div>
          <div class="item mt20 last">
            <i-col span="3" class="left">个人简介：</i-col>
            <i-col span="21" class="right">
              <Input
                class="intro"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 5 }"
                :placeholder="volunteerDesc.resume || '-'"
                readonly
              />
            </i-col>
          </div>
        </div>
      </i-col>
    </Row>
    <div class="tips-panel clearfix mt20">
      <span class="fl title">志愿资料</span>
    </div>
    <ul class="message-list clearfix">
      <li class="item mt20">
        <i-col span="4" class="left">加入时间：</i-col>
        <i-col span="20" class="right">{{
          volunteerDesc.createTime || '-'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">服务地区：</i-col>
        <i-col span="20" class="right">{{
          volunteerDesc.serviceRegionName || '-'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">归属：</i-col>
        <i-col span="20" class="right">{{
          volunteerDesc.attribution || '-'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">志愿服务时间：</i-col>
        <i-col span="20" class="right">
          <span v-if="volunteerDesc.serviceTimeType == 'WorkingDay'"
            >工作日</span
          >
          <span v-if="volunteerDesc.serviceTimeType == 'RestDay'">休息日</span>
          <span v-if="volunteerDesc.serviceTimeType == 'Unlimited'">不限</span>
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">服务时长：</i-col>
        <i-col span="20" class="right"
          >{{ volunteerDesc.serviceTime || 0 }}小时</i-col
        >
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">服务次数：</i-col>
        <i-col span="20" class="right">{{
          volunteerDesc.serviceNum || '-'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">公益积分：</i-col>
        <i-col span="20" class="right">{{
          volunteerDesc.cumulativeIntegral || '-'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">星级：</i-col>
        <i-col span="20" class="right">{{
          setStar(volunteerDesc.level)
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">志愿排名：</i-col>
        <i-col span="20" class="right">{{
          volunteerDesc.ranking > 0 ? `${volunteerDesc.ranking}次` : '无名次'
        }}</i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">所属团队：</i-col>
        <i-col span="20" class="right">
          <span
            v-for="item in volunteerDesc.volunteerTeam"
            v-if="volunteerDesc.volunteerTeam.length"
            >{{ item.teamName }}、</span
          >
          <span v-if="!volunteerDesc.volunteerTeam.length">-</span>
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">志愿服务意向：</i-col>
        <i-col span="20" class="right">
          <span
            v-for="item in volunteerDesc.serviceIntention"
            v-if="volunteerDesc.serviceIntention.length"
            >{{ item }}</span
          >
          <span v-if="!volunteerDesc.serviceIntention.length">-</span>
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">志愿宣言：</i-col>
        <i-col span="20" class="right">
          {{ volunteerDesc.declaration || '-' }}
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">是否接受异地服务：</i-col>
        <i-col span="20" class="right">
          {{ volunteerDesc.offSiteService ? '是' : '否' }}
        </i-col>
      </li>
      <li class="item mt20">
        <i-col span="4" class="left">是否接受调配：</i-col>
        <i-col span="20" class="right">
          {{ volunteerDesc.acceptDeployment ? '是' : '否' }}
        </i-col>
      </li>
      <li class="item mt20 last">
        <i-col span="2" class="left">所获荣誉：</i-col>
        <i-col span="20" class="right">
          <div>{{ volunteerDesc.honor }}</div>
          <div class="mt10">
            <p
              class="img-box"
              v-for="(item, index) in volunteerDesc.honorVoucher"
            >
              <img
                :src="item"
                alt=""
                class="cloud-img"
                v-if="item"
                @click.stop="
                  previewPic(volunteerDesc.honorVoucher, index, '所获荣誉凭证')
                "
              />
            </p>
          </div>
        </i-col>
      </li>
    </ul>
    <!-- 入团记录 -->
    <joinTeamRecord :volunteerId="$route.query.volunteerId"></joinTeamRecord>
    <!-- 申请信息 -->
    <div class="tips-panel clearfix">
      <span class="fl title">申请信息</span>
    </div>
    <ul class="message-list clearfix">
      <li class="item mt20 last">
        <i-col span="2" class="left">申请团队：</i-col>
        <i-col span="22" class="right">
          <Input
            type="text"
            class="w300"
            :placeholder="desc.teamName || '-'"
            disabled
          />
        </i-col>
      </li>
      <li class="item mt20 last">
        <i-col span="2" class="left">申请理由：</i-col>
        <i-col span="22" class="right">
          <Input
            class="intro"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 5 }"
            :placeholder="desc.reason || '-'"
            readonly
          />
        </i-col>
      </li>
      <li class="item mt20 last">
        <i-col span="2" class="left">申请凭证：</i-col>
        <i-col span="22" class="right">
          <span
            class="img"
            v-if="desc.images && desc.images.length"
            v-for="(item, index) in desc.images"
            :key="item"
            @click="previewImg(index)"
            ><img class="cloud-img" :src="item" alt=""
          /></span>
          <span v-else>-</span>
        </i-col>
      </li>
    </ul>
    <!-- 失约记录 -->
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
    <!-- 审核记录 -->
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
    <!-- 处理审核 -->
    <Form :label-width="100" class="mt20 border">
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
      v-model="previewPicShow"
      :imgs="imageUrls"
      :title="previewPicTitle"
      :currIndex="previewPicIndex"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getTeamDesc,
  getVolunteerDesc,
  volunteerTeamRelationAudit,
  teamRelationAuditRecord
} from '@service/audit'
import { PreviewPics } from '@components/index'
import DishonestyList from '@components/dishonesty-list/list.vue'
import joinTeamRecord from '@views/pages/tool/volunteers/common/join-teamRecord.vue'
import { AppModule } from '@store/modules/app'

@Component({
  components: { PreviewPics, DishonestyList, joinTeamRecord }
})
export default class ComponentName extends Vue {
  get creditStatus() {
    return AppModule.siteInfo.creditStatus
  }
  // 设置通过 || 不通过
  private batch: Number = 6
  private desc: Object = {}
  private recordsLog: Array<object> = []
  private params: any = {
    auditStatus: 6, //审核状态
    id: '', //资源ID
    auditResult: '' //审核内容
  }
  private dishonestyShow = false // 是否展示失约记录
  /**S 图片浏览 */
  private previewPicShow = false
  private imageUrls: Array<String> = []
  private previewPicIndex: Number = 0
  private previewPicTitle: string = ''
  previewPic(urls: any, index: Number, title: string) {
    this.imageUrls = urls
    this.previewPicShow = true
    this.previewPicIndex = index
    this.previewPicTitle = title
  }
  /**E 图片浏览 */
  //设置是否选择通过审核
  setPass(isPass: boolean) {
    this.params.auditStatus = isPass ? 6 : 79
  }
  mounted() {
    this.params.id = this.$route.params.id
    this.getVolunteerDesc()
    this.auditDesc()
    this.getRecord()
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
  // 申请详情
  private auditDesc() {
    getTeamDesc({
      id: this.$route.params.id
    }).then((data: any) => {
      this.desc = data.data as Object
    })
  }
  //志愿者详情
  volunteerDesc: any = {}
  getVolunteerDesc() {
    getVolunteerDesc({
      id: this.$route.query.volunteerId
    }).then((res: any) => {
      if (res.code === 0) {
        this.volunteerDesc = res.data
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
    volunteerTeamRelationAudit(_this.params).then((res: any) => {
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

  getRecord() {
    teamRelationAuditRecord({
      id: this.$route.params.id
    }).then((res: any) => {
      if (res.code === 0) {
        this.recordsLog = res.data.recordsLog
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
  margin: 15px 0;
  .record-panel {
    padding: 20px 20px;
    .content {
      color: $font03;
    }
  }
}
.border {
  padding-top: 20px;
  border-top: 1px solid $borderLight;
}
</style>
