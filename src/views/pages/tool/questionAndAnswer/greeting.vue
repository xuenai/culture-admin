<template>
  <Form ref="form" :model="params" :label-width="84" class="form pd20">
    <FormItem label="功能性问候语">
      <Checkbox label="twitter" v-model="params.weatherRemind" class="fun_item">
        <span>天气提示</span>
      </Checkbox>
      <Checkbox label="facebook" v-model="params.dailyRemind" class="fun_item">
        <span>节假日问候及自定义</span>
      </Checkbox>
      <SetDate class="setdate"></SetDate>

      <Checkbox label="github" class="fun_item" v-model="params.periodRemind">
        <span>时间段提示</span>
      </Checkbox>
      <div class="time_item" v-for="(data, i) in timeSlots" :key="i">
        <TimePicker type="timerange" :value="[data.startTime, data.endTime]" placeholder="请选择时间段"
          class="w168" @on-change="arr => { data.startTime = arr[0];data.endTime = arr[1]; }">
        </TimePicker>
        <Input class="w168" :maxlength="100" placeholder="请输入提示语" v-model="data.greetings" />
        <Input class="w168" :maxlength="500" placeholder="请输入跳转链接" v-model="data.url" />
        <Input class="w168" :maxlength="500" placeholder="请输入APP跳转链接" v-model="data.appUrl" />
        <span class="delete-btn ques-btn"
          @click="timeSlots.length > 1 && timeSlots.splice(i, 1)">-</span>
        <span class="add-btn ques-btn"
          @click="timeSlots.splice(i + 1, 0, {startTime: '',endTime: '',greetings: '',url: '',appUrl: ''})">+</span>
      </div>

      <div class="position">
        <span>监测定位</span>
        <Checkbox class="item" v-model="params.sceneryPositionRemind" label="snapchat">
          <span>监测在景区大门1000 米内，提示门票</span>
          <Input class="w300" :maxlength="100" placeholder="请输入提示语" v-model="params.sceneryPositionGreeting" />
        </Checkbox>
        <Checkbox class="item" v-model="params.activityPositionRemind" label="snapchat">
          <span>监测在活动1000米内，提示有活动在附近正在举行，引导去看看</span>
          <Input class="w300" :maxlength="100" placeholder="请输入提示语" v-model="params.activityPositionGreeting" />
        </Checkbox>
      </div>

      <Checkbox label="snapchat" class="fun_item" v-model="params.birthdayRemind">
        <span>生日问候</span>
        <Input class="birth_tip" placeholder="请输入生日问候语" :maxlength="100" v-model="params.birthdayGreeting" />
      </Checkbox>
    </FormItem>

    <FormItem label="">
      <Button type="primary" @click="()=>saveGreetingsConfig()">保存</Button>
    </FormItem>
  </Form>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import SetDate from "./date/index.vue";
import { getGreetingsConfig, saveGreetingsConfig } from "@service/tool";

