<!--
 * @Author: 任智勇
 * @since: 2019-05-29 20:19:06
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-18 10:32:15
 -->
<template>
    <div class="pd20">
        <!-- 状态 -->
        <auditHead v-if="headData" :data="headData"></auditHead>
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
                    
                    <p class="content">由【{{record.handlerName}}】【{{record.handlerPhone.substr(record.handlerPhone.length-4,record.handlerPhone.length)}}】审核，审核结果：{{AUDIT_DATA_STATUS[record.auditStatus]}}。审核备注：{{record.result || '暂无'}}</p>
                </Timeline-item>
            </Timeline>
        </div>
        <div class="btn-group">
            <!--待审核 回退 可修改-->
            <Button v-if="$route.query.editButton" type="info" @click="$router.push({ path: getActivityEditPath(data), query: { id: data.id, classify: data.activityClassify, method: data.method, auditFlag: 1 }})">修改</Button>
            <Button @click="back">返回</Button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import auditHead from "@views/pages/common/result-head.vue";
    import ContentDetail from "./content-detail.vue";
    import MoneyActivityDetail from "./money-ac-detail.vue";
    import OtherActivityDetail from "./other-ac-detail.vue";
    import OrdinaryActivityDetail from "./ordinary-detail.vue";
    import {getActivityDetial, activitySave, getRecords} from "@service/activity";
    import {getActivityEditPath} from "@util/comm"
    import {AUDIT_DATA_STATUS} from "@constant/index"
    @Component({
        components: {
            auditHead,
            ContentDetail,
            MoneyActivityDetail,
            OtherActivityDetail,
            OrdinaryActivityDetail
        }
    })
    export default class auditResultHead extends Vue {
        // 内容
        private data = <any>false;
        //审核状态
        private headData = <any>false;
        // 审核记录
        private recordList = [] as Array<object>;
        private getActivityEditPath = getActivityEditPath;
        // 状态
        private AUDIT_DATA_STATUS = AUDIT_DATA_STATUS

        mounted() {
            let id = this.$route.query.id || "";
            if (id) {
                getActivityDetial({id,manageId:this.$route.query.manageId}).then((res: any) => {
                    if (res.code === 0) {
                        this.data = res.data;
                        this.headData = {
                            status: res.data.manageAuditStatus,
                            date: res.data.manageUpdateTime,
                            remark: res.data.manageAuditResult
                        };
                    }
                });
                this.getRecords(id as string)
            }
        }

        private back () {
            window.history.back()
        }

        // 获取审核记录
        private getRecords (id: string) {
            getRecords({activityId: id}).then((res:any) => {
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
