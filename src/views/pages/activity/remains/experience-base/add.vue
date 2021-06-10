<template>
  <Form
    ref="formData"
    :model="formData"
    :label-width="120"
    :rules="ruleValidate"
    class="form"
  >
    <Tabs :value="0" class="tabs">
      <TabPane label="基本资料" class="pane">
        <FormItem label="创建者" prop="createCompany">
          <Select
            v-model="formData.createCompany"
            filterable
            style="width: 250px"
          >
            <Option
              v-for="option in siteList"
              :value="option.id"
              :key="option.id"
              >{{ option.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="基地名称" prop="name">
          <Input
            placeholder="请输入基地名称"
            style="width: 250px"
            v-model="formData.name"
            :maxlength="50"
          />
          <span class="prompt ml20">50字以内</span>
        </FormItem>
        <FormItem label="基地级别" prop="level">
          <span
            class="choice-tag"
            :class="level.checked ? 'active' : ''"
            v-for="level in levels"
            :key="level.id"
            @click="levelClick(level)"
            >{{ level.name }}</span
          >
        </FormItem>
        <FormItem label="申报地区" prop="reportRegion">
          <VDistpicker
            :default="formData.reportRegionPath"
            @onChange="d => (formData.reportRegion = d.region)"
          ></VDistpicker>
        </FormItem>
        <FormItem label="申报单位" prop="reportCompany">
          <Input
            placeholder="请输入申报单位"
            style="width: 250px"
            v-model="formData.reportCompany"
            :maxlength="50"
          />
          <span class="prompt ml20">50字以内</span>
        </FormItem>
        <FormItem
          label="非遗体验项目"
          prop="heritageItem"
          class="add-experience"
        >
          <p>
            <i @click="showExperience = true" class="cloud-icon">&#xe604;</i>
          </p>
          <p v-for="(item, i) in experienceProj" :key="item.id">
            {{ item.name }}
            <i @click="experienceProj.splice(i, 1)" class="cloud-icon"
              >&#xe621;</i
            >
          </p>
        </FormItem>
        <FormItem label="参加体验人数接口" prop="examineNumber">
          <Input
            placeholder="请输入参加体验人数接口"
            style="width: 250px"
            v-model="formData.examineNumber"
            :maxlength="500"
          />
        </FormItem>
        <FormItem label="体验活动人数" prop="activityNumber">
          <InputNumber
            :min="0"
            :max="99999"
            placeholder="请输入体验活动人数"
            v-model="formData.activityNumber"
            style="width: 250px"
          ></InputNumber>
        </FormItem>
        <FormItem label="同时接纳人数" prop="capacity">
          <InputNumber
            :min="0"
            :max="99999"
            placeholder="请输入同时接纳人数"
            v-model="formData.capacity"
            style="width: 250px"
          ></InputNumber>
        </FormItem>
        <FormItem label="联系人" prop="contactName">
          <Input
            placeholder="请输入联系人姓名"
            style="width: 250px; margin-right: 10px;"
            v-model="formData.contactName"
            :maxlength="50"
          />
        </FormItem>
        <FormItem label="电话号码" prop="contactPhone">
          <Input
            placeholder="请输入联系人电话号码"
            style="width: 250px"
            type="tel"
            v-model="formData.contactPhone"
          />
        </FormItem>
        <FormItem label="标签">
          <Tags
              resourceType="CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE"
              labelType="INTANGIBLE_TAGS"
              limit="5"
              :defaultIds="formData.tag"
              @onChange="getTagIds"
            ></Tags>
        </FormItem>
        <FormItem label="基地所在地" prop="baseAddress">
          <VDistpicker
            :default="formData.baseRegionPath"
            @onChange="d => (formData.baseRegion = d.region)"
          ></VDistpicker>
          <Input
            placeholder="请输入街道门牌号..."
            v-model="formData.baseAddress"
            style="width: 250px"
            class="ml20"
            :maxlength="100"
          />
        </FormItem>
        <FormItem prop="longitude">
          <Map
            :id="'map-add-experience'"
            :lab="true"
            :address="[formData.longitude, formData.latitude]"
            :region="formData.baseRegion"
            @getAddress="getAddress"
          ></Map>
        </FormItem>
      </TabPane>
      <TabPane label="基地介绍" class="pane">
        <FormItem class="formItem" label="图集" prop="images">
          <UploadImg2
            :defaultImage="defaultImage"
            @getImagesList="
              list => (formData.images = list.map(d => d.url).toString())
            "
            :limit="30"
          >
          </UploadImg2>
        </FormItem>
        <FormItem class="formItem" label="音频">
          <UploadVoice :defaultVoice="defaultVoice"
            @getVoiceList="getVoiceList" :limit="5">
          </UploadVoice>
        </FormItem>
        <FormItem class="formItem" label="视频">
          <UploadVideo2 :defaultVideo="defaultVideo"
            @getVideoList="getVideoList" :limit="1">
          </UploadVideo2>
        </FormItem>
        <FormItem class="formItem" label="内容" prop="introduce">
          <Ueditor id="uedit1" v-model="formData.introduce"></Ueditor>
        </FormItem>
      </TabPane>
    </Tabs>
    <FormItem label="">
      <Button type="primary" @click="save(1)">保存</Button>
      <Button
        type="primary"
        style="margin-left: 8px"
        v-if="showDraft"
        @click="save(3)"
        >存草稿</Button
      >
      <Button style="margin-left: 8px" @click="$router.go(-1)">返回</Button>
    </FormItem>
    <RemainsPop
      v-model="showExperience"
      @onOkClick="selectExperience"
    ></RemainsPop>
  </Form>
</template>

<script lang='ts'>
import { Component, Watch, Vue } from "vue-property-decorator";
import Map from "@components/map/marker.vue";
import Ueditor from "@components/ueditor/ueditor.vue";
import VDistpicker from "@components/distPicker/distPicker.vue";
import UploadImg2 from "@components/upload/upload-image2.vue";
import UploadVideo2 from "@components/upload/upload-video2.vue";
import UploadVoice from "@components/upload/upload-voice.vue";
import RemainsPop from "@components/pop/remains-pop.vue";
import Tags from "@components/tags/tags.vue";
import {
  saveExperienceBase,
  getExperienceBase,
  getHeritageItem
} from "@service/activity";
import { dictType } from "@service/common";
import { createrList } from "@service/content";
import { getParentsRegion, getTime, getVideoCover } from "@util/comm";
enum MediaType {
  video = "video",
  audio = "audio",
}
@Component({
  components: {
    Map,
    Ueditor,
    RemainsPop,
    VDistpicker,
    UploadImg2,
    UploadVideo2,
    UploadVoice,
    Tags
  }
})
export default class ComponentName extends Vue {
  //表单
  private formData: any = {
    status: 1, // 状态，存草稿时 为3
    name: "", //
    level: "", //
    reportRegion: "", //
    reportCompany: "", //
    heritageItem: "", //
    examineNumber: "", //
    activityNumber: 0, //
    capacity: 0, //
    contactName: "", //
    contactPhone: "", //
    baseRegion: "", //
    baseAddress: "", //
    longitude: "", //
    latitude: "", //
    images: "", //
    voice: "", //
    video: "", //
    introduce: "", //
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    reportRegionPath: "", // 自己用的后台没存
    baseRegionPath: "", // 自己用的后台没存
    tag:""//标签
  };
  // 表单验证
  private ruleValidate: object = {
    name: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    level: [{ required: true, message: "请将信息填写完整" }],
    reportRegion: [{ required: true, message: "请将信息填写完整" }],
    reportCompany: [
      { required: true, message: "请将信息填写完整", trigger: "change|blur" }
    ],
    heritageItem: [{ required: true, message: "请将信息填写完整" }],
    examineNumber: [
      {
        pattern: /^[A-Za-z0-9:\/\-\.\s]+$/,
        message: "请正确填写相关信息",
        trigger: "blur"
      }
    ],
    activityNumber: [
      { pattern: /^\d{0,5}$/, trigger: "blur", message: "必须大于0小于99999" }
    ],
    capacity: [
      { pattern: /^\d{0,5}$/, trigger: "blur", message: "必须大于0小于99999" }
    ],
    contactName: [
      {
        pattern: /^[A-Za-z\.·\u4e00-\u9fa5]{0,50}$/,
        message: "请正确填写相关信息",
        trigger: "change|blur"
      }
    ],
    contactPhone: [
      {
        pattern: /(^1[3456789]\d{9}$)|(^\d{3,4}-\d{7,8}$)/,
        message: "请正确填写手机号",
        trigger: "blur"
      }
    ],
    baseAddress: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { validator: this.checkRegion, message: "请选择地区", trigger: "blur" }
    ],
    createCompany: [
      // { required: true, message: "请将信息填写完整", trigger: "blur" }
    ],
    longitude: [{ required: true, message: "请将信息填写完整" }],
    images: [{required: true, message: '请上传体验基地图集'}]
  };
    //非遗标签
  getTagIds(value:any){
    this.formData.tag = value;
  }
  // 回显图片
  private defaultImage: Array<any> = [];
  private defaultVideo: Array<any> = [];
  private defaultVoice: Array<any> = [];
  // 国家级 ...
  private levels: any[] = [];
  private getDictType() {
    dictType({ type: "HERITAGE_LEVEL" }).then((res: any) => {
      if (res.code === 0) {
        res.datas.forEach(
          (d: any) => (d.checked = d.id == this.formData.level)
        );
        this.levels = res.datas;
      }
    });
  }
  private levelClick(level: any): void {
    this.levels.forEach((d: any) => (d.checked = false));
    level.checked = true;
    if (level.name === "世界级")
      this.levels.find((d: any) => d.name === "国家级").checked = true;
    this.formData.level = level.id;
  }
  private showExperience: boolean = false;
  private experienceProj: any[] = [];
  @Watch("experienceProj", { deep: true })
  wExperienceProj(v: any) {
    this.formData.heritageItem = v.map((d: any) => d.id).toString();
  }
  // 选中音频
  private getVoiceList(list: any[]) {
    this.formData.voice = list.map(d => d.url).toString()
    Promise.all( list.map(d => {
      if (d.duration) {
        return Promise.resolve({duration: d.duration})
      } else {
        return getTime(d.url, MediaType.audio)
      }
    }) ).then(arr => {
      this.formData.voiceTime = arr.map(d => {
        if (d.duration && /:/.test(d.duration)) {
          return d.duration
        } else if (d.duration) {
          let min = Math.floor((Number(d.duration)/60))
          return (min < 10 ? '0' + min : min) + ':' + ( '0' + (Math.floor(Number(d.duration)) % 60) ).slice(-2)
        } else {
          return '00:00'
        }
      }).toString()
    })
  }
  // 选择视频
  private getVideoList(list: any[]) {
    this.formData.video = list.map(d => d.url).toString()
    this.formData.videoCover = list.map(d => d.imgUrl).toString()
    this.formData.videoTime = list.map(d => {
      if (d.duration && /:/.test(d.duration)) {
        return d.duration
      } else if (d.duration) {
        let min = Math.floor((Number(d.duration)/60))
        return (min < 10 ? '0' + min : min) + ':' + ( '0' + (Math.floor(Number(d.duration)) % 60) ).slice(-2)
      } else {
        return '00:00'
      }
    }).toString()
  }
  private selectExperience(list: any[]) {
    // 过滤已有项
    this.experienceProj = this.experienceProj.concat(
      list.filter(
        (d: any) => !this.experienceProj.some((e: any) => e.id === d.id)
      )
    );
  }
  // 保存
  private save(status: number) {
    (this.$refs.formData as any).validate((valid: any) => {
      if (valid) {
        this.formData.status = status;
        saveExperienceBase(this.formData).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("保存成功！");
            if (this.formData.id) {
              this.$router.go(-1)
            } else {
              this.$router.push({path: '/experience-list'})
            }
          }
        });
      } else {
        this.$Message.info("请将信息填写完整!");
      }
    });
  }
  // 获取详情
  private getExperienceBase(id: any) {
    getExperienceBase({ id }).then((res: any) => {
      if (res.code === 0) {
        let resData = res.data.ctcHeritageExperienceBase;
        if (!resData.createCompany) resData.createCompany = -1
        this.formData.reportRegionPath = getParentsRegion(resData.reportRegion)
          .map((d: any) => d.region).reverse()
          .toString();
        // this.formData.baseRegionPath = getParentsRegion(resData.baseRegion)
        //   .map((d: any) => d.region).reverse()
        //   .toString();
        this.formData.baseRegionPath = res.data.sysRegion.scort;
        this.formData = Object.assign(this.formData, resData);
        this.levels.forEach((d: any) => {
          if (d.id == this.formData.level) {
            d.checked = true;
            if (d.name === "世界级")
              this.levels.find((d: any) => d.name === "国家级").checked = true;
          }
        });
        if (resData.heritageItem) {
          Promise.all(
            resData.heritageItem
              .split(",")
              .map((id: number) => this.getHeritageItem(id))
          ).then((arr: any[]) => (this.experienceProj = arr));
        }
        if (resData.images) {
          this.defaultImage = resData.images
            .split(",")
            .map((url: string, i: number) => ({ url, id: `id_${i}` }));
        }
        if (resData.voice) {
          this.defaultVoice = resData.voice
            .split(",")
            .map((url: string, i: number) => ({ url, id: `id_${i}` }));
        }
        if (resData.video) {
          this.defaultVideo = resData.video
            .split(",")
            .map((url: string, i: number) => ({ url, id: `id_${i}`, imgUrl: resData.videoCover }));
        }
      }
    });
  }
  // 根据id获取非遗项目详情
  private getHeritageItem(id: number): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      getHeritageItem({ id })
        .then((res: any) => {
          if (res.code === 0) {
            resolve({ name: res.data.ctcHeritageItem.name, id });
          } else {
            reject();
          }
        })
        .catch(() => reject());
    });
  }
  // 是否显示保存草稿
  get showDraft() {
    return (
      !Boolean(this.formData.id) || [3, 7, 8].includes(this.formData.status)
    );
  }
  // 创建者下拉匹配框数据
  private siteList: Array<object> = [];
  private getcreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.siteList = res.datas;
      }
    });
  }
  created() {
    this.getDictType();
    this.getcreaterList();
    let id = this.$route.query.id;
    if (id) {
      this.formData.id = id;
      this.getExperienceBase(id);
    }
    let saveType = this.$route.query.saveType;
    if (saveType) {
      this.formData.saveType = saveType;
    }
  }
  // 地点经纬度
  private getAddress(e: any) {
    this.formData.longitude = e.lnglat.lng;
    this.formData.latitude = e.lnglat.lat;
  }
  // 检查地区选择
  private checkRegion(rule: any, value: any, callback: Function) {
    if (!this.formData.baseRegion) {
      return callback(new Error("请选择地区"));
    }
    callback();
  }
}
</script>

<style lang='scss' scoped>
.form {
  overflow: hidden;
  padding: 20px;
  .tabs {
    .level-item {
      margin-right: 10px;
    }
    .add-experience {
      p:not(:first-child) {
        line-height: 20px;
      }
      .cloud-icon {
        cursor: pointer;
        &:hover {
          color: #ccc;
        }
      }
    }
    .pane {
      padding-top: 10px;
    }
  }
}
</style>
