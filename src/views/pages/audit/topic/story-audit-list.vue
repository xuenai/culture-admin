<!--
 * @Author: 任智勇
 * @since: 2019-06-04 09:14:58
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-16 11:44:07
 -->
<template>
    <div class="content">
        <Tabs active-key="key1" class="tab-warp" :animated="false" @on-click="setState">
            <Tab-pane label="全部" class="tab-pane"></Tab-pane>
            <Tab-pane :label="number > 0 ?  label : '待审核'"></Tab-pane>
            <Tab-pane label="不通过" class="tab-pane"></Tab-pane>
            <Tab-pane label="审核异常" class="tab-pane"></Tab-pane>
        </Tabs>
        <Form :label-width="80" inline class="wrap">
            <FormItem class="item" label="关键字">
                <Input placeholder="请输入关键字" v-model="params.name"/>
            </FormItem>
            <FormItem class="item" label="所属标签">
                <Input placeholder="请输入标签名称" v-model="params.tagName"/>
            </FormItem>
            <FormItem class="item" label="所属话题">
                <Input placeholder="请输入话题名称" v-model="params.topicName"/>
            </FormItem>
             <FormItem class="item" label="故事分类">
                <Select class="w150" v-model="params.storyType">
                    <Option value>全部</Option>
                    <Option value="story ">故事</Option>
                    <Option value="strategy">攻略</Option>
                    <Option value="ich">非遗作品</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="审核方式">
                <Select class="w150" v-model="params.auditType">
                    <Option value>全部</Option>
                    <Option value="artificial ">人工审核</Option>
                    <Option value="machine">人工智能</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="发布时间">
                <Date-picker
                        type="daterange"
                        placement="bottom-end"
                        placeholder="请选择发布时间"
                        @on-change="setTime"
                ></Date-picker>
                <Button type="primary" class='ml20' @click="search">搜索</Button>
            </FormItem>
        </Form>
        <baseTable :configure="tableConfig" @getList="getList" :loading='loading'>
            <ul class="tab-list table story-table">
                <li class="item header">
                    <p class="checked items">
                        <Checkbox></Checkbox>
                    </p>
                    <p class="comment-content items">故事</p>
                    <p class="star items">所属标签</p>
                    <p class="time items">发布人</p>
                    <p class="status items">状态</p>
                    <p class="status items">审核方式</p>
                    <p class="change items">操作</p>
                </li>
                <li class="item" v-for="(row,index) in tableData.bodyList" :key="row.id">
                    <div class="item-box">
                        <div class="checked items">
                            <p class="ch">
                                <Checkbox></Checkbox>
                            </p>
                        </div>
                        <div class="comment-content items">
                            <div class="story" v-if="row.storyType === 'story'">
                                <h3 class="title">{{row.title}}</h3>
                                <div class="content mt10 line6" v-html="row.content"></div>
                                <ul class="img-list mt10" v-if="row.images.length">
                                    <li class="img daq-no-photo" v-for="(item, imgIdx) in row.images" :key="item">
                                        <img :src="item" class="cloud-img" alt @click.stop="viewImage(row.images,row.title, imgIdx)">
                                    </li>
                                </ul>
                                <div class="info mt10">
                                   <div class="address" v-if="row.resourceName">
                                        <i class="cloud-icon">&#xe606;</i>
                                        {{row.resourceName}}
                                    </div>
                                    <div class="address" v-if="row.longitude && row.latitude&&!row.resourceName">
                                        <i class="cloud-icon">&#xe606;</i>
                                        {{row.address}}
                                    </div>
                                    <ul class="count-panel">
                                        <li>发布时间：{{row.createDate}}</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="story" v-if="row.storyType === 'strategy'">
                                <h3 class="title">{{row.title}}</h3>
                                <!-- <div class="trip-panel">
                                    <ul class="trip-list" v-if="row.strategyDetail.length">
                                        <li
                                                class="items"
                                                v-for="(item, index) in row.strategyDetail"
                                                :key="index + 'i'"
                                        >
                                            <span class="days">DAY{{index + 1}}</span>
                                            <span class="scenic-name">{{item.title}}</span>
                                        </li>
                                    </ul>
                                </div> -->
                                <ul class="img-list mt10" v-if="row.images.length">
                                    <li class="img daq-no-photo" v-for="(item, imgIdx) in row.images" :key="item">
                                        <img :src="item" class="cloud-img" alt @click.stop="viewImage(row.images,row.title, imgIdx)">
                                    </li>
                                </ul>
                                <div class="info mt10">
                                    <ul class="count-panel">
                                        <li>发布时间：{{row.createDate}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="star items">
                            <div class="labels">
                                <p v-if="row.tagName">#{{row.tagName}}#</p>
                                <p v-if="row.topicName">话题：# {{row.topicName}} #</p>
                            </div>
                        </div>
                        <div class="time items">
                            <div class="releasePeople">
                                <div class="avatar">
                                    <img :src="row.vipHead" class="cloud-img" v-if="row.vipHead">
                                    <img v-else src="@assets/image/site-default.png" class="cloud-img" />
                                </div>
                                <div>
                                    <span class="name ml10" v-if="row.ichHpName">{{row.ichHpName}}</span>
                                    <span class="name ml10" v-if="!row.ichHpName">{{row.vipNickName || '游客'}}</span>
                                    <span class="people-tag" v-if="row.ichHpName">非遗传承人</span>
                                </div>
                            </div>
                        </div>
                        <p class="status items">
                            <span v-if="row.auditStatus === 3">草稿</span>
                            <span v-if="row.auditStatus === 4">待审核</span>
                            <span v-if="row.auditStatus === 5">审核中</span>
                            <span v-if="row.auditStatus === 6">审核通过</span>
                            <span v-if="row.auditStatus === 7">审核不通过</span>
                            <span v-if="row.auditStatus === 8">已撤回</span>
                            <span v-if="row.auditStatus === 9">终止</span>
                            <span v-if="row.auditStatus === 79">审核不通过</span>
                            <span v-if="row.auditStatus === 500">审核异常</span>
                        </p>
                        <p class="status items">
                            <span v-if="row.auditType === 'artificial'">人工审核</span>
                            <span v-if="row.auditType === 'machine'">人工智能</span>
                            <span v-if="!row.auditType">-</span>
                        </p>
                        <p class="change items">
                            <a
                                    class="theme-blue action-btn"
                                    v-if="row.auditStatus === 4 || row.auditStatus === 500"
                                    @click="batchAudit(index,row)"
                            >审核</a>
                            <router-link
                                    :to="{path: '/story-detail-audit', query: {id: row.id}}"
                                    class="theme-blue action-btn"
                            >查看
                            </router-link>
                            <!-- <a
                                class="theme-blue action-btn"
                                v-if="row.auditStatus === 79 || row.auditStatus === 6"
                                @click="batchAudit(index,row)"
                            >复审</a> -->
                        </p>
                    </div>
                    <div class="reply" v-if="row.auditStatus === 79">
                        <p
                                class="left"
                        >由【{{row.auditType === 'artificial' ? '人工审核' : '人工智能'}}】{{row.auditDate}} 审核，审核结果：不通过</p>
                        <span class="right" v-if="row.auditType === 'artificial'"
                              @click="showWhy(row)">不通过原因</span>
                        <span class="right" v-else @click="showWhyMachine(row)">不通过原因</span>
                    </div>
                </li>
                <li v-if="!tableData.bodyList.length" class="no-data">暂无数据</li>
            </ul>
        </baseTable>
        <!-- 审核 -->
        <Modal title="审核意见"  v-model="dialogConfig.show" footer-hide width="500">
            <div class="describe">
                <div class="btn-box">
                <Button class="item" @click="setBatch(6)" :class="batch === 6 ? 'active' : ''">通过</Button>
                <Button class="item ml20" @click="setBatch(79)" :class="batch === 79 ? 'active' : ''">不通过</Button>
                </div>
                <Input
                v-model="auditResult"
                type="textarea"
                class="mt20"
                :maxlength="200"
                placeholder="请输入不通过原因"
                v-show="batch === 79"
                />
                <p v-if="batch === 79">200字以内</p>
            </div>
            <!-- 快捷回复 -->
            <fastReply @reply="getReply" class="mt10" style="margin-left:-30px;"  v-show="batch === 79"></fastReply>
            <div class="btns-group mt20">
                <Button @click="dialogConfig.show=false">取消</Button>
                <Button class="ml20" type="primary" @click="submitChecked">确认审核</Button>
            </div>
        </Modal>
        <!--机审不通过原因-->
        <Modal class="machineModal"
               v-model="modal"
               title="不通过原因"
               :mask-closable="true"
               footer-hide
               @on-ok="machineOk()"
               @on-cancel="machineCancel()"
               :z-index="99">
            <div class="item" v-if="modalData.textList && modalData.textList.length">
                <p class="title">文字</p>
                <ul class="item-content mt10">
                    <li v-for="(item,index) in modalData.textList" :key="item.label">{{index+1}}、<span class="red">“{{item.label}}”</span>
                        {{item.context}}
                    </li>
                </ul>
            </div>
            <div class="item mt10" v-if="modalData.imageList && modalData.imageList.length">
                <p class="title">图片</p>
                <ul class="item-content mt10">
                    <li class="clearfix" v-for="(item,index) in modalData.imageList" :key="`img${index}`">
                        <p class="fl img">
                            <img class="cloud-img" :src="item.url" :alt="item.description">
                        </p>
                        <p class="fl context">{{item.description}}</p>
                    </li>
                </ul>
            </div>
            <div class="item mt10" v-if="modalData.videoList && modalData.videoList.length">
                <p class="title">视频</p>
                <ul class="item-content mt10">
                    <li class="clearfix" v-for="(item,index) in modalData.videoList" :key="`vedio${index}`">
                        <p class="img daq-no-photo view-images-box fl" @click="openVideo(item)">
                            <span class="cover"></span>
                        </p>
                        <p class="context fl">{{item.description}}</p>
                    </li>
                </ul>
            </div>
            <div class="item mt10" v-if="modalData.voiceList && modalData.voiceList.length">
                <p class="title">音频</p>
                <ul class="item-content mt10">
                    <li class="clearfix" v-for="(item,index) in modalData.voiceList" :key="`audio${index}`">
                        <div class="fl">
                            <audioPlayer :defaultAudio="item.url" :readonly="true"></audioPlayer>
                        </div>
                        <p class="context fl">{{item.description}}</p>
                    </li>
                </ul>
            </div>
        </Modal>
        <Modal class="machineModal"
               v-model="popmodal"
               title="不通过原因"
               :mask-closable="true"
               footer-hide
               :z-index="99">
            {{curRow.auditResult}}
        </Modal>
        <VideoPlayer :showVideo="showVideo" :show="showPlayer" v-if="showVideo.url"></VideoPlayer>
        <!-- 图片查看 -->
        <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import baseTable from "@components/baseTable/baseTable.vue";
    import Dialog from "@components/Dialog/Dialog.vue";
    import {getStoryList, setCover, storyAudit, getNoPassMsg} from "@service/topic";
    import VideoPlayer from "@components/video-play/video-play.vue";
    import audioPlayer from "@components/upload/upload-audio.vue";
    import fastReply from "@views/pages/common/fast-reply.vue";
    import { PreviewPics} from '@components/index';

    interface videoType {
        url: String;
        image: String;
        title: String;
    }

    @Component({
        components: {
            baseTable,
            Dialog,
            VideoPlayer,
            audioPlayer,
            PreviewPics,
            fastReply
        }
    })
    export default class storyList extends Vue {
        //设置快捷回复
        getReply(item:any){
            this.auditResult=item;
        }
        private show: boolean = false;
        private cover: string = "human";
        private auditResult: string = "";
        private loading: boolean = true;
        private item: any = {};
        private number: Number = 0;
        //   弹窗配置
        // 获取审核流程信息
        private batch: Number = 0;
        private dialogConfig: any = {
            title: "审核",
            show: false,
            size: "default"
        };
        private params: any = {
            auditStatus: "",
            auditType: "",
            createEndDate: "",
            createStartDate: "",
            name: "",
            tagName: "",
            topicName: ""
        };
        private tableData: any = {
            headList: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "故事",
                    key: "story",
                    slot: "story"
                },
                {
                    title: "所属标签",
                    key: "label",
                    slot: "label",
                    align: "center",
                    width: 300
                },
                {
                    title: "发布人",
                    key: "releasePeople",
                    slot: "releasePeople",
                    align: "center",
                    width: 300
                },
                {
                    title: "状态",
                    key: "auditStatus",
                    align: "center",
                    slot: "auditStatus",
                    width: 200
                },
                {
                    title: "审核方式",
                    key: "auditType",
                    align: "center",
                    slot: "auditType",
                    width: 200
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    slot: "action"
                }
            ],
            bodyList: []
        };
        /* S 查看大图 */
        private visible: Boolean = false;
        private imgUrl: Array<string> = [];
        private imgTitle: String = '';
        private currIndex = 0;
        private viewImage(url: any,name: String, index?: number) {
            // 判断url的类型 如果是数组 则直接赋值 如果不是数组 则先清空数组 再将url写到数组里面去
            if (Object.prototype.toString.call(url) === '[object Array]') {
                this.imgUrl = url;
            }
            if (Object.prototype.toString.call(url) === '[object String]') {
                this.imgUrl = []
                this.imgUrl.push(url)
            }
            this.imgTitle = name;
            this.visible = true;
            this.currIndex = index || 0
        }
        /* E 查看大图 */
        //表格分页信息
        private tableConfig: any = {
            page: {
                currPage: 1
            },
            pagePosition: "right"
        };

        //人工审核
        private popmodal = false;
        private showWhy(row: any) {
            this.curRow = row;
            this.popmodal = true;
        }

        /*S 机器审核*/
        private modal: boolean = false;
        private modalData: any = {};

        private showWhyMachine(row: any) {
            let _this = this;
            _this.modal = true;
            getNoPassMsg({
                resourceType: "story",
                resourceId: row.id
            }).then((res: any) => {
                if (res.code === 0) {
                    _this.modalData = res.data;
                }
            });
        }

        //确认
        private machineOk() {
            this.modal = false;
        }

        //取消
        private machineCancel() {
            this.modal = false;
        }


        /*E 机器审核 */
        /*S视频*/
        private showPlayer: boolean = false;
        private showVideo: videoType = {
            url: "",
            image: "",
            title: ""
        };

        private openVideo(item: any) {
            this.showPlayer = true;
            this.showVideo.url = item.url;
            this.showVideo.title = item.description;
        }

        /*E视频*/
        // 批量审核
        private itemIndex: number = -1;
        private curRow: any = {};

        private batchAudit(index: number, row: any) {
            this.auditResult = '';
            if (row.auditStatus === 6) {
                this.batch = 79;
            }
            if (row.auditStatus === 79) {
                this.batch = 6;
            }
            this.dialogConfig.show = true;
            this.itemIndex = index;
            this.curRow = row;
        }

        // 关闭弹窗
        private closePop() {
            this.dialogConfig.show = false;
        }

        mounted() {
            this.getList();
        }

        // 关闭弹窗
        private close() {
            this.batch = 0;
            this.dialogConfig.show = false;
        }

        //   搜索
        private search() {
            this.tableConfig.page.currPage = 1;
            this.getList();
        }

        // 设置通过 || 不通过
        private setBatch(type: any) {
            this.batch = type;
        }

        // 时间
        private setTime(e: any) {
            this.params.createStartDate = e[0];
            this.params.createEndDate = e[1];
        }

        //   审核
        private submitChecked() {
            if (this.batch === 0) {
                this.$Message.error("请选择是否通过！");
                return;
            }
            if (!this.auditResult && this.batch === 79) {
                this.$Message.error("请输入不通过原因！");
                return;
            }
            storyAudit({
                auditStatus: this.batch,
                id: this.tableData.bodyList[this.itemIndex].id,
                auditResult: this.auditResult,
                resourceName: this.curRow.title
            }).then(data => {
                if (data.code === 0) {
                    this.$Message.success("操作成功");
                    this.batch = 0;
                    this.dialogConfig.show = false;
                    this.getList()
                }
            });
        }

        private label(h: any) {
            let _this = this;
            return h("div", [
                h("span", "待审核"),
                h("Badge", {
                    props: {
                        count: _this.number
                    }
                })
            ]);
        }

        private getListSet() {
            getStoryList({
                auditStatus: 4
            }).then((data: any) => {
                this.number = data.page ? (data.page.total as Number) : 0;
            });
        }

        // 列表
        private getList(page: any = this.tableConfig.page) {
            this.loading = true;
            Object.assign(this.params, page);
            getStoryList(this.params).then((data: any) => {
                this.tableConfig.page = data.page ? data.page : {};
                (data.datas).map((item: any) => {
                    item.address = "";
                    if (item.longitude && item.latitude) {
                        this.geocoder(item.longitude, item.latitude).then((address:string) => item.address = address);
                    }
                });
                this.tableData.bodyList = data.datas;
                this.loading = false;
            });
            this.getListSet();
        }

        private geocoderObj = new AMap.Geocoder();
        //经纬度转换为地址
        private geocoder(lnglatX: number | string, lnglatY: number | string): Promise<string> {
            return new Promise((resolve: Function, reject: Function) => {
                if (!lnglatX || !lnglatY) {
                    reject()
                } else {
                    this.geocoderObj.getAddress([lnglatX, lnglatY], function (status: string, result: any) {
                        if (status === "complete" && result.info === "OK") {
                            resolve(result.regeocode.formattedAddress)
                        } else {
                            reject()
                        }
                    });
                }
            })
        }

        // tab
        private setState(index: Number) {
            switch (index) {
                case 0:
                    this.params.auditStatus = "";
                    break;
                case 1:
                    this.params.auditStatus = 4;
                    break;
                case 2:
                    this.params.auditStatus = 79;
                    break;
                case 3:
                    this.params.auditStatus = 500;
                    break;
            }
            this.tableConfig.page.currPage = 1;
            this.getList();
        }
    }
