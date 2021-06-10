<template>
  <div class="visiting-card">
    <Form :label-width="120">
      <FormItem label="所属区域：">{{data.regionNameStr}}</FormItem>
      <FormItem label="名称：">
        <Input type="text" :maxlength="20" v-model="data.name" class="w150"/>
      </FormItem>
      <FormItem label="LOGO：">
        <Tooltip placement="right" content="点击修改">
          <div class="img-box daq-no-photo">
            <img v-if="data.logo && data.logo.indexOf('http') !== -1" :src="data.logo" class="daq-img" alt="">
            <input
              type="file"
              class="logo-upload"
              accept="image/*"
              ref="fileInput"
              @change="acceptImage($event)"
            />
          </div>
        </Tooltip>
      </FormItem>
      <FormItem label="概述：">
        <Input type="text" class="w400" :maxlength="20" v-model="data.summary" placeholder="一句话描述"/>
        <span class="tip">注：将展示到首页顶部品牌推广处，最多20个汉字。</span>
      </FormItem>
      <FormItem label="封面图：">
        <UploadImg :limit="1" @getImagesList="getCover" :defaultImage="data.coverImage" ></UploadImg>
      </FormItem>
      <FormItem label="视频：">
        <VedioUpload v-model="videoData"></VedioUpload>
      </FormItem>
      <FormItem label="主图：">
        <UploadImg :limit="9" @getImagesList="getImages" :defaultImage="data.images" ></UploadImg>
      </FormItem>
      <FormItem label="720全景">
        <Input type="text" class="w400" :maxlength="100" v-model="data.panoramaUrl" placeholder="请输入720全景地址"/>
      </FormItem>
      <FormItem label="建议游玩时间">
        <InputNumber :min="1" style="width:100px;"  v-model="data.suggestedDay" placeholder="请输入游玩时间"/>&nbsp;天
      </FormItem>
      <FormItem label="介绍：">
        <Ueditor v-if="editorFlag" id="uedit1" v-model="data.introduce"></Ueditor>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="saveCard">保存</Button>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadImg from "@components/upload/upload-image.vue";
import Ueditor from "@components/ueditor/ueditor.vue";
import {VedioUpload} from '@components/index'

import {getSiteVisitingCard, saveSiteVisitingCard, SiteVisitingCardDataType} from "@service/setting";
import { uploadImage } from "@service/content";

interface VedioListType {
  url: string;
  image: string;
  title?: string;
}

@Component({components: { UploadImg, Ueditor, VedioUpload}})
export default class VisitingCard extends Vue {
  private data:any = {}
  private editorFlag = false
  private spinShow = false
  private videoData:Array<VedioListType> = []
  @Watch("videoData", { immediate: true, deep: true })
  onVideoDataChange (val: any) {
    if (val && val.length) {
      this.data['videoCover'] = val[0].image
      this.data['video'] = val[0].url
    } else {
      this.data['videoCover'] = ''
      this.data['video'] = ''
    }
  }
  //视频
  getVideo(val: Array<any>) {
    if (val.length) {
      this.data.video = val[0]
    } else {
      this.data.video = ''
    }
  }
  // 图片
  /**
   * @description: 获取图片
   * @param val {array} 返回来的数组
   */
  getImages (val: any) {
    if (val.length) {
      this.data.images = val
    } else {
      this.data.images = ''
    }
  }
  // 添加封面图
  getCover (val: any) {
    if (val.length) {
      this.data.coverImage = val[0]
    } else {
      this.data.coverImage = ''
    }
  }
  // 保存
  private saveCard () {
    this.spinShow = true
    if(this.data.images.length) {
      this.data.images = this.data.images.join(',')
    }
    this.data.cardType = 'TOURISM';
    saveSiteVisitingCard(this.data).then(res => {
      this.spinShow = false
      if (res.code === 0) {
        this.$Message.success("保存成功！");
        this.getDetail()
      }
    }).catch(err => {
      this.spinShow = false
    })
  }
  // 获取详情
  getDetail() {
    getSiteVisitingCard({cardType: 'TOURISM'}).then(res =>{
      if (res.code === 0) {
        this.data = res.data
        if (res.data.video) {
          let item:Array<VedioListType> = [{image:  res.data.videoCover, url: res.data.video}]
          this.videoData = item
        }
      }
    })
  }
  /**
   * @description: 上传图片
   * @param {event} 事件
   */
  private acceptImage(e: any) {
    let files = e.target.files;
    let _this = this;
    let len = files.length;
    let _input = this.$refs.fileInput as HTMLElement;
    for (let i = 0; i < len; i++) {
      let formData = new FormData();
      formData.append("Filedata", files[i]);
      formData.append("path", "cultural-tourism-cloud");
      this.spinShow = true
      uploadImage(formData).then((res: any) => {
        this.spinShow = false
        this.data.logo = res.safeUrl
      }).catch(err => {
        this.spinShow = false
      });
    }
    _input.setAttribute("type", "file");
  }
  created () {
    this.getDetail()
  }
  mounted() {
    setInterval(()=>{this.editorFlag = true}, 30)
  }
}
</script>

<style lang='scss' scoped>
.visiting-card{
  position:relative;
  padding:0 32px;
  .w150{
    width:150px;
  }
  .w400{
    width:400px;
  }
  .ivu-form-item{
    // margin-bottom: 12px;
  }
  .tip{
    margin-left:24px;
    font-size:10px;
    color:#999;
  }
  .img-box{
    position:relative;
    display:inline-block;
    vertical-align:top;
    width:80px;
    height:80px;
    border-radius:4px;
    .logo-upload{
      position:absolute;
      left:0;
      top:0;
      width:100%;
      height:100%;
      opacity: 0;
      cursor:pointer;
    }
  }
}
</style>
