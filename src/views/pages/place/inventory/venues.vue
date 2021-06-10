<template>
  <div class="container">
    <div>
      <span>场馆名称：</span>
      <Select
        class="w150"
        v-model="venuesId"
        @on-change="getVenuesName"
        :label-in-value="true"
        filterable
        :placeholder="venuesName"
      >
        <Option
          :value="item.id"
          v-for="(item, index) in venuesList"
          :key="item.id"
          :selected="index == 0 ? true : false"
          >{{ item.name }}</Option
        >
      </Select>
      <!-- <Button type="primary" class="ml20">搜索</Button> -->
    </div>
    <div class="venues-info">
      <p class="venues-name">{{ venuesName }} - 预约库存</p>
      <div class="btn">
        <Button
          type="primary"
          @click="
            () => {
              modelShow = true
            }
          "
          >批量设置</Button
        >
        <Button type="primary" class="ml10" @click="goRecord">操作记录</Button>
      </div>
    </div>
    <div class="ivu-picker-panel-body">
      <!-- 年月头 -->
      <div class="ivu-date-picker-header">
        <span
          class="ivu-picker-panel-icon-btn ivu-date-picker-prev-btn ivu-date-picker-prev-btn-arrow-double"
          ><i
            @click="clickYear(-1)"
            class="ivu-icon ivu-icon-ios-arrow-back"
          ></i
        ></span>
        <span
          class="ivu-picker-panel-icon-btn ivu-date-picker-prev-btn ivu-date-picker-prev-btn-arrow"
          ><i
            @click="clickMonth(-1)"
            class="ivu-icon ivu-icon-ios-arrow-back"
          ></i
        ></span>

        <span>
          <span class="ivu-date-picker-header-label">{{ year }}年</span>
          <span class="ivu-date-picker-header-label">{{ month }}月</span>
        </span>

        <span
          class="ivu-picker-panel-icon-btn ivu-date-picker-next-btn ivu-date-picker-next-btn-arrow-double"
          ><i
            @click="clickYear(1)"
            class="ivu-icon ivu-icon-ios-arrow-forward"
          ></i
        ></span>
        <span
          class="ivu-picker-panel-icon-btn ivu-date-picker-next-btn ivu-date-picker-next-btn-arrow"
          ><i
            @click="clickMonth(1)"
            class="ivu-icon ivu-icon-ios-arrow-forward"
          ></i
        ></span>
      </div>
      <!-- 日期面板 -->
      <div class="calendar ivu-date-picker-cells">
        <!-- 星期 -->
        <div class="ivu-date-picker-cells-header">
          <span class="item" v-for="item in week">{{ item }}</span>
        </div>
        <!-- 日期号 -->
        <span
          v-for="day in days"
          :key="day.date"
          class="ivu-date-picker-cells-cell"
          :class="{
            'ivu-date-picker-cells-cell-prev-month': day.noType === -1,
            'ivu-date-picker-cells-cell-today': day.today,
            'ivu-date-picker-cells-cell-selected': day.checked,
            'ivu-date-picker-cells-cell-range': day.range,
            'ivu-date-picker-cells-cell-next-month': day.noType === 1
          }"
          @click="setDay(day)"
        >
          <em>{{ day.no }}</em
          ><i class="greet line2" :class="{green:day.tip>0}" :title="day.tip">{{
            day.tip
          }}</i>
        </span>
      </div>
    </div>
    <!-- 批量设置弹窗 -->
    <Modal
      v-model="modelShow"
      title="批量设置"
      class="modal-local-settin-info"
      :closable="false"
    >
      <Form
        :label-width="110"
        :model="params"
        :rules="ruleValidate"
        ref="venueModal"
      >
        <div style="font-weight:600;font-size:15px;">{{ venuesName }}</div>
        <FormItem label="预约状态：" prop="isOpen" class="mt20">
          <RadioGroup v-model="params.isOpen">
            <Radio :label="1">
              <span>开启</span>
            </Radio>
            <Radio :label="0">
              <span>不开启</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="最大接待人数："
          prop="maxNum"
          v-if="params.isOpen == 1"
        >
          <number
            class="control"
            v-model="params.maxNum"
            placeholder=""
            :max="99999999"
          />
        </FormItem>
      </Form>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" type="text" size="large" @click.stop="closeModal"
          >取消</Button
        >
        <Button class="btn" type="primary" @click.stop="updateVenueSetUp"
          >确定</Button
        >
      </div>
    </Modal>
    <!-- 预约情况弹窗 -->
    <Modal
      v-model="orderShow"
      :title="`预约情况（${dateInfo}）`"
      class="modal-order"
      footer-hide
    >
      <div class="item">
        <span class="label-name">已预约：</span>
        <p class="content">{{ orderData.orderTotal }}人</p>
      </div>
      <div class="item">
        <span class="label-name">最大预约人数：</span>
        <p class="content">{{ orderData.maxNum }}人</p>
      </div>
      <div class="item">
        <span class="label-name">个人预约：</span>
        <p class="content">{{ orderData.personNum }}人</p>
      </div>
      <div class="item">
        <span class="label-name">团队预约：</span>
        <p class="content">
          {{ orderData.teamTypeNum }}个，共{{ orderData.teamNum }}人
        </p>
      </div>
      <div class="item">
        <span class="label-name">预约时段：</span>
        <div
          class="content"
          v-if="orderData.orderListTime && orderData.orderListTime.length"
        >
        <p v-for="item in orderData.orderListTime">
          {{ item.orderTimeSubStart }}-{{
            item.orderTimeSubEnd
          }}
          {{ item.num }}人
          </p>
        </div>
        <div class="content" v-else>暂无预约</div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getVenueIsOpenList,
  getOrderStockList,
  venueOrderDateNumFromSite,
  updateVenueSetUpParameter,
  getVenueOrderInfoByDate
} from '@service/place'
interface day {
  no: number // 日期号
  date: string // 日期 YYYY-MM-DD
  tip: string // 可预订数量
  maxNum: number // 最大预约数
  noType: NoType
  checked: boolean
  today: boolean
  range: boolean
}
enum Direction {
  prev = -1,
  next = 1
}
enum NoType {
  prev = -1, // 上月的日期号
  center = 0, // 当月的日期号
  next = 1 // 下月的日期号
}
@Component({
  components: {}
})
export default class venuesList extends Vue {
  /**S 预约设置弹窗 */
  orderShow: any = false
  orderData: any = {}
  getVenueOrderInfoByDate(date: any, maxNum: any) {
    getVenueOrderInfoByDate({
      venueId: this.venuesId,
      date: date
    }).then((res: any) => {
      if (res.code === 0) {
        this.orderData = res.data
        this.orderData.maxNum = maxNum
      }
    })
  }
  /**E 预约设置弹窗 */
  /**S 批量设置 */
  modelShow: any = false
  params: any = {
    isOpen: 0, //预约状态
    maxNum: '' //最大接待人数
  }
  //验证
  private ruleValidate: any = {
    isOpen: [{ required: true, message: '请选择预约状态' }],
    maxNum: [{ required: true, message: '请填写最大接待人数', trigger: 'blur' }]
  }
  updateVenueSetUp() {
    this.params.maxNum = this.params.isOpen == 1 ? this.params.maxNum : '0'
    ;(this.$refs.venueModal as any).validate((valid: any) => {
      if (valid) {
        updateVenueSetUpParameter(
          Object.assign(this.params, {
            venueId: this.venuesId
          })
        ).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success('设置成功');
            this.modelShow = false;
            this.params.maxNum = '';
             this.getDays();
          }
        })
      }
    })
  }
  closeModal() {
    this.modelShow = false
    this.params.maxNum = ''
  }
  /**E 批量设置 */
  /**S 场馆列表 */
  venuesList: any = []
  venuesId: string = ''
  venuesName: string = ''
  //所有场馆列表
  getVenuesList() {
    getVenueIsOpenList({}).then((res: any) => {
      if (res.code === 0) {
        this.venuesList = res.datas
        this.venuesName = res.datas[0].name
        this.venuesId = res.datas[0].id
        this.getDays()
      }
    })
  }
  getVenuesName(data: any) {
    this.venuesName = data.label
    this.getDays()
  }
  /**E 场馆列表 */
  /**S 场馆可预约数量 */
  orderList: any = []
  getVenueOrderNum() {
    return Promise.all([
      this.getOrderStockList(this.year + '-' + this.month),
      this.venueOrderDateNumFromSite(
        this.year +
          '-' +
          (this.month <= 9 ? '0' + this.month : this.month) +
          '-' +
          this.date
      )
    ]).then((data: any) => {
      this.orderList = data[0].map((item: any, index: any) => {
        item.orderNum = item.maxNum - data[1][index].orderNum
        return item
      })
      this.days.forEach((d: day) => {
        let tip = this.orderList.find((tip: any) => d.date === tip.date)
        if (tip) {
          if(tip.openStatus==1)d.tip=(tip.orderNum>=0?(tip.orderNum>0?tip.orderNum:'已订完'):0);
          if(tip.openStatus==0)d.tip='闭馆';
          if(tip.openStatus==-1) d.tip='';
          d.maxNum = tip.maxNum
        }
      })
    })
  }
  //所有场馆

  getOrderStockList(date: any) {
    return new Promise((resolve: Function, reject: Function) => {
      getOrderStockList({
        venueId: this.venuesId,
        date: date
      })
        .then((res: any) => {
          if (res.code === 0) {
            resolve(res.data.dateInfo)
          }
        })
        .catch(() => reject())
    })
  }
  //已预订场馆
  venueOrderDateNumFromSite(date: any) {
    return new Promise((resolve: Function, reject: Function) => {
      venueOrderDateNumFromSite({
        venueId: this.venuesId,
        date: date
      })
        .then((res: any) => {
          if (res.code === 0) {
            resolve(res.datas)
          }
        })
        .catch(() => reject())
    })
  }
  /**E 场馆可预约数量 */
  /**S 日历 */
  week: any = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  private year: number = new Date().getFullYear()
  private month: number = new Date().getMonth() + 1
  private date: number = new Date().getDate()
  get prevYear(): number {
    let { year, month } = this
    return month - 1 < 1 ? year - 1 : year
  }
  get prevMonth(): number {
    let { month } = this
    return month - 1 < 1 ? 12 : month - 1
  }
  get nextYear(): number {
    let { year, month } = this
    return month + 1 > 12 ? year + 1 : year
  }
  get nextMonth(): number {
    let { month } = this
    return month + 1 > 12 ? 1 : month + 1
  }
  // 根据年月获取当前月的天数
  private countDays(year: number, month: number): number {
    let leapYear: boolean = false // 闰年
    let days = 0 // 当月天数

    if (year % 100 === 0) {
      leapYear = year % 400 === 0
    } else {
      leapYear = year % 4 === 0
    }

    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      days = 31
    } else if (month === 2) {
      days = leapYear ? 29 : 28
    } else {
      days = 30
    }

    return days
  }

  // 当前渲染面板日期数组
  private days: day[] = []
  private getDays(): void {
    // this.wrapGetCalendarList();
    this.getVenueOrderNum()
    let { prevYear, prevMonth, year, month, nextYear, nextMonth } = this
    let date: Date = new Date(`${year}-${month}-1`)
    let week = date.getDay()
    let len = 6 * 7
    let res: Array<day> = new Array(len)
    let days: number = this.countDays(year, month)
    let prevDays: number = this.countDays(prevYear, prevMonth)
    let nowYear: number = new Date().getFullYear()
    let nowMonth: number = new Date().getMonth() + 1
    let nowDate: number = new Date().getDate()

    // 构建原始数据
    for (let i = 0; i < len; i++) {
      let d: day = {
        no: 0,
        date: '',
        tip: '',
        maxNum: 0,
        noType: NoType.center,
        checked: false,
        today: false,
        range: false
      }
      if (i + 1 <= week) {
        // 上月
        d.no = prevDays - week + i + 1
        d.date = `${prevYear}-${('0' + prevMonth).slice(-2)}-${(
          '0' + d.no
        ).slice(-2)}`
        d.noType = NoType.prev
        d.today =
          nowYear === prevYear && nowMonth === prevMonth && nowDate === d.no
      } else if (i + 1 - week <= days) {
        // 当月
        d.no = i + 1 - week
        d.date = `${year}-${('0' + month).slice(-2)}-${('0' + d.no).slice(-2)}`
        d.noType = NoType.center
        d.today = nowYear === year && nowMonth === month && nowDate === d.no
      } else {
        // 下月
        d.no = i + 1 - week - days
        d.date = `${nextYear}-${('0' + nextMonth).slice(-2)}-${(
          '0' + d.no
        ).slice(-2)}`
        d.noType = NoType.next
        d.today =
          nowYear === nextYear && nowMonth === nextMonth && nowDate === d.no
      }

      res[i] = d
    }

    // 选中、range 回显
    let { day1, day2 } = this
    if (day1 && day2) {
      res.forEach((d: day) => {
        let pass1 = d.date >= (day1 as day).date && d.date <= (day2 as day).date
        let pass2 = d.date >= (day2 as day).date && d.date <= (day1 as day).date
        d.range = pass1 || pass2

        // day1 day2更新对象
        if (d.date === (day1 as day).date) {
          d.checked = true
          // @ts-ignore
          this.day1 = d
        }
        if (d.date === (day2 as day).date) {
          d.checked = true
          // @ts-ignore
          this.day2 = d
        }
      })
    }

    this.days = res
  }
  // 点击年
  private clickYear(dire: Direction): void {
    let year = this.year + dire
    if (year < 1970) {
      year = 1970
    } else if (year > 2100) {
      year = 2100
    }
    this.year = year
    this.getDays()
  }
  // 点击月
  private clickMonth(dire: Direction): void {
    let { prevYear, prevMonth, year, month, nextYear, nextMonth } = this
    if (dire === Direction.prev) {
      this.month = prevMonth
      this.year = prevYear
    } else if (dire === Direction.next) {
      this.month = nextMonth
      this.year = nextYear
    }
    this.getDays()
  }
  //点击天
  dateInfo: any = ''
  setDay(day: any) {
    this.orderShow = true
    this.dateInfo = day.date
    this.getVenueOrderInfoByDate(day.date, day.maxNum)
  }
  /**E 日历 */
  mounted() {
    this.getVenuesList()
  }
  goRecord(){
    this.$router.push({path:'/venue-record',query:{venueId:this.venuesId}})
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 15px 15px 0 15px;
  .calendar {
    .tr {
      display: flex;
      .td {
        flex: 1;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }
  }
  .ivu-picker-panel-body {
    width: 80%;
    margin-left: 10%;
    float: none;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    .ivu-date-picker-header {
      height: 50px;
      line-height: 50px;
    }
    .ivu-picker-panel-icon-btn {
      margin-top: 10px;
    }
    .ivu-date-picker-header-label:hover {
      color: #515a6e;
      cursor: text;
    }
    .ivu-date-picker-cells {
      width: auto;
      span {
        width: 14%;
        text-align: center;
        vertical-align: top;
        em {
          font-size: 14px;
        }
      }
      .ivu-date-picker-cells-header {
        span {
          width: 13.7%;
          height: 40px;
          line-height: 40px;
          color:#6c6e71;
          font-weight: 600;
        }
        background-color:#f8f8f8;
      }
      .greet {
        position: relative;
        margin-top: -5px;
        padding: 0 4px;
        line-height: 18px;
        color: #aaa;
        &.green{
          color:$success;
        }
      }
      .ivu-date-picker-cells-cell {
        height: 70px;
        // line-height: 70px;
      }
    }
  }
  .venues-info {
    padding: 20px;
    display: flex;
    .venues-name {
      flex: 1;
      font-size: 16px;
      font-weight: 700;
    }
  }
}
.w150 {
  width: 150px;
}
.control {
  width: 300px;
}
.modal-order {
  .date {
    border: 1px solid;
  }
  .item {
    padding: 10px 0;
    .label-name {
      display: inline-block;
      width: 85px;
      text-align: right;
      vertical-align:top;
    }
    .content {
      display: inline-block;
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
