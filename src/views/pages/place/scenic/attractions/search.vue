<template>
    <div class="container pd15">
        <div class="title">
            <h2>大旗生态数据库</h2>
            <p class="mt10 tips">你可以直接使用大旗生态数据库中资源进行使用</p>
        </div>
        <Form class="mt15" ref="params" :label-width="100" :model="params">
            <FormItem label="景点名称：" prop="name">
                <Input class="control" v-model="params.name" placeholder="请输入景点名称"/>
            </FormItem>
            <FormItem label="行政区域：" prop="region">
                <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
            </FormItem>
            <FormItem label="">
                <router-link :to="{path:'/attractions-search-list',query:{name:params.name,region:params.region,cityName:params.cityName,code:this.$route.query.resourceCode}}"
                             class="btn-primary ml10">搜索
                </router-link>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import distPicker from "@components/distPicker/distPicker.vue";

    @Component({
        components: {
            distPicker
        }
    })
    export default class list extends Vue {
        private params: any = {
            name: '',
            region: '',
            resourceType: 'CONTENT_TYPE_SCENIC_SPOTS',
            cityName: ''
        };
        private regionPath: string = '';

        //地区编码
        getRegion(data: any) {
            this.params.region = data.region;
            this.params.cityName = data.cityName
        }
    }
</script>

<style scoped lang="scss">
    .title {
        margin: 30px 0 30px 30px;
        .tips {
            color: $font06;
        }
    }

    .control {
        width: 300px !important;
    }
</style>
