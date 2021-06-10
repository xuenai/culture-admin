<template>
  <div class="itinerary-page">
    <transition name="itinerary">
      <AddItineraryFirst
        key="first"
        :params="params"
        v-if="step === 1"
        @next-step="nextStepHandle"
        @on-add="onAddHandle"
        @on-delete="onDeleteHandle"
      ></AddItineraryFirst>
      <AddItinerarySecond
        key="second"
        :params="params"
        v-else-if="step === 2"
        @pre-step="preStepHandle"
        @on-save="saveHandle"
      ></AddItinerarySecond>
    </transition>
    <!-- 为了防止这个值不读取 -->
    <div style="display:none;">{{defaultRegion}}</div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import AddItineraryFirst from "./first.vue";
import AddItinerarySecond from "./second.vue";
import { AppModule } from "@store/modules/app";
import { ModalConfig } from "iview/types";
import {
  saveJounery,
  saveJouneryParams,
  dateSaveDTO,
  sourceSaveDTO,
  getJourneyDetail
} from "@service/tool.ts";

@Component({
  components: {
    AddItineraryFirst,
    AddItinerarySecond
  }
})
export default class AddItinerary extends Vue {
  // 当前展示的步骤 1：展示行程天数 2：展示行程标签
  step = 1;
  params = {
    name: "",
    id: "",
    personalTags: "",
    fitTags: "",
    travelType: "",
    dateSaveDTOList: [
      {
        sourceSaveDTOList: [
          {
            timeInterval: "",
            sourceType: "",
            sourceId: "",
            notes: "",
            images: "",
            summary: "",
            address: ""
          }
        ],
        processTime: "第一天"
      }
    ],
    cityRegion: "",
    cityName: "",
    regionPath: ""
  };
  get defaultRegion() {
    if (!Object.keys(this.$route.query).includes('id')) {
      this.params.cityRegion = AppModule.siteInfo.region;
      this.params.cityName = AppModule.siteInfo.regionName;
      this.params.regionPath = AppModule.regionPath;
    }
    return AppModule.siteInfo.region;
  }
  /** 删除行程天数 */
  onDeleteHandle (params: any) {
    let config: ModalConfig = {
      title: "操作提示",
      content: '是否删除该天行程？',
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        params.callback && params.callback();
        this.params.dateSaveDTOList.splice(
          params.idx,
          1
        );
      }
    };
    this.$Modal.confirm(config);
  }
  /** 添加行程天数 */
  onAddHandle(callback: () => {}) {
    // 获取行程天数
    let len = this.params.dateSaveDTOList.length;
    // 最大天数不超过15天
    if (len >= 15) {
      this.$Message.error("行程天数不能超过15天！");
      return false;
    }
    let dayNumChinese = this.getDayTextByIdx(len);
    let newDay = {
      sourceSaveDTOList: [
        {
          timeInterval: "",
          sourceType: "",
          sourceId: "",
          notes: "",
          images: "",
          summary: "",
          address: ""
        }
      ],
      processTime: `第${dayNumChinese}天`
    };
    this.params.dateSaveDTOList.push(newDay);
    callback && callback()
  }
  /** 添加行程天数 获取对应文字天数 最多15天 */
  getDayTextByIdx(idx: number) {
    let arr = "一,二,三,四,五,六,七,八,九,十,十一,十二,十三,十四,十五".split(
      ","
    );
    return arr[idx];
  }
  /** 监听下一步 */
  nextStepHandle() {
    this.step = 2;
  }
  /** 监听上一步 */
  preStepHandle() {
    this.step = 1;
  }
  /** 点击保存操作 */
  saveHandle() {
    AppModule.setAppFixedLoadingStatus(true);
    saveJounery(this.params as saveJouneryParams)
      .then(res => {
        if (res.code === 0) {
          this.$Message.success("添加行程成功！");
          this.$router.go(-1);
        }
      })
      .finally(() => AppModule.setAppFixedLoadingStatus(false));
  }
  created() {
    let { id } = this.$route.query;
    if (id) {
      getJourneyDetail({ id: id as string }).then(res => {
        if (res.code === 0) {
          let {
            id,
            name,
            fitTags,
            personalTags,
            travelCityRegion,
            travelCityName,
            travelType,
            dateList,
            regionPath
          } = res.data;
          let arr: Array<any> = [];
          dateList.forEach((el: any) => {
            let { processTime, sourceList } = el;
            arr.push({
              processTime,
              sourceSaveDTOList: sourceList
            });
          });
          this.$set(this, "params", {
            dateSaveDTOList: arr,
            name,
            id,
            fitTags,
            personalTags,
            cityRegion: travelCityRegion,
            cityName: travelCityName,
            regionPath,
            travelType
          });
        }
      });
    }
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
.itinerary-page {
  position: relative;
  .itinerary-enter-active,
  .itinerary-leave-active {
    width: 100%;
    position: absolute;
    transition: all 0.4s ease;
  }
  .itinerary-enter,
  .itinerary-leave-to {
    transform: translateX(-50px);
    opacity: 0;
  }
  .itinerary-enter-to,
  .itinerary-leave {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
