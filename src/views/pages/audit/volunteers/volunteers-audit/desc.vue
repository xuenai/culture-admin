<template>
  <div class="pd20" v-if="desc && desc.id">
    <div class="tips-panel clearfix">
      <span class="fl title">基本信息</span>
    </div>
    <Row>
      <i-col span="4">
        <div class="header" :class="{'no-photo': !desc.head}">
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
      <div class="tips-panel clearfix mt20" v-if="dishonestyShow">
          <span class="fl title">失约记录</span>
      </div>
      <DishonestyList v-if="desc.phone" :params="{phone: desc.phone}" @getList="list => dishonestyShow = !!list.length"></DishonestyList>

    <div class="audit-record" v-if="recordsLog.length">
      <h3 class="title">审核记录</h3>
      <Timeline class="record-panel">
        <Timeline-item v-for="(item, index) in recordsLog" :key="index">
          <p class="time">{{item.createTime}}</p>
          <p class="content">
            由【{{ item.name }}】【{{
              item.phone.substr(item.phone.length - 4, item.phone.length)
            }}】审核，审核结果：{{
              item.auditStatus === 6 ? "通过" : "不通过"
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
        <Button type="default" class="ml20" @click.stop="$router.go(-1)">返回</Button>
      </FormItem>
    </Form>
   <PreviewPics v-model="previewPicShow" :imgs="imageUrls" :currIndex="previewPicIndex" :title="imgTitle"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { setVolunteerChecked, getVolunteerDesc } from "@service/audit";
import { PreviewPics } from "@components/index";
import { volunteerAuditRecord } from '@service/tool'
import DishonestyList from "@components/dishonesty-list/list.vue"
@Component({
  components: { PreviewPics, DishonestyList }
})
export default class ComponentName extends Vue {
  // 设置通过 || 不通过
  private batch: Number = 6;
  private desc: Object = {};
  private recordsLog: Array<object> = [];
  private params: any = {
    auditStatus: 6, //审核状态
    id: "", //资源ID
    auditResult: "" //审核内容
  };
  private dishonestyShow = false; // 是否展示失约记录
   /** 图片浏览 S */
  private previewPicShow = false
  private imageUrls: Array<String> = []
  private imgTitle: string= ""
  private previewPicIndex: Number = 0
  private showChecked = false // 是否展示审核记录
  previewPic(urls: any, index: Number, title: any) {
    this.imgTitle = title
    this.imageUrls = urls
    this.previewPicShow = true
    this.previewPicIndex = index
  }
  //设置是否选择通过审核
  setPass(isPass: boolean) {
    this.params.auditStatus = isPass ? 6 : 79;
  }
  mounted() {
    this.getVolunteerDesc();
    this.params.id = this.$route.params.id;
  }
  // 详情
  private getVolunteerDesc() {
    getVolunteerDesc({
      id: this.$route.params.id
    }).then((data: any) => {
      this.desc = data.data as Object;
      this.imageUrls.push(data.data.idCardUp as String);
      this.imageUrls.push(data.data.idCardDown as String);
    });
  }
  // 审核
  saveAudit() {
    let _this = this;
    if (this.params.auditStatus === 79 && !this.params.auditResult) {
      _this.$Message.error("请填写备注信息");
      return;
    }
    //验证并保存
    setVolunteerChecked(_this.params).then((res: any) => {
      if (res.code === 0) {
        if ((_this.params as any).auditStatus == 6) {
          _this.$Message.success("审核成功");
          _this.$router.go(-1);
        } else {
          _this.$Message.success("操作成功");
          _this.$router.go(-1);
        }
      }
    });
  }
  getRecord() {
    volunteerAuditRecord({
      id:this.$route.params.id
    }).then((res: any) => {
      if (res.code === 0) {
        this.recordsLog = res.data.recordsLog
      }
    })
  }
}
</script>

<style lang='scss' scoped>
    .time-line {
        margin: 15px;
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
      & + .img-box {
        margin-left: 10px;
      }
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
      content: "";
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
