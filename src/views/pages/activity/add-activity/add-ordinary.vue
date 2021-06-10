<template>
  <div class="activity page-activity-add">
    <div class="add-content-detail-title">
      <!-- 进度条 -->
      <ul class="header-goods">
        <li class="active">
          <em class="demo2"></em>
          <span class="demo1 hasNo"></span>
          <span>1 创建活动</span>
        </li>
        <li>
          <em class="demo2 noRightM"></em>
          <span>2 编辑活动内容</span>
        </li>
      </ul>
      <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 基本信息</p>
      <div class="add-content-detail-content">
        <Form ref="formData" :model="formData" :label-width="100" :rules="ruleValidate">
          <FormItem label="创建者" prop="createCompany">
            <!-- 回显修改时不允许再次编辑 -->
            <Select v-model="formData.createCompany" @on-change="createCompanyChange"
              :disabled="!isSite" filterable style="width: 250px;text-align:left;">
              <Option v-for="option in siteList" :value="option.id" :key="option.id">{{ option.name.trim() }}</Option>
            </Select>
          </FormItem>
          <FormItem label="活动名称" prop="name">
            <Input placeholder="请输入活动名称" style="width: 250px" v-model="formData.name"
              :maxlength="50" />
            <span class="prompt ml20">50字以内</span>
          </FormItem>
          <FormItem label="活动副标题" prop="subhead">
            <Input placeholder="请输入活动副标题" style="width: 250px" v-model="formData.subhead"
              :maxlength="50" />
            <span class="prompt ml20">50字以内</span>
          </FormItem>
          <FormItem label="活动特色" prop="remark">
            <Input placeholder="请输入活动特色" style="width: 250px" v-model="formData.remark"
              :maxlength="20" />
            <span class="prompt ml20">20字以内</span>
          </FormItem>
          <FormItem label="活动分类" prop="activityClassify">
            <span class="choice-tag" :class="formData.activityClassify == item.id ? 'active' : ''"
              v-for="item in activityClassify" :key="item.id"
              @click="()=>{formData.activityClassify = item.id;$refs.formData.validateField('activityClassify')}">{{ item.labelName }}</span>
          </FormItem>
          <div class="tag-box">
            <FormItem label="活动标签" prop="tag">
              <tags resourceType="CONTENT_TYPE_ACTIVITY" labelType="ACTIVITY_LABEL"
                :defaultIds="formData.tag" :limit="3" @onChange="ids => formData.tag = ids"></tags>
            </FormItem>
          </div>
          <FormItem label="活动时间" prop="useStartTime">
            <DatePicker :disabled="keyContrll" :value="[formData.useStartTime, formData.useEndTime]"
              @on-change="setActivityTime" type="datetimerange" format="yyyy-MM-dd HH:mm"
              placeholder="请选择活动起始日期、时间" style="width: 300px"></DatePicker>
          </FormItem>
          <FormItem label="联系电话" prop="phone">
            <Input type="tel" placeholder="联系电话" style="width: 250px" v-model="formData.phone" />
          </FormItem>
          <FormItem label="活动级别" prop="activityLevel">
            <span class="choice-tag" :class="{ active: formData.activityLevel == item.value }"
              v-for="item in activityLevel" :key="item.value"
              @click="()=>{formData.activityLevel=item.value;$refs.formData.validateField('activityLevel')}">{{ item.labelName }}</span>
          </FormItem>
          <FormItem label="可参加的人数" prop="stock">
            <InputNumber :max="999" :min="1" v-model="formData.stock" />
          </FormItem>
          <div>
            <FormItem label="活动场所">
              <Input placeholder="请选择场所" readonly style="width: 250px" :disabled="keyContrll"
                :title="formData.activityName" clearable
                @on-clear="formData.resourceParams = activityIds = ''" v-model="formData.activityName"
                @on-focus="!keyContrll && (place = true)" />
            </FormItem>
          </div>
          <FormItem label="活动地址" prop="address">
            <VDistpicker :default="formData.regionPath" @onChange="pickerChange"></VDistpicker>
            <Input placeholder="请输入街道门牌号..." v-model="formData.address" style="width: 250px"
              class="ml20" :maxlength="50" />
          </FormItem>
          <FormItem v-if="hasMounted" prop="longitude">
            <Map :id="'map' + stamp" :lab="true" :address="[formData.longitude, formData.latitude]"
              :region="formData.region" @getAddress="getAddress"></Map>
          </FormItem>
          <FormItem label="关联志愿团队" prop="voluntTeamName">
            <Input placeholder="请选择活动所属志愿团队，可多选" readonly style="width: 250px"
              :disabled="keyContrll" clearable :title="formData.voluntTeamName"
              @on-clear="formData.voluntTeamStr = ''" v-model="formData.voluntTeamName"
              @on-focus="!keyContrll && (voluntShow0 = true)" />
          </FormItem>
          <FormItem label="关联文化社团" prop="associationName">
            <Input placeholder="请选择活动所属社团，可多选" readonly style="width: 250px" clearable
              :title="formData.associationName" @on-clear="formData.associationStr = ''"
              v-model="formData.associationName" @on-focus="voluntShow1 = true" />
          </FormItem>
          <!-- 往期活动 -->
          <FormItem label="往期活动" prop="alreadyActivity">
            <span class="scenic" v-for="(item,i) in activityList"
              :key="item.id">{{ item.name }}<span @click="activityList.splice(i,1)"></span></span>
            <Button type="primary" @click="ActivityListShow = true">添加</Button>
            <span class="prompt" style="margin-left: 99px;">注：活动标签最多三个</span>
          </FormItem>

          <!--活动单位-->
          <div class="mt20">
            <p class="title-tool">
              <i class="cloud-icon">&#xe697;</i> 活动单位
            </p>
            <div class="add-content-detail-content">
              <FormItem label="主办单位" prop="sponsor">
                <Input v-model="formData.sponsor" placeholder="请输入主办单位名称" :maxlength="50"
                  style="width: 250px" />
              </FormItem>
              <FormItem label="协办单位">
                <Input v-model="formData.coOrganizer" placeholder="请输入协办单位名称" :maxlength="50"
                  style="width: 250px" />
              </FormItem>
              <FormItem label="承办单位">
                <Input v-model="formData.undertakeUnit" placeholder="请输入承办单位名称" :maxlength="50"
                  style="width: 250px" />
              </FormItem>
              <FormItem label="指导单位">
                <Input v-model="formData.teachUnit" placeholder="请输入指导单位名称" :maxlength="50"
                  style="width: 250px" />
              </FormItem>
            </div>
          </div>

          <!--活动介绍-->
          <div class="mt20">
            <p class="title-tool">
              <i class="cloud-icon">&#xe697;</i> 活动介绍
            </p>
            <div class="add-content-detail-content">
              <FormItem>
                <UploadImg2 :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="9">
                </UploadImg2>
                <FormItem label="活动主图" class="activity-img" prop="images"></FormItem>
              </FormItem>
              <FormItem label="活动介绍" required prop="introduce">
                <div class="uedit">
                  <Ueditor v-model="formData.introduce" id="uedit1"></Ueditor>
                </div>
              </FormItem>
              <FormItem label="温馨提示">
                <div class="uedit">
                  <Ueditor v-model="formData.hint" id="uedit2"></Ueditor>
                </div>
              </FormItem>
            </div>
          </div>

          <FormItem>
            <Button type="primary" @click="activitySaveStatus1">保存</Button>
            <Button type="primary" style="margin-left: 8px" v-if="showDraft"
              @click="activitySaveStatus2">存草稿</Button>
            <Button style="margin-left: 8px" @click="goBack">返回</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <uninPlace :show="place" :orgId="formData.createCompany" :defaultChoose="getPlaceIds"
      @onOkClick="onOkClick" @onClose="place = false"></uninPlace>
    <Voluntteam :show="voluntShow0" :selectIds="voluntIds" @onClose="voluntShow0 = false"
      @onOkClick="getVolunt" :type="0"></Voluntteam>
    <Voluntteam :show="voluntShow1" :selectIds="associatioIds" @onClose="voluntShow1 = false"
      @onOkClick="getAssociation" :type="1"></Voluntteam>
    <!-- <AddTag v-model="AddTagShow" @getTag="item => activityClassify.push(item)"></AddTag> -->
    <ActivityList :params="activityPopParams" v-model="ActivityListShow" :excludeActivityId="formData.id"
      @onOkClick="list => activityList = [...activityList, ...list.filter(d=>!activityList.some(e=>e.id === d.id))]">
    </ActivityList>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import Map from "@components/map/marker.vue";
