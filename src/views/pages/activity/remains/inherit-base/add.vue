<template>
  <Form ref="formData" :model="formData" :label-width="120" :rules="ruleValidate" class="form">
    <Tabs :value="0" class="tabs">
      <TabPane label="基本资料" class="pane">
        <FormItem label="创建者" prop="createCompany">
          <Select v-model="formData.createCompany" filterable style="width: 250px">
            <Option v-for="(option) in siteList" :value="option.id" :key="option.id">{{option.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="基地名称" prop="name">
          <Input placeholder="请输入基地名称" style="width: 250px" v-model="formData.name"
            :maxlength="100" />
          <span class="prompt ml20">100字以内</span>
        </FormItem>
        <FormItem label="申报单位" prop="reportCompany">
          <Input placeholder="请输入申报单位" style="width: 250px" v-model="formData.reportCompany"
            :maxlength="50" />
          <span class="prompt ml20">50字以内</span>
        </FormItem>
        <FormItem label="非遗体验项目" prop="heritageItem" class="add-experience">
          <p><i @click="showExperience = true" class="cloud-icon">&#xe604;</i></p>
          <p v-for="(item, i) in experienceProj" :key="item.id">{{ item.name }} <i
              @click="experienceProj.splice(i, 1)" class="cloud-icon">&#xe621;</i></p>
        </FormItem>
        <FormItem label="标签">
          <Tags
              resourceType="CONTENT_TYPE_HERITAGE_TEACHING_BASE"
              labelType="INTANGIBLE_TAGS"
              limit="5"
              :defaultIds="formData.tag"
              @onChange="getTagIds"
            ></Tags>
        </FormItem>
        <FormItem label="基地所在地" prop="baseAddress">
          <VDistpicker :default="formData.baseRegionPath"
            @onChange="d => formData.baseRegion = d.region"></VDistpicker>
          <Input placeholder="请输入街道门牌号..." v-model="formData.baseAddress" style="width: 250px"
            class="ml20" :maxlength="100" />
        </FormItem>
        <FormItem prop="longitude">
          <Map :id="'map-add-experience'" :lab="true"
            :address="[formData.longitude,formData.latitude]" :region="formData.baseRegion"
            @getAddress="getAddress"></Map>
        </FormItem>
        <FormItem label="">
          <Button type="primary" @click="save(1)">保存</Button>
          <Button type="primary" style="margin-left: 8px" v-if="showDraft" @click="save(3)">存草稿</Button>
          <Button style="margin-left: 8px" @click="$router.go(-1)">返回</Button>
        </FormItem>
      </TabPane>
      <TabPane label="基地介绍" class="pane">
        <FormItem class="formItem" label="图集" prop="images">
          <UploadImg2 :defaultImage="defaultImage"
            @getImagesList="list => formData.images = list.map(d => d.url).toString()" :limit="30">
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
        <FormItem label="">
          <Button type="primary" @click="save(1)">保存</Button>
          <Button type="primary" style="margin-left: 8px" v-if="showDraft" @click="save(3)">存草稿</Button>
          <Button style="margin-left: 8px" @click="$router.go(-1)">返回</Button>
        </FormItem>
      </TabPane>
    </Tabs>
    <RemainsPop v-model="showExperience" @onOkClick="selectExperience"></RemainsPop>
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
  saveInheritBase,
  getInheritBase,
  getHeritageItem
} from "@service/activity";
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
    reportCompany: "", //
    heritageItem: "", //
    baseRegion: "", //
    baseAddress: "", //
    longitude: "", //
    latitude: "", //
    images: "", //
    voice: "", //
    video: "", //
    introduce: "", //
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    videoTime: 0,
    videoCover: "",
    voiceTime: 0,
    baseRegionPath: "", // 自己用的后台没存
    tag:""//标签
  };
  // 表单验证
  private ruleValidate: object = {
    name: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    reportCompany: [
      { required: true, message: "请将信息填写完整", trigger: "change|blur" }
    ],
    heritageItem: [{ required: true, message: "请将信息填写完整" }],
    baseAddress: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { validator: this.checkRegion, message: "请选择地区", trigger: "blur" }
    ],
    createCompany: [
      // { required: true, message: "请将信息填写完整", trigger: "blur" }
    ],
    longitude: [{ required: true, message: "请将信息填写完整" }],
    images: [{required: true, message: "请上传传习基地图片"}]
  };
  //非遗标签
  getTagIds(value:any){
    this.formData.tag = value;
  }
  // 回显图片
  private defaultImage: Array<any> = [];
  private defaultVideo: Array<any> = [];
  private defaultVoice: Array<any> = [];
  private showExperience: boolean = false;
  private experienceProj: any[] = [];
  @Watch("experienceProj", { deep: true })
  wExperienceProj(v: any) {
    this.formData.heritageItem = v.map((d: any) => d.id).toString();
  }
  private selectExperience(list: any[]) {
    // 过滤已有项
    this.experienceProj = this.experienceProj.concat(
      list.filter(
        (d: any) => !this.experienceProj.some((e: any) => e.id === d.id)
      )
    );
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
  // 保存
  private save(status: number) {
    (this.$refs.formData as any).validate((valid: any) => {
      if (valid) {
        this.formData.status = status;
        saveInheritBase(this.formData).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("保存成功！");
            if (this.formData.id) {
              this.$router.go(-1)
            } else {
              this.$router.push({path: '/inherit-list'})
            }
          }
        })
      } else {
        this.$Message.info("请将信息填写完整!");
      }
    })
  }
  // 获取详情
  private getInheritBase(id: any) {
    getInheritBase({ id }).then((res: any) => {
      if (res.code === 0) {
        let resData = res.data.ctcHeritageTeachingBase;
        if (!resData.createCompany) resData.createCompany = -1
        // this.formData.baseRegionPath = getParentsRegion(resData.baseRegion)
        //   .map((d: any) => d.region).reverse()
        //   .toString();
        //   console.log(getParentsRegion(resData.baseRegion)
        //   .map((d: any) => d.region).reverse())
        this.formData.baseRegionPath = res.data.sysRegion.scort;
        this.formData = Object.assign(this.formData, resData);
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
    this.getcreaterList();
    let id = this.$route.query.id;
    if (id) {
      this.formData.id = id;
      this.getInheritBase(id);
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
