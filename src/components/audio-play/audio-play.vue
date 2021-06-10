<template>
  <div>
    <div class="audio-box" v-if="music.src">
      <aplayer :music="music"/>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
// @ts-ignore
import Aplayer from "vue-aplayer";
@Component({
  components: {
    Aplayer
  }
})
export default class Audio extends Vue {
  private music: any = {
    title: " ",
    artist: " ",
    src: "",
    pic: " ",
    lrc: "[00:00.00]lrc here\n[00:01.00]aplayer"
  };
  @Prop() private title!: String;
  @Prop() private src!: String;
  mounted() {
    this.music.title = this.title;
    this.music.src = this.src;
  }
}
</script>
<style>
.aplayer-controller .aplayer-icon {
  display: none !important;
}
</style>

<style lang='scss' scoped>
.audio-box {
  position: relative;
  display: inline-block;
  border-radius: 4px;
  overflow: hidden;
  width: 400px;
  background-color: #f9fafc;
  text-align: center;
  .audio-title {
    height: 36px;
    padding: 0 30px;
    margin-top: 25px;
    font-size: 14px;
    line-height: 18px;
    color: #373e4b;
    word-wrap: break-word;
    overflow: hidden;
  }
}
</style>
