<!--
 * @Author: 任智勇
 * @since: 2019-07-02 09:06:38
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-29 20:48:33
 -->
<template>
    <Form :label-width="80"
          ref="params"
          :model="params"
          :rules="params.status === 6 ? ruleValidate0 : ruleValidate1">
        <FormItem label="审核结果">
            <Button @click="params.status = 6" :type="params.status === 6 ? 'primary' : undefined">通过</Button>
            <Button class="ml20"  @click="params.status = 79" :type="params.status === 79 ? 'primary' : undefined">不通过</Button>
        </FormItem>
        <FormItem label="审核备注" class="mt20" prop="result">
            <Input
                v-model="params.result"
                type="textaresa"
                :maxlength="200"
                style="width: 250px;"
                :autosize="{minRows: 5, maxRows: 10}"
                placeholder="请写下审核备注，不通过时审核备注必须填写。"
            />
            <span>200字以内</span>
        </FormItem>
         <!-- 快捷回复 -->
        <fastReply @reply="getReply" class="mt10" ></fastReply>
        <div class="btn-group mt20">
            <Button @click="activeAudit()" type="info">审核</Button>
            <Button @click="back">返回</Button>
        </div>
    </Form>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator"
    import {reportActiveAudit} from "@service/audit";
    import fastReply from "@views/pages/common/fast-reply.vue";
    @Component({
        components: {fastReply}
    })
    export default class auditResultHead extends Vue {
        //设置快捷回复
        getReply(item:any){
            (this.params as any).result=item;
        }
        // reportId
        @Prop() private id!: string;
        @Prop() private data: any;

        // 审核params
        private params: {
            reportId: string;
            status: number;
            result: string;
            resourceName: string;
        } = {
            reportId: '',
            status: 6,
            result: '',
            resourceName: '',
        };
        // 验证规则
        private ruleValidate0 = <any>{
            result: [{
                message: "最多150个字符",
                trigger: "blur",
                pattern: /.{0,150}$/
            }]
        };
        // 验证规则
        private ruleValidate1 = <any>{
            result: [{
                required: true,
                message: "至少输入1个字符，最多150个字符",
                trigger: "blur",
                pattern: /.{1,150}$/
            }]
        };

        created() {
            this.params.reportId = this.id
            this.params.resourceName = this.data.name
        }

        // 保存审核
        private activeAudit () {
            (this.$refs.params as any).validate((valid: any) => {
                if (!valid) {
                    this.$Message.error("请将信息填写完整！");
                    return;
                }
                reportActiveAudit(this.params).then((res:any) => {
                    if (res.code === 0) {
                        this.$Message.success("操作成功!");
                        this.back()
                    }
                })
            });
        }
        // back
        private back () {
            this.$router.go(-1)
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
