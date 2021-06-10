<template>
  <div class="container">
    <!--基本信息-->
    <div class="tips-panel clearfix">
      <span class="fl title">基本信息</span>
    </div>
    <Form
      class="mt20"
      ref="params"
      :label-width="120"
      :model="params"
      :rules="ruleValidate"
    >
      <FormItem class="formItem" label="志愿者照片：">
        <uploadImg2
          :defaultImage="defaultImage"
          @getImagesList="getImagesList"
          :limit="1"
        ></uploadImg2>
      </FormItem>
      <Row class="item">
        <Col span="12">
          <FormItem label="姓名：" prop="name">
            <Input
              type="text"
              class="control"
              :maxlength="50"
              v-model="params.name"
              placeholder="姓名"
            />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="民族：" prop="nation">
            <Select class="control" v-model="params.nation">
              <Option v-for="(item, i) in nation" :value="item" :key="item">{{
                item
              }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row class="item">
        <Col span="12">
          <FormItem label="联系电话：" prop="phone">
            <phone v-model="params.phone" class="control"></phone>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="身份证号：" prop="idCard">
            <Input
              type="text"
              class="control"
              :maxlength="18"
              v-model="params.idCard"
              placeholder="请填写身份证号"
            />
          </FormItem>
        </Col>
      </Row>
      <Row class="item">
        <Col span="12">
          <FormItem
            class="formItem"
            label="身份证正面照："
            prop="idCardPortrait"
          >
            <uploadImg2
              :defaultImage="defaultIdCardImage1"
              @getImagesList="getIdCardImagesList1"
              :limit="1"
            ></uploadImg2>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            class="formItem"
            label="身份证反面照："
            prop="idCardNationalEmblem"
          >
            <uploadImg2
              :defaultImage="defaultIdCardImage2"
              @getImagesList="getIdCardImagesList2"
              :limit="1"
            ></uploadImg2>
          </FormItem>
        </Col>
      </Row>
      <Row class="item">
        <Col span="12">
          <FormItem
            class="formItem"
            label="政治面貌："
            prop="politicalAffiliation"
          >
            <Select class="control" v-model="params.politicalAffiliation">
              <Option
                v-for="(item, i) in politicalAffiliation"
                :value="item"
                :key="item"
                >{{ item }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem class="formItem" label="最高学历：" prop="education">
            <Select class="control" v-model="params.education">
              <Option
                v-for="(item, i) in education"
                :value="item"
                :key="item"
                >{{ item }}</Option
              >
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem class="formItem" label="从业状况：" prop="employmentStatus">
        <Select class="control" v-model="params.employmentStatus">
          <Option
            v-for="(item, i) in employmentStatus"
            :value="item"
            :key="item"
            >{{ item }}</Option
          >
        </Select>
      </FormItem>
      <Row class="item">
        <Row class="item">
          <Col span="12">
            <FormItem class="formItem" label="毕业院校：">
              <Input
                type="text"
                class="control"
                :maxlength="100"
                v-model="params.school"
                placeholder="请填写毕业院校"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem class="formItem" label="专业：">
              <Input
                type="text"
                class="control"
                :maxlength="100"
                v-model="params.discipline"
                placeholder="请填专业"
              />
            </FormItem>
          </Col>
        </Row>

        <Col span="12">
          <FormItem class="formItem" label="单位名称：">
            <Input
              type="text"
              class="control"
              :maxlength="100"
              v-model="params.company"
              placeholder="请填写单位名称"
            />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem class="formItem" label="职务职称：">
            <Input
              type="text"
              class="control"
              :maxlength="50"
              v-model="params.positionName"
              placeholder="请填写单位名称"
            />
          </FormItem>
        </Col>
      </Row>
      <Row class="item">
        <Col span="12">
          <FormItem
            class="formItem"
            label="紧急联系人姓名："
            prop="emergencyContactName"
          >
            <Input
              type="text"
              class="control"
              :maxlength="50"
              v-model="params.emergencyContactName"
              placeholder="请填写紧急联系人姓名"
            />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem
            class="formItem"
            label="紧急联系人电话："
            prop="emergencyContactPhone"
          >
            <phone
              v-model="params.emergencyContactPhone"
              class="control"
            ></phone>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="个人特长：">
        <span
          class="choice-tag"
          :class="specialtyList.indexOf(item) !== -1 ? 'active' : ''"
          v-for="(item, index) in specialty"
          :key="item"
          @click="handleTags(item, 'specialty', 'specialtyList')"
          >{{ item }}</span
        >
      </FormItem>
      <FormItem class="formItem" label="健康状态：" prop="healthStatus">
        <Select class="control" v-model="params.healthStatus">
          <Option v-for="(item, i) in healthStatus" :value="item" :key="item">{{
            item
          }}</Option>
        </Select>
      </FormItem>
      <FormItem label="擅长语言：">
        <span
          class="choice-tag"
          :class="languageList.indexOf(item) !== -1 ? 'active' : ''"
          v-for="(item, index) in language"
          :key="item"
          @click="handleTags(item, 'language', 'languageList')"
          >{{ item }}</span
        >
      </FormItem>
      <Row class="item">
        <Col span="12">
          <FormItem class="formItem" label="电子邮箱：">
            <Input
              type="text"
              class="control"
              :maxlength="200"
              v-model="params.email"
              placeholder="请填写电子邮箱"
            />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem class="formItem" label="QQ号：">
            <number
              :precision="0"
              :maxlength="99999999999999999999"
              :min="0"
              class="control"
              v-model="params.qq"
            ></number>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="联系地址：" prop="region">
        <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
        <Input
          class="control"
          :maxlength="255"
          placeholder="详细地址"
          v-model="params.address"
        />
      </FormItem>
      <FormItem label="个人简介">
        <Input
          type="textarea"
          :rows="6"
          :maxlength="100"
          v-model="params.personalProfile"
          placeholder="请输入个人简介，最多不超过100字"
        />
      </FormItem>
      <!--志愿资料-->
      <div class="tips-panel clearfix">
        <span class="fl title">志愿资料</span>
      </div>
      <Row class="item mt20">
        <Col span="12">
          <FormItem label="服务地区：" prop="serviceRegion">
            {{regionName}}
            <!-- <distPicker
              :default="regionPath1"
              @onChange="getRegion1"
            ></distPicker> -->
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem class="formItem" label="志愿者归属：" prop="attribution">
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
      </Row>
      <FormItem label="志愿服务意向：">
        <span
          class="choice-tag"
          :class="serviceIntentionList.indexOf(item) !== -1 ? 'active' : ''"
          v-for="(item, index) in serviceIntention"
          :key="item"
          @click="handleTags(item, 'serviceIntention', 'serviceIntentionList')"
          >{{ item }}</span
        >
      </FormItem>
      <Row class="item">
        <Col span="12">
          <FormItem label="志愿服务时间：" prop="serviceTimeType">
            <Select class="control" v-model="params.serviceTimeType">
              <Option value="Unlimited">不限</Option>
              <Option value="WorkingDay">工作日</Option>
              <Option value="RestDay">休息日</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem class="formItem" label="志愿服务宣言：">
            <Input
              type="text"
              class="control"
              :maxlength="50"
              v-model="params.declaration"
              placeholder="请填写，不超过50字"
            />
          </FormItem>
        </Col>
      </Row>
      <Row class="item">
        <Col span="12">
          <FormItem label="是否愿意异地服务：">
            <RadioGroup v-model="params.offSiteService">
              <Radio :label="1">
                <span>愿意</span>
              </Radio>
              <Radio :label="0">
                <span>不愿意</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem class="formItem" label="是否接受调配：">
            <RadioGroup v-model="params.acceptDeployment">
              <Radio :label="1">
                <span>接受</span>
              </Radio>
              <Radio :label="0">
                <span>不接受</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="志愿服务所获荣誉：">
        <Input
          type="textarea"
          class="textarea"
          :rows="6"
          :maxlength="500"
          v-model="params.honor"
          placeholder="请输入所获荣誉，最多不超过500字"
        />
        <uploadImg2
          class="mt10"
          :defaultImage="defaultHonorVoucher"
          @getImagesList="getHonorVoucherImages"
          :limit="9"
        ></uploadImg2>
      </FormItem>
      <FormItem label class="submit">
        <Button type="primary" @click="save()">提交</Button>
        <Button class="ml20" type="primary" v-if="!params.id || (params.id && params.status === 3)" @click="save(3)">存草稿</Button>
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  getVolunteerDictValue,
  getVolunteerConfig,
  addVolunteer,
  getVolunteerManDesc
} from '@service/tool'
import uploadImg from '@components/upload/upload-image.vue'
import uploadImg2 from '@components/upload/upload-image2.vue'
import distPicker from '@components/distPicker/distPicker.vue'
import { AppModule } from "@store/modules/app";
interface imgType {
  id: number
  url: string
  name?: string
}
@Component({
  components: {
    uploadImg,
    uploadImg2,
    distPicker
  }
})
export default class add extends Vue {
  private params: Object = {
    head: '', //头像
    name: '', //姓名
    nation: '', //民族
    phone: '', //电话
    idCard: '', //身份证号
    idCardPortrait: '', //身份证人像面
    idCardNationalEmblem: '', //身份证国徽面
    education: '', //学历
    politicalAffiliation: '', //政治面貌
    discipline: '', //专业
    employmentStatus: '', //从业状况
    company: '', //单位名称
    positionName: '', //职位名称
    emergencyContactName: '', //紧急联系人姓名
    emergencyContactPhone: '', //紧急联系人电话
    specialty: '', //特长
    language: '', //擅长语言
    healthStatus: '', //健康状态
    email: '', //邮箱
    qq: '', //qq
    address: '', //地址
    region: '', //志愿者所在地区编码
    personalProfile: '', //个人简介
    serviceRegion: AppModule.regionPath, //服务地区编码
    attribution: '', //志愿者归属
    serviceIntention: '', //服务意向
    serviceTimeType: '', //	服务时间类型
    declaration: '', //宣言
    offSiteService: '', //是否异地服务
    acceptDeployment: '', //是否接受调配
    honor: '', //服务荣誉
    honorVoucher: '', //荣誉凭证
    status:''//1正常 3草稿
  }
  /**S 验证 */
  private ruleValidate: any = {
    // createCompany: [
    //   { required: true, message: '请选择创建者', trigger: 'blur' }
    // ],
    name: [
      { required: true, message: '请填写志愿者姓名', trigger: 'blur' },
      { type: 'string', max: 50, message: '最多输入50个字符' }
    ],
    idCard: [
      { required: true, validator: this.validationCard, trigger: 'blur' }
    ],
    idCardPortrait: [
      { required: true, message: '请上传身份证正面照', trigger: 'change' }
    ],
    idCardNationalEmblem: [
      { required: true, message: '请上传身份证反面照', trigger: 'change' }
    ],
    nation: [{ required: true, message: '请选择民族', trigger: 'change' }],
    phone: [
      {
        required: true,
        validator: this.validPhone,
        trigger: 'blur'
      }
    ],
    politicalAffiliation: [
      { required: true, message: '请选择政治面貌', trigger: 'change' }
    ],
    education: [{ required: true, message: '请选择学历', trigger: 'change' }],
    employmentStatus: [
      { required: true, message: '请选择从业状况', trigger: 'change' }
    ],
    healthStatus: [
      { required: true, message: '请选择健康状态', trigger: 'change' }
    ],
    emergencyContactName: [
      { required: true, message: '请填写紧急联系人姓名', trigger: 'blur' },
      { type: 'string', max: 50, message: '最多输入50个字符' }
    ],
    emergencyContactPhone: [
      {
        required: true,
        validator: this.validEmergencyContactPhone,
        trigger: 'blur'
      }
    ],
    serviceRegion: [
      { required: true, message: '请选择服务地区', trigger: 'change' }
    ],
    serviceTimeType: [
      { required: true, message: '请选择服务时间', trigger: 'change' }
    ],
    attribution: [
      { required: true, validator: this.valAttribution, trigger: 'change' }
    ]
  }
  //校验身份证：
  validationCard(rule: any, value: any, callback: any) {
    let idCardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    if (!value || !idCardReg.test(value)) {
      callback(new Error('请输入正确的身份证号码！'))
    } else {
      callback()
    }
  }
  //校验电话号码：
  validPhone(rule: any, value: any, callback: any) {
    if (!value) {
      callback(new Error('请填写正确的联系电话'))
    } else {
      callback()
    }
  }
  //校验紧急联系人电话号码：
  validEmergencyContactPhone(rule: any, value: any, callback: any) {
    if (!value) {
      callback(new Error('请填写正确紧急联系人电话'))
    } else {
      callback()
    }
  }
  // 志愿者归属验证
  valAttribution(rule: any, value: any, callback: any) {
    if (!value) {
      callback(new Error('请选择志愿者归属'))
    } else {
      callback()
    }
  }
  /**E 验证 */

  //志愿者归属
  attribution: any = []
  getVolunteerConfig() {
    getVolunteerConfig().then((res: any) => {
      if (res.code === 0) {
        this.attribution = res.datas
      }
    })
  }
  //地区编码
  private regionPath: string = ''
  private regionPath1: string = ''
  private regionName: string = AppModule.regionName;
  //获取地区region
  getRegion(data: any) {
    ;(this.params as any).region = data.region
  }
  getRegion1(data: any) {
    ;(this.params as any).serviceRegion = data.region
  }
  /**图片上传 */
  // 志愿者头像
  private defaultImage: Array<imgType> = []
  //志愿者图片
  private getImagesList(list: Array<{ id: number }>) {
    ;(this.params as any).head = list
      .map((data: any) => data.url || '')
      .join(',')
  }
  // 身份证
  private defaultIdCardImage1: Array<imgType> = []
  private defaultIdCardImage2: Array<imgType> = []
  //身份证
  private getIdCardImagesList1(list: Array<{ id: number }>) {
    ;(this.params as any).idCardPortrait = list
      .map((data: any) => data.url || '')
      .join(',')
  }
  private getIdCardImagesList2(list: Array<{ id: number }>) {
    ;(this.params as any).idCardNationalEmblem = list
      .map((data: any) => data.url || '')
      .join(',')
  }
  private defaultHonorVoucher: Array<imgType> = []
  private getHonorVoucherImages(list: Array<{ id: number }>) {
    ;(this.params as any).honorVoucher = list
      .map((data: any) => data.url || '')
      .join(',')
  }
  /**图片上传 */
  /**S 民族、学历、政治面貌、从业状况、个人特长、健康状态 */
  selectList: Array<object> = [
    { type: 'NATION', name: 'nation' },
    { type: 'POLITICS_FACE', name: 'politicalAffiliation' },
    { type: 'EDUCATION', name: 'education' },
    { type: 'PROFESSION', name: 'employmentStatus' },
    { type: 'SPECIALTY', name: 'specialty' },
    { type: 'LANGUAGE', name: 'language' },
    { type: 'HEALTH_STATUS', name: 'healthStatus' },
    { type: 'SERVICE_INTENTION', name: 'serviceIntention' }
  ]
  nation: Array<object> = []
  politicalAffiliation: Array<object> = []
  education: Array<object> = []
  employmentStatus: Array<object> = []
  specialty: Array<object> = []
  healthStatus: Array<object> = []
  language: Array<object> = []
  serviceIntention: Array<object> = []
  getType(type: any, name: any) {
    let _this = this
    getVolunteerDictValue({ dictType: type }).then((res: any) => {
      if (res.code === 0) {
        _this[name] = res.datas
      }
    })
  }
  //多选按钮
  specialtyList: Array<object> = [] //个人特长
  languageList: Array<object> = [] //擅长语言
  serviceIntentionList: Array<object> = [] //擅长语言
  handleTags(item: any, name: any, list: any) {
    if (this[list].length >= 10) {
      this.$Message.error('最多只能选10个')
      return
    }
    if (this[list].indexOf(item) == -1) {
      this[list].push(item)
    } else {
      this[list].forEach((i: any, index: any) => {
        if (i == item) this[list].splice(index, 1)
      })
    }
    ;(this.params as any)[name] = this[list].join(',')
  }
  /**E 民族 */
  //取消
  goBack() {
    this.$router.go(-1)
  }
  save(status:any) {
    (this.params as any).status=status;//1正常 3草稿
    ;(this.$refs.params as any).validate((valid: any) => {
      if (valid) {
        addVolunteer(this.params).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success('保存成功')
            this.$router.go(-1);
          }
        })
      }
    })
  }
  //详情
  getDesc() {
    getVolunteerManDesc({ id: this.$route.query.id }).then((res: any) => {
      if (res.code === 0) {
        this.params = res.data
        ;(this.params as any).offSiteService = res.data.offSiteService ? 1 : 0
        ;(this.params as any).acceptDeployment = res.data.acceptDeployment
          ? 1
          : 0
        this.specialtyList = res.data.specialty //个人特长
        this.languageList = res.data.language //擅长语言
        this.serviceIntentionList = res.data.serviceIntention //服务意向
        ;(this.params as any).attribution = parseInt(res.data.attribution) //归属
        this.defaultImage = res.data.head ? [{ id: 0, url: res.data.head }] : [] //志愿者照片
        this.defaultIdCardImage1 = res.data.idCardPortrait
          ? [{ id: 0, url: res.data.idCardPortrait }]
          : [] //身份证正面
        this.defaultIdCardImage2 = res.data.idCardNationalEmblem
          ? [{ id: 0, url: res.data.idCardNationalEmblem }]
          : [] //身份证反面
        this.defaultHonorVoucher = res.data.honorVoucher.length
          ? res.data.honorVoucher.map((item: any, index: number) => {
              return {
                id: index,
                url: item
              }
            })
          : [] //荣誉凭证
      }
    })
  }
  mounted() {
    this.getVolunteerConfig()
    this.selectList.forEach((item: any) => {
      this.getType(item.type, item.name)
    })
    if (this.$route.query.id) {
      this.getDesc()
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 0 15px 15px;
  .control {
    width: 300px !important;
  }
  .textarea {
    width: 500px;
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
}
</style>
