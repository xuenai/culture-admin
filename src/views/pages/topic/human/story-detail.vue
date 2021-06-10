<!--
 * @Author: 任智勇
 * @since: 2019-06-04 09:14:58
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-15 11:37:39
 -->
<template>
  <div class="container" v-if="detail">
    <auditHead :data="headData"></auditHead>
    <div class="list-panel">
      <Row class="item">
        <Col span="2" class="item-name">标题</Col>
        <Col span="22" class="item-content">{{detail.title}}</Col>
      </Row>
      <Row class="item" v-if="detail.tagName">
        <Col span="2" class="item-name">标签</Col>
        <Col span="22" class="item-content">#{{detail.tagName}}#</Col>
      </Row>
      <Row class="item" v-if="detail.topicName">
        <Col span="2" class="item-name">所属话题</Col>
        <Col span="22" class="item-content">#{{detail.topicName}}#</Col>
      </Row>
      <Row class="item" v-if="detail.storyType === 'story'">
        <Col span="2" class="item-name">{{detail.ich?'作品内容':'故事内容'}}</Col>
        <Col span="22" class="item-content" v-html="detail.content || '暂无内容'"></Col>
      </Row>
        <Row class="item" v-if="detail.storyType === 'strategy'">
            <Col span="2" class="item-name">攻略封面</Col>
            <Col span="22" class="item-content"><img :src="detail.cover" alt=""></Col>
        </Row>
      <Form :label-width="80" v-if='detail.strategyDetail && detail.strategyDetail.length'>
        <FormItem class="item" label="攻略内容">
          <div>
            <p class="time">行程共计{{detail.strategyDetail.length}}天</p>
            <Timeline v-if="detail.strategyDetail && detail.strategyDetail.length">
              <TimelineItem
                color="gray"
                v-for="(item, index) in detail.strategyDetail"
                :key="index + 'i'"
              >
                <!-- <p class="time">DAY {{index + 1}}</p>
                <div class="content-panel">
                  <span class="title">{{item.title}}</span>
                  <p class="content" v-if="item.images.length && item.content" v-html="item.content || '暂无内容'"></p>
                  <p class="imgP" v-if="item.images.length" v-for="img in item.images" :key="img">
                    <img :src="img">
                  </p>
                </div> -->
                <p class="time" v-if="item.title">{{ item.title }}</p>
                <div class="content-panel">
                  <template v-if="item.contentType === 'CONTENT'">
                    <p>{{ item.content }}</p>
                  </template>
                  <template v-if="item.contentType === 'IMAGE'">
                    <p class="img" v-for="(url,index) in item.content.split(',')" :key="index">
                      <img :src="url" alt @click.stop="viewImage(item.content.split(','),'图片查看',index)">
                    </p>
                  </template>
                  <template v-if="item.contentType === 'VIDEO'">
                    <p class="img daq-no-photo view-images-box" @click="() => { show = true;showVideo.url = item.content.split(',')[0] }">
                      <span class="cover"></span>
                      <img :src="item.videoCover" alt v-if="item.videoCover" class="daq-img">
                    </p>
                  </template>
                </div>
              </TimelineItem>
            </Timeline>
          </div>
        </FormItem>
      </Form>
      <Row class="item" v-if="detail.address">
        <Col span="2" class="item-name">{{detail.ich?'作品地点':'故事地点'}}</Col>
        <Col span="22" class="item-content">
          <div class="address">
            <i class="cloud-icon">&#xe606;</i>
            {{detail.address}}
          </div>
        </Col>
      </Row>
      <Row class="item" v-if="detail.images && detail.images.length">
        <Col span="2" class="item-name">图片素材</Col>
        <Col span="22" class="item-content img-list">
          <p class="img" v-for="(items,picInd) in detail.images" :key="picInd">
            <img :src="items" alt @click.stop="viewImage(detail.images,'图片查看',picInd)">
          </p>
        </Col>
      </Row>
        <Row class="item" v-if="detail.video">
            <Col span="2" class="item-name">视频素材</Col>
            <Col span="22" class="item-content img-list">
                <p class="img daq-no-photo view-images-box" @click="show = true">
                    <span class="cover"></span>
                    <img v-if="detail.videoCover" :src="detail.videoCover" class="daq-img">
                </p>
            </Col>
        </Row>
    </div>
    <!--审核记录-->
    <div class="audit-record" v-if="detail.auditStatus != 500">
      <h3 class="title">审核记录</h3>
      <Timeline class="record-panel">
        <Timeline-item>
          <p class="time">{{detail.auditDate}}</p>
          <p class="content">
            由<span v-if="detail.auditUserName">【{{detail.auditUserName}}】</span>
            <span v-if="detail.auditUserPhone">【{{detail.auditUserPhone.substr(detail.auditUserPhone.length-4,detail.auditUserPhone.length)}}】</span>
            <span v-else>【人工智能】</span>
            审核，审核结果：{{getStatusTxt(detail.auditStatus)}}。
            <span
              v-if="detail.auditResult"
            >审核备注：{{detail.auditResult}}</span>
          </p>
        </Timeline-item>
      </Timeline>
    </div>
    <Row class="item mg20">
      <Col span="24">
        <Button v-if="historyLength > 1" @click="goHistory">返回</Button>
      </Col>
    </Row>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
      <VideoPlayer v-if="showVideo.url" :showVideo="showVideo" :show="show"></VideoPlayer>
  </div>
