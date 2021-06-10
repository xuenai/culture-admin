<template>
  <div class="container pd20">
    <div class="head-container pd20" v-if="scenic">
      <div class="head-img daq-no-photo">
        <img :src="scenic.images.split(',')[0]" alt class="daq-img" v-if="scenic.images" />
      </div>
      <div class="info ml20">
        <h2 class="title mt10">{{scenic.name}}</h2>
        <p class="choice-tag active room-type" v-if="scenic.level">{{scenic.level}}</p>
        <div class="address" v-if="scenic.address">
          <i class="cloud-icon">&#xe606;</i>
          {{scenic.address}}
        </div>
      </div>
    </div>
    <Form ref="params" :model="params" :label-width="150" :rules="ruleValidate">
      <!--个性标签-->
      <div class="tips-panel clearfix">
        <span class="fl title">基本信息</span>
        <p class="fl tag-content">真实的选择个性信息，让游客更好了解景区。</p>
      </div>
      <FormItem label="景点名称：" class="mt20" prop="name">
        <Input type="text" class="control" placeholder="景点名称" v-model="params.name" />
      </FormItem>
      <FormItem label="海拔高度：" class="mt20">
        <number
          :precision="0"
          :min="0"
          :max="999999"
          class="control"
          placeholder="海拔高度"
          v-model="params.elevation"
        />m
      </FormItem>
      <FormItem label="辐射距离(m)：" class="mt20">
        <number
          :precision="0"
          :min="0"
          :max="99999"
          class="control"
          placeholder="请输入辐射距离"
          v-model="params.radiationDis"
        />
      </FormItem>
      <FormItem label="详细地址：" class="mt20" prop="address">
        <Input class="control" placeholder="详细地址" :maxlength="50" v-model="params.address" />
      </FormItem>
      <FormItem class="formItem" label="创建者">
        <Select
          class="control"
          v-model="params.createCompany"
          :disabled="$store.state.app.userInfo.dataType !== 'SITE'"
        >
          <Option v-for="(item,i) in createrList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="开放时间：">
        <TimePicker
          format="HH:mm"
          type="timerange"
          placement="bottom-end"
          placeholder="请选择开放时间"
          class="control"
          confirm
          :value="openTime"
          :editable="false"
          @on-change="setOpenTime"
        ></TimePicker>
        <Input
          type="text"
          placeholder="备注"
          class="control ml10"
          v-model="params.remarks"
          :maxlength="100"
        />
      </FormItem>
      <FormItem label="建议游玩时长：">
        <number
          :precision="0"
          :max="12"
          :min="1"
          placeholder="建议游玩时长"
          class="control"
          v-model="params.suggestedTime"
        />
      </FormItem>
      <FormItem label="服务电话：" class="mt20" prop="phone">
        <phone v-model="params.phone" class="control"></phone>
      </FormItem>
      <FormItem label="门票政策：">
        <Input
          class="control-textarea"
          v-model="params.ticketPolicy"
          :maxlength="200"
          :rows="4"
          type="textarea"
          placeholder="请输入门票政策"
        />
      </FormItem>
      <!--<FormItem label="资源互通编码：" class="mt20">-->
      <!--<Input class="control" :maxlength="100" placeholder="资源互通编码" v-model="params.resourceCode"/>-->
      <!--</FormItem>-->
      <!--<FormItem label="排序：" class="mt20" v-if="$store.state.app.userInfo.dataType == 'SITE'">-->
      <!--<InputNumber :precision="0" :min="1" :max="999" class="control" placeholder="排序" v-model="params.sort"/>-->
      <!--</FormItem>-->
      <!--个性标签-->
      <div class="tips-panel clearfix">
        <span class="fl title">景点信息</span>
      </div>
      <FormItem label="景点图片：" class="mt20" prop="images">
        <!--<uploadImg :limit="9" @getImagesList="getImage" :defaultImage="params.images"></uploadImg>-->
        <uploadImg :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="9"></uploadImg>
      </FormItem>
      <FormItem label="语音导览：" class="mt20">
        <!--<uploadAudio :limit="5" @getAudioList="getAudio" @getAudioTime="getAudioTime" :defaultAudio="params.audio"></uploadAudio>-->
        <uploadAudio :defaultVoice="defaultVoice" @getVoiceList="getVoiceList" :limit="5"></uploadAudio>
      </FormItem>
      <FormItem label="实景直播：">
        <Input type="text" class="control" placeholder="请输入直播地址" v-model="params.liveUrl" />
      </FormItem>
      <FormItem label="720全景：">
        <Input
          type="text"
          :maxlength="150"
          class="control"
          placeholder="请输入720全景地址"
          v-model="params.panoramaUrl"
        />
      </FormItem>
      <FormItem label="景点概述：">
        <Input
          type="text"
          :maxlength="20"
          class="control"
          placeholder="一句话描述景点特点"
          v-model="params.briefing"
        />
      </FormItem>
      <FormItem label="景点简介：">
        <Input
          type="text"
          :maxlength="100"
          class="control"
          placeholder="请输入景点简介"
          v-model="params.summary"
        />
      </FormItem>
      <FormItem label="景点介绍：">
        <ueditor v-model="params.introduce" id="scenic_ueditor1"></ueditor>
      </FormItem>
      <FormItem label="景点位置：" prop="longitude">
        <div>
          <mapMarker
            id="map"
            @getAddress="getAddress"
            :address="params.id && params.longitude ? [params.longitude, params.latitude] : ''"
          ></mapMarker>
          <Input type="text" v-model="params.longitude" v-show="false" />
        </div>
      </FormItem>
      <div class="tips-panel clearfix">
        <span class="fl title">最佳拍摄位</span>
      </div>
      <FormItem class="mt10" label="拍摄点介绍：">
        <!-- <Input
          type="text"
          :maxlength="150"
          class="control"
          placeholder="拍摄点介绍"
          v-model="params.shootPointIntroduce"
        />-->
        <ueditor v-model="params.shootPointIntroduce" id="scenic_ueditor2"></ueditor>
      </FormItem>
      <FormItem label="拍摄时间:">
        <Input
          type="text"
          :maxlength="50"
          class="control"
          placeholder="拍摄时间"
          v-model="params.shootTime"
        />
      </FormItem>
      <FormItem label="拍照示例 ">
        <uploadImg :defaultImage="defaultShootImage" @getImagesList="getShootImages" :limit="9"></uploadImg>
      </FormItem>
      <FormItem ref="formInline" label class="submit">
        <Button type="primary" @click="checkedParams(4)">提交</Button>
        <Button class="ml20" type="primary" @click="checkedParams(3)" v-if="isEdit">存草稿</Button>
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import uploadImg from "@components/upload/upload-image.vue";
// import uploadAudio from "@components/upload/upload-audio.vue";
import uploadImg from "@components/upload/upload-image2.vue";
import uploadAudio from "@components/upload/upload-voice.vue";
import ueditor from "@components/ueditor/ueditor.vue";
import mapMarker from "@components/map/marker.vue";
import { createrList } from "@service/content";
import {
  getScenicPointList,
  getScenicPoint,
  saveScecnicPonit,
  getScenicPointDesc
} from "@service/place";
import { validate } from "@util/comm";
interface imgType {
  id: number;
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
    uploadImg,
    uploadAudio,
    ueditor,
    mapMarker
  }
})
export default class edit extends Vue {
  private params: any = {
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    status: 1,
    name: "", //景点名称
    elevation: "", //海拔
    address: "", //地址
    phone: "", //电话
    radiationDis: "", //辐射距离
    // resourceCode: "", //资源编码
    // sort: 999, //排序
    longitude: "", //经度
    latitude: "", //纬度
    images: "", //图片地址
    audio: "", //音频
    audioTime: "", //音频时长
    liveUrl: "", //直播地址
    panoramaUrl: "", //720全景
    summary: "", //简介
    briefing: "", //概述
    introduce: "", //介绍
    scenicId: "", //景区id
    id: "",
    openTimeStart: "", //营业时间开始
    openTimeEnd: "", //营业时间结束
    ticketPolicy: "", //门票政策
    suggestedTime: "", //建议游玩时长
    remarks: "", //开放时间备注
    saveType: "list", //list 列表编辑，audit 审核编辑
    shootPointIntroduce: "", //拍摄点介绍
    shootTime: "", //拍摄时间 最大50
    shootImgExample: "" //拍照示例
  };
  //   父景区
  private scenic: Object = {};
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
  // 父级景区
  //是否是编辑
  mounted() {
    this.getScenic();
    this.params.scenicId = this.$route.query.scenicId;
    if (this.$route.query.id) {
      this.getScenicPoint();
    }
    this.getCreaterList();
  }

