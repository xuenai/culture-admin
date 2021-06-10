<template>
    <div>
        <!-- 已上传列表 -->
        <ul class="images-list" ref="parentNode">
            <li class="item" ref="item" v-for="(item, index) in audioList" :key="item.src">
                <p class="img-box">
                    <aplayer
                        :music="{
                        title: !name ? item.split('/')[item.split('/').length - 1].split('.')[0] : item.name,
                        artist: ' ',
                        src: !name ? item : item.url,
                        pic: ' ',
                        lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
                        }"
                    />
                </p>
                <Icon type="ios-close-circle" class="icon" v-if="!readonly" @click.stop="deleteFile(index)"></Icon>
                <Input
                    v-model="item.name"
                    placeholder="请输入名称"
                    style="width: 100%; margin-top: 10px;"
                    :maxlength="100"
                    v-if="name"
                />
            </li>
            <li class="item upload" v-if="audioList.length < maxLength && !readonly">
                <div v-if="!loading">
                    <input type="file" accept="audio/*" multiple ref="fileInput" @change="acceptAudio($event)">
                    <Icon type="md-add" class="add"/>
                </div>
                <Icon custom="iconfont c-icon-jiazai upload-loading" size="24" v-if="loading"></Icon>
            </li>
        </ul>
        <p class="remind" v-if="maxLength && maxLength > 1 && !readonly">注：支持MP3格式，最多上传{{maxLength}}个</p>
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {uploadImage} from "@service/content";
    // @ts-ignore
    import Aplayer from "vue-aplayer";

    /**
     * readonly: 默认为可编辑，true 时不可编辑
     * limit  最大上传数量  少于1不展示提示
     * defaultAudio: 默认音频 String  支持多 1 +
     * <UploadImg
     :limit="1"
     @getAudioList="getLogo"
     :defaultAudio="params.getAudio"
     ></UploadImg>
     * 调用 getAudio()
     */
    @Component({
        components: {
            Aplayer
        }
    })
    export default class UploadAudio extends Vue {
        // 图片列表
        private audioList: any = [];
        //   限制个数
        private maxLength: any = 5;

        @Prop() private readonly!: boolean;
        @Prop() private limit!: Number;
        // 默认图
        @Prop() private defaultAudio!: String;
        // 是否需要标题
        @Prop() private name!: Boolean;

        @Watch("defaultAudio")
        changeAudio(val: any, oldVal: any) {
            if (!val) {
                return;
            }
            if (!this.name) {
                this.audioList = val.split(",");
                if (val.indexOf(",") !== -1) {
                } else {
                    // this.audioList = val.split(" "); 若已空格分开，当文件名存在空格时，会被分为好几个
                }
            } else {
                this.audioList = val;
            }
        }

        // 图片拖动
        mounted() {
            if (!this.name) {
                if (this.defaultAudio) {
                    this.audioList = this.defaultAudio.split(",");
                    if (this.defaultAudio.indexOf(",") !== -1) {
                    } else {
                        // this.audioList = this.defaultAudio.split(" "); 若已空格分开，当文件名存在空格时，会被分为好几个
                    }
                }
            } else {
                this.audioList = this.defaultAudio;
            }
            if (this.limit) {
                this.maxLength = this.limit;
            }
        }

        //加载loading 图
        private loading:boolean=false;
        // 选择音频
        private acceptAudio(e: any) {
            let files = e.target.files;
            let _this = this;
            let len = files.length;
            let _input = this.$refs.fileInput as HTMLElement;
            // 超过最大限制
            let _limit = this.maxLength - this.audioList.length;
            if (this.audioList.length + len > this.maxLength) {
                this.$Message.error(
                    `您最多${this.maxLength === 1 ? "只" : "还"}能上传${_limit}个`
                );
                return;
            }
            _input.setAttribute("type", "text");
            _this.loading=true;
            for (let i = 0; i < len; i++) {
                let formData = new FormData();
                formData.append("Filedata", files[i]);
                formData.append("path", "cultural-tourism-cloud");
                uploadImage(formData).then((data: any) => {
                    if (!_this.name) {
                        _this.audioList.push(data.safeUrl);
                    } else {
                        _this.audioList.push({
                            url: data.safeUrl,
                            name: (files[i].name as any).substr(0,100)
                        });
                    }
                    if (_this.audioList.length >= len) {
                        if (_this.name) {
                            _this.$emit("getAudioList", _this.audioList as Array<Object>);
                        } else {
                            _this.$emit("getAudioList", _this.audioList as Array<string>);
                        }
                        _this.loading=false;
                        //获取音频时长
                        _this.getAudioListLen();
                    }

                });
            }
            _input.setAttribute("type", "file");
        }
        //获取音频播放时长
        private audioTime:any=[];
        getAudioListLen(){
            let _this=this,time;
            _this.audioTime=[];
            setTimeout(function () {
                time=window.document.querySelectorAll(".aplayer-dtime");
                for(let i=0;i<time.length;i++){
                    _this.audioTime.push(time[i].innerHTML);
                    if(i+1===time.length){
                        _this.$emit("getAudioTime", _this.audioTime);
                    }
                    if(_this.name){
                        _this.audioList[i].duration = _this.audioTime;
                    }
                    _this.$emit("getAudioList", _this.audioList);
                }
            },700);
        }
        // 删除音频
        private deleteFile(index: Number) {
            this.audioList.splice(index, 1);
            if (this.name) {
                this.$emit("getAudioList", this.audioList as Array<Object>);
            } else {
                this.$emit("getAudioList", this.audioList as Array<string>);
            }
           this.getAudioListLen();
        }
    }
</script>
<style lang='scss'>
    .aplayer-controller .aplayer-icon {
        display: none !important;
    }

    .aplayer-title {
        display: block;
        @include ellipsis();
    }
</style>
<style lang='scss' scoped>
    .images-list {
        font-size: 0;
        .item {
            cursor: pointer;
            position: relative;
            display: inline-block;

            margin: 0 10px 10px 0;
            vertical-align: top;
            text-align: center;
            .img-box {
                width: 300px;
                height: 76px;
                border-radius: 4px;
            }
            .add {
                line-height: 74px;
                font-size: 40px;
                color: $theme;
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
                height: 74px;
                width: 74px;
                line-height: 74px;
                border: 1px dashed #dee3ed;
                cursor: pointer;
                &:hover {
                    border-color: $theme;
                }
                input {
                    opacity: 0;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 74px;
                    height: 74px;
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
    }

    .remind {
        font-size: 12px;
        line-height: 14px;
        color: #999;
        margin-top: 12px;
    }
</style>
