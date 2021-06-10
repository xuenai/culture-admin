<!--
 * @Author: 任智勇
 * @since: 2019-06-20 11:56:09
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-12 16:29:18
 -->
<template>
    <div class="pick1561003233547">
        <Select
                :disabled="disabled"
                v-model="select.provinceCode"
                class="picSelect"
                :label-in-value="true"
                @on-change="changeProvinces"
        >
            <Option value="">省</Option>
            <Option v-for="item in provinces" :value="item.region" :key="item.region">{{ item.name }}</Option>
        </Select>
        <Select
                :disabled="disabled"
                v-model="select.cityCode"
                class="picSelect"
                :label-in-value="true"
                v-if="cityList.length"
                @on-change="changeCitys"
        >
            <Option value="">市</Option>
            <Option v-for="item in cityList" :value="item.region" :key="item.region">{{ item.name }}</Option>
        </Select>
        <Select
                :disabled="disabled"
                v-model="select.areaCode"
                class="picSelect"
                :label-in-value="true"
                v-if="areaList.length"
                @on-change="changeAreas"
        >
            <Option value="">区</Option>
            <Option v-for="item in areaList" :value="item.region" :key="item.region">{{ item.name }}</Option>
        </Select>
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
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {getCityRegion} from "@service/common";

    @Component({components: {}})
    export default class Distpicker extends Vue {
        @Prop() private default!: string;
        @Prop() private disabled!: boolean;

        @Watch("default", {immediate: true, deep: true})
        refreshData() {
            if (this.default) {
                let regionArr = this.default.split(",");
                // 省
                if (regionArr[0]) {
                    this.select.provinceCode = regionArr[0];
                }
                // 市
                if (regionArr[1]) {
                    this.select.cityCode = regionArr[1];
                    this.getCityRegion(regionArr[0]);
                }
                // 区
                if (regionArr[2]) {
                    this.select.areaCode = regionArr[2];
                    this.getAreaRegion(regionArr[1]);
                }
            }
        }

        // region回显
        private select = {
            provinceCode: "",
            cityCode: "",
            areaCode: ""
        };

        mounted() {
            this.getProvinceRegion();
        }

        // 省份改变
        private changeProvinces(data: any) {
            let value = data?data.value:'';
            if (value) {
                this.areaList = [];
                this.getCityRegion(value);
                this.$emit("onChange", {cityName: data.label, region: value, regionPath: value});
            } else{
                this.cityList=[];
                this.$emit("onChange", {cityName: '', region: '', regionPath: ''});
            }
        }

        // 地市改变
        private changeCitys(data: any) {
            let value = data ? data.value:'';
            if (value) {
                this.getAreaRegion(value);
                this.$emit("onChange", {
                    cityName: data.label,
                    region: value,
                    regionPath: this.select.provinceCode + "," + value
                });
            }else{
                this.areaList=[];
                this.$emit("onChange", {
                    cityName:'',
                    region: this.select.provinceCode,
                    regionPath: this.select.provinceCode
                });
            }
        }

        // 区县改变
        private changeAreas(data: any) {
            let value = data ? data.value :'';
            if (value) {
                this.$emit("onChange", {
                    cityName: data.label,
                    region: value,
                    regionPath:
                        this.select.provinceCode + "," + this.select.cityCode + "," + value
                });
            }else {
                this.$emit("onChange", {
                    cityName: '',
                    region: this.select.cityCode ,
                    regionPath:
                        this.select.provinceCode + "," + this.select.cityCode
                });
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

