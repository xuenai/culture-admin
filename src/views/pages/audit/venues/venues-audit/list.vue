<template>
    <div class="venues-audit">
        <Tabs active-key="key1" class="tab-wrap" :animated="false" @on-click="setStatus">
            <Tab-pane label="全部" key="key1"></Tab-pane>
            <Tab-pane :label="waitNum>0?waitLabel:'待审核'" key="key2"></Tab-pane>
            <Tab-pane label="不通过" key="key3"></Tab-pane>
        </Tabs>
        <Form :label-width="80" inline class="wrap">
            <FormItem class="item" label="编号">
                <i-input placeholder="请输入编号" v-model="params.code"></i-input>
            </FormItem>
            <FormItem class="item" label="名称">
                <i-input placeholder="请输入名称" v-model="params.name"></i-input>
            </FormItem>
            <FormItem class="item" label="审核状态" v-if="tabIndex===0">
                <Select class="w150" v-model="params.status" style="width:150px">
                    <Option value="" selected>全部</Option>
                    <Option value="4">待审核</Option>
                    <!--<Option value="5">审核中</Option>-->
                    <Option value="79">审核不通过</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="时间">
                <Date-picker type="daterange" @on-change="getDate" placement="bottom-start" placeholder="选择日期"></Date-picker>
                <Button class="ml20" type="primary" @click="getList">搜索</Button>
            </FormItem>
        </Form>
        <baseTable :configure="tableConfig" @getList="getList">
            <Table :columns="tableData.headList" :data="tableData.bodyList" class="table" :loading="loading" :row-class-name="rowClassName">
                <template slot-scope="{row}" slot="name">
                    <!--场馆详情-->
                    <router-link :to="{path:'/audit-venues-edit',query:{id:row.resourceId,resourceName:row.name}}"
                                    v-if="row.resourceType=='CONTENT_TYPE_VENUE'"
                                    class="theme-blue"> {{row.name}}({{row.code}})
                    </router-link>
                    <!--活动室详情-->
                    <router-link :to="{path:'/audit-room-edit',query:{id:row.resourceId,venueId:row.venueId,resourceName:row.name}}" v-else
                                    class="theme-blue">{{row.name}}({{row.code}})
                    </router-link>
                </template>
                <template slot-scope="{row}" slot="integrity">
                    <Progress :percent="parseInt(row.integrity)" :stroke-width="5" v-if="row.status!=6"></Progress>
                </template>
                <template slot-scope="{row}" slot="date">
                    <span v-if="row.status!=6">{{row.date}}</span>
                </template>
                <template slot-scope="{row}" slot="creator">
                    <span v-if="row.status!=6">{{row.creator}}</span>
                </template>
                <template slot-scope="{row}" slot="status">
                    <div v-if="row.status!=6">
                        <div v-if="row.status == 1">
                            <span class="switchLabel">正常</span>
                            <span class="switchBox" @click="changeStatus(row,'禁用')">
                        <i-switch :value="row.status === 1"/>
                        <span class="cover"></span>
                    </span>
                        </div>
                        <div v-else-if="row.status == 2">
                            <span class="switchLabel">禁用</span>
                            <span class="switchBox" @click="changeStatus(row,'启用')">
                        <i-switch :value="row.status === 1"/>
                        <span class="cover"></span>
                    </span>
                        </div>
                        <div v-else-if="row.status==3">
                            草稿
                        </div>
                        <div v-else-if="row.status==4">
                            待审核
                        </div>
                        <div v-else-if="row.status==6">
                            审核通过
                        </div>
                        <div v-else-if="row.status==7">
                            回退
                        </div>
                        <div v-else-if="row.status==8">
                            撤回
                        </div>
                        <div v-else-if="row.status==9">
                            终止
                        </div>
                        <div v-else-if="row.status==10">
                            等待回调
                        </div>
                    </div>
                </template>
                <template slot-scope="{row}" slot="action">
                    <div v-if="row.status!=6">
                        <!--场馆审核-->
                        <router-link
                                :to="{path:'/audit-venues-edit',query:{id:row.resourceId,resourceName:row.name}}"
                                v-if="row.resourceType=='CONTENT_TYPE_VENUE'&&operates.includes('audit')&& row.status==4 "
                                class="theme-blue action-btn">审核
                        </router-link>
                        <!--活动室审核-->
                        <router-link
                                :to="{path:'/audit-room-edit',query:{id:row.resourceId,venueId:row.venueId,resourceName:row.name}}"
                                v-if="row.resourceType=='CONTENT_TYPE_ACTIVITY_SHIU'&&operates.includes('audit')&& row.status==4 "
                                class="theme-blue action-btn">审核
                        </router-link>
                        <a class="theme-blue action-btn ml5" v-if="operates.includes('process') "
                            @click="getVenueAuditProcess(row.resourceId,row.resourceType)">流程</a>
                        <!--场馆修改-->
                        <router-link :to="{path:'/audit-venues-modify',query:{id:row.resourceId,type:'audit'}}"
                                        v-if="row.resourceType=='CONTENT_TYPE_VENUE' && operates.includes('edit')&& row.status!=7 && row.status!=9 &&row.status!=6  "
                                        class="theme-blue action-btn ml5">修改
                        </router-link>
                        <!--活动室修改-->
                        <router-link :to="{path:'/audit-room-add',query:{id:row.resourceId,venueId:row.venueId,type:'audit'}}"
                                        v-else-if="row.resourceType=='CONTENT_TYPE_ACTIVITY_SHIU' && operates.includes('edit')&& row.status!=7 && row.status!=9  "
                                        class="theme-blue action-btn ml5">修改
                        </router-link>

                        <a class="theme-blue action-btn ml5" v-if="operates.includes('delete') && row.status!=4"
                            @click="deleteRow(row,row.resourceType)">删除</a>
                    </div>
                </template>
            </Table>
        </baseTable>
        <Modal v-model="modal" title="审批流程" footer-hide>
            <auditProcess :data="processData"></auditProcess>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import auditProcess from "@components/auditProcess/auditProcess.vue";
    import baseTable from '@components/baseTable/baseTable.vue';
    import {getAuditVenueList, delVenuesAuditList, getAuditCountNum} from '@service/audit';
    import {updateStatus} from '@service/common';
    import {getVenueAuditProcess, getcAitivityRoomAuditProcess} from '@service/place';
    import {AppModule} from "@store/modules/app";

    @Component({
        components: {
            baseTable,
            auditProcess
        }
    })
    export default class vunuesAudit extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }

        private loading: boolean = true;
        private tableData: any = {
            headList: [
                {
                    title: '场馆名称',
                    key: 'name',
                    slot: 'name',
                    align: 'left',
                },
                {
                    title: '资料完整度',
                    key: 'integrity',
                    align: 'center',
                    slot: 'integrity'
                },
                {
                    title: '提交时间',
                    key: 'date',
                    slot: 'date',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '创建者',
                    key: 'creator',
                    slot: 'creator',
                    align: 'center',
                },
                {
                    title: '审核状态',
                    key: 'status',
                    slot: 'status',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    slot: 'action'
                }],
            bodyList: []
        };
        private tabIndex: any = 0;
        private params: object = {
            type: 'CONTENT_TYPE_VENUE',
            code: '',//编号
            name: '',//名称
            status: '',//审核状态
            startTime: '',//开始时间
            endTime: ''//结束时间
        };
        //表格分页信息
        private tableConfig: any = {
            page: {
                currPage: 1,
                pageSize: 10
            },
            pagePosition: "right"
        };

        //表格数据
        getList(data: any = this.tableConfig.page) {
            let _this = this;
            this.params = Object.assign(this.params, data); //搜索条件
            getAuditVenueList(this.params).then((res: any) => {
                if (res.code === 0) {
                    _this.tableData.bodyList = [];
                    _this.loading=false;
                    res.datas.forEach(function (item: any) {
                        //场馆
                        _this.tableData.bodyList.push({
                            name: item.name,
                            code: item.code,
                            id: item.id,
                            resourceId: item.resourceId,
                            status: item.status,
                            date: item.createTime,
                            creator: item.userName,
                            integrity: item.percent,
                            resourceType: item.resourceType
                        });
                        //活动室
                        if (item.childList.length > 0) {
                            item.childList.forEach(function (childItem: any) {
                                _this.tableData.bodyList.push({
                                    venueId:item.resourceId,
                                    name: childItem.name,
                                    code: childItem.code,
                                    id: childItem.id,
                                    resourceId: childItem.resourceId,
                                    status: childItem.status,
                                    date: childItem.createTime,
                                    creator: childItem.userName,
                                    integrity: childItem.percent,
                                    resourceType: childItem.resourceType
                                })
                            })
                        }
                    });
                    this.tableConfig.page = res.page;
                    this.getAuditCount();
                }
            });

        }

        private waitNum: any = 0;//待审核
        //待审核数量/不通过数量
        private getAuditCount() {
            getAuditCountNum({
                type: 'CONTENT_TYPE_VENUE'
            }).then((res: any) => {
                this.waitNum = res.data.auditPending;//待审核
            });
        }

        //删除行
        deleteRow(item: any, resourceType: any) {
            let _this: any = this;
            let name: string = resourceType == 'CONTENT_TYPE_VENUE' ? '场馆' : '活动室';
            let config: any = {
                title: "操作提示",
                content: `确认要删除“${item.name ||
                "选中"}”${name}？删除后用户端将不再展示！`,
                okText: "确认",
                cancelText: "关闭",
                onOk: () => {
                    delVenuesAuditList({
                        ids: item.id,
                        type: resourceType //场馆资源类型
                    }).then((res: any) => {
                        if (res.code === 0) {
                            _this.$Message.success("删除成功");
                            _this.getList();
                        }
                    })
                }
            };
            this.$Modal.confirm(config);
        }

        //  更新状态值
        private changeStatus(row: any, title: string) {
            let _this = this;
            let config: any = {
                title: "操作提示",
                content: "确认是否" + title + "？",
                okText: "确认",
                cancelText: "关闭",
                onOk: () => {
                    _this.adPosition(row);
                }
            };
            this.$Modal.confirm(config);
        }

        //   广告位开启、禁用
        private adPosition(row: any) {
            let _this = this;
            let status = 2;
            if (row.status == 2) {
                status = 1;
            }
            let param = {
                id: row.id,
                status: status,
                resourceType: (this.params as any).type
            };
            updateStatus(param).then((res: any) => {
                if (res.code === 0) {
                    this.$Message.success("更新成功!");
                    _this.getList()
                }
            });
        }

        //获取时间
        getDate(value: any) {
            (this.params as any).startTime = value[0];
            (this.params as any).endTime = value[1];
        }

        //获取状态
        setStatus(index: any) {
            let _this = this;
            _this.tabIndex = index;
            _this.loading=true;
            switch (index) {
                case 0: {
                    (this.params as any).status = '';
                }
                    break;
                case 1: {
                    (this.params as any).status = '4';

                }
                    break;
                case 2: {
                    (this.params as any).status = '79';
                }
                    break;
            }
            _this.getList();
        }

        //tab 状态待审核数量
        private waitLabel(h: any) {
            let _this = this;
            return h("div", [
                h("span", "待审核"),
                h("Badge", {
                    props: {
                        count: _this.waitNum
                    }
                })
            ]);
        }

        // 获取审核流程信息
        private modal: boolean = false;
        private processData: any = {};

        private getVenueAuditProcess(id: any, resourceType: string) {
            this.modal = true;
            if (resourceType == 'CONTENT_TYPE_VENUE') {//场馆流程
                getVenueAuditProcess({id: id}).then((res: any) => {
                    this.processData = res.data;
                });
            } else {                                  //活动室流程
                getcAitivityRoomAuditProcess({id: id}).then((res: any) => {
                    this.processData = res.data;
                });
            }
        }

        // 设置表格样式
        rowClassName(row: any, index: number) {
            if (row.resourceType == "CONTENT_TYPE_VENUE") {
                return 'parent_row';
            } else {
                return 'child_row';
            }
        }

        mounted() {
            let _this = this;
            _this.getList();
        }
    }
