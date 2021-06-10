<template>
  <div class="container">
    <!--tab切换-->
    <Tabs class="tab-wrap tab-container" :animated="false" type="line">
      <!--基础资料-->
      <Tab-pane label="基本资料">
        <Form
          ref="params"
          :label-width="150"
          :model="params"
          :rules="ruleValidate"
        >
          <FormItem label="景区名称：" prop="name">
            <Input
              type="text"
              class="control"
              placeholder="景区名称"
              v-model="params.name"
            />
          </FormItem>
          <FormItem label="景区等级：" class="no-bottom">
            <span
              v-for="item in level"
              :key="item"
              :class="
                item === params.level ? 'active choice-tag' : 'choice-tag'
              "
              @click.stop="tagChoice(item)"
              >{{ item }}</span
            >
          </FormItem>
          <FormItem label="所在地区：" prop="region">
            <distPicker
              :default="regionPath"
              @onChange="getRegion"
            ></distPicker>
          </FormItem>
          <FormItem label="详细地址：" prop="address">
            <Input
              placeholder="详细地址"
              class="control"
              v-model="params.address"
            />
          </FormItem>
          <FormItem class="formItem" label="创建者">
            <Select
              class="control"
              v-model="params.createCompany"
              :disabled="$store.state.app.userInfo.dataType !== 'SITE'"
            >
              <Option
                v-for="(item, i) in createrList"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</Option
              >
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
              :value="startTime"
              :editable="false"
              @on-change="setOpenTime"
            ></TimePicker>
            <Input
              type="text"
              placeholder="备注"
              class="control ml10"
              v-model="params.remarks"
              :maxlength="50"
            />
          </FormItem>
          <FormItem label="导游导览：">
            <Input
              placeholder="导游导览"
              class="control"
              v-model="params.tourGuide"
            />
          </FormItem>
          <FormItem label="建议游玩时长：">
            <Input
              :maxlength="20"
              placeholder="请输入建议游玩时长,如4小时或者1天"
              class="control"
              v-model="params.suggestedTime"
            />
            <InputNumber
              :precision="0"
              :maxlength="2"
              :min="0"
              placeholder="这里填写纯数字,单位小时"
              class="ml10 w150"
              v-model="params.suggestedHour"
            ></InputNumber
            >小时
          </FormItem>
          <FormItem label="最佳游玩时间">
            <Input
              class="control"
              v-model="params.bestTravelTime"
              :maxlength="50"
              type="text"
              placeholder="最佳游玩时间"
            />
          </FormItem>
          <FormItem label="服务电话：">
            <phone v-model="params.phone" class="control"></phone>
          </FormItem>
          <FormItem label="是否收费">
            <i-switch
              v-model="chargeStatus"
              @on-change="
                val => {
                  params.chargeStatus = val ? 1 : 0
                  chargeStatus = val
                }
              "
              true-color="#19BE6B"
              size="large"
            >
              <span slot="open">收费</span>
              <span slot="close">免费</span>
            </i-switch>
          </FormItem>
          <FormItem label="门票政策：" v-if="chargeStatus">
            <Input
              class="control-textarea"
              v-model="params.ticketPolicy"
              :maxlength="2000"
              :rows="4"
              type="textarea"
              placeholder="请输入门票政策"
            />
          </FormItem>
          <!--<FormItem label="资源互通编码：">-->
          <!--<Input placeholder="资源互通编码" :maxlength="100" class="control" v-model="params.resourceCode"/>-->
          <!--</FormItem>-->
          <!--<FormItem label="排序：" v-if="$store.state.app.userInfo.dataType == 'SITE'">-->
          <!--<InputNumber :precision="0" :min="1" :max="999" placeholder="排序" class="control" v-model="params.sort"/>-->
          <!--</FormItem>-->
          <div class="tips-panel clearfix">
            <p class="fl title">个性标签</p>
            <p class="fl tag-content">
              真实的选择个性信息，让游客更好了解景区。
            </p>
          </div>
          <FormItem label="景区主题：" class="mt20">
            <Tags
              resourceType="CONTENT_TYPE_SCENERY"
              labelType="SCENIC_THEME"
              limit="5"
              :defaultIds="params.theme"
              @onChange="getThemeTagIds"
            ></Tags>
          </FormItem>
          <FormItem label="适合人群：">
            <Tags
              resourceType="CONTENT_TYPE_SCENERY"
              labelType="SUITABLE_FOR_PEOPLE"
              limit="3"
              :defaultIds="params.crowd"
              @onChange="getCrowdTagIds"
            ></Tags>
          </FormItem>
          <FormItem label="景区位置：" prop="longitude">
            <div>
              <mapMarker
                id="map1"
                @getAddress="getAddress"
                :region="params.region"
                :address="
                  params.id && params.longitude
                    ? [params.longitude, params.latitude]
                    : ''
                "
              ></mapMarker>
              <Input type="text" v-model="params.longitude" v-show="false" />
            </div>
          </FormItem>
        </Form>
      </Tab-pane>
      <!--景区介绍-->
      <Tab-pane label="景区介绍" class="item">
        <Form
          ref="formInline"
          :label-width="150"
          :model="params"
          :rules="ruleValidate"
        >
          <FormItem label="景区图片：" prop="images">
            <!--<uploadImg-->
            <!--:limit="9"-->
            <!--@getImagesList="getImage($event, 'images')"-->
            <!--:defaultImage="params.images"-->
            <!--&gt;</uploadImg>-->
            <uploadImg
              :defaultImage="defaultImage"
              @getImagesList="getImagesList"
              :limit="9"
            ></uploadImg>
          </FormItem>
          <FormItem label="语音介绍：">
            <!--<uploadAudio :limit="5" @getAudioList="getAudio" @getAudioTime="getAudioTime" :defaultAudio="params.audio"></uploadAudio>-->
            <uploadAudio
              :defaultVoice="defaultVoice"
              @getVoiceList="getVoiceList"
              :limit="5"
            ></uploadAudio>
          </FormItem>
          <FormItem label="宣传片：">
            <!--<uploadVideo :limit="1" @getVideoList="getVideo" :defaultVideo="params.video" :cover="params.videoCover"></uploadVideo>-->
            <uploadVideo
              :defaultVideo="defaultVideo"
              @getVideoList="getVideoList"
              :limit="1"
            ></uploadVideo>
          </FormItem>
          <FormItem label="720全景：">
            <Input
              type="text"
              :maxlength="150"
              class="control"
              placeholder="720全景"
              v-model="params.panoramaUrl"
            />
          </FormItem>
          <FormItem label="最大承载量：">
            <number
              :precision="0"
              :min="1"
              :max="99999"
              placeholder="最大承载量"
              class="control"
              v-model="params.maxNum"
            />
          </FormItem>
          <FormItem label="海拔高度：">
            <number
              :max="9999999"
              placeholder="海拔高度"
              class="control"
              v-model="params.elevation"
            />m
          </FormItem>
          <FormItem label="公众号二维码">
            <uploadImg
              :defaultImage="defaultQrCode"
              @getImagesList="getQrCode"
              :limit="1"
            ></uploadImg>
            <Input
              class="control"
              :maxlength="150"
              v-model="params.officialName"
              placeholder="请输入公众号名称"
            />
            <span class="note ml10"
              >注：可添加景区已有的可用于正常识别的公众号二维码图片，仅一张</span
            >
          </FormItem>
          <FormItem label="官网地址" class="mt20" prop="websiteUrl">
            <Input
              class="control"
              :maxlength="500"
              v-model="params.websiteUrl"
              placeholder="请输入跳转地址"
            />
            <span class="note ml10"
              >注：如果已上传了公众号二维码，建议该处填写公众号访问链接地址</span
            >
          </FormItem>
          <FormItem label="景区概述：">
            <Input
              type="text"
              :maxlength="50"
              placeholder="景区概述"
              class="control"
              v-model="params.briefing"
            />
          </FormItem>
          <FormItem label="景区简介：">
            <Input
              type="text"
              :maxlength="100"
              placeholder="景区简介"
              class="control"
              v-model="params.summary"
            />
          </FormItem>
          <FormItem label="景区介绍：">
            <ueditor v-model="params.introduce" id="scenic_uedit1"></ueditor>
          </FormItem>
        </Form>
      </Tab-pane>
      <!--游玩线路-->
      <Tab-pane label="游玩线路" class="item">
        <Form ref="formInline" :label-width="150">
          <FormItem label="游玩路线：">
            <ueditor v-model="params.route" id="scenic_uedit2"></ueditor>
          </FormItem>
        </Form>
      </Tab-pane>
      <!--交通信息-->
      <Tab-pane label="交通信息" class="item">
        <Form ref="formInline" :label-width="150">
          <FormItem label="交通信息：">
            <ueditor v-model="params.trafficInfo" id="scenic_uedit3"></ueditor>
          </FormItem>
        </Form>
      </Tab-pane>
      <!--地理文化-->
      <Tab-pane label="地理文化" class="item">
        <Form ref="formInline" :label-width="150">
          <FormItem label="地理文化：">
            <ueditor v-model="params.geogCulture" id="scenic_uedit4"></ueditor>
          </FormItem>
        </Form>
      </Tab-pane>
      <!--预订地址-->
      <Tab-pane label="预订地址" class="item pd20">
        <orderAddressTab
          :data="orderAddressData"
          @getData="getOrderAddressManage"
        ></orderAddressTab>
      </Tab-pane>
      <!--游客中心-->
      <Tab-pane label="游客中心" class="item">
        <Form
          ref="params1"
          :label-width="150"
          :model="params"
          :rules="ruleValidate"
        >
          <FormItem label="所在地址：">
            <Input
              type="text"
              placeholder="地址"
              class="control"
              v-model="params.centerAddress"
              :maxlength="50"
            />
          </FormItem>
          <FormItem label="服务电话：">
            <phone v-model="params.centerPhone" class="control"></phone>
          </FormItem>
          <FormItem label="开放时间：">
            <TimePicker
              format="HH:mm"
              type="timerange"
              placement="bottom-end"
              placeholder="请选择开放时间"
              :value="startTime1"
              style="width: 300px"
              confirm
              :editable="false"
              @on-change="setOpenTimeCenter"
            ></TimePicker>
          </FormItem>
          <FormItem label="景区图片：">
            <!--<uploadImg-->
            <!--:limit="9"-->
            <!--@getImagesList="getImage($event, 'centerImage')"-->
            <!--:defaultImage="params.centerImage"-->
            <!--&gt;</uploadImg>-->
            <uploadImg
              :defaultImage="defaultScenicImg"
              @getImagesList="getScenicImages"
              :limit="9"
            ></uploadImg>
          </FormItem>
          <FormItem label="地理位置">
            <div>
              <mapMarker
                id="map7"
                @getAddress="getAddressCenter"
                :address="
                  params.id && params.centerLongitude
                    ? [params.centerLongitude, params.centerLatitude]
                    : ''
                "
              ></mapMarker>
            </div>
          </FormItem>
        </Form>
      </Tab-pane>
    </Tabs>
    <Form :label-width="150" class="mt20">
      <FormItem label class="submit">
        <Button type="primary" @click="checkedParams(4)">提交</Button>
        <Button
          type="primary"
          class="ml20"
          @click="checkedParams(3)"
          v-if="isEdit"
          >存草稿</Button
        >
        <Button class="ml20 btn-cancel" @click="goHistory">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import mapMarker from '@components/map/marker.vue'
