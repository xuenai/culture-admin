<template>
  <div class="ivu-picker-panel-body">
    <!-- 年月头 -->
    <div class="ivu-date-picker-header">
      <span
        class="ivu-picker-panel-icon-btn ivu-date-picker-prev-btn ivu-date-picker-prev-btn-arrow-double"><i @click="clickYear(-1)" class="ivu-icon ivu-icon-ios-arrow-back"></i></span>
      <span
        class="ivu-picker-panel-icon-btn ivu-date-picker-prev-btn ivu-date-picker-prev-btn-arrow"><i @click="clickMonth(-1)"
          class="ivu-icon ivu-icon-ios-arrow-back"></i></span>

      <span>
        <span class="ivu-date-picker-header-label">{{ year }}年</span>
        <span class="ivu-date-picker-header-label">{{ month }}月</span>
      </span>

      <span
        class="ivu-picker-panel-icon-btn ivu-date-picker-next-btn ivu-date-picker-next-btn-arrow-double"><i @click="clickYear(1)"
          class="ivu-icon ivu-icon-ios-arrow-forward"></i></span>
      <span
        class="ivu-picker-panel-icon-btn ivu-date-picker-next-btn ivu-date-picker-next-btn-arrow"><i @click="clickMonth(1)"
          class="ivu-icon ivu-icon-ios-arrow-forward"></i></span>
    </div>

    <!-- 日期面板 -->
    <div class="ivu-date-picker-cells">
      <!-- 星期 -->
      <div class="ivu-date-picker-cells-header">
        <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
      </div>

      <!-- 日期号 -->
      <span v-for="day in days" :key="day.date" class="ivu-date-picker-cells-cell"
        :class="{ 'ivu-date-picker-cells-cell-prev-month': day.noType === -1,
                  'ivu-date-picker-cells-cell-today': day.today,
                  'ivu-date-picker-cells-cell-selected': day.checked,
                  'ivu-date-picker-cells-cell-range': day.range,
                  'ivu-date-picker-cells-cell-next-month': day.noType === 1}"
        @click="clickDayNo(day)"
        @mouseenter="handleMouseenter(day)">
        <em>{{ day.no }}</em><i class="greet line2" :title="day.tip" v-if="day.tip">{{ day.tip }}</i>
      </span>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { getCalendarList } from "@service/tool";

enum Direction {
  prev = -1,
  next = 1
}

enum NoType {
  prev = -1, // 上月的日期号
  center = 0, // 当月的日期号
  next = 1 // 下月的日期号
}

interface day {
  no: number; // 日期号
  date: string; // 日期 YYYY-MM-DD
  tip: string; // 问候语
  noType: NoType;
  checked: boolean;
  today: boolean;
  range: boolean;
}

@Component({
  components: {}
})
export default class ComponentName extends Vue {
  private year: number = new Date().getFullYear();
  private month: number = new Date().getMonth() + 1;
  get prevYear(): number {
    let { year, month } = this;
    return month - 1 < 1 ? year - 1 : year
  }
  get prevMonth(): number {
    let { month } = this;
    return month - 1 < 1 ? 12 : month - 1
  }
  get nextYear(): number {
    let { year, month } = this;
    return month + 1 > 12 ? year + 1 : year
  }
  get nextMonth(): number {
    let { month } = this;
    return month + 1 > 12 ? 1 : month + 1
  }

  // 点击月
  private clickMonth(dire: Direction): void {
    let { prevYear, prevMonth, year, month, nextYear, nextMonth } = this;
    if (dire === Direction.prev) {
      this.month = prevMonth;
      this.year = prevYear;
    } else if (dire === Direction.next) {
      this.month = nextMonth;
      this.year = nextYear;
    }
    this.getDays()
  }
  // 点击年
  private clickYear(dire: Direction): void {
    let year = this.year + dire;
    if (year < 1970) {
      year = 1970
    } else if (year > 2100) {
      year = 2100
    }
    this.year = year
    this.getDays()
  }

