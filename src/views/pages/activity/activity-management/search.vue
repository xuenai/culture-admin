<template>
    <div class="wrap">
        <Form class="form" ref="formInline" inline :label-width="70">
            <FormItem label="活动名称">
                <Input type="text" placeholder="请输入关键字" v-model="condition.keyword" style="width: 150px"/>
            </FormItem>
            <FormItem label="创建者">
                <Input type="text" placeholder="请输入关键字" v-model="condition.createUser" style="width: 150px"/>
            </FormItem>
            <FormItem label="活动方式" class="select">
                <Select style="width: 150px" v-model="condition.method">
                    <Option value>全部</Option>
                    <Option value="ACTIVITY_MODE_FREE">免费预订</Option>
                    <Option value="ACTIVITY_MODE_ENROLL_FREE">免费报名</Option>
                    <Option value="ACTIVITY_MODE_INTEGRAL">积分兑换</Option>
                    <Option value="ACTIVITY_MODE_MONEY">在线支付</Option>
                    <Option value=" ACTIVITY_MODE_MONEY_INTEGRAL">在线支付+积分</Option>
                    <Option value="ACTIVITY_MODE_UNDER_LINE">线下</Option>
                    <Option value="ACTIVITY_MODE_UNDER_LINE">线上</Option>
                    <Option value="ACTIVITY_MODE_PLAIN">普通</Option>
                </Select>
            </FormItem>
            <FormItem label="活动分类" class="select">
                <Select style="width: 150px" v-model="condition.classify">
                    <Option
                        v-for="item in activityClassify"
                        :value="item.id"
                        :key="item.id">{{item.labelName}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="活动状态" class="select">
                <Select style="width: 150px" v-model="condition.activityStatus">
                    <Option value>全部</Option>
                    <Option value="0">未开始</Option>
                    <Option value="1">进行中</Option>
                    <Option value="2">已结束</Option>
                    <Option value="3">招募中</Option>
                </Select>
            </FormItem>
            <FormItem label="审核状态" class="select">
                <Select style="width: 150px" v-model="condition.status">
                    <Option value>全部</Option>
                    <Option value="1">正常</Option>
                    <Option value="2">禁用</Option>
                    <Option value="3">草稿</Option>
                    <Option value="4">待审核</Option>
                    <Option value="5" v-if="$store.state.app.userInfo.dataType != 'SITE'">审核中</Option>
                    <Option value="6">审核通过</Option>
                    <Option value="7">回退</Option>
                    <Option value="8">撤回</Option>
                    <Option value="9">终止</Option>
                </Select>
            </FormItem>
            <FormItem label="活动日期">
                <DatePicker
                        type="daterange"
                        separator=" 至 "
                        @on-change="selectActiveDate"
                        placeholder="选择日期筛选"
                        placement="bottom-end"
                        style="width: 200px"
                ></DatePicker>
            </FormItem>
            <FormItem label="上报时间">
                <DatePicker
                        type="daterange"
                        separator=" 至 "
                        @on-change="selectAddTime"
                        placeholder="选择日期筛选"
                        placement="bottom-end"
                        style="width: 200px"
                ></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="search">搜索</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {getTagsSelect} from "@service/common";
    import {getReportList} from "@service/activity";

    @Component
    export default class contentSearch extends Vue {
        private condition = <any>{
            keyword: '',
            createUser: '',
            method: '',
            classify: '',
            activityStatus: '',
            status: '',
            activityStart:'',
            activityEnd:'',
            startTime:'',
            endTime:''
        }
        // 活动分类
        private activityClassify = []

        created () {
            this.getActivityClassify()
        }

        // 搜索
        private search () {
            getReportList(this.condition).then((res:any) => {
                this.$emit('getList', res)
            })
        }
        // 选择活动日期
        private selectActiveDate (date: string) {
            this.condition.activityStart = date[0]
            this.condition.activityEnd = date[1]
        }
        // 选择上报日期
        private selectAddTime (date: string) {
            this.condition.startTime = date[0]
            this.condition.endTime = date[1]
        }
        // 活动分类获取
        private getActivityClassify() {
            getTagsSelect({
                resourceType: 'CONTENT_TYPE_ACTIVITY',
                labelType: 'ACTIVITY_CLASSIFY'
            }).then((res: any) => {
                if (res.code === 0) {
                    this.activityClassify = res.datas
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .wrap {
        width: 100%;
        padding-top: 15px;
        background: $grayLight;
        margin-bottom: 20px;
        .item{
            margin-top: 10px;
        }
        .submit{
            display: inline-block;
            margin-left: 10px;
        }
    }
</style>
