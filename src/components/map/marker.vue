<!--
 * @Author: chenyl
 * @since: 2019-05-27 20:57:47
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-27 15:43:47
 -->
<template>
  <div class="map-warp">
    <div class="map-container">
      <div :id="id" class="smMap"></div>
      <div class="poi-wrap">
        <div class="search-wrap">
          <input :id="`${id}-autoTipInput`" type="text" class="search-txt" placeholder="请输入地址获取对应坐标位置">
          <Icon type="ios-search" class="search-btn"/>
        </div>
      </div>
    </div>
    <div class="operate mt20">
      <span><em class="red" v-if="lab">*</em> 位置标注</span>
      <i-input class="enter-control" placeholder="经度" disabled v-model="lnglat.lng"></i-input>-
      <i-input class="enter-control" placeholder="纬度" disabled v-model="lnglat.lat"></i-input>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * 参数说明
 * lab: 是否显示必选标志, true 表示显示
 * id: 地图id
 * address: 默认标记的经纬度数组
 * region: 设置地图中心位置的 当region变化时 自动跳转到对应region的地图
 *
 * 事件
 * @getAddress : 点击地图上描点变化时触发,参数是地图点击事件参数
 */
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class mapMarker extends Vue {
  // 由于可能同个页面存在多个地图,所以需要传元素id
  @Prop() private lab!: boolean;
  @Prop() private id!: string;
  @Prop() private address!: Array<string>;
  @Prop() private region!: string;
  private word:string = '';
  private map: any = {};
  private lnglat: any = {
    lng: "",
    lat: ""
  };
  private poiPicker:any = {};
  private marker:any = {};
  mounted() {
      this.initMap();
      if (this.address.length) {
          this.lnglat.lng = this.address[0];
          this.lnglat.lat = this.address[1];
      }
  }

  @Watch("address")
  changeAdd(val: any, oldVla: any) {
    if (val.length) {
      this.lnglat.lng = val[0];
      this.lnglat.lat = val[1];
      if(this.lnglat.lng && this.lnglat.lat){
        let marker = new AMap.Marker({
          isCustom: false,
          position: [this.lnglat.lng, this.lnglat.lat],
          map: this.map
        });
        this.map.add([marker]);
        this.map.setFitView();
      }
    }
  }
  // 设置地图显示的行政区域
  @Watch("region")
  regionChangeHandle(val: string) {
    if (val) {
      this.map.setCity(val)
    }
  }
  // 初始化地图
  initMap() {
    this.marker =  new AMap.Marker();
    // 渲染地图
    let _this = this;
    if (this.lnglat.lng) {
      this.map = new AMap.Map(_this.id, {
        resizeEnable: true,
        center: [this.lnglat.lng, this.lnglat.lat]
      });
      this.marker.setMap(this.map);
      this.marker.setPosition(this.lnglat);
      // this.map.add([marker]);
    } else {
      this.map = new AMap.Map(_this.id, {
        resizeEnable: true
      });
    }
    //构造点标记
    this.map.on("click", this.addMarker);
    this.setSeletPoiFunc();
  }
  setSeletPoiFunc () {
    let _this = this
    let id = `${this.id}-autoTipInput`
    AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker: any) {
      if (!document.getElementById(id)) return;
      var poiPicker = new PoiPicker({
          input: id
      });
      //初始化poiPicker
      _this.poiPickerReady(poiPicker);
    })
  }
  poiPickerReady (poiPicker:any) {
    this.poiPicker = poiPicker;
    let _this = this;
    poiPicker.on('poiPicked', function (poiResult:any) {
      let poi = poiResult.item;
      _this.addMarker({lnglat: {lat: poi.location.lat, lng: poi.location.lng}})
    })
  }
  //构造点标记
  addMarker(e: any) {
    this.map.clearMap();
    this.lnglat.lng = e.lnglat.lng;
    this.lnglat.lat = e.lnglat.lat;
    this.$emit("getAddress", e);
    this.marker.setMap(this.map);
    this.marker.setPosition([this.lnglat.lng, this.lnglat.lat]);
    this.map.setFitView();
  }
}
</script>
<style scoped lang="scss">
.smMap {
  width: 100%;
  height: 335px;
  position: relative;
  touch-action: none;
}
.map-container{
  position:relative;
}
.poi-wrap{
  position:absolute;
  right:10px;
  top:10px;
  z-index:1;
}
.search-wrap{
  position:relative;
  width:220px;
  height:34px;
  border-radius:3px;
  border:1px solid #b6c0cf;
  line-height: 34px;
  color:#373e4b;
  background:rgba(255,255,255,.8);
}
.search-txt{
  display: inline-block;
  vertical-align: top;
  width:170px;
  margin-left:8px;
  height:32px;
  line-height:32px;
  background:transparent;
  font-size:12px;
}
.search-btn{
  position:absolute;
  right:8px;
  top:0;
  line-height:32px;
  text-align:center;
  font-size:20px;
  background:transparent;
  color: $font03;
}
.operate {
  .enter-control {
    width: 150px;
    margin: 0 10px;
  }
}
  .red{
    color:red;
  }
</style>
