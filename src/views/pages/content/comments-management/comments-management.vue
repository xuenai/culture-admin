<template>
<!-- 内容-点评管理 -->
  <div class="review-audit">
    <div class="search">
      <Form :label-width="100" inline>
        <FormItem class="item" label="数据类型">
          <Select
          class="w150"
          v-model="params.resourceType"
          >
            <Option
                v-for="(item,i) in resourceType"
                :key="i"
                :value="item.value"
            >{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="点评关键字">
          <i-input placeholder="点评关键字" v-model="params.name" :maxlength="20"></i-input>
        </FormItem>
        <FormItem class="item" label="点评类型">
            <Select class="w150" v-model="params.level">
                <Option value="">全部</Option>
                <Option value="0">好评</Option>
                <Option value="1">差评</Option>
                <Option value="2">一般</Option>
            </Select>
        </FormItem>

        <FormItem class="item" label="点评时间">
          <Date-picker
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          @on-change="setTime"
          ></Date-picker>
        </FormItem>
        <FormItem class="item" label="审核方式">
          <Select
          class="w150"
          v-model="params.auditType"
          >
            <Option
                v-for="(item,i) in auditType"
                :key="i"
                :value="item.value"
            >{{item.name}}
            </Option>
          </Select>
        </FormItem>
        <Button type="primary" class="ml10" @click="search">搜索</Button>
      </Form>
    </div>
    <baseTable :configure="tableConfig" @getList="getList">
      <ul class="tab-list">
        <li class="item header">
          <p class="checked items">
            <Checkbox :value="allCheck" @on-change="handleSelectAll"></Checkbox>
          </p>
          <p class="comment-content items">点评内容</p>
          <p class="star items">所属类型</p>
          <p class="star items">点评用户</p>
          <p class="star items">点评类型</p>
          <p class="time items">点评时间</p>
          <p class="status items">审核状态</p>
          <p class="status items">审核方式</p>
          <p class="change items">操作</p>
        </li>
        <li
          class="item"
          v-for="(item,index) in tableData.bodyList"
          :key="item.id"
          :loading="loading"
          >
          <div class="title-box">
              <!-- 资源视频 -->
              <div
              class="img-cover view-images-box pointer"
              :class="{'daq-no-photo': !item.videoCover}"
              v-if="item.resourceVideo"
              @click="openVideo(0,item,1,1)"
              >
                <span class="cover"></span>
                <img :src="item.videoCover" alt v-if="item.videoCover" class="daq-img">
              </div>
              <div class="img-cover daq-no-photo view-images-box pointer" v-if="item.resourceAudio" @click.stop="playVoice(item)">
                <span class="cover"></span>
                <img :src="item.resourceAudioCover" alt v-if="item.resourceAudioCover" class="daq-img">
              </div>
              <div class="img-cover pointer" v-if="item.resourceImage">
                <img
                :src="item.resourceImage"
                alt class="div-img"
                @click.stop="viewImage(item.resourceImage,item.resourceName)"
                >
              </div>
              <div>
                <p class="title">{{item.resourceName}}</p>
                <p v-if="item.resourceType === 'CONTENT_TYPE_STORY' && (item.storyContent || item.storyTag)" 
                  class="tag-list" 
                  style="margin:0;font-size:12px;"
                  :title="item.storyContent">
                  <span class="tags" style="margin:0" v-if="item.storyTag">{{item.storyTag}}</span> 
                  <span v-if="item.storyContent">{{
                    item.storyContent.slice(0,50) + (item.storyContent.length>50?'...':'')
                  }}</span>
                </p>
              </div>
          </div>
          <div class="item-box">
            <div class="checked items">
              <p class="ch">
                <!-- 多选 -->
                <Checkbox :value="item.checkValue" @on-change="handleTags(item, $event)"></Checkbox>
              </p>
            </div>
            <div class="comment-content items">
              <p class="tag-list" v-if="item.commentTag">
                <span class="tags" v-for="items in item.commentTag" :key="items">{{items}}</span>
              </p>
              <p class="summary">
                <!-- <span v-if="item.video">视频</span> -->
                {{item.content}}
              </p>
              <div class="clearfix">
                <!-- 评论视频 -->
                <div v-if="item.video && item.video.length >= 1">
                  <div v-for="(col,ind) in item.video" :key="ind" class="img daq-no-photo view-images-box fl" @click="openVideo(1,item,col,ind)">
                    <span class="cover"></span>
                    <img :src="item.videoCover[ind]" alt v-if="item.videoCover" class="daq-img">
                  </div>
                </div>
                <!-- 评论图片 -->
                <div class="img-list">
                  <p class="img fl" v-for="(items, picIndex) in item.image" :key="items">
                    <img :src="items" class="daq-img" @click.stop="viewImage(item.image,item.resourceName, picIndex)">
                  </p>
                </div>
              </div>
            </div>
            <div class="star items">{{getDataTxt(item.resourceType)}}</div>
            <div class="star items">{{item.vipNickName}}</div>
            <div class="star items">{{['好评', '差评', '一般'][item.level]||'--'}}</div>
            <p class="time items">{{item.commentTime}}</p>
            <p class="status items">{{getauditStatusTxt(item.auditStatus)}}</p>
            <p class="status items">{{getauditTypeTxt(item.auditType)}}</p>
            <p class="change items">
              <a
              class="theme-blue action-btn"
              @click="batchAudit(index)"
              v-if="operates.includes('audit')"
              >重审</a>
            </p>
          </div>
          <p class="reply" v-if="item.commentReply">
            <span>回复：</span>
            {{item.commentReply}}
          </p>
        </li>
        <li v-if="!tableData.bodyList.length" class="no-data">暂无数据</li>
      </ul>
      <span class="check">
        <Checkbox :value="allCheck" @on-change="handleSelectAll">全选</Checkbox>
      </span>
      <Button class="mt20" v-if="operates.includes('batchCheck')" type="primary" @click="batchAuditFun">批量重审</Button>
    </baseTable>
    <!-- 批量审核 -->
    <Modal
    title="批量审核"
    v-model="batchAuditModal"
    footer-hide
    width="500"
    >
      <div class="describe">
        <p style="color: red" class="tc">您正在进行批量审核操作，请谨慎操作！</p>
        <div class="btn-box mt20">
          <Button class="item" @click="setBatchs(6)" :class="this.batch === 6 ? 'active' : ''">通过</Button>
          <Button class="item ml20 active" @click="setBatchs(79)" :class="this.batch === 79 ? 'active' : ''" >不通过</Button>
        </div>
      </div>
      <div class="btns-group mt20">
        <Button @click="batchAuditModal=false">取消</Button>
        <Button class="ml20" type="primary" @click="batchSubmit">确认审核</Button>
      </div>
    </Modal>
    <!-- 审核 -->
    <Modal
    title="审核意见"
    v-model="dialogConfig"
    footer-hide
    width="500"
    >
      <div class="describe">
        <div class="btn-box">
          <Button class="item" @click="setBatchs(6)" :class="this.batch === 6 ? 'active' : ''">通过</Button>
          <Button class="item ml20" @click="setBatchs(79)" :class="this.batch === 79 ? 'active' : ''" >不通过</Button>
        </div>
        <Input
          v-model="auditResult"
          type="textarea"
          class="mt20"
          placeholder="请输入不通过原因"
          v-show="batch === 79"
          :maxlength="200"
        />
        <p v-show="batch === 79">200字以内</p>
      </div>
      <div class="btns-group mt20">
        <Button @click="dialogConfig=false">取消</Button>
        <Button class="ml20" type="primary" @click="submitChecked">确认审核</Button>
      </div>
    </Modal>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
    <!-- 视频播放 -->
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <!-- 播放音频 -->
    <VoicePop :show="showVoice" :close="()=>{showVoice = false}" :voiceConf="voiceConf"></VoicePop>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { Input } from "iview/types";
import VideoPlayer from "@components/video-play/video-play.vue";
import baseTable from "@components/baseTable/baseTable.vue";
import MediaPop from "@components/pop/media-pop.vue";
import VoicePop from "@components/pop/voice-pop.vue";
import { AppModule } from "@store/modules/app";
import {PreviewPics} from '@components/index';
import {
  DATAS_TYPES,
  AUDIT_TYPES
  } from '@constant/index';
import {
  getCommentList,
  setCommentAudit,
  setCommentBatchAudit,
} from "@service/content";
interface videoType {
  url: String;
  image: String;
  title: String;
};
interface voiceType {
  url: string;
  imgUrl: string;
  name?: string;
  [propName: string]: any;
}
@Component({
  components: {
    VideoPlayer,
    baseTable,
    MediaPop,
    VoicePop,
    PreviewPics
  }
})
export default class RevierAudit extends Vue {
  // 权限列表
  get operates() {
      return AppModule.operates;
  }
  private loading: Boolean = true; // 数据是否加载中
  private resourceType: any = DATAS_TYPES; // 数据类型
  private auditType: any = AUDIT_TYPES; // 审核方式
  // 接口请求params
  private params: any = {
    name: '', // 点评关键字
    auditStatus: '6', // 审核状态
    auditType: '', // 审核方式
    resourceType: '', // 资源类型
    startDate: '', // 开始时间
    endDate: '' // 结束时间
  }

  // 时间
  private setTime(e: any) {
    this.params.startDate = e[0];
    this.params.endDate = e[1];
  }

  //获取数据类型
  private getDataTxt(data: string) {
    switch (data) {
      case "CONTENT": {
        return "内容";
      }
      case "CONTENT_TYPE_SCENERY": {
        return "景区";
      }
      case 'CONTENT_TYPE_HOTEL': {
        return "酒店";
      }
      case 'CONTENT_TYPE_RESTAURANT': {
        return "餐饮";
      }
      case 'CONTENT_TYPE_VENUE': {
        return "文化场馆";
      }
      case 'CONTENT_TYPE_ACTIVITY': {
        return "活动";
      }
      case 'CONTENT_TYPE_STORY': {
        return "故事";
      }
      case 'CONTENT_TYPE_VOLUNTEER_TEAM': {
        return "志愿者团队";
      }
      case 'CONTENT_TYPE_ASSOCIATION': {
        return "社团";
      }
    }
  }

  //获取审核方式
  private getauditTypeTxt(type: string){
    switch(type){
      case "artificial":{
        return "人工审核";
      }
      case "machine":{
        return "人工智能";
      }
        default:
          return '--'
    }
  }
  //获取审核状态
  private getauditStatusTxt(status: number) {
    switch (status) {
      case 4: {
        return "待审核";
      }
      case 6: {
        return "通过";
      }
      case 7: {
        return "回退";
      }
      case 8: {
        return "撤回";
      }
      case 9: {
        return "终止";
      }
      case 79: {
        return "不通过";
      }
    }
  }


  /* S 视频播放 */
  private show: Boolean = false;
  private showVideo: videoType = {
    url: "",
    image: '',
    title: "",
  };
  private openVideo(isArr:number,item: any,items: any,index: number) {
    // 对象
    if(isArr === 0){
      this.showVideo.url = item.resourceVideo;
      this.showVideo.image = item.resourceVideoCover;
      this.showVideo.title = item.resourceName;
    // 数组
    }else{
      this.showVideo.url = items;
      this.showVideo.image = item.videoCover[index];
      this.showVideo.title = item.resourceName;
    }
    this.show = true;
  }
  /* E 视频播放 */

  /* S 音频播放 */
  private showVoice = false;
  private voiceConf:{src?: string, title?: string, pic?:string} = {};
  private playVoice(item: voiceType) {
      this.showVoice = true;
      this.voiceConf.src = item.resourceAudio;
      this.voiceConf.pic = item.videoCover;
      this.voiceConf.title = item.resourceName;
  }
  /* E 音频播放 */

  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private imgTitle: String = '';
  private currIndex = 0;
  // 图片查看
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
  mounted() {
    this.getList();
  }

  /* S 审核 */
  private itemIndex: number = -1;
  private batch: Number = 0;//审核状态
  private auditResult: string = ""; //审核结果
  private dialogConfig: Boolean = false;// 弹框
  private batchAudit(index: any) {
    this.batch = 79;
    this.dialogConfig = true;
    this.itemIndex = index;
  }
  // 设置通过 || 不通过
  private setBatch(type: any) {
    this.batch = type;
  }
  private submitChecked(){
    if (this.batch === 0) {
      this.$Message.error("请选择是否通过！");
      return;
    }
    if (!this.auditResult && this.batch === 79) {
      this.$Message.error("请输入不通过原因！");
      return;
    }
    //审核
    setCommentAudit({
      auditStatus: this.batch,
      id: this.tableData.bodyList[this.itemIndex].id,
      auditResult: this.auditResult
    }).then(data => {
      if (data.code === 0) {
        this.dialogConfig = false;
        this.$Message.success("审核成功");
        //数据回显
        // this.tableData.bodyList[this.itemIndex].auditStatus = this.batch;
        // this.tableData.bodyList[this.itemIndex].auditType = "artificial";
        // this.tableData.bodyLis.splice(this.itemIndex, 1);
        this.getList();
        this.batch = 0;
      }
    });
  }
  /* E 审核 */

  /* S 全选/多选 */
  private idsArr: any;
  private handleSelectAll () {
    this.tableData.bodyList.forEach((element:any) => {
      element.checkValue = !this.allCheck
    });
  }
  private allCheck:boolean = false;//全选默认值

  @Watch("tableData.bodyList", {immediate: true, deep: true})
  wBodyList(nVal:any, old:any){
    let ids = nVal.filter((data:any)=>data.checkValue).map((data:any)=>data.id).join(',');
    this.idsArr = ids;
    // console.log(nVal.filter((data:any)=>data.checkValue).map((data:any)=>data.id).join(','))
    this.allCheck = !nVal.some((data:any)=> {
      return !data.checkValue
    })
  }
  // 多选

  private handleTags(id: any, flag: boolean) {
    id.checkValue = flag;
    return
  }
  /* E 全选/多选 */

  /* S 批量审核 */
  private number: Number = 0;
  private ids: String = '';
  private batchAuditModal: Boolean = false; // 弹框
  private batchs: any = {
    batchStatus: ''// 审核状态
  }
  private batchAuditFun(){
    if(!this.idsArr){
      this.$Message.error("请选择需要重审的数据！");
      return;
    }
    this.ids = this.idsArr;
    this.batchAuditModal = true;
    this.batchs.batchStatus = 79;
  }
  // 设置通过 || 不通过
  private setBatchs(type: any) {
    this.batch = type;
  }
  private batchSubmit(){
    setCommentBatchAudit({
      auditStatus: this.batchs.batchStatus,
      ids: this.ids
    }).then(data => {
      if (data.code === 0) {
        this.batchAuditModal = false;
        this.$Message.success("审核成功");
        this.getList();
        this.batch = 0;
      }
    });
  }
  /* E 批量审核 */

  /* S 搜索 */
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  /* E 搜索 */

  /* S 列表数据 */
  // 分页
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: "right"
  };
  private tableData: any = {
    bodyList: []
  };
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.params, page);
    getCommentList(this.params).then((data:any) => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = (data.datas as any).map((data:any)=> {
        data.checkValue = false;
        return data
      });
      this.loading = false;
    });
  }
  /* E 列表数据 */
}
</script>

