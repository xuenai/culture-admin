<template>
  <FormItem :label="isDetail ? '' : `关联${titleByResourceType[value.sourceType]}`" class="resource" v-if="value">
    <Button @click="showResourceModal" v-if="!isDetail">选择{{titleByResourceType[value.sourceType]}}</Button>
    <div class="resource-title" v-if="value.name">
      <router-link
        :to="{
          path: getPath(value.sourceType),
          query: {
            id: value.sourceId,
            type: 'list',
            showBackBtn: false
          }
        }"
        target="_blank"
        v-if="value.sourceType !== 'CONTENT_TYPE_RESTAURANT'"
      >{{value.name}}</router-link>
      <span v-else>{{value.name}}</span>
    </div>
    <div v-if="value.sourceType !== 'CONTENT_TYPE_RESTAURANT'">
      <p class="resource-summary" v-if="value.summary">{{value.summary}}</p>
    </div>
    <div v-else>
      <p class="resource-summary" v-if="value.address">{{value.address}}</p>
    </div>
    <div class="resource-img" v-if="value.images">
      <img :src="value.images" alt />
    </div>
    <!-- 资源关联选择 -->
    <ResourceModal
      v-model="modalshow"
      :resourceType="value.sourceType"
      @on-checked="resourceChecked"
      v-if="value.sourceType"
    ></ResourceModal>
    <transition name="fade" v-if="!isDetail">
      <div class="resource-delete" v-show="value.name">
        <p class="cloud-icon c-icon-jian1" @click="deleteHandle"></p>
        <p class="resource-delete-txt">删除{{titleByResourceType[value.sourceType]}}</p>
      </div>
    </transition>
  </FormItem>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import ResourceModal from "@views/site/setting/mobile-setting/resourceModal.vue";

interface ResourceProp {
  name?: string;
  images?: string;
  summary?: string;
  address?: string;
  sourceId?: string;
  sourceType?:
    | "CONTENT_TYPE_HOTEL"
    | "CONTENT_TYPE_SCENERY"
    | "CONTENT_TYPE_RESTAURANT"
    | "CONTENT_TYPE_VENUE";
  timeInterval?: string;
  notes?: string;
}

@Component({
  components: {
    ResourceModal
  }
})
export default class ConnectResource extends Vue {
  @Prop()
  value!: ResourceProp;
  // 通过resourceType获取资源中文名字
  titleByResourceType = {
    CONTENT_TYPE_HOTEL: "酒店",
    CONTENT_TYPE_SCENERY: "景区",
    CONTENT_TYPE_RESTAURANT: "餐食",
    CONTENT_TYPE_VENUE: "场馆"
  };
  @Prop({default: false}) isDetail!:boolean;
  // 弹窗是否展示
  modalshow = false;
  // 资源id
  @Emit()
  input(data?: ResourceProp) {
    return data;
  }
  /** 删除操作 */
  deleteHandle() {
    // @ts-ignore
    this.input({
      name: "",
      sourceId: "",
      summary: "",
      address: "",
      images: "",
      sourceType: this.value.sourceType,
      timeInterval: this.value.timeInterval,
      notes: this.value.notes
    });
  }
  /** 获取跳转地址 */
  getPath(
    sourceType:
      | "CONTENT_TYPE_HOTEL"
      | "CONTENT_TYPE_SCENERY"
      | "CONTENT_TYPE_VENUE"
  ) {
    return {
      CONTENT_TYPE_HOTEL: "/hotel-detail",
      CONTENT_TYPE_SCENERY: "/scenic-detail",
      CONTENT_TYPE_VENUE: "/venues-detail"
    }[sourceType];
  }
  /** 资源点击选择 */
  resourceChecked(data: any) {
    if (data) {
      let { id, images, address, summay, resourceType, name } = data;
      // @ts-ignore
      this.input({
        name,
        sourceId: id,
        summary: summay,
        address: address,
        sourceType: resourceType,
        images,
        timeInterval: this.value.timeInterval,
        notes: this.value.notes
      });
    }
  }
  /** 获取详情页跳转地址 */

  /** 资源选择弹窗展示 */
  showResourceModal() {
    this.modalshow = true;
  }
}
</script>

<style lang='scss' scoped>
.resource {
  position: relative;
  &-title {
    padding: 8px 0 0;
    font-size: 14px;
  }
  &-summary {
    max-width: 450px;
    padding-bottom: 20px;
    font-size: 12px;
    line-height: 16px;
    color: #999;
  }
  &-img {
    width: 205px;
    height: 137px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &-delete {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
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
</style>
