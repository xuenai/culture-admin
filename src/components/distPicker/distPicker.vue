<!--
 * @Author: 任智勇
 * @since: 2019-06-20 11:56:09
 * @LastAuthor: 任智勇
 * @lastTime: 2019-12-18 16:52:06
 -->
<template>
  <div class="pick1561003233547">
    <Select
      :disabled="disabled || (disabledByLevel && regionLevel <= 2)"
      v-model="select.provinceCode"
      class="picSelect"
      :label-in-value="true"
      @on-change="changeProvinces"
    >
      <Option value>全国</Option>
      <Option v-for="item in provinces" :value="item.region" :key="item.region">{{ item.name }}</Option>
    </Select>
    <Select
      :disabled="disabled || (disabledByLevel && regionLevel <= 1)"
      v-model="select.cityCode"
      class="picSelect"
      v-if="cityList.length && select.provinceCode"
      :label-in-value="true"
      @on-change="changeCitys"
    >
      <Option value>全省</Option>
      <Option v-for="item in cityList" :value="item.region" :key="item.region">{{ item.name }}</Option>
    </Select>
    <Select
      :disabled="disabled || (disabledByLevel && regionLevel <= 0)"
      v-model="select.areaCode"
      class="picSelect"
      v-if="areaList.length && select.cityCode"
      :label-in-value="true"
      @on-change="changeAreas"
    >
      <Option value>全市</Option>
      <Option v-for="item in areaList" :value="item.region" :key="item.region">{{ item.name }}</Option>
    </Select>
    <!-- 这个标签不能删除 如果删除了 监听不到AppModule的变化 -->
    <span style="display: none">{{regionPath}}</span>
  </div>
</template>

<script lang='ts'>
/**
 * 参数说明
 * disabled: 是否可选择
 * default: 默认值region路径,以逗号隔开表示当前层级 如：'120000,120100' 表示只选择到天津市
 *
 * @onChange : 切换选择地区时触发，
 *  返回值为 object = { region: 当前选择的地区,regionPath: region路径，即等价于传入参数 default }
 *         类似这样: {region: "510522", regionPath: "510000,510500,510522"}
 *                  {region: "510500", regionPath: "510000,510500"}
 */
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { getCityRegion } from "@service/common";
import { AppModule } from "@store/modules/app";
import { getRegionLevel } from "@util/comm";

@Component({ components: {} })
export default class Distpicker extends Vue {
  @Prop() private default!: string;
  @Prop() private disabled!: boolean;
  @Prop({ default: false }) private disabledByLevel!: boolean; // 是否禁选（禁选当前平台region的同级region及其父级region的选择）

  @Watch("default", { immediate: true, deep: true })
  refreshData(value: any) {
    this.regionPathChangeHandle(value);
  }
  get regionPath() {
    if (AppModule.regionPath && !this.default) {
      let { region, regionName } = AppModule.siteInfo;
      this.regionPathChangeHandle(AppModule.regionPath);
      this.$emit("onChange", {
        cityName: regionName,
        region: region,
        regionPath: AppModule.regionPath
      });
    }
    return AppModule.regionPath;
  }

  // 当前站点regionlevel
  get regionLevel(): number {
    return AppModule.region ? getRegionLevel(AppModule.region) : 2
  };

  // regionPath改变时的触发
  regionPathChangeHandle(value: string) {
    this.select.provinceCode = "";
    this.select.cityCode = "";
    this.select.areaCode = "";
    this.cityList = [];
    this.areaList = [];
    // 传入了初始值 以初始值为准
    if (value) {
      let [province, city, area] = value.split(",");
      // 判断省份是不是直辖市 如果是直辖市
      if (this.directlyCity.includes(province)) {
        this.select.provinceCode = province;
        this.select.cityCode = "";
        this.select.areaCode = "";
        this.cityList = [];
        this.areaList = [];
        // 更改后的地区 返回的scort直辖市都只有两级
        if (city) {
          // if (city.slice(4, 6) !== "00") {
          //   this.select.cityCode = city;
          // }
          // 上面条件没对，并不是都是!==00，澳门的子region就不是
          this.select.cityCode = city;
          if (area) {
            this.select.cityCode = area;
          }
        }
        this.getCityRegion(province);
        return false;
      }
      // 省
      if (province) {
        this.select.provinceCode = province;
        this.getCityRegion(province);
      }
      // 市
      if (city) {
        this.select.cityCode = city;
        this.getAreaRegion(city);
      }
      // 区
      if (area) {
        this.select.areaCode = area;
      }
    }
  }
  // region回显
  private select = {
    provinceCode: "",
    cityCode: "",
    areaCode: "",
    provinceName: "",
    cityName: "",
    areaName: ""
  };

  // 几个直辖市 北京、天津、上海、重庆、香港、澳门 只会存在两个region
  directlyCity = ["110000", "120000", "310000", "500000", "820000"];

  created() {
    this.getProvinceRegion();
  }

  // 省份改变
  private changeProvinces(data: any) {
    if (data) {
      let value = data.value;
      if (value) {
        this.select.provinceName = data.label;
        this.cityList = [];
        this.areaList = [];
        this.getCityRegion(value);
        this.$emit("onChange", {
          cityName: data.label,
          region: value,
          regionPath: value
        });
      } else {
        this.cityList = [];
        this.areaList = [];
        this.$emit("onChange", {
          cityName: "全国",
          // region: '000000',
          region: "",
          // regionPath: '000000'
          regionPath: ""
        });
      }
    }
  }

  // 地市改变
  private changeCitys(data: any) {
    if (data) {
      let value = data.value;
      if (value) {
        this.select.cityName = data.label;
        this.getAreaRegion(value);
        this.areaList = [];
        this.$emit("onChange", {
          cityName: data.label,
          region: value,
          regionPath: this.select.provinceCode + "," + value
        });
      } else {
        this.areaList = [];
        this.$emit("onChange", {
          cityName: this.select.provinceName,
          region: this.select.provinceCode,
          regionPath: this.select.provinceCode
        });
      }
    }
  }
  
  // 区县改变
  private changeAreas(data: any) {
    if (data) {
      let value = data.value;
      if (value) {
        this.select.areaName = data.label;
        this.$emit("onChange", {
          cityName: data.label,
          region: value,
          regionPath:
            this.select.provinceCode + "," + this.select.cityCode + "," + value
        });
      } else {
        this.$emit("onChange", {
          cityName: this.select.cityName,
          region: this.select.cityCode,
          regionPath: this.select.provinceCode + "," + this.select.cityCode
        });
      }
    }
  }

  private provinces: any = [];

  private getProvinceRegion() {
    getCityRegion({
      language: "CN"
    }).then((res: any) => {
      let list = res.datas.slice(0, res.datas.length);
      this.provinces = list;
    });
  }

  // 获取region下的子集数据
  private cityList: any = [];

  private getCityRegion(region: any) {
    getCityRegion({
      region: region,
      language: "CN"
    }).then((res: any) => {
      let list = res.datas.slice(0, res.datas.length);
      this.cityList = list;
    });
  }

  private areaList: any = [];

  private getAreaRegion(region: any) {
    getCityRegion({
      region: region,
      language: "CN"
    }).then((res: any) => {
      let list = res.datas.slice(0, res.datas.length);
      this.areaList = list;
    });
  }
}
</script>

<style lang='scss' scoped>
.pick1561003233547 {
  display: inline-block;
  .picSelect {
    margin-right: 5px;
    width: 120px;
  }
}
</style>

