<template>
  <!-- 审核-内容审核-点评 -->
  <div class="review-audit">
    <Tabs active-key="key1" class="tab-warp" :animated="false" @on-click="setState">
      <Tab-pane label="全部" class="tab-pane"></Tab-pane>
      <Tab-pane :label="number04 > 0 ? waitLabel : '待审核'"></Tab-pane>
      <Tab-pane label="不通过"></Tab-pane>
      <Tab-pane label="审核异常"></Tab-pane>
    </Tabs>
      <Form :label-width="80" inline class="form">
        <FormItem class="item" label="点评关键字">
            <Input placeholder="点评关键字" v-model="params.name" :maxlength="20" />
        </FormItem>
        <FormItem class="item" label="数据类型">
          <Select v-model="params.resourceType" class="w200">
            <Option v-for="(item,i) in resourceType" :key="i" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
          <FormItem class="item" label="点评类型">
              <Select class="w200" v-model="params.level">
                  <Option value="">全部</Option>
                  <Option value="0">好评</Option>
                  <Option value="1">差评</Option>
                  <Option value="2">一般</Option>
              </Select>
          </FormItem>
        <FormItem class="item" label="审核状态" v-if="showAuditStatus">
          <Select v-model="params.auditStatus" class="w200">
            <Option v-for="(item,i) in auditStatus" :key="i" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="审核方式">
          <Select v-model="params.auditType" class="w200">
            <Option v-for="(item,i) in auditType" :key="i" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="点评时间">
            <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            @on-change="setTime"
          ></Date-picker>
          <Button class="ml20" type="primary" @click="search">搜索</Button>
          <Button
            v-if="operates.includes('batchCheck') && showBatchAuditFun"
            class="ml20"
            type="primary"
            @click="batchAuditFun"
          >批量审核</Button>
        </FormItem>
      </Form>
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
          v-for="(item,ind) in tableData.bodyList"
          :key="item.id"
          :loading="loading"
        >
          <div class="title-box">
            <!-- 资源视频 -->
            <div
              class="img-cover daq-no-photo view-images-box"
              v-if="item.resourceVideo"
              @click="openVideo(0,item,1,1)"
            >
              <span class="cover"></span>
              <img :src="item.videoCover" alt v-if="item.videoCover" class="daq-img" />
            </div>
            <div
              class="img-cover daq-no-photo view-images-box"
              v-if="item.resourceAudio"
              @click.stop="playVoice(item)"
            >
              <span class="cover"></span>
              <img
                :src="item.resourceAudioCover"
                alt
                v-if="item.resourceAudioCover"
                class="daq-img"
              />
            </div>
            <div class="img-cover" v-if="item.resourceImage">
              <img :src="item.resourceImage" alt class="daq-img" @click.stop="viewImage([item.resourceImage])" />
            </div>
            <a class="title" @click="goToDetail(item)">{{item.resourceName}}</a>
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
                <span v-show="item.video && item.video.length>=1">视频 </span>
                {{item.content}}
              </p>

              <div class="clearfix">
                <!-- 评论视频 -->
                <div v-if="item.video && item.video.length>=1">
                  <div
                  class="img daq-no-photo view-images-box fl"
                  v-for="(items,picInd) in item.video"
                  :key="picInd"
                  @click="openVideo(1,item,items,picInd)"
                  >
                    <span class="cover"></span>
                    <img :src="item.videoCover[picInd]" v-if="item.videoCover" class="daq-img" />
                  </div>
                </div>
                <!-- 评论图片 -->
                <div class="img-list">
                  <p class="img fl" v-for="(items, imgIdx) in item.image" :key="items">
                    <img :src="items" class="daq-img" @click.stop="viewImage(item.image, imgIdx)" />
                  </p>
                </div>
              </div>
            </div>
            <div class="star items">{{getDataTxt(item.resourceType)}}</div>
            <div class="star items">{{item.vipNickName}}</div>
            <div class="star items">{{['好评', '差评', '一般'][item.level]||'--'}}</div>
            <p class="time items">{{item.commentTime}}</p>
            <p class="status items">{{getauditStatusTxt(item.auditStatus)}}</p>
            <p class="status items">{{getauditTypeTxt(item.auditType) || '-'}}</p>
            <p class="change items">
              <a
                class="theme-blue action-btn"
                v-if="item.auditStatus === 500 || item.auditStatus === 4 && operates.includes('audit')"
                @click="batchAudit(ind,item.auditStatus)"
              >审核</a>
              <a
                class="theme-blue action-btn"
                v-if="item.auditStatus === 79 || item.auditStatus === 6 && operates.includes('audit')"
                @click="batchAudit(ind,item.auditStatus)"
              >复审</a>
            </p>
          </div>
          <p class="reply" v-if="item.commentReply">
            <span>回复：</span>
            {{item.commentReply}}
          </p>
        </li>
        <li v-if="!tableData.bodyList.length" class="no-data">暂无数据</li>
      </ul>
      <!-- <span class="check">
        <Checkbox :value="allCheck" @on-change="handleSelectAll">全选</Checkbox>
      </span> -->
    </baseTable>
    <!-- 审核 -->
    <Modal title="审核意见" v-model="dialogConfig" footer-hide width="500">
      <div class="describe">
        <div class="btn-box">
          <Button class="item" @click="setBatch(6)" :class="batch === 6 ? 'active' : ''">通过</Button>
          <Button class="item ml20" @click="setBatch(79)" :class="batch === 79 ? 'active' : ''">不通过</Button>
        </div>
        <Input
          v-model="auditResult"
          type="textarea"
          class="mt20"
          :maxlength="200"
          placeholder="请输入不通过原因"
          v-show="batch === 79"
        />
        <p v-if="batch === 79">200字以内</p>
      </div>
      <!-- 快捷回复 -->
      <fastReply @reply="getReply" class="mt10" style="margin-left:-30px;" v-if="batch === 79"></fastReply>
      <div class="btns-group mt20">
        <Button @click="dialogConfig=false">取消</Button>
        <Button class="ml20" type="primary" @click="submitChecked">确认审核</Button>
      </div>
    </Modal>
    <!-- 批量审核 -->
    <Modal title="批量审核" v-model="batchAuditModal" footer-hide width="500">
      <div class="describe">
        <p style="color: red" class="tc">您正在进行批量审核操作，请谨慎操作！</p>
        <div class="btn-box mt20">
          <Button class="item" :class="batch===6?'active':''" @click="setBatchs(6)">通过</Button>
          <Button class="item ml20" :class="batch===79?'active':''" @click="setBatchs(79)">不通过</Button>
        </div>
      </div>
      <div class="btns-group mt20">
        <Button @click="batchAuditModal=false">取消</Button>
        <Button class="ml20" type="primary" @click="batchSubmit">确认审核</Button>
      </div>
    </Modal>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="picIndex"></PreviewPics>
    <!-- 视频播放 -->
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
    <!-- 播放音频 -->
    <VoicePop :show="showVoice" :close="()=>{showVoice = false}" :voiceConf="voiceConf"></VoicePop>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import VideoPlayer from "@components/video-play/video-play.vue";