</script>
<style lang="scss">
    .ivu-table {
        .parent_row {
            td {
                border-top: 1px solid #e8eaec;
                border-bottom: none;
                margin-top: -1px;
                position: relative;
                background-color: #fff;
                z-index: 2;
            }
            &:first-of-type {
                td {
                    border-top: none;
                }
            }
            &:last-of-type {
                td {
                    border-bottom: 1px solid #dcdee2;
                }
            }
        }
        .child_row {
            td {
                border: none;
                &:first-of-type {
                    position: relative;
                    color: $theme;
                    padding-left: 35px;
                    margin-left: 10px;
                    &:before {
                        position: absolute;
                        top: -50%;
                        left: 30px;
                        content: '';
                        height: 100%;
                        width: 1px;
                        border: 0.5px dashed $borderDark;
                    }
                    &:after {
                        position: absolute;
                        top: 50%;
                        left: 31px;
                        content: '';
                        height: 1px;
                        width: 20px;
                        border: 0.5px dashed $borderDark;
                    }
                }
            }
        }
    }
</style>
<style scoped lang="scss">
    .venues-audit {
        padding: 0 15px 15px;
        .wrap {
            background: $grayLight;
            margin-bottom: 15px;
            padding-top: 15px;
        }
        .page {
            float: right;
            margin-top: 20px;
        }
        .table {
            .child {
                color: $theme;
                padding-left: 30px;
                position: relative;
                margin-left: 10px;
            }

        }
    }
</style>