  private days: day[] = []
  private tips: any[] = []
  // 当前渲染面板日期数组
  private getDays(): void {
    this.wrapGetCalendarList();
    let { prevYear, prevMonth, year, month, nextYear, nextMonth } = this;
    let date: Date = new Date(`${year}-${month}-1`);
    let week = date.getDay();
    let len = 6 * 7;
    let res: Array<day> = new Array(len);
    let days: number = this.countDays(year, month);
    let prevDays: number = this.countDays(prevYear, prevMonth);
    let nowYear: number = new Date().getFullYear();
    let nowMonth: number = new Date().getMonth() + 1;
    let nowDate: number = new Date().getDate();

    // 构建原始数据
    for (let i = 0; i < len; i++) {
      let d: day = {
        no: 0,
        date: "",
        tip: "",
        noType: NoType.center,
        checked: false,
        today: false,
        range: false,
      };
      if (i + 1 <= week) {
        // 上月
        d.no = prevDays - week + i + 1;
        d.date = `${prevYear}-${("0" + prevMonth).slice(-2)}-${("0" + d.no).slice(-2)}`;
        d.noType = NoType.prev;
        d.today = nowYear === prevYear && nowMonth === prevMonth && nowDate === d.no;
      } else if (i + 1 - week <= days) {
        // 当月
        d.no = i + 1 - week;
        d.date = `${year}-${("0" + month).slice(-2)}-${("0" + d.no).slice(-2)}`;
        d.noType = NoType.center;
        d.today = nowYear === year && nowMonth === month && nowDate === d.no;
      } else {
        // 下月
        d.no = i + 1 - week - days;
        d.date = `${nextYear}-${("0" + nextMonth).slice(-2)}-${("0" + d.no).slice(-2)}`;
        d.noType = NoType.next;
        d.today = nowYear === nextYear && nowMonth === nextMonth && nowDate === d.no;
      }
      
      res[i] = d;
    }

    // 选中、range 回显
    let { day1, day2 } = this
    if (day1 && day2) {
      res.forEach((d:day) => {
        let pass1 = d.date >= (day1 as day).date && d.date <= (day2 as day).date
        let pass2 = d.date >= (day2 as day).date && d.date <= (day1 as day).date
        d.range =  pass1 || pass2

        // day1 day2更新对象
        if (d.date === (day1 as day).date) {
          d.checked = true
          this.day1 = d
        }
        if (d.date === (day2 as day).date) {
          d.checked = true
          this.day2 = d
        }
      })
    }

    this.days = res;
  }
  // 根据年月获取当前月的天数
  private countDays(year: number, month: number): number {
    let leapYear: boolean = false; // 闰年
    let days = 0; // 当月天数

    if (year % 100 === 0) {
      leapYear = year % 400 === 0;
    } else {
      leapYear = year % 4 === 0;
    }

    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      days = 31;
    } else if (month === 2) {
      days = leapYear ? 29 : 28;
    } else {
      days = 30;
    }

    return days;
  }

  // day1 day2不做大小区分
  private day1: day | null = null
  private day2: day | null = null
  // 点击日期号执行选中日期设置
  private clickDayNo(day: day) {
    let { day1, day2 } = this
    if (day1 === null) {
      day.checked = true
      day.range = true
      this.day1 = day
      this.$emit('select', null)
    } else if (day2 === null) {
      day.checked = true
      this.day2 = day
      let tip = null // 当前选中单个日期的数据，只有选择单个日期的时候才往外送数据，当前接口获取每月数据导致，日期范围的选择的不合适往外送数据
      if (day1.date === day.date) {
        tip = this.tips.find((tip:any) => (day1 as any).date === tip.specificDate)
      }
      this.$emit('select', day1.date < day.date ? { start: day1.date, end: day.date, tip } : { start: day.date, end: day1.date, tip })
    } else {
      this.days.forEach((d:day) => d.range = false)
      day1.checked = day2.checked = false
      day.checked = true
      day.range = true
      this.day1 = day
      this.day2 = null
      this.$emit('select', null)
    }
  }
  // 鼠标移动的时候添加在range内效果
  private handleMouseenter(day: day) { 
    let { day1, day2 } = this
    if ((day1 === null || day2 === null) && (day1 || day2)) {
      let checkedDay: day = (day1 || day2) as day
      this.days.forEach((d:day) => {
        let pass1 = d.date >= day.date && d.date <= checkedDay.date
        let pass2 = d.date >= checkedDay.date && d.date <= day.date
        d.range =  pass1 || pass2
      })
    }
  }
  // 单个获取tip
  private getCalendarList(year: number, month: number): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      getCalendarList({year, month}).then((res:any) => {
        if (res.code === 0) {
          resolve(res.datas)
        } else {
          reject()
        }
      }).catch(() => reject())
    })
  }
  // 获取上中下月tip
  private wrapGetCalendarList():Promise<any> {
    let { year, month } = this
    let usedYear = year, usedMonth = month;
    return Promise.all([
      this.getCalendarList(this.prevYear, this.prevMonth),
      this.getCalendarList(year, month),
      this.getCalendarList(this.nextYear, this.nextMonth)
    ]).then(res => {
      if (usedYear === this.year && usedMonth === this.month) {
        this.tips = [...res[0], ...res[1], ...res[2]]
        this.days.forEach((d:day) => {
          let tip = this.tips.find((tip:any) => d.date === tip.specificDate)
          if (tip) d.tip = tip.greetings
        })
      }
    })
  }
  // 刷新
  private refresh() {
    this.day1 = null;
    this.day2 = null;
    this.getDays()
    this.$emit('select', null)
  }
  created() {
    this.getDays()
  }
}
</script>

<style lang='scss' scoped>
.ivu-picker-panel-body {
  width: 888px;
  float: none;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);

  .ivu-date-picker-header-label:hover {
    color: #515a6e;
    cursor: text;
  }
  .ivu-date-picker-cells {
    width: auto;
    span {
      width: 124px;
      text-align: center;
      vertical-align: top;
      em {
        font-size: 14px;
      }
    }
    .ivu-date-picker-cells-header {
      span {
        width: 120px;
      }
    }
    .greet {
      position: relative;
      margin-top: -5px;
      padding: 0 4px;
      line-height: 18px;
      color: #aaa;
    }
    .ivu-date-picker-cells-cell {
      height: 70px;
    }
  }
}
</style>
