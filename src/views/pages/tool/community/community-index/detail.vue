<template>
    <div class="perform-wrap detail-wrap pd20">
        <!--tab切换-->
        <Tabs active-key="key2" class="tab-wrap" :animated="false">
            <!--基础资料-->
            <Tab-pane label="基本资料" key="key1">
                <Row class="item mt20">
                    <Col span="4" class="label-name">社团名称</Col>
                    <Col span="20" class="item-content">
                        {{desc.name}}
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">社团类型</Col>
                    <Col span="20" class="item-content">
                        {{desc.typeName||'暂无'}}
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">社团位置</Col>
                    <Col span="20" class="item-content">
                        {{desc.region}} {{desc.address}}
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">成立时间</Col>
                    <Col span="20" class="item-content">
                        {{desc.startTime||'-'}}
                    </Col>
                </Row>
                <Row class="item mt20">
                    <Col span="4" class="label-name">社团星级</Col>
                    <Col span="20" class="item-content">
                        {{desc.level}}
                    </Col>
                </Row>
                <Row class=" item mt20">
                    <Col span="4" class="label-name">联系电话</Col>
                    <Col span="20" class="item-content">
                        {{desc.phone}}
                    </Col>
                </Row>
                <Row class=" item mt20" v-if="desc.dutyPerson && desc.dutyPersonPhone">
                    <Col span="4" class="label-name">负责人</Col>
                    <Col span="20" class="item-content">
                        {{desc.dutyPerson}}({{desc.dutyPersonPhone}})
                    </Col>
                </Row>
                <Row class=" item mt20">
                    <Col span="4" class="label-name">社团人数</Col>
                    <Col span="20" class="item-content">
                        {{desc.personNum}}
                    </Col>
                </Row>
                <Row class=" item mt20">
                    <Col span="4" class="label-name">粉丝数</Col>
                    <Col span="20" class="item-content">
                        {{desc.fansNum}}
                    </Col>
                </Row>
                <Row class=" item mt20">
                    <Col span="4" class="label-name">主管单位</Col>
                    <Col span="20" class="item-content">
                        {{desc.manageUnit}}
                    </Col>
                </Row>
                <Row class="item mt20" v-if="desc.longitude && desc.latitude">
                    <Col span="4" class="label-name">社团位置</Col>
                    <Col span="20" class="map">
                        <descMap id="map" :longitude="desc.longitude" :latitude="desc.latitude"></descMap>
                    </Col>
                </Row>

                <!--下属活动室-->
                <div class="tips-panel clearfix" v-if="personList.length">
                    <span class="fl title">社团成员</span>
                </div>
                <ul class="item mt20" v-if="personList.length">
                    <router-link tag="li" class="items"  :to="{path:'/community-member-detail',query:{id:item.id,communityId:desc.id}}" v-for="item in personList" :key="item.id">
                        <a class="cloud-img activity-room daq-no-photo">
                            <img :src="item.image" />
                        </a>
                        <a class="activity-room-name">{{item.name}}</a>
                    </router-link>
                </ul>
            </Tab-pane>
            <!--社团介绍-->
            <Tab-pane label="社团介绍" key="key2" class="item">
                <Row class=" item mt20" v-if="desc.associaIcon">
                    <Col span="4" class="label-name">社团标志</Col>
                    <Col span="22" class="item-content img-list">
                        <p class="img" v-for="(item,index) in desc.associaIcon.split(',')" :key="index">
                            <img :src="item" alt @click.stop="viewImage(desc.associaIcon.split(','), index)">
                        </p>
                    </Col>
                </Row>
                <Row class=" item mt20" v-if="desc.associaImage">
                    <Col span="4" class="label-name">社团照片</Col>
                    <Col span="22" class="item-content img-list">
                        <p class="img" v-for="(item,index) in desc.associaImage.split(',')" :key="index">
                            <img :src="item" alt @click.stop="viewImage(desc.associaImage.split(','), index)">
                        </p>
                    </Col>
                </Row>
                <Row class=" item mt20" v-if="desc.associaAudio">
                    <Col span="4" class="label-name">语音介绍</Col>
                    <Col span="22" class="item-content img-list">
                        <uploadAudio :defaultAudio="desc.associaAudio" :readonly="true"></uploadAudio>
                    </Col>
                </Row>
                <Row class=" item mt20" v-if="desc.associaVideo">
                    <Col span="4" class="label-name">视频</Col>
                    <Col span="22" class="item-content img-list">
                        <p class="img daq-no-photo view-images-box" @click="openVideo">
                            <span class="cover"></span>
                            <img :src="desc.videoCover" alt v-if="desc.videoCover" class="daq-img">
                        </p>
                    </Col>
                </Row>
                <Row class=" item mt20">
                    <Col span="4" class="label-name">社团概述</Col>
                    <Col span="20" class="item-content">
                        {{desc.associaSummary||'暂无'}}
                    </Col>
                </Row>
                <Row class=" item mt20">
                    <Col span="4" class="label-name">社团介绍</Col>
                    <Col span="20" class="item-content" v-html="desc.associaIntroduce||'暂无'">
                    </Col>
                </Row>
            </Tab-pane>
        </Tabs>
        <Row class="item mg20 submit-panel" v-if="!isAudit">
            <Col span="24">
                <Button type="primary" class="btn-cancel " v-if="operates.includes('edit') && desc.status!=1" @click="goEdit">修改</Button>
                <Button class="submit ml20" @click="goBack">返回</Button>
            </Col>
        </Row>
        <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
        <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import descMap from "@components/map/desc-map.vue";
    import VideoPlayer from "@components/video-play/video-play.vue";
    import uploadAudio from "@components/upload/upload-audio.vue";
    import {associationView} from "@service/tool";
    import {dictType} from "@service/common";
    import {AppModule} from "@store/modules/app";
    import {PreviewPics} from '@components/index';
    interface videoType {
        url: String;
        image: String;
        title: String;
    }

    @Component({
        components: {
            descMap,
            VideoPlayer,
            uploadAudio,
            PreviewPics
        }
    })
    export default class detail extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }

        //是否从审核查看
        @Prop() private audit!: boolean;
        private isAudit: boolean = false;

        /*S 获取详情*/
        private desc: object = {};

        //获取接口数据
        private personList:Array<any>=[];
        getData() {
            let _this = this;
            associationView({
                id: _this.$route.query.id
            }).then((res: any) => {
                if(res.code===0) {
                    _this.desc = res.data.association;
                    _this.personList=res.data.associationPerson;
                    let _data = res.data.association;
                    _this.showVideo.url = _data.associaVideo as string;
                    _this.showVideo.title = _data.name as string;
                    _this.showVideo.image = _data.videoCover as string;
                    let audios=JSON.parse((_this.desc as any).associaAudio);
                    let associaAudio=[];
                    if(audios.length>1) {
                        audios.forEach((item: any) => {
                            associaAudio.push(item.url);
                        });
                    }else{
                        associaAudio.push(audios[0].url);
                    }
                    (this.desc as any).associaAudio=associaAudio.join(',');
                }
            })
        }
        /*E 获取详情*/

        //返回
        goBack() {
            this.$router.go(-1);
        }

        //去修改
        goEdit() {
            this.$router.push({path: '/community-add', query: {id: this.$route.query.id,type:this.$route.query.type}});
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

        mounted() {
            let _this = this;
            _this.getData();
            //是否从审核详情查看
            if (_this.audit) {
                _this.isAudit = true;
            }
        }
    }
