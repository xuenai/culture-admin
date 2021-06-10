<template>
  <div class="analysis">
    <!-- 顶部筛选条件 -->
    <div class="top">
      <div class="btns top-item">
        <span
          class="btn"
          :class="{active: getIsActive('today')}"
          @click.stop="rangeDateClickHandle('today')"
        >今日</span>
        <span
          class="btn"
          :class="{active: getIsActive('yesterday')}"
          @click.stop="rangeDateClickHandle('yesterday')"
        >昨天</span>
        <span
          class="btn"
          :class="{active: getIsActive('week')}"
          @click.stop="rangeDateClickHandle('week')"
        >最近7天</span>
        <span
          class="btn"
          :class="{active: getIsActive('month')}"
          @click.stop="rangeDateClickHandle('month')"
        >最近30天</span>
      </div>
      <div class="datepicker-wrap top-item mr-8">
        自定义时间
        <DatePicker
          :editable="false"
          :clearable="false"
          :value="[params.startDate, params.endDate]"
          :options="datePickerOptions"
          class="datepicker width-175"
          separator="至"
          type="daterange"
          placeholder="请选择"
          @on-change="datePickerChange"
        ></DatePicker>
      </div>
    </div>
    <!-- 数据统计区域 -->
    <div class="analysis-content">
      <ul class="analysis-content-list">
        <li class="analysis-content-item">
          <p>
            新增故事数
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户新发布的审核通过的故事数。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.storyNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>
            新增攻略数
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户新发布的审核通过的攻略数。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.strategyNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>
            故事总数
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户发布的审核通过的时光故事数量。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.storyTotalNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>
            攻略总数
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户发布的审核通过的攻略数量。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.strategyTotalNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>
            浏览总数
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户每打开1个页面，记录1个浏览数。用户多次打开同一页面，浏览数累计多次。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.showNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>
            点赞总数
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户每点赞1个页面，记录1个点赞数。一个用户同一个页面只有一个点赞数。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.likeNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>
            收藏总数
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户每收藏1个页面，记录1个收藏数。一个用户同一个页面只有一个收藏数。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.collectionNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>
            点评总数
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户每点评1个内容，记录1个点评数。用户多次点评同一个内容，点评数累计多次。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.commentNum}}</em>
          </p>
        </li>
      </ul>
    </div>
    <!-- 搜索区域 -->
    <div class="search-content">
      <div class="top-item mr-8">
        <span class="inline-block mr-8">名称</span>
        <Input class="inline-block width-175" placeholder="请输入关键字" v-model="params.keyWord"></Input>
      </div>
      <div class="top-item mr-8">
        <span class="inline-block mr-8">所属标签</span>
        <Input class="inline-block width-175" placeholder="请输入标签名称" v-model="params.tagName"></Input>
      </div>
      <div class="top-item mr-8">
        <span class="inline-block mr-8">所属话题</span>
        <Input class="inline-block width-175" placeholder="请输入话题名称" v-model="params.topicName"></Input>
      </div>
      <div class="top-item mr-8">
        <Button type="primary" @click.stop="searchHandle">搜索</Button>
      </div>
    </div>
    <BaseTable :configure="configure" @getList="getList">
      <Table :columns="columns" :data="datas" :loading="loading" @on-sort-change="onSortChange">
        <template slot-scope="{row}" slot="story">
          <div class="story" v-if="row.storyType === 'story'" @click="goDetail(row)">
            <h3 class="title">{{row.title}}</h3>
            <div class="content mt10 line5" :title="row.content" v-html="row.content"></div>
            <ul class="img-list mt10" v-if="row.images.length">
              <li class="img daq-no-photo" v-for="(items,picInd) in row.images" :key="picInd">
                <img
                  :src="items"
                  class="cloud-img"
                  alt
                  @click.stop="viewImage(row.images,row.title,picInd)"
                />
              </li>
            </ul>
            <div class="info mt10">
              <div class="address" v-if="row.longitude && row.latitude && row.address != '-1'">
                <i class="cloud-icon">&#xe606;</i>
                {{row.address}}
              </div>
            </div>
          </div>
          <div class="story" v-if="row.storyType === 'strategy'"  @click="goDetail(row)">
            <h3 class="title">{{row.title}}</h3>
            <div class="trip-panel">
              <ul class="trip-list" v-if="row.strategyDetail.length">
                <li class="item" v-for="(item, index) in row.strategyDetail" :key="index + 'i'">
                  <span class="day">DAY{{index + 1}}</span>
                  <span class="scenic-name">{{item.title}}</span>
                </li>
              </ul>
            </div>
            <ul class="img-list mt10" v-if="row.images.length">
              <li class="img daq-no-photo" v-for="(items,picInd) in row.images" :key="picInd">
                <img
                  :src="items"
                  class="cloud-img"
                  alt
                  @click.stop="viewImage(row.images,row.title,picInd)"
                />
              </li>
            </ul>
          </div>
        </template>
        <template slot-scope="{row}" slot="label">
          <div class="labels">
            <p v-if="row.tagName">#{{row.tagName}}#</p>
            <p v-if="row.topicName">话题：# {{row.topicName}} #</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="createDate">
          <p>{{row.createDate.slice(0, 10)}}</p>
        </template>
      </Table>
    </BaseTable>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { BaseTable, PreviewPics } from "@components/index";
