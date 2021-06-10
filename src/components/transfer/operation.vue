<template>
  <div class="ivu-transfer-operation">
    <Button type="primary" size="small" :disabled="!rightActive" @click.native="moveToLeft">
      <Icon type="ios-arrow-back"></Icon>
    </Button>
    <Button type="primary" size="small" :disabled="!leftActive" @click.native="moveToRight">
      <Icon type="ios-arrow-forward"></Icon>
    </Button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Operation extends Vue {
  // 左移按钮展示状态
  @Prop() readonly leftActive!: boolean;
  // 右移按钮展示状态
  @Prop() readonly rightActive!: boolean;
  // 左移事件
  moveToLeft () {
    this.$parent.moveTo('left');
  }
  // 右移事件
  moveToRight () {
    this.$parent.moveTo('right');
  }
}
</script>

<style lang='scss' scoped></style>
