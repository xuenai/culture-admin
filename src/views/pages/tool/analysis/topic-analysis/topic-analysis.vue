<template>
  <div class="analysis">
    <!-- 顶部筛选条件 -->
    <div class="top">
      <div class="btns top-item">
        <span class="btn" :class="{active: getIsActive('today')}" @click.stop="rangeDateClickHandle('today')">今日</span>
        <span class="btn" :class="{active: getIsActive('yesterday')}"  @click.stop="rangeDateClickHandle('yesterday')">昨天</span>
        <span class="btn" :class="{active: getIsActive('week')}"  @click.stop="rangeDateClickHandle('week')">最近7天</span>
        <span class="btn" :class="{active: getIsActive('month')}"  @click.stop="rangeDateClickHandle('month')">最近30天</span>
      </div>
      <div class="datepicker-wrap top-item mr-8">
        自定义时间
        <DatePicker :editable="false" :clearable="false" :value="[params.startDate, params.endDate]" :options="datePickerOptions" class="datepicker width-175" separator="至" type="daterange" placeholder="请选择" @on-change="datePickerChange"></DatePicker>
      </div>
    </div>
    <!-- 数据统计区域 -->
    <div class="analysis-content">
      <ul class="analysis-content-list">
        <li class="analysis-content-item">
          <p>新增话题数</p>
          <p>
            <em>{{count.topicNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>参与总人数 <Poptip trigger="hover" word-wrap :width="150" content="统计参与话题的用户数量。"><Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" /></Poptip></p>
          <p>
            <em>{{count.participationPeopleNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>参与总数 <Poptip trigger="hover" word-wrap :width="150" content="统计话题下的内容数。"><Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" /></Poptip></p>
          <p>
            <em>{{count.participationNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>浏览总数 <Poptip trigger="hover" word-wrap :width="150" content="用户每打开1个页面，记录1个浏览数。用户多次打开同一页面，浏览数累计多次。"><Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" /></Poptip></p>
          <p>
            <em>{{count.showNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>点赞总数 <Poptip trigger="hover" word-wrap :width="150" content="用户每点赞1个页面，记录1个点赞数。一个用户同一个页面只有一个点赞数。"><Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" /></Poptip></p>
          <p>
            <em>{{count.likeNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>收藏总数 <Poptip trigger="hover" word-wrap :width="150" content="用户每收藏1个页面，记录1个收藏数。一个用户同一个页面只有一个收藏数。"><Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" /></Poptip></p>
          <p>
            <em>{{count.collectionNum}}</em>
          </p>
        </li>
        <li class="analysis-content-item">
          <p>点评总数 <Poptip trigger="hover" word-wrap :width="150" content="用户每点评1个内容，记录1个点评数。用户多次点评同一个内容，点评数累计多次。"><Icon class="tip" custom="iconfont c-icon--quetion-pane" size="12" /></Poptip></p>
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
        <Input class="inline-block width-175" placeholder="请输入关键字" v-model="params.name"></Input>
      </div>
      <div class="top-item mr-8">
        <Button type="primary" @click.stop="searchHandle">搜索</Button>
      </div>
      <div class="top-item">
        <Button @click.stop="exportFile">导出</Button>
      </div>
    </div>
    <BaseTable :configure="configure" @getList="getList">
      <Table :columns="columns" :data="datas" :loading="loading" @on-sort-change="onSortChange">
        <template slot="name" slot-scope="{row}">
          <div><span class="text-red" v-if="row.top">[置顶]</span><span class="text-red" v-if="row.recommendChannelHomePage || row.recommendHomePage">[推荐]</span><router-link class="mr-8" :to="{path: '/topic-detail', query: {id: row.id, from: 'analysis'}}" target="_blank">#&nbsp;{{row.name}}&nbsp;#</router-link></div>
        </template>
      </Table>
    </BaseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import moment from 'moment';
import { BaseTable } from "@components/index";
import {
  getTopicAnalyzeList,
  getTopicAnalyzeCount,
  exportTopicAnalyzeList,
} from "@service/tool";


const DATE_FORMAT = 'YYYY-MM-DD';

@Component({
  components: { BaseTable }
})
export default class ContentAnalysis extends Vue {
  // 今天的日期 YYYY-MM-DD
  today = '';
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
  datas:any = [];
  // 获取的统计数据
  count:any = {
    topicNum:0,
    participationPeopleNum: 0,
    participationNum: 0,
    collectionNum: 0,
    commentNum: 0,
    likeNum: 0,
    showNum: 0,
  };
  // 表头
  columns = [
    {
      title: "话题名称",
      slot: "name",
    },
    {
      title: '发布时间',
      key: 'createTime',
      width: 140,
      align: 'center',
    },
    {
      title: '参与入口点击量',
      key: 'participationTopicClickNum',
      width: 150,
      sortable: 'custom',
      align: 'center',
    },
    {
      title: '参与人数',
      key: 'participationPeopleNum',
      width: 120,
      sortable: 'custom',
      align: 'center',
    },
    {
      title: '参与量',
      key: 'participationNum',
      width: 100,
      sortable: 'custom',
      align: 'center',
    },
    {
      title: "浏览量",
      key: "showNum",
      align: "center",
      sortable: 'custom',
      width: 100,
    },
    {
      title: "点赞数",
      key: "likeNum",
      align: "center",
      sortable: 'custom',
      width: 100,
    },
    {
      title: "收藏数",
      key: "collectionNum",
      align: "center",
      sortable: 'custom',
      width: 100,
    },
    {
      title: "点评数",
      key: "commentNum",
      align: "center",
      width: 100,
      sortable: 'custom'
    }
  ];
  // 表单加载动画
  loading = false;
  // 请求参数
  params = {
    currPage: 1,
    pageSize: 10,
    endDate: '',
    startDate: '',
    sortField: '',
    isAsc: false,
    name: ''
  };
  // 日期选择器额外配置
  datePickerOptions = {
    disabledDate:  (date: Date) => {
      let day = moment(date).dayOfYear();
      let todayDaysOfYear = moment().dayOfYear();
      // 大于今天的日期不可选中
      return day > todayDaysOfYear;
    }
  }
  /**
   * 表格排序变化时
   */
  onSortChange(data: any) {
    let {column, key, order} = data;
    switch (order) {
      case 'normal':
        {
          this.params.sortField = '';
          this.params.isAsc = false;
          break;
        }
      case 'asc':
        {
          this.params.sortField = key;
          this.params.isAsc = true;
          break;
        }
      case 'desc':
        {
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
   * 导出文件
   */
  exportFile () {
    exportTopicAnalyzeList(this.params).then(res => {
      if (res.code === 0) {
        this.$Message.success('导出话题分析数据成功！')
      }
    })
  }
  /**
   * 搜索
   */
  searchHandle () {
    this.resetCurrPage();
    this.getListAndCount();
  }
  /**
   * 重置参数当前页数
   */
  resetCurrPage () {
    this.params.currPage = 1;
  }
  /**
   * 日期选择器变化
   */
  datePickerChange (dates:any){
    if (dates.length) {
      this.params.startDate = dates[0];
      this.params.endDate = dates[1];
    } else {
      this.params.startDate = '';
      this.params.endDate = '';
    }
    this.params.name = '';
    this.resetCurrPage();
    this.getListAndCount()
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
    getTopicAnalyzeList(this.params)
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
  getCount () {
    getTopicAnalyzeCount(this.params).then(res => {
      if (res.code === 0 && res.data) {
        this.count = res.data;
      }
    })
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
  rangeDateClickHandle (type: 'today' | 'yesterday' | 'week' | 'month') {
    let {startDate, endDate} = this.params;
    let today = this.today;
    let todayDaysOfYear = this.todayDaysOfYear;
    switch (type) {
      case 'today':
        {
          this.params.startDate = today;
          this.params.endDate = today;
          break;
        }
      case 'yesterday':
        {
          let yesterday =  this.getOldDateByNum(todayDaysOfYear - 1);
          this.params.startDate = yesterday;
          this.params.endDate = yesterday;
          break;
        }
      case 'week':
        {
          let start = this.getOldDateByNum(todayDaysOfYear - 6);
          this.params.startDate = start;
          this.params.endDate = today;
          break;
        }
      case 'month':
        {
          let start = this.getOldDateByNum(todayDaysOfYear - 29);
          this.params.startDate = start;
          this.params.endDate = today;
          break;
        }
      default:
        break;
    }
    this.params.name = '';
    this.resetCurrPage();
    this.getListAndCount()
  }
  /**
   * 获取今天的日期 格式YYYY-MM-DD 并且给params设置对应的值
   */
  getTodayDate () {
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
  getIsActive (type: 'today' | 'yesterday' | 'week' | 'month') {
    let isActive = false;
    let {startDate, endDate} = this.params;
    let today = this.today;
    let todayDaysOfYear = this.todayDaysOfYear;
    switch (type) {
      case 'today':
        {
          if (startDate === today && endDate === today) {
            isActive = true;
          }
          break;
        }
      case 'yesterday':
        {
          let yesterday =  this.getOldDateByNum(todayDaysOfYear - 1);
          if (startDate === yesterday && endDate === yesterday) {
            isActive = true;
          }
          break;
        }
      case 'week':
        {
          let start = this.getOldDateByNum(todayDaysOfYear - 6);
          if (startDate === start && endDate === today) {
            isActive = true;
          }
          break;
        }
      case 'month':
        {
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
  getOldDateByNum (num: number) {
    return moment().dayOfYear(num).format(DATE_FORMAT)
  }
  /**
   * 获取统计数据和列表数据
   */
  getListAndCount () {
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
  .tip{
    cursor: pointer;
  }
  .text-red{
    color:$theColor1;
  }
  .text-blue{
    color:$theme;
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
  .search-content{
    background: $grayDark;
    padding:20px 20px 4px;
    margin-bottom:15px;
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
</style>
