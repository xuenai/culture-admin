<template>
    <div class="list-panel">
        <Row class="item">
            <i-col span="2" class="item-name tit">基本信息</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动类型</i-col>
            <i-col span="22" class="item-content">{{ACTIVITY_TYPE[iData.type]}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动方式</i-col>
            <i-col span="22" class="item-content">{{ACTIVITY_METHOD[iData.method]}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">创建者</i-col>
            <i-col span="22" class="item-content">{{iData.createName}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动名称</i-col>
            <i-col span="22" class="item-content">{{iData.name}}</i-col>
        </Row>
        <Row class="item" v-if="iData.type === 'ACTIVITY_TYPE_ENROLL'">
            <i-col span="2" class="item-name">报名方式</i-col>
            <i-col span="22" class="item-content">{{['线下报名','线上报名'][iData.lineFlag]}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动分类</i-col>
            <i-col span="22" class="item-content">{{iData.activityClassifyName}}</i-col>
        </Row>
        <Row class="item" v-if="iData.voluntTeamName">
            <i-col span="2" class="item-name">所属志愿团</i-col>
            <i-col span="22" class="item-content">{{iData.voluntTeamName}}</i-col>
        </Row>
        <Row class="item" v-if="iData.activityName">
            <i-col span="2" class="item-name">所属场所</i-col>
            <i-col span="22" class="item-content">{{iData.activityName}}</i-col>
        </Row>
        <Row class="item" v-if="iData.associationName">
            <i-col span="2" class="item-name">所属社团</i-col>
            <i-col span="22" class="item-content">{{iData.associationName}}</i-col>
        </Row>
        <Row class="item" v-if="iData.labelNames && iData.labelNames.length > 0">
            <i-col span="2" class="item-name">{{iData.type === 'ACTIVITY_TYPE_VOLUNT' ? '服务类型':'活动标签'}}</i-col>
            <i-col span="22" class="item-content">
                <span class="choice-tag active" v-for="tag in iData.labelNames" :key="tag.id">{{tag.labelName}}</span>
            </i-col>
        </Row>
        <Row class="item" v-if="iData.signStartTime && iData.signEndTime">
            <i-col span="2" class="item-name">
                {{iData.type === 'ACTIVITY_TYPE_ENROLL'?'报名时间':'招募时间'}}
            </i-col>
            <i-col span="22" class="item-content">{{iData.signStartTime.slice(0,-3)}}-{{iData.signEndTime.slice(0,-3)}}</i-col>
        </Row>
        <Row class="item" v-if="iData.useStartTime && iData.useEndTime">
            <i-col span="2" class="item-name">活动时间</i-col>
            <i-col span="22" class="item-content">{{iData.useStartTime.slice(0,-3)}}-{{iData.useEndTime.slice(0,-3)}}</i-col>
        </Row>
        <Row class="item" v-if="iData.stock && iData.type === 'ACTIVITY_TYPE_VOLUNT'">
            <i-col span="2" class="item-name">招募人数</i-col>
            <i-col span="22" class="item-content">{{iData.stock}}</i-col>
        </Row>
        <Row class="item" v-if="iData.serviceTime">
            <i-col span="2" class="item-name">服务时长</i-col>
            <i-col span="22" class="item-content">{{iData.serviceTime}} 小时</i-col>
        </Row>
        <Row class="item" v-if="iData.phone && iData.type && iData.type !== 'ACTIVITY_TYPE_VOLUNT'">
            <i-col span="2" class="item-name">联系电话</i-col>
            <i-col span="22" class="item-content">{{iData.phone}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">
                活动地址
            </i-col>
            <i-col span="22" class="item-content">{{iData.address}}</i-col>
        </Row>
        <Row class="item" v-if="iData.longitude">
            <i-col span="2" class="item-name">
                活动位置
            </i-col>
            <i-col span="22" class="item-content">
                <descMap id="map" :longitude="iData.longitude" :latitude="iData.latitude"></descMap>
            </i-col>
        </Row>
        <Row class="item" v-if="/^\d$/.test(iData.cancelStatus)">
            <i-col span="2" class="item-name">取消设置</i-col>
            <i-col span="22" class="item-content">{{['不可取消','随时取消','活动开始24小时前可取消','活动开始' + iData.cancelTime + '小时前可取消'][iData.cancelStatus]}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">核销设置</i-col>
            <i-col span="22" class="item-content">
                {{iData.validStartValue ? ('预约开始时间前' + iData.validStartValue + (iData.validTimeStartType==='VALID_TIME_TYPE_HOURS'?'小时内':'分钟内')) : ''}}
                {{iData.validEndValue ? ('预约开始时间后' + iData.validEndValue + (iData.validTimeEndType==='VALID_TIME_TYPE_HOURS'?'小时内':'分钟内')) : ''}}
                {{(!iData.validStartValue && !iData.validEndValue) ? '活动时间范围内均':''}}
                可进行核销
            </i-col>
        </Row>
        <Row class="item" v-if="iData.faithUseStatus">
            <i-col span="2" class="item-name" style="color: #19BE6B;">诚信优享</i-col>
            <i-col span="22" class="item-content">{{iData.faithUseValue}}分</i-col>
        </Row>
        <Row class="item" v-if="iData.faithAuditStatus">
            <i-col span="2" class="item-name" style="color: #19BE6B;">诚信免审</i-col>
            <i-col span="22" class="item-content">{{iData.faithAuditValue}}分</i-col>
        </Row>
        <Row class="item" v-if="iData.sort">
            <i-col span="2" class="item-name">活动排序</i-col>
            <i-col span="22" class="item-content">{{iData.sort}}</i-col>
        </Row>
        <Row class="item" v-if="iData.remark && iData.type === 'ACTIVITY_TYPE_PLAIN'">
            <i-col span="2" class="item-name">备注说明</i-col>
            <i-col span="22" class="item-content">{{iData.remark}}</i-col>
        </Row>
        <!-- 活动设置 -->
        <div v-if="iData.type == 'ACTIVITY_TYPE_RESERVE' || iData.type == 'ACTIVITY_TYPE_ENROLL'">
            <Row class="item tit">
                <i-col span="2" class="item-name tit">活动设置</i-col>
            </Row>
            <!-- 预订 -->
            <div v-if="iData.type == 'ACTIVITY_TYPE_RESERVE'">
                <Row class="item">
                    <i-col span="2" class="item-name">活动库存</i-col>
                    <i-col span="22" class="item-content">{{iData.stock}}</i-col>
                </Row>
                <Row class="item">
                    <i-col span="2" class="item-name">限购数量</i-col>
                    <i-col span="22" class="item-content">{{iData.limitNum}}</i-col>
                </Row>
                <Row class="item" v-if="iData.integral">
                    <i-col span="2" class="item-name">所需积分</i-col>
                    <i-col span="22" class="item-content">{{iData.integral}}</i-col>
                </Row>
                <Row class="item" v-if="iData.remark">
                    <i-col span="2" class="item-name">备注说明</i-col>
                    <i-col span="22" class="item-content">{{iData.remark}}</i-col>
                </Row>
                <Row class="item" v-if="iData.seatName">
                    <i-col span="2" class="item-name">在线选座</i-col>
                    <i-col span="22" class="item-content">{{iData.roomName}}</i-col>
                </Row>
            </div>

            <!-- 报名 -->
            <div v-else-if="iData.type == 'ACTIVITY_TYPE_ENROLL'">
                <Row class="item">
                    <i-col span="2" class="item-name">招募人数</i-col>
                    <i-col span="22" class="item-content">{{iData.stock}}</i-col>
                </Row>
                <Row class="item" v-if="iData.remark">
                    <i-col span="2" class="item-name">备注说明</i-col>
                    <i-col span="22" class="item-content">{{iData.remark}}</i-col>
                </Row>
                <Row class="item" v-if="iData.seatName">
                    <i-col span="2" class="item-name">在线选座</i-col>
                    <i-col span="22" class="item-content">{{iData.roomName}}</i-col>
                </Row>
            </div>
        </div>

        <!-- 活动单位 -->
        <Row class="item tit">
            <i-col span="2" class="item-name tit">活动单位</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">主办单位</i-col>
            <i-col span="22" class="item-content">{{iData.sponsor}}</i-col>
        </Row>
        <Row class="item" v-if="iData.coOrganizer">
            <i-col span="2" class="item-name">协办单位</i-col>
            <i-col span="22" class="item-content">{{iData.coOrganizer}}</i-col>
        </Row>
        <Row class="item" v-if="iData.undertakeUnit">
            <i-col span="2" class="item-name">承办单位</i-col>
            <i-col span="22" class="item-content">{{iData.undertakeUnit}}</i-col>
        </Row>
        <Row class="item" v-if="iData.liableName">
            <i-col span="2" class="item-name">活动负责人</i-col>
            <i-col span="22" class="item-content">{{iData.liableName}}</i-col>
        </Row>
        <Row class="item" v-if="iData.phone && iData.type === 'ACTIVITY_TYPE_VOLUNT'">
            <i-col span="2" class="item-name">联系电话</i-col>
            <i-col span="22" class="item-content">{{iData.phone}}</i-col>
        </Row>
        <!-- 活动介绍 -->
        <Row class="item tit">
            <i-col span="2" class="item-name tit">活动介绍</i-col>
        </Row>
        <Row class="item" v-if="iData.images && iData.images.length > 0">
            <i-col span="2" class="item-name">活动主图</i-col>
            <i-col span="22" class="item-content img-list">
                <p class="img" v-for="(img,imgIndex) in iData.images.split(',')" :key="imgIndex">
                    <img @click="viewImgWin(iData.images.split(','), imgIndex)" :src="img" alt>
                </p>
            </i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动介绍</i-col>
            <i-col span="22" class="item-content" v-html="iData.introduce"></i-col>
        </Row>
        <Row class="item" v-if="iData.hint">
            <i-col span="2" class="item-name">温馨提示</i-col>
            <i-col span="22" class="item-content" v-html="iData.hint"></i-col>
        </Row>
        <PreviewPics v-model="imgView" :imgs="imgUrl" :currIndex="currIndex" ></PreviewPics>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {getTagDetail} from "@service/tool";
    import {getParentsRegion} from "@util/comm";
    import descMap from "@components/map/desc-map.vue";
    import {PreviewPics} from '@components/index'
    import {ACTIVITY_METHOD, ACTIVITY_TYPE} from "@constant/index"
    @Component({
        components: {PreviewPics,descMap}
    })
    export default class ContentDetail extends Vue {
        @Prop() private data!: any;

        private ACTIVITY_METHOD = ACTIVITY_METHOD;
        private ACTIVITY_TYPE = ACTIVITY_TYPE;
        // 本页需要展示的数据集
        private iData: { [propName: string]: any } = {
            labelNames:[]
        };
        // 图片可显示
        private imgView:boolean = false;
        // 图
        private imgUrl: Array<string> = [];
        private currIndex = 0;

        @Watch("data", {immediate: true, deep: true})
        refreshData(data: any) {
            this.renderContent()
        }
        update(){
            this.renderContent()
        }

        // 回显数据
        private renderContent () {
            Object.assign(this.iData, this.data);
            if (this.iData && this.iData.region) {
                this.iData.address = getParentsRegion(this.iData.region).map((region:any) => region.baiduName).reverse().join('-') + '-' + this.iData.address
            }
            if (this.iData && this.iData.tag) {
                let allPromise = this.iData.tag.split(',').map((id: any) => this.getTagDetail(Number(id)))
                Promise.all(allPromise).then((res: Array<any>) => {
                    this.iData.labelNames = res.filter((label: any) => !!label)
                })
            }
        }

        // 预览图片
        private viewImgWin (src: Array<string> , idx: number) {
            this.imgUrl = src;
            this.imgView = true;
            this.currIndex = idx
        }

        // 获取标签详情
        private getTagDetail(id: number) {
            return new Promise((resolve, reject) => {
                getTagDetail({id}).then((res: any) => {
                    if (res.code === 0 && res.data) {
                        resolve(res.data)
                    } else {
                        resolve('')
                    }
                }).catch(e => resolve(''))
            })
        }
    }
</script>

<style scoped lang="scss">
    .list-panel {
        margin-top: 10px;
        .item {
            padding: 10px 0;
            line-height: 25px;
            &.tit {
                border-top: 1px solid $borderLight;
            }
        }
        .red {
            vertical-align: middle;
        }
        .item-name {
            width: 150px;
            text-align: right;
            margin-right: 13px;
            font-weight: 600;
            color: $font01;
            &.tit {
                font-size: 1.2em;
            }
        }
        .item-content {
            width: 80%;
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
    }
</style>