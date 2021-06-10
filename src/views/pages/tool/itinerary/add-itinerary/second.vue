<template>
  <div class="itinerary">
    <Form :label-width="155" class="itinerary-form" :rules="formRuleValidate" :model="params" ref="Form">
      <FormItem :label-width="0">
        <p class="itinerary-title">出发/途径地</p>
      </FormItem>
      <FormItem label="出发城市：" prop="cityRegion">
        <Distpicker v-model="params.cityRegion" />
      </FormItem>
      <FormItem :label-width="0">
        <p class="itinerary-title">线路类型</p>
      </FormItem>
      <FormItem label="线路类型（个性标签）：">
        <Tags
          resourceType="CONTENT_TYPE_JOURNEY"
          labelType="PERSONAL_TAGS"
          :limit="3"
          :defaultIds="params.personalTags"
          @onChange="getPersonalTags"
        ></Tags>
      </FormItem>
      <FormItem label="适合人群：">
        <Tags
          resourceType="CONTENT_TYPE_JOURNEY"
          labelType="FIT_TAGS"
          :limit="3"
          :defaultIds="params.fitTags"
          @onChange="getFitTags"
        ></Tags>
      </FormItem>
      <FormItem :label-width="30">
        <Button class="mr-30" @click="preStep">上一步</Button>
        <Button type="primary" @click="saveHandle">完成</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { getTagsSelect } from "@service/common.ts";
import Tags from "@components/tags/tags.vue";
import Distpicker from "./dispicker.vue";
import {
  saveJouneryParams,
  dateSaveDTO,
  sourceSaveDTO
} from "@service/tool.ts";

@Component({
  components: {
    Tags,
    Distpicker
  }
})
export default class AddItinerarySecond extends Vue {
  @Prop() params!: saveJouneryParams;
  tag = "";
  people = "";
  formRuleValidate = {
    cityRegion: [
      { required: true, validator: this.validateRegion},
    ],
  }
  /** 上一步 */
  @Emit()
  preStep() {
    return;
  }
  /** 保存 */
  @Emit()
  onSave() {
    return;
  }
  /** 验证出发城市是否选择到市级 */
  validateRegion(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("请选择出发城市"));
    } else {
      let str = value.slice(2, 4);
      if (str != '00') {
        callback();
      } else {
        return callback(new Error("请选择正确的出发城市"));
      }
    }
  }
  /** 保存 */
  saveHandle() {
    (this.$refs.Form as any).validate((valid: boolean) => {
      if (valid) {
        this.onSave();
      } else {
        this.$Message.error("请将行程信息补充完整!");
      }
    });
  }
  getRegion(data: any) {
    this.$parent.params.cityRegion = data.region;
    this.$parent.params.cityName = data.cityName;
  }
  getPersonalTags(value: string) {
    this.$parent.params.personalTags = value;
  }
  getFitTags(value: string) {
    this.$parent.params.fitTags = value;
  }
}
</script>

<style lang='scss' scoped>
.itinerary {
  padding: 15px;
  &-title {
    height: 42px;
    padding: 0 0 0 25px;
    margin-bottom: 30px;
    line-height: 42px;
    background: $grayDark;
  }
  .mr-30 {
    margin-right: 30px;
  }
  .mr-20 {
    margin-right: 20px;
  }
}
</style>