  private goHistory() {
    this.$router.go(-1);
  }

  // 经纬度
  private getAddress(e: any) {
    this.params.longitude = e.lnglat.lng;
    this.params.latitude = e.lnglat.lat;
  }
  // 回显图片
  private defaultImage: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
  ];
  private defaultShootImage: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
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
  //拍照示例
  private getShootImages(list: Array<{ id: number }>) {
    this.params.shootImgExample = list
      .map((data: any) => data.url || "")
      .join(",");
  }
  //音频
  private getVoiceList(list: Array<{ id: number }>) {
    let allPromise: Array<Promise<any>> = [];
    list.forEach((item: any) => {
      if (!item.duration || !/^(\d+|(\d+\.\d+))$/.test(item.duration + "")) {
        // 没得的主动获取音频时长
        let currPromise: Promise<any> = this.getAudioTime(item.url);
        currPromise.then((res: { duration: number }) => {
          item.duration = res.duration;
        });
        allPromise.push(currPromise);
      }
    });

    Promise.all(allPromise).finally(() => {
      this.params.audio = list.map((data: any) => data.url || "").join(",");
      this.params.audioTime = list
        .map((data: any) => this.formatSeconds(data.duration) || "")
        .join(",");
    });
  }
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

  //音频时长
  private getAudioTime(url: string) {
    return new Promise((resolve, reject) => {
      let audio = document.createElement("audio");
      audio.src = url;
      audio.addEventListener("loadeddata", function() {
        resolve({
          duration: parseInt(String(this.duration))
        });
      });
      audio.addEventListener("error", function() {
        reject();
      });
    });
  }
  // 开放时间
  private openTime: any = [];
  private setOpenTime(e: any) {
    this.params.openTimeStart = e[0];
    this.params.openTimeEnd = e[1];
  }
  // 验证
  private ruleValidate: any = {
    name: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { type: "string", max: 100, message: "最多输入100个字符" }
    ],
    address: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { type: "string", max: 100, message: "最多输入100个字符" }
    ],
    longitude: [{ required: true, message: "请选择经纬度" }],
    images: [{required: true, message: '请上传景点图片'}]
  };

  // 手机号
  private checkedPhone(rule: any, value: any, callback: any) {
    if (value) {
      if (!validate(value, "phone")) {
        return callback(new Error("号码填写错误"));
      }
      callback();
    }
    callback();
  }

  // 提交
  private checkedParams(type: Number) {
    // 名称
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请将必填项填写正确！");
        return;
      }
      this.submitScenic(type);
    });
  }

  // 提交表单
  private submitScenic(status: Number) {
    this.params.status = status;
    saveScecnicPonit(this.params).then(data => {
      if (data.code === 0) {
        this.$Message.success("保存成功!");
        if (this.params.id) {
          this.$router.go(-1);
        } else {
          this.$router.go(-2);
        }
      }
    });
  }
  //返回
  goBack() {
    this.$router.go(-1);
  }

  // 父景区
  private getScenic() {
    getScenicPoint({
      id: this.$route.query.scenicId
    }).then(data => {
      this.scenic = data.data;
    });
  }

  // 当前景点
  private isEdit: boolean = true;
  private getScenicPoint() {
    getScenicPointDesc({
      id: this.$route.query.id
    }).then(data => {
      this.params = data.data.ctcScenicSpots;
      this.isEdit = data.data.ctcScenicSpots.status == 3;
      (this.params as any).saveType = this.$route.query.type;
      delete this.params.createTime;
      delete this.params.updateTime;
      if (this.params.openTimeStart) {
        this.openTime = [this.params.openTimeStart, this.params.openTimeEnd];
      }
      //图片回显
      let imgs = this.params.images.split(",");
      if (imgs.length > 1) {
        imgs.forEach((item: any, index: number) => {
          this.defaultImage.push({
            id: index,
            url: item
          });
        });
      } else {
        this.defaultImage = imgs[0]
          ? [
              {
                id: 0,
                url: imgs[0]
              }
            ]
          : [];
      }
      //语音回显
      let audios = this.params.audio.split(",");
      if (audios.length > 1) {
        audios.forEach((item: any, index: number) => {
          this.defaultVoice.push({
            id: index,
            url: item
          });
        });
      } else {
        this.defaultVoice = audios[0]
          ? [
              {
                id: 0,
                url: audios[0]
              }
            ]
          : [];
      }
      //拍照示例回显
      let shootImgs = this.params.shootImgExample.split(",");
      if (shootImgs.length > 1) {
        shootImgs.forEach((item: any, index: number) => {
          this.defaultShootImage.push({
            id: index,
            url: item
          });
        });
      } else {
        this.defaultShootImage = shootImgs[0]
          ? [
              {
                id: 0,
                url: shootImgs[0]
              }
            ]
          : [];
      }
    });
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 10px 15px;
  .control {
    width: 300px !important;
  }
  .control-textarea {
    width: 600px !important;
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
}

.head-container {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid $borderLight;
  .head-img {
    border-radius: 4px;
    overflow: hidden;
    width: 160px;
    height: 120px;
  }
  .info {
    flex: 1;
    overflow: hidden;
    .title {
      font-size: 22px;
      font-weight: 600;
      color: $font01;
    }
    .room-type {
      width: 65px;
      height: 26px;
      line-height: 26px;
      padding: 0;
      margin-top: 5px;
    }
    .address {
      color: $font04;
      font-size: 14px;
    }
  }
}
</style>