import Ueditor from "@components/ueditor/ueditor.vue";
import uninPlace from "@components/uninPlace/uninPlace.vue";
import Voluntteam from "@components/pop/volunt-team.vue";
import UploadImg2 from "@components/upload/upload-image2.vue";
import ActivityList from "@components/pop/activity-list.vue";
// import AddTag from "@components/add-activityclass/index.vue";
// import AddTag from "./addTag.vue";
// import phone from "@components/unNecessaryPhoneInput/unNecessaryPhoneInput.vue";
import tags from "@components/tags/tags.vue";
import VDistpicker from "@components/distPicker/distPicker.vue";
import { activitySave, getActivityDetial } from "@service/activity";
import { getTagsSelect } from "@service/common";
import { createrList } from "@service/content";
import { getParentsRegion } from "@util/comm";

@Component({
  components: {
    BaseTable,
    Map,
    Ueditor,
    uninPlace,
    tags,
    VDistpicker,
    UploadImg2,
    Voluntteam,
    ActivityList
  }
})
export default class FreeBooking extends Vue {
  private stamp: number = new Date().getTime();
  private hasMounted: boolean = false;
  private isSite = this.$store.state.app.userInfo.dataType === "SITE";
  private siteInfo = this.$store.state.app.siteInfo;
  private ActivityListShow: boolean = false;
  //添加活动分类弹窗显示布尔值
  private AddTagShow: boolean = false;
  // 活动分类
  private activityList: Array<any> = [];
  get activityPopParams() {
    let formData = this.formData;
    let dateArr = new Date()
      .toLocaleDateString()
      .split("/")
      .map((d: string) => Number(d));
    let activityStart =
      dateArr[0] -
      1 +
      "-" +
      ("0" + dateArr[1]).slice(-2) +
      "-" +
      ("0" + dateArr[2]).slice(-2);
    let activityEnd =
      dateArr[0] +
      "-" +
      ("0" + dateArr[1]).slice(-2) +
      "-" +
      ("0" + dateArr[2]).slice(-2);
    return {
      activityLevel: formData.activityLevel,
      classify: formData.activityClassify,
      activityStart,
      activityEnd
    };
  }
  // 活动时间
  private setActivityTime(time: Array<string>) {
    this.formData.useStartTime = time[0] ? time[0] + ":00" : "";
    this.formData.useEndTime = time[1] ? time[1] + ":00" : "";
    (this.$refs.formData as any).validateField("useStartTime");
  }

