<!--
 * @Author: 任智勇
 * @since: 2019-05-31 17:02:40
 * @LastAuthor   : 任智勇
 * @lastTime     : 2020-01-14 16:50:45
 -->
<template>
  <transition name="dialog" v-if="config.show">
    <div class="dialog-box">
      <div class="dialog">
        <div class="title" v-if="config.title">
          <span v-if="config.icon" class="cloud-icon" v-html="config.icon"></span>
          <h3>
            {{config.title}}
            <span class="tip" v-if="config.tip">{{config.tip}}</span>
          </h3>
          <span class="close cloud-icon" @click="close">&#xe621;</span>
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="footer" :style="'justify-content:' + position+';'">
          <Button
            type="primary"
            v-if="config.ok"
            :disabled="config.disabled"
            @click="ok"
          >{{config.okText}}</Button>
          <Button
            class="cancel"
            type="text"
            v-if="config.cancel"
            @click="cancel"
          >{{config.cancelText}}</Button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

@Component({ components: {} })
/**
 * 事件
 * onClose: 弹窗关闭触发的事件（必须监听此事件，并修改弹窗显示的参数值）
 *             如：<Dialog :configer="dialogConfig" @onClose="dialogConfig.show = false"></Dialog>
 * onOk: 确定按钮事件
 * onCancel: 取消按钮事件
 *
 * slot 内容部分
 *
 * 参数
 * configer{} 配置项如下
 *
 * icon: 标题图标编码，如： &#xe791;
 * title: 标题
 * ok: 是否有确定按钮
 * cancel: 是否有取消按钮
 * ishide: 是否使用默认取消事件（即点取消时关闭弹窗）
 * okText: 确定按钮的文字描述
 * cancelText: 取消按钮的文字描述
 * position: 按钮对齐方式 center:默认, left: 靠左, right: 靠右
 * size: 按钮尺寸大小 large: 默认, small: 偏小, normal: 正常大小
 */
export default class ComponentName extends Vue {
  private position: string = "center";
  // 配置参数
  @Watch("configer", { immediate: true, deep: true })
  refreshConfig() {
    if (JSON.stringify(this.configer) !== "{}") {
      Object.assign(this.config, this.configer);
    }
  }
  @Prop() private configer!: any;
  private config: any = {
    show: false,
    icon: "", // 标题图标
    title: "", // 标题
    ok: true,
    cancel: true,
    ishide: true,
    disabled: false,
    okText: "确定", // 确定按钮的文字描述
    cancelText: "取消", // 取消按钮的文字描述
    position: "center",
    size: "large",
    tip: ""
  };
  mounted() {
    if (JSON.stringify(this.configer) !== "{}") {
      Object.assign(this.config, this.configer);
    }
    switch (this.config.position) {
      case "left":
        this.position = "flex-start";
        break;
      case "right":
        this.position = "flex-end";
        break;
      default:
        this.position = "center";
    }
  }

  //   确定事件
  private ok() {
    this.$emit("onOk");
  }
  // 取消
  private cancel() {
    this.$emit("onCancel");
    if (this.config.ishide) {
      this.close();
    }
  }

  //   弹窗关闭时触发
  private close() {
    this.$emit("onClose");
  }
}
</script>

<style lang='scss' scoped>
.dialog-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: self-start;
  padding: 5% 0;
  background-color: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
  .dialog {
    background-color: $bg01;
    color: $font04;
    min-width: 300px;
    max-width: 1200px;
    min-height: 100px;
    border-radius: 5px;
    overflow: hidden;
    .title {
      display: flex;
      padding: 8px 20px;
      border-bottom: 1px solid $borderLight;
      h3 {
        flex: 1;
        font-size: 14px;
        font-weight: bold;
        background-color: $bg01;
        padding: 0 20px;
        color: $font01;
        word-break: break-all;
        .tip {
          font-size: 12px;
          color: #ff9800;
        }
      }
      .close {
        cursor: pointer;
        float: right;
        color: $font03;
        transition: all 0.33s;
        &:hover {
          color: $font02;
        }
      }
    }
    .content {
      padding: 10px;
      border-left: 1px solid $borderLight;
      border-right: 1px solid $borderLight;
    }
    .footer {
      padding: 0 20px;
      border: 1px solid $borderLight;
      border-top: none;
      display: flex !important;
      justify-content: center;
      align-items: center;
      > button {
        margin: 10px 0;
      }
      .large {
        width: 130px;
        height: 40px;
        line-height: 40px;
        padding: 0;
      }
      .small {
        padding: 1px 5px 2px;
      }
      .cancel {
        border: none;
        color: #fff;
        background-color: $btn-cancel;
        margin-left: 10px;
        &:active {
          background-color: $btn-cancel-active;
        }
        &:hover {
          background-color: $btn-cancel-hover;
        }
      }
    }
  }
}

.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.5s ease;
}
.dialog-enter,
.dialog-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
.dialog-enter-to,
.dialog-leave {
  transform: translateY(0);
  opacity: 1;
}
</style>
