<template>
  <div class="itinerary">
    <p class="itinerary-title">行程天数</p>
    <Form
      :rules="formRuleValidate"
      :model="params"
      :label-width="115"
      class="itinerary-form"
      ref="Form"
    >
      <FormItem label="行程标题：" prop="name">
        <Input v-model.trim="params.name" placeholder="请输入行程标题" class="itinerary-ipt" />
      </FormItem>
      <FormItem label="交通：" prop="travelType">
        <RadioGroup v-model="params.travelType" type="button">
          <Radio label="JOURNEY_TRAVEL_SELF">
            <span>自驾游</span>
          </Radio>
          <Radio label="JOURNEY_TRAVEL_TRAFFIC">
            <span>公共交通</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <!-- 天数 -->
      <FormItem :label-width="0">
        <div class="days">
          <div
            class="day"
            v-for="(day, idx) in params.dateSaveDTOList"
            :key="idx"
            @click.stop="showDayDetail(idx)"
            :class="{active: idx === currIdx}"
          >
            <span class="day-text">{{day.processTime}}</span>
            <span class="cloud-icon c-icon-cuowu" @click.stop="onDelete(idx)"></span>
          </div>
          <div class="day-add-btn" @click="onAdd">
            <span class="cloud-icon c-icon-cuowu"></span>
          </div>
        </div>
      </FormItem>

      <!-- 开始循环的时间段 -->

      <p class="tip">拖动可以改变时间段排序</p>
      <div v-for="(resourcesObj, resourcesIdx) in params.dateSaveDTOList" :key="resourcesIdx">
        <template v-if="resourcesIdx === currIdx">
          <div
            class="resource-wrapper"
            v-for="(resource, idx) in resourcesObj.sourceSaveDTOList"
            :key="`${resourcesIdx}-${idx}`"
            :draggable="true"
            v-dragging="{ list: params.dateSaveDTOList[resourcesIdx].sourceSaveDTOList, item: resource, group: 'resource' }"
          >
            <FormItem label="时间段：">
              <Input
                v-model.trim="resource.timeInterval"
                placeholder="请输入时间段，例如：上午/8:00"
                class="itinerary-ipt"
              />
            </FormItem>
            <FormItem
              label="类型："
              :prop="`dateSaveDTOList.${resourcesIdx}.sourceSaveDTOList.${idx}.sourceType`"
              :rules="resourceItemValidate.sourceType"
            >
              <RadioGroup type="button" v-model="resource.sourceType">
                <Radio
                  v-for="re in resourceTypes"
                  :key="re.value"
                  :label="re.value"
                  :disabled="getStatusBySourceType(re.value)"
                >
                  <span>{{re.name}}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <ConnectResource
              v-model="params.dateSaveDTOList[currIdx].sourceSaveDTOList[idx]"
              v-if="resource.sourceType"
            ></ConnectResource>
            <FormItem label="说明：">
              <Input
                type="textarea"
                v-model.trim="resource.notes"
                class="itinerary-ipt"
                :rows="3"
                :maxlength="400"
                placeholder="请输入行程说明"
              />
            </FormItem>
            <div class="resource-wrapper-delete" v-if="idx !==0">
              <p class="cloud-icon c-icon-jian1" @click="deletePeriodHandle(idx)"></p>
              <p class="resource-wrapper-delete-txt">删除时段</p>
            </div>
          </div>
        </template>
      </div>

      <!-- 添加时段按钮 -->
      <FormItem>
        <Button @click="addPeriodHandle">添加时段</Button>
      </FormItem>

      <FormItem :label-width="0">
        <Button class="mr-30" @click="$router.back(-1)">返回</Button>
        <Button type="primary" @click="nextStepHandle">下一步</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import ConnectResource from "./resource.vue";
import {
  saveJouneryParams,
  dateSaveDTO,
  sourceSaveDTO
} from "@service/tool.ts";

const RESOURCETYPE = [
  {
    name: "景区",
    value: "CONTENT_TYPE_SCENERY"
  },
  {
    name: "场馆",
    value: "CONTENT_TYPE_VENUE"
  },
  {
    name: "酒店",
    value: "CONTENT_TYPE_HOTEL"
  },
  {
    name: "餐食",
    value: "CONTENT_TYPE_RESTAURANT"
  }
];

@Component({
  components: {
    ConnectResource
  }
})
export default class AddItineraryFirst extends Vue {
  @Prop() params!: saveJouneryParams;
  // 当前选中的下标
  currIdx = 0;
  // 表单验证
  formRuleValidate = {
    name: [
      { required: true, message: "行程标题不能为空", trigger: "blur" },
      { max: 50, message: "行程标题不能超过50个字", trigger: "blur" }
    ],
    travelType: [{ required: true, validator: this.validateTraffic }]
  };
  resourceTypes = RESOURCETYPE;
  // 单独的资源类型验证
  resourceItemValidate = {
    sourceType: [{ required: true, message: "资源类型不能为空" }]
  };
  /** 点击下一步 */
  @Emit()
  nextStep() {
    return;
  }
  /** 点击添加按钮 */
  @Emit()
  onAdd() {
    return () => {
      this.showDayDetail(this.params.dateSaveDTOList.length - 1);
    };
  }
  /** 删除天数 */
  @Emit()
  onDelete(idx: number) {
    return {
      idx,
      callback: () => {
        this.currIdx = 0;
      }
    };
  }

