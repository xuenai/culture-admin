<template>
    <div class="wrap">
        <Form :label-width="80" inline>
            <FormItem class="item" label="编号">
                <Input  placeholder="请输入编号" v-model="data.code" @on-enter="handleSubmit"/>
            </FormItem>
            <FormItem class="item" label="名称">
                <Input  placeholder="请输入客房名称" v-model="data.name" @on-enter="handleSubmit"/>
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
            <div class="submit">
                <Button type="primary" class="" @click="handleSubmit">搜索</Button>
                <router-link :to="{path:'/guestroom-add',query:{hotelId:data.hotelId}}"  v-if="operates.includes('save')"  class="btn-primary ml10">添加</router-link>
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
        private data:any={
            hotelId:'',//酒店ID
            number:'',//编号
            name:'',//名称
            status:''//状态
        };
        handleSubmit(){
            this.bus.$emit('requestGuestRoomList',this.data)
        }
        mounted(){
            this.data.hotelId=this.$route.query.hotelId;
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
