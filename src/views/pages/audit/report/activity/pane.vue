<!--
 * @Author: 任智勇
 * @since: 2019-07-02 09:06:38
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-23 16:30:54
 -->
<template>
    <div class="activity-management-pub">
        <div class="topic">
            <Form class="form" ref="formInline" inline :label-width="70" :rules="ruleValidate">
                <FormItem label="活动名称" prop="keyword">
                    <Input type="text" v-model="params.keyword" placeholder="请输入关键字" style="width: 200px" @on-enter="search"/>
                </FormItem>
                <FormItem label="活动方式">
                    <Select style="width: 200px" v-model="params.method" @on-change="search">
                        <Option value>全部</Option>
                        <Option v-for="(item, k) in ACTIVITY_TYPE" :value="k" :key="k">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="活动分类" prop="classify">
                    <Select style="width: 200px" v-model="params.classify" @on-change="search">
                        <Option value>全部</Option>
                        <Option :value="item.id" v-for="item in activityClassify"
                            :key="item.id">{{item.labelName}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="活动日期">
                    <DatePicker
                            @on-change="selectActiveDate"
                            format="yyyy/MM/dd" type="daterange" placement="bottom-end"
                            placeholder="选择活动日期" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="提交时间">
                    <DatePicker
                            @on-change="submitDate"
                            format="yyyy/MM/dd" type="daterange"
                            placement="bottom-end" placeholder="选择提交时间"
                            style="width: 200px"></DatePicker>
                    <Button class="ml20" type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>
        </div>

        <div>
            <baseTable :configure="tableConfig" @getList="search">
                <Table border
                       @on-selection-change="selectionTable"
                       :columns="data.columns8"
                       :loading="loading"
                       :data="data.data6">
                    <template slot-scope="{ row }" slot="name">
                        <div class="info-list clearfix">
                            <div class="img-box fl">
                                <router-link v-if="widthAuditStatus.includes(row.auditStatus) && operates.includes('audit')" :to="{ path: '/audit-ac-audit', query: { id: row.id, auditType: '2', reportId: row.reportId }}">
                                    <img v-if="row.images" :src='row.images.split(",")[0]'/>
                                </router-link>

                                <router-link v-else :to="{ path: '/ac-detail', query: { id: row.id }}"><img v-if="row.images" :src='row.images.split(",")[0]'/></router-link>
                            </div>
                            <div class="introduce-content nonedate fl">
                                <p class="hot">
                                    <router-link v-if="widthAuditStatus.includes(row.auditStatus) && operates.includes('audit')" :to="{ path: '/audit-ac-audit', query: { id: row.id, auditType: '2', reportId: row.reportId }}">
                                        {{ row.name }}
                                    </router-link>

                                    <router-link v-else :to="{ path: '/ac-detail', query: { id: row.id }}">{{ row.name }}</router-link>
                                </p>
                                <p class="time">活动日期：<span>{{ row.startDate }}至{{ row.endDate }}</span></p>
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

                    <template slot-scope="{ row }" slot="status">
                        <span>{{AUDIT_DATA_STATUS[row.auditStatus]}}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <router-link v-if="widthAuditStatus.includes(row.auditStatus) && operates.includes('audit')" :to="{ path: '/audit-ac-audit', query: { id: row.id, auditType: '2', reportId: row.reportId }}">审核 </router-link>
                        <a href="javascript:;" @click="delReport(row, index)" v-if="delStatus.includes(row.status) && operates.includes('delete')"> 删除</a>
                    </template>
                </Table>
            </baseTable>
            <Button @click="delReport(checkedBox, -1)" v-if="operates.includes('batchDelete')">批量删除</Button>
        </div>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
    import BaseTable from "@components/baseTable/baseTable.vue"
    import {getReportList, delActiveReport} from '@service/activity'
    import {AppModule} from "@store/modules/app";
    import {getTagsSelect} from "@service/common";
    import {ACTIVITY_METHOD, AUDIT_DATA_STATUS, ACTIVITY_TYPE} from "@constant/index"

    interface paramType {
        keyword: string;
        method: string;
        classify: string;
        status: number;
        activityStart: string;
        activityEnd: string;
        startTime: string;
        endTime: string;
        curr: boolean;
        currPage?: number;
        pageSize?: number;
    }
    interface activityClassType {
        labelName: string;
        id: number
    }

    @Component({
        components: {
            BaseTable
        }
    })
    export default class ComponentName extends Vue {
        // 数据状态 全部 待审核 不通过
        @Prop() auditStatus?: number;
        // 活动类型
        @Prop({default: []}) activityClassify!: Array<activityClassType>;

        // 权限列表
        get operates() {
            return AppModule.operates;
        }

        private ACTIVITY_METHOD = ACTIVITY_METHOD;
        private AUDIT_DATA_STATUS = AUDIT_DATA_STATUS;
        private ACTIVITY_TYPE = ACTIVITY_TYPE;
        // 查询条件
        private params = <paramType>{status: this.auditStatus, curr: true};
        // 表单验证
        private ruleValidate = <any>{
            keyword: [{message: "不能填写特殊字符", trigger: "blur"}]
        };
        // 表格配置
        private tableConfig = <any>{
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            pagePosition: "right"
        };
        // 表格数据
        private data = <any>{
            columns8: [
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
                    title: "活动方式",
                    key: "method",
                    width: 85,
                    align: "center",
                    slot: "method"
                },
                {
                    title: "活动分类",
                    key: "classify",
                    width: 85,
                    align: "center",
                    slot: "classify"
                },
                {
                    title: "创建者",
                    align: "center",
                    key: "createUser"
                },
                {
                    title: "提交时间",
                    key: "createTime",
                    width: 100,
                    align: "center"
                },
                {
                    title: "状态",
                    key: "status",
                    slot: "status",
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
        // 具有审核动作的status
        private widthAuditStatus: Array<number> = [4]
        // 具有删除动作的status
        private delStatus: Array<number> = [7, 8, 9, 79]
        // loading
        private loading: boolean = false;
        // 复选框ID
        private checkedBox: Array<Number> = [];

        created() {
            this.search();
        }

        // 活动日期选择
        private selectActiveDate(date: Array<string>) {
            if (date.length > 1) {
                this.params.activityStart = date[0] || "";
                this.params.activityEnd = date[1] || "";
                this.search()
            }
        }
        // 提交日期选择
        private submitDate(date: Array<string>) {
            if (date.length > 1) {
                this.params.startTime = date[0] || "";
                this.params.endTime = date[1] || "";
                this.search()
            }
        }
        // label名字
        private getLabelName (id: number) {
            let data: Array<{labelName: string}> = this.activityClassify.filter((item:any) => item.id === id)
            return data[0] ? data[0].labelName : ''
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
                    let ids = item.id
                    if (index === -1) ids = item.toString()
                    this.delList(ids, index)
                }
            };
            this.$Modal.confirm(config);
        }
        // 删除
        private delList(id: any, index: Number) {
            delActiveReport({
                resourceType: "CONTENT_TYPE_ACTIVITY",
                resourceId: id
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
        // 列表选择项数据变化
        private selectionTable(data: Array<any>) {
            this.checkedBox = data.map((item: any) => item.reportId);
        }
        // 搜索
        private search (page?: any) {
            this.loading = true
            if (page) {
                this.params.currPage = page.currPage
                this.params.pageSize = page.pageSize
            } else {
                this.params.currPage = 1
                this.params.pageSize = 10
            }
            getReportList(this.params).then((res:any) => {
                let page = res.page
                let datas = res.datas
                if (page) {
                    this.tableConfig.page.currPage = page.currPage
                    this.tableConfig.page.total = page.total
                }
                if (datas) {
                    this.data.data6 = datas.map((data:any) => {
                        if (data.auditStatus === 4) { // 待审核不能有删除操作
                            data._disabled = true
                        }
                        return data
                    })
                }
            }).catch(() => {
                this.data.data6 = []
            }).finally(() => {
                this.loading = false
            })
            this.$emit('onChange')
        }
    }
</script>

<style lang='scss' scoped>
    .activity-management-pub {
        .topic {
            width: 100%;
            padding-top: 15px;
            margin-bottom: 15px;
            background: $grayLight;
        }
        .info-list {
            padding: 20px 0;
            .img-box {
                position: relative;
                width: 100px;
                height: 84px;
                overflow: hidden;
                img {
                    width: 100%;
                }
            }
            .hot {
                span {
                    color: $danger;
                }
            }
            .time, .add {
                margin-top: 7px;
                span {
                    color: $font03;
                }
            }
            .introduce-content {
                position: relative;
                margin-left: 10px;
            }
        }
        .opation-group {
            a {
                margin-right: 8px;
            }
        }
        .btn-group {
            text-align: center;
            .ivu-btn {
                margin-right: 10px;
            }
        }
        .remove-desc {
            font-size: 16px;
            .cloud-icon {
                color: red;
            }
        }
    }
</style>