  /** 下一步 */
  nextStepHandle() {
    (this.$refs.Form as any).validate((valid: boolean) => {
      if (valid) {
        this.nextStep();
      } else {
        this.$Message.error("请将行程信息补充完整!");
      }
    });
  }
  /** 查看资源是否可以点击 */
  getStatusBySourceType(resourceType: string): boolean {
    //
    let resources = this.$parent.params.dateSaveDTOList[this.currIdx]
      .sourceSaveDTOList;
    let resourceLen = resources.length;
    // 总资源数大于8个了 必能再添资源了
    if (resourceLen > 8) {
      return true;
    }
    // 获取对应资源的最大数量
    let len = resources.filter((item: any) => item.sourceType === resourceType)
      .length;
    // 按钮是否隐藏
    let disabled = false;
    // 根据对应资源的数量进行判断
    switch (resourceType) {
      // 景区和场馆的数量总和不超过4个 酒店1个 餐饮3个
      case "CONTENT_TYPE_SCENERY": {
        if (this.getScenicAndVenueNumbers() >= 4) {
          disabled = true;
        }
        break;
      }
      case "CONTENT_TYPE_VENUE": {
        if (this.getScenicAndVenueNumbers() >= 4) {
          disabled = true;
        }
        break;
      }
      case "CONTENT_TYPE_HOTEL": {
        if (len >= 1) {
          disabled = true;
        }
        break;
      }
      case "CONTENT_TYPE_RESTAURANT": {
        if (len >= 3) {
          disabled = true;
        }
        break;
      }
      default:
        break;
    }
    return disabled;
  }
  /** 获取景区和场馆的总数 */
  getScenicAndVenueNumbers() {
    return this.$parent.params.dateSaveDTOList[
      this.currIdx
    ].sourceSaveDTOList.filter(
      (item: any) =>
        item.sourceType === "CONTENT_TYPE_SCENERY" ||
        item.sourceType === "CONTENT_TYPE_VENUE"
    ).length;
  }
  /** 删除时段 */
  deletePeriodHandle(idx: number) {
    this.$parent.params.dateSaveDTOList[this.currIdx].sourceSaveDTOList.splice(
      idx,
      1
    );
  }
  /** 添加时段 */
  addPeriodHandle() {
    if (
      this.$parent.params.dateSaveDTOList[this.currIdx].sourceSaveDTOList
        .length >= 8
    ) {
      this.$Message.error("每天添加时段不超过8个！");
      return false;
    }
    this.$parent.params.dateSaveDTOList[this.currIdx].sourceSaveDTOList.push({
      timeInterval: "",
      sourceType: "",
      sourceId: "",
      notes: ""
    });
  }
  /** 切换当前选中的下标 */
  showDayDetail(idx: number) {
    this.currIdx = idx;
  }
  /** 验证交通方式是否选择 */
  validateTraffic(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("请选择交通方式"));
    } else {
      callback();
    }
  }
}
</script>
<style lang='scss' scoped>
.itinerary {
  padding: 15px;
  .ivu-radio-group-button
    .ivu-radio-wrapper-disabled.ivu-radio-wrapper-checked {
    background: #fff !important;
    border-color: #23a1ee !important;
    color: #23a1ee !important;
    -webkit-box-shadow: -1px 0 0 0 #23a1ee;
    box-shadow: -1px 0 0 0 #23a1ee;
    border-left: 1px solid #23a1ee;
  }
  .tip {
    padding-bottom: 18px;
    color: #888;
    font-size: 12px;
  }
  &-title {
    height: 42px;
    padding: 0 0 0 25px;
    margin-bottom: 30px;
    line-height: 42px;
    background: $grayDark;
  }
  &-ipt {
    max-width: 450px;
  }
  &-form {
    margin: 0 30px;
  }
  .days {
    font-size: 0;
    border-bottom: 1px solid #dcdee2;
    padding: 17px 0 20px;
  }
  .day {
    position: relative;
    vertical-align: top;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 124px;
    height: 38px;
    margin-right: 20px;
    margin-bottom: 15px;
    font-size: 14px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #666;
    transition: all 0.3s ease-in;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: $theme-hover;
      border-color: $theme-hover;
    }
    &.active {
      background: $theme;
      color: #fff;

      &:hover {
        cursor: not-allowed;
      }
    }
    &:first-child {
      .cloud-icon {
        display: none;
      }
    }
    .cloud-icon {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      transform: translate(50%, -50%);
      border-radius: 50%;
      font-size: 18px;
      overflow: hidden;
      cursor: pointer;
      color: #999;
      transition: color 0.3s ease-in;
      background: #fff;
      &:hover {
        color: #666;
      }
    }
  }
  .day-add-btn {
    display: inline-flex;
    height: 38px;
    padding-left: 12px;
    align-items: center;
    font-size: 24px;
    .cloud-icon {
      transform: rotate(45deg);
      color: #999;
      &:hover {
        color: $theme;
        cursor: pointer;
      }
    }
  }
  .mr-30 {
    margin-right: 30px;
  }
  .resource-wrapper {
    position: relative;
    margin-right: 80px;
    padding: 24px 0 1px;
    margin-bottom: 24px;
    border-radius: 4px;
    background: $grayDark;
    &-delete {
      position: absolute;
      right: -70px;
      top: 20px;
      font-size: 24px;
      text-align: center;
      color: #999;
      transition: all 0.3s ease-in;
      &-txt {
        font-size: 12px;
      }
      .cloud-icon {
        cursor: pointer;
        &:hover {
          color: $theme;
        }
      }
    }
  }
}
</style>
