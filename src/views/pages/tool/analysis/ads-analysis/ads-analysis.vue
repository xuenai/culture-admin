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
      <div class="top-item mr-8">
        <span class="inline-block mr-8">标题</span>
        <Input class="inline-block width-175" placeholder="广告名称" v-model="params.name"></Input>
      </div>
      <div class="top-item mr-8">
        <span class="inline-block mr-8">广告位</span>
        <Select class="inline-block width-175" clearable v-model="params.adPositionId">
          <Option v-for="item in adsPos" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </div>
      <div class="top-item mr-8">
        <span class="inline-block mr-8">发布渠道</span>
        <Select class="inline-block width-175" clearable v-model="params.publishChannel">
          <Option v-for="item in publishChannel" :value="item.value" :key="item.name">{{item.name}}</Option>
        </Select>
      </div>
      <div class="top-item mr-8">
        <Button type="primary" @click.stop="searchHandle">搜索</Button>
      </div>
    </div>
    <!-- 数据统计区域 -->
    <div class="analysis-content">
      <ul class="analysis-content-list">
        <li class="analysis-content-item">
          <p>广告总数</p>
          <p>
            <em>{{count.adNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>
            总点击量
            <Poptip
              trigger="hover"
              word-wrap
              :width="150"
              content="用户每点击1个广告图，记录1个点击量。同一个广告位多张广告图被点击，记录多个点击量。"
            >
              <Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" />
            </Poptip>
          </p>
          <p>
            <em>{{count.clickNum}}</em>
          </p>
        </li>
      </ul>
    </div>
    <BaseTable :configure="configure" @getList="getList">
      <Table :columns="columns" :data="datas" :loading="loading" @on-sort-change="onSortChange">
        <template slot-scope="{row}" slot="imgs">
          <div class="clearfix p-td-15">
            <p
              class="img fl"
              v-for="(item, picIndex) in row.images"
              :key="item"
              v-show="row.images && row.images.length"
            >
              <img class="daq-img" :src="item" @click.stop="viewImage(row.images, picIndex)" />
            </p>
          </div>
          <span v-if="!row.images.length">-</span>
        </template>
        <template slot-scope="{row}" slot="publishChannel">{{getPubChannelTxt(row.publishChannel)}}</template>
      </Table>
    </BaseTable>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="picIndex"></PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import { BaseTable, PreviewPics } from "@components/index";
import {
  getAdPoList,
  getAdsAnalyzeList,
  getAdsAnalyzeCount
} from "@service/tool";
import { getChannelList } from "@service/content";

const DATE_FORMAT = "YYYY-MM-DD";

@Component({
  components: { BaseTable, PreviewPics }
})
export default class ContentAnalysis extends Vue {
  // 图片查看
  imgUrl: Array<string> = [];
  visible = false;
  picIndex = 0;
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
    adNum: 0,
    clickNum: 0
  };
  // 发布渠道列表
  publishChannel = [
    {
      name: "PC",
      value: "PC"
    },
    {
      name: "APP",
      value: "APP"
    },
    {
      name: "微网站",
      value: "MICRO_SITE"
    },
    {
      name: "小程序",
      value: "SMALL_PROGRAM"
    }
  ]
  // 表头
  private columns = [
    {
      title: "广告图",
      key: "imgs",
      slot: "imgs"
    },
    {
      title: "广告名称",
      key: "name"
    },
    {
      title: "所属广告位",
      key: "adPositionName"
    },
    {
      title: "发布渠道",
      slot: "publishChannel"
    },
    {
      title: "点击量",
      key: "clickNum",
      align: "center",
      sortable: 'custom',
      width: 100
    }
  ];
  // 表单加载动画
  loading = false;
  // 请求参数
  params = {
    currPage: 1,
    pageSize: 10,
    adPositionId: "",
    publishChannel: "",
    endDate: "",
    startDate: "",
    sortField: "",
    name: "",
    isAsc: false
  };
  adsPos: any = [];
  /**
   * 获取发布渠道文字
   */
  getPubChannelTxt(txt: string){
    switch (txt) {
      case "MICRO_SITE": {
        return "微网站"
      }
      case "SMALL_PROGRAM": {
        return "小程序"
      }
      default:{
        return txt;
      }
    }
  }
  /**
   * 查看大图
   */
  viewImage(url: Array<string>, index: number) {
    this.imgUrl = url;
    this.visible = true;
    this.picIndex = index;
  }
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
    getAdsAnalyzeList(this.params)
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
    getAdsAnalyzeCount(this.params).then(res => {
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
  /**
   * 获取广告位
   */
  getAdsPositions () {
    getAdPoList({analyze: true}).then(res => {
      if (res.code === 0) {
        this.adsPos = res.datas;
      }
    })
  }
  created() {
    this.getTodayDate();
    this.getAdsPositions();
    this.getListAndCount();
  }
}
</script>

<style lang='scss' scoped>
.analysis {
  padding: 20px;
  .p-td-15 {
    padding: 15px 0;
  }
  .img {
    width: 82px;
    height: 50px;
    overflow: hidden;
    cursor: pointer;
    margin: 10px 10px 10px 0;
    img {
      min-width: 100%;
      height: 100%;
    }
  }
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
  .analysis-content {
    margin: 15px 0;
    background: $grayDark;
    &-list {
      padding: 20px 0;
    }
    &-item {
      position: relative;
      display: inline-block;
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
</style>
