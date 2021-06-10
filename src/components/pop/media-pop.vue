<template>
    <div class="pop media-popup-wrapper">
        <Dialog :configer="dialogConfig" @onClose="closePop" @onOk="sureFn">
            <div class="cont" v-if="uploadType === 0">
                <div class="condition">
                    <Form inline style="display: flex;">
                        <FormItem label="资源名称" :label-width="70" style="margin-bottom: 0;">
                            <Input type="text" v-model="params.keyword" placeholder="资源名称" @on-enter="handleSubmit"/>
                        </FormItem>
                        <FormItem label="资源类型" :label-width="70" style="margin-bottom: 0;">
                            <Select v-model="params.placeType" @on-change="handleSubmit">
                                <Option value>全部</Option>
                                <Option value="CONTENT_TYPE_VENUE">场馆</Option>
                                <Option value="CONTENT_TYPE_SCENERY">景区</Option>
                                <Option value="CONTENT_TYPE_HOTEL">酒店</Option>
                                <Option value="CONTENT_TYPE_RESTAURANT">餐饮</Option>
                                <Option value="CONTENT_TYPE_TOILET">厕所</Option>
                                <Option value="CONTENT_TYPE_PARKING">停车场</Option>
                                <Option value="CONTENT_TYPE_HERITAGE_ITEM">非遗项目</Option>
                                <Option value="CONTENT_TYPE_HERITAGE_PEOPLE">非遗传承人</Option>
                                <Option value="CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE">非遗体验基地</Option>
                                <Option value="CONTENT_TYPE_HERITAGE_TEACHING_BASE">非遗传习基地</Option>
                                <Option value="CONTENT_TYPE_HERITAGE_PROTECT_BASE">非遗生产性基地</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <div class="fromItem">
                        <Button type="primary" class="submit" @click="handleSubmit">搜索</Button>
                    </div>
                    <div class="fromItem upload ivu-btn ivu-btn-primary">
                        <!--<input type="file" :accept="currSource.accept" multiple ref="fileInput" @change="acceptImage($event)">-->
                        <span @click="taggleUploadType(1)">本地上传</span>
                    </div>
                </div>
                <baseTable class="table" :sizeOpts="[5,10,20]" :configure="tableConfig" @getList="getList">
                    <Table  height="360"
                            border
                            @on-selection-change="selectionTable"
                            :columns="data.header"
                            :data="data.list"
                            :loading="loading"
                            ref="table"
                    >
                        <template slot-scope="{ row }" slot="img">
                            <div class="siteInfoDiv">
                                <div class="imgDiv daq-no-photo"
                                     :style="{'box-shadow': '0 0 5px 2px #eee', 'border-radius': '4px', 'overflow': 'hidden', 'margin': '0 8px 0 0'}"
                                     @click="()=>{if(!row[currSource.imgKey])return; previewPic=row[currSource.imgKey];previewPicShow=true}">
                                    <!--<img :src="row[currSource.imgKey]">-->
                                    <img :src="row[currSource.imgKey]" v-if="row[currSource.imgKey]" style="cursor:pointer;" alt="">
                                </div>
                                <div class="info">
                                    <h3 class="line2" :title="row.name">{{row.name}}</h3>
                                </div>
                            </div>
                        </template>

                        <template slot-scope="{ row }" slot="name">
                            <p class="line2" :title="row.name">{{row.name}}</p>
                        </template>

                        <template slot-scope="{ row }" slot="description">
                            <p class="line2" :title="row.description">{{row.description}}</p>
                        </template>
                    </Table>
                </baseTable>
            </div>
            <div class="local-add" v-if="uploadType === 1">
                <Upload
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccessHd"
                        :on-remove="fileRemove"
                        class="local-add-list add-annex-del_txt"
                        multiple
                        type="drag"
                        :accept="currSource.accept"
                        :data="{path: 'cultural-tourism-cloud'}"
                        name="Filedata"
                        action="http://file.geeker.com.cn/uploadOSS">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到这里上传</p>
                    </div>
                </Upload>
                <Button typeof="primary" class="back-list" @click="taggleUploadType(0)">返回列表</Button>
            </div>
        </Dialog>

        <PreviewPic v-model="previewPicShow" :imgUrl="previewPic"/>
    </div>
</template>

