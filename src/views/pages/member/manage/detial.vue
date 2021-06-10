<!--
 * @Description: 会员管理 - 详情
 * @Author: sunxq
 * @Date: 2019-07-15 20:28:25
 * @lastTime: 2019-08-13 17:10:44
 -->
<template>
    <div class="detial">
        <div class="d01" :data="params01">
            <h1>
                <span></span>基本信息
            </h1>
            <div class="headerImg">
                <label>头像</label>
                <div class="imgDiv" :class="{volunteer: volunteerInfo }">
                    <img :src='params01.headUrl' v-if="params01.headUrl">
                    <img v-else src="@assets/image/site-default.png" alt="">
                </div>
            </div>
            <div class="infos">
                <div class="itemInfo w460">
                    <label>手机号</label>
                    <span>{{params01.phone||'-'}}</span>
                </div>
                <div class="itemInfo w460">
                    <label>真实姓名</label>
                    <span>{{params01.name||'-'}}</span>
                </div>
                <div class="itemInfo w460">
                    <label>生日</label>
                    <span>{{params01.birthday||'-'}}</span>
                </div>
                <div class="itemInfo w460">
                    <label>昵称</label>
                    <span>{{params01.nickName||'-'}}</span>
                </div>
                <div class="itemInfo w460">
                    <label class="fl">实名认证</label>
                    <div v-if="params01.certType" class="fl clearfix card-box">
                        <p class="sucess fl"><i class="cloud-icon">&#xe61e;</i>已认证</p>
                        <div class="fl" style="width: 60px">{{params01.certType}}</div>
                        <div class="fl">{{params01.certNumber}}</div>
                    </div>
                    <div v-else class="fl clearfix card-box">
                        <p class="error fl"><i class="cloud-icon">&#xe79f;</i>未认证</p>
                    </div>
                </div>
                <div class="itemInfo w460">
                    <label>性别</label>
                    <span>{{params01.sex||'-'}}</span>
                </div>
                <div class="itemInfo w460">
                    <label>民族</label>
                    <span>{{params01.nationality||'-'}}</span>
                </div>
                <div class="itemInfo w460">
                    <label>年龄</label>
                    <span>{{params01.birthday ? (new Date().getFullYear() - Number(params01.birthday.split('-')[0])) : '-'}}</span>
                </div>
                <div class="itemInfo w460">
                    <label class="fl">所在城市</label>
                    <div class="fl">
                        <distPicker v-if="params01.placeLocation" :default="params01.placeLocation"
                                    disabled></distPicker>
                        <span v-else>-</span>
                    </div>
                </div>
                <div class="itemInfo w460">
                    <label class="fl">常出发城市</label>
                    <div class="fl">
                        <distPicker v-if="params01.placeStart" :default="params01.placeStart" disabled></distPicker>
                        <span v-else>-</span>
                    </div>
                </div>
                <div class="itemInfo w460">
                    <label>详细地址</label>
                    <span>{{params01.address||'-'}}</span>
                </div>
            </div>
        </div>
        <div class="d02">
            <h1><span></span>收货人信息</h1>
            <!--<baseTable @getList="getUserReceiveList">-->
            <Table border :columns="data.header2" :data="data.list01" class="table"></Table>
            <!--</baseTable>-->
        </div>
        <div class="d03">
            <h1>
                <span></span>常用联系人信息
            </h1>
            <!--<baseTable @getList="getUserContactsList" class="table">-->
            <Table border :columns="data.header3" :data="data.list02" class="table">
                <template slot-scope="{ row }" slot="certType">
                    <p>{{row.certType}}</p>
                </template>
                <template slot-scope="{ row }" slot="certNumber">
                    <p>{{row.certNumber || '-'}}</p>
                </template>
            </Table>
            <!--</baseTable>-->
        </div>
        <div class="d04" v-if="false">
            <h1>
                <span></span>积分信息
            </h1>
            <div class="leveDiv">
                <div class="leve">
                    <h3>{{point.level || '-'}}</h3>
                    <p>会员等级</p>
                </div>
                <div class="integral">
                    <h3>{{point.point || '0'}}</h3>
                    <p>可用积分</p>
                </div>
            </div>
        </div>
        <div class="d04" v-if="volunteerInfo">
            <h1><span></span>志愿者信息</h1>
            <Row>
                <i-col span="4">
                    <div class="header" :class="{'no-photo': !volunteerInfo.head}">
                        <img v-if="volunteerInfo.head" :src="volunteerInfo.head" alt="" class="cloud-img"/>
                        <i v-else class="cloud-icon">&#xe6ee;</i>
                    </div>
                </i-col>
                <i-col span="20">
                    <ul class="message-list clearfix">
                        <li class="item mt20">
                            <i-col span="6" class="left">加入时间：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.createTime || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">所属团队：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.teamName || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">政治面貌：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.politicalAppearance || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">最高学历：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.education || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">从业状况：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.employmentStatus || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">单位名称：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.company || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">服务地区：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.serviceRegion || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">服务类别：</i-col>
                            <i-col span="18" class="right">{{volunteerInfo.serviceType || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">服务时长：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.serviceTime || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">星级：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.level || "-" }}</i-col>
                        </li>
                        <li class="item mt20" style="margin-right: 100%;">
                            <i-col span="6" class="left">服务次数：</i-col>
                            <i-col span="18" class="right">{{ volunteerInfo.serviceNum || "-" }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">身份证正面照：</i-col>
                            <i-col span="18" class="right"><img
                                    :src="volunteerInfo.idCardUp"
                                    alt=""
                                    class="card"
                                    v-if="volunteerInfo.idCardUp"
                                    @click.stop="previewPic(0)"
                            /><span v-if="!volunteerInfo.idCardUp">-</span></i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">身份证反面照：</i-col>
                            <i-col span="18" class="right">
                                <img
                                        :src="volunteerInfo.idCardDown"
                                        alt=""
                                        class="card"
                                        v-if="volunteerInfo.idCardDown"
                                        @click.stop="previewPic(1)"
                                /><span v-if="!volunteerInfo.idCardDown">-</span>
                            </i-col>
                        </li>
                        <li class="item mt20 last">
                            <i-col span="3" class="left">个人简介：</i-col>
                            <i-col span="21" class="right">
                                <Input
                                        class="intro"
                                        type="textarea"
                                        :autosize="{ minRows: 5, maxRows: 5 }"
                                        :placeholder="volunteerInfo.resume || '-'"
                                        readonly
                                />
                            </i-col>
                        </li>
                    </ul>
                </i-col>
            </Row>
        </div>
        <div class="d04" v-if="heritagePeopleInfo">
            <h1><span></span>代表性传承人信息</h1>
            <Row>
                <i-col span="4"></i-col>
                <i-col span="20">
                    <ul class="message-list clearfix">
                        <li class="item mt20">
                            <i-col span="6" class="left">传承项目：</i-col>
                            <i-col span="18" class="right">{{ `${heritagePeopleInfo.name}(${heritagePeopleInfo.type}|${heritagePeopleInfo.level}|${heritagePeopleInfo.batch})` }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">申报地区：</i-col>
                            <i-col span="18" class="right">{{ heritagePeopleInfo.reportRegion }}</i-col>
                        </li>
                        <li class="item mt20">
                            <i-col span="6" class="left">申报单位：</i-col>
                            <i-col span="18" class="right">{{ heritagePeopleInfo.reportCompany }}</i-col>
                        </li>
                        <li class="item mt20 last" v-if="heritagePeopleInfo.introduce">
                            <i-col span="3" class="left">传承人简介：</i-col>
                            <i-col span="21" class="right" v-html="heritagePeopleInfo.introduce"></i-col>
                        </li>
                    </ul>
                </i-col>
            </Row>
        </div>
        <div class="d04" v-if="associationInfos && associationInfos.length">
            <h1><span></span>关注的社团信息</h1>
            <ul class="team-in">
                <router-link :key="item.associationId" v-for="item in associationInfos" tag="li"
                             :to="{path:'/community-detail',query:{id:item.associationId}}">
                    {{item.associationName || '未知社团'}}（{{item.joinTime}}）
                </router-link>
            </ul>
        </div>
        <div class="d04" v-if="dishonestyShow && creditStatus===1">
            <h1><span></span>失约记录</h1>
            <DishonestyList v-if="params01.phone" :params="{phone: params01.phone}" @getList="list => dishonestyShow = !!list.length"></DishonestyList>
        </div>
        <PreviewPics
                v-model="previewPicShow"
                :imgs="imageUrls"
                :currIndex="previewPicIndex"
        />
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from "vue-property-decorator";
    import {getCityRegion} from "@service/common";
    import distPicker from "@components/distPicker/distPicker.vue";
    import DishonestyList from "@components/dishonesty-list/list.vue"
    //import baseTable from "@components/baseTable/baseTable.vue";
    import {PreviewPics} from "@components/index";
    import { AppModule } from "@store/modules/app";
    import {
        consumUserDetail,
        consumUserReceiveInfo,
        consumUserContactsInfo,
        consumUserPointInfo
    } from '@service/member';

    @Component({
        components: {
            distPicker,
            PreviewPics,
            DishonestyList
        }
    })
    export default class VipDetail extends Vue {
        get creditStatus() {
            return AppModule.siteInfo.creditStatus;
        }
        private dishonestyShow:boolean=true;
        /** 图片浏览 S */
        private previewPicShow = false;
        private imageUrls: Array<string> = [];
        private previewPicIndex: Number = 0;

        previewPic(index: Number) {
            this.previewPicIndex = index;
            this.previewPicShow = true;
        }

        // 证件类型
        private getCertificateTxt(certificate: string) {
            switch (certificate) {
                case '12': {
                    return "身份证";
                }
                default: {
                    return "未知";
                }
            }
        }

        private data: any = {
            header2: [
                {
                    title: "姓名",
                    key: "consignee",
                    align: 'center'
                },
                {
                    title: "手机号",
                    key: "phone",
                    align: 'center'
                },
                {
                    title: "住址",
                    key: "address",
                    width: '550'
                }
            ],
            header3: [
                {
                    title: "姓名",
                    key: "name",
                    align: 'center'
                },
                {
                    title: "手机号",
                    key: "phone",
                    align: 'center'
                },
                {
                    title: "证件类型",
                    key: "certType",
                    align: 'center',
                    slot: 'certType'
                },
                {
                    title: "证件号码",
                    key: "certNumber",
                    align: 'center',
                    slot: 'certNumber'
                }
            ],
            list01: [],
            list02: [],
        }

        mounted() {
            this.getInfo(); // 基本信息
            this.getUserReceiveList(); // 收货人信息
            this.getUserContactsList(); // 常用联系人信息
            this.getUserPointInfo(); // 积分信息
        }

        /* S 获取基本信息 */
        //地区编码
        private placeLocation: string = ''; // 所在城市
        private placeStart: string = ""; // 常用出发地
        private params01: any = []; // 基本信息
        private volunteerInfo: { [prop: string]: any } | string = ''; // 志愿者信息
        private associationInfos: Array<{ associationId: number, associationName: string, joinTime: string }> = []; // 关注社团信息
        private heritagePeopleInfo: any = null // 传承人信息
        private getInfo() {
            consumUserDetail({
                id: this.$route.query.id
            }).then(data => {
                if (data.code === 0) {
                    if (data.data.birthday && data.data) {
                        data.data.birthday = data.data.birthday.substr(0, 10);
                        this.placeLocation = data.data.placeLocation;
                        this.placeStart = data.data.placeStart;
                    }
                    this.params01 = data.data;
                    this.volunteerInfo = data.data.volunteerInfo as { [prop: string]: any };
                    if (this.volunteerInfo) {
                        this.imageUrls.push(this.volunteerInfo.idCardUp as string);
                        this.imageUrls.push(this.volunteerInfo.idCardDown as string);
                    }
                    this.associationInfos = data.data.associationInfos as Array<{ associationId: number, associationName: string, joinTime: string }>;
                    this.heritagePeopleInfo = data.data.heritagePeopleInfo as any
                }
            });
        }

        /* S 获取基本信息 */

        /* S 收货人信息 */
        private getUserReceiveList() {
            consumUserReceiveInfo({
                userId: this.$route.query.id
            }).then((res: any) => {
                if (res.code === 0) {
                    this.data.list01 = res.datas;
                }
            });
        }

        /* E 收货人信息 */

        /* S 常用联系人信息 */
        private getUserContactsList() {
            consumUserContactsInfo({
                userId: this.$route.query.id
            }).then((res: any) => {
                if (res.code === 0) {
                    this.data.list02 = res.datas
                }
            });
        }

        /* E 常用联系人信息 */
        /* S 积分信息 */
        private point: any = {
            point: '', // 积分
            level: '' // 等级
        }

        private getUserPointInfo() {
            consumUserPointInfo({
                id: this.$route.query.id
            }).then((res: any) => {
                if (res.code === 0) {
                    this.point = res.data
                }
            });
        }

        /* E 积分信息 */
    }
</script>

<style lang='scss' scoped>
    .detial {
        padding: 0 15px 15px;
        color: $font01;
        h1 {
            height: 56px;
            border-bottom: 1px solid $borderLight;
            line-height: 56px;
            font-size: 16px;
            span {
                display: inline-block;
                width: 3px;
                height: 16px;
                border-radius: 1px;
                background-color: $theme;
                margin-right: 10px;
                position: relative;
                top: 3px;
            }
        }
        > div {
            margin-top: 20px;
            font-size: 12px;
            .table {
                margin-top: 25px;
            }
        }
        .d01 {
            margin-top: 0;
            label {
                display: inline-block;
                width: 60px;
                text-align: right;
                margin-right: 10px;
            }
            .headerImg {
                height: 120px;
                line-height: 120px;
                display: flex;
                align-items: center;
            }
            .imgDiv {
                position:relative;
                display: inline-block;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                /*overflow: hidden;*/
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
                &.volunteer:after {
                    content: '';
                    position: absolute;
                    right: -10px;
                    width: 25px;
                    height: 25px;
                    background: url("../../../../assets/image/volunteer-log.png") no-repeat center/contain;
                }
            }
            .infos {
                width: 90%;
                display: inline-block;
                .w460 {
                    width: 460px;
                }
                .itemInfo {
                    float: left;
                    height: 50px;
                    line-height: 50px;
                    // display: inline-block;
                    // width: calc(100% / 2 - 1px);
                    .card-box {
                        width: 300px;
                        margin-top: 10px;
                        div {
                            display: inline-block;
                            height: 28px;
                            line-height: 28px;
                            padding: 0 10px;
                            margin: 0 5px 0 0;
                            border-radius: 3px;
                            border: 1px solid $borderLight;
                            color: #ccc;
                            background-color: #f3f3f3;
                        }
                    }
                    span {
                        display: inline-block;
                        width: calc(100% - 100px);
                        max-width: 250px;
                        min-width: 200px;
                        height: 28px;
                        line-height: 28px;
                        padding: 0 10px;
                        border-radius: 3px;
                        border: 1px solid $borderLight;
                        color: #ccc;
                        background-color: #f3f3f3;
                    }
                    p {
                        display: inline-block;
                        width: 74px;
                        height: 28px;
                        line-height: 28px;
                        text-align: center;
                        margin-right: 5px;
                        border-radius: 3px;
                        i {
                            margin-right: 5px;
                        }
                        &.sucess {
                            border: 1px solid $theColor5;
                            color: $success;
                        }
                        &.error {
                            border: 1px solid $danger;
                            color: $danger;
                        }
                    }
                }
            }
        }
        .d04 .leveDiv {
            height: 105px;
            display: flex;
            justify-content: center;
            align-items: center;
            .leve {
                border-right: 1px solid $borderLight;
            }
            > div {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                h3 {
                    color: $theme;
                    font-size: 22px;
                }
                p {
                    color: $font04;
                    font-size: 14px;
                }
            }
        }
        .region {
            margin: 10px 0;
            p {
                display: inline-block;
                max-width: 250px;
                min-width: 200px;
                height: 28px;
                line-height: 28px;
                padding: 0 10px;
                border-radius: 3px;
                border: 1px solid #dee3ed;
                color: #ccc;
                background-color: #f3f3f3;
                margin-top: 10px;
            }
        }
    }

    .message-list {
        .item {
            width: 50%;
            float: left;
            &.last {
                width: 100%;
            }
        }
        .intro {
            max-width: 80%;
        }
        .left {
            text-align: right;
            font-weight: 600;
            color: #263b4d;
        }
        .right {
            padding: 0 10px;
            color: #6b7f8f;
            .card {
                width: 240px;
                height: 160px;
                cursor: pointer;
                border-radius: 4px;
            }
        }
    }

    .header {
        width: 100px;
        height: 100px;
        margin: 20px auto 0;
        overflow: hidden;
        border-radius: 50%;
        line-height: 100px;
        text-align: center;
        &.no-photo {
            border: 1px solid #eee;
            box-shadow: 0 0 10px #eee;
        }
        .cloud-icon {
            font-size: 60px;
        }
    }

    .team-in {
        text-indent: 14px;
        color: #35b2f0;
        font-size: 14px;
        cursor: pointer;
        li:hover {
            color: #5dc2f5;
        }
    }

    .integrity-panel {
        .item {
            display: inline-block;
            & + .item {
                margin-left: 15px;
            }
        }
        .red {
            color: $theColor1;
        }
    }

    .timeLine {
        padding: 20px 20px 0;
    }
</style>
