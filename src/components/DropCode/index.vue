/*
 * @Author: Hexg 
 * @Date: 2019-08-20 15:06:25 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-08-27 10:24:58
 */

<template>
  <div class="dropCode" @mouseleave="show = false" ref="dropCodeWrapper">
    <div @mouseenter="divShow">
      <slot></slot>
    </div>

    <div class="dorpDiv" ref="dorpDiv">
      <transition name="fade">
        <div class="infos" v-show="show">
          <div class="title">
            <input
              class="ivu-input ivu-input-default"
              v-model="value"
              id="copy"
              readonly
              style="width: 100px"
            />
            <Button
              type="info"
              style="margin-left:10px;"
              class="copy-btn"
              @click="copyUrl"
              data-clipboard-target="#copy"
            >复制</Button>
          </div>
          <div class="imgDiv">
            <img src="@assets/image/pc-icon.png" alt />
          </div>
          <p class="tips">
            <Button type="primary" @click="openInNewTab">点击打开</Button>
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import Clipboard from "clipboard";
import QRCode from "qrcodejs2";

@Component({
  components: {
    QRCode
  }
})
/**
 * <dropCode
      value="sdf"
    >
      <i title="预览">预览</i>
    </dropCode>

 * slot插槽内容为需要触发弹窗的外部结构
 * value: 输入框中的内容
 * position: 弹窗位置 默认为 bottom
 *      top bottom left right bottom-right bottom-left
 */
export default class DropCode extends Vue {
  // 设置prop类型
  @Prop() private value!: string; // 链接地址
  @Watch("value")
  refreshValue() {
    if (this.value) {
      this.qartConfig.config.text = this.value;
    }
  }
  @Prop() private position!: string; // 弹窗位置
  private show = false;
  private qartConfig = {
    config: {
      width: 100, // 设置宽度
      height: 100, // 设置高度
      text: this.value
    }
  };
  /**
   * 在新窗口中打开
   */
  openInNewTab() {
    window.open(this.value, "_blank");
  }
  // 获取到屏幕左侧的距离
  getOffsetLeft(obj: any) {
    var tmp = obj.offsetLeft;
    var val = obj.offsetParent;
    while (val != null) {
      tmp += val.offsetLeft;
      val = val.offsetParent;
    }
    return tmp;
  }
  // 获取到屏幕顶端的距离
  getOffsetTop(obj: any) {
    var tmp = obj.offsetTop;
    var val = obj.offsetParent;
    while (val != null) {
      tmp += val.offsetTop;
      val = val.offsetParent;
    }
    return tmp;
  }
  // 二维码弹窗
  private divShow(e: any) {
    this.show = true;
    let w = (this.$refs.dropCodeWrapper as HTMLDivElement).offsetWidth;
    let h = (this.$refs.dropCodeWrapper as HTMLDivElement).offsetHeight;
    let left = this.getOffsetLeft(this.$refs.dropCodeWrapper);
    let top = this.getOffsetTop(this.$refs.dropCodeWrapper);
    switch (this.position) {
      case "top":
        {
          let pl = left + w / 2;
          let pt = top - 220;
          (this.$refs
            .dorpDiv as HTMLDivElement).style.cssText = `left:${pl}px;transform:translateX(-50%);top:${pt}px;`;
        }
        break;
      case "bottom":
        {
          let pl = left + w / 2;
          let pt = top + h;
          (this.$refs
            .dorpDiv as HTMLDivElement).style.cssText = `left:${pl}px;transform:translateX(-50%);top:${pt}px;`;
        }
        break;
      case "left":
        {
          let pl = left - 200;
          let pt = top + h / 2;
          (this.$refs
            .dorpDiv as HTMLDivElement).style.cssText = `left:${pl}px;transform:translateY(-50%);top:${pt}px;`;
        }
        break;
      case "right":
        {
          let pl = left + w;
          let pt = top + h / 2;
          (this.$refs
            .dorpDiv as HTMLDivElement).style.cssText = `left:${pl}px;transform:translateY(-50%);top:${pt}px;`;
        }
        break;
      default: {
        let pl = left + w / 2;
        let pt = top + h;
        (this.$refs
          .dorpDiv as HTMLDivElement).style.cssText = `left:${pl}px;transform:translateX(-50%);top:${pt}px;`;
      }
    }
  }
  // 复制URL
  private copyUrl() {
    let clipboard = new Clipboard(".copy-btn");
    clipboard.on("success", () => {
      this.$Notice.success({
        title: "复制成功",
        duration: 1
      });
      // 释放内存
      clipboard.destroy();
    });
    clipboard.on("error", () => {
      //复制失败的回调
      this.$Notice.error({
        title: "复制失败",
        duration: 1
      });
      clipboard.destroy();
    });
  }
}
</script>

<style scoped lang="scss">
.dropCode {
  display: inline-block;
  margin: 0 5px 0;
  background: #fff;
}
.dorpDiv {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  position: fixed;
  z-index: 10;
  background-color: $grayDark;
  > img {
    margin-left: 5px;
  }
  .infos {
    background-color: $bg01;
    width: 200px;
    padding: 10px 15px;
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid $borderLight;
    .copy {
      margin-left: 10px;
    }
    .imgDiv {
      margin: 20px auto;
      font-size: 0;
      text-align: center;
      img {
        width: 79px;
        height: 71px;
        vertical-align: top;
      }
    }
    .tips {
      padding-bottom: 10px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  }
}
</style>

