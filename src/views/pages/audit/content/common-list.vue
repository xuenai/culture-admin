<!--
 * @Author: 任智勇
 * @since: 2019-05-29 09:46:46
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-24 20:31:25
 -->
<template>
  <div class="list-panel">
    <Row class="item">
      <i-col span="2" class="item-name">
        <span class="red">*</span> 栏目
      </i-col>
      <i-col span="22" class="item-content">{{defaultData.channelName}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">
        <span class="red">*</span> 标题
      </i-col>
      <i-col span="22" class="item-content">{{defaultData.title}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.author">
      <i-col span="2" class="item-name">作者</i-col>
      <i-col span="22" class="item-content">{{defaultData.author}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.sourceUrl || defaultData.source">
      <i-col span="2" class="item-name">来源\来源地址</i-col>
      <i-col span="22" class="item-content">{{defaultData.source}}({{defaultData.sourceUrl}})</i-col>
    </Row>
    <Row class="item" v-if="defaultData.createCompanyName">
      <i-col span="2" class="item-name">创建者</i-col>
      <i-col span="22" class="item-content">{{defaultData.createCompanyName}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.resourceLinksInfo && defaultData.resourceLinksInfo.filter(d=>d.resourceType!=='CONTENT_TYPE_BRAND').length">
      <i-col span="2" class="item-name">场所</i-col>
      <i-col span="22" class="item-content">{{defaultData.resourceLinksInfo.filter(d=>d.resourceType!=='CONTENT_TYPE_BRAND').map(ele=>ele.resourceName).toString()}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.resourceLinksInfo && defaultData.resourceLinksInfo.filter(d=>d.resourceType==='CONTENT_TYPE_BRAND').length">
      <i-col span="2" class="item-name">关联品牌</i-col>
      <i-col span="22" class="item-content">{{defaultData.resourceLinksInfo.filter(d=>d.resourceType==='CONTENT_TYPE_BRAND').map(ele=>ele.resourceName).toString()}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.summary">
        <i-col span="2" class="item-name">摘要</i-col>
        <i-col span="22" class="item-content">{{defaultData.summary}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.content">
      <i-col span="2" class="item-name">内容</i-col>
      <i-col span="22" class="item-content" v-html="defaultData.content"></i-col>
    </Row>
    <Row class="item" v-if="defaultData.tagName && defaultData.tagName.length > 0">
      <i-col span="2" class="item-name">标签</i-col>
      <i-col span="22" class="item-content">
        <Tag class="tag" v-for="(tag,tagIndex) in defaultData.tagName" :key="tagIndex">{{tag}}</Tag>
      </i-col>
    </Row>
    <Row class="item" v-if="defaultData.publishTime">
      <i-col span="2" class="item-name">发布时间</i-col>
      <i-col span="22" class="item-content">{{defaultData.publishTime}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.imageUrls && defaultData.imageUrls.length > 0">
      <i-col span="2" class="item-name">图集</i-col>
      <i-col span="22" class="item-content img-list">
        <p class="img" v-for="(img,imgIndex) in defaultData.imageUrls" :key="imgIndex">
          <img :src="img" @click="previewPic(imgIndex)" alt>
        </p>
      </i-col>
    </Row>
    <Row class="item" v-if="defaultData.videoUrl && defaultData.videoUrl.length > 0">
      <i-col span="2" class="item-name">视频</i-col>
      <i-col span="22" class="item-content img-list">
        <div
          class="img-cover img daq-no-photo view-images-box"
          v-if="defaultData.videoUrl"
          @click.stop="openVideo(defaultData)"
          >
              <span class="cover"></span>
              <img :src="defaultData.videoCover" alt v-if="defaultData.videoCover" class="daq-img">
        </div>
      </i-col>
    </Row>
    <Row class="item" v-if="defaultData.audioInfo">
      <i-col span="2" class="item-name">音频</i-col>
      <i-col span="22" class="item-content img-list">
        <div
          class="img-cover img daq-no-photo view-images-box"
          @click.stop="playVoice(defaultData.audioInfo)"
          >
              <span class="cover"></span>
              <img :src="defaultData.audioInfo.imgUrl" alt v-if="defaultData.audioInfo.imgUrl" class="daq-img">
        </div>
      </i-col>
    </Row>
    <Row class="item" v-if="defaultData.annex && defaultData.annex.length>0">
      <i-col span="2" class="item-name">附件</i-col>
      <i-col span="22" class="item-content img-list">
        <p v-for="(item,anIndex) in defaultData.annex" :key="anIndex + 'annex'">
          <a :href="item" target="_blank">{{item.split('/')[item.split('/').length - 1]}}</a>
        </p>
      </i-col>
    </Row>
      <Row class="item" v-if="defaultData.actualCommentNum || defaultData.actualShowNum || defaultData.actualLikeNum || defaultData.actualCollectionNum">
          <i-col span="2" class="item-name">真实数据</i-col>
          <i-col span="22" class="item-content simulate">
              <p v-if="defaultData.actualShowNum">
                  浏览量
                  <Button class="count" disabled>{{defaultData.actualShowNum}}</Button>
              </p>
              <p v-if="defaultData.actualLikeNum">
                  点赞量
                  <Button class="count" disabled>{{defaultData.actualLikeNum}}</Button>
              </p>
              <p v-if="defaultData.actualCollectionNum">
                  收藏量
                  <Button class="count" disabled>{{defaultData.actualCollectionNum}}</Button>
              </p>
              <p v-if="defaultData.actualCommentNum">
                  评论量
                  <Button class="count" disabled>{{defaultData.actualCommentNum}}</Button>
              </p>
          </i-col>
      </Row>
    <!-- <Row class="item" v-if="defaultData.showNum || defaultData.likeNum || defaultData.collectionNum">
      <i-col span="2" class="item-name">模拟数据</i-col>
      <i-col span="22" class="item-content simulate">
        <p v-if="defaultData.showNum">
          浏览量
          <Button class="count" disabled>{{defaultData.showNum}}</Button>
        </p>
        <p v-if="defaultData.likeNum">
          点赞量
          <Button class="count" disabled>{{defaultData.likeNum}}</Button>
        </p>
        <p v-if="defaultData.collectionNum">
          收藏量
          <Button class="count" disabled>{{defaultData.collectionNum}}</Button>
        </p>
      </i-col>
    </Row> -->

      <!--自定义字段S-->
      <template v-if="defaultData.contentExtendInfo">
        <template v-for="(item, i) in defaultData.contentExtendInfo">
            <Row
                v-if="['文本框（单行）','文本框（多行）','复选框','单选框','下拉列表（单选）','下拉列表（多选）','日期选择器','日期选择器（精确到分）'].includes(item.fieldType) && item.fieldValue" class="item" :key="i">
                <i-col span="2" class="item-name">{{item.fieldName}}</i-col>
                <i-col span="22" class="item-content">{{item.fieldValue}}</i-col>
            </Row>

            <Row class="item" v-if="item.fieldType === '内容编辑器'" :key="i">
                <i-col span="2" class="item-name">{{item.fieldName}}</i-col>
                <i-col span="22" class="item-content" v-html="item.fieldValue"></i-col>
            </Row>

            <Row class="item" v-if="item.fieldType === '图片' && item.imageUrls && item.imageUrls.length > 0" :key="i">
                <i-col span="2" class="item-name">{{item.fieldName || '图片'}}</i-col>
                <i-col span="22" class="item-content img-list">
                    <p class="img" v-for="(img,imgIndex) in item.imageUrls" :key="imgIndex">
                        <img :src="img" alt>
                    </p>
                </i-col>
            </Row>

            <Row class="item" v-if="item.fieldType === '视频' && item.videoUrls && item.videoUrls.length > 0" :key="i">
                <i-col span="2" class="item-name">{{item.fieldName || '视频'}}</i-col>
                <i-col span="22" class="item-content img-list">
                    <div
                        class="img-cover img daq-no-photo view-images-box"
                        v-for="(video,i) in item.videoUrls"
                        :key="i"
                        @click.stop="openVideo(video)"
                    >
                        <span class="cover"></span>
                        <img :src="video.imgUrl" alt v-if="video.imgUrl" class="daq-img">
                    </div>
                </i-col>
            </Row>

            <Row class="item" v-if="item.fieldType === '音频' && item.audios && item.audios.length" :key="i">
                <i-col span="2" class="item-name">{{item.fieldName || '音频'}}</i-col>
                <i-col span="22" class="item-content img-list">
                    <div
                            class="img-cover img daq-no-photo view-images-box"
                            v-for="(audio,i) in item.audios"
                            :key="i"
                            @click.stop="playVoice(audio)"
                    >
                        <span class="cover"></span>
                        <img :src="audio.imgUrl" alt v-if="audio.imgUrl" class="daq-img">
                    </div>
                </i-col>
            </Row>

            <Row class="item" v-if="item.fieldType === '附件' && item.annexs && item.annexs.length" :key="i">
                <i-col span="2" class="item-name">{{item.fieldName || '附件'}}</i-col>
                <i-col span="22" class="item-content img-list">
                    <p v-for="(annex,i) in item.annexs" :key="i">
                        <a :href="annex" target="_blank">{{annex.split('/')[item.split('/').length - 1].split('.')[0]}}</a>
                    </p>
                </i-col>
            </Row>
        </template>
      </template>
      <!--自定义字段E-->

     <!-- 视频播放 -->
    <VideoPlayer :showVideo="showVideoFun" @closePop="closePop" :show="showVideo" v-if="showVideoFun.url"></VideoPlayer>
      <!-- 播放音频 -->
      <VoicePop :show="showVoice" :close="()=>{showVoice = false}" :voiceConf="voiceConf"></VoicePop>
      <PreviewPics v-model="previewPicShow" :imgs="defaultData.imageUrls" :currIndex="previewPicIndex"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import VoicePop from "@components/pop/voice-pop.vue";
import { getVoiceInfo, getVideoInfo, getImgInfo } from "@service/tool";
import { getContentExtendColumn } from "@service/content";
import { PreviewPics } from "@components/index";
// imageUrls

interface videoType {
  url: String;
  image: String;
  title: String;
};

interface voiceType {
    id: number;
    url: string;
    imgUrl: string;
    name?: string;
    [propName: string]: any;
}

@Component({
  components: {VideoPlayer,VoicePop, PreviewPics}
})
export default class commonList extends Vue {
  @Prop() private data!: object;
  @Watch("data", { immediate: true, deep: false })
  refreshData() {
    this.defaultData = Object.assign({}, this.defaultData, this.deepCopy(this.data));
    this.getContentExtendColumn()
    this.renderExtendKeys()
  }
  // 本页需要展示的数据集
  private defaultData: any = {
    channelName: "",
    title: "",
    author: "",
    source: "",
    summary: "",
    createCompanyName: "",
    content: "",
    tagName: "",
    publishTime: "",
    imageUrls: "",
    videoUrl: "",
    annex: [],
    showNum:'',
    likeNum:'',
    collectionNum:''
  };

  /** 图片浏览 S */
  private previewPicShow = false;
  private previewPicIndex = 0;
  previewPic (idx: number) {
    this.previewPicShow = true;
    this.previewPicIndex = idx;
  }
  /** 图片浏览 E*/

    // 对象深拷贝
    private deepCopy(obj: any) {
        let result = (Array.isArray(obj) ? [] : {}) as any
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key]!==null) {
                    result[key] = this.deepCopy(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }
    // 获取扩展字段的媒体资源
    private renderExtendKeys () {
        let data = this.defaultData
        if (data.contentExtendInfo && data.contentExtendInfo.length) {
            data.contentExtendInfo.forEach((item:any) => {
              if (item.fieldType === '图片') {
                  //   获取图片详情
                  String(item.fieldValue) && String(item.fieldValue).split(',').forEach((id:any) => {
                      getImgInfo({id}).then(data => {
                        if (data.data && data.data.res) {
                          if (!item.imageUrls) {
                            Vue.set(item, 'imageUrls', [])
                          }
                          item.imageUrls.push(data.data.res.url)
                        }
                      })
                  })
              }
                if (item.fieldType === '视频') {
                    //   获取视频详情
                    String(item.fieldValue) && String(item.fieldValue).split(',').forEach((id:any) => {
                        getVideoInfo({id}).then(data => {
                            if (data.data && data.data.res) {
                                data.data.res.videoUrl = data.data.res.url
                                data.data.res.videoCover = data.data.res.imgUrl
                                if (!item.videoUrls) {
                                    Vue.set(item, 'videoUrls', [])
                                }
                                item.videoUrls.push(data.data.res)
                            }
                        })
                    })
                }
                if (item.fieldType === '音频') {
                    //   获音频详情
                    String(item.fieldValue) && String(item.fieldValue).split(',').forEach((id:any) => {
                        getVoiceInfo({id}).then(data => {
                            if (data.data && data.data.res) {
                                if (!item.audios) {
                                    Vue.set(item, 'audios', [])
                                }
                                item.audios.push(data.data.res)
                            }
                        })
                    })
                }
            })
        }
    }
    // 获取扩展字段详情
    private getContentExtendColumn () {
        if (!this.defaultData.channelId || !this.defaultData.contentExtendInfo.length) return;
        getContentExtendColumn({
            channelId: this.defaultData.channelId
        }).then((result:any) => {
            let list = result.datas
            if (result.code === 0 && list) {
              this.defaultData.contentExtendInfo = this.defaultData.contentExtendInfo.filter((extend:any) => {
                let check = false
                list.forEach((item: any) => {
                      if (item.fieldCode === extend.fieldCode) {
                          check = true
                          Vue.set(extend, 'fieldName', item.fieldName)
                      }
                });
                return check
              })
            }
        })
    }

    // 显示弹窗声音
    private voiceConf:{src?: string, title?: string, pic?:string} = {};
    // 显示弹窗声音
    private showVoice: boolean = false;
    // 播放声音
    private playVoice(item: voiceType) {
        this.showVoice = true;
        this.voiceConf.src = item.url;
        this.voiceConf.pic = item.imgUrl;
        this.voiceConf.title = item.name || item.url.split("/")[item.url.split("/").length - 1].split(".")[0];
    }

  /* S 视频播放 */
    private showVideo: Boolean = false;
    private showVideoFun: videoType = {
        url: "",
        image: "",
        title: "",
    };
    private closePop(){
      this.showVideoFun.url = '';
      this.showVideoFun.image = '';
      this.showVideoFun.title = "视频";
      this.showVideo = false;
    }
    private openVideo(item: any) {
        this.showVideoFun.url = item.videoUrl;
        this.showVideoFun.image = item.videoCover;
        this.showVideoFun.title = "视频";
        this.showVideo = true;
    }
    /* E 视频播放 */
}
</script>

<style scoped lang="scss">
.list-panel {
  margin-top: 10px;
  .item {
    padding: 10px 0;
    line-height: 25px;
  }
  .red {
    vertical-align: middle;
  }
  .item-name {
    width: 150px;
    text-align: right;
    margin-right: 13px;
    font-weight: 600;
    color: $font01;
  }
  .item-content {
    width: 80%;
    color: $font05;
    .img {
      display: inline-block;
      width: 240px;
      height: 160px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
      & + .img {
        margin-left: 5px;
      }
    }
    &.simulate {
      p {
        display: inline-block;
        & + p {
          margin-left: 20px;
        }
      }
      .count {
        margin-left: 3px;
        width: 200px;
        text-align: left;
      }
    }
  }
}
</style>