</template>

<script lang="ts">
import { Component, Vue , Watch} from "vue-property-decorator";
import auditHead from "@views/pages/common/result-head.vue";
import VideoPlayer from "@components/video-play/video-play.vue";
import { getStoryDesc } from "@service/topic";
import { PreviewPics } from '@components/index';
@Component({
  components: {
    auditHead,
    PreviewPics,
      VideoPlayer
  }
})
export default class auditPerform extends Vue {
  historyLength = window.history.length;
  private headData: object = {}; // 表头
  private detail: any = {}; // 详情
    private showVideo = <any>{
        url: "",
        image: "",
        title: ""
    };
    private show: boolean = false;
  mounted() {
    this.getDesc();
  }
  // 获取详情
  private getDesc() {
    getStoryDesc({
      id: this.$route.query.id
    }).then((data: any) => {
      (data.data as any).address = ''
      if ((data.data as any).longitude && (data.data as any).latitude) {
        this.geocoder((data.data as any).longitude, (data.data as any).latitude);
      } else {
        this.geocoder(-1, -1);
      }
      this.getVideoImg(data.data.video).then((res:any) => {
          Object.assign(this.detail, {videoCover: res.imgUrl})
      });
      this.showVideo.url = data.data.video;
      this.detail = data.data;
      this.detail.videoCover = '';
      this.headData = {
        status: data.data.auditStatus,
        date: data.data.auditDate,
        remark: data.data.auditResult
      };
    });
  }
  private addressList: any = [];
  //经纬度转换为地址
  private geocoder(lnglatX: any, lnglatY: any) {
    let geocoder = new AMap.Geocoder();
    let _this = this;
    if (lnglatX === -1) {
      _this.addressList.push("");
      return;
    }
    geocoder.getAddress([lnglatX, lnglatY], function(status: any, result: any) {
      if (status === "complete" && result.info === "OK") {
        _this.addressList.push(result.regeocode.formattedAddress);
      }
    });
  }
  @Watch('addressList')
    changeList(val:any, oldVal: any) {
        (val as []).map((item:any, index:number) => {
        this.detail.address = item
        })
    }
  // 返回上一页
  private goHistory () {
      this.$router.go(-1)
  }
  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private imgTitle: String = '';
  private currIndex = 0;
  private viewImage(url: any,name: String, index?: number) {
    // 判断url的类型 如果是数组 则直接赋值 如果不是数组 则先清空数组 再将url写到数组里面去
    if (Object.prototype.toString.call(url) === '[object Array]') {
      this.imgUrl = url;
    }
    if (Object.prototype.toString.call(url) === '[object String]') {
      this.imgUrl = []
      this.imgUrl.push(url)
    }
    this.imgTitle = name;
    this.visible = true;
    this.currIndex = index || 0
  }
  /* E 查看大图 */
  // 获取审核状态
  private getStatusTxt(status: number) {
    switch (status) {
      case 4: {
        return "待审核";
      }
      case 6: {
        return "审核通过";
      }
      case 7: {
        return "审核不通过";
      }
      case 9: {
        return "审核不通过";
      }
      case 79: {
        return "审核不通过";
      }
      case 500: {
        return "审核异常";
      }
    }
  }

  // 获取封面图
    private getVideoImg (src: string) {
        return new Promise((resolve, reject) => {
            let video = document.createElement("video");
            video.crossOrigin = "anonymous";
            video.src = src;
            video.addEventListener("loadeddata", function () {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                let w = this.videoWidth;
                let h = this.videoHeight;
                this.width = canvas.width = w;
                this.height = canvas.height = h;
                // @ts-ignore
                ctx.drawImage(this, 0, 0, w, h);
                let imgUrl: string = canvas.toDataURL("image/jpeg", 1);
                let duration = this.duration;

                resolve({
                    imgUrl,
                    duration
                });
            });
            video.addEventListener("error", function () {
                reject()
            })
        })
    }
}
</script>

<style scoped lang="scss">
.container{
  padding: 15px;
}
.w150 {
  width: 150px;
}
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
    width: 70px;
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
  .content-panel {
    .title {
      color: $font01;
      font-weight: 600;
    }
    width: 350px;
  }
}
.audit-record {
  padding-top: 20px;
  border-top: 1px solid $borderLight;
  border-bottom: 1px solid $borderLight;
  margin: 15px 0;
  .record-panel {
    padding: 20px 20px;
    .content {
      color: $font03;
    }
  }
}
.imgP img{
  width: 100%;
}
</style>
