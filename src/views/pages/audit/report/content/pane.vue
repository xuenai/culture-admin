<template>
    <div class="activity-management-pub">
        <Form class="form topic" ref="formInline" inline :label-width="70" :rules="ruleValidate">
            <FormItem label="标题" prop="title">
                <Input type="text" v-model="params.title" placeholder="请输入标题" style="width: 200px" @on-enter="search"/>
            </FormItem>
            <FormItem label="创建者" prop="createCompany">
                <Input type="text" v-model="params.createCompany" placeholder="请输入创建者" style="width: 200px" @on-enter="search"/>
            </FormItem>
            <FormItem label="类型">
                <Select style="width: 200px" v-model="params.contentType" @on-change="search">
                    <Option value>全部</Option>
                    <Option value="CONTENT">内容</Option>
                    <Option value="IMAGE">图片</Option>
                    <Option value="VIDEO">视频</Option>
                    <Option value="AUDIO">音频</Option>
                </Select>
            </FormItem>
            <FormItem label="审核状态" v-if="!auditStatus">
                <Select style="width: 200px" v-model="params.auditStatus" @on-change="search">
                    <Option value>全部</Option>
                    <Option value="4">待审核</Option>
                    <Option value="6">通过</Option>
                    <Option value="7">回退</Option>
                    <Option value="9">终止</Option>
                    <Option value="79">不通过</Option>
                </Select>
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
        <div>
            <baseTable :configure="tableConfig" @getList="search">
                <Table border
                       @on-selection-change="selectionTable"
                       :columns="data.columns7"
                       :loading="loading"
                       :data="data.data6">
                    <template slot-scope="{ row }" slot="title">
                        <router-link v-if="widthAuditStatus.includes(row.status) && operates.includes('audit')" :to="{ path: '/audit-content-detail', query: { id: row.contentId,auditId: row.id, auditType: '2', contentType: row.contentType }}">
                            {{row.title}}
                            <Icon v-if="row.images" style="margin: 0 2px" type="iconfont c-icon-tuku"></Icon>
                            <Icon v-if="row.audio" style="margin: 0 2px" type="iconfont c-icon-yinpin-di"></Icon>
                            <Icon v-if="row.video" style="margin: 0 2px" type="iconfont c-icon-shipin-di"></Icon>
                        </router-link>

                        <router-link v-else :to="{ path: '/con-detail', query: { id: row.contentId }}">
                            {{row.title}}
                            <Icon v-if="row.images" style="margin: 0 2px" type="iconfont c-icon-tuku"></Icon>
                            <Icon v-if="row.audio" style="margin: 0 2px" type="iconfont c-icon-yinpin-di"></Icon>
                            <Icon v-if="row.video" style="margin: 0 2px" type="iconfont c-icon-shipin-di"></Icon>
                        </router-link>
                    </template>

                    <template slot-scope="{ row }" slot="contentType">
                        <span>{{contentType[row.contentType]}}</span>
                    </template>

                    <template slot-scope="{ row }" slot="status">
                        <span>{{status[row.status]}}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <router-link v-if="widthAuditStatus.includes(row.status) && operates.includes('audit')" :to="{ path: '/audit-content-detail', query: { id: row.contentId,auditId: row.id, auditType: '2', contentType: row.contentType }}">审核 </router-link>
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
    import {delConReportAudit, getConReportAuditList} from '@service/audit'
    import {AppModule} from "@store/modules/app";

    interface paramType {
        title: string;
        createCompany: string;
        contentType: string;
        auditStatus: number;
        startReportDate: string;
        endReportDate: string;
        currPage?: number;
        pageSize?: number;
    }

    @Component({
        components: {
            BaseTable
        }
    })
    export default class ComponentName extends Vue {
        // 数据状态 全部 待审核 不通过
        @Prop() auditStatus?: number;

        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        // 查询条件
        private params = <paramType>{auditStatus: this.auditStatus};
        // 表单验证
        private ruleValidate = <any>{
            title: [{
                message: "只能填写中文、字母、数字，字符个数2-35",
                trigger: "blur",
                pattern: /^[\u4e00-\u9fa5A-Za-z0-9]{1,100}$/
            }]
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
            columns7: [
                {
                    type: "selection",
                    width: "55"
                },
                {
                    title: "标题",
                    slot: "title",
                    width: 350
                },
                {
                    title: "创建者",
                    key: "createCompany",
                    align: "center"
                },
                {
                    title: "类型",
                    key: "contentType",
                    align: "center",
                    slot: "contentType"
                },
                {
                    title: "提交时间",
                    align: "center",
                    key: "createTime"
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
                    status: 4,
                    video: 175,
                    audio: "ACTIVITY_MODE_PLAIN",
                    createTime: "2019-06-11 15:49:41",
                    createCompany: 'xt',
                    title: 1,
                    contentType: "CONTENT",
                    contentId: 21,
                    id: 1,
                    images: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559024885326&di=f85102d8a2dfab58b7b6dc37cce07b26&imgtype=0&src=http%3A%2F%2Fpic15.nipic.com%2F20110628%2F1369025_192645024000_2.jpg"
                },*/
            ]
        };
        // 状态
        private status = <object>{
            1: "正常",
            2: "禁用",
            3: "草稿",
            4: "待审核",
            5: "审核中",
            6: "审核通过",
            7: "回退",
            79: "审核不通过",
            8: "已撤回",
            9: "终止"
        }
        // 内容类型
        private contentType = <object>{
            CONTENT: "内容",
            IMAGE: "图片",
            VIDEO: "视频",
            AUDIO: "音频"
        }
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

        // 删除
        private delReport(item: any, index: Number) {
            if (index === -1 && !this.checkedBox.length) {
                this.$Message.error("请选择需要删除的内容！");
                return;
            }
            let config: any = {
                title: `删除内容`,
                content: `确认删除“${item.title || "选中"}”内容？删除内容后将无法恢复`,
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
        private delList(ids: any, index: Number) {
            delConReportAudit({
                ids
            }).then((data:any) => {
                if (data.code === 0) {
                    this.$Message.success("删除成功");
                    if (index !== -1) {
                        this.data.data6.splice(index, 1);
                    } else {
                        this.params.currPage = 1;
                        this.search();
                    }
                }
            });
        }
        // 列表选择项数据变化
        private selectionTable(data: Array<any>) {
            this.checkedBox = data.map((item: any) => item.id);
        }
        // 提交日期选择
        private submitDate(date: Array<string>) {
            if (date.length > 1) {
                this.params.startReportDate = date[0] || "";
                this.params.endReportDate = date[1] || "";
                this.search()
            }
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
            getConReportAuditList(this.params).then((res:any) => {
                let page = res.page
                let datas = res.datas
                if (page) {
                    this.tableConfig.page = page
                }
                if (datas) {
                    this.data.data6 = datas.map((data:any) => {
                        if (data.status === 4) { // 待审核不能有删除操作
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

            this.$emit('change')
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
