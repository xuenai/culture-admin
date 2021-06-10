<!--
 * @Author: 任智勇
 * @since: 2019-07-02 09:06:38
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-02 17:51:00
 -->
<template>
    <Form :label-width="80"
          ref="params"
          :model="params"
          :rules="resCode === 0 ? ruleValidate0 : ruleValidate1">
        <FormItem label="审核结果">
            <Button @click="resCode = 0" :type="resCode === 0 ? 'primary' : undefined">通过</Button>
            <Button class="ml20"  @click="resCode = 1" :type="resCode === 1 ? 'primary' : undefined">不通过</Button>
        </FormItem>
        <template v-if="resCode === 0">
            <FormItem label="审核备注" class="mt20" prop="auditResult" :key="1">
                <Input :key="11"
                       v-model="params.auditResult"
                       type="textarea"
                       :maxlength="200"
                       style="width: 250px;"
                       :autosize="{minRows: 5, maxRows: 10}"
                       placeholder="请写下审核备注，不通过时审核备注必须填写。"
                />
                <span style="margin-left:15px;">200字以内</span>
            </FormItem>

            <div class="btn-group mt20">
                <Button @click="activeAudit(6)" type="info">审核</Button>
                <Button v-if="isSITE && userInfo.superSubmitButton" @click="activeAudit(6, 2)" type="info">审核并提交上级审核</Button>
                <Button @click="turnPage" v-if="editBtnStatus">修改</Button>
                <Button @click="back">返回</Button>
            </div>
        </template>
        <template v-else-if="resCode === 1">
            <FormItem label="状态选择" prop="auditStatus">
                <RadioGroup v-model="params.auditStatus">
                    <Radio :value="7" :label="7">回退</Radio>
                    <Radio :value="9" :label="9">终止</Radio>
                    <span :style="{color: params.auditStatus == 9 ? 'red' : '#666'}">（数据不能修改，流程被终止，请慎重选择）</span>
                </RadioGroup>
            </FormItem>
            <FormItem label="审核备注" class="mt20" :key="2" prop="auditResult">
                <Input :key="21"
                    v-model="params.auditResult"
                    type="textarea"
                    :maxlength="200"
                    style="width: 250px;"
                    :autosize="{minRows: 5,maxRows: 10}"
                    placeholder="请写下审核备注，不通过时审核备注必须填写。"
                />
                <span>200字以内</span>
            </FormItem>
             <!-- 快捷回复 -->
            <fastReply @reply="getReply" class="mt10" ></fastReply>
            <div class="btn-group mt20">
                <Button @click="activeAudit(params.auditStatus)" type="info">审核</Button>
                <Button @click="back">返回</Button>
            </div>
        </template>
    </Form>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator"
    import {activeAudit} from "@service/audit";
    import fastReply from "@views/pages/common/fast-reply.vue";
    import {getActivityEditPath} from '@util/comm'
    import { AppModule } from "@store/modules/app";

    @Component({
        components: {fastReply}
    })
    export default class auditResultHead extends Vue {
        get userInfo() {
            return AppModule.userInfo;
        }
        // 判断是否是站点端
        private isSITE:boolean = process.env.VUE_APP_STATUS === 'SITE';
        //设置快捷回复
        getReply(item:any){
            (this.params as any).auditResult=item;
        }
        @Prop() private id!: string;
        @Prop() private data: any;
        // 修改按钮是否展示
        @Prop({default: false}) private editBtnStatus!: boolean;
        // 通过0 不通过1
        private resCode: number = 0;
        // 审核params
        private params: {
            auditResult: string;
            auditStatus: number;
            ids: string;
            resourceName: string;
            auditType: number;
        } = {
            auditResult: '',
            auditStatus: 7,
            ids: '',
            resourceName: '',
            auditType: 1,
        };
        // 验证规则
        private ruleValidate0 = <any>{
            auditStatus: [{
                required: true,
                message: "请将信息填写完整"
            }]
        };
        // 验证规则
        private ruleValidate1 = <any>{
            auditResult: [{
                required: true,
                message: "请将信息填写完整",
                trigger: "blur"
            },{
                message: "至少输入1个字符，最多150个字符",
                trigger: "blur",
                pattern: /.{1,150}$/
            }],
            auditStatus: [{
                required: true,
                message: "请将信息填写完整"
            }]
        };

        created() {
            let auditStatus = this.$route.query.auditStatus as string;
            // if ('7,8,4'.indexOf(auditStatus) > -1) {
            //     this.editBtnStatus = true;
            // }
            this.params.ids = this.id
            this.params.resourceName = this.data.name
        }

        // 跳转修改
        private turnPage () {
            this.$router.push({
                path: getActivityEditPath(this.data),
                query: {
                    id: this.data.id,
                    classify: this.data.type,
                    method: this.data.method,
                    auditFlag: '1'
                }
            })
        }
        // 保存审核
        private activeAudit (auditStatus: number, auditType = 1) {
            (this.$refs.params as any).validate((valid: any) => {
                if (!valid) {
                    this.$Message.error("请将信息填写完整！");
                    return;
                }
                this.params.auditStatus = auditStatus;
                this.params.auditType = auditType;
                activeAudit(this.params).then((res:any) => {
                    if (res.code === 0) {
                        this.$Message.success("操作成功!");
                        this.back()
                    }
                })
            });
        }
        // back
        private back () {
            this.$router.go(-1);
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
