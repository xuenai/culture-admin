<template>
  <div class="container tab-container">
    <Form ref="formInline" :label-width="100" :model="params" :rules="ruleValidate">
      <!--tab切换-->
      <Tabs active-key="key2" class="mt20 tab-wrap" :animated="false" type="line">
        <!--基础资料-->
        <Tab-pane label="基本资料" key="key1">
          <FormItem label="农家乐名称：" prop="name">
            <Input type="text" v-model="params.name" class="control" placeholder="农家乐名称" />
          </FormItem>
          <FormItem class="formItem" label="创建者">
            <Select
              class="control"
              v-model="params.createCompany"
              :disabled="$store.state.app.userInfo.dataType !== 'SITE'"
            >
              <Option
                v-for="(item,i) in createrList"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所在地区：" class="mt20" prop="region">
            <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
          </FormItem>
          <FormItem label="详细地址：" class="mt20" prop="address">
            <Input class="control" v-model="params.address" placeholder="详细地址" />
          </FormItem>
          <FormItem label="营业时间：" class="mt20">
            <TimePicker
              class="control time"
              type="time"
              format="HH:mm"
              confirm
              :editable="false"
              placeholder="开始时间"
              v-model="openStartTime"
              placement="bottom-start"
            ></TimePicker>~
            <TimePicker
              class="control time"
              type="time"
              format="HH:mm"
              confirm
              :editable="false"
              placeholder="结束时间"
              v-model="openEndTime"
              placement="bottom-start"
            ></TimePicker>
            <!--<TimePicker type="timerange" confirm :editable="false" class="control" v-model="openTime"  placement="bottom-start"-->
            <!--placeholder="请选择营业时间"></TimePicker>-->
          </FormItem>
          <FormItem label="服务电话：" class="mt20">
            <phone v-model="params.servicePhone" class="control"></phone>
          </FormItem>
          <FormItem label="包厢数量：" class="mt20">
            <number
              :precision="0"
              class="control"
              placeholder="包厢数量"
              :min="1"
              :max="99999"
              empty
              v-model="params.boxNum"
            />
          </FormItem>
          <FormItem label="人均消费：" class="mt20">
            <number
              class="control"
              placeholder="人均消费"
              :min="1"
              :max="99999"
              empty
              v-model="params.consumeAvg"
            />
          </FormItem>
          <!--<FormItem label="资源互通编码：" class="mt20">-->
          <!--<Input class="control" placeholder="资源互通编码" :maxlength="100" v-model="params.resourceCode"/>-->
          <!--</FormItem>-->
          <!--<FormItem label="排序：" class="mt20" v-if="$store.state.app.userInfo.dataType == 'SITE'">-->
          <!--<InputNumber :precision="0" class="control" placeholder="排序" :min="1" :max="999"-->
          <!--v-model="params.sort" />-->
          <!--</FormItem>-->
          <!--个性标签-->
          <div class="tips-panel clearfix">
            <p class="fl title">个性标签</p>
            <p class="fl tag-content">真实的选择个性信息，让游客更好了解餐饮。</p>
          </div>
          <FormItem label="星级农家乐：" class="mt20">
            <p class="levels-item" :class="{'active': params.level == item.id }" v-for="(item, index) in levels" :key="index" @click="getLevelsTagIds(index)">{{ item.name }}</p>
          </FormItem>
          <FormItem label="服务设施：" class="mt20"> 
            <Tags
              resourceType="CONTENT_TYPE_AGRITAINMENT"
              labelType="FACILITIES"
              limit="5"
              :defaultIds="params.serviceFacility"
              @onChange="getEqtTagIds"
            ></Tags>
          </FormItem>
          <FormItem label="农家乐类型：" class="mt20">
            <Tags
              resourceType="CONTENT_TYPE_AGRITAINMENT"
              labelType="TYPE"
              limit="3"
              :defaultIds="params.type"
              @onChange="getTypeTagIds"
            ></Tags>
          </FormItem>
          <FormItem label="农家乐位置：" class="mt20" prop="longitude">
            <div>
              <mapMarker
                id="map1"
                @getAddress="getLongLat"
                :region="params.region"
                :address="(params.id && (params.longitude && params.latitude))? [params.longitude, params.latitude]:''"
              ></mapMarker>
              <Input type="text" v-model="params.longitude" v-show="false" />
            </div>
          </FormItem>
        </Tab-pane>
        <!--农家乐介绍-->
        <Tab-pane label="农家乐介绍" key="key2" class="item">
          <FormItem label="农家乐图片：" class="mt20" prop="images">
            <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.images"></uploadImg>-->
            <uploadImg :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="9"></uploadImg>
          </FormItem>
          <FormItem label="语音介绍：" class="mt20">
            <!--<uploadAudio :limit="5" @getAudioList="getAudioList" @getAudioTime="getAudioTime" :defaultAudio="params.audio"></uploadAudio>-->
            <uploadAudio :defaultVoice="defaultVoice" @getVoiceList="getVoiceList" :limit="5"></uploadAudio>
          </FormItem>
          <FormItem label="宣传片：" class="mt20">
            <!--<uploadVideo :limit="1" @getVideoList="getVideoList" :defaultVideo="params.video" :cover="params.videoCover"></uploadVideo>-->
            <uploadVideo :defaultVideo="defaultVideo" @getVideoList="getVideoList" :limit="1"></uploadVideo>
          </FormItem>
          <FormItem label="720全景：" class="mt20">
            <Input
              type="text"
              :maxlength="150"
              class="control"
              placeholder="720全景"
              v-model="params.panoramaUrl"
            />
          </FormItem>
          <FormItem label="农家乐概述：" class="mt20">
            <Input
              type="text"
              :maxlength="20"
              class="control"
              v-model="params.briefing"
              placeholder="农家乐概述"
            />
          </FormItem>
          <!-- <FormItem label="农家乐简介：" class="mt20">
            <Input
              type="text"
              :maxlength="20"
              class="control"
              v-model="params.summary"
              placeholder="农家乐简介"
            />
          </!--> 
          <FormItem label="农家乐介绍：" class="mt20">
            <ueditor v-model="params.introduce" id="food_uedit1"></ueditor>
          </FormItem>
        </Tab-pane>
        <!--交通信息-->
        <Tab-pane label="交通信息" key="key3" class="item">
          <FormItem label="交通信息：" class="mt20">
            <ueditor v-model="params.trafficInfo" id="food_uedit3"></ueditor>
          </FormItem>
        </Tab-pane>
        <!--预订地址-->
        <Tab-pane label="预订地址" class="item pd20">
          <orderAddressTab :data="orderAddressData" @getData="getOrderAddressManage"></orderAddressTab>
        </Tab-pane>
      </Tabs>
      <FormItem label class="submit">
        <Button type="primary" @click="save(4)">提交</Button>
        <Button class="ml20" type="primary" @click="save(3)" v-if="isEdit">存草稿</Button>
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import mapMarker from "@components/map/marker.vue";
// import uploadImg from "@components/upload/upload-image.vue";
// import uploadVideo from "@components/upload/upload-video.vue";
// import uploadAudio from "@components/upload/upload-audio.vue";
import uploadImg from "@components/upload/upload-image2.vue";
import uploadVideo from "@components/upload/upload-video2.vue";
import uploadAudio from "@components/upload/upload-voice.vue";
import ueditor from "@components/ueditor/ueditor.vue";
import Tags from "@components/tags/tags.vue";
import distPicker from "@components/distPicker/distPicker.vue";
import orderAddressTab from "@pages/place/common/orderAddress.vue";
import { orderAddress, agritainmentSave, agritainmentView } from "@service/place";
import { createrList } from "@service/content";
import { ModalConfig } from "iview/types";
import { dictType } from "@service/common";
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
    mapMarker,
    uploadImg,
    uploadAudio,
    uploadVideo,
    ueditor,
    Tags,
    distPicker,
    orderAddressTab
  }
})
export default class edit extends Vue {
  private levels: any[] = [];
  private chooseIndex: any='';
  private getDictType(type: string) {
    return dictType({ type }).then((res: any) => {
    if (res.code === 0) {
        return res.datas
    } else {
        return []
    }
    })
  }
  /*S 预订地址*/
  private orderAddressData: object = {
    orderAddressType: "ds",
    resourceType: "CONTENT_TYPE_AGRITAINMENT"
  };
  private orderList: Array<object> = [];
  private saveOrderAddressType = "";
  getOrderAddressManage(data: any) {
    this.saveOrderAddressType = data.orderAddressType;
    this.orderList = data.list;
  }
  /*E 预订地址*/

