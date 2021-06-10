<template>
    <div class="container">
        <Form class="form" ref="formInline" inline :label-width="70">
            <div>
                <FormItem label="活动名称">
                    <Input type="text" placeholder="请输入关键字" v-model="condition.keyword" class="w200" @on-enter="search"/>
                </FormItem>
                <FormItem label="创建者">
                    <Input type="text" placeholder="请输入关键字" v-model="condition.createUser" class="w200" @on-enter="search"/>
                </FormItem>
                <FormItem label="活动方式" class="select">
                    <Select class="w200" v-model="condition.method" @on-change="search">
                        <Option value>全部</Option>
                        <Option v-for="(item, k) in ACTIVITY_METHOD" :key="k" :value="k">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="活动分类" class="select">
                    <Select class="w200" v-model="condition.classify" @on-change="search">
                        <Option
                                v-for="item in activityClassify"
                                :value="item.id"
                                :key="item.id">{{item.labelName}}
                    </Option>
                    </Select>
                </FormItem>
            </div>
            <div>
                <FormItem label="活动状态" class="select">
                    <Select class="w200" v-model="condition.activityStatus" @on-change="search">
                        <Option value>全部</Option>
                        <Option value="0">未开始</Option>
                        <Option value="1">进行中</Option>
                        <Option value="2">已结束</Option>
                        <Option value="3">招募中</Option>
                    </Select>
                </FormItem>
                <FormItem label="审核状态" class="select">
                    <Select class="w200" v-model="condition.status" @on-change="search">
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
                            class="w200"
                    ></DatePicker>
                </FormItem>
                <FormItem label="上报时间">
                    <DatePicker
                            type="daterange"
                            separator=" 至 "
                            @on-change="selectAddTime"
                            placeholder="选择日期筛选"
                            placement="bottom-end"
                            class="w200"
                    ></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </div>
        </Form>
        <baseTable :configure="tableConfig" @getList="search">
            <Table border
                   @on-selection-change="selectionTable"
                   :columns="data.columns9"
                   :loading="loading"
                   :data="data.data6" class="mt15">
                <template slot-scope="{ row }" slot="name">
                    <div class="info-list clearfix">
                        <div class="img-box fl" :class="{
                              'faith-audit': (row.faithAuditStatus && row.faithAuditValue),
                              'faith-use': (row.faithUseStatus && row.faithUseValue)}">
                            <router-link :to="{ path: '/ac-detail', query: { id: row.id }}"><img v-if="row.images" :src='row.images.split(",")[0]'/></router-link>
                        </div>
                        <div class="introduce-content nonedate fl">
                            <p class="hot">
                                <router-link :to="{ path: '/ac-detail', query: { id: row.id }}">{{ row.name }}</router-link>
                            </p>
                            <p class="time">活动日期：<span>{{ row.useStartTime.slice(0, -3) }}至{{ row.useEndTime.slice(0, -3) }}</span></p>
                            <p class="add">活动地点：<span>{{ row.address }}</span></p>
                        </div>
                    </div>
                </template>

                <template slot-scope="{ row }" slot="method">
                    <span>{{ACTIVITY_METHOD[row.method]}}</span>
                </template>

                <template slot-scope="{ row }" slot="classify">
                    <span>{{getLabelName(row.classify)}}</span>
                </template>

                <template slot-scope="{ row }" slot="activityStatus">
                    <span>{{activityStatus[row.activityStatus]}}</span>
                </template>

                <template slot-scope="{ row }" slot="auditStatus">
                    <span>{{AUDIT_DATA_STATUS[row.auditStatus]}}</span>
                </template>

                <template slot-scope="{ row, index }" slot="action">
                    <a href="javascript:;" @click="recall(row, index)" v-if="recallStatus.includes(row.auditStatus) && operates.includes('recall')">撤回 </a>
                    <router-link v-if="modifyStatus.includes(row.auditStatus) && operates.includes('edit')" :to="{ path: getActivityEditPath(row), query: { id: row.id, classify: row.classify, method: row.method }}"> 修改 </router-link>
                    <a href="javascript:;" v-if="operates.includes('list_detail') && row.auditStatus===1"> 预览 </a>
                    <a href="javascript:;" @click="delReport(row, index)" v-if="delStatus.includes(row.auditStatus) && operates.includes('delete')"> 删除</a>
                </template>
            </Table>
        </baseTable>
        <Button @click="delReport(checkedBox, -1)" v-if="operates.includes('batchDelete')">批量删除</Button>
    </div>