@Component({
  components: {
    SetDate
  }
})
export default class ComponentName extends Vue {
  private params: any = {
    weatherRemind: false,
    dailyRemind: false,
    periodRemind: false,
    birthdayRemind: false,
    activityPositionRemind: false,
    activityPositionGreeting: "",
    sceneryPositionRemind: false,
    sceneryPositionGreeting: "",
    birthdayGreeting: "",
    periodGreetingsList: ""
  };
  created() {
    this.getGreetingsConfig();
  }
  private timeSlots: any[] = [
    { startTime: "", endTime: "", greetings: "", url: "", appUrl: "" }
  ];
  @Watch("timeSlots", { deep: true })
  checkTimeSlots(v: any): boolean {
    // 这里就简单的只做时间是否交叉判断，返回是否验证失败
    let tmp: any[] = v.filter((d: any) => d.startTime);
    let tip = "";
    if (tmp.length > 1) {
      if (tmp.some((d: any) => d.startTime === d.endTime))
        tip = "开始结束时间不能相同";
      else if (
        tmp.some((d: any, i: number) =>
          tmp.some(
            (e: any, j: number) => {
              if (i === j) { // 自己不和自己做比较
                return false
              } else {
                return e.startTime < d.endTime && e.endTime > d.startTime
              }
            }
          )
        )
      )
        tip = "开始结束时间不能有交叉";
    }
    if (tip) this.$Message.info(tip);
    return Boolean(tip);
  }
  private saveGreetingsConfig() {
    if (this.checkTimeSlots(this.timeSlots)) return;
    let tip = "";
    if (
      this.params.activityPositionRemind &&
      !this.params.activityPositionGreeting
    ) {
      tip = "请输入活动定位提示语";
    } else if (
      this.params.sceneryPositionRemind &&
      !this.params.sceneryPositionGreeting
    ) {
      tip = "请输入景区定位提示语";
    } else if (this.params.birthdayRemind && !this.params.birthdayGreeting) {
      tip = "请输入生日问候语";
    } else if (this.params.periodRemind) {
      this.timeSlots.some((d: any) => {
        let pass1 = !d.startTime || !d.endTime;
        let pass2 = !d.greetings;
        if (pass1) {
          tip = "时间段提示项内请选择时间段";
        } else if (pass2) {
          tip = "时间段提示项内请输入提示语";
        }
        return pass1 || pass2;
      });
    } else if (!this.params.periodRemind) {
      this.timeSlots.some((d: any) => {
        // 没勾选时间端提示的时候，一个都没填的项是可以通过的，只要填了一点就必须填规矩
        if (d.startTime || d.endTime || d.url || d.appUrl || d.greetings) {
          let pass1 = !d.startTime || !d.endTime;
          let pass2 = !d.greetings;
          if (pass1) {
            tip = "时间段提示项内请选择时间段";
          } else if (pass2) {
            tip = "时间段提示项内请输入提示语";
          }
          return pass1 || pass2;
        }
      });
    }
    if (tip) {
      this.$Message.info(tip);
      return;
    }

    this.params.periodGreetingsList = JSON.stringify(
      this.timeSlots.filter((d: any) => d.startTime && d.greetings)
    );
    saveGreetingsConfig(this.params).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("保存成功！");
      }
    });
  }
  private getGreetingsConfig() {
    getGreetingsConfig().then((res: any) => {
      if (res.code === 0 && res.data) {
        this.params = { ...this.params, ...res.data };
        if (res.data.periodGreetingsList) {
          let list = res.data.periodGreetingsList;
          if (list.length) this.timeSlots = list;
        }
      }
    });
  }
}
</script>

<style lang='scss' scoped>
.w300 {
  width: 300px;
}
.setdate {
  padding: 0 19px 10px;
}
.fun_item {
  display: block;
  .birth_tip {
    margin-left: 10px;
    width: 300px;
    display: inline-block;
  }
}

.table-head {
  padding: 16px 0;
  background-color: #e9eaec;
}
.row {
  display: flex;
  padding: 10px 0;
  line-height: 22px;
  margin: 10px 0;
  border: 1px solid #e9eaec;
  flex-wrap: wrap;
  .ele {
    width: calc((100% - 800px) / 3);
    &:first-child {
      width: 800px;
      padding-left: 33px;
      & ~ .ele {
        text-align: center;
      }
    }
  }
}
.nodata {
  text-align: center;
  line-height: 100px;
}
.w250 {
  width: 250px;
}
.content {
  padding: 20px 15px;
  .switchBox {
    position: relative;
    height: 22px;
    display: inline-block;
    .cover {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .form {
    background: $grayLight;
    padding: 15px 0 0;
    margin-bottom: 15px;
  }
  .switchLabel {
    margin-right: 5px;
  }
  .control {
    color: $theme;
    margin-right: 5px;
    cursor: pointer;
  }
}

.ques-btn {
  margin-left: 10px;
  width: 20px;
  height: 20px;
  display: inline-block;
  border: 1px solid;
  border-radius: 50%;
  position: relative;
  top: 6px;
  text-align: center;
  font-size: 20px;
  line-height: 15px;
  cursor: pointer;
  color: #3fa0da;
  transition: 0.3s;
  overflow: hidden;
  &:hover {
    color: #77c2ef;
  }
  &.add-btn {
    line-height: 19px;
  }
}
.time_item {
  margin-bottom: 10px;
  padding-left: 17px;
  .w168 {
    width: 168px;
    &:not(:first-child) {
      display: inline-block;
      margin-left: 10px;
    }
  }
}
.position {
  margin-bottom: 10px;
  font-size: 12px;
  .item {
    margin-left: 17px;
    margin-bottom: 5px;
    display: block;
  }
}
</style>