</script>
<style lang="scss">
.story-table{
  .ivu-table-cell{
    overflow:inherit;
  }
}
</style>
<style lang="scss" scoped>
.content{
    .wrap {
        padding: 15px 0 0;
        background: $grayLight;
    }
}
.describe {
    .btn-box {
        display: flex;
        justify-content: center;
    }
}
.btns-group {
  width: 100%;
  text-align: right;
}

.inp-control {
    width: 70%;
}

.w150 {
    width: 150px;
}

.label-name {
    width: 75px;
    line-height: 35px;
}

.add-btn {
    width: 100px;
}

    

.table {
    .action-btn {
        cursor: pointer;
        & + .action-btn {
            margin-left: 10px;
        }
    }
    .releasePeople {
        position:relative;
        padding: 5px 0;
        text-align: center;
        .avatar {
            display: inline-block;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            vertical-align: middle;
        }
        .name {
            display: inline-block;
            vertical-align: middle;
        }
        .people-tag{
            // position:absolute;
            // z-index:9999;
            display:inline-block;
            margin-left: 10px;
            // right:-30px;
            // top:6px;
            width:65px;
            height:20px;
            line-height:20px;
            font-size:12px;
            color:#ff9051;
            border:1px solid #ff9051;
            border-radius:4px;
        }
    }
    .story {
        padding: 8px 0;
        .img-list {
            @include clearfix;
            .img {
                float: left;
                width: 50px;
                height: 50px;
                overflow: hidden;
                & + .img {
                    margin-left: 5px;
                }
            }
        }
        .info {
            @include clearfix;
        }
        .address {
            float: left;
            background-color: $bg;
            padding: 2px 5px;
            border-radius: 4px;
            color: $font02;
        }
        .count-panel {
            float: left;
            margin-top: 2px;
            li {
                display: inline-block;
                margin-left: 10px;
                & + li {
                    position: relative;
                    padding-left: 8px;
                    &:after {
                        position: absolute;
                        left: 0;
                        top: 3px;
                        content: "";
                        height: 12px;
                        width: 1px;
                        background-color: $borderDark;
                    }
                }
            }
        }
        .trip-list {
            @include clearfix;
            .items {
                position: relative;
                display: inline-block;
                border-top: 1px solid $borderLight;
                min-width: 70px;
                max-width: 150px;
                margin-top: 30px;
                text-align: center;
                &:before {
                    top: -5px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 1px solid $borderLight;
                }
                &:first-of-type {
                    &:before {
                        position: absolute;
                        content: "";
                        left: -10px;
                    }
                }
                &:last-of-type {
                    &:before {
                        position: absolute;
                        content: "";
                        right: -10px;
                    }
                }
                &:after {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    content: "";
                    height: 10px;
                    width: 1px;
                    border-left: 1px dashed $borderLight;
                }
            }
            .days {
                position: absolute;
                width: 100%;
                font-size: 12px;
                text-align: center;
                top: -20px;
                left: 0;
            }
            .scenic-name {
                display: block;
                width: 100%;
                font-size: 12px;
                text-align: center;
                padding-top: 10px;
                @include ellipsis();
            }
        }
    }
}

