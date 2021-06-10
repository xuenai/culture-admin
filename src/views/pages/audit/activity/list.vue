<!--
 * @Author: 任智勇
 * @since: 2019-06-04 13:39:27
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-02 09:55:51
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
                        <Option v-for="(item, k) in ACTIVITY_METHOD" :key="k" :value="k">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="活动分类" prop="classify">
                    <Select style="width: 200px" v-model="params.classify"
                            @on-change="search">
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
                </FormItem>
                <FormItem>
                    <Button type="primary" style="margin-right: 10px;" @click="search">搜索</Button>
                    <Button type="primary" @click="delReport(checkedBox, -1)" v-if="operates.includes('batchDelete')">批量删除</Button>
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
                            <div class="img-box fl" :class="{
                              'faith-audit': (row.faithAuditStatus && row.faithAuditValue),
                              'faith-use': (row.faithUseStatus && row.faithUseValue)}">
                                <!-- <router-link :to="{ path: '/ac-detail', query: { id: row.activityId }}"><img v-if="row.image" :src='row.image.split(",")[0]'/></router-link> -->
                                <img @click.stop="viewImage(row.image.split(','), 0)" v-if="row.image" :src='row.image.split(",")[0]'/>
                            </div>
                            <div class="introduce-content nonedate fl">
                                <p class="hot">
                                    <!-- <router-link :to="{ path: '/ac-detail', query: { id: row.activityId }}">{{ row.name }}</router-link> -->
                                    <router-link :to="{ path: '/audit-ac-audit', query: { id: row.activityId ,auditStatus: row.auditStatus, auditType: auditStatus.includes(row.auditStatus) && operates.includes('audit')?'1':'-1', manageId: row.manageId, editBtnStatus: canModify(row)}}">{{ row.name }}</router-link>
                                </p>
                                <p class="time">活动日期：<span>{{ row.useStartTime.slice(0,-3) }}至{{ row.useEndTime.slice(0,-3) }}</span></p>
                                <p class="add">活动地点：<span>{{ row.address }}</span></p>
                            </div>
                        </div>
                        <p v-if="[7,8,9,79].includes(row.auditStatus) && row.auditResult">审核备注：{{row.auditResult}}</p>
                    </template>

                    <template slot-scope="{ row }" slot="method">
                        <span>{{ACTIVITY_METHOD[row.method]}}</span>
                    </template>

                    <template slot-scope="{ row }" slot="classify">
                        <span>{{getLabelName(row.classify)}}</span>
                    </template>

                    <template slot-scope="{ row }" slot="status">
                        <span>{{status[row.auditStatus]}}</span>
                    </template>

                    <template slot-scope="{ row, index }" slot="action">
                        <router-link v-if="auditStatus.includes(row.auditStatus) && operates.includes('audit')" :to="{ path: '/audit-ac-audit', query: { id: row.activityId ,auditStatus: row.auditStatus,manageId:row.manageId, editBtnStatus: canModify(row)}}">审核 </router-link>
                        <!-- 据说不再允许修改了 -->
                        <!-- 厄 上面is wrong 是普通活动不再允许修改了 -->
                        <router-link v-if="canModify(row)" :to="{ path: getActivityEditPath(row), query: { id: row.activityId, classify: row.type, method: row.method, auditFlag: 1 }}"> 修改 </router-link>
                        <a href="javascript:;" v-if="operates.includes('process') "  @click="getActiveAuditProcessList(row)"> 流程 </a>
                        <!-- <a href="javascript:;"> 预览 </a> -->
                        <a href="javascript:;" @click="delReport(row, index)" v-if="row.auditStatus==79 && operates.includes('delete')"> 删除</a>
                    </template>
                </Table>
            </baseTable>
        </div>

        <Modal v-model="processModal" footer-hide title="审批流程">
            <auditProcess v-if="processData" :data="processData"></auditProcess>
        </Modal>
        <PreviewPics
        v-model="visible"
        :imgs="imgUrl"
        :currIndex="currIndex"
        ></PreviewPics>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue, Watch, Prop} from 'vue-property-decorator'
    import BaseTable from "@components/baseTable/baseTable.vue"
    import auditProcess from "@components/auditProcess/auditProcess.vue";
    import {getActiveList, delActiveAudit, getActiveAuditProcessList} from '@service/audit'
    import {AppModule} from "@store/modules/app";
    import {ACTIVITY_METHOD, AUDIT_DATA_STATUS} from "@constant/index"
    import {getActivityEditPath, getStatusTxt} from "@util/comm"
    import { PreviewPics } from '@components/index'

    interface paramType {
        keyword: string;
        method: string;
        classify: number;
        activityStart: string;
        activityEnd: string;
        submitStart: string;
        submitEnd: string;
        status?: number;
        currPage?: number;
        pageSize?: number;
    }
    interface activityClassType {
        labelName: string;
        id: number
    }

    @Component({
        components: {
            BaseTable,
            auditProcess,
            PreviewPics
        }
    })
    export default class ComponentName extends Vue {
        beforeRouteLeave(to: any, from: any, next: Function) {
          to.meta.title = getStatusTxt[this.method];
          next();
        }
        // 数据状态 全部 待审核 不通过
        @Prop() dataStatus?: number;
        // 活动类型
        @Prop({default: []}) activityClassify!: Array<activityClassType>;

        private getActivityEditPath = getActivityEditPath;
        private ACTIVITY_METHOD = ACTIVITY_METHOD;
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        // 查询条件
        private params = <paramType>{status: this.dataStatus};
        // 表单验证
        private ruleValidate = <any>{
            name: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            activityName: [{required: true, message: "请将信息填写完整"}],
            tag: [{required: true, message: "请将信息填写完整"}],
            startDate: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            startTime: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            address: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            stock: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            limitNum: [{required: true, message: "请将信息填写完整"}],
            images: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            sponsor: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            introduce: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
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
                    width: 500
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
                    title: "创建者",
                    align: "center",
                    key: "standbyName"
                },
                {
                    title: "提交时间",
                    key: "createTime",
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
            data6: []
        };
        // 状态
        private status = AUDIT_DATA_STATUS;
        // 具有修改动作的status
        private modifyStatus: Array<number> = [4]
        // 具有删除动作的status
        private delStatus: Array<number> = [7, 8, 9, 79]
        // 具有审核动作的status
        private auditStatus: Array<number> = [4]
        // loading
        private loading: boolean = false;
        // 复选框ID
        private checkedBox: Array<Number> = [];
        // 流程
        private processModal:boolean = false;
        // 流程数据
        private processData = <any>null;

        mounted() {
            this.search();
        }

        // 判断是否能修改
        private canModify(row: any): boolean {
           return row.method !== 'ACTIVITY_MODE_SERVICE' && this.modifyStatus.includes(row.auditStatus) && (this.operates as Array<any>).includes('edit')
        }
        
        /* S 查看大图 */
        private visible: Boolean = false
        private imgUrl: Array<string> = []
        private currIndex = 0
        private viewImage(url: Array<string>, idx: number) {
            this.imgUrl = url
            this.visible = true
            this.currIndex = idx
        }
        /* E 查看大图 */

        // 审批流程
        private getActiveAuditProcessList(row: any) {
            getActiveAuditProcessList({ activityId: row.activityId, manageId: row.manageId }).then((res: any) => {
                this.processData = res.data;
                this.processModal = true;
            });
        }
        // 删除
        private delReport(item: any, index: Number) {
            if (index === -1 && !this.checkedBox.length) {
                this.$Message.error("请选择需要删除的内容");
                return;
            }
            let config: any = {
                title: `删除内容`,
                content: `确认删除“${item.name || "选中"}”内容？删除内容后将无法恢复`,
                okText: "确认",
                cancelText: "关闭",
                onOk: () => {
                    if (index !== -1) {
                        this.delList(item.manageId, index);
                    } else {
                        this.delList(item, -1);
                    }
                }
            };
            this.$Modal.confirm(config);
        }
        // 删除
        private delList(id: any, index: Number) {
            delActiveAudit({
                ids: index !== -1 ? id : this.checkedBox.toString()
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
            this.checkedBox = data.map((item: any) => item.manageId);
        }
        // label名字
        private getLabelName (id: number) {
            let data: Array<{labelName: string}> = this.activityClassify.filter((item:any) => item.id === id)
            return data[0] ? data[0].labelName : ''
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
                this.params.submitStart = date[0] || "";
                this.params.submitEnd = date[1] || "";
                this.search()
            }
        }

        // 验证下拉
        private setCom() {
            (this.$refs.formInline as any).validateField("activityClassify");
        }
        // 搜索
        private search (page?: any) {
            this.loading = true
            if (page) {
                this.params.currPage = page.currPage
                this.params.pageSize = page.pageSize
            }
            getActiveList(this.params).then((res:any) => {
                let page = res.page
                let datas = res.datas
                if (page) {
                    this.tableConfig.page = page
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
            margin-bottom: 20px;
            background: $grayLight;
        }
        .info-list {
            padding: 20px 0 5px;
            .img-box {
                position: relative;
                width: 100px;
                height: 84px;
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
                width: 350px;
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
