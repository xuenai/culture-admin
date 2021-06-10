<!--
 * @Author: 任智勇
 * @since: 2019-07-03 15:53:05
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-03 16:26:54
 -->
<template>
  <input
    type="text"
    placeholder="请输入联系电话"
    class="ivu-input ivu-input-default"
    v-model="showPhone"
    style="width: 100%;"
  >
</template>

<script lang='ts'>
/**
 * <phone :v-model="formData.phone" style="width:250px;"></phone>
 *
 * 请设置宽度、否则默认为100%宽度
 *
 */
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

@Component({ components: {} })
export default class ComponentName extends Vue {
  private showPhone: string = "";
  @Prop() value: any;
  mounted() {
    this.showPhone = this.value
  }
  // 监听电话号码变化
  @Watch("value", { immediate: true, deep: true })
  getValue(){
      this.showPhone = this.value
  }
  @Watch("showPhone", { immediate: true, deep: true })
  freshShowPhone(newCode: any) {
    let str = this.showPhone.replace(/[^0-9]/g, "");
    str = str.substr(0, 11);
    this.showPhone = str;
    this.$emit("input", str);
  }
}
</script>

<style lang='scss' scoped></style>