import { getStoryAnalyzeList, getStoryAnalyzeCount } from "@service/tool";

const DATE_FORMAT = "YYYY-MM-DD";

@Component({
  components: { BaseTable, PreviewPics }
})
export default class ContentAnalysis extends Vue {
  // 图片浏览
  visible = false;
  imgUrl: Array<string> = [];
  imgTitle = '';
  currIndex = 0;
  // 今天的日期 YYYY-MM-DD
  today = "";
  todayDaysOfYear = 0;
  // 分页器配置
  configure = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "center"
  };
  // 内容列表
  datas: any = [];
  // 获取的统计数据
  count: any = {
    storyNum: 0,
    strategyNum: 0,
    collectionNum: 0,
    commentNum: 0,
    likeNum: 0,
    showNum: 0,
    strategyTotalNum: 0,
    storyTotalNum:0,
  };
  // 表头
  columns = [
    {
      title: "故事",
      slot: "story",
      width: 500,
    },
    {
      title: "所属标签",
      slot: "label",
      align: "center"
    },
    {
      title: "发布时间",
      slot: "createDate",
      align: "center"
    },
    {
      title: "浏览量",
      key: "showNum",
      align: "center",
      sortable: 'custom',
    },
    {
      title: "点赞数",
      key: "likeNum",
      align: "center",
      sortable: 'custom',
    },
    {
      title: "收藏数",
      key: "collectionNum",
      align: "center",
      sortable: 'custom',
    },
    {
      title: "点评数",
      key: "commentNum",
      align: "center",
      sortable: 'custom'
    }
  ];
  // 表单加载动画
  loading = false;
  // 请求参数
  params = {
    currPage: 1,
    pageSize: 10,
    endDate: "",
    startDate: "",
    sortField: "",
    isAsc: false,
    keyWord: "",
    tagName: "",
    topicName: ""
  };
  /**
   * 跳转详情
   */
  goDetail (row: any) {
    let {href} = window.location;
    href = href.split('#/')[0];
    window.open(`${href}#/story-detail?id=${row.id}`, '_blank');
  }
  /**
   * 查看图片
   */
  private viewImage(url: any,name: string, index?: number) {
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
  // 日期选择器额外配置
  datePickerOptions = {
    disabledDate: (date: Date) => {
      let day = moment(date).dayOfYear();
      let todayDaysOfYear = moment().dayOfYear();
      // 大于今天的日期不可选中
      return day > todayDaysOfYear;
    }
  };
  /**
   * 表格排序变化时
   */
  onSortChange(data: any) {
    let { column, key, order } = data;
    switch (order) {
      case "normal": {
        this.params.sortField = "";
        this.params.isAsc = false;
        break;
      }
      case "asc": {
        this.params.sortField = key;
        this.params.isAsc = true;
        break;
      }
      case "desc": {
        this.params.sortField = key;
        this.params.isAsc = false;
        break;
      }
      default:
        break;
    }
    this.searchHandle();
  }
  /**
   * 搜索
   */
  searchHandle() {
    this.resetCurrPage();
    this.getListAndCount();
  }
  /**
   * 重置参数当前页数
   */
  resetCurrPage() {
    this.params.currPage = 1;
  }
  /**
   * 日期选择器变化
   */
  datePickerChange(dates: any) {
    if (dates.length) {
      this.params.startDate = dates[0];
      this.params.endDate = dates[1];
    } else {
      this.params.startDate = "";
      this.params.endDate = "";
    }
    this.params.keyWord = "";
    this.params.tagName = "";
    this.params.topicName = "";
    this.resetCurrPage();
    this.getListAndCount();
  }
  /**
   * 获取列表
   */
  getList(page?: any) {
    this.loading = true;
    if (page) {
      this.params.currPage = page.currPage;
      this.params.pageSize = page.pageSize;
    }
    getStoryAnalyzeList(this.params)
      .then(res => {
        if (res.code === 0) {
          this.datas = res.datas;
        }
        if (res.page) {
          this.configure.page = res.page as any;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  /**
   * 获取分析总数
   */
  getCount() {
    getStoryAnalyzeCount(this.params).then(res => {
      if (res.code === 0 && res.data) {
        this.count = res.data;
      }
    });
  }
  /**
   * 今日 昨天 最近7天 最近30天 按钮点击事件 之后重新获取数据
   * @params type {
   *  'today' 今天
   *  'yesterday' 昨天
   *  'week' 最近7天
   *  'month' 最近30天
   * }
   */
  rangeDateClickHandle(type: "today" | "yesterday" | "week" | "month") {
    let { startDate, endDate } = this.params;
    let today = this.today;
    let todayDaysOfYear = this.todayDaysOfYear;
    switch (type) {
      case "today": {
        this.params.startDate = today;
        this.params.endDate = today;
        break;
      }
      case "yesterday": {
        let yesterday = this.getOldDateByNum(todayDaysOfYear - 1);
        this.params.startDate = yesterday;
        this.params.endDate = yesterday;
        break;
      }
      case "week": {
        let start = this.getOldDateByNum(todayDaysOfYear - 6);
        this.params.startDate = start;
        this.params.endDate = today;
        break;
      }
      case "month": {
        let start = this.getOldDateByNum(todayDaysOfYear - 29);
        this.params.startDate = start;
        this.params.endDate = today;
        break;
      }
      default:
        break;
    }
    this.params.keyWord = "";
    this.params.tagName = "";
    this.params.topicName = "";
    this.resetCurrPage();
    this.getListAndCount();
  }
  /**
   * 获取今天的日期 格式YYYY-MM-DD 并且给params设置对应的值
   */
  getTodayDate() {
    let today = moment().format(DATE_FORMAT);
    this.params.startDate = today;
    this.params.endDate = today;
    this.today = today;
    this.todayDaysOfYear = moment(today).dayOfYear();
  }
  /**
   * 判断当前是否选中
   * @params type {
   *  'today' 今天
   *  'yesterday' 昨天
   *  'week' 最近7天
   *  'month' 最近30天
   * }
   * @return boolean 是否是选中
   */
  getIsActive(type: "today" | "yesterday" | "week" | "month") {
    let isActive = false;
    let { startDate, endDate } = this.params;
    let today = this.today;
    let todayDaysOfYear = this.todayDaysOfYear;
    switch (type) {
      case "today": {
        if (startDate === today && endDate === today) {
          isActive = true;
        }
        break;
      }
      case "yesterday": {
        let yesterday = this.getOldDateByNum(todayDaysOfYear - 1);
        if (startDate === yesterday && endDate === yesterday) {
          isActive = true;
        }
        break;
      }
      case "week": {
        let start = this.getOldDateByNum(todayDaysOfYear - 6);
        if (startDate === start && endDate === today) {
          isActive = true;
        }
        break;
      }
      case "month": {
        let start = this.getOldDateByNum(todayDaysOfYear - 29);
        if (startDate === start && endDate === today) {
          isActive = true;
        }
        break;
      }
      default:
        break;
    }
    return isActive;
  }
  /**
   * 获取第几天的日期
   * @params num {number}
   * @return {string} YYYY-MM-DD格式日期
   */
  getOldDateByNum(num: number) {
    return moment()
      .dayOfYear(num)
      .format(DATE_FORMAT);
  }
  /**
   * 获取统计数据和列表数据
   */
  getListAndCount() {
    this.getList();
    this.getCount();
  }
  created() {
    this.getTodayDate();
    this.getListAndCount();
  }
}
</script>

<style lang='scss' scoped>
.analysis {
  padding: 20px;
  .tip {
    cursor: pointer;
  }
  .text-red {
    color: $theColor1;
  }
  .text-blue {
    color: $theme;
  }
  .top {
    border-bottom: 4px solid $grayDark;
    border-radius: 2px;
  }
  .top-item {
    display: inline-block;
    vertical-align: top;
    line-height: 32px;
    margin-bottom: 16px;
  }
  .inline-block {
    display: inline-block;
  }
  .mr-8 {
    margin-right: 8px;
  }
  .width-175 {
    width: 180px;
  }
  .btns {
    font-size: 0;
    .btn {
      margin: 0 14px;
      font-size: 12px;
      color: $theme;
      cursor: pointer;
      line-height: 32px;
      &:hover {
        color: $theme-hover;
      }
      &.active {
        color: $theColor1;
        &:hover {
          color: $theColor1;
        }
      }
    }
  }
  .datepicker-wrap {
    .datepicker {
      margin-left: 8px;
    }
  }
  .search-content {
    background: $grayDark;
    padding: 20px 20px 4px;
    margin-bottom: 15px;
  }
  .analysis-content {
    margin: 15px 0;
    background: $grayDark;
    &-list {
      padding: 20px 0 0;
    }
    &-item {
      position: relative;
      display: inline-block;
      vertical-align: top;
      margin-bottom: 20px;
      padding: 0 40px;
      vertical-align: top;
      text-align: center;
      &::after {
        position: absolute;
        right: 0;
        top: 0;
        content: "";
        width: 1px;
        height: 100%;
        background: $borderDark;
      }
      &:last-of-type {
        &::after {
          display: none;
        }
      }
      p {
        font-size: 14px;
      }
      em {
        display: inline-block;
        padding-top: 8px;
        font-size: 18px;
        font-weight: 700;
        font-style: normal;
      }
    }
  }
}
.story {
  padding: 15px 0;
  cursor: pointer;
  .img-list {
    @include clearfix;
    .img {
      float: left;
      width: 50px;
      height: 50px;
      overflow: hidden;
      cursor: pointer;
      & + .img {
        margin-left: 5px;
      }
    }
  }
  .info {
    @include clearfix;
  }
  .address {
    float: left;
    background-color: $bg;
    padding: 2px 5px;
    border-radius: 4px;
    color: $font02;
  }
  .count-panel {
    float: left;
    margin-top: 2px;
    li {
      display: inline-block;
      margin-left: 10px;
      & + li {
        position: relative;
        padding-left: 8px;
        &:after {
          position: absolute;
          left: 0;
          top: 3px;
          content: "";
          height: 12px;
          width: 1px;
          background-color: $borderDark;
        }
      }
    }
  }
  .trip-panel {
    /*border:1px solid red;*/
    margin-bottom: 15px;
  }
  .trip-list {
    @include clearfix;
    .item {
      vertical-align: top;
      position: relative;
      display: inline-block;
      height: 1px;
      border-top: 1px solid $borderLight;
      min-width: 70px;
      max-width: 150px;
      margin: 30px 0;
      text-align: center;
      &:before {
        top: -5px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid $borderLight;
      }
      &:first-of-type {
        &:before {
          position: absolute;
          content: "";
          left: -10px;
        }
      }
      &:last-of-type {
        &:before {
          position: absolute;
          content: "";
          right: -10px;
        }
      }
      &:after {
        position: absolute;
        left: 50%;
        top: 0;
        content: "";
        height: 10px;
        width: 1px;
        border-left: 1px dashed $borderLight;
      }
    }
    .day {
      position: absolute;
      width: 100%;
      text-align: center;
      top: -20px;
      left: 0;
    }
    .scenic-name {
      display: block;
      width: 100%;
      text-align: center;
      padding-top: 10px;
      @include ellipsis();
    }
  }
}
</style>
