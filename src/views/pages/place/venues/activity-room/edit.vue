<template>
  <div class="container pd20">
    <Head resourceType="CONTENT_TYPE_VENUE"></Head>
    <Form ref="formInline" :label-width="100" :model="params" :rules="ruleValidate">
      <!--个性标签-->
      <div class="tips-panel clearfix">
        <span class="fl title">基础信息</span>
      </div>
      <FormItem label="活动室名称：" prop="name" class="mt20">
        <Input type="text" v-model="params.name" class="control" placeholder="活动室名称" />
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
      <FormItem label="面积：" class="mt20">
        <number
          :min="1"
          :max="999999"
          :precision="0"
          v-model="params.area"
          class="control"
          placeholder="请输入面积"
        />㎡
      </FormItem>
      <FormItem label="容纳人数：" class="mt20">
        <number
          :min="1"
          :precision="0"
          :max="9999"
          class="control"
          v-model="params.galleryful"
          placeholder="容纳人数"
        />
      </FormItem>
      <FormItem label="服务电话：" class="mt20">
        <phone v-model="params.phone" class="control"></phone>
      </FormItem>
      <FormItem label="活动室类型：" class="mt20" prop="type">
        <Tags
          resourceType="CONTENT_TYPE_VENUE"
          labelType="ACTIVITY_TYPE"
          limit="1"
          :defaultIds="params.type"
          @onChange="getTypeTagIds"
        ></Tags>
        <Input type="text" v-model="params.type" v-show="false" />
      </FormItem>
      <FormItem label="活动室设备：" class="mt20">
        <Tags
          resourceType="CONTENT_TYPE_VENUE"
          labelType="ACTIVITY_ROOM_EQUIPMENT"
          limit="5"
          :defaultIds="params.equipment"
          @onChange="getEquTagIds"
        ></Tags>
      </FormItem>
      <!-- <FormItem label="资源互通编码：" class="mt20">
        <Input class="control" :maxlength="50" v-model="params.resourceCode" placeholder="资源互通编码" />
      </FormItem> -->
      <!--<FormItem label="排序：" class="mt20" v-if="$store.state.app.userInfo.dataType == 'SITE'">-->
      <!--<InputNumber :min="1" :precision="0" :max="999" class="control" v-model="params.sort" placeholder="排序"/>-->
      <!--</FormItem>-->
      <!--个性标签-->
      <div class="tips-panel clearfix">
        <span class="fl title">活动室信息</span>
      </div>
      <FormItem class="mt20">
        <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.images"></uploadImg>-->
        <FormItem class="form-item" label="活动室图片：" prop="images"></FormItem>
        <uploadImg :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="9"></uploadImg>
      </FormItem>
      <FormItem label="语音介绍：" class="mt20">
        <!--<uploadAudio :limit="5" @getAudioList="getAudioList" @getAudioTime="getAudioTime" :defaultAudio="params.audio"></uploadAudio>-->
        <uploadAudio :defaultVoice="defaultVoice" @getVoiceList="getVoiceList" :limit="1"></uploadAudio>
      </FormItem>
      <FormItem label="视频：" class="mt20">
        <!--<uploadVideo :limit="1" @getVideoList="getVideoList" :defaultVideo="params.video" :cover="params.videoCover"></uploadVideo>-->
        <uploadVideo :defaultVideo="defaultVideo" @getVideoList="getVideoList" :limit="1"></uploadVideo>
      </FormItem>
      <FormItem label="720全景：" class="mt20">
        <Input
          class="control"
          v-model="params.panoramaUrl"
          :maxlength="150"
          placeholder="请输入720全景地址"
        />
      </FormItem>
      <FormItem label="活动室概述：" class="mt20">
        <Input class="control" v-model="params.summary" :maxlength="50" placeholder="请输入活动室概述" />
      </FormItem>
      <FormItem label class="submit">
        <Button type="primary" @click="handleSubmit(4)">提交</Button>
        <Button class="ml20" type="primary" @click="handleSubmit(3)" v-if="isEdit">存草稿</Button>
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Head from "./head.vue";
// import uploadVideo from "@components/upload/upload-video.vue";
// import uploadAudio from "@components/upload/upload-audio.vue";
// import uploadImg from "@components/upload/upload-image.vue";
import uploadImg from "@components/upload/upload-image2.vue";
import uploadVideo from "@components/upload/upload-video2.vue";
import uploadAudio from "@components/upload/upload-voice.vue";
import Tags from "@components/tags/tags.vue";
import {
  activityRoomSave,
  activityRoomView,
  getVenueData
} from "@service/place";
import { getTags, saveTags, deleteTag } from "@service/common";
import { createrList } from "@service/content";

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
    uploadImg,
    uploadAudio,
    uploadVideo,
    Head,
    Tags
  }
})
export default class edit extends Vue {
  /*S 保存 */
  //请求参数
  private params: any = {
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    id: "",
    venueId: "", //场馆id
    name: "", //活动室名称
    type: "", //活动室类型
    phone: "", //电话号码
    resourceCode: "", //资源编码
    area: "", //面积
    galleryful: "", //容纳人数
    equipment: "", //设备标签
    // sort: 999,//排序
    images: "", //图片
    audio: "", //音频
    audioTime: "", //音频时长
    video: "", //视频
    videoCover: "", //视频封面图
    panoramaUrl: "", //720链接
    summary: "", //概述
    status: 4, //4待审核  3 草稿
    saveType: "list" //list 列表编辑，audit 审核编辑
  };
  //验证
  private ruleValidate: any = {
    name: [
      { required: true, message: "活动室名称不能为空" },
      { type: "string", max: 100, message: "最多输入100个字符" }
    ],
    type: [{ required: true, message: "请选择活动室类型" }],
    images: [{ required: true, message: "请添加图片" }]
  };
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