  private voluntShow0: boolean = false;
  private voluntShow1: boolean = false;
  // 志愿团回显
  get voluntIds() {
    return this.formData.voluntTeamStr.split(",");
  }
  // 社团回显
  get associatioIds() {
    return this.formData.associationStr.split(",");
  }
  // 获取志愿团list
  private getVolunt(list: Array<{ name: string; id: any }>) {
    let names = this.formData.voluntTeamName
      ? this.formData.voluntTeamName.split(",")
      : [];
    let ids = this.formData.voluntTeamStr
      ? this.formData.voluntTeamStr.split(",")
      : [];
    list.forEach((item: { name: string; id: any }) => {
      if (!ids.includes(String(item.id))) {
        names.push(item.name);
        ids.push(item.id);
      }
    });
    this.formData.voluntTeamName = names.toString();
    this.formData.voluntTeamStr = ids.toString();
  }
  // 获取社团list
  private getAssociation(list: Array<{ name: string; id: any }>) {
    let names = this.formData.associationName
      ? this.formData.associationName.split(",")
      : [];
    let ids = this.formData.associationStr
      ? this.formData.associationStr.split(",")
      : [];
    list.forEach((item: { name: string; id: any }) => {
      if (!ids.includes(String(item.id))) {
        names.push(item.name);
        ids.push(item.id);
      }
    });
    this.formData.associationName = names.toString();
    this.formData.associationStr = ids.toString();
  }