.tab-list {
    width: 100%;
    .item {
        margin-top: 20px;
        padding: 20px 0;
        // font-size: 0;
        border: 1px solid #e2e2e2;
        .star-box {
            margin-top: 35%;
        }
        .stars {
            font-size: 22px;
            color: #e3e2e5;
            &.active {
                color: #feb133;
            }
        }
        .reply {
            display: flex;
            align-items: center;
            margin: 12px 15px 0 5%;
            padding: 8px 10px;
            font-size: 12px;
            line-height: 18px;
            color: #333;
            background: #f7f7f7;
            .left {
                flex: 1;
                overflow: hidden;
            }
            .right {
                color: #6ed35e;
                cursor: pointer;
            }
            span {
                color: $theme;
            }
        }
        .summary {
            margin-top: 10px;
            font-size: 12px;
            line-height: 18px;
            color: #333;
            span {
                display: inline-block;
                height: 16px;
                padding: 0 4px;
                margin-right: 5px;
                color: #fff;
                line-height: 16px;
                font-size: 10px;
                background: #feb133;
                vertical-align: top;
                border-radius: 4px;
            }
        }
        .img-list {
            margin-top: 5px;
            // font-size: 0;
            .img {
                display: inline-block;
                width: 50px;
                height: 50px;
                margin: 8px 8px 0 0;
                cursor: pointer;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .item-box {
            display: flex;
            align-items: center;
            // font-size: 0;
        }
        .title-box {
            flex: 1;
            margin-left: 5%;
            padding-bottom: 20px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e2e2e2;
            .img-cover {
                width: 66px;
                height: 66px;
                margin-right: 15px;
                overflow: hidden;
                vertical-align: middle;
            }
            .title {
                flex: 1;
                color: $theme;
                font-size: 12px;
                line-height: 24px;
                overflow: hidden;
                &:hover {
                    color: $theme-hover;
                }
            }
        }

        .items {
            display: inline-block;
            vertical-align: top;
            box-sizing: border-box;
            -moz-box-sizing: border-box; /* Firefox */
            -webkit-box-sizing: border-box; /* Safari */
        }
        .comment-content {
            width: 37%;
        }
        .checked {
            width: 5%;
            text-align: center;
        }
        .change {
            width: 10%;
            text-align: center;
            a {
                color: $theme;
                font-size: 12px;
                &:hover {
                    color: $theme-hover;
                }
            }
        }
        .status,
        .time,
        .star {
            width: 12%;
            text-align: center;
            font-size: 12px;
            color: #333;
        }
        &.header {
            padding: 14px 0;
            align-items: center;
            background: #f2f2f2;
            border: none;
            .items {
                line-height: 18px;
                font-size: 12px;
                color: #333;
                border: none;
            }
        }
    }
}

.no-data {
    height: 48px;
    line-height: 48px;
    color: #999;
    text-align: center;
    border: 1px solid #e2e2e2;
    border-top: 0;
}

.machineModal {
    .title {
        font-size: 13px;
        font-weight: 600;
    }
    .item {
        padding-top: 10px;
        & + .item {
            border-top: 1px solid $borderLight;
        }
    }
    .img {
        width: 50px;
        height: 50px;
    }
    .context {
        line-height: 30px;
        margin-left: 15px;
    }
}
</style>
