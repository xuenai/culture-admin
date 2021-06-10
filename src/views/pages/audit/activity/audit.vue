<template>
    <div style="padding-bottom: 30px">
        <!-- 状态 -->
        <template v-if="headData" >
            <auditHead :data="headData"></auditHead>
        </template>
        <!-- 内容 -->
        <MoneyActivityDetail v-if="data && ['ACTIVITY_MODE_ENROLL_PAY', 'ACTIVITY_MODE_INTEGRAL_PAY'].includes(data.method)" :data="data"></MoneyActivityDetail>
        <OtherActivityDetail v-else-if="data && ['ACTIVITY_MODE_OTHER'].includes(data.method)" :data="data"></OtherActivityDetail>
        <OrdinaryActivityDetail v-else-if="data && ['ACTIVITY_MODE_SERVICE'].includes(data.method)" :data="data"></OrdinaryActivityDetail>
        <ContentDetail v-else-if="data" :data="data"></ContentDetail>
        <!-- 进度 -->
        <div class="audit-record ml20" v-if="recordList.length">
            <h3 class="title">审核记录</h3>
            <Timeline class="record-panel">
                <Timeline-item v-for="(record, i) in recordList" :key="i">
                    <p class="time">{{record.updateTime}}</p>
                    <p class="content">由（{{record.handlerName}}{{record.handlerPhone}}）审核，审核结果：{{status[record.auditStatus]}}。审核备注：{{record.result}}</p>
                </Timeline-item>
            </Timeline>
        </div>
        <!-- 结果处理 -->
        <div class="add-content-detail-content">
            <template v-if="auditType === '1' && data">
                <From1  :id="id" :data="data" :editBtnStatus="editBtnStatus"></From1>
            </template>
            <template v-if="auditType === '2' && data">
                <From2 :id="reportId" :data="data"></From2>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator"
    import auditHead from "@views/pages/common/result-head.vue"
    import From1 from "./audit-form1.vue"
    import From2 from "./audit-form2.vue"
    import {getActivityDetial, getRecords} from "@service/activity";
    import ContentDetail from "../../activity/activity-management/content-detail.vue";
    import MoneyActivityDetail from "../../activity/activity-management/money-ac-detail.vue";
    import OtherActivityDetail from "../../activity/activity-management/other-ac-detail.vue";
    import OrdinaryActivityDetail from "@views/pages/activity/activity-management/ordinary-detail.vue";
    import {AUDIT_DATA_STATUS} from '@constant/index'
    import {getStatusTxt} from '@util/comm'

    @Component({
        components: {
            auditHead,
            ContentDetail,
            MoneyActivityDetail,
            OtherActivityDetail,
            From1,
            From2,
            OrdinaryActivityDetail
        }
    })
    export default class auditResultHead extends Vue {
        beforeRouteLeave(to: any, from: any, next: Function) {
            to.meta.title = getStatusTxt[this.data.method];
            next();
        }
        // id
        private id?: string;
        // 当前审核类型（上报2、原来活动审核的1）
        private auditType: string = '1'
        // 当前审核类型（上报2、原来活动审核的1）
        private reportId: string = ''
        //审核状态
        private headData = <any>'';
        // 活动内容
        private data = <any>false;
        // 审核记录
        private recordList = [] as Array<object>;
        // 状态
        private status = AUDIT_DATA_STATUS;
        // 状态
        private editBtnStatus: any = false;

        created() {
            this.id = this.$route.query.id as string
            this.editBtnStatus = this.$route.query.editBtnStatus
            if (this.$route.query.auditType) this.auditType = this.$route.query.auditType as string
            if (this.$route.query.reportId) this.reportId = this.$route.query.reportId as string
            if (this.id) {
                this.getRecords()
                this.getActivityDetial()
            }
        }

        // 获取活动内容
        private getActivityDetial () {
            getActivityDetial({id: this.id,manageId:this.$route.query.manageId}).then((res: any) => {
                if (res.code === 0) {
                    this.data = res.data;
                    this.headData = {
                        status: res.data.manageAuditStatus,
                        date: res.data.manageUpdateTime,
                        remark: res.data.manageAuditResult
                    };
//                    this.params.auditStatus = res.data.status
                }
            });
        }
        // 获取审核记录
        private getRecords () {
            getRecords({activityId: this.id,auditFlag: 1}).then((res:any) => {
                if (res.datas && res.datas.length) {
                    this.recordList = res.datas
                } else {
                    this.recordList = []
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .list-panel {
        margin-top: 10px;
        .item {
            padding: 10px 0;
            line-height: 25px;
        }
        .red {
            vertical-align: middle;
        }
        .item-name {
            width: 150px;
            text-align: right;
            margin-right: 13px;
            font-weight: 600;
            color: $font01;
        }
        .item-content {
            width: 80%;
            color: $font05;
            .img {
                display: inline-block;
                width: 240px;
                height: 160px;
                border-radius: 4px;
                overflow: hidden;
                cursor: pointer;
                img {
                    width: 100%;
                    height: 100%;
                }
                & + .img {
                    margin-left: 5px;
                }
            }
            &.simulate {
                p {
                    display: inline-block;
                    & + p {
                        margin-left: 20px;
                    }
                }
                .count {
                    margin-left: 3px;
                    width: 200px;
                    text-align: left;
                }
            }
        }
    }

    .audit-record {
        padding-top: 20px;
        border-top: 1px solid $borderLight;
        margin: 15px 0 15px 20px;
        .record-panel {
            padding: 20px 20px;
            .content {
                color: $font03;
            }
        }
    }

    .btn-group {
        margin-left: 20px;
        button {
            margin-left: 20px;
        }
    }
</style>
