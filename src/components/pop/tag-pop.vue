<template>
    <div class="pop">
        <Dialog :configer="dialogConfig" @onClose="closePop" @onOk="sureFn">
            <div class="tag-box">
                <CheckboxGroup
                    v-model="groupCheck"
                    v-if="tagList.length">
                    <Checkbox v-for="item in tagList"
                              :key="item.id"
                              :label="item.id">{{item.labelName}}</Checkbox>
                </CheckboxGroup>
                <div class="foot">
                    <Input class="width710 fl" :maxlength="20" v-model="addTagName" placeholder="请填写标签名称（最大字符长度20）"/>
                    <Button type="primary" class="ml10" @click="addTagHd">添加标签</Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script lang='ts'>
    /*
    * prop参数
    * show: 控制显示
    * defaultTagList: 默认数据[{id: ''}] id为tag的id
    * resourceType：资源类型
    * labelType：标签类型
    * 事件
    * @getTagList: 返回选择数据
    * */

    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import Dialog from "@components/Dialog/Dialog.vue";
    import {getLabelList, saveAddTag} from "@service/content";

    @Component({components: {Dialog}})
    export default class addMember extends Vue {
        // 显示隐藏
        @Prop() private show!:Boolean;
        // 默认选择
        @Prop() private defaultTagList!:Array<{id: number}>;
        // 资源类型
        @Prop({default: 'MEDIA'}) private resourceType!:string;
        // 标签类型
        @Prop() private labelType!:string;

        // 弹窗配置
        private dialogConfig: any = {
            title: "选择标签",
            show: false
        };
        // tag标签列表
        private tagList: object[] = [];
        // 添加标签
        private addTagName: string = '';
        // 选择的tag
        private checkedTagList: Array<any> = [];
        // tags group
        private groupCheck: any = [];

        mounted () {
            this.getLabelList()
        }

        // 监听显示隐藏
        @Watch("show")
        setShow(val: Boolean, oldValue: Boolean) {
            this.dialogConfig.show = val
            this.defaultCheck()
        }

        // 监测check选择变化
        @Watch("groupCheck")
        groupCheckC(val: any) {
            this.checkedTagList = val.map((id:number) => {
                return this.tagList.find((tag:any) => tag.id === id)
            }).filter((tag:any) => !!tag)
        }

        // 把默认选择box选中
        private defaultCheck () {
            if (this.defaultTagList && this.defaultTagList.length) {
                this.groupCheck = this.defaultTagList.map((tag: {id: number}) => tag.id)
            } else {
                this.groupCheck = []
            }
        }

        // 关闭弹窗
        private closePop() {
            this.$parent.showTag = false;
        }

        // 获取标签列表
        private getLabelList() {
            getLabelList({
                labelType: this.labelType,
                resourceType: this.resourceType
            }).then((result: any) => {
                if (result.datas) {
                    this.tagList = result.datas
                    this.defaultCheck()
                }
            })
        }

        // 确定按钮
        private sureFn () {
            this.$emit("getTagList", this.checkedTagList);
            this.closePop();
        }

        // 添加标签
        private addTagHd() {
            if (!this.addTagName) return
            saveAddTag({
                resourceType: this.resourceType,
                labelName: this.addTagName,
                labelType: this.labelType,
            }).then((res: any) => {
                if (res.code === 0) {
                    this.tagList.push({
                        labelName: res.data.labelName,
                        id: res.data.id
                    })
                    this.addTagName = ''
                }
            })
        }
    }
</script>

<style lang='scss' scoped>
    .width710 {
        width: 710px;
    }
    .fl {
        float: left;
    }
    
    .tag-box {
        width: 800px;
        .foot {
            overflow: hidden;
        }
    }
</style>
