<template>
  <!-- 场所 - 文化场馆 - 添加场馆 -->
  <div class="container">
    <!-- 进度条 -->
    <ul class="header-goods">
      <li class="active">
        <em class="demo2"></em>
        <span class="demo1 hasNo"></span>
        <span>1.选择类型</span>
      </li>
      <li>
        <em class="demo2 noRightM"></em>
        <span>2.添加详情</span>
      </li>
    </ul>
    <Form class="mt20" ref="params" :label-width="110" :model="params" :rules="ruleValidate">
      <!--tab切换-->
      <Tabs active-key="key2" class="tab-wrap" :animated="false" type="line">
        <!--基础资料-->
        <Tab-pane label="基本资料" key="key1">
          <FormItem label="场馆类型：" class="mt20" prop="type">
            <span>{{ typeName }}</span>
          </FormItem>
          <FormItem class="formItem" label="创建者：">
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
          <FormItem label="场馆名称：" prop="name">
            <Input
              type="text"
              class="control"
              v-model="params.name"
              placeholder="场馆名称"
            />
          </FormItem>
          <FormItem
            label="场馆等级："
            class="mt20"
            prop="venueLevel"
            v-if="levelList && levelList.length"
          >
            <span
              class="choice-tag"
              :class="params.venueLevel == item.value ? 'active' : ''"
              v-for="(item, index) in levelList"
              :key="item.id"
              @click="handleTags(item, 'venueLevel')"
              >{{ item.name }}</span
            >
          </FormItem>
          <FormItem label="开放时间：" class="mt20" prop="openWeek">
            <!-- <RadioGroup v-model="setRule">
              <Radio label="通用规则"></Radio>
              <Radio label="分别设置"></Radio>
            </RadioGroup> -->
            <div class="date-item" v-if="setRule === '通用规则'">
              <TimePicker
                type="timerange"
                format="HH:mm"
                confirm
                class="time"
                :editable="false"
                placement="bottom-start"
                placeholder="请选择时间段"
                v-model="time"
              ></TimePicker>
              <Input
                class="control ml10"
                v-model="remarks"
                :maxlength="50"
                placeholder="备注信息"
              />
            </div>
            <!--分别设置时间段-->
            <div class="setDifferent mt10" v-else>
              <!--周一至周日切换-->
              <ul class="clearfix tab-wrap">
                <li
                  class="fl tab-name"
                  v-for="(item, index) in openWeek.week"
                  :key="index"
                  :class="index === activedIndex ? 'active' : ''"
                  @click="changeTab(index)"
                >
                  {{ item.name }}
                </li>
              </ul>
              <!--时间段输入-->
              <div class="set-content mt20">
                <div
                  class="date-item"
                  :class="index"
                  v-if="index === activedIndex"
                  v-for="(item, index) in openWeek.week"
                  :key="index"
                >
                  <TimePicker
                    type="timerange"
                    format="HH:mm"
                    confirm
                    :editable="false"
                    class="time"
                    placement="bottom-start"
                    placeholder="请选择时间段"
                    v-model="item.time"
                  ></TimePicker>
                  <Input
                    class="control ml10"
                    v-model="item.remarks"
                    placeholder="备注信息"
                  />
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem label="最大服务人数：" class="mt20" prop="maxNum">
            <number
              :precision="0"
              :maxlength="99999"
              :min="0"
              placeholder="请填写最大服务人数"
              class="control"
              v-model="params.maxNum"
            ></number>
          </FormItem>
          <FormItem label="服务电话：" class="mt20" prop="phone">
            <phone v-model="params.phone" class="control"></phone>
          </FormItem>
          <!-- 博物馆、烈士陵园/纪念馆、美术馆、艺术馆 、体育馆-->
          <FormItem
            label="是否收费"
            v-if="
              $route.query.dictType == 'museum' ||
                $route.query.dictType == 'memorial' ||
                $route.query.dictType == 'gymnasium' ||
                $route.query.dictType == 'artGallery' ||
                $route.query.dictType == 'gallery'
            "
          >
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
          <FormItem label="收费规则：" class="mt20" v-if="chargeStatus">
            <Input
              class="control"
              :maxlength="200"
              placeholder="收费规则"
              v-model="params.payRule"
            />
          </FormItem>
          <FormItem label="建议游玩时长：">
            <number
              :precision="0"
              :maxlength="2"
              :min="0"
              placeholder="这里填写纯数字,单位小时"
              class="ml10 w150"
              v-model="params.suggestedHour"
            ></number
            >小时
          </FormItem>
          <FormItem label="所在地区：" class="mt20" prop="region">
            <distPicker
              :default="regionPath"
              @onChange="getRegion"
            ></distPicker>
            <Input
              class="control"
              :maxlength="100"
              placeholder="详细地址"
              v-model="params.address"
            />
          </FormItem>
          <FormItem label="" class="mt20" prop="longitude">
            <div>
              <mapMarker
                id="map"
                :region="params.region"
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
          <!-- <FormItem label="资源互通编码：" class="mt20">
            <Input
              class="control"
              :maxlength="200"
              placeholder="资源互通编码"
              v-model="params.resourceCode"
            />
          </FormItem> -->
          <!--<FormItem label="排序：" class="mt20" v-if="$store.state.app.userInfo.dataType == 'SITE'">-->
          <!--<InputNumber :min="1" :max="999" :precision="0"  class="control" placeholder="排序" v-model="params.sort"></InputNumber>-->
          <!--</FormItem>-->
          <!--个性标签-->
          <div class="tips-panel clearfix">
            <span class="fl title">个性标签</span>
            <p class="fl tag-content">
              真实的选择个性信息，让游客更好了解景区。
            </p>
          </div>
          <FormItem label="场馆标签：" class="mt20">
            <Tags
              resourceType="CONTENT_TYPE_VENUE"
              labelType="VENUES_THEME"
              limit="5"
              :defaultIds="params.tag"
              @onChange="getThemeTagIds"
            ></Tags>
          </FormItem>
          <!-- 美术馆、剧院、体育馆需要展示适合人群 -->
          <FormItem
            label="适合人群："
            class="mt20"
            v-if="
              $route.query.dictType == 'gallery' ||
                $route.query.dictType == 'artGallery' ||
                $route.query.dictType == 'theater' ||
                $route.query.dictType == 'gymnasium'
            "
          >
            <Tags
              resourceType="CONTENT_TYPE_VENUE"
              labelType="SUITABLE_FOR_PEOPLE"
              limit="3"
              :defaultIds="params.crowd"
              @onChange="getCrowdTagIds"
            ></Tags>
          </FormItem>
        </Tab-pane>

        <!--场馆介绍-->
        <Tab-pane
          :label="
            $route.query.dictType == 'culturalStation'
              ? '场馆介绍(免费开放项目)'
              : '场馆介绍'
          "
          key="key2"
          class="item"
        >
          <FormItem label="场馆图片：" prop="images">
            <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.images"></uploadImg>-->
            <uploadImg
              :defaultImage="defaultImage"
              @getImagesList="getImagesList"
              :limit="9"
            ></uploadImg>
          </FormItem>
          <FormItem label="语音介绍：" class="mt20">
            <!--<uploadAudio :limit="5" @getAudioList="getAudioList" @getAudioTime="getAudioTime" :defaultAudio="params.audio"></uploadAudio>-->
            <uploadAudio
              :defaultVoice="defaultVoice"
              @getVoiceList="getVoiceList"
              :limit="5"
            ></uploadAudio>
          </FormItem>
          <FormItem label="视频：" class="mt20">
            <!--<uploadVideo :limit="1" @getVideoList="getVideoList" :maxlength="1" :defaultVideo="params.video" :cover="params.videoCover" ></uploadVideo>-->
            <uploadVideo
              :defaultVideo="defaultVideo"
              @getVideoList="getVideoList"
              :limit="1"
            ></uploadVideo>
          </FormItem>
          <FormItem label="720全景：" class="mt20">
            <Input
              class="control"
              :maxlength="150"
              v-model="params.panoramaUrl"
              placeholder="请输入720全景地址"
            />
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
              >注：可添加场馆已有的可用于正常识别的公众号二维码图片，仅一张</span
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
          <!-- library:图书馆 -->
          <FormItem
            label="在线阅读图片"
            v-if="$route.query.dictType == 'library'"
          >
            <uploadImg
              :defaultImage="defaultReadingImg"
              @getImagesList="getReadingImg"
              :limit="1"
            ></uploadImg>
          </FormItem>
          <FormItem
            label="在线阅读公众号"
            class="mt20"
            v-if="$route.query.dictType == 'library'"
          >
            <Input
              class="control"
              :maxlength="100"
              v-model="params.onlineReadingOfficialName"
              placeholder="请输入在线阅读公众号名称"
            />
          </FormItem>
          <FormItem label="场馆概述：" class="mt20">
            <Input
              class="control"
              :maxlength="20"
              v-model="params.briefing"
              placeholder="一句话描述场馆特点"
            />
            <span class="note ml10"
              >注：场馆概述用于用户端场馆列表页及场馆详情页展示。最多20个汉字。</span
            >
          </FormItem>
          <FormItem label="场馆简介：" class="mt20">
            <Input
              class="control"
              :maxlength="100"
              v-model="params.summary"
              placeholder="请输入场馆简介"
            />
          </FormItem>
          <FormItem label="场馆介绍：" class="mt20">
            <div class="uedit">
              <ueditor v-model="params.introduce" id="venues_uedit"></ueditor>
            </div>
          </FormItem>
        </Tab-pane>

        <!--交通信息-->
        <Tab-pane label="交通信息" key="key3" class="item">
          <FormItem label="交通信息：" class="mt20">
            <div class="uedit">
              <ueditor
                v-model="params.trafficInfo"
                id="venues_uedit1"
              ></ueditor>
            </div>
          </FormItem>
        </Tab-pane>
      </Tabs>

      <FormItem label class="submit">
        <Button type="primary" @click="handleSubmit(4)">提交</Button>
        <Button
          class="ml20"
          type="primary"
          @click="handleSubmit(3)"
          v-if="isEdit"
          >存草稿</Button
        >
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import mapMarker from '@components/map/marker.vue'
// import uploadVideo from "@components/upload/upload-video.vue";
// import uploadAudio from "@components/upload/upload-audio.vue";
// import uploadImg from "@components/upload/upload-image.vue";
import uploadImg from '@components/upload/upload-image2.vue'
import uploadVideo from '@components/upload/upload-video2.vue'
import uploadAudio from '@components/upload/upload-voice.vue'
import ueditor from '@components/ueditor/ueditor.vue'
import distPicker from '@components/distPicker/distPicker.vue'
import Tags from '@components/tags/tags.vue'
import { saveVenue, venueView } from '@service/place'
import { getTags, saveTags, deleteTag, dictType } from '@service/common'
import { createrList } from '@service/content'
import { ModalConfig } from 'iview/types'
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
    uploadVideo,
    uploadAudio,
    uploadImg,
    ueditor,
    Tags,
    distPicker //地区插件
  }
})
export default class edit extends Vue {
  private setRule: string = '通用规则'
  @Watch('setRule')
  //设置开放时间段
  getSetRule() {
    if (this.setRule === '通用规则') {
      this.openWeek.setType = 0
    } else {
      this.openWeek.setType = 1
    }
  }
  private activedIndex: number = 0