  /* S 关联场所弹窗 */
  private place = false;
  private activityIds: string = ""; // 活动场所ids
  private onOkClick(list: Array<any>) {
    let txt = this.formData.activityName
        ? this.formData.activityName.split(",")
        : [],
      ids = this.activityIds ? this.activityIds.split(",") : [],
      resource = this.formData.resourceParams
        ? JSON.parse(this.formData.resourceParams)
        : [];
    list.forEach((item: any) => {
      // 过滤已有项
      if (
        !resource.some(
          (d: any) =>
            d.resourceId === item.id && d.resourceType === item.resourceType
        )
      ) {
        txt.push(item.name);
        ids.push(item.id);
        resource.push({
          resourceType: item.resourceType,
          resourceId: item.id
        });
      }
    });
    this.formData.activityName = txt.toString();
    this.activityIds = ids.toString();
    this.formData.resourceParams = JSON.stringify(resource);
  }
  /* E 关联场所弹窗 */

  // 创建者下拉匹配框数据
  private siteList: any = [];
  private getcreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.siteList = res.datas;
      }
    });
  }

  @Watch('formData.introduce', {deep: true})
  wIntro(v:any) {
    (this.$refs.formData as any).validateField('introduce')
  }
  //表单
  private formData: any = {
    id: "",
    status: 1, // 状态，存草稿时 为3
    type: "", //活动类型
    method: "", // 活动方式
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    name: "", // 活动名称
    activityClassify: "", // 活动分类
    activityName: "", // 所属场所校验字段
    resourceParams: "", // 资源类型数据-活动场所
    tag: "", // 标签
    phone: "", // 联系电话
    region: "", // 地区编码
    regionPath: "", // 地区编码路径
    address: "", // 活动地址
    longitude: "", // 活动经度
    latitude: "", // 活动维度
    stock: 1, // 活动库存 招募人数
    remark: "", // 备注说明
    sponsor: "", // 主办单位
    coOrganizer: "", // 协办单位
    undertakeUnit: "", // 承办单位
    images: "", // 活动主图
    introduce: "", // 活动介绍
    hint: "", // 温馨提示
    voluntTeamStr: "",
    associationStr: "",
    voluntTeamName: "",
    associationName: "",
    useEndTime: "",
    useStartTime: "",
    teachUnit: "", // 指导单位
    alreadyActivity: "", //往期活动ID字符串
    activityLevel: "", //活动级别
    subhead: "", //活动副标题
    limitNum: 1,
  };

  // 表单验证
  private ruleValidate = <any>{
    name: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { type: "string", max: 50, message: "最多输入50个字符" }
    ],
    activityClassify: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "change",
        validator: this.checkedCreateCompany
      }
    ],
    useStartTime: [
      { required: true, message: "请将信息填写完整", trigger: "change" }
    ],
    phone: [
      { required: true, message: "请将信息填写完整", trigger: "change" },
      { validator: this.checkPhone, message: "", trigger: "blur" }
    ],
    activityLevel: [
      { required: true, message: "请将信息填写完整", trigger: "change" },
      { validator: this.checkActivityLevel, message: "请选择地区", trigger: "blur" }
    ],
    stock: [
      { required: true, message: '请将信息填写完整' }, 
      { message: '只能输入1-99999999之间的整数', trigger: 'change', pattern:/^\d{1,8}$/}
    ],
    address: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { validator: this.checkRegion, message: "请选择地区", trigger: "blur" }
    ],
    images: [{ required: true, message: "请将信息填写完整", trigger: "blur" },
      { validator: this.checkImage, message: "请选择地区", trigger: "blur" }],
    sponsor: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    introduce: [{ required: true, message: "请将信息填写完整" }]
  };
  // 检查地区选择
  private checkRegion(rule: any, value: any, callback: Function) {
    if (!this.formData.region) {
      return callback(new Error("请将信息填写完整"));
    }
    callback();
  }
  // 检查地区选择
  private checkImage(rule: any, value: any, callback: Function) {
    if (!this.formData.images) {
      return callback(new Error("请将信息填写完整"));
    }
    callback();
  }
  // 检查地区选择
  private checkPhone(rule: any, value: any, callback: Function) {
    if (!this.formData.phone) {
      return callback(new Error("请将信息填写完整"));
    } else if ( !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.formData.phone)) ) {
      return callback(new Error("电话号码不合法"));
    } else {
      callback();
    }
  }
  // 检查地区选择
  private checkActivityLevel(rule: any, value: any, callback: Function) {
    if (!this.formData.activityLevel) {
      return callback(new Error("请将信息填写完整"));
    }
    callback();
  }
  private checkedCreateCompany(rule: any, value: any, callback: any) {
    if (!this.formData.activityClassify) {
      return callback(new Error("请将信息填写完整"));
    }
    callback();
  }
  // 是否显示保存草稿
  get showDraft() {
    return (
      !Boolean(this.formData.id) || [3].includes(this.formData.status)
    );
  }
  // 创建者变化时
  private createCompanyChange() {
    Object.assign(this.formData, { activityName: "", resourceParams: "" });
  }
  // 回显修改的时候，部分字段不嫩修改 0可以修改， 1不能修改
  private modKeyControll: number = 0;
  // 控制字段是否能编辑
  get keyContrll() {
    // keyContrll:true表示不能修改
    return Boolean(this.formData.id) && Boolean(this.modKeyControll);
  }
  mounted() {
    this.formData.type = this.$route.query.classify || "";
    this.formData.method = this.$route.query.method || "";
    this.formData.id = this.$route.query.id || "";
    this.formData.auditFlag = this.$route.query.auditFlag || ""; // 保存审核内容时 传1
    this.getActivityClassify();
    this.getcreaterList();
    // 编辑时数据回显
    if (this.formData.id) {
      this.getActivityDetial();
    }
    this.hasMounted = true;
  }

  // pop资源弹窗回显的
  get getPlaceIds() {
    let res = [];
    if (this.formData.resourceParams && this.formData.resourceParams.length) {
      res = JSON.parse(this.formData.resourceParams).map((item: any) => ({
        resourceType: item.resourceType,
        id: item.resourceId
      }));
    }
    return res;
  }
  // 回显图片
  private defaultImage: Array<any> = [];
  // 获取详情
  private getActivityDetial() {
    getActivityDetial({ id: this.formData.id }).then((res: any) => {
      if (res.code === 0) {
        Object.assign(this.formData, res.data);
        this.modKeyControll = res.data.orderCount;
        if (this.formData.activityClassifyName.length === 0) {
          this.formData.activityClassify = "";
        }
        if (this.formData.alreadyActivity) {
          let alreadyActivityNames = this.formData.alreadyActivityNames.split(',')
          this.activityList = this.formData.alreadyActivity.split(',').map((id:string,i:number) => ({id:Number(id),name:alreadyActivityNames[i]}))
        }
        if (this.formData.images) {
          this.defaultImage = this.formData.images
            .split(",")
            .map((img: any, i: number) => ({
              id: "id-" + i,
              url: img
            }));
        }
      }
    });
  }

  // 直接保存
  private activitySaveStatus1() {
    this.formData.status = 1;
    this.activitySave();
  }

  // 存草稿
  private activitySaveStatus2() {
    this.formData.status = 3;
    this.activitySave();
  }

  // 返回
  private goBack() {
    this.$router.go(-1);
  }

  // 保存
  private activitySave() {
    (this.$refs.formData as any).validate((valid: any) => {
      if (valid) {
        this.formData.alreadyActivity = this.activityList.map((d:any)=>d.id).toString()
        activitySave(this.formData).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("保存成功!");
            if (this.formData.id) {
              this.$router.go(-1);
            } else {
              this.$router.push({ path: "/ac-list" });
            }
          }
        });
      } else {
        this.$Message.error("请将信息填写完整!");
      }
    });
  }

  // 活动分类
  private activityClassify: Array<any> = [];

  private getActivityClassify() {
    let params: any = {
      resourceType: "CONTENT_TYPE_ACTIVITY",
      labelType: "ACTIVITY_CLASSIFY",
      activityType: "ACTIVITY_TYPE_SERVICE"
    }
    getTagsSelect(params).then((res: any) => {
      if (res.code === 0) {
        this.activityClassify = res.datas.filter(
          (data: any) => data.labelName !== "志愿服务"
        );
      }
    });
  }

  //活动级别
  private activityLevel: Array<any> = [
    { labelName: "国家", value: "ACTIVITY_LEVEL_COUNTRY" },
    { labelName: "省", value: "ACTIVITY_LEVEL_PROVINCE" },
    { labelName: "市", value: "ACTIVITY_LEVEL_CITY" },
    { labelName: "县", value: "ACTIVITY_LEVEL_COUNTY" },
    { labelName: "其它", value: "ACTIVITY_LEVEL_OTHER" }
  ];

  // 获取活动地点经纬度
  private getAddress(e: any) {
    this.formData.longitude = e.lnglat.lng;
    this.formData.latitude = e.lnglat.lat;
  }

  // 地区region改变
  private pickerChange(e: any) {
    this.formData.region = e.region;
    // this.formData.regionPath = e.regionPath;
  }

  // 选择图片
  private getImagesList(list: Array<{ url: string }>) {
    this.formData.images = list.map((data: any) => data.url).toString();
    (this.$refs.formData as any).validateField('images')
  }
}
</script>