</script>
<style lang="scss" scoped>
.mt20{
    margin-top: 10px;
}
.detail-wrap {
    padding: 10px 15px 0;
    .label-name {
        width: 100px;
        line-height: 25px;
        padding-right: 10px;
        vertical-align: middle;
        text-align: right;
        color: $font01;
        font-weight: 600;
    }
    .no {
        display: inline-block;
        line-height: 25px;
    }
    .item-content {
        width: 65%;
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
        height: 450px;
    }
    .items {
        display: inline-block;
        vertical-align: top;
        margin-right: 20px;
        cursor: pointer;
        &:last-child {
            margin-right: 0;
        }
    }
    .cloud-img {
        display: block;
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
        display: block;
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
            line-height: 24px;
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
    .submit-panel {
        margin-top: 40px;
    }
    .t-wrap {
        display: inline-block;
        width: 100%;
        .title {
            width: 100%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid $borderLight;
            background-color: #f2f4f7;
        }
        .item-time {
            width: 100%;
            padding: 10px;
            border: 1px solid $borderLight;
            margin-top: -1px;
            word-wrap:break-word
        }
        .item{
            width: 14%;
            & + .item{
                margin-left: -1px;
            }
        }

    }
    .timeLine {
        padding: 20px 20px 0;
    }
}
</style>
