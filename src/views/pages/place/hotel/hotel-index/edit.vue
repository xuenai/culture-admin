<template>
  <div class="tab-container">
    <!--tab切换-->
    <Form
      ref="formInline"
      :label-width="100"
      :model="params"
      :rules="ruleValidate"
    >
      <Tabs
        active-key="key2"
        class="mt20 tab-wrap"
        :animated="false"
        type="line"
      >
        <!--基础资料-->
        <Tab-pane label="基本资料" key="key1">
          <FormItem label="酒店名称：" prop="name">
            <Input
              type="text"
              class="control"
              v-model="params.name"
              placeholder="酒店名称"
            />
          </FormItem>
          <FormItem label="酒店等级：" class="mt20">
            <span
              class="choice-tag"
              :class="levelList.indexOf(item.name) !== -1 ? 'active' : ''"
              v-for="(item, index) in level"
              :key="item.id"
              @click.stop="getlevelTags(item.name, index)"
              >{{ item.name }}</span
            >
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
          <FormItem label="所在地区：" class="mt20" prop="region">
            <distPicker
              :default="regionPath"
              @onChange="getRegion"
            ></distPicker>
            <!-- <distPicker :default="'120000,120102,'" @onChange="getRegion"></distPicker> -->
          </FormItem>
          <FormItem label="详细地址：" class="mt20" prop="address">
            <Input
              class="control"
              placeholder="详细地址"
              v-model="params.address"
            />
          </FormItem>
          <FormItem label="入住时间：" class="mt20">
            <TimePicker
              type="time"
              class="control"
              format="HH:mm"
              :editable="false"
              v-model="params.checkInTime"
              placement="bottom-start"
              confirm
              placeholder="请选择入住时间"
            ></TimePicker>
          </FormItem>
          <FormItem label="退房时间：" class="mt20">
            <TimePicker
              type="time"
              class="control"
              format="HH:mm"
              :editable="false"
              v-model="params.checkOutTime"
              placement="bottom-start"
              confirm
              placeholder="请选择退房时间"
            ></TimePicker>
          </FormItem>
          <FormItem label="服务电话：" class="mt20">
            <phone v-model="params.phone" class="control"></phone>
          </FormItem>
          <FormItem label="开业时间：" class="mt20">
            <DatePicker
              type="month"
              class="control"
              :editable="false"
              @on-change="getOpenYear"
              :value="params.openYear"
              placement="bottom-start"
              placeholder="请选择年月"
            ></DatePicker>
          </FormItem>
          <FormItem label="最近装修：" class="mt20">
            <DatePicker
              type="month"
              class="control"
              :editable="false"
              @on-change="getDecorationTime"
              :value="params.decorationTime"
              placement="bottom-start"
              placeholder="请选择年月"
            ></DatePicker>
          </FormItem>
          <FormItem label="房间数：" class="mt20">
            <number
              :precision="0"
              class="control"
              :min="1"
              :max="9999"
              placeholder="房间数"
              v-model="params.roomNum"
            />
          </FormItem>
          <!--<FormItem label="资源互通编码：" class="mt20">-->
          <!--<Input class="control" :maxlength="100" placeholder="资源互通编码" v-model="params.resourceCode"/>-->
          <!--</FormItem>-->
          <!--<FormItem label="排序：" class="mt20" v-if="$store.state.app.userInfo.dataType == 'SITE'">-->
          <!--<InputNumber :precision="0" class="control" :min="1" :max="999" placeholder="排序"-->
          <!--v-model="params.sort"/>-->
          <!--</FormItem>-->
          <!--个性标签-->
          <div class="tips-panel clearfix">
            <p class="fl title">个性标签</p>
            <p class="fl tag-content">
              真实的选择个性信息，让游客更好了解酒店。
            </p>
          </div>
          <FormItem label="酒店类型：" class="mt20">
            <Tags
              resourceType="CONTENT_TYPE_HOTEL"
              labelType="HOTEL_TYPE"
              limit="3"
              :defaultIds="params.type"
              @onChange="getTypeTagIds"
            ></Tags>
          </FormItem>
          <FormItem label="酒店设施：" class="mt20">
            <Tags
              resourceType="CONTENT_TYPE_HOTEL"
              labelType="HOTEL_FACILITIES"
              limit="5"
              :defaultIds="params.hotelEqtTag"
              @onChange="getEqtTagIds"
            ></Tags>
          </FormItem>
          <FormItem label="特色服务：" class="mt20" prop="crowd">
            <Tags
              resourceType="CONTENT_TYPE_HOTEL"
              labelType="SPECIAL_SERVICE"
              limit="5"
              :defaultIds="params.feature"
              @onChange="getFeatureTagIds"
            ></Tags>
          </FormItem>
          <FormItem label="酒店位置：" class="mt20" prop="longitude">
            <div>
              <mapMarker
                id="map1"
                @getAddress="getLongLat"
                :region="params.region"
                :address="
                  params.id && params.longitude && params.latitude
                    ? [params.longitude, params.latitude]
                    : ''
                "
              ></mapMarker>
              <Input type="text" v-model="params.longitude" v-show="false" />
            </div>
          </FormItem>
        </Tab-pane>
        <!--酒店介绍-->
        <Tab-pane label="酒店介绍" key="key2" class="item">
          <FormItem label="酒店图片：" class="mt20" prop="images">
            <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.images"></uploadImg>-->
            <uploadImg
              :defaultImage="defaultImage"
              @getImagesList="getImagesList"
              :limit="9"
            ></uploadImg>
          </FormItem>
          <FormItem label="语音介绍：" class="mt20">
            <!--<uploadAudio :limit="5" @getAudioList="getAudioList"  @getAudioTime="getAudioTime" :defaultAudio="params.audio"></uploadAudio>-->
            <uploadAudio
              :defaultVoice="defaultVoice"
              @getVoiceList="getVoiceList"
              :limit="5"
            ></uploadAudio>
          </FormItem>
          <FormItem label="宣传片：" class="mt20">
            <!--<uploadVideo :limit="1" @getVideoList="getVideoList" :defaultVideo="params.video" :cover="params.videoCover"></uploadVideo>-->
            <uploadVideo
              :defaultVideo="defaultVideo"
              @getVideoList="getVideoList"
              :limit="1"
            ></uploadVideo>
          </FormItem>
          <FormItem label="720全景：" class="mt20">
            <Input
              type="text"
              class="control"
              :maxlength="150"
              v-model="params.panoramaUrl"
              placeholder="720全景"
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
              >注：可添加酒店已有的可用于正常识别的公众号二维码图片，仅一张</span
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
          <FormItem label="酒店概述：" class="mt20">
            <Input
              type="text"
              class="control"
              :maxlength="20"
              v-model="params.briefing"
              placeholder="酒店概述"
            />
          </FormItem>
          <FormItem label="酒店简介：" class="mt20">
            <Input
              type="text"
              class="control"
              :maxlength="100"
              v-model="params.summary"
              placeholder="酒店简介"
            />
          </FormItem>
          <FormItem label="酒店介绍：" class="mt20">
            <ueditor v-model="params.introduce" id="hotel_uedit1"></ueditor>
          </FormItem>
        </Tab-pane>
        <!--交通信息-->
        <Tab-pane label="交通信息" key="key3" class="item">
          <FormItem label="交通信息：" class="mt20">
            <ueditor v-model="params.trafficInfo" id="hotel_uedit3"></ueditor>
          </FormItem>
        </Tab-pane>
        <!--预订地址-->
        <Tab-pane label="预订地址" key="key4" class="item pd20">
          <orderAddressTab
            :data="orderAddressData"
            @getData="getOrderAddressManage"
          ></orderAddressTab>
        </Tab-pane>
      </Tabs>
      <FormItem ref="formInline" label class="submit">
        <Button type="primary" @click="save(4)">提交</Button>
        <Button class="ml20" type="primary" @click="save(3)" v-if="isEdit"
          >存草稿</Button
        >
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import mapMarker from '@components/map/marker.vue'
// import uploadVideo from "@components/upload/upload-video.vue";
// import uploadAudio from "@components/upload/upload-audio.vue";
// import uploadImg from "@components/upload/upload-image.vue";
import uploadImg from '@components/upload/upload-image2.vue'
import uploadVideo from '@components/upload/upload-video2.vue'
import uploadAudio from '@components/upload/upload-voice.vue'
import Tags from '@components/tags/tags.vue'
import ueditor from '@components/ueditor/ueditor.vue'
import distPicker from '@components/distPicker/distPicker.vue'
import orderAddressTab from '@pages/place/common/orderAddress.vue'
import { createrList } from '@service/content'
import { ModalConfig } from 'iview/types'
import { dictType } from '@service/common'

