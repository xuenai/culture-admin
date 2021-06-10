<!--
 * @Author: 任智勇
 * @since: 2019-05-21 15:44:23
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-08 09:56:43
 -->
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
              :id="'copy' + id"
              readonly
              style="width: 100px"
            />
            <Button
              type="info"
              style="margin-left:10px;"
              :class="'copy' + id"
              @click="copyUrl"
              :data-clipboard-target="'#copy'+id"
            >复制</Button>
          </div>
          <div class="imgDiv">
            <div :id="id" :ref="id"></div>
          </div>
          <p class="tips">{{tips||'请使用微信扫描二维码'}}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import Clipboard from "clipboard";
import QRCode from "qrcodejs2";

@Component({})
/**
 * <dropCode
      :id="'qrcode' + row.id"
      value="sdf"
    >
      <i title="预览">预览</i>
    </dropCode>

 * slot插槽内容为需要触发弹窗的外部结构
 * value: 输入框中的内容
 * tips: 二维码下方提示文字
 * position: 弹窗位置 默认为 bottom
 *      top bottom left right bottom-right bottom-left
 */
export default class DropCode extends Vue {
  // 设置prop类型
  @Prop() private id!: any; // 二维码下方提示文字
  @Prop() private tips!: string; // 二维码下方提示文字
  @Prop() private value!: string; // 链接地址
  @Prop({ default: true, type: Boolean }) private fixed!: boolean;
  @Watch("value")
  refreshValue(val: string) {
    if (val) {
      // this.qartConfig.config.text = val;
      if (document.getElementById(this.id)) {
        // @ts-ignore
        document.getElementById(this.id).innerHTML = "";
      }
    }
  }
  @Prop() private position!: string; // 弹窗位置
  private show = false;
  mounted() {
    this.qrcode();
  }
  updated() {
    this.qrcode();
  }
  // private qartConfig = {
  //   config: {
  //     width: 100, // 设置宽度
  //     height: 100, // 设置高度
  //     text: this.value
  //   }
  // };
  qrcode() {
    return new Promise(resolve => {
      if (this.value) {
        let qrcode = new QRCode(this.id, {
          width: 100, // 设置宽度
          height: 100, // 设置高度
          text: this.value
        });
        resolve && resolve();
      }
    });
  }
  // 二维码弹窗位置
  private divShow(e: any) {
    // @ts-ignore
    document.getElementById(this.id).innerHTML = "";
    this.qrcode().then(() => {
      this.show = true;
      let w = (this.$refs.dropCodeWrapper as HTMLDivElement).offsetWidth;
      let h = (this.$refs.dropCodeWrapper as HTMLDivElement).offsetHeight;
      let rect = (this.$refs
        .dropCodeWrapper as HTMLDivElement).getBoundingClientRect();
      let left = rect.left;
      let top = rect.top;
      // 处理bug
      let offsetParent: any = (this.$refs.dropCodeWrapper as HTMLDivElement).offsetParent
      let left_2: number = (this.$refs.dropCodeWrapper as HTMLDivElement).offsetLeft
      let top_2: number = (this.$refs.dropCodeWrapper as HTMLDivElement).offsetTop
      while(offsetParent) {
        if (offsetParent.style.transform && offsetParent.style.transform != 'none') {
          offsetParent = null
          left = left_2
          top = top_2
        } else {
          left_2 += offsetParent.offsetLeft
          top_2 += offsetParent.offsetTop
          offsetParent = offsetParent.offsetParent
        }
      }
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
          let pl = left - 200;
          let pt = top + h / 2;
          (this.$refs
            .dorpDiv as HTMLDivElement).style.cssText = `left:${pl}px;transform:translateY(-50%);top:${pt}px;`;
        }
      }
    });
  }
  // 复制URL
  private copyUrl() {
    let clipboard = new Clipboard(".copy" + this.id);
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
  position: relative;
  margin: 0 5px 0;
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
  .title {
    line-height: 35px;
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
      width: 100px;
      height: 100px;
      margin: 20px auto;
      overflow: hidden;
      .qart {
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .tips {
      text-align: center;
      font-size: 14px;
      color: #999;
      line-height: 25px;
    }
  }
}
</style>

