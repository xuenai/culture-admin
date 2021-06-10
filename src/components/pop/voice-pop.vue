<template>
    <div class="pop">
        <Dialog :configer="dialogConfig" @onClose="closePop">
            <template v-if="musicConfig && musicConfig.src">
                <Aplayer autoplay
                     :music="musicConfig"
                     class="width710"
                ></Aplayer>
            </template>
        </Dialog>
    </div>
</template>

<script lang='ts'>
    /*
    * prop参数
    * show: 控制显示
    * close关闭
    * voiceConf
    * */

    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import Dialog from "@components/Dialog/Dialog.vue";
    import Aplayer from 'vue-aplayer'

    @Component({components: {Dialog, Aplayer}})
    export default class AudioPlay extends Vue {
        // 显示隐藏
        @Prop() private show!:Boolean;
        // 关闭弹窗
        @Prop() private close!:any;
        // 资源地址
        @Prop() private voiceConf!: {title: string, src: string, pic: string};
        private musicConfig: any = null
        @Watch("voiceConf", { immediate: true, deep: true })
        wVoiceConf(val: any) {
            this.musicConfig = {...val, artist: ' '}
        }

        // 弹窗配置
        private dialogConfig: {title: string, show: boolean, ok: boolean, cancel: boolean} = {
            title: "音频播放",
            show: false,
            ok: false,
            cancel: false
        };

        created() {
            this.wVoiceConf(this.voiceConf)
        }

        // 监听显示隐藏
        @Watch("show")
        setShow(val: boolean, oldValue: boolean) {
            this.musicConfig = { ...this.voiceConf, artist: " " };
            this.dialogConfig.show = val
            this.dialogConfig.title = this.voiceConf.title
        }

        // 关闭弹窗
        private closePop() {
            this.close && this.close()
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
