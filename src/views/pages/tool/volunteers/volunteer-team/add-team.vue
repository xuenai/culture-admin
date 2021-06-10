<template>
  <div class="container add-volunteer-team-page">
    <!--基本信息-->
    <div class="tips-panel clearfix">
      <span class="fl title">基本信息</span>
    </div>
    <Form
      class="mt20"
      ref="params"
      :label-width="140"
      :model="params"
      :rules="ruleValidate"
    >
      <!--团队介绍-->
      <FormItem label="团队标志" prop="teamIcon">
        <UploadImg2
          :defaultImage="defaultIconImage"
          @getImagesList="list => (params.teamIcon = list[0].url)"
          :limit="1"
        ></UploadImg2>
      </FormItem>
      <Row class="item">
        <Col span="12">
          <FormItem label="团队名称" class="mt20" prop="teamName">
            <Input
              class="control"
              placeholder="请填写志愿团队全称"
              v-model="params.teamName"
            />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="团队类型" class="mt20" prop="teamType">
            <Select class="control" v-model="params.teamType">
              <Option value>请选择</Option>
              <Option v-for="item in teamTypes" :key="item" :value="item">{{
                item
              }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row class="item">
        <Col span="12">
          <FormItem label="团队成立日期">
            <DatePicker
              type="date"
              :value="params.establishTime"
              @on-change="time => (params.establishTime = time)"
              placeholder="请选择成立时间"
              style="width: 300px"
            >
            </DatePicker>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="主管单位">
            <Input
              class="control"
              style="margin-right: 10px;"
              :maxlength="200"
              placeholder="填写主管单位名称"
              v-model="params.manageUnit"
            />
          </FormItem>
        </Col>
      </Row>
      <Row class="item">
        <Col span="12">
          <FormItem label="团队负责人" prop="teamResponsiblePeopleIds">
            <Input
              clearable
              readonly
              class="control"
              :maxlength="200"
              v-model="teamResponsiblePeopleName"
              @on-clear="params.teamResponsiblePeopleIds = ''"
              @on-focus="modalShow = true"
              placeholder="请选择团队负责人，可多选"
            />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem class="formItem" label="团队邮箱：">
            <Input
              type="text"
              class="control"
              :maxlength="200"
              v-model="params.teamEmail"
              placeholder="请填写电子邮箱"
            />
          </FormItem>
        </Col>
      </Row>
      <Row class="item">
        <Col span="12">
          <FormItem class="formItem" label="团队QQ：">
            <number
              :precision="0"
              :maxlength="99999999999999999999"
              :min="0"
              class="control"
              v-model="params.teamQq"
            ></number>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem class="formItem" label="团队志愿宣言：">
            <Input
              type="text"
              class="control"
              :maxlength="200"
              v-model="params.teamSlogan"
              placeholder="请填写"
            />
          </FormItem>
        </Col>
      </Row>
      <FormItem label="团队地址" prop="teamRegion">
        <distPicker
          :default="regionPath"
          @onChange="
            d => {
              params.teamRegion = d.region
            }
          "
        ></distPicker>
        <Input
          class="control"
          placeholder="详细地址"
          v-model="params.teamAddress"
        />
      </FormItem>
      <FormItem label="" class="">
        <div>
          <mapMarker
            id="map"
            :region="params.teamRegion"
            @getAddress="getLongLat"
            :address="
              params.id && params.longitude && params.latitude
                ? [params.longitude, params.latitude]
                : ''
            "
          ></mapMarker>
          <Input type="text" v-model="params.longitude" v-show="false" />
        </div>
      </FormItem>
      <FormItem label="团队具备的特长和专业" class="mt20">
        <Input
          type="textarea"
          :rows="6"
          :maxlength="200"
          v-model="params.teamSpecialty"
          placeholder="最多不超过200字"
        />
      </FormItem>
      <FormItem label="团队志愿服务工作经历" class="mt20">
        <Input
          type="textarea"
          :rows="6"
          :maxlength="200"
          v-model="params.teamExperience"
          placeholder="最多不超过200字"
        />
      </FormItem>
      <FormItem label="团队介绍" class="mt20">
        <Input
          type="textarea"
          :rows="6"
          :maxlength="100"
          v-model="params.teamIntroduce"
          placeholder="最多不超过100字"
        />
      </FormItem>
      <!--志愿资料-->
      <div class="tips-panel clearfix">
        <span class="fl title">志愿资料</span>
      </div>
      <Row class="item mt20">
        <Col span="12">
          <FormItem class="formItem" label="团队归属：" prop="attribution">
            <Select class="control" v-model="params.attribution">
              <Option
                v-for="(item, i) in attribution"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="志愿服务时间：" prop="teamServiceTimeType">
            <Select class="control" v-model="params.teamServiceTimeType">
              <Option value="Unlimited">不限</Option>
              <Option value="WorkingDay">工作日</Option>
              <Option value="RestDay">休息日</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="服务地区：" prop="serviceRegion">
        {{regionName}}
        <!-- <distPicker :default="serviceRegionPath" :disabled="true" @onChange="
            d => {
              params.serviceRegion = d.region
            }
          "></distPicker> -->
      </FormItem>
      <FormItem label="志愿服务所获荣誉：">
        <Input
          type="textarea"
          class="textarea"
          :rows="6"
          :maxlength="500"
          v-model="params.teamAddress"
          placeholder="请输入所获荣誉，最多不超过500字"
        />
        <uploadImg2
          class="mt10"
          :defaultImage="defaultHonorVoucher"
          @getImagesList="getHonorVoucherImages"
          :limit="9"
        ></uploadImg2>
      </FormItem>
      <FormItem label="" class="submit">
        <Button type="primary" @click="handleSubmit(4)">保存</Button>
        <Button
          v-if="!params.id || (params.id && params.status === 3)"
          class="ml20"
          type="primary"
          @click="handleSubmit(3)"
          >存草稿</Button
        >
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
    <!-- 团队负责人弹框 -->
    <Voluntteam
      :modalShow="modalShow"
      :selectIds="teamResponsiblePeopleIds"
      @onClose="modalShow = false"
      @onOkClick="getTeamHead"
      :checkWay="0"
    ></Voluntteam>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import mapMarker from '@components/map/marker.vue'
import distPicker from '@components/distPicker/distPicker.vue'
import UploadImg2 from '@components/upload/upload-image2.vue'
import UploadVideo2 from '@components/upload/upload-video2.vue'
import UploadVoice from '@components/upload/upload-voice.vue'
import Voluntteam from '@views/pages/tool/volunteers/common/modal-teamHead.vue'
import { getParentsRegion } from '@util/comm'
import { AppModule } from "@store/modules/app";
import {
  saveVolunteerTeam,
  getVolunteerTeam,
  getVolunteerConfig,
  teamVolunteerList,
  getVolunteerDictValue
} from '@service/tool'
import { createrList } from '@service/content'
@Component({
  components: {
    mapMarker,
    distPicker, //地区插件
    UploadImg2,
    UploadVideo2,
    UploadVoice,
    Voluntteam
  }
})
export default class edit extends Vue {
  //保存参数
  private params: any = {
    teamIcon: '', //团队图标
    teamName: '', //名称
    teamType: '', //团队类型
    establishTime: '', //成立日期
    manageUnit: '', //主管单位
    teamResponsiblePeopleIds: '', //团队负责人
    teamEmail: '', //团队邮箱
    teamQq: '', //团队qq
    teamSlogan: '', //团队志愿者宣言
    teamRegion: '', //团队所在地区
    teamAddress: '', //团队所在地址
    longitude: '', //经度
    latitude: '', //纬度
    serviceRegion: AppModule.regionPath, //服务地区
    teamSpecialty: '', //团队特长
    teamExperience: '', //团队经历
    teamIntroduce: '', //团队介绍
    attribution: '', //志愿团队归属
    teamServiceTimeType: '', //服务时间类型
    teamHonor: '', //团队荣誉
    teamHonorVoucher: '' //团队荣誉凭证
  }
  //验证
  private ruleValidate = <any>{
    teamName: [
      { required: true, message: '名称不能为空', trigger: 'blur' },
      { type: 'string', max: 100, message: '最多输入100个字符' }
    ],
    teamRegion: [
      { required: true, validator: this.validTeamRegion, trigger: 'change' }
    ],
    teamType: [
      { required: true, message: '请选择团队类型', trigger: 'change' }
    ],
    attribution: [
      { required: true, validator: this.valAttribution, trigger: 'change' }
    ],
    teamResponsiblePeopleIds: [
      {
        required: true,
        validator: this.validTeamResponsiblePeopleIds,
        trigger: 'blur'
      }
    ],
    teamServiceTimeType: [
      { required: true, message: '请选择服务时间', trigger: 'change' }
    ],
    serviceRegion: [
      { required: true, message: '请选择服务地区', trigger: 'change' }
    ],
  }
  // 志愿者归属验证
  valAttribution(rule: any, value: any, callback: any) {
    if (!value) {
      callback(new Error('请选择志愿者归属'))
    } else {
      callback()
    }
  }
  //团队负责人验证
  validTeamResponsiblePeopleIds(rule: any, value: any, callback: any) {
    if (!this.params.teamResponsiblePeopleIds) {
      callback(new Error('请选择团队负责人'))
    } else {
      callback()
    }
  }
  //团队地址验证
  validTeamRegion(rule: any, value: any, callback: any) {
    if (!this.params.teamRegion) {
      callback(new Error('请选择团队地址'))
    } else if (!this.params.teamAddress) {
      callback(new Error('请填写团队详细地址'))
    } else if (!this.params.longitude && !this.params.latitude) {
      callback(new Error('请选择团队所在地图位置'))
    } else {
      callback()
    }
  }
  //地区编码
  private regionPath: string = AppModule.regionPath;
  private regionName: string = AppModule.regionName;
  private serviceRegionPath: string = ''
  mounted() {
    this.getVolunteerConfig()
    //修改页面id
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id
      this.getVolunteerTeam(this.$route.query.id)
    }

    this.getCreaterList()
    this.getDictType()
  }

  // 创建者列表
  private createrList: object[] = []
  // 获取创建者
  private getCreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.createrList = res.datas
      }
    })
  }
  //志愿者归属
  attribution: any = []
  getVolunteerConfig() {
    getVolunteerConfig().then((res: any) => {
      if (res.code === 0) {
        this.attribution = res.datas
      }
    })
  }
  // 获取志愿团类型
  private teamTypes: Array<{ value: any; name: string }> = []
  private getDictType() {
    getVolunteerDictValue({ dictType: 'VOLUNTEER_SERVICE_TYPE' }).then(
      (res: any) => {
        if (res.code === 0) {
          this.teamTypes = res.datas
        }
      }
    )
  }

  // 回显图片
  private defaultIconImage: Array<any> = []
  // 回显图片
  private defaultHonorVoucher: Array<any> = []

  private getHonorVoucherImages(list: Array<{ id: number }>) {
    ;(this.params as any).teamHonorVoucher = list
      .map((data: any) => data.url || '')
      .join(',')
  }
  //提交
  handleSubmit(status: number) {
    this.params.status = status
    //验证并保存
    ;(this.$refs.params as any).validate((valid: any) => {
      if (valid) {
        saveVolunteerTeam(this.params).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success('保存成功')
            this.$router.go(-1)
          }
        })
      } else {
        this.$Message.error('请将必填项填写正确!')
      }
    })
  }

  //取消
  goBack() {
    this.$router.go(-1)
  }

  //经纬度
  getLongLat(e: any) {
    this.params.longitude = e.lnglat.lng
    this.params.latitude = e.lnglat.lat
  }

  //获取详情
  getVolunteerTeam(id: any) {
    getVolunteerTeam({ id }).then((res: any) => {
      if (res.code === 0) {
        if (res.data.teamIcon) {
          this.defaultIconImage = [{ url: res.data.teamIcon, id: 'id_0' }]
        }
        Object.assign(this.params, res.data)
        this.params.createCompany = this.params.createCompany || -1
      }
    })
  }
  /**S 团队负责人 */
  private modalShow: any = false
  // 负责人回显
  get teamResponsiblePeopleIds() {
    return this.params.teamResponsiblePeopleIds.split(',')
  }
  // 获取负责人list
  private teamResponsiblePeopleName: any = ''
  getTeamHead(list: Array<{ name: string; id: any }>) {
    let names = this.teamResponsiblePeopleName
      ? this.teamResponsiblePeopleName.split(',')
      : []
    let ids = this.params.teamResponsiblePeopleIds
      ? this.params.teamResponsiblePeopleIds.split(',')
      : []
    list.forEach((item: { name: string; id: any }) => {
      if (!ids.includes(String(item.id))) {
        names.push(item.name)
        ids.push(item.id)
      }
    })
    this.teamResponsiblePeopleName = names.toString()
    this.params.teamResponsiblePeopleIds = ids.toString()
  }
  /**E 团队负责人 */
}
</script>

