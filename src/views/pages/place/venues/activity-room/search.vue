<template>
<div>
     <Head resourceType="CONTENT_TYPE_VENUE" @getCode="getCode"></Head>
     <Form :label-width="50" inline class="wrap">
        <FormItem class="item" label="编号">
            <Input placeholder="请输入编号" v-model="data.code" @on-enter="handleSubmit"/>
        </FormItem>
        <FormItem class="item" label="名称">
            <Input placeholder="请输入活动室名称" v-model="data.name" @on-enter="handleSubmit"/>
        </FormItem>
        <FormItem class="item" label="状态">
            <Select class="w150" v-model="data.status"  @on-change="handleSubmit">
                <Option value="" selected>全部</Option>
                <Option value="1">正常</Option>
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
            <router-link :to="{path:'/room-add',query:{venueId:id}}" v-if="operates.includes('save') &&!resourceCode" class="btn-primary ml10">添加</router-link>
            <router-link :to="{path:'/room-search-list',query:{venueId:id,resourceCode:resourceCode}}" v-if="operates.includes('save')&&resourceCode" class="btn-primary ml10">添加</router-link>
        </div>
    </Form>
</div>
    
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import { AppModule } from "@store/modules/app";
    import Head from "./head.vue";
   @Component({
        components: {
            Head
        }
    })
    export default class contentSearch extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        private id: any = '';
        private data: any = {
            code: '',//编号
            name: '',//场馆名称
            status: ''//状态
        };
        //获取资源编码
        private resourceCode:any='';
        getCode(resourceCode:any){
            this.resourceCode=resourceCode;
        }
        handleSubmit() {
            this.bus.$emit('activityRoomSreach', this.data);
        };

        mounted() {
            this.id = this.$route.query.venueId;
        }
    }
</script>

<style scoped lang="scss">
    .w150 {
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