import baseTable from "@components/baseTable/baseTable.vue";
import MediaPop from "@components/pop/media-pop.vue";
import VoicePop from "@components/pop/voice-pop.vue";
import fastReply from "@views/pages/common/fast-reply.vue";
import { AppModule } from "@store/modules/app";
import { PreviewPics } from "@components/index";
import { DATAS_TYPES, AUDIT_STATUS, AUDIT_TYPES } from "@constant/index";
import {
  getCommentList,
  setCommentAudit,
  setCommentBatchAudit
} from "@service/content";
interface videoType {
  url: String;
  image: String;
  title: String;
}
interface voiceType {
  id: number;
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
    PreviewPics,
    fastReply
  }
})
export default class RevierAudit extends Vue {
  //设置快捷回复
    getReply(item:any){
        this.auditResult=item;
    }
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private loading: Boolean = true; // 数据是否加载中
  private resourceType: any = DATAS_TYPES; // 场所类型
  private auditStatus: any = [
  {
    value: '',
    name: '全部'
  },
  {
    value: '4',
    name: '待审核'
  },
  {
    value: '79',
    name: '不通过'
  },
  {
    value: '500',
    name: '审核异常'
  }
]; // 审核状态
  private auditType: any = AUDIT_TYPES; // 审核方式
  // 接口请求params
  private params: any = {
    name: "", // 点评关键字
    auditStatus: "", // 审核状态
    auditType: "", // 审核方式
    resourceType: "", // 资源类型
    startDate: "", // 开始时间
    endDate: "" // 结束时间
  };