// import uploadImg from "@components/upload/upload-image.vue";
// import uploadVideo from "@components/upload/upload-video.vue";
// import uploadAudio from "@components/upload/upload-audio.vue";
import uploadImg from '@components/upload/upload-image2.vue'
import uploadVideo from '@components/upload/upload-video2.vue'
import uploadAudio from '@components/upload/upload-voice.vue'
import ueditor from '@components/ueditor/ueditor.vue'
import distPicker from '@components/distPicker/distPicker.vue'
import Tags from '@components/tags/tags.vue'
import orderAddressTab from '@pages/place/common/orderAddress.vue'
import { validate } from '@util/comm'
import { createrList } from '@service/content'
import { ModalConfig } from 'iview/types'
import {
  saveScenic,
  getScenicDesc,
  orderAddress,
  saveOrderAddress
} from '@service/place'
interface imgType {
  id: number
  url: string
  name?: string
}

interface videoType {
  id: number
  imgUrl: string
  url: string
  name?: string
}

interface voiceType {
  id: number
  url: string
  imgUrl?: string
  name?: string

  [propName: string]: any
}
@Component({
  components: {
    mapMarker,
    uploadImg,
    uploadVideo,
    ueditor,
    distPicker,
    uploadAudio,
    Tags,
    orderAddressTab
  }
})
export default class edit extends Vue {
  /*S 预订地址*/
  private orderAddressData: object = {
    orderAddressType: 'ds',
    resourceType: 'CONTENT_TYPE_SCENERY'
  }
  private orderList: Array<object> = []
  private saveOrderAddressType = ''
  getOrderAddressManage(data: any) {
    this.saveOrderAddressType = data.orderAddressType
    this.orderList = data.list
  }
  /*E 预订地址*/
  // 开始时间
  private startTime: Array<String> = []
  private startTime1: Array<String> = []
  // 景区等级
  private level: Array<String> = ['无等级', 'AAAAA', 'AAAA', 'AAA', 'AA', 'A']
  private tagList: any
  private peopleList: any
  // 验证
  private ruleValidate: any = {
    name: [
      { required: true, message: '请将信息填写完整', trigger: 'blur' },
      { type: 'string', max: 100, message: '最多输入100个字符' }
    ],
    phone: [
      {
        required: false,
        message: '号码填写错误',
        trigger: 'blur',
        validator: this.checkedPhone
      }
    ],
    region: [
      {
        required: true,
        message: '请将信息填写完整',
        trigger: 'blur',
        validator: this.checkedRegion
      }
    ],
    address: [
      { required: true, message: '详细地址不能为空', trigger: 'blur' },
      { type: 'string', max: 100, message: '最多输入100个字符' }
    ],
    longitude: [{ required: true, message: '请选择经纬度' }],
    images: [{ required: true, message: '请上传景区图片' }],
    websiteUrl: [{ validator: this.validWebsiteUrl, trigger: 'blur' }]
  }
  //官网地址验证
  validWebsiteUrl(rule: any, value: any, callback: any) {
    let reg = /[\u4e00-\u9fa5]+$/
    if (value && reg.test(value)) {
      callback(new Error('请填写规范的链接地址，不能包含中文'))
    } else {
      callback()
    }
  }
  // 景区基本资料
  private params: any = {
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    orderAddressManage: '', // 预订 platformName logo url type(ds || pt  名称  链接  id  )
    introduce: '', // 景区介绍
    route: '', // 游玩线路
    trafficInfo: '', // 交通信息
    geogCulture: '', // 地理文化
    centerAddress: '', // 游客中心地址
    centerPhone: '', // 游客中心电话
    centerTimeStart: '', // 游客中心开始时间
    centerTimeEnd: '', // 游客中心结束时间
    centerImage: '', // 游客中心图片
    centerLongitude: '', // 游客中心进度
    centerLatitude: '', //游客中心纬度
    status: 4,
    // sort: 999, // 排序
    name: '', // 名称
    level: '无等级', // 等级
    region: '', //  地区编码
    address: '', // 地址
    openTimeStart: '', // 开放时间开始
    openTimeEnd: '', // 开放结束时间
    phone: '', // 电话
    // resourceCode: "", // 资源编码
    theme: '', // 主题
    crowd: '', // 所属人群
    longitude: '', // 经度
    latitude: '', // 纬度
    images: '', // 图片
    audio: '', // 音频
    audioTime: '', //音频时长
    video: '', // 视频
    videoCover: '', //视频封面图
    panoramaUrl: '', // 720视频
    maxNum: '', // 最大承载量
    elevation: '', // 海拔
    summary: '', // 简介
    briefing: '', // 概述
    id: '', // 数据id ，id为空则为新增，反之更新
    suggestedTime: '', //建议游玩时长
    suggestedHour: 4, //建议游玩时长(小时)
    bestTravelTime: '', //最佳旅游时间
    ticketPolicy: '', //门票政策
    remarks: '', //开放时间备注
    chargeStatus: '', //是否收费
    saveType: 'list', //list 列表编辑，audit 审核编辑
    tourGuide: '', //导游导览
    officialName: '', //官网名称
    officialUrl: '', //二维码地址
    websiteUrl: '' //官网地址
  }
  private regionPath: string = ''
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
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.getScenicDesc()
    }
    this.getCreaterList()
  }

  private goHistory() {
    this.$router.go(-1)
  }

  // 获取景区详情
  private isEdit: boolean = true

  private getScenicDesc() {
    getScenicDesc({
      id: this.$route.query.id
    }).then(data => {
      data.data.orderAddressManage = ''
      this.params = data.data.ctcScenic
      this.isEdit = data.data.ctcScenic.status == 3
      delete this.params.createTime
      delete this.params.siteId
      delete this.params.orgId
      delete this.params.code
      delete this.params.createUser
      delete this.params.updateUser
      delete this.params.updateTime
      this.regionPath = data.data.sysRegion.scort
      this.chargeStatus = data.data.ctcScenic.chargeStatus ? true : false
      ;(this.params as any).region = data.data.sysRegion.region
      if (this.params.openTimeStart) {
        this.startTime = [this.params.openTimeStart, this.params.openTimeEnd]
      }
      if (this.params.centerTimeStart) {
        this.startTime1 = [this.params.centerTimeStart, this.params.openTimeEnd]
      }
      this.tagList = this.params.theme.split(',')
      this.peopleList = this.params.theme.split(',')
      ;(this.params as any).saveType = this.$route.query.type

      //预订地址radio 默认值
      ;(this.orderAddressData as any).orderAddressType =
        data.data.ctcScenic.orderAddressType

      //图片回显
      let imgs = this.params.images.split(',')
      if (imgs.length > 1) {
        imgs.forEach((item: any, index: number) => {
          this.defaultImage.push({
            id: index,
            url: item
          })
        })
      } else {
        this.defaultImage = imgs[0]
          ? [
              {
                id: 0,
                url: imgs[0]
              }
            ]
          : []
      }
      //图片回显
      let scenicImgs = this.params.centerImage.split(',')
      if (scenicImgs.length > 1) {
        scenicImgs.forEach((item: any, index: number) => {
          this.defaultScenicImg.push({
            id: index,
            url: item
          })
        })
      } else {
        this.defaultScenicImg = scenicImgs[0]
          ? [
              {
                id: 0,
                url: scenicImgs[0]
              }
            ]
          : []
      }
      //公众号二维码
      this.defaultQrCode = this.params.officialUrl
        ? [{ id: 0, url: this.params.officialUrl }]
        : []
      //视频回显
      let videos = this.params.video.split(',')
      let videoCovers = this.params.videoCover.split(',')
      if (videos.length > 1) {
        videos.forEach((item: any, index: number) => {
          this.defaultVideo.push({
            id: index,
            url: item,
            imgUrl: videoCovers[index]
          })
        })
      } else {
        this.defaultVideo = videos[0]
          ? [
              {
                id: 0,
                url: videos[0],
                imgUrl: videoCovers[0]
              }
            ]
          : []
      }
      //语音回显
      let audios = this.params.audio.split(',')
      if (audios.length > 1) {
        audios.forEach((item: any, index: number) => {
          this.defaultVoice.push({
            id: index,
            url: item
          })
        })
      } else {
        this.defaultVoice = audios[0]
          ? [
              {
                id: 0,
                url: audios[0]
              }
            ]
          : []
      }
    })
  }
  // 回显图片
  private defaultImage: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
  ]
  private defaultScenicImg: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
  ]
  // 公众号二维码
  private defaultQrCode: Array<voiceType> = []
  // 回显视频
  private defaultVideo: Array<videoType> = [
    /*{
                id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561098509967/cc79b43170d504d20c9cf1f84e360a90.mp4",
                imgUrl: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561099755721/微信图片_20190422150111.jpg",
                name: "ad20190513"
            }*/
  ]
  // 回显音频
  private defaultVoice: Array<voiceType> = [
    /*{
                id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561027609568/xxxx.mp3",
                imgUrl: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561099755721/微信图片_20190422150111.jpg",
                name: "ad20190513"
            }*/
  ]
  //图片
  private getImagesList(list: Array<{ id: number }>) {
    this.params.images = list.map((data: any) => data.url || '').join(',')
  }
  //图片
  private getQrCode(list: Array<{ id: number }>) {
    this.params.officialUrl = list.map((data: any) => data.url || '').join(',')
  }
  //景区图片
  private getScenicImages(list: Array<{ id: number }>) {
    this.params.centerImage = list.map((data: any) => data.url || '').join(',')
  }

  //音频
  private getVoiceList(list: Array<{ id: number }>) {
    let allPromise: Array<Promise<any>> = []
    list.forEach((item: any) => {
      if (!item.duration || !/^(\d+|(\d+\.\d+))$/.test(item.duration + '')) {
        // 没得的主动获取音频时长
        let currPromise: Promise<any> = this.getAudioTime(item.url)
        currPromise.then((res: { duration: number }) => {
          item.duration = res.duration
        })
        allPromise.push(currPromise)
      }
    })

    Promise.all(allPromise).finally(() => {
      this.params.audio = list.map((data: any) => data.url || '').join(',')
      this.params.audioTime = list
        .map((data: any) => this.formatSeconds(data.duration) || '')
        .join(',')
    })
  }
  //转换时分秒
  private formatSeconds(value: any) {
    if (value == undefined) {
      value = 0
    }
    let second: any = parseInt(value) // 秒
    let min: any = 0 // 分
    let hour: any = 0 // 小时
    if (second > 60) {
      min = second / 60
      second = second % 60
      if (min > 60) {
        hour = min / 60
        min = min % 60
      }
    }
    let result: any = '' + parseInt(second)
    if (min > 0) {
      result = '' + parseInt(min) + ':' + (result > 9 ? result : '0' + result)
    }
    if (hour > 0) {
      result = '' + parseInt(hour) + ':' + (result > 9 ? result : '0' + result)
    }
    if (min <= 0 && hour <= 0) {
      result = '00:' + (result > 9 ? result : '0' + result)
    }
    return result
  }

  //音频时长
  private getAudioTime(url: string) {
    return new Promise((resolve, reject) => {
      let audio = document.createElement('audio')
      audio.src = url
      audio.addEventListener('loadeddata', function() {
        resolve({
          duration: parseInt(String(this.duration))
        })
      })
      audio.addEventListener('error', function() {
        reject()
      })
    })
  }
  //视频
  private getVideoList(list: Array<{ id: number }>) {
    this.params.videoCover = list
      .map((data: any) => data.imgUrl || '')
      .join(',')
    this.params.video = list.map((data: any) => data.url || '').join(',')
  }
  // 开放时间
  private setOpenTime(e: any) {
    this.params.openTimeStart = e[0]
    this.params.openTimeEnd = e[1]
  }

  private setOpenTimeCenter(e: any) {
    this.params.centerTimeStart = e[0]
    this.params.centerTimeEnd = e[1]
  }
  private setBestTravelTime(e: any) {
    this.params.bestTravelTime = e.join('-')
  }
  //是否收费
  private chargeStatus: boolean = false
  // 经纬度
  private getAddress(e: any) {
    this.params.longitude = e.lnglat.lng
    this.params.latitude = e.lnglat.lat
  }

  private getAddressCenter(e: any) {
    this.params.centerLongitude = e.lnglat.lng
    this.params.centerLatitude = e.lnglat.lat
  }

  // 景区等级选择
  private tagChoice(e: any) {
    this.params.level = e
  }

  private themeChoice(item: any) {
    let _this = this
    if (_this.tagList.indexOf(item.id) !== -1) {
      _this.tagList.map((e: any, i: any) => {
        if (e === item.id) {
          _this.tagList.splice(i, 1)
          _this.params.theme = _this.tagList.join(',')
        }
      })
      return
    }
    if (_this.tagList.length >= 5) {
      _this.$Message.error('您最多可以选择五个标签')
    } else {
      _this.tagList.push(item.id)
    }
    _this.params.theme = _this.tagList.join(',')
  }

  private themePeople(item: any) {
    let _this = this
    if (_this.peopleList.indexOf(item.id) !== -1) {
      _this.peopleList.map((e: any, i: any) => {
        if (e === item.id) {
          _this.peopleList.splice(i, 1)
          _this.params.crowd = _this.peopleList.join(',')
        }
      })
      return
    }
    if (_this.peopleList.length >= 3) {
      _this.$Message.error('您最多可以选择三个标签')
    } else {
      _this.peopleList.push(item.id)
    }
    _this.params.crowd = _this.peopleList.join(',')
  }

  // 标签
  private checkedParams(type: Number) {
    // 名称
    ;(this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error('请将必填项填写正确！')
        return
      }
      this.submitScenic(type)
    })
  }

  private checkedRegions() {
    ;(this.$refs.params as any).validateField('region')
  }

  // 景区主题
  getThemeTagIds(value: any) {
    this.params.theme = value
  }

  getCrowdTagIds(value: any) {
    this.params.crowd = value
  }

  // 提交表单
  private submitScenic(type: Number) {
    let _this = this
    //预订地址 设置status(1:选中<启用> 2:未选中<禁用>)
    this.orderList.forEach((item: any) => {
      if (item && item.createTime) delete item.createTime
      if (item && item.updateTime) delete item.updateTime
      if (item && item.status)
        item.status =
          item && item.orderType == _this.saveOrderAddressType ? 1 : 2
    })
    ;(_this.params as any).orderAddressManage = JSON.stringify(_this.orderList) //预订地址
    ;(_this.params as any).orderAddressType = _this.saveOrderAddressType //预订地址单选状态
    ;(_this.params as any).status = type //4待审核 3草稿
    let ptNum: any = []
    ptNum = _this.orderList
      .map((item: any) => {
        if (item && item.orderType == 'pt') {
          return item
        }
      })
      .filter((item: any) => {
        return item
      })
    if ((_this.params as any).orderAddressType === 'pt' && ptNum.length < 1) {
      this.$Message.error('请添加第三方平台预订地址')
      return
    }
    if (!this.params.images.length) {
      this.$Message.error('请上传景区介绍的景区图片')
      return
    }
    if (type === 4) {
      let config: ModalConfig = {
        title: '操作提示',
        content: `请确认非必填资料是否完整，是否确认提交?`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          _this.save()
        }
      }
      _this.$Modal.confirm(config)
    } else {
      _this.save()
    }
  }
  save() {
    saveScenic(this.params).then(data => {
      if (data.code === 0) {
        this.$Message.success('保存成功!')
        let path =
          this.$store.state.app.userInfo.dataType === 'SITE' &&
          !this.$route.query.id
            ? -3
            : -1
        this.$router.go(path)
      }
    })
  }
  // 手机号
  private checkedPhone(rule: any, value: any, callback: any) {
    if (value) {
      if (!validate(value, 'phone')) {
        return callback(new Error('号码填写错误'))
      }
      callback()
    }
    callback()
  }

  private checkedRegion(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error('请将信息填写完整'))
    }
    callback()
  }

  //地区编码
  getRegion(data: any) {
    this.params.region = data.region
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 0 15px 15px;
  overflow: hidden;
}

