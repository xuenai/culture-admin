<template>
    <div>
        <!-- 已上传列表 -->
        <ul class="images-list" ref="parentNode" :class="type ? type : ''">
            <li
                    class="item"
                    v-for="(item, index) in voiceList"
                    :key="item.id"
                    @click.stop="playVoice(item)"
                    v-dragging="{ list: voiceList, item: item, group: 'voice' }"
                    :title="item.name"
            >
                <img :src="item.imgUrl" v-if="item.imgUrl" :alt="item.name" class="daq-img">
                <template  v-if="!item.imgUrl">
                    <div class="local-img">
                        <p class="vocie-name">{{item.name || item.url.split('/')[item.url.split('/').length - 1]}}</p>
                        <Icon type="ios-musical-notes" />
                    </div>
                </template>
                <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
            </li>
            <li class="item upload" @click="showMedia = true" v-if="voiceList.length < maxLength">
                + 添加音频
            </li>
        </ul>
        <p class="remind" v-if="maxLength && maxLength > 1">注：拖动图片可进行排序，最多上传{{maxLength}}个</p>
        <!-- <MediaPop :show="showMedia" :selectUrls="defaultMedia" @onSure="selectSourceDatas" :sourceType="2"></MediaPop> -->
        <!-- 播放音频 -->
        <VoicePop id="uploadVoiceVoicePop" :show="showVoice" :close="()=>{showVoice = false}" :voiceConf="voiceConf"></VoicePop>
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import MediaPop from "@components/pop/media-pop.ts";
    import VoicePop from "@components/pop/voice-pop.vue";
    /**
     * limit  最大上传数量
     * defaultVoice: [{id:0,url:'',imgUrl:''}]默认
     * type:  小号  small
     * @getVoiceList：返回数据[{id:'',...}]
     * <UploadImg
     :limit="5"
     @getVovieList="getVoiceList"
     :defaultVoice=[{id:0,url:'',imgUrl:''}]
     :type="small"
     ></UploadImg>
     *
     */

    interface voiceType {
        id: number;
        url: string;
        imgUrl: string;
        name?: string;
        [propName: string]: any;
    }

    @Component({
        components: {
            VoicePop
        }
    })
    export default class UploadVoice extends Vue {
        // 图片列表
        private voiceList: any = [];
        // 限制个数
        private maxLength: any = 5;
        // 选择多媒体资源
        private showMedia: boolean = false;
        // 显示弹窗声音
        private showVoice = false;
        // 显示弹窗声音
        private voiceConf:{src?: string, title?: string, pic?:string} = {};

        // 限制个数
        @Prop() private limit!:number;
        // 样式
        @Prop() private type!:string;
        // 默认回显数据
        @Prop() private defaultVoice!:Array<voiceType>;

        get defaultMedia() {
            return this.voiceList.map((item:voiceType) => item.url)
        }
        
        private mediaPopObj: any = {
            instance: null,
            destroy: () => {}
        }
        @Watch('showMedia')
        wMedia (v:any) {
            MediaPop({
                show: v,
                sourceType: 2,
                close: ()=>{ this.showMedia = false },
                // createUser: '-1',
                saveToSource: false,
                // selectIds: [],
                selectUrls: this.defaultMedia,
                onSure: this.selectSourceDatas
            }, this.mediaPopObj)
        }

        beforeDestroy() {
            this.mediaPopObj.destroy()
            window.document.body.removeChild(this.uploadVoiceVoicePop as Node)
        }

        created () {
            if (this.limit) {
                this.maxLength = this.limit;
            }
            if (this.type) {
                this.type = this.type;
            }
            if (this.defaultVoice) {
                this.changeVoice(this.defaultVoice)
            }
        }

        private uploadVoiceVoicePop: Node | null = null
        // 图片拖动
        mounted() {
            // 拖动结束
            this.$dragging.$on("dragend", () => {
                this.$emit("getVoiceList", this.voiceList);
            });
            this.uploadVoiceVoicePop = document.getElementById('uploadVoiceVoicePop') as Node
            window.document.body.appendChild(this.uploadVoiceVoicePop)
        }

        @Watch("defaultVoice")
        changeVoice(val: Array<voiceType>) {
            if (!val) {
                this.voiceList = [];
                return;
            }
            this.voiceList = val;
            this.voiceList.map((item:any)=>{
                if(!item.name){
                    return item.name=item.url.split("/")[item.url.split("/").length - 1].split(".")[0];
                }
            })
        }

        // 多媒体弹窗选择资源
        private selectSourceDatas (res: any) {
            res = res.filter((data:any) => {
                return data.isLocalAdd || !this.voiceList.some((data2:any) => {
                    return (data2.id === data.id || data2.url === data.url)
                })
            })
            if ((res.length + this.voiceList.length) > this.maxLength) {
                this.$Message.error("已超出最大条数限制！");
                return
            }
            this.voiceList = this.voiceList.concat(res);
            this.$emit("getVoiceList", this.voiceList);
        }

        // 播放声音
        private playVoice(item: voiceType) {
            this.showVoice = true;
            this.voiceConf.src = item.url;
            this.voiceConf.pic = item.imgUrl;
            this.voiceConf.title = item.name || item.url.split("/")[item.url.split("/").length - 1].split(".")[0];
            this.voiceConf = {...this.voiceConf}
        }

        // 删除图片
        private deleteFile(index: Number) {
            this.voiceList.splice(index, 1);
            this.$emit("getVoiceList", this.voiceList);
        }
    }
</script>

<style lang='scss' scoped>
    .images-list {
        font-size: 0;
        .item {
            cursor: pointer;
            position: relative;
            display: inline-block;
            width: 240px;
            height: 160px;
            border-radius: 4px;
            margin: 0 10px 10px 0;
            vertical-align: top;
            text-align: center;
            font-size: 12px;
            color: $theme;
            .local-img {
                height: 100%;
                padding-top: 23px;
                border: 1px dashed $theme;
                line-height: 50px;
                font-size: 50px;
                p {
                    font-size: 20px;
                }
            }
            .icon {
                position: absolute;
                right: -12px;
                top: -12px;
                z-index: 1;
                color: #90a0b9;
                font-size: 24px;
                &:hover {
                    color: $theme;
                }
            }
            &.upload {
                border: 1px dashed #dee3ed;
                cursor: pointer;
                line-height: 160px;
                &:hover {
                    border-color: $theme;
                }
                input {
                    opacity: 0;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                }
            }
        }
        .cover {
            position: absolute;
            left: 0;
            top: 0;
            background: rgba(0, 0, 0, 0.6);
        }
        &.small {
            .item {
                width: 90px;
                height: 60px;
                line-height: 60px;
            }
        }
    }

    .remind {
        font-size: 12px;
        line-height: 14px;
        color: #999;
        margin-top: 12px;
    }
    .vocie-name{
        padding:0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
