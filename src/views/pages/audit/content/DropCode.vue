<!--
 * @Author: 任智勇
 * @since: 2019-05-21 15:44:23
 * @LastAuthor: 任智勇
 * @lastTime: 2019-05-21 17:26:44
 -->
<template>
  <div class="dorpDiv" @mouseleave="show = false">
    <!--<span class="message-font" @mouseenter="show = true">{{dropName}}</span>-->
    <!--<img-->
      <!--src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAAUklEQVQI122OsQ3AIAwEL94wEo1LWshOLq0IJoMlaChc+Mu71+sf1TqAQp4pQAd2IhfQxN0W0JJCd7ctAO42gRHkfxkSYLuzC/jSR6q1qNY3sgNEBBfx/mMImAAAAABJRU5ErkJggg=="-->
      <!--class="down"-->
    <!--&gt;-->
    <transition name="fade">
      <!--<div class="infos" v-if="show" @mouseenter="show = true">-->
      <div class="infos" >
        <div class="title">
          <Input v-model="value" id="copy" placeholder="Enter something..." style="width: 300px"/>
          <Button type="info" class="copy" @click="copyUrl" data-clipboard-target="#copy">复制</Button>
        </div>
        <div class="imgDiv">
          <img :src="url" alt="二维码">
        </div>
        <p class="tips">{{tips}}</p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Clipboard from "clipboard";

@Component
export default class DropCode extends Vue {
  // 设置prop类型
  @Prop() private tips!: string;
  @Prop() private url!: string;
  @Prop() private dropName!: string;
  @Prop() private value!: string;
  private show = false;

  private copyUrl() {
    let clipboard = new Clipboard(".copy");
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
.dorpDiv {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  position: relative;
  > img {
    margin-left: 5px;
  }
  .infos {
    position: absolute;
    left: -180px;
    width: 400px;
    padding: 10px 15px;
    background-color: #fff;
    border-radius: 3px;
    .copy {
      margin-left: 10px;
    }
    .imgDiv {
      width: 200px;
      height: 200px;
      margin: 20px auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .tips {
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  }
}
</style>

