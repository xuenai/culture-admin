<template>
    <div class="wrap">
        <Form :label-width="50" inline>
            <FormItem class="item" label="编号">
                <Input  placeholder="请输入编号" v-model="data.code" />
            </FormItem>
            <FormItem class="item" label="名称">
                <Input  placeholder="请输入停车场名称" v-model="data.name"></Input>
            </FormItem>
            <FormItem class="item" label="状态">
                <Select class="w150" v-model="data.status" @on-change="handleSubmit">
                    <Option value="" selected>全部</Option>
                    <Option value="1" >正常</Option>
                    <Option value="2">禁用</Option>
                    <Option value="3">草稿</Option>
                    <Option value="4">待审核</Option>
                    <Option value="7">回退</Option>
                    <Option value="8">撤回</Option>
                    <Option value="9">终止</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="时间">
                <Date-picker type="daterange" placement="bottom-end" placeholder="选择日期" @on-change="getDate"></Date-picker>
            </FormItem>
            <div class="submit">
                <Button type="primary" class="" @click="handleSubmit">搜索</Button>
                <router-link :to="{path:'/parking-add'}" v-if="operates.includes('save')" class="btn-primary ml10">添加</router-link>
            </div>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {AppModule} from "@store/modules/app";
    @Component
    export default class search extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        private date:string='';
        private data:any={
            code:'',//编号
            name:'',//场馆名称
            status:'',//状态
            startTime:'',//开始时间
            endTime:''//结束时间
        };
        // 选择时间段
        getDate(date:any){
            this.date=date;
            this.data.startTime=date[0];
            this.data.endTime=date[1];
        }
        handleSubmit(){
            this.bus.$emit('requestParkingList',this.data)
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