<style lang="scss">
/*志愿页编辑页样式*/
.page-activity-add {
  .activity-img {
    margin: 0 !important;
    .ivu-form-item-label {
      position: absolute;
      left: -100px;
      top: 0;
    }
  }
  .tag-box {
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
    .ivu-form-item-content {
      line-height: 0;
    }
  }
  .valid-time-set {
    .ivu-select-dropdown {
      right: 0 !important;
      left: auto !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.scenic {
  display: inline-block;
  margin-right: 15px;
  position: relative;
  &:nth-last-of-type(1) {
    margin-right: 25px;
  }
  span {
    display: block;
    width: 0;
    &::after {
      content: "×";
      position: absolute;
      right: -15px;
      top: 0;
      width: 15px;
      height: 15px;
      text-align: center;
      line-height: 13px;
      font-size: 15px;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      border: 1px solid #fff;
      cursor: pointer;
    }
  }
}
// 进度条
.header-goods {
  max-width: 1100px;
  overflow: hidden;
  background: $bg01;
  padding: 20px 0 0 0;
  font-size: 0;
  li {
    position: relative;
    width: 50%;
    float: left;
    font-size: 16px;
    color: #595961;
    height: 45px;
    line-height: 45px;
    background: #f2f2f6;
    .demo1 {
      width: 0;
      height: 0;
      /*overflow: hidden;*/
      font-size: 0;
      position: absolute;
      right: -24px;
      border-top: 23px solid #f2f2f6;
      border-right: 23px solid #f2f2f6;
      border-bottom: 22px solid #f2f2f6;
      border-left: 40px solid $bg01;
      z-index: 1;
      &:after {
        content: "";
        position: absolute;
        left: -47px;
        top: -24px;
        width: 7px;
        height: 46px;
        background: #fff;
      }
    }
    .demo2 {
      width: 0;
      height: 0;
      /*overflow: hidden;*/
      font-size: 0;
      position: absolute;
      right: -17px;
      border-top: 23px solid transparent;
      border-right: 23px solid transparent;
      border-bottom: 22px solid transparent;
      border-left: 40px solid #f2f2f6;
      z-index: 2;
    }
    span:last-child {
      position: relative;
      left: 40%;
    }
    &:nth-child(2) {
      /*margin-left: -46px;*/
      background-color: #6ed35e;
      color: #fff;
      .demo2 {
        right: -23px;
        border-color: #fff;
        border-left-color: #6ed35e;
      }
    }
    .noBorder {
      border-bottom: 24px solid $bg01 !important;
      border-left: 25px solid $bg01;
    }
    .noRightM {
      /*right: 2px!important;*/
    }
    &.active {
      height: 51px;
      line-height: 51px;
      background: #6ed35e;
      color: $bg01;
      border: 3px solid $bg01;
      border-right: none;
      border-left: none;
      margin-top: -3px;
      position: relative;
      .demo1 {
        border-top: 23px solid #6ed35e;
        border-right: 23px solid #6ed35e;
        border-bottom: 22px solid #6ed35e;
        border-left: 40px solid $bg01;
      }
      .demo2 {
        border-top: 23px solid transparent;
        border-right: 23px solid transparent;
        border-bottom: 22px solid transparent;
        border-left: 40px solid #6ed35e;
      }
    }
    .hasNo {
      border-top: 23px solid #6ed35e !important;
      border-right: 23px solid #6ed35e !important;
      border-bottom: 22px solid #6ed35e !important;
      border-left: 40px solid $bg01;
    }
    .hasWirte,
    .noBorder {
      border-top: 23px solid #6ed35e !important;
      border-right: 23px solid #6ed35e !important;
      right: 0 !important;
    }
  }
}
@-webkit-keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    -webkit-transform: translate3d(3000px, 0, 0);
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(-25px, 0, 0);
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }

  90% {
    -webkit-transform: translate3d(-5px, 0, 0);
    transform: translate3d(-5px, 0, 0);
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
@keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    -webkit-transform: translate3d(3000px, 0, 0);
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(-25px, 0, 0);
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }

  90% {
    -webkit-transform: translate3d(-5px, 0, 0);
    transform: translate3d(-5px, 0, 0);
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
.ani1-enter-active {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: bounceInRight;
  animation-name: bounceInRight;
}

@-webkit-keyframes fadeOutDown {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes fadeOutDown {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
.ani1-leave-active {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeOutDown;
  animation-name: fadeOutDown;
}
//基本信息
.title-tool {
  position: relative;
  width: 100%;
  line-height: 16px;
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
  i {
    position: absolute;
    top: 0;
    left: -8px;
    font-size: 20px;
    color: $theme;
  }
}

.tip {
  color: #ff6600;
}

.switch {
  position: relative;
  .label {
    position: absolute;
    left: -84px;
    top: 0;
    color: #19be6b;
    font-weight: bold;
    height: 32px;
    img {
      width: 22px;
      height: 21px;
      margin-right: 2px;
      position: relative;
      top: 6px;
    }
  }
  .num-box {
    .input {
      margin: 0 5px;
    }
  }
}

.add-content-detail-title {
  padding: 0 20px;
  .add-content-detail-content {
    padding: 10px 0;
    border-top: 1px solid #dedede;
    .linkTxt {
      color: $theme;
      cursor: pointer;
    }
    .ivu-form-item {
      margin: 20px 0 15px 0;
    }
    .ivu-select-multiple .ivu-tag {
      padding: 0 14px !important;
    }
    .prompt {
      font-size: $f12;
      color: #ccc;
    }
    .tags {
      width: 87px;
      height: 32px;
      color: $theme;
      background: $grayDark;
      border: 1px solid $theme;
      display: block;
      float: left;
      margin-right: 15px;
      text-align: center;
      border-radius: 5px;
    }
    .ivu-btn-dashed {
      width: 87px;
      height: 32px;
      color: $bg01;
      background: $theme;
      border: 1px solid $theme;
    }
    .uedit {
      position: relative;
      z-index: 1;
    }
    .check-sit {
      cursor: pointer;
    }
  }
}

.topic {
  width: 100%;
}

.title {
  width: 100%;
  height: 30px;
  background: #f2f4f7;
  margin: 15px 0;
  text-align: center;
  line-height: 30px;
  border-radius: 0 0 30px 30px;
}

.sit-list {
  width: 725px;
  margin: 5px auto;
  text-align: center;
  line-height: 24px;
  .sit-l {
    width: 24px;
    height: 24px;
    background: #ccc;
  }
  .sit-r {
    margin-left: 40px;
    .sit-item {
      display: block;
      width: 25px;
      height: 24px;
      margin-right: 5px;
      background: #ccc;
      background: url(./../../../../assets/image/sitBg.png);
      &.curr {
        background: url(./../../../../assets/image/sitNoBg.png) !important;
      }
    }
  }
}

.info-list {
  .img {
    margin: 10px 0;
  }
}
</style>
