<template>
    <div class="wrap">
        <Form :label-width="50" inline>
            <FormItem class="item" label="编号">
                <Input  placeholder="请输入编号" v-model="data.code" @on-enter="handleSubmit"/>
            </FormItem>
            <FormItem class="item" label="名称">
                <Input  placeholder="请输入农家乐名称" v-model="data.name" @on-enter="handleSubmit"/>
            </FormItem>
            <FormItem class="item" label="状态">
                <Select class="w150" v-model="data.status" @on-change="handleSubmit">
                    <Option value="" selected>全部</Option>
                    <Option value="1" >正常</Option>
                    <Option value="0">禁用</Option> 
                </Select>
            </FormItem>
            <FormItem class="item" label="等级">
                <Select class="w150" v-model="data.level" @on-change="handleSubmit">
                    <Option value="" selected>全部</Option>
                    <Option :value="level.id" v-for="level in levels" :key="level.id">{{ level.name }}</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="时间：">
                <Date-picker type="daterange" placement="bottom-start" placeholder="选择日期" @on-change="getDate" ></Date-picker>
            </FormItem>
            <div class="submit">
                <Button type="primary" class="" @click="handleSubmit">搜索</Button>
                <router-link :to="{path:'/agritainment-search', query:{id:id}}" v-if="operates.includes('save') && $store.state.app.userInfo.dataType === 'SITE'" class="btn-primary ml10">添加</router-link>
                <router-link :to="{path:'/agritainment-add', query:{id:id}}" v-if="operates.includes('save') && $store.state.app.userInfo.dataType !== 'SITE'" class="btn-primary ml10">添加</router-link>
            </div>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {AppModule} from "@store/modules/app";
    import { dictType } from "@service/common";
    @Component
    export default class foodSearch extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        private id:any='';
        private data:any={
            code:'',//编号
            name:'',//名称
            status:'',//状态
            level: '', // 星级
            startTime:'',//开始时间
            endTime:''//结束时间
        };
        private levels: any[] = [];
        private getDictType(type: string) {
            return dictType({ type }).then((res: any) => {
            if (res.code === 0) {
                return res.datas
            } else {
                return []
            }
            })
        }
        handleSubmit(){
            this.bus.$emit('requestAgritainmentList',this.data)
        }
        getDate(value:any){
            this.data.startTime=value[0]
            this.data.endTime=value[1]
            this.handleSubmit();
        }
        created () {
            this.getDictType('AGRITAINMENT_LEVEL').then((datas:any) => this.levels = datas);
        }
        mounted(){
            this.id=this.$route.query.id;
        }
    }
</script>

<style scoped lang="scss">
    .inp-control {
        width: 70%;
    }
    .label-name{
        width: 75px;
        line-height: 35px;
    }
    .w150{
        width: 150px;
    }
    .wrap {
        padding: 15px 15px 0 15px;
        background-color: $grayLight;
        .submit{
            display: inline-block;
            margin:0 0 15px 10px;
        }
        .ivu-form-item{
            margin-bottom: 15px!important;
        }
    }
</style>
