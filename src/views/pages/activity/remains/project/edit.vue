<template>
  <!-- 发现 - 非遗项目 - 添加非遗项目 -->
  <div class="tab-container">
    <Form ref="params" :label-width="130" :model="params" :rules="ruleValidate">
      <!--tab切换-->
      <Tabs active-key="key2" class="tab-wrap" :animated="false" type="line">
        <!--基础资料-->
        <TabPane label="基本资料" key="key1">
          <FormItem class="formItem" label="创建者" prop="createCompany">
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
          <FormItem label="非遗项目名称：" prop="name">
            <Input
              type="text"
              class="control"
              v-model="params.name"
              placeholder="请填写非遗项目名称"
            />
          </FormItem>
          <FormItem label="类别：" class="mt20" prop="type">
            <span
              class="choice-tag"
              :class="params.type == item.id ? 'active' : ''"
              v-if="item.pid"
              v-for="(item, index) in type"
              :key="index"
              @click="handleTags(item, 'type')"
              >{{ item.name }}</span
            >
            <Input type="text" v-model="params.type" v-show="false" />
          </FormItem>
          <FormItem label="级别：" class="mt20" prop="level">
            <span
              class="choice-tag"
              :class="
                params.level == item.id || levels.indexOf(item.id) !== -1
                  ? 'active'
                  : ''
              "
              v-if="item.pid"
              v-for="(item, index) in level"
              :key="index"
              @click="handleTags(item, 'level')"
              >{{ item.name }}</span
            >
            <Input type="text" v-model="params.level" v-show="false" />
          </FormItem>
          <FormItem label="批次：" class="mt20" prop="batch">
            <span
              class="choice-tag"
              :class="params.batch == item.id ? 'active' : ''"
              v-if="item.pid"
              v-for="(item, index) in batch"
              :key="index"
              @click="handleTags(item, 'batch')"
              >{{ item.name }}</span
            >
            <Input type="text" v-model="params.batch" v-show="false" />
          </FormItem>
          <FormItem label="申报地区：" class="mt20" prop="reportRegion">
            <distPicker
              :default="regionPath"
              @onChange="getRegion"
            ></distPicker>
          </FormItem>
          <FormItem label="申报单位" class="mt20" prop="reportCompany">
            <Input
              class="control"
              placeholder="请填写申报单位"
              v-model="params.reportCompany"
            />
          </FormItem>
          <FormItem label="项目编号" class="mt20">
            <span class="reportCode">{{ typeName }}</span> -
            <number
              class="control"
              :precision="0"
              :min="1"
              :max="999999999"
              placeholder="请填写项目编号"
              v-model="reportCode"
            />
          </FormItem>
        </TabPane>

        <!--非遗介绍-->
        <TabPane label="非遗介绍" key="key2" class="item">
          <FormItem label="图片：" prop="images">
            <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.images"></uploadImg>-->
            <uploadImg
              :defaultImage="defaultImage"
              @getImagesList="getImagesList"
              :limit="9"
            ></uploadImg>
          </FormItem>
          <FormItem label="语音介绍：" class="mt20">
            <uploadAudio
              :defaultVoice="defaultVoice"
              @getVoiceList="getVoiceList"
              :limit="5"
            ></uploadAudio>
          </FormItem>
          <FormItem label="视频：" class="mt20">
            <uploadVideo
              :defaultVideo="defaultVideo"
              @getVideoList="getVideoList"
              :limit="1"
            ></uploadVideo>
          </FormItem>
          <FormItem label="非遗概述：" class="mt20">
            <Input
              class="control"
              :maxlength="20"
              v-model="params.briefing"
              placeholder="一句话描述非遗项目特点"
            />
            <span class="note ml10"
              >注：非遗项目概述用于用户端非遗项目列表页及非遗项目详情页展示。最多20个汉字。</span
            >
          </FormItem>
          <FormItem label="非遗介绍：" class="mt20">
            <div class="uedit">
              <ueditor v-model="params.introduce" id="project_uedit"></ueditor>
            </div>
          </FormItem>
        </TabPane>

        <!--预订地址-->
        <TabPane label="预订地址" key="key3" class="item pd20">
          <orderAddressTab
            :data="orderAddressData"
            @getData="getOrderAddressManage"
          ></orderAddressTab>
        </TabPane>
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
import orderAddressTab from '@pages/place/common/orderAddress.vue'
// import uploadVideo from "@components/upload/upload-video.vue";
// import uploadAudio from "@components/upload/upload-audio.vue";
// import uploadImg from "@components/upload/upload-image.vue";
import uploadImg from '@components/upload/upload-image2.vue'
import uploadVideo from '@components/upload/upload-video2.vue'
import uploadAudio from '@components/upload/upload-voice.vue'
import ueditor from '@components/ueditor/ueditor.vue'
import distPicker from '@components/distPicker/distPicker.vue'
import Tags from '@components/tags/tags.vue'
import { ctcHeritageSave, ctcHeritageView } from '@service/activity'
import {
  getTags,
  saveTags,
  deleteTag,
  dictType,
  dictValueToRoma
} from '@service/common'
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
    orderAddressTab,
    uploadVideo,
    uploadAudio,
    uploadImg,
    ueditor,
    Tags,
    distPicker //地区插件
  }
})
export default class edit extends Vue {
  //保存参数
  reportCode:any='';
  private params: any = {
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    name: '', //非遗项目名称
    type: '', //类别
    level: '', //级别
    batch: '', //批次
    reportRegion: '', //地区编码
    address: '', //详细地址
    images: '', //图片集地址
    voice: '', //音频集地址
    voiceTime: '', //音频时长
    video: '', //视频地址
    videoTime: '', //视频时长
    videoCover: '', //视频封面图
    briefing: '', //非遗项目概述
    introduce: '', //非遗项目介绍
    reportCode: '', //项目编号
    reportCompany: '', //申报单位
    status: 4, //4待审核  3 草稿
    saveType: 'list', //list 列表编辑，audit 审核编辑
    orderAddressManage: '', //预订地址
    orderAddressType: 'pt' //预订地址 ds:小电商 pt:门票
  }
  //地区编码
  private regionPath: string = ''
  //验证
  private ruleValidate: any = {
    createCompany: [{ required: true, message: '请选择创建者' }],
    name: [
      { required: true, message: '名称不能为空', trigger: 'blur' },
      { type: 'string', max: 100, message: '最多输入100个字符' }
    ],
    type: [{ required: true, message: '类别必选' }],
    level: [{ required: true, message: '级别必选' }],
    batch: [{ required: true, message: '批次必选' }],
    reportRegion: [
      { required: true, message: '请选择所在地区', trigger: 'blur' }
    ],
    reportCompany: [
      { required: true, message: '请填写申报单位' },
      { type: 'string', max: 50, message: '最多输入50个字符' }
    ],
    reportCode: [{ required: true, message: '请填写项目编号' }],
    images: [{required: true, message: '请上传非遗项目图片'}]
  }
  /**
   * 根据非遗项目类别获取项目编号罗马数字
   */
  private typeName:string='I';
  getRomanNumberByName() {
    let item = this.type.find((e: any) => e.id === this.params.type) as any
    if (item) {
      dictValueToRoma({
        value: item.value
      }).then((res: any) => {
        if (res.code === 0) {
          this.typeName=res.data
        }
      })
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
    resourceType: 'CONTENT_TYPE_HERITAGE_ITEM'
  }
  private orderList: Array<object> = []
  private saveOrderAddressType = ''

  getOrderAddressManage(data: any) {
    this.saveOrderAddressType = data.orderAddressType
    this.orderList = data.list
  }

  /*E 预订地址*/
  //获取地区region
  getRegion(data: any) {
    ;(this.params as any).reportRegion = data.region
  }
  //提交
  handleSubmit(status: number) {
    let _this = this
    //预订地址 设置status(1:选中<启用> 2:未选中<禁用>)
    this.orderList.forEach((item: any) => {
      if (item.createTime) {
        delete item.createTime
      }
      if (item.updateTime) {
        delete item.updateTime
      }
      item.status = item.orderType == this.saveOrderAddressType ? 1 : 2
    })
    ;(this.params as any).orderAddressManage = JSON.stringify(this.orderList) //预订地址
    ;(this.params as any).orderAddressType = this.saveOrderAddressType //预订地址单选状态
    let ptNum: any = []
    ptNum = _this.orderList
      .map((item: any) => {
        if (item.orderType == 'pt') {
          return item
        }
      })
      .filter((item: any) => {
        return item
      })
    if ((this.params as any).orderAddressType === 'pt' && ptNum.length < 1) {
      this.$Message.error('请添加第三方平台预订地址')
      return
    }
    _this.params.status = status //状态 4待审核  3 草稿
    _this.params.reportCode=_this.reportCode?`${_this.typeName}-${_this.reportCode}`:''; //罗马数字-项目编号
    //验证并保存
    ;(_this.$refs.params as any).validate((valid: any) => {
      if (valid) {
        if (status === 4) {
          let config: ModalConfig = {
            title: '操作提示',
            content: `请确认基本资料、非遗项目介绍、预订地址是否已完善，是否确认提交?`,
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
    ctcHeritageSave(this.params).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success('保存成功')
        this.$router.push({ path: '/remains-project' })
      }
    })
  }
  //取消
  goBack() {
    this.$router.go(-1)
  }

  //类型标签
  private levels: any = [] //选择世界级需要用到
  handleTags(item: any, name: any) {
    this.params[name] = item.id
    //选择世界级的同时要选择国家级
    if (item.name === '世界级') {
      this.levels = this.level
        .map((item: any, index: any) => {
          if (index < 2) {
            return item.id
          }
        })
        .filter((item: any) => {
          return item
        })
    } else {
      this.levels = []
    }
    if(name=='type')this.getRomanNumberByName();
  }
  //经纬度
  getLongLat(e: any) {
    this.params.longitude = e.lnglat.lng
    this.params.latitude = e.lnglat.lat
  }
  // 回显图片
  private defaultImage: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
  ]
  private defaultIcon: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
  ]
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
      this.params.voice = list.map((data: any) => data.url || '').join(',')
      this.params.voiceTime = list
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

    let allPromise: Array<Promise<any>> = []
    list.forEach((item: any) => {
      if (!item.duration || !/^(\d+|(\d+\.\d+))$/.test(item.duration + '')) {
        // 没得的主动获取音频时长
        let currPromise: Promise<any> = this.getVideoTime(item.url)
        currPromise.then((res: { duration: number }) => {
          item.duration = res.duration
        })
        allPromise.push(currPromise)
      }
    })

    Promise.all(allPromise).finally(() => {
      this.params.videoTime = list
        .map((data: any) => this.formatSeconds(data.duration) || '')
        .join(',')
    })
  }
  // 获取本地视频时长
  private getVideoTime(url: string) {
    let _this = this
    return new Promise((resolve, reject) => {
      let audio = document.createElement('video')
      audio.src = url
      audio.addEventListener('loadeddata', function() {
        resolve({
          duration: parseInt(String(_this.duration))
        })
      })
      audio.addEventListener('error', function() {
        reject()
      })
    })
  }
  //获取类型
  //类型
  private type: Array<object> = []
  private level: Array<object> = []
  private batch: Array<object> = []
  private tagList: Array<object> = [
    { type: 'HERITAGE_BATCH', name: 'batch' },
    { type: 'HERITAGE_TYPE', name: 'type' },
    { type: 'HERITAGE_LEVEL', name: 'level' }
  ]
  getType(type: any, name: any) {
    let _this = this
    dictType({ type: type }).then((res: any) => {
      if (res.code === 0) {
        _this[name] = res.datas

        if (type === 'HERITAGE_LEVEL') {
          // level回显
          if (this.params.name) {
            // 说明 数据已回 | 修改
            if (
              (this.level.filter(
                (lv: any) => lv.id === this.params.level
              )[0] as any).name === '世界级'
            ) {
              this.levels = this.level
                .filter((e: any) => ['世界级', '国家级'].includes(e.name))
                .map((e: any) => e.id)
            }
          }
        }
      }
    })
  }