</template>
<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import BaseTable from "@components/baseTable/baseTable.vue"
    import {getTagsSelect} from "@service/common";
    import {getReportList, delActiveReport, withdrawReport} from "@service/activity";
    import {AppModule} from "@store/modules/app";
    import {ACTIVITY_METHOD, AUDIT_DATA_STATUS} from "@constant/index"
    import {getActivityEditPath} from "@util/comm"

    @Component({
        components: {
            BaseTable
        }
    })
    export default class list extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }

        private getActivityEditPath = getActivityEditPath;
        private ACTIVITY_METHOD = ACTIVITY_METHOD;
        private AUDIT_DATA_STATUS = AUDIT_DATA_STATUS;
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
            endTime:'',
            pageSize: 10,
            curr: false
        }
        // 活动分类
        private activityClassify = []
        // 表格配置
        private tableConfig = <any>{
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            pagePosition: "right"
        };
        // 复选框ID
        private checkedBox: Array<Number> = [];
        // 表格数据
        private data = <any>{
            columns9: [
                {
                    type: "selection",
                    width: "55"
                },
                {
                    title: "活动信息",
                    slot: "name",
                    width: 350
                },
                {
                    title: "创建者",
                    key: "createUser",
                    align: "center"
                },
                {
                    title: "活动方式",
                    key: "method",
                    align: "center",
                    slot: "method"
                },
                {
                    title: "活动分类",
                    key: "classify",
                    align: "center",
                    slot: "classify"
                },
                {
                    title: "上报时间",
                    align: "center",
                    key: "createTime"
                },
                {
                    title: "活动状态",
                    key: "activityStatus",
                    slot: "activityStatus",
                    align: "center"
                },
                {
                    title: "审核状态",
                    key: "auditStatus",
                    slot: "auditStatus",
                    align: "center"
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center"
                }
            ],
            data6: [
                /*{
                 _disabled: true,
                 activityId: 1,
                 classify: 175,
                 method: "ACTIVITY_MODE_PLAIN",
                 name: "123",
                 auditStatus: 4,
                 createUserName: 'xt',
                 status: 1,
                 endDate: "2017/10/10",
                 startDate: "2017/10/12",
                 createTime: "2017/10/12",
                 address: "address",
                 images: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559024885326&di=f85102d8a2dfab58b7b6dc37cce07b26&imgtype=0&src=http%3A%2F%2Fpic15.nipic.com%2F20110628%2F1369025_192645024000_2.jpg"
                 },
                 {
                 activityId: 11,
                 classify: 1750,
                 method: "ACTIVITY_MODE_PLAIN",
                 name: "123",
                 auditStatus: 4,
                 createUserName: 'xt',
                 status: 1,
                 endDate: "2017/10/10",
                 startDate: "2017/10/12",
                 createTime: "2017/10/12",
                 address: "address",
                 images: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559024885326&di=f85102d8a2dfab58b7b6dc37cce07b26&imgtype=0&src=http%3A%2F%2Fpic15.nipic.com%2F20110628%2F1369025_192645024000_2.jpg"
                 }*/
            ]
        };
        // loading
        private loading: boolean = false;
        // 活动状态
        private activityStatus = <object>{
            0: "未开始",
            1: "进行中",
            2: "已结束",
            3: "招募中",
        }
        // 具有修改动作的status
        private modifyStatus: Array<number> = [1, 2, 7, 8]
        // 具有删除动作的status
        private delStatus: Array<number> = [7, 8, 9, 79]
        // 具有撤回动作的status
        private recallStatus: Array<number> = [4]

        created () {
            this.getActivityClassify()
            this.search()
        }

        // 撤回
        private recall(row: any, index: number) {
            withdrawReport({id: row.reportId}).then((res:any) => {
                if (res.code === 0) {
                    this.$Message.success("撤回成功");
                    this.data.data6.splice(index, 1);
                }
            })
        }
        // 删除
        private delReport(item: any, index: Number) {
            if (index === -1 && !this.checkedBox.length) {
                this.$Message.error("请选择需要删除的内容！");
                return;
            }
            let config: any = {
                title: `删除内容`,
                content: `确认删除“${item.name || "选中"}”内容？删除内容后将无法恢复`,
                okText: "确认",
                cancelText: "关闭",
                onOk: () => {
                    if (index !== -1) {
                        this.delList(item.reportId, index);
                    } else {
                        this.delList(item, -1);
                    }
                }
            };
            this.$Modal.confirm(config);
        }
        // 删除
        private delList(id: any, index: Number) {
            delActiveReport({
                resourceType: "CONTENT_TYPE_ACTIVITY",
                resourceIds: index !== -1 ? id : this.checkedBox.toString()
            }).then((data:any) => {
                if (data.code === 0) {
                    this.$Message.success("删除成功");
                    if (index !== -1) {
                        this.data.data6.splice(index, 1);
                    } else {
                        this.condition.currPage = 1;
                        this.search();
                    }
                }
            })
        }
        // label名字
        private getLabelName (id: number) {
            let data: Array<{labelName: string}> = this.activityClassify.filter((item:any) => item.id === id)
            return data[0] ? data[0].labelName : ''
        }
        // 列表选择项数据变化
        private selectionTable(data: Array<any>) {
            this.checkedBox = data.map((item: any) => item.reportId);
        }
        // 搜索
        private search (page?: any) {
            if (page) {
                this.condition.currPage = page.currPage
                this.condition.pageSize = page.pageSize
            } else {
                this.condition.currPage = 1
                this.condition.pageSize = 10
            }

            getReportList(this.condition).then((res:any) => {
                this.data.data6 = res.datas.map((data:any) => {
                    if (data.auditStatus === 4) data._disabled = true
                    return data
                })

                if (res.page) {
                    this.tableConfig.page.currPage = res.page.currPage
                    this.tableConfig.page.total = res.page.total
                }
            }).catch(() => {
                this.data.data6 = []
            })
        }
        // 选择活动日期
        private selectActiveDate (date: string) {
            this.condition.activityStart = date[0]
            this.condition.activityEnd = date[1]
            this.search()
        }
        // 选择上报日期
        private selectAddTime (date: string) {
            this.condition.startTime = date[0]
            this.condition.endTime = date[1]
            this.search()
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
.w200 {
    width: 200px;
}
.img-box{
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 5px;
    img{
        width: 100%;
        height: 100%;
    }
}
.container{
    padding: 15px 15px;
    .form {
        padding-top: 24px;
        background: $grayLight;
    }
    .img-box {
        position: relative;
        width: 90px;
        height: 60px;
        overflow: hidden;
        &.faith-use:after {
            content: '诚信优享';
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 0 5px;
            color: #fff;
            background: rgba(255, 102, 0, 1);
            line-height: 20px;
            text-align: center;
            border-radius: 4px;
        }
        &.faith-audit:after {
            content: '诚信免审';
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 0 5px;
            color: #fff;
            background: rgba(20, 204, 86, 1);
            line-height: 20px;
            text-align: center;
            border-radius: 4px;
        }
        img {
            width: 100%;
        }
    }
    .introduce-content {
        margin-left: 10px;
    }
    .info-list {
        display: flex;
        padding: 20px 0;
    }
}
</style>
