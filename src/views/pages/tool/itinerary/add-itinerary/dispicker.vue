<template>
  <div class="distpicker">
    <Select
      v-model="select.provinceCode"
      class="distpicker-select"
      :label-in-value="true"
      @on-change="changeProvinces"
    >
      <Option v-for="item in provinces" :value="item.region" :key="item.region">{{ item.name }}</Option>
    </Select>
    <template v-if="city.length">
      <Select
        v-model="select.cityCode"
        class="distpicker-select"
        :label-in-value="true"
        @on-change="changeCity"
      >
        <Option v-for="item in city" :value="item.region" :key="item.region">{{ item.name }}</Option>
      </Select>
    </template>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit, Model, Prop } from 'vue-property-decorator';
import { getCityRegion } from "@service/common";

@Component
export default class Distpicker extends Vue {
  @Model('change', { type: String }) readonly region!: string;
  @Prop() defalut!:string;
  provinces:Array<any> = [];
  city:Array<any> = [];
  @Emit()
  change (region: string) {
    return region
  }
  select = {
    provinceCode: '',
    cityCode: '',
  }
  /** 选择省 */
  changeProvinces (data: any) {
    if(data) {
      this.getSelectOptions('city', data.value);
      this.select.provinceCode = data.value;
      this.select.cityCode = '';
    } else {
      this.select.provinceCode = '';
      this.select.cityCode = '';
    }
    this.change('')
  }
  /** 选择市 */
  changeCity (data: any) {
    if (data) {
      this.select.cityCode = data.value;
      this.change(data.value);
    } else {
      this.select.cityCode = '';
      this.change('');
    }
  }
  getProvinceRegion() {
    this.getSelectOptions('provinces');
  }
  /** 获取三级联动数据 */
  getSelectOptions (key: 'city' | 'provinces', region?: any) {
    getCityRegion({
      language: "CN",
      region
    }).then((res: any) => {
      let list = res.datas.slice(0, res.datas.length);
      this[key] = list;
    });
  }
  /** 获取选中状态的region */
  getSelectRegionByDefalutRegion () {
    if (!this.region) {
      return false;
    }
    let str1 = this.region.slice(0, 2);
    let str2 = this.region.slice(2, 4);
    this.select.provinceCode = `${str1}0000`
    if (str2 != '00') {
      this.select.cityCode = `${str1}${str2}00`
    } else {
      this.select.cityCode = '';
    }
    this.getSelectOptions('city', this.select.provinceCode)
  }
  created () {
    this.getSelectRegionByDefalutRegion();
    this.getProvinceRegion()
  }
}
</script>

<style lang='scss' scoped>
.distpicker{
  &-select{
    width:160px;
    margin-right:5px;
  }
}
</style>