  //提交保存
  handleSubmit(status: any) {
    let _this = this;
    _this.params.status = status; //状态 4待审核  3 草稿
    (this.$refs.formInline as any).validate((valid: any) => {
      if (valid) {
        activityRoomSave(_this.params).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("保存成功");
            _this.$router.go(-1);
          }
        });
      } else {
        _this.$Message.error("请将必填项填写正确!");
      }
    });
  }

  /*E 保存 */

  //返回
  goBack() {
    this.$router.go(-1);
  }

  /*S 标签tag */

  //类型标签
  getTypeTagIds(value: any) {
    this.params.type = value;
  }

  //设备标签
  getEquTagIds(value: any) {
    this.params.equipment = value;
  }

  /*E 标签tag */

  /*S 图片视频音频 */
  // 回显图片
  private defaultImage: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
  ];
  private defaultIcon: Array<imgType> = [
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
    // this.params.audio = list.map((data: any) => (data.url || '')).join(',')
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

  // 获取本地音频时长
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

  //视频
  private getVideoList(list: Array<{ id: number }>) {
    this.params.videoCover = list
      .map((data: any) => data.imgUrl || "")
      .join(",");
    this.params.video = list.map((data: any) => data.url || "").join(",");
  }

  /*E 图片视频音频 */

  /*S 获取编辑详情数据 */

  //获取活动室详情
  private isEdit: boolean = true;

  getActivityRoomDesc() {
    let _this = this;
    activityRoomView({ id: _this.params.id }).then((data: any) => {
      _this.params = data.data.ctcActivityRoom;
      _this.isEdit = data.data.ctcActivityRoom.status == 3;
      delete _this.params.createTime;
      delete _this.params.updateTime;
      _this.params.saveType = _this.$route.query.type;
      //图片回显
      let imgs = _this.params.images.split(",");
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
      let videos = _this.params.video.split(",");
      let videoCovers = _this.params.videoCover.split(",");
      if (videos.length > 1) {
        videos.forEach((item: any, index: number) => {
          _this.defaultVideo.push({
            id: index,
            url: item,
            imgUrl: videoCovers[index]
          });
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
      let audios = _this.params.audio.split(",");
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

  /*E 获取编辑详情数据 */
  mounted() {
    let _this = this;
    //获取场馆id
    _this.params.venueId = this.$route.query.venueId;
    //获取活动室详情
    if (this.$route.query.id) {
      _this.params.id = this.$route.query.id;
      _this.getActivityRoomDesc();
    }
    this.getCreaterList();
  }
}
</script>

<style scoped lang="scss">
.container {
  .w150 {
    width: 150px;
  }
  .control {
    width: 300px !important;
  }
  .note {
    color: $lightGray;
    font-size: 13px;
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
  .submit {
    margin-top: 35px;
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
