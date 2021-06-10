<template>
    <div class="detail-wrap pd20">
        <!--审核结果-->
        <auditHead :data="headData" v-if="headData.status"></auditHead>
        <Head class="mt20"></Head>
        <div class="enter-container">
            <Row class="item mt20">
                <Col span="4" class="label-name">房型名称</Col>
                <Col span="20" class="item-content">
                    {{desc.name}}
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">房间面积</Col>
                <Col span="20" class="btn-list">
                   {{desc.roomArea}}
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">房型</Col>
                <Col span="20" class="item-content">
                    {{desc.bedType}}
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">床</Col>
                <Col span="20" class="item-content">
                    {{desc.bedLength}}x{{desc.bedWidth}}(长x宽)/米
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">可住人数（人）</Col>
                <Col span="20" class="item-content">
                    {{desc.num}}人
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">是否有窗</Col>
                <Col span="20" class="item-content">
                    {{desc.isWindows}}
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">早餐</Col>
                <Col span="20" class="item-content">
                    {{desc.breakfast}}
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">服务及其他</Col>
                <Col span="20" class="item-content">
                    {{desc.serviceInfo}}
                </Col>
            </Row>
            <Row class=" item mt20" v-if="desc.roomImages">
                <Col span="4" class="label-name">房型照片</Col>
                <Col span="22" class="item-content img-list">
                    <p class="img"  v-for="(item,index) in desc.roomImages.split(',')" :key="item">
                        <img :src="item" alt @click.stop="viewImage(desc.roomImages.split(','), index)">
                    </p>
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">资源互通编码</Col>
                <Col span="20" class="item-content">
                    {{desc.resourceCode}}
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">费用包含</Col>
                <Col span="20" class="item-content">
                    {{desc.costIncludes }}
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">720全景</Col>
                <Col span="20" class="item-content">
                    <a :href="desc.panoramaUrl" target="_blank">{{desc.panoramaUrl}}</a>
                </Col>
            </Row>
            <Row class="item mt20">
                <Col span="4" class="label-name">房型特色</Col>
                <Col span="20" class="item-content">
                   {{desc.roomFeature}}
                </Col>
            </Row>
            <Row class=" item mt20" v-if="desc.video">
                <Col span="4" class="label-name">房型视频</Col>
                <Col span="22" class="item-content img-list" >
                    <p class="img daq-no-photo view-images-box" @click="openVideo">
                        <span class="cover"></span>
                        <img :src="desc.videoCover" alt v-if="desc.videoCover" class="daq-img">
                    </p>
                </Col>
            </Row>
        </div>
        <!--审核记录-->
        <div class="tips-panel clearfix" v-if="recordsLog.length">
            <span class="fl title">审核记录</span>
        </div>
        <Timeline class="pd20">
            <Timeline-item v-for="(item,index) in recordsLog" :key="index">
                <p class="time">{{item.createTime}}</p>
                <p class="content">由【{{item.name}}】【{{item.phone}}】审核，审核结果：{{getStatusTitle(item.auditStatus)}}。<span v-if="item.auditResult">审核备注：{{item.auditResult}}</span>
                </p>
            </Timeline-item>
        </Timeline>
        <Row class="item mg20" v-if="!isAudit">
            <Col span="24">
                <Button type="primary" class="btn-cancel" v-if="operates.includes('edit')&& desc.status==!4" @click="goEdit">修改</Button>
                <Button class="submit ml20" @click="goBack">返回</Button>
            </Col>
        </Row>
        <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
        <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
    </div>
</template>

<script lang="ts">
    import {Component, Vue,Prop} from "vue-property-decorator";
    import auditHead from "@views/pages/common/result-head.vue";
    import Head from "./head.vue";
    import VideoPlayer from "@components/video-play/video-play.vue";
    import {getHotelRoomView} from '@service/place';
    import {PreviewPics} from '@components/index';
    import { AppModule } from "@store/modules/app";
    interface videoType {
        url: String;
        image: String;
        title: String;
    }
    @Component({
        components: {
            auditHead,
            Head,
            VideoPlayer,
            PreviewPics
        }
    })
    export default class detail extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        //是否从审核查看
        @Prop() private audit!:boolean;
        private isAudit:boolean=false;
        /*S 获取详情*/
        private headData: object = {
            remark: '',//审核备注
            date: '',//审核日期
            status: -1//审核状态
        };
        //审核流程信息
        private recordsLog: Array<object> = [];
        private desc:object={};

        //详情
        getHotelRoomDesc(id:any){
            let _this=this;
            getHotelRoomView({roomId:id}).then((res:any)=>{
                if(res.code===0) {
                    _this.desc = res.data.ctcHotelRoom;
                    let _data = res.data.ctcHotelRoom;
                    this.showVideo.url = _data.video as string;
                    this.showVideo.title = _data.name as string;
                    this.showVideo.image = _data.videoCover as string;
                    //审核结果信息
                    _this.headData = {
                        remark: res.data.auditRecordsVo.currentAuditResult,
                        date: res.data.auditRecordsVo.dateTime,
                        status: res.data.auditRecordsVo.currentAuditStatus
                    };
                    //审核流程信息
                    _this.recordsLog = res.data.auditRecordsVo.recordsLog
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

        //返回
        goBack(){
            this.$router.go(-1);
        }
        //编辑
        goEdit(){
            this.$router.push({path:'/guestroom-edit',query:{id:this.$route.query.id,type:this.$route.query.type}});
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
        mounted(){
            let _this=this;
            //是否从审核详情查看
            if(_this.audit){
                _this.isAudit=true;
            }
            //编辑
            if(_this.$route.query.id){
                _this.getHotelRoomDesc(this.$route.query.id);
            }
        }
    }
</script>
<style scoped lang="scss">
    .container {
        padding: 10px 15px;
    }
</style>
<style lang="scss">
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
           height: 430px;
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

       .item-content {
           .button {
               & + .button {
                   margin-left: 15px;
               }
           }
       }
       .w150 {
           width: 150px;
       }
   }
</style>