  /*S 保存*/
  private params: object = {
    id: "",
    businessTime: "", //开业时间
    servicePhone: "", //电话
    serviceFacility: "", //设备标签
    longitude: "", //经度
    latitude: "", //纬度
    images: "", //图片集
    voice: "", //音频
    voiceTime: "", //音频时长
    video: "", //视频
    videoCover: "", //视频封面图
    summary: "", //简介
    type: "", //餐饮类型
    resourceCode: "", //资源编码
    // sort: 999,//排序
    panoramaUrl: "", //720链接地址 
    consumeAvg: "", //人均消费
    orderAddressType: "pt", //预订地址 ds:小电商 pt:门票
    briefing: "", //概述
    introduce: "", //	介绍
    trafficInfo: "", //交通信息
    orderAddressManage: "", //预订地址
    saveType: "list", //list 列表编辑，audit 审核编辑
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    name: "", //名称
    region: "", //地区编码
    address: "", //地址
    status: 4, //4待审核  3 草稿
    boxNum: "", //包间数量
    level: "", // 星级
  };	

  private regionPath: string = "";
  //验证
  private ruleValidate: any = {
    name: [
      { required: true, message: "农家乐名称不能为空", trigger: "blur" },
      { type: "string", max: 100, message: "最多输入100个字符" }
    ],
    region: [{ required: true, message: "请选择所在地区", trigger: "blur" }],
    address: [
      { required: true, message: "详细地址不能为空", trigger: "blur" },
      { type: "string", max: 100, message: "最多输入100个字符" }
    ],
    longitude: [{ required: true, message: "请选择经纬度" }],
    images: [{required: true, message: '请上传农家乐图片'}]
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
  //营业开始时间
  private openStartTime: any = "";
  //营业结束时间
  private openEndTime: any = "";
  //经纬度
  getLongLat(e: any) {
    (this.params as any).longitude = e.lnglat.lng;
    (this.params as any).latitude = e.lnglat.lat;
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
    (this.params as any).images = list
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
      (this.params as any).voice = list
        .map((data: any) => data.url || "")
        .join(",");
      (this.params as any).voiceTime = list
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
  //视频
  private getVideoList(list: Array<{ id: number }>) {
    (this.params as any).videoCover = list
      .map((data: any) => data.imgUrl || "")
      .join(",");
    (this.params as any).video = list
      .map((data: any) => data.url || "")
      .join(",");
  }
  // 星级标签
  getLevelsTagIds(index: any) {
    this.chooseIndex = index;
    (this.params as any).level = this.levels[index].id;
  }

  //获取设施标签
  getEqtTagIds(value: any) {
    (this.params as any).serviceFacility = value;
  }

  //获取类型标签
  getTypeTagIds(value: any) {
    (this.params as any).type = value;
  }

  //获取地区region
  getRegion(data: any) {
    (this.params as any).region = data.region;
  }

  //保存
  save(status: any) {
    let _this = this;
    //预订地址 设置status(1:选中<启用> 2:未选中<禁用>)
    this.orderList.forEach((item: any) => {
      delete item.createTime;
      delete item.updateTime;
      item.status = item.orderType == _this.saveOrderAddressType ? 1 : 2;
    });
    (_this.params as any).orderAddressManage = JSON.stringify(this.orderList); //预订地址
    (_this.params as any).orderAddressType = this.saveOrderAddressType; //预订地址单选状态
    (_this.params as any).status = status; //状态 4待审核  3 草稿
    if (
      (_this.params as any).orderAddressType === "pt" &&
      _this.orderList.length < 2
    ) {
      this.$Message.error("请添加第三方平台预订地址");
      return;
    }
    (_this.params as any).businessTime =
      this.openStartTime && this.openEndTime
        ? this.openStartTime + " ~ " + this.openEndTime
        : ""; //营业时间
    (_this.$refs.formInline as any).validate((valid: any) => {
      if (valid) {
        if (status === 4) {
          let config: ModalConfig = {
            title: "操作提示",
            content: `请确认非必填资料是否完整，是否确认提交?`,
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
              _this.saveRequest();
            }
          };
          _this.$Modal.confirm(config);
        } else {
          _this.saveRequest();
        }
      } else {
        _this.$Message.error("请将必填项填写正确!");
      }
    });
  }
  saveRequest() {
    agritainmentSave(this.params).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("保存成功");
        this.$router.go(-1);
      }
    });
  }
  /*E 保存*/

  /*S 获取详情*/
  getDesc(id: any) {
    let _this = this;
    agritainmentView({ id: id }).then((res: any) => {
      if (res.code === 0) {
        this.params = res.data.ctcAgritainment;
        this.regionPath = res.data.sysRegion.scort;
        (this.params as any).region = res.data.sysRegion.region;
        delete (this.params as any).createTime;
        delete (this.params as any).updateTime;
        (this.params as any).saveType = this.$route.query.type;

        //预订地址radio 默认值
        (this.orderAddressData as any).orderAddressType =
          res.data.ctcAgritainment.orderAddressType;
        this.openStartTime = res.data.ctcAgritainment.businessTime.split("~")[0]; //营业开始时间
        this.openEndTime = res.data.ctcAgritainment.businessTime.split("~")[1]; //营业结束时间
        this.isEdit = res.data.ctcAgritainment.status == 3;
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
        let audios = (_this.params as any).voice.split(",");
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
      }
    });
  }

  /*E 获取详情*/

  //返回
  goBack() {
    this.$router.go(-1);
  }
  //是否是修改
  private isEdit: boolean = true;
  created() {
    this.getDictType('AGRITAINMENT_LEVEL').then((datas:any) => this.levels = datas);
    let _this = this;
    //详情信息
    if (_this.$route.query.id) {
      _this.getDesc(_this.$route.query.id);
    }
    _this.getCreaterList();
  }
}
</script>
<style lang="scss">
.levels-item {
  display: inline-block;
  min-width: 60px;
  padding: 0 12px;
  height: 30px;
  line-height: 29px;
  border-radius: 3px;
  text-align: center;
  color: #999;
  margin: 0 16px 10px 0;
  border: 1px solid #e2e2e2;
  vertical-align: top;
  background: none;
  cursor: pointer;
  max-width: 300px;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  &.active {
    color: #5ac858;
    border-color: #5ac858;
  }
}
.table {
  .img-box {
    width: 88px !important;
    height: 58px !important;
  }
}
</style>
<style lang="scss" scoped>
.container {
  padding: 10px 15px;
}

.tab-container {
  .control {
    width: 300px !important;
    &.time {
      width: 150px !important;
    }
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
  .table {
    width: 100%;
    border: 1px solid $borderLight;
    border-top: none;
    td {
      padding: 10px;
      border-top: 1px solid $borderLight;
    }
    .write {
      max-width: 60%;
    }
    .img {
      display: inline-block;
      width: 90px;
      height: 60px;
      margin: 5px 0;
      overflow: hidden;
      vertical-align: middle;
    }
  }
  .add-list {
    display: inline-block;
    border: 1px dashed $borderLight;
    font-size: 13px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    &:hover,
    &.active {
      color: $theme;
      border-color: $theme;
    }
  }
}
</style>