import {
  orderAddress,
  saveHotel,
  getHotelView,
  getShopList,
  saveOrderAddress
} from '@service/place'
import { getTags, saveTags, deleteTag } from '@service/common'
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
    distPicker,
    Tags,
    orderAddressTab
  }
})
export default class edit extends Vue {
  // 日期时间限制
  private options: any = {
    disabledDate(date: any) {
      const disabledDay = date.getDate()
      // 限制可选的开始日期及结束日期
      let b =
        date.getTime() < new Date('2018-12-31').getTime() ||
        (date && date.valueOf() > Date.now())
      return b
    }
  }
  /*S 保存*/
  private params: object = {
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    orderAddressManage: '', //预订地址
    id: '', //
    name: '', //名称
    level: '无星级', //等级
    region: '', //地区编码
    address: '', //地址
    checkInTime: '', //入驻时间
    checkOutTime: '', //离店时间
    phone: '', //电话
    openYear: '', //开业时间
    decorationTime: '', //装修时间
    roomNum: '', //房间数量
    resourceCode: '', //资源编码
    hotelEqtTag: '', //酒店设施标签
    type: '', //类型
    feature: '', //特色服务
    longitude: '', //经度
    latitude: '', //纬度
    images: '', //图片集
    audio: '', //音频
    audioTime: '', //音频时长
    video: '', //视频
    videoCover: '', //视频封面图
    summary: '', //简介
    briefing: '', //概述
    panoramaUrl: '', //720全景
    introduce: '', //介绍
    trafficInfo: '', //交信息
    status: 4, //4待审核  3 草稿
    // siteId: '',//站点id
    // orgId: '',//组织机构id
    // sort: 999,//排序
    saveType: 'list', //list 列表编辑，audit 审核编辑
    orderAddressType: 'pt', //预订地址 ds:小电商 pt:门票
    officialName: '', //官网名称
    officialUrl: '', //二维码地址
    websiteUrl: '' //官网地址
  }
  private regionPath: string = ''
  //验证
  private ruleValidate: any = {
    name: [
      { required: true, message: '酒店名称不能为空', trigger: 'blur' },
      { type: 'string', max: 100, message: '最多输入100个字符' }
    ],
    region: [{ required: true, message: '请选择所在地区', trigger: 'blur' }],
    address: [
      { required: true, message: '详细地址不能为空', trigger: 'blur' },
      { type: 'string', max: 100, message: '最多输入100个字符' }
    ],
    longitude: [{ required: true, message: '请选择经纬度' }],
    images:[{required: true, message: '请上传酒店图片'}],
     websiteUrl: [{  validator:this.validWebsiteUrl, trigger: "blur"}],
  }
 //官网地址验证
   validWebsiteUrl(rule: any, value: any, callback: any){
     let reg=/[\u4e00-\u9fa5]+$/;
     if(value&&reg.test(value)){
        callback(new Error('请填写规范的链接地址，不能包含中文'));
     }else{
       callback();
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

  /*S 预订地址*/
  private orderAddressData: object = {
    orderAddressType: 'ds',
    resourceType: 'CONTENT_TYPE_HOTEL'
  }
  private orderList: Array<object> = []
  private saveOrderAddressType = ''

  getOrderAddressManage(data: any) {
    this.saveOrderAddressType = data.orderAddressType
    this.orderList = data.list
  }

  /*E 预订地址*/

  //保存
  save(status: any) {
    let _this = this
    //预订地址 设置status(1:选中<启用> 2:未选中<禁用>)
    this.orderList.forEach((item: any) => {
      if (item&&item.createTime) {
        delete item.createTime
      }
      if (item&&item.updateTime) {
        delete item.updateTime
      }
      if(item&&item.status)item.status = item&&item.orderType == _this.saveOrderAddressType ? 1 : 2
    })
    ;(_this.params as any).orderAddressManage = JSON.stringify(this.orderList) //预订地址
    ;(_this.params as any).orderAddressType = this.saveOrderAddressType //预订地址单选状态
    ;(_this.params as any).status = status //状态 4待审核  3 草稿
    let ptNum: any = []
    ptNum = _this.orderList
      .map((item: any) => {
        if (item&&item.orderType == 'pt') {
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
    ;(this.$refs.formInline as any).validate((valid: any) => {
      if (valid) {
        if (status === 4) {
          let config: ModalConfig = {
            title: '操作提示',
            content: `请确认非必填资料是否完整，是否确认提交?`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              _this.saveRequest()
            }
          }
          _this.$Modal.confirm(config)
        } else {
          _this.saveRequest()
        }
      } else {
        this.$Message.error('请将必填项填写正确!')
      }
    })
  }
  saveRequest() {
    saveHotel(this.params).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success('保存成功')
        this.$router.go(-1)
      }
    })
  }
  //最近装修
  getDecorationTime(date: any) {
    ;(this.params as any).decorationTime = date
  }

  //开放年份
  getOpenYear(date: any) {
    ;(this.params as any).openYear = date
  }

  //返回
  goBack() {
    this.$router.go(-1)
  }

  //经纬度
  getLongLat(e: any) {
    ;(this.params as any).longitude = e.lnglat.lng
    ;(this.params as any).latitude = e.lnglat.lat
  }

  // 回显图片
  private defaultImage: Array<imgType> = [
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
    ;(this.params as any).images = list
      .map((data: any) => data.url || '')
      .join(',')
  }
  //图片
  private getQrCode(list: Array<{ id: number }>) {
    ;(this.params as any).officialUrl = list
      .map((data: any) => data.url || '')
      .join(',')
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
      ;(this.params as any).audio = list
        .map((data: any) => data.url || '')
        .join(',')
      ;(this.params as any).audioTime = list
        .map((data: any) => this.formatSeconds(data.duration) || '')
        .join(',')
    })
  }
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
    ;(this.params as any).video = list
      .map((data: any) => data.url || '')
      .join(',')
    ;(this.params as any).videoCover = list
      .map((item: any) => item.imgUrl || '')
      .join(',')
  }

  //获取地区region
  getRegion(data: any) {
    ;(this.params as any).region = data.region
  }

  //特色服务标签
  getFeatureTagIds(value: any) {
    ;(this.params as any).feature = value
  }

  //设施标签
  getEqtTagIds(value: any) {
    ;(this.params as any).hotelEqtTag = value
  }

  //设施标签
  getTypeTagIds(value: any) {
    ;(this.params as any).type = value
  }

  //酒店等级
  private level: any = [
    '无星级',
    '五星级',
    '四星级',
    '三星级',
    '二星级',
    '一星级',
    '金树叶级绿色饭店',
    '银树叶级绿色饭店',
    '金鼎级文化主题旅游饭店',
    '银鼎级文化主题旅游饭店',
    '三星级农家乐',
    '四星级农家乐',
    '五星级农家乐',
    '一级主题饭店',
    '二级主题饭店',
    '三级主题饭店',
    '四级主题饭店',
    '五级主题饭店',
  ]
  private levelList: any = ['无星级']
  private levelIndex: any = [0]
  getlevelTags(value: string, index: any) {
    if (this.levelList.indexOf(value) == -1) {
      this.levelList.push(value)
    } else {
      this.levelList.forEach((item: any, index: number) => {
        if (item === value) {
          this.levelList.splice(index, 1)
        }
      })
    }
    ;(this.params as any).level = this.levelList.toString();
  }

  /*E 保存*/

  /*S 详情*/
  //是否是修改
  private isEdit: boolean = true

  getHotelDesc(id: any) {
    let _this = this
    getHotelView({ id: id }).then((res: any) => {
      if (res.code === 0) {
        _this.params = res.data.ctcHotel;
        _this.levelList = res.data.ctcHotel.level.split(',');
        _this.isEdit = res.data.ctcHotel.status == 3;
        _this.regionPath = res.data.sysRegion.scort;
        ;(this.params as any).region = res.data.sysRegion.region;
        delete (_this.params as any).createTime;
        delete (_this.params as any).updateTime;
        ;(_this.params as any).saveType = _this.$route.query.type;

        //预订地址radio 默认值
        ;(_this.orderAddressData as any).orderAddressType =
          res.data.ctcHotel.orderAddressType
        //图片回显
        let imgs = (_this.params as any).images.split(',')
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
        //公众号二维码
        _this.defaultQrCode = (_this.params as any).officialUrl
          ? [{ id: 0, url: (_this.params as any).officialUrl }]
          : []
        //视频回显
        let videos = (_this.params as any).video.split(',')
        let videoCovers = (_this.params as any).videoCover.split(',')
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
        let audios = (_this.params as any).audio.split(',')
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
      }
    })
  }

  /*E 详情*/

  created() {
    let _this = this
    this.getLevel();
    //编辑页面
    if (_this.$route.query.id) {
      _this.getHotelDesc(_this.$route.query.id)
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

.table {
  .img-box {
    width: 88px !important;
    height: 58px !important;
  }
}
</style>
<style lang="scss" scoped>
.tab-container {
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
  .label {
    float: left;
    line-height: 68px;
  }
}
</style>