  //获取详情
  getView(id: any) {
    let _this = this
    ctcHeritageView({ id: id }).then((res: any) => {
      _this.params = res.data.ctcHeritageItem
      _this.isEdit = res.data.ctcHeritageItem.status == 3 //当前是草稿编辑 就显示存草稿按钮
      //地区编码
      _this.regionPath = res.data.sysRegion.scort
      _this.params.reportRegion = res.data.sysRegion.region
      _this.reportCode = res.data.ctcHeritageItem.reportCode;//项目编号
      //移除不需要的字段
      delete (_this.params as any).createTime
      delete (_this.params as any).updateTime
      // 判断createCompany是否为空 为空就默认为-1
      this.params.createCompany = this.params.createCompany || -1
      _this.params.saveType = _this.$route.query.type
      //预订地址radio 默认值
      ;(this.orderAddressData as any).orderAddressType =
        res.data.ctcHeritageItem.orderAddressType
      // level回显
      if (this.level.length) {
        // 说明数据已回
        if (
          (this.level.filter(
            (lv: any) => lv.id === this.params.level
          )[0] as any).name === '世界级'
        ) {
          this.levels = this.level
            .filter((e: any) => ['世界级', '国家级'].includes(e.name))
            .map((e: any) => e.id)
        }
      }
      //罗马数字回显
      this.getRomanNumberByName();
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
      let audios = _this.params.voice.split(',')
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
    //类型数据
    this.tagList.forEach((item: any) => {
      _this.getType(item.type, item.name)
    })

    //修改页面id
    if (_this.$route.query.id) {
      _this.params.id = _this.$route.query.id
      _this.getView(_this.params.id)
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
.tab-wrap {
  overflow: visible;
}
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
  .w100 {
    width: 100px;
  }
  .reportCode {
    display: inline-block;
    border: 1px solid $borderLight;
    padding: 0 10px;
  }
}
</style>
