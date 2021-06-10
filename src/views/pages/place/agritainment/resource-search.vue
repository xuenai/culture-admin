<template>
    <div class="container pd15">
        <div class="title">
            <h2>大旗生态数据库</h2>
            <p class="mt10 tips">你可以直接使用大旗生态数据库中资源进行使用</p>
        </div>
        <Form class="mt15" ref="params" :label-width="100" :model="params" :rules="ruleValidate" @submit.native.prevent>
            <FormItem label="农家乐名称：" prop="name">
                <Input class="control" v-model="params.name" placeholder="请输入农家乐名称" @keyup.enter.native="handlerSearch"/>
            </FormItem>
            <FormItem label="行政区域：">
                <distPicker @onChange="getRegion"></distPicker>
            </FormItem>
            <FormItem label="">
                <span class="btn-primary" @click="handlerSearch">提交</span>
                <!--<router-link :to="{path:'/scenic-search-list',query:{name:params.name,region:params.region,cityName:params.cityName}}"-->
                             <!--class="btn-primary ml10">搜索-->
                <!--</router-link>-->
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
            resourceType: 'CONTENT_TYPE_AGRITAINMENT',
            cityName: ''
        };
        // 验证
        private ruleValidate: any = {
            name: [
                {required: true, message: "请输入农家乐名称", trigger: "blur"},
                {type:'string',max:100,message:'最多输入100个字符'}
            ]
        };
        //地区编码
        getRegion(data: any) {
            this.params.region = data.region;
            this.params.cityName = data.cityName
        }
        //搜索
        handlerSearch(){
            let _this=this;
            // 名称
            (this.$refs.params as any).validate((valid: any) => {
                if (!valid) {
                    return;
                }
                _this.$router.push({path:'/agritainment-search-list',query:{name:_this.params.name,region:_this.params.region,cityName:_this.params.cityName}});
            });
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
