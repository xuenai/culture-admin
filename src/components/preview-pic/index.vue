<template>
  <div>
    <Modal :title="title ? title : '图片查看'" v-model="show" class="pic-preview-modal">
      <img :src="imgUrl" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit  } from 'vue-property-decorator'

/**
 * 浏览单张图片
 *  <PreviewPic v-model="visible" :imgUrl="imgUrl" :title="title"></PreviewPic>
 */

@Component
export default class PreviewPic extends Vue {
  @Prop({default: false}) readonly value !: boolean;
  @Prop({default: false}) readonly imgUrl !: boolean;
  @Prop({default: '图片查看'}) readonly title !:string
  private show = false
  @Emit()
  input () {
    return this.show
  }
  @Watch("value", { immediate: true, deep: true })
  onValueChange(val: boolean,) {
    this.show = val
  }
  @Watch("show", { immediate: true, deep: true })
  onShowChange(val: boolean,) {
    if (val !== this.val) {
      this.input()
    }
  }
  mounted () {
    this.show = this.value
  }
}
</script>

<style lang='scss' scoped></style>
