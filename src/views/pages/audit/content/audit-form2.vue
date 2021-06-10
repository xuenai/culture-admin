<!--
 * @Author: 任智勇
 * @since: 2019-07-02 09:06:38
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-29 20:48:48
 -->
<template>
    <Form :label-width="80"
          ref="params"
          :model="params"
          :rules="params.auditStatus === 6 ? ruleValidate0 : ruleValidate1">
        <FormItem label="审核结果">
            <Button @click="params.auditStatus = 6" :type="params.auditStatus === 6 ? 'primary' : undefined">通过</Button>
            <Button class="ml20"  @click="params.auditStatus = 79" :type="params.auditStatus === 79 ? 'primary' : undefined">不通过</Button>
        </FormItem>
        <FormItem v-if="params.auditStatus === 6" class="formItem" label="选择栏目" prop="channelId">
            <Select class="width300" v-model="params.channelId" @on-change="change">
                <Option v-for="item in columnList" :value="item.id" :key="item.id"
                        :label="item.name">
                    <span
                            :style="item.channelLevel ? 'padding-left:' + (item.channelLevel * 10) + 'px' : ''"
                    >
                      <i v-if="item.channelLevel">├</i>
                      {{ item.name }}
                    </span>
                </Option>
            </Select>
        </FormItem>
        <FormItem label="审核备注" class="mt20" prop="auditResult">
            <Input
                   v-model="params.auditResult"
                   type="textarea"
                   :maxlength="200"
                   style="width: 250px;"
                   :autosize="{minRows: 5, maxRows: 10}"
                   placeholder="请输入备注信息"
            />
        </FormItem>
        <div class="btn-group mt20">
            <Button @click="activeAudit" type="info">审核</Button>
            <Button @click="back" style="margin-left:20px;">返回</Button>
        </div>
    </Form>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from "vue-property-decorator"
    import {reportContAudit} from "@service/audit";
    import {getContentColumnList} from "@service/content";
    @Component({
        components: {}
    })
    export default class auditResultHead extends Vue {
        // id
        @Prop(Number) private id!: number;
        //
        @Prop() private resourceName!: string;

        // 栏目下拉
        private columnList: Array<object> = [];
        // 审核params
        private params: {
            channelId?: any;
            auditStatus: number;
            auditResult?: string;
            id: number;
            resourceName?: string | undefined
        } = {
            id: this.id,
            auditStatus: 6,
            channelId:'',
            resourceName: this.resourceName as string
        };
        // 验证规则
        private ruleValidate0 = <any>{
            // auditResult: [{
            //     message: "只能填写中文、字母、数字，字符个数2-500",
            //     trigger: "blur",
            //     pattern: /^[\u4e00-\u9fa5A-Za-z0-9]{2,500}$/
            // }],
            channelId: [{
                required: true,
                message: "该项不能为空",
            }]
        };
        // 验证规则
        private ruleValidate1 = <any>{
            // auditResult: [{
            //     required: true,
            //     message: "只能填写中文、字母、数字，字符个数2-500",
            //     trigger: "blur",
            //     pattern: /^[\u4e00-\u9fa5A-Za-z0-9]{2,500}$/
            // }]
        };
        private change(e:any){
            console.log(e)
        }
        created() {
            this.getContentColumnList();
        }

        @Watch('resourceName')
        setParams (n:string, o:any) {
            this.params.resourceName = n
        }

        // 保存审核
        private activeAudit () {
            (this.$refs.params as any).validate((valid: any) => {
                if (!valid) {
                    this.$Message.error("请将信息填写完整！");
                    return;
                }
                reportContAudit(this.params).then((res:any) => {
                    if (res.code === 0) {
                        this.$Message.success("保存成功!");
                        this.back()
                    }
                })
            });
        }

        // back
        private back () {
            this.$router.go(-1);
        }

        // 获取栏目列表
        private getContentColumnList() {
            getContentColumnList().then(data => {
                let datas = data.datas as any
                if (datas && datas.length) {
                    this.filterArr(datas)
                }
            });
        }

        private filterArr(arr: any) {
            let _this = this;
            arr.filter((item: any) => {
                _this.columnList.push(item);
                item.channelLevel = 0;
                return _this.filterObj(item);
            });
        }

        private filterObj(item: any) {
            let _this = this;
            if (item.hasOwnProperty("subset")) {
                item.subset.filter(function (child: any) {
                    child.channelLevel = item.channelLevel + 1;
                    _this.columnList.push(child);
                    if (child.hasOwnProperty("subset")) {
                        return _this.filterObj(child);
                    }
                });
            }
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