<style lang="scss">
//地区插件样式
.distpicker-address-wrapper select {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding: 0 5px;
}
</style>
<style lang="scss" scoped>
.container {
  padding: 0 15px 15px;
  .control {
    width: 300px !important;
  }
  .note {
    color: $lightGray;
    font-size: 13px;
  }
  .w150 {
    width: 150px;
  }
  .w100 {
    width: 100px;
  }
  .map {
    height: 400px;
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
    .tag-content {
      margin-left: 30px;
      color: $font02;
    }
  }
  .setDifferent {
    width: 60%;
    border: 1px solid $borderLight;
    padding: 10px 0 20px 0;
    .tab-wrap {
      border-bottom: 1px solid $borderLight;
    }
    .tab-name {
      padding: 0 20px;
      cursor: pointer;
      &.active {
        position: relative;
        &:before {
          position: absolute;
          content: '';
          left: 0;
          bottom: -1px;
          height: 2px;
          width: 90%;
          background-color: $theme;
        }
      }
    }
    .set-content {
      padding-left: 20px;
    }
  }
}
.condition {
  margin-bottom: 10px;
  .fromItem {
    label {
      margin-right: 5px;
    }
    display: inline-block;
    margin-right: 10px;
  }
  .table {
    margin-top: 10px;
    .siteInfoDiv {
      display: flex;
      margin: 5px 0;
      .imgDiv {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .address {
      max-width: 100%;
      @include ellipsis();
    }
    .name {
      max-width: 100%;
      @include ellipsis();
    }
  }
}
</style>
