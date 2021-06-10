<template>
  <div class="basic-container tab-container pd20">
    <Head resourceType></Head>
    <Form ref="formInline" :label-width="100" :model="params" class="mt20" :rules="ruleValidate">
      <FormItem label="传承人类型：" prop="type">{{params.type}}</FormItem>
      <FormItem label="传承人名称：" prop="name">
        <Input type="text" class="control" v-model="params.name" placeholder="传承人名称" />
      </FormItem>
      <FormItem label="传承人性别：">
        <RadioGroup v-model="params.gender">
          <Radio :label="1">男</Radio>
          <Radio :label="0">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="级别：" class="mt20" prop="level">
        <span
          class="choice-tag"
          :class="params.level===item.id ||levels.indexOf(item.id)!==-1 ? 'active':''"
          v-if="item.pid"
          v-for="(item,index) in level"
          :key="index"
          @click="handleTags(item,'level')"
        >{{item.name}}</span>
        <Input type="text" v-model="params.level" v-show="false" />
      </FormItem>
      <FormItem label="批次：" class="mt20" prop="batch">
        <span
          class="choice-tag"
          :class="params.batch==item.id? 'active':''"
          v-if="item.pid"
          v-for="(item,index) in batch"
          :key="index"
          @click="handleTags(item,'batch')"
        >{{item.name}}</span>
        <Input type="text" v-model="params.batch" v-show="false" />
      </FormItem>
      <FormItem label="申报地区：" class="mt20" prop="reportRegion">
        <distPicker :default="reportRegion" @onChange="getReportRegion"></distPicker>
      </FormItem>
      <FormItem label="申报单位：" class="mt20" prop="reportCompany">
        <Input class="control" placeholder="请填写申报单位" v-model="params.reportCompany" />
      </FormItem>
      <FormItem label="联系电话：" class="mt20" prop="phone">
        <phone v-model="params.phone" class="control"></phone>
      </FormItem>
      <FormItem label="民族：" class="mt20">
        <Select class="w150" v-model="params.nationality">
          <Option v-for="item in ethnicity" :value="item.name" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="身份证号：" class="mt20" prop="idCard">
        <Input class="control" placeholder="请填写身份证号" v-model="params.idCard" />
      </FormItem>
      <FormItem label="所在地区：" class="mt20" prop="region">
        <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
      </FormItem>
      <FormItem label="详细地址：" class="mt20" prop="address">
        <Input class="control" placeholder="详细地址" v-model="params.address" />
      </FormItem>
      <FormItem class="mt20">
        <FormItem class="form-item" label="传承人图片：" prop="images"></FormItem>
        <uploadImg :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="30"></uploadImg>
      </FormItem>
      <FormItem label="语音介绍：" class="mt20">
        <uploadAudio :defaultVoice="defaultVoice" @getVoiceList="getVoiceList" :limit="5"></uploadAudio>
      </FormItem>
      <FormItem label="视频：" class="mt20">
        <uploadVideo :defaultVideo="defaultVideo" @getVideoList="getVideoList" :limit="1"></uploadVideo>
      </FormItem>
      <FormItem label="传承人介绍：" class="mt20">
        <div class="uedit">
          <ueditor v-model="params.introduce" id="people_uedit"></ueditor>
        </div>
      </FormItem>
      <FormItem label class="submit">
        <Button type="primary" @click="save(4)">提交</Button>
        <Button class="ml20" type="primary" @click="save(3)" v-if="isEdit">存草稿</Button>
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Head from "./head.vue";
import uploadImg from "@components/upload/upload-image2.vue";
import uploadVideo from "@components/upload/upload-video2.vue";
import { createrList } from "@service/content";
import { dictType } from "@service/common";
import { hotelRoomSave, getHotelRoomView } from "@service/place";
import {
  ctcHeritagePeopleSave,
  ctcHeritagePeopleView,
  checkHeritagePeople
} from "@service/activity";
import distPicker from "@components/distPicker/distPicker.vue";
import uploadAudio from "@components/upload/upload-voice.vue";
import ueditor from "@components/ueditor/ueditor.vue";
interface imgType {
  id: number;
  url: string;
  name?: string;
}

interface videoType {
  id: number;
  imgUrl: string;
  url: string;
  name?: string;
}

interface voiceType {
  id: number;
  url: string;
  imgUrl?: string;
  name?: string;

