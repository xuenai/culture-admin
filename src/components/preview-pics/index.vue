<template>
  <div>
    <Modal :title="title ? title : '图片查看'" v-model="show" class="pic-preview-modal">
      <div class="pics-modal-body">
        <img :src="imgs[index]" class="image">
      </div>
      <div slot="footer" class="pics-modal-footer">
        <i class="cloud-icon btn pre-btn" :class="{disabled: !preBtn}" @click="pre">&#xe6b2;</i>
        <i class="cloud-icon btn next-btn" :class="{disabled: !nextBtn}" @click="next">&#xe6b1;</i>
      </div>
    </Modal>
  </div>
</template>


<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit  } from 'vue-property-decorator'
/**
 * 使用方法
 *  import {PreviewPics} from '@components/index'
 *  <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
 * v-model控制展示隐藏
 * imgs 图片地址数组 Array<string>
 * currIndex 需要展示的图片下标
 * title 弹窗的标题，不填默认为 图片查看
 */
@Component
export default class PreviewPics extends Vue {
  @Prop({default: false}) readonly value !: boolean;
  @Prop({default: false}) readonly imgs !: Array<string>;
  @Prop({default: '图片查看'}) readonly title !:string;
  @Prop({default: 0}) readonly currIndex!:number;
  private show = false
  private nextBtn = false
  private preBtn = false
  private index = 0
  @Emit()
  input () {
    return this.show
  }
  @Watch("currIndex", { immediate: true, deep: true })
  onCurrIndexChange(val: number) {
    this.index = val
  }
  @Watch("value", { immediate: true, deep: true })
  onValueChange(val: boolean,) {
    this.show = val
    this.index = this.currIndex
    this.indexChangeHandle(this.index)
  }
  @Watch("show", { immediate: true, deep: true })
  onShowChange(val: boolean,) {
    if (val !== this.val) {
      this.input()
    }
  }
  @Watch("index", { immediate: true, deep: true })
  onIndexChange(val: number) {
    this.indexChangeHandle(val)
  }
  private indexChangeHandle (val: number) {
    if (0 < val || val < this.imgs.length -1 ) {
      this.nextBtn = true
      this.preBtn = true
    }
    if (val === 0) {
      this.preBtn = false
    }
    if (val === this.imgs.length-1) {
      this.nextBtn = false
    }
  }
  private pre () {
    if (this.preBtn = false) {
      return
    }
    let {index} = this;
    if (index-1 <= 0) {
      this.index = 0
    } else {
      this.index--
    }
  }
  private next () {
    if (this.nextBtn = false) {
      return
    }
    let {index} = this;
    if (index+1 === this.imgs.length) {
      this.index = this.imgs.length - 1
    } else {
      this.index++
    }
  }
}
</script>

<style lang='scss' scoped>
.pics-modal-body{
  position: relative;
  .image{
    width: 100%;
    max-width:1200px;
  }
}
.pics-modal-footer{
  margin-top:-12px;
  text-align:center;
  .btn{
    margin: 0 10px;
    font-size:20px;
    cursor:pointer;
    user-select:none;
    border-radius: 50%;
    &:active{
      color:$theme;
    }
    &.disabled {
      color:$btn-cancel;
      cursor:not-allowed;
    }
  }
}
</style>