<script lang='ts'>
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import baseTable from "@components/baseTable/baseTable.vue";
    import Dialog from "@components/Dialog/Dialog.vue";
    import { PreviewPic } from "@components/index";
    import { AppModule } from "@store/modules/app";
    import {
        getSourceImgList,
        getSourceVideoList,
        getSourceAudioList,
        uploadImage,
        saveMultiImage,
        saveMultiVideo,
        saveMultiVoice
    } from "@service/content";

    // 本地上传图片的一些属性
    interface localImageType {
        url: string; // 本地视频video截取的封面
        width?: number;
        height?: number;
        duration?: number;
        [propName: string]: any;
    };

    @Component({components: {Dialog, baseTable, PreviewPic}})
    /**
     * 事件
     * onSure: 选择确定时触发
     *
     * prop参数
     * sourceType：资源类型 0: 图片，1:视频，2: 音频
     * show: boolean
     * close: function关闭弹窗
     */
    export default class mediaPop extends Vue {
        // 显示隐藏
        @Prop() private show!:boolean;
        // 资源类型 0: 图片，1:视频，2: 音频
        @Prop({default: 0}) private sourceType!:number;
        // 关闭弹窗
        @Prop() private close!:any;
        // 创建者
        @Prop() private createUser!:string;
        // 是否保存到资源库 默认不保存到资源库
        @Prop({default: false}) private saveToSource!:boolean;
        // 方式1： 默认选中的数据ids
        @Prop({default: ()=>[]}) private selectIds!:Array<number>;
        // 方式2：默认选中的数据urls
        @Prop({default: ()=>[]}) private selectUrls!:Array<string>;
        // 是否显示图片弹窗
        private previewPicShow: boolean = false;
        // 图片弹窗图片集
        private previewPic: string = '';

        // 资源类型分类
        private sourceObjs = <any>[
            {
                req: getSourceImgList,
                title: '多媒体库-图片',
                accept: 'image/*',
                imgKey: 'url',
                mutiUpload: saveMultiImage,
                data: {
                    header: [
                        {
                            type: "selection",
                            width: 60,
                            align: "center"
                        },
                        {
                            title: "图片",
                            key: "url",
                            width: 400,
                            slot: "img"
                        },
                        {
                            title: "名称",
                            key: "name",
                            slot: "name",
                            width: 120,
                            align: "center"
                        },
                        {
                            title: "描述",
                            key: "description",
                            slot: "description",
                            align: "center"
                        }
                    ],
                    list: []
                }
            },
            {
                req: getSourceVideoList,
                title: '多媒体库-视频',
                accept: 'video/*',
                imgKey: 'imgUrl',
                mutiUpload: saveMultiVideo,
                data: {
                    header: [
                        {
                            type: "selection",
                            width: 60,
                            align: "center"
                        },
                        {
                            title: "视频封面图",
                            key: "imgUrl",
                            width: 400,
                            slot: "img"
                        },
                        {
                            title: "名称",
                            key: "name",
                            slot: "name",
                            width: 120,
                            align: "center"
                        },
                        {
                            title: "描述",
                            key: "description",
                            slot: "description",
                            align: "center"
                        }
                    ],
                    list: []
                }
            },
            {
                req: getSourceAudioList,
                title: '多媒体库-音频',
                accept: 'audio/*',
                imgKey: 'imgUrl',
                mutiUpload: saveMultiVoice,
                data: {
                    header: [
                        {
                            type: "selection",
                            width: 60,
                            align: "center"
                        },
                        {
                            title: "音频封面图",
                            key: "imgUrl",
                            width: 400,
                            slot: "img"
                        },
                        {
                            title: "名称",
                            key: "name",
                            slot: "name",
                            width: 120,
                            align: "center"
                        },
                        {
                            title: "描述",
                            key: "description",
                            slot: "description",
                            align: "center"
                        }
                    ],
                    list: []
                }
            }
        ];
        // 当前资源类型对象
        private currSource: any = null
        // 弹窗配置
        private dialogConfig: any = {
            title: "",
            show: false,
            disabled: true,
            ok:true,
            cancel:true
        };
        // 查询条件
        private params = <any>{
            keyword: '',
            placeType: ''
        };
        // 表格配置
        private tableConfig = <any>{
            page: {
                currPage: 1,
                pageSize: 5,
                total: 0
            },
            pagePosition: "right"
        };
        // 表格loading
        private loading = true;
        // 表格数据
        private data = <any>{
            header: [],
            list: []
        };
        // 弹窗表格选中的数据项
        private selectionList: Array<any> = [];
        // 弹窗表格本地选中的数据项
        private localSelectionList: Array<any> = [];
        // 上传视频的封面图
        private uploadVideoImgList: Array<any> = [];
        // 上传音频的时长等信息
        private uploadAudioList: Array<any> = [];
        // 上传类型 资源库0，本地1
        private uploadType: number = 0
        // 创建者
        private orgId: string =''
        // 拷贝回显记录
        private copySelectIds: Array<any> = []
        // 拷贝回显记录
        private copySelectUrls: Array<any> = []

        static currSourceType: number | undefined
        created() {
            let currSourceType = mediaPop.currSourceType
            if (typeof currSourceType === 'number') {
                this.currSource = this.sourceObjs[currSourceType+'']
                mediaPop.currSourceType = undefined
            } else {
                this.currSource = this.sourceObjs[this.sourceType+'']
            }
            this.dialogConfig.title = this.currSource.title
            this.orgId = this.createUser || AppModule.userInfo.orgId || '-1'
        }
        mounted() {
            this.getList();
        }

        // 监听显示隐藏
        @Watch("show")
        setShow(val: Boolean, oldValue: Boolean) {
            this.copySelectIds = [...this.selectIds];
            this.copySelectUrls = [...this.selectUrls];
            this.uploadType = 0;
            this.selectionList = [];
            this.localSelectionList = [];
            this.uploadVideoImgList = [];
            this.uploadAudioList = [];
            this.uploadCountPrev = 0;
            this.uploadCountNext = 0;
            this.uploadAudioList = [];
            this.dialogConfig.show = val;
            if (val) this.setChecked();
        }
        // 设置选中
        private setChecked() {
            if (this.copySelectIds.length || this.copySelectUrls.length) {
                this.data.list = this.data.list.map((data:any)=> {
                    if (this.copySelectIds.length) { // 方式1
                        if (this.copySelectIds.includes(data.id)) {
                            data._checked = true
                            if (!this.selectionList.some((item:any)=>item.id===data.id)) {
                                this.selectionList.push(data)
                            }
                            this.copySelectIds.splice(this.copySelectIds.indexOf(data.id),1)
                        } else {
                            delete data._checked
                        }
                    } else if (this.copySelectUrls.length) { // 方式2
                        if (this.copySelectUrls.includes(data.url)) {
                            data._checked = true
                            if (!this.selectionList.some((item:any)=>item.url===data.url)) {
                                this.selectionList.push(data)
                            }
                            this.copySelectUrls.splice(this.copySelectUrls.indexOf(data.url),1)
                        } else {
                            delete data._checked
                        }
                    }
                    return data
                })
            }
        }


        // 点击确定
        /*
        * 如果选择的本地资源，那么返回出去的selectionList元素中只有url(上传资源地址),name(默认名字),id(保存id),imgUrl(base64),imgIsBase64(封面是base64)字段
        *
        * 如果选择的线上资源，那么返回出去的selectionList元素中是列表接口的数据项的字段
        *
        * 列表数据点击后会添加到selectionList中，如果再点击本地上传会一起返回出去
        * 本地上传点击上传后会执行sureFn关闭窗口
        * */
        private uploadCountPrev: number = 0; // 上传前数量记录
        private uploadCountNext: number = 0; // 上传后数量记录
        // 是否已经选择了数据
        get hasCheckList () {
            if (this.uploadType === 0) {
                return Boolean(this.selectionList.length)
            } else {
                return Boolean(this.localSelectionList.length && (this.uploadCountPrev === this.uploadCountNext))
            }
        }
        @Watch('hasCheckList')
        whasCheckList (v:any) {
          this.dialogConfig.disabled = !v
        }
        private sureFn () {
            let list = [this.selectionList, this.localSelectionList][this.uploadType];
            if (!list.length) {
                this.$Message.info('未选择任何数据！')
            } else {
                if (this.uploadType === 1) {
                    list.forEach((item:any) => item.isLocalAdd = true);
                    this.saveMulti().then(()=>{
                        this.$emit("onSure", list);
                        this.closePop();
                        if (this.onSure) this.onSure(list)
                    }).catch((err)=>{
                        if (err) {
                            this.$Message.error(err)
                        }
                    })
                } else {
                    this.$emit("onSure", list);
                    this.closePop();
                    if (this.onSure) this.onSure(list)
                }
            }
        }

        // 切换搜索列表和本地上传
        private taggleUploadType (type: number) {
            this.uploadType = type
            this.selectionList = []
            this.localSelectionList = []
            this.uploadVideoImgList = []
            this.uploadAudioList = []
            this.uploadCountPrev = 0;
            this.uploadCountNext = 0;
        }

        // 上传前获取封面图
        private beforeUpload (file: any) {
            if (file.name.length > 50) {
                this.$Message.error('文件名称不能超过50字，请更改文件名称后再上传');
                return false;
            }
            this.uploadCountPrev++;
            if (/video\//.test(file.type)) {
                return this.getVideoImg(file).then(this.uploadVideoImg)
            } else if (/audio\//.test(file.type)) {
                return this.getAudioTime(file).then((res:any) => {
                  if (res) this.uploadAudioList.push(res)
                })
            }
        }

        // 移除附件
        private fileRemove (p1:any, fileList:any) {
            this.localSelectionList = fileList.map((res:any) => ({
                name: res.name,
                url: res.response && res.response.url,
                orgId: this.orgId,
                uid: res.uid
            }))
        }

        // 附件上传成功
        private uploadSuccessHd(response: {state: number, url: string}, file: object, fileList: any) {
            this.localSelectionList = fileList.map((res:any) => ({
                name: res.name,
                url: res.response && res.response.safeUrl,
                orgId: this.orgId,
                uid: res.uid
            }))
            this.uploadCountNext++;
        }
        // 获取本地视频封面图
        private getVideoImg (file: any) {
            return new Promise((resolve, reject) => {
                let video = document.createElement("video");
                video.src = URL.createObjectURL(file);
                video.addEventListener("loadeddata", function () {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    let w = this.videoWidth;
                    let h = this.videoHeight;
                    this.width = canvas.width = w;
                    this.height = canvas.height = h;
                    // @ts-ignore
                    ctx.drawImage(this, 0, 0, w, h);
                    setTimeout(() => {
                        let duration = this.duration;
                        canvas.toBlob(blob => {
                            resolve({
                                data: blob,
                                path: 'cultural-tourism-cloud-admin',
                                fileName: `${file.name}-${Date.now()}.jpg`,
                                duration,
                                file
                            });
                        }, 'image/jpeg', 1);
                        video.pause();
                    }, 20)
                });
                video.addEventListener("error", function () {
                  resolve()
                })
                video.play();
            })
        }
        // 获取本地音频时长
        private getAudioTime (file: any) {
            return new Promise((resolve, reject) => {
                let audio = document.createElement("audio");
                audio.src = URL.createObjectURL(file);
                audio.addEventListener("loadeddata", function () {
                    resolve({
                        name: file.name,
                        duration: this.duration,
                        file
                    });
                });
                audio.addEventListener("error", function () {
                    resolve()
                })
            })
        }

        // 上传视频封面图
        private uploadVideoImg (img: any) {
            if (!img) return;
            let formData = new FormData();
            let name = '未命名';
            let r = /(.*)\.[a-zA-Z]+$/.exec(img.file.name)
            if (r) name = r[1];
            formData.append("Filedata", img.data,  name + '.jpg');
            formData.append("path", "cultural-tourism-cloud");
            return uploadImage(formData).then((res:any) => {
                this.uploadVideoImgList.push({
                    imgUrl: res.safeUrl,
                    duration: img.duration,
                    file: img.file
                })
            })
        }

        //批量保存资源地址
        private saveMulti () {
            return new Promise((resolve, reject)=>{
                if (this.uploadType === 1) { // 本地添加资源
                    if (this.sourceType === 1) { // 本地添加的视频设置封面图
                        this.localSelectionList.forEach((item:any) => {
                            let curr = this.uploadVideoImgList.find((img:any) => img.file.uid === item.uid)
                            if (curr) {Object.assign(item, curr)}
                        })
                    } else if (this.sourceType === 2) { // 本地添加的音频设置时长
                        this.localSelectionList.forEach((item:any) => {
                            let curr = this.uploadAudioList.find((img:any) => img.file.uid === item.uid)
                            if (curr) {Object.assign(item, curr)}
                        })
                    }
                }

                if (this.saveToSource) {
                    this.currSource.mutiUpload({jsonDto: JSON.stringify(this.localSelectionList)}).then((res:any)=> {
                        if (res.datas) {
                            this.localSelectionList.forEach((data, i) => {
                                data.id = res.datas[i].ID
                            });
                            resolve()
                        } else {
                            let msg = '';
                            if (res.code === 0) msg = '资源保存失败！';
                            reject(msg)
                        }
                    }).catch(()=>{
                        reject()
                    })
                } else {
                  resolve()
                }
            })
        }

        // 关闭弹窗
        private closePop() {
            if (this.close) {
                this.close()
            } else {
                this.$parent.showMedia = false
            }
        }

        //   搜索查询
        private handleSubmit() {
            this.tableConfig.page.currPage = 1;
            this.getList();
        }

        // 获取列表数据的方法
        private getList(page: any = this.tableConfig.page) {
            this.loading = true
            this.params.currPage = page.currPage
            this.params.pageSize = page.pageSize
            this.data = this.currSource.data
            this.currSource.req(this.params).then((result:any) => {
                let page = result.page
                let datas = result.datas.map((data:any)=> {
                    if (this.selectionList.some((item:any) => item.url===data.url)) {
                        data._checked = true
                    } else {
                        delete data._checked
                    }
                    return data
                })
                if (page) {
                    this.tableConfig.page = page
                }
                if (datas) {
                    this.data.list = datas
                }
                this.setChecked();
            }).finally(() => {
                this.loading = false;
            })
        }

        // 列表选择项数据变化
        private selectionTable(data: any) {
            // 把当前页的list的已选全部取消后，需要把对应的数据移除
            // 先全部移除，在添加需要的数据
            let filterArr: Array<any> = [];
            this.selectionList.forEach((item:any) => {
                if (!this.data.list.some((d:any) => d.id === item.id)) {
                    filterArr.push(item)
                }
            });
            this.selectionList = filterArr.concat(data);
            /*if (data.length) {
                //let filterArr = data.filter((item:any) => !this.selectionList.some((sele:any) => sele.url === item.url)); // 过滤掉已存在
                this.selectionList = this.selectionList.concat(data);
            }*/
        }
    }