  [propName: string]: any;
}
@Component({
  components: {
    Head,
    uploadImg,
    uploadVideo,
    uploadAudio,
    distPicker,
    ueditor
  }
})
export default class editTab extends Vue {
  private params: any = {
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    heritageItem: "", //非遗项目id
    name: "", //名称
    type: "代表性传承人", //类型
    gender: "", //性别
    level: '', //级别
    batch: '', //批次
    reportRegion: "", //申报地区
    reportCompany: "", //申报单位
    phone: "", //电话
    nationality: "", //民族
    idCard: "", //身份证号
    region: "", //地址
    address: "", //地区编码
    images: "", //图片
    voice: "", //音频
    video: "", //视频
    videoTime: "", //视频时长
    introduce: "", //介绍
    status: 4, //4待审核  3 草稿
    saveType: "list" //list 列表编辑，audit 审核编辑
  };
  // 申报地区
  private reportRegion: string = "";
  getReportRegion(data: any) {
    (this.params as any).reportRegion = data.region;
  }
  //地区编码
  private regionPath: string = "";
  getRegion(data: any) {
    (this.params as any).region = data.region;
  }
  //验证
  private ruleValidate: any = {
    idCard: [{ validator: this.validationCard, trigger: "blur" }],
    level: [{ required: true, message: "请选择级别" }],
    batch: [{ required: true, message: "请选择批次" }],
    reportRegion: [{ required: true, message: "请选择申报地区" }],
    reportCompany: [
      { required: true, message: "请填写申报单位" },
      { type: "string", max: 50, message: "最多输入50个字符" }
    ],
    phone: [
      {
        required: true,
        min: 11,
        message: "请填写正确的联系电话",
        trigger: "blur"
      },
      { validator: this.checkPhone }
    ],
    name: [
      { required: true, message: "请输入传承人名称" },
      { type: "string", max: 50, message: "最多输入50个字符" }
    ],
     address: [
      { type: "string", max: 200, message: "最多输入200个字符",trigger: "blur" }
    ],
    images: [{ required: true, message: "请选择传承人图片" }]
  };
  //校验身份证：
  validationCard(rule: any, value: any, callback: any) {
    let idCardReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (value && !idCardReg.test(value)) {
      callback(new Error("请输入正确的身份证号码！"));
    } else {
      callback();
    }
  }
  //验证手机号是否重复
  checkPhone(rule: any, value: any, callback: any) {
    checkHeritagePeople({ phone: value,id:this.params.id }).then((res: any) => {
      if (res.code === 1) {
        callback(new Error(res.message));
      } else {
        callback();
      }
    });
  }
  // 创建者列表
  private createrList: object[] = [];
  // 获取创建者
  private getCreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.createrList = res.datas;
      }
    });
  }
  // 回显图片
  private defaultImage: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
  ];
  // 回显视频
  private defaultVideo: Array<videoType> = [
    /*{
                id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561098509967/cc79b43170d504d20c9cf1f84e360a90.mp4",
                imgUrl: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561099755721/微信图片_20190422150111.jpg",
                name: "ad20190513"
            }*/
  ];
  // 回显音频
  private defaultVoice: Array<voiceType> = [
    /*{
                id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561027609568/xxxx.mp3",
                imgUrl: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561099755721/微信图片_20190422150111.jpg",
                name: "ad20190513"
            }*/
  ];
  //图片
  private getImagesList(list: Array<{ id: number }>) {
    this.params.images = list.map((data: any) => data.url || "").join(",");
  }
  //音频
  private getVoiceList(list: Array<{ id: number }>) {
    let allPromise: Array<Promise<any>> = [];
    list.forEach((item: any) => {
      if (!item.duration || !/^(\d+|(\d+\.\d+))$/.test(item.duration + "")) {
        // 没得的主动获取音频时长
        let currPromise: Promise<any> = this.getTime(item.url,"audio");
        currPromise.then((res: { duration: number }) => {
          item.duration = res.duration;
        });
        allPromise.push(currPromise);
      }
    });

    Promise.all(allPromise).finally(() => {
      this.params.voice = list.map((data: any) => data.url || "").join(",");
      this.params.voiceTime = list
        .map((data: any) => this.formatSeconds(data.duration) || "")
        .join(",");
    });
  }
  //转换时分秒
  private formatSeconds(value: any) {
    if (value == undefined) {
      value = 0;
    }
    let second: any = parseInt(value); // 秒
    let min: any = 0; // 分
    let hour: any = 0; // 小时
    if (second > 60) {
      min = second / 60;
      second = second % 60;
      if (min > 60) {
        hour = min / 60;
        min = min % 60;
      }
    }
    let result: any = "" + parseInt(second);
    if (min > 0) {
      result = "" + parseInt(min) + ":" + (result > 9 ? result : "0" + result);
    }
    if (hour > 0) {
      result = "" + parseInt(hour) + ":" + (result > 9 ? result : "0" + result);
    }
    if (min <= 0 && hour <= 0) {
      result = "00:" + (result > 9 ? result : "0" + result);
    }
    return result;
  }
  // 获取本地音频或者视频时长
  private getTime(url: string,type:any) {
    let _this=this;
    return new Promise((resolve, reject) => {
      let audio = document.createElement(type);
      audio.src = url;
      audio.addEventListener("loadeddata", function() {
        resolve({
          duration: parseInt(String(_this.duration))
        });
      });
      audio.addEventListener("error", function() {
        reject();
      });
    });
  }
  //视频
  private getVideoList(list: Array<{ id: number }>) {
    this.params.videoCover = list
      .map((data: any) => data.imgUrl || "")
      .join(",");
    this.params.video = list.map((data: any) => data.url || "").join(",");

    let allPromise: Array<Promise<any>> = [];
    list.forEach((item: any) => {
      if (!item.duration || !/^(\d+|(\d+\.\d+))$/.test(item.duration + "")) {
        // 没得的主动获取音频时长
        let currPromise: Promise<any> = this.getTime(item.url,"video");
        currPromise.then((res: { duration: number }) => {
          item.duration = res.duration;
        });
        allPromise.push(currPromise);
      }
    });

    Promise.all(allPromise).finally(() => {
      this.params.videoTime = list
        .map((data: any) => this.formatSeconds(data.duration) || "")
        .join(",");
    });
   
  }
  //保存
  save(status: any) {
    let _this = this;
    (_this.params as any).status = status; //状态 4待审核  3 草稿
    (_this.$refs.formInline as any).validate((valid: any) => {
      if (valid) {
        ctcHeritagePeopleSave(this.params).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("保存成功");
            _this.$router.go(-1);
          } else {
            _this.$Message.error(res.message);
          }
        });
      } else {
        _this.$Message.error("请将必填项填写正确!");
      }
    });
  }
  //详情
  //是否是修改
  private isEdit: boolean = true;
  getDesc(id: any) {
    let _this = this;
    ctcHeritagePeopleView({ id: id }).then((res: any) => {
      _this.params = res.data.ctcHeritagePeople;
      _this.regionPath = res.data.sysRegion.scort;
      _this.isEdit = res.data.ctcHeritagePeople.status == 3;
      this.params.gender =
        res.data.ctcHeritagePeople.gender &&
        res.data.ctcHeritagePeople.gender === "女"
          ? 0
          : 1;
      delete (_this.params as any).createTime;
      delete (_this.params as any).updateTime;
      (_this.params as any).saveType = _this.$route.query.type;
      //图片回显
      let imgs = (_this.params as any).images.split(",");
      if (imgs.length > 1) {
        imgs.forEach((item: any, index: number) => {
          _this.defaultImage.push({
            id: index,
            url: item
          });
        });
      } else {
        _this.defaultImage = imgs[0]
          ? [
              {
                id: 0,
                url: imgs[0]
              }
            ]
          : [];
      }
      //视频回显
      let videos = (_this.params as any).video.split(",");
      let videoCovers = (_this.params as any).videoCover.split(",");
      if (videos.length > 1) {
        videos.forEach((item: any, index: number) => {
          _this.defaultVideo = [
            {
              id: index,
              url: item,
              imgUrl: videoCovers[index]
            }
          ];
        });
      } else {
        _this.defaultVideo = videos[0]
          ? [
              {
                id: 0,
                url: videos[0],
                imgUrl: videoCovers[0]
              }
            ]
          : [];
      }
      //语音回显
      let audios = _this.params.voice.split(",");
      if (audios.length > 1) {
        audios.forEach((item: any, index: number) => {
          _this.defaultVoice.push({
            id: index,
            url: item
          });
        });
      } else {
        _this.defaultVoice = audios[0]
          ? [
              {
                id: 0,
                url: audios[0]
              }
            ]
          : [];
      }
    });
  }
  //返回
  goBack() {
    this.$router.go(-1);
  }
  //获取类型
  //类型
  private level: Array<object> = [];
  private batch: Array<object> = [];
  private ethnicity: Array<object> = [];
  private tagList: Array<object> = [
    { type: "HERITAGE_BATCH", name: "batch" },
    { type: "HERITAGE_LEVEL", name: "level" },
    { type: "ethnicity", name: "ethnicity" }
  ];
  getType(type: any, name: any) {
    let _this = this;
    dictType({ type: type }).then((res: any) => {
      if (res.code === 0) {
        _this[name] = res.datas;
      }
    });
  }
  //类型标签
  private levels: any = []; //选择世界级需要用到
  handleTags(item: any, name: any) {
    this.params[name] = item.id;
    //选择世界级的同时要选择国家级
    if (item.name === "世界级") {
      this.levels = this.level
        .map((item: any, index: any) => {
          if (index < 2) {
            return item.id;
          }
        })
        .filter((item: any) => {
          return item;
        });
    } else {
      this.levels = [];
    }
  }
  mounted() {
    let _this = this;
    _this.params.heritageItem = _this.$route.query.pid;
    //类型数据
    this.tagList.forEach((item: any) => {
      _this.getType(item.type, item.name);
    });
    //编辑时
    if (_this.$route.query.id) {
      _this.getDesc(_this.$route.query.id);
    }
    _this.getCreaterList();
  }
}
</script>

<style lang="scss">
.tab-container {
  .control {
    width: 300px !important;
  }
  .text-field {
    width: 500px;
  }
  .note {
    color: $lightGray;
    font-size: 13px;
  }
  .w150 {
    width: 150px;
  }
  .submit {
    margin-top: 30px;
  }
  .map {
    height: 400px;
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
        content: "";
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
          content: "";
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
  .form-item {
    position: absolute;
    left: -100px;
    top: 0;
    height: 100%;
  }
}
</style>
<style lang="scss">
.form-item {
  .ivu-form-item-content {
    height: 100%;
  }
  .ivu-form-item-error-tip {
    width: 100%;
    margin-left: 100px !important;
  }
}
</style>
