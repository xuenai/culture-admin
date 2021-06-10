<template>
  <div class="map-warp">
    <div :id="id" class="smMap"></div>
    <div class="operate mt20">
      <span>位置标注</span>
      <i-input class="enter-control" disabled v-if="longitude" :value="longitude"></i-input>-
      <i-input class="enter-control" disabled v-if="latitude" :value="latitude"></i-input>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
@Component
export default class mapMarker extends Vue {
  // 由于可能同个页面存在多个地图,所以需要传元素id
  @Prop() private longitude!: string;
  @Prop() private latitude!: string;
  @Prop() private id!: string;
  private map: any = "";
  @Watch('longitude')
  setMap(val: String, old: String) {
    if(val){
      this.initMap();
    }
  }
  mounted() {
    if (this.longitude && this.latitude) {
      this.initMap();
    }
  }
  // 初始化地图
  private initMap() {
    // 渲染地图
    let _this = this;
    this.map = new AMap.Map(this.id, {
      zoom: 12, //初始化地图层级
      center: [this.longitude, this.latitude] //初始化地图中心点
    });
    // 构造点标记
    let marker = new AMap.Marker({
      isCustom: false,
      position: [this.longitude, this.latitude],
      map: this.map
    });
    this.map.add([marker]);
    this.map.setFitView()
  }
}
</script>

<style scoped lang="scss">
.smMap {
  width: 100%;
  height: 365px;
  position: relative;
  touch-action: none;
}

.operate {
  .enter-control {
    width: 150px;
    margin: 0 10px;
  }
}
</style>