<style lang='scss' scoped>
.tab-list {
  width: 100%;
  .item {
    margin-top: 15px;
    padding: 20px 0;
    font-size: 0;
    border: 1px solid #e2e2e2;
    .star-box {
      margin-top: 35%;
    }
    .stars {
      font-size: 22px;
      color: #e3e2e5;
      &.active {
        color: #feb133;
      }
    }
    .reply {
      margin: 12px 15px 0 5%;
      padding: 8px 10px;
      font-size: 12px;
      line-height: 18px;
      color: #333;
      background: #f7f7f7;
      span {
        color: $theme;
      }
    }
    .summary {
      margin-top: 10px;
      font-size: 12px;
      line-height: 18px;
      color: #333;
      span {
        display: inline-block;
        height: 16px;
        padding: 0 4px;
        margin-right: 5px;
        color: #fff;
        line-height: 16px;
        font-size: 10px;
        background: #feb133;
        vertical-align: top;
        border-radius: 4px;
      }
    }
    .img-list {
      margin-top: 5px;
      font-size: 0;
      .img {
        display: inline-block;
        width: 50px;
        height: 50px;
        margin: 8px 8px 0 0;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .item-box {
      display: flex;
      align-items: center;
      font-size: 0;
      .items {
        &:first-child {
          border: none;
        }
        .action-btn{
          cursor: pointer;
        }
      }
      .img{
        display: inline-block;
        width: 50px;
        height: 50px;
        margin: 8px 8px 0 0;
        cursor: pointer;
      }
    }
    .title-box {
      flex: 1;
      margin-left: 5%;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e2e2e2;
      .img-cover {
        width: 60px;
        height: 40px;
        margin-right: 15px;
        overflow: hidden;
        vertical-align: middle;
        img {
           width: 100%;
        }
        .cover{
          background-size: 40% 50%;
          display: block !important;
        }
        img{
          width:100%;
          height:100%;
        }
      }
      .title {
        flex: 1;
        color: $theme;
        font-size: 12px;
        line-height: 24px;
        overflow: hidden;
      }
      .pointer{
        cursor: pointer;
      }
    }

    .items {
      display: inline-block;
      vertical-align: top;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
    }
    .comment-content {
      width: 37%;
      .view-images-box{
        width: 50px;
        height: 50px;
        margin: 8px 8px 0 0;
        cursor: pointer;
        .cover{
          background-size: 50% 50%;
          display: block !important;
        }
      }
    }
    .checked {
      width: 5%;
      text-align: center;
      .ch {
        margin-bottom: 90%;
      }
    }
    .change {
      width: 10%;
      text-align: center;
      a {
        color: $theme;
        font-size: 12px;
        margin-left: 5px;
        &:hover {
          color: $theme-hover;
        }
      }
    }
    .status,
    .time,
    .star {
      /*width: 12%;*/
      width: 9%;
      text-align: center;
      font-size: 12px;
      color: #333;
    }
    &.header {
      display: flex;
      padding: 14px 0;
      align-items: center;
      background: #f2f2f2;
      border: none;
      .items {
        line-height: 18px;
        font-size: 12px;
        color: #333;
        border: none;
      }
    }
  }
}
.w150 {
  min-width: 150px;
}
.review-audit {
  padding:15px;
  .content {
    padding: 20px;
    background: #fff;
    width: calc(100vw - 40px);
    min-height: calc(100vh - 40px);
  }
  .search {
    padding: 20px 0 0;
    background: #f8fafe;
  }
}
.tag-list {
  margin-top: 12px;
  font-size: 0;
  .tags {
    padding: 0 12px;
    display: inline-block;
    margin: 8px 8px 0 0;
    font-size: 12px;
    color: #5ac858;
    height: 20px;
    line-height: 20px;
    background: rgba(90, 200, 88, 0.15);
  }
}
.no-data {
  height: 48px;
  line-height: 48px;
  color: #999;
  text-align: center;
  border: 1px solid #e2e2e2;
  border-top: 0;
}
.describe{
  .btn-box{
    display: flex;
    justify-content: center;
  }
}
.btns-group{
  width: 100%;
  text-align: right;
}
.active {
  border: 1px solid $theme;
}
.check{
  position: relative;
  top: 10px;
}
</style>