.small {
  display: inline-block;
  vertical-align: middle;
}

.table {
  width: 100%;
  border: 1px solid $borderLight;
  border-top: none;
  td {
    border-top: 1px solid $borderLight;
  }
  .write {
    max-width: 60%;
  }
}

.choice-tag {
  display: inline-block;
  min-width: 60px;
  padding: 0 12px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  text-align: center;
  color: #999;
  margin: 0 16px 16px 0;
  border: 1px solid #e2e2e2;
  vertical-align: top;
  background: none;
  &:hover,
  &.active {
    color: #5ac858;
    border-color: #5ac858;
  }
}

.control {
  width: 300px !important;
}
.control-textarea {
  width: 600px !important;
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
  }
}

.tab-container {
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

.select {
  border: 1px solid $borderLight;
  height: 30px;
  line-height: 30px;
  width: 150px;
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

.list-item {
  padding: 10px;
  .col {
    width: 20%;
  }
  .logo {
    display: inline-block;
    width: 50px;
    height: 30px;
  }
  .uploadLogo {
    position: relative;
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      opacity: 0;
    }
  }
}

.no-bottom {
  margin-bottom: 4px;
}

.img {
  display: inline-block;
  width: 90px;
  height: 60px;
  margin: 5px 0;
  overflow: hidden;
  vertical-align: middle;
}

.table {
  .img-box {
    width: 88px !important;
    height: 58px !important;
  }
}

.action-btn {
  cursor: pointer;
  margin: 0 5px;
  cursor: pointer;
}
</style>
