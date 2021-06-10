<template>
    <div class="perform-wrap detail-wrap pd20">
        <!--审核结果-->
        <auditHead :data="headData" v-if="headData.status"></auditHead>
        <!--tab切换-->
        <Tabs active-key="key2" class="mt20 tab-wrap" :animated="false">
            <!--基础资料-->
            <Tab-pane label="基本资料" key="key1">
                <Row class="item mt20">
                    <Col span="4" class="label-name">活动室名称</Col>
                    <Col span="20" class="item-content">
                        {{desc.name}}
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">面积</Col>
                    <Col span="20" class="item-content">
                        {{desc.area}}㎡
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">可容纳人数</Col>
                    <Col span="20" class="item-content">
                        {{desc.galleryful}}人
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">服务电话</Col>
                    <Col span="20" class="item-content">
                        {{desc.phone}}
                    </Col>
                </Row>
                <Row class=" item mt20" v-if="desc.type">
                    <Col span="4" class="label-name">活动室类型</Col>
                    <Col span="20" class="btn-list">
                        <span class="choice-tag active" v-for="(item,index) in tagList.typeList" :key="index">{{item.labelName}}</span>
                    </Col>
                </Row>
                <Row class=" item mt20" v-if="desc.equipment">
                    <Col span="4" class="label-name">设备</Col>
                    <Col span="20" class="btn-list">
                        <span class="choice-tag active" v-for="(item,index) in tagList.equipmentList" :key="index">{{item.labelName}}</span>
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">资源互通编码</Col>
                    <Col span="20" class="item-content">
                        {{desc.resourceCode}}
                    </Col>
                </Row>
                <!--下属活动室-->
                <div class="tips-panel clearfix">
                    <span class="fl title">展示信息</span>
                </div>
                <Row class="item mt20" v-if="desc.images">
                    <Col span="4" class="label-name">活动室图片</Col>
                    <Col span="22" class="item-content img-list">
                        <p class="img" v-for="(item,index) in desc.images.split(',')" :key="item">
                            <img :src="item" alt @click.stop="viewImage(desc.images.split(','), index)">
                        </p>
                    </Col>

                </Row>
                <Row class="item mt20" v-if="desc.audio">
                    <Col span="4" class="label-name">语音导览</Col>
                    <Col span="22" class="item-content img-list">
                        <uploadAudio :defaultAudio="desc.audio" :readonly="true"></uploadAudio>
                    </Col>
                </Row>
                <Row class="item mt20" v-if="desc.video">
                    <Col span="4" class="label-name">视频</Col>
                    <Col span="22" class="item-content img-list">
                        <p class="img daq-no-photo view-images-box" @click="openVideo">
                            <span class="cover"></span>
                            <img :src="desc.videoCover" alt v-if="desc.videoCover" class="daq-img">
                        </p>
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">720全景</Col>
                    <Col span="20" class="item-content">
                       <a :href="desc.panoramaUrl" target="_blank">{{desc.panoramaUrl}}</a>
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">活动概述</Col>
                    <Col span="20" class="item-content">
                        {{desc.summary}}
                    </Col>
                </Row>
            </Tab-pane>
            <!--场馆介绍-->
            <Tab-pane label="预约信息" key="key2" class="item">
                <Row class="item mt20">
                    <Col span="4" class="label-name">开放规则</Col>
                    <Col span="20" class="item-content">
                        <span v-if="ruleData.isOpen==0">不开放</span>
                        <span v-else>开放</span>
                    </Col>
                </Row>
                <Row class="item mt20" v-if="ruleData.isOpen==1">
                    <Col span="4" class="label-name">预约时间</Col>
                    <Col span="20" class="item-content">
                        <ul class="clearfix t-wrap">
                            <li class="fl item" v-for="(item,index) in ruleData.orderRuleData" :key="index">
                                <p class="title">{{item.name}}</p>
                                <p class="text-center item-time" v-for="(childItem,childIndex) in item.data"
                                   :key="childIndex">
                                    {{childItem.time[0]}}~{{childItem.time[1]}}
                                </p>
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Row class="item mt20" v-if="ruleData.isOpen==1">
                    <Col span="4" class="label-name">座位模板</Col>
                    <Col span="20" class="item-content">
                        {{ruleData.templateName}} <a href="javascript:;" class="theme-blue"
                                                     @click="checkTemplate">查看</a>
                    </Col>
                </Row>
            </Tab-pane>
        </Tabs>
        <!--审核记录-->
        <div class="tips-panel clearfix" v-if="recordsLog.length">
            <span class="fl title">审核记录</span>
        </div>
        <Timeline class="pd20">
            <Timeline-item v-for="(item,index) in recordsLog" :key="index">
                <p class="time">{{item.createTime}}</p>
                <p class="content">由【{{item.name}}】【{{item.phone}}】审核，审核结果：{{getStatusTitle(item.auditStatus)}}。<span
                        v-if="item.auditResult">审核备注：{{item.auditResult}}</span>
                </p>
            </Timeline-item>
        </Timeline>
        <Row class="item mg20" v-if="!isAudit">
            <Col span="24">
                <Button class="btn-cancel " type="primary" v-if="operates.includes('edit') && desc.status!=4" @click="goEdit">修改</Button>
                <Button class="submit ml20" @click="goBack">返回</Button>
            </Col>
        </Row>
        <!--座位模板弹窗-->
        <seatTemplate :show="templateShow" :data="templateData" :state="templateMethod"
                      @onClose="templateShow=false"></seatTemplate>
        <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
        <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import auditHead from "@views/pages/common/result-head.vue";
    import seatTemplate from "@components/seatTemplate/seatTemplate.vue";
    import VideoPlayer from "@components/video-play/video-play.vue";
    import {activityRoomView, getRuleDataInfo} from "@service/place";
    import {getTagsSelect,tagViewList} from '@service/common'
    import {AppModule} from "@store/modules/app";
    import uploadAudio from "@components/upload/upload-audio.vue";
    import {PreviewPics} from '@components/index';
    interface videoType {
        url: String;
        image: String;
        title: String;
    }
    @Component({
        components: {
            auditHead,
            seatTemplate,
            VideoPlayer,
            uploadAudio,
            PreviewPics
        }
    })
    export default class auditPerform extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }

        //是否从审核查看
        @Prop() private audit!: boolean;
        private isAudit: boolean = false;

        private themeList: any = ['画出', '演出', '艺术', '文物', '非遗', '公益', '科技', '体育', '亲子休闲'];
        private crowdList: any = ['老人', '小孩', '朋友', '商务'];
        /*S 获取详情*/
        private headData: object = {
            remark: '',//审核备注
            date: '',//审核日期
            status: -1//审核状态
        };
        //审核流程信息
        private recordsLog: Array<object> = [];
        private ruleData: any = {};
        //详情数据
        private desc: object = {};
        private templateMethod: any = '';

        //标签
        private tagList: object = {
            typeList: [],
            equipmentList: []
        };
        // 获取标签
        getTagList(ids:any,type: any) {
             tagViewList({
                ids:ids
            }).then((res:any)=>{
                (this.tagList as any)[type] = res.datas;
            })
        }

        //获取详情数据
        getActivityRoomDesc() {
            let _this = this;
            activityRoomView({
                id: _this.$route.query.id
            }).then((res: any) => {
                if(res.code===0) {
                    _this.desc = res.data.ctcActivityRoom;
                    let _data = res.data.ctcActivityRoom;
                    _this.showVideo.url = _data.video as string;
                    _this.showVideo.title = _data.name as string;
                    _this.showVideo.image = _data.videoCover as string;
                    //类型标签
                    if(res.data.ctcActivityRoom.type){
                        _this.getTagList(res.data.ctcActivityRoom.type,'typeList')
                    }
                    //设备标签
                    if(res.data.ctcActivityRoom.equipment){
                        _this.getTagList(res.data.ctcActivityRoom.equipment,'equipmentList')
                    }
                    //审核结果信息
                    _this.headData = {
                        remark: res.data.auditRecordsVo.currentAuditResult,
                        date: res.data.auditRecordsVo.dateTime,
                        status: res.data.auditRecordsVo.currentAuditStatus
                    };
                    //审核流程信息
                    _this.recordsLog = res.data.auditRecordsVo.recordsLog;
                }
            })
        }

        //获取活动室规则详情
        checkRuleInfo() {
            let _this = this;
            getRuleDataInfo({
                id: _this.$route.query.id
            }).then((res: any) => {
                if (res.code === 0) {
                    _this.ruleData = res.data
                }
            })
        }

        //获取审核状态中文结果
        getStatusTitle(status:any) {
            switch (status) {
                case 7: {
                    return "回退";
                }
                case 8: {
                    return "撤回";
                }
                case 9: {
                    return "终止";
                }
                case 6: {
                    return "审核通过";
                }
            }
        }

        /*E 获取详情*/

        /* S 查看大图 */
        private visible: Boolean = false;
        private imgUrl: Array<string> = [];
        private currIndex = 0
        private viewImage(url: Array<string>, idx: number) {
            this.imgUrl = url;
            this.visible = true;
            this.currIndex = idx
        }
        /* E 查看大图 */

        /*S 座位模板 */
        //座位模板弹窗是否显示
        private templateShow: boolean = false;
        //查看模板
        private templateData: any = {
            id: '',//模板id
            name: '',//模板名称
        };

        //查看模板
        checkTemplate() {
            let _this = this;
            _this.templateMethod = 'view';
            _this.templateShow = true;
            _this.templateData = {
                id: (_this.ruleData as any).templateId,
                name: (_this.ruleData as any).templateName
            };

        }

        /*E 座位模板 */

        //返回
        goBack() {
            this.$router.go(-1);
        }

        //编辑
        goEdit() {
            let _path='';
            if(this.$route.query.type==='list') {
                _path='room-add';
            }else{
                _path='audit-room-add';
            }
            this.$router.push({
                path: _path,
                query: {id: this.$route.query.id, venueId: this.$route.query.venueId, type: this.$route.query.type}
            })
        }
        /*S视频*/
        private show: Boolean = false;
        private showVideo: videoType = {
            url: "",
            image: "",
            title: ""
        };

        private openVideo() {
            this.show = true;
        }
        /*E视频*/
        mounted() {
            let _this = this;
            _this.getActivityRoomDesc();
            _this.checkRuleInfo();
            //是否从审核详情查看
            if (_this.audit) {
                _this.isAudit = true;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .tips-panel {
        margin-top: 30px;
        background-color: $grayLight;
        padding: 20px;
        .title {
            position: relative;
            padding-left: 10px;
            color: $font01;
            font-weight: 600;
            font-size: 16px;
            &:after {
                position: absolute;
                left: 0;
                top: 4px;
                content: '';
                width: 3px;
                height: 16px;
                border-radius: 1.5px;
                background-color: $theme;
            }
        }
        .tag-content {
            margin-left: 30px;
            color: $font02;
        }
    }

    .detail-wrap {
        .label-name {
            width: 100px;
            line-height: 25px;
            padding-right: 10px;
            vertical-align: middle;
            text-align: right;
            color: $font01;
            font-weight: 600;
        }
        .item-content {
            width: 80%;
            line-height: 25px;
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
        .map {
            height: 400px;
        }
        .cloud-img {
            &.activity-room {
                width: 200px;
                height: 150px;
                border-radius: 4px;
                overflow: hidden;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        .activity-room-name {
            font-size: 14px;
            color: $font01;
            margin-top: 12px;
        }

        .item-content {
            .button {
                & + .button {
                    margin-left: 15px;
                }
            }
        }
        .t-wrap {
            display: inline-block;
            border: 1px solid $borderLight;
            padding: 10px;
            .title {
                width: 100px;
                text-align: center;
            }
            .item-time {
                padding: 10px;
            }
        }
        .no {
            line-height: 24px;
        }
    }

    .w150 {
        width: 150px;
    }
</style>
