<template>
  <div class="itinerary">
    <Form
      :model="data"
      :label-width="115"
      class="itinerary-form"
      ref="Form"
    >
      <p class="itinerary-title">行程天数</p>
      <FormItem label="行程标题：">
        <Input v-model.trim="data.name" class="itinerary-ipt" disabled/>
      </FormItem>
      <FormItem label="交通：" prop="travelType">
        <RadioGroup v-model="data.travelType" type="button">
          <Radio label="JOURNEY_TRAVEL_SELF" v-if="data.travelType === 'JOURNEY_TRAVEL_SELF'">
            <span>自驾游</span>
          </Radio>
          <Radio label="JOURNEY_TRAVEL_TRAFFIC" v-if="data.travelType === 'JOURNEY_TRAVEL_TRAFFIC'">
            <span>公共交通</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <!-- 天数 -->
      <FormItem :label-width="0">
        <div class="days">
          <div
            class="day"
            v-for="(day, idx) in data.dateList"
            :key="idx"
            @click="showDayDetail(idx)"
            :class="{active: idx === currIdx}"
          >
            <span class="day-text">{{day.processTime}}</span>
          </div>
        </div>
      </FormItem>
      <!-- 时间段列表 -->
      <template v-if="data.dateList">
        <div
        class="resource-wrapper"
        v-for="(resource, idx) in data.dateList[currIdx].sourceList"
        :key="idx"
      >
        <FormItem label="时间段：">
          <Input
            v-model.trim="resource.timeInterval"
            placeholder="请输入时间段，例如：上午/8:00"
            class="itinerary-ipt"
            disabled
          />
        </FormItem>
        <FormItem
          label="类型："
        >
          <RadioGroup type="button" v-model="resource.sourceType">
            <Radio
              v-for="re in resourceTypes"
              :key="re.value"
              :label="re.value"
              v-if="re.value === resource.sourceType"
            >
              <span>{{re.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <ConnectResource
          v-model="data.dateList[currIdx].sourceList[idx]"
          v-if="resource.sourceType"
          :isDetail="true"
        ></ConnectResource>
        <FormItem label="说明：">
          <Input
            type="textarea"
            v-model.trim="resource.notes"
            class="itinerary-ipt"
            :rows="3"
            placeholder="请输入行程说明"
            disabled
          />
        </FormItem>
      </div>
      </template>
      <FormItem :label-width="0">
        <p class="itinerary-title">出发/途径地</p>
      </FormItem>
      <FormItem label="出发城市：">
        <span>{{data.travelCity}}</span>
      </FormItem>
      <FormItem :label-width="0" v-if="$route.path == '/itinerary-detail'">
        <p class="itinerary-title">线路类型</p>
      </FormItem>
      <FormItem label="线路类型（个性标签）：" :label-width="155" v-if="$route.path == '/itinerary-detail'">
        <Tags
          resourceType="CONTENT_TYPE_JOURNEY"
          labelType="PERSONAL_TAGS"
          limit="1"
          :defaultIds="data.personalTags"
          :isDetail="true"
        ></Tags>
      </FormItem>
      <FormItem label="适合人群：" v-if="$route.path == '/itinerary-detail'">
        <Tags
          resourceType="CONTENT_TYPE_JOURNEY"
          labelType="FIT_TAGS"
          :defaultIds="data.fitTags"
          :isDetail="true"
        ></Tags>
      </FormItem>
      <FormItem :label-width="30">
        <Button class="mr-30" @click="$router.back(-1)">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getJourneyDetail } from "@service/tool.ts";
import ConnectResource from "../add-itinerary/resource.vue";
import Tags from "@components/tags/tags.vue";

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
    ConnectResource,
    Tags
  }
})
export default class ItinerayDetail extends Vue {
  data:any = {};
  currIdx = 0;
  resourceTypes = RESOURCETYPE;
  /** 切换当前选中的下标 */
  showDayDetail(idx: number) {
    this.currIdx = idx;
  }
  created() {
    console.log(this.$route)
    getJourneyDetail({ id: this.$route.query.id as string }).then(res => {
      if (res.code === 0) {
        this.data = res.data;
      }
    });
  }
}
</script>
<style lang="scss">
.itinerary {
  .ivu-radio-group-button .ivu-radio-wrapper {
    border-radius: 0;
    margin-right: 20px;
  }
}
</style>
<style lang='scss' scoped>
.itinerary {
  padding: 15px;
  .ivu-radio-group-button .ivu-radio-wrapper{
    cursor: default;
    .ivu-radio-input{
      cursor: default !important;
    }
  }
  .ivu-radio-group-button
    .ivu-radio-wrapper-disabled.ivu-radio-wrapper-checked {
    background: #fff !important;
    border-color: #23a1ee !important;
    color: #23a1ee !important;
    -webkit-box-shadow: -1px 0 0 0 #23a1ee;
    box-shadow: -1px 0 0 0 #23a1ee;
    border-left: 1px solid #23a1ee;
    cursor: default;
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