  //分别设置时间
  private openWeek: any = {
    setType: 0,
    week: [
      {
        name: '周一',
        time: [],
        remarks: ''
      },
      {
        name: '周二',
        time: [],
        remarks: ''
      },
      {
        name: '周三',
        time: [],
        remarks: ''
      },
      {
        name: '周四',
        time: [],
        remarks: ''
      },
      {
        name: '周五',
        time: [],
        remarks: ''
      },
      {
        name: '周六',
        time: [],
        remarks: ''
      },
      {
        name: '周日',
        time: [],
        remarks: ''
      }
    ]
  }
  //通用时间
  private time: Array<object> = []
  private remarks: string = ''
  //场馆类型
  private levelList: Array<object> = []
  //保存参数
  private params: any = {
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    name: '', //场馆名称
    type: -1, //场馆类型
    venueLevel: '', //场馆等级
    region: '', //地区编码
    address: '', //详细地址
    phone: '', //电话号码
    payRule: '', //收费规则
    resourceCode: '', //资源互通编码
    // sort: 999,//排序
    tag: '', //标签
    crowd: '', //人群
    longitude: '', //经度
    latitude: '', //纬度
    images: '', //图片集地址
    audio: '', //音频集地址
    audioTime: '', //音频时长
    video: '', //视频地址
    videoCover: '', //视频封面图
    panoramaUrl: '', //720地址
    summary: '', //场馆简介
    briefing: '', //场馆概述
    introduce: '', //场馆介绍
    trafficInfo: '', //交通信息
    suggestedHour: 4, //建议游玩时长
    openWeek: JSON.stringify(this.openWeek), //开放时间
    status: 4, //4待审核  3 草稿
    saveType: 'list', //list 列表编辑，audit 审核编辑
    officialName: '', //官网名称
    officialUrl: '', //二维码地址
    websiteUrl: '', //官网地址
    onlineReadingImage: '', //在线阅读图片
    onlineReadingOfficialName: '', //在线阅读公众号
    maxNum: '', //最大服务人数
    ticketPolicy: '', //门票政策
    chargeStatus: '' // 是否收费1 收费 0不收费
  }
  //是否收费
  private chargeStatus: boolean = false
  //地区编码
  private regionPath: string = ''
  //验证
  private ruleValidate: any = {
    name: [
      { required: true, message: '场馆名称不能为空', trigger: 'blur' },
      { type: 'string', max: 100, message: '最多输入100个字符' }
    ],
    type: [{ required: true, message: '场馆类型必选' }],
    region: [
      { required: true, message: '请选择所在地区', trigger: 'blur' },
      { validator: this.regionAddress, trigger: 'blur' }
    ],
    longitude: [{ required: true, message: '请选择经纬度' }],
    images: [{ required: true, message: '请上传场馆图片' }],
    websiteUrl: [{ validator: this.validWebsiteUrl, trigger: 'blur' }],
    phone: [
      {
        required: true,
        min: 11,
        message: '请填写正确的联系电话',
        trigger: 'blur'
      }
    ],
    maxNum: [
      { required: true, message: '请填写最大服务人数', trigger: 'blur' }
    ],
    venueLevel: [{ required: true, message: '请选择场馆等级' }],
    openWeek: [
      { required: true, validator: this.validOpenTime, trigger: 'blur' }
    ]
  }
  //开放时间
  validOpenTime(rule: any, value: any, callback: any) {
    if (!this.params.openWeek) {
      callback(new Error('请填写开放时间'))
    } else {
      callback()
    }
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
  //验证region和详情地址
  regionAddress(rule: any, value: any, callback: any) {
    if (!this.params.address) {
      callback(new Error('请将地区信息填写完整'))
    } else {
      callback()
    }
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
  //切换开放时间
  changeTab(index: number) {
    this.activedIndex = index
  }

  //获取地区region
  getRegion(data: any) {
    ;(this.params as any).region = data.region
  }
  //提交
  handleSubmit(status: number) {
    let _this = this
    //判断开放时间
    if (_this.openWeek.setType === 0) {
      _this.openWeek.week.forEach((item: any) => {
        item.time = _this.time
        item.remarks = _this.remarks
      })
    }
    //判断是否输入开放时间
    let count = 0
    _this.openWeek.week.forEach((item: any) => {
      if (!item.time[0] && !item.time[1]) {
        count += 1
      }
    })
    _this.params.openWeek = count === 7 ? '' : JSON.stringify(this.openWeek) //开放时间 count=7 则是7个空的时间段（未填入时间段）
    _this.params.status = status //状态 4待审核  3 草稿
    //验证并保存
    ;(_this.$refs.params as any).validate((valid: any) => {
      if (valid) {
        if (status === 4) {
          let config: ModalConfig = {
            title: '操作提示',
            content: `请确认基本资料、场馆介绍、交通信息是否已完善，是否确认提交?`,
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
      } else {
        _this.$Message.error('请将必填项填写正确!')
      }
    })
  }
  save() {
    saveVenue(this.params).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success('保存成功')
        this.$router.push({ path: '/venues-list' })
      }
    })
  }
  //取消
  goBack() {
    this.$router.go(-1)
  }

  //场馆类型/等级标签
  handleTags(item: any, type: any) {
    this.params[type] = type == 'type' ? item.id : item.value
  }
  //场馆主题标签
  getThemeTagIds(value: any) {
    this.params.tag = value
  }
  //适用人群标签
  getCrowdTagIds(value: any) {
    this.params.crowd = value
  }
  //经纬度
  getLongLat(e: any) {
    this.params.longitude = e.lnglat.lng
    this.params.latitude = e.lnglat.lat
  }
  // 回显图片
  private defaultImage: Array<imgType> = []
  private defaultIcon: Array<imgType> = []
  // 回显视频
  private defaultVideo: Array<videoType> = []
  // 回显音频
  private defaultVoice: Array<voiceType> = []
  // 公众号二维码
  private defaultQrCode: Array<voiceType> = []
  //在线阅读图片
  private defaultReadingImg: Array<voiceType> = []
  //图片
  private getImagesList(list: Array<{ id: number }>) {
    this.params.images = list.map((data: any) => data.url || '').join(',')
  }
  //公众号二维码图片
  private getQrCode(list: Array<{ id: number }>) {
    this.params.officialUrl = list.map((data: any) => data.url || '').join(',')
  }
  //公众号二维码图片
  private getReadingImg(list: Array<{ id: number }>) {
    this.params.onlineReadingImage = list
      .map((data: any) => data.url || '')
      .join(',')
  }
  //音频
  private getVoiceList(list: Array<{ id: number }>) {
    // this.params.audio = list.map((data: any) => (data.url || '')).join(',')
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
  // 获取本地音频时长
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
  //获取场馆类型
  typeName: string = ''
  getVenueType() {
    let _this = this
    dictType({ type: 'VENUE_TYPE' }).then((res: any) => {
      if (res.code === 0) {
        res.datas.forEach((item: any) => {
          if (item.value == this.$route.query.dictType) {
            _this.params.type = item.id
            _this.typeName = item.name
          }
        })
      }
    })
  }
  //获取场馆等级
  getVenueLevel() {
    let _this = this
    dictType({ type: `${this.$route.query.dictType}_level` }).then(
      (res: any) => {
        if (res.code === 0) {
          _this.levelList = res.datas
        }
      }
    )
  }

  //获取详情
  getVenueView(id: any) {
    let _this = this
    venueView({ id: id }).then((res: any) => {
      _this.params = res.data.ctcVenue
      _this.isEdit = res.data.ctcVenue.status == 3 //当前是草稿编辑 就显示存草稿按钮
      this.chargeStatus = res.data.ctcVenue.chargeStatus ? true : false
      this.typeName = res.data.ctcVenue.typeName;
      //开放时间段
      _this.openWeek = res.data.ctcVenue.openWeek
        ? JSON.parse(res.data.ctcVenue.openWeek)
        : _this.openWeek
      _this.setRule = _this.openWeek.setType == 1 ? '分别设置' : '通用规则'
      _this.time = _this.openWeek.week[0].time
      _this.remarks = _this.openWeek.week[0].remarks
      //地区编码
      _this.regionPath = res.data.sysRegion.scort
      _this.params.region = res.data.sysRegion.region
      //移除不需要的字段
      delete (_this.params as any).createTime
      delete (_this.params as any).updateTime
      // 判断createCompany是否为空 为空就默认为-1
      this.params.createCompany = this.params.createCompany || -1
      _this.params.saveType = _this.$route.query.type

      //图片回显
      let imgs = _this.params.images.split(',')
      if (imgs.length > 1) {
        imgs.forEach((item: any, index: number) => {
          _this.defaultImage.push({
            id: index,
            url: item
          })
        })
      } else {
        _this.defaultImage = imgs[0]
          ? [
              {
                id: 0,
                url: imgs[0]
              }
            ]
          : []
      }
      //公众号二维码图片
      _this.defaultQrCode = this.params.officialUrl
        ? [{ id: 0, url: this.params.officialUrl }]
        : []
      //在线阅读图片
      _this.defaultReadingImg = this.params.onlineReadingImage
        ? [{ id: 0, url: this.params.onlineReadingImage }]
        : []
      //视频回显
      let videos = _this.params.video.split(',')
      let videoCovers = _this.params.videoCover.split(',')
      if (videos.length > 1) {
        videos.forEach((item: any, index: number) => {
          _this.defaultVideo.push({
            id: index,
            url: item,
            imgUrl: videoCovers[index]
          })
        })
      } else {
        _this.defaultVideo = videos[0]
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
      let audios = _this.params.audio.split(',')
      if (audios.length > 1) {
        audios.forEach((item: any, index: number) => {
          _this.defaultVoice.push({
            id: index,
            url: item
          })
        })
      } else {
        _this.defaultVoice = audios[0]
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
  private isEdit: boolean = true
  mounted() {
    let _this = this
    _this.getVenueType() //场馆类型数据
    _this.getVenueLevel() //场馆等级数据
    //修改页面id
    if (_this.$route.query.id) {
      _this.params.id = _this.$route.query.id
      _this.getVenueView(_this.params.id)
    }
    _this.getCreaterList()
  }
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
          content: '';
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
</style>
