// 描述

<template>
    <div class="pop">
        <Dialog :configer="dialogConfig" @onClose="closePop" @onOk="sureFn">
            <div class="describe">
                <Input type="textarea" :rows="4" :placeholder="'请输入' + type + '描述'" v-model="descript" :maxlength="200" />
                <p>200字以内</p>
            </div>
        </Dialog>
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import Dialog from "@components/Dialog/Dialog.vue";

    @Component({components: {Dialog}})
    /**
     * 事件
     * @getDescript: 确定按钮点击时返回数据
     *
     * prop参数
     * show:
     * type: 类型名字，默认：图片
     * defaultDescript 默认文本
     */
    export default class Descript extends Vue {
        // 显示隐藏
        @Prop() private show!:boolean
        // 类型名字，默认：图片
        @Prop({default: '图片'}) private type!:string
        // 默认文本
        @Prop() private defaultDescript!:string

        // 描述文本
        private descript?: string = '';
        //   弹窗配置
        private dialogConfig: {title: string, show: boolean} = {
            title: "",
            show: false
        };

        // 监听显示隐藏
        @Watch("show")
        setShow(val: boolean) {
            this.dialogConfig.show = val
            this.defaultDesShow()
        }

        mounted() {
        }

        // 让默认显示
        private defaultDesShow () {
            this.descript = this.defaultDescript || '';
            this.dialogConfig.title = this.type + '描述'
        }

        // 点击确定
        private sureFn () {
            this.$emit("getDescript", this.descript);
            this.closePop();
        }

        // 关闭弹窗
        private closePop() {
            this.$parent.showDescribe = false
        }
    }
</script>

<style lang='scss' scoped>
    .describe {
        width: 710px;
    }
</style>