  // 时间
  private setTime(e: any) {
    this.params.startDate = e[0];
    this.params.endDate = e[1];
  }
  goToDetail (item: any) {
    let route:any
    switch (item.resourceType) {
      case "CONTENT": {
        route = {
          path: '/con-detail',
          query: {
            id: item.resourceId,
            contentType: 'CONTENT',
            modify: 1
          }
        }
        break;
      }
      case "CONTENT_TYPE_SCENERY": {
        route = {
          path: '/scenic-detail',
          query: {
            id: item.resourceId,
            type: 'list'
          }
        };
        break;
      }
      case "CONTENT_TYPE_HOTEL": {
        route = {
          path: '/hotel-detail',
          query: {
            id: item.resourceId,
            type: 'list'
          }
        };
        break;
      }
      case "CONTENT_TYPE_RESTAURANT": {
        route = {
          path: '/food-detail',
          query: {
            id: item.resourceId,
            type: 'list'
          }
        };
        break;
      }
      case "CONTENT_TYPE_VENUE": {
        route = {
          path: '/venues-detail',
          query: {
            id: item.resourceId,
            type: 'list'
          }
        };
        break;
      }
      case "CONTENT_TYPE_ACTIVITY": {
        route = {
          path: '/ac-detail',
          query: {
            id: item.resourceId
          }
        };
        break;
      }
      case "CONTENT_TYPE_STORY": {
        route = {
          path: '/story-detail',
          query: {
            id: item.resourceId
          }
        };
        break;
      }
      case "CONTENT_TYPE_ASSOCIATION": {
        route = {
          path: '/community-detail',
          query: {
            id: item.resourceId,
            type: 'list'
          }
        };
        break;
      }
      case "CONTENT_TYPE_VOLUNTEER_TEAM":{
        route = {
          path: `/volunteers-detail-team/${item.resourceId}`,
        };
        break;
      }
    }
    this.$router.push(route)
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
      case "CONTENT_TYPE_HOTEL": {
        return "酒店";
      }
      case "CONTENT_TYPE_RESTAURANT": {
        return "餐饮";
      }
      case "CONTENT_TYPE_VENUE": {
        return "文化场馆";
      }
      case "CONTENT_TYPE_ACTIVITY": {
        return "活动";
      }
      case "CONTENT_TYPE_STORY": {
        return "故事";
      }
      case "CONTENT_TYPE_ASSOCIATION": {
        return "社团";
      }
      case "CONTENT_TYPE_VOLUNTEER_TEAM":{
        return "志愿者团队";
      }
      case "CONTENT_TYPE_COURSE":{
        return "上学堂评论";
      }
    }
  }

  //获取审核方式
  private getauditTypeTxt(type: string) {
    switch (type) {
      case "artificial": {
        return "人工审核";
      }
      case "machine": {
        return "人工智能";
      }
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
      case 500: {
        return "审核异常";
      }
    }
  }

  /* S tab */
  private number04: Number = 0; // 待审核
  private showAuditStatus: boolean = true; // 是否显示审核状态查询条件
  private showBatchAuditFun: boolean = true; // 是否显示 批量审核 按钮
  private setState(index: Number) {
    this.showAuditStatus = false;
    this.showBatchAuditFun = false;
    switch (index) {
      case 0:
        this.params.auditStatus = "";
        this.showAuditStatus = true;
        break;
      case 1:
        this.params.auditStatus = 4;
        this.showBatchAuditFun = true;
        break;
      case 2:
        this.params.auditStatus = 79;
        break;
      case 3:
        this.params.auditStatus = 500;
        break;
    }
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  //tab 状态待审核数量
  private waitLabel(h: any) {
    let _this = this;
    return h("div", [
      h("span", "待审核"),
      h("Badge", {
        props: {
          count: _this.number04
        }
      })
    ]);
  }
  private getAuditCount(status: number) {
    getCommentList({
      auditStatus: status
    }).then((data: any) => {
      if (status === 4) {
        this.number04 = data.page ? (data.page.total as Number) : 0;
      }
    });
  }
  /* E tab */

  /* S 视频播放 */
  private show: Boolean = false;
  private showVideo: videoType = {
    url: "",
    image: "",
    title: ""
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
  private voiceConf: { src?: string; title?: string; pic?: string } = {};
  private playVoice(item: voiceType) {
    this.showVoice = true;
    this.voiceConf.src = item.resourceAudio;
    this.voiceConf.pic = item.videoCover[0];
    this.voiceConf.title = item.resourceName;
  }
  /* E 音频播放 */

  /* S 查看大图 */
  private imgUrl: Array<string> = [];
  private visible: Boolean = false; // 图片查看
  private picIndex = 0;
  private viewImage(url: Array<string>, index: number) {
    this.imgUrl = url;
    this.visible = true;
    this.picIndex = index;
  }
  /* E 查看大图 */
  mounted() {
    this.getList();
    this.getAuditCount(4);
    this.getAuditCount(79);
    this.getAuditCount(500);
  }

  /* S 审核 */
  private itemIndex: number = -1;
  private batch: Number = 0; // 审核状态
  private auditResult: string = ""; // 审核结果
  private dialogConfig: Boolean = false; // 弹框
  private batchAudit(index: number, num: number) {
    if (num === 6) {
      this.batch = 79;
    }
    if (num === 79) {
      this.batch = 6;
    }
    this.dialogConfig = true;
    this.itemIndex = index;
  }
  // 设置通过 || 不通过
  private setBatch(type: any) {
    this.batch = type;
  }
  private submitChecked() {
    if (this.batch === 0) {
      this.$Message.error("请选择是否通过");
      return;
    }
    if (!this.auditResult && this.batch === 79) {
      this.$Message.error("请输入不通过原因");
      return;
    }
    setCommentAudit({
      auditStatus: this.batch,
      id: this.tableData.bodyList[this.itemIndex].id,
      auditResult: this.auditResult
    }).then(data => {
      if (data.code === 0) {
        this.dialogConfig = false;
        this.$Message.success("审核成功");
        this.tableData.bodyList[this.itemIndex].auditStatus = this.batch;
        this.tableData.bodyList[this.itemIndex].auditType = "artificial";
        (this.tableData.bodyList as any).splice(this.itemIndex, 1);
        this.auditResult = "";
        this.getList();
        this.getAuditCount(4);
        this.getAuditCount(79);
        this.getAuditCount(500);
        this.batch = 0;
      }
    });
  }
  /* E 审核 */
  /* S 批量审核 */
  private ids: String = "";
  private batchAuditModal: Boolean = false; // 弹框
  private batchs: any = {
    batchStatus: "" // 审核状态
  };
  private batchAuditFun() {
    if (!this.idsArr) {
      this.$Message.error("请选择需要审核的数据");
      return;
    }
    this.ids = this.idsArr;
    this.batchAuditModal = true;
    // this.batchs.batchStatus = 79;
    this.batch= 79;
  }
  // 设置通过 || 不通过
  private setBatchs(type: any) {
    this.batch = type;
  }
  private batchSubmit() {
    setCommentBatchAudit({
      auditStatus: this.batch,
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

  /* S 全选/多选 */
  private idsArr: any;
  private handleSelectAll() {
    this.tableData.bodyList.forEach((element: any) => {
      element.checkValue = !this.allCheck;
    });
  }
  private allCheck: boolean = false; // 全选默认值

  @Watch("tableData.bodyList", { immediate: true, deep: true })
  wBodyList(nVal: any, old: any) {
    let ids = nVal
      .filter((data: any) => data.checkValue)
      .map((data: any) => data.id)
      .join(",");
    this.idsArr = ids;
    this.allCheck = !nVal.some((data: any) => {
      return !data.checkValue;
    });
  }
  // 多选
  private handleTags(id: any, flag: boolean) {
    id.checkValue = flag;
    return;
  }
  /* E 全选/多选 */

  /* S 搜索 */
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  /* E 搜索 */

  /* S 列表数据 */
  //分页
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
    getCommentList(this.params).then((data: any) => {
      if (data.code === 0) {
        this.tableConfig.page = data.page ? data.page : {};
        console.log(data);
        this.tableData.bodyList = (data.datas as any).map((data: any) => {
          data.checkValue = false;
          return data;
        });
        this.loading = false;
      }
    });
  }
  /* E 列表数据 */
}
</script>

<style lang='scss' scoped>
.tab-list {
  width: 100%;
  .item {
    margin-top: 20px;
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
      }
      .img {
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
        cursor: pointer;
        img {
            width: 100%;
        }
        .cover {
          background-size: 40% 50%;
          display: block !important;
        }
      }
      .title {
        flex: 1;
        color: $theme;
        font-size: 12px;
        line-height: 24px;
        overflow: hidden;
        &:hover {
          color: $theme-hover;
        }
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
      width: 36%;
      .view-images-box {
        width: 50px;
        height: 50px;
        margin: 8px 8px 0 0;
        .cover {
          background-size: 50% 50%;
          display: block !important;
        }
      }
    }
    .checked {
      width: 4%;
      text-align: center;
      .ch {
        margin-bottom: 90%;
      }
    }
    .change {
      width: 6%;
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
.w200 {
  min-width: 150px;
}
.review-audit {
  padding: 0 15px 15px;
  .content {
    padding: 20px;
    background: #fff;
    width: calc(100vw - 40px);
    min-height: calc(100vh - 40px);
  }
  .form{
    background: $grayLight;
    margin-bottom: 15px;
    padding-top: 15px;
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
.describe {
  .btn-box {
    display: flex;
    justify-content: center;
  }
}
.btns-group {
  width: 100%;
  text-align: right;
}
.active {
  border: 1px solid $theme;
}
.check {
  position: relative;
  top: 10px;
}

</style>