</script>
<style lang='scss'>
.media-popup-wrapper{
    .ivu-form-item .ivu-form-item-content {
        margin-left: 70px!important;
    }
}
</style>
<style lang='scss' scoped>
    .line2 {
        @include ellipsisLn(2)
    }

    .item {
        display: inline-block;
        width: 80px;
    }

    .local-add {
        width: 805px;
        position: relative;
        .back-list {
            position: absolute;
            bottom: -52px;
            padding: 6px 27px 6px;
        }
        .local-add-list {
            /*height: 600px;*/
            max-height: 600px;
            overflow-y: scroll;
        }
    }

    .upload {
        position: relative;
        cursor: pointer;
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

    li {
        float: left;
        color: $font04;
        margin-right: 10px;
        p {
            text-align: center;
            margin-top: 10px;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
        }
        .imgDiv {
            display: inline-block;
            width: 80px;
            height: 80px;
            position: relative;
            border-radius: 3px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
            .cover {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition: all 0.33s;
                color: #fff;
                .cloud-icon {
                    cursor: pointer;
                    font-size: 18px;
                    color: $danger;
                }
            }
            &:hover .cover {
                top: 0;
            }
        }
        .addDiv {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 80px;
            border: 1px dotted $borderLight;
            border-radius: 3px;
            &:hover {
                border-color: $borderDark;
                background-color: $grayDark;
            }
        }
    }

    .condition {
        min-width: 800px;
        display: flex;
        .fromItem {
            display: flex;
            align-items: center;
            margin-left: 10px;
            label {
                display: inline-block;
                width: 80px;
                text-align: right;
                margin-right: 5px;
            }
        }
    }

    .table {
        margin-top: 10px;
        .siteInfoDiv {
            display: flex;
            margin: 5px 0;
            .imgDiv {
                width: 50px;
                height: 50px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .info {
                display: flex;
                flex: 1;
                margin-left: 5px;
                justify-content: center;
                flex-direction: column;
                p {
                    height: 16px;
                    line-height: 16px;
                }
            }
        }
    }

    .condition {
        width: 800px;
    }
</style>
