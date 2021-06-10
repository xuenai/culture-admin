<template>
    <div style="padding-bottom: 50px">
        <!-- 步骤 -->
        <div class="step">
            <div class="details-left ivu-col ivu-col-span-5">
                <p>订单编号：<span>{{data.orderCode}}</span></p>
                <p class="status">{{status[data.orderStatus]}}</p>
                <Button @click="reSendCode(data.id)" v-if="data.orderStatus === 11" type="info">重新发码</Button>
            </div>
            <div class="right">
                <Steps v-if="data.orderStatus === 14" :current="getCurrStep(data.orderStatus)">
                    <Step title="下单" icon="iconfont c-icon-xiadan" :content="data.createTime"></Step>
                    <Step title="取消成功" icon="iconfont c-icon-tuichu1" :content="data.updateTime || ''"></Step>
                </Steps>
                <Steps v-else :current="getCurrStep(data.orderStatus)">
                    <Step title="下单" icon="iconfont c-icon-xiadan" :content="data.createTime"></Step>
                    <Step title="消费" icon="iconfont c-icon-xiaofei" :content="data.updateTime || ''"></Step>
                    <Step title="完成" icon="iconfont c-icon-wancheng" :content="data.updateTime || ''"></Step>
                </Steps>
            </div>
        </div>
        <!-- 订单信息 -->
        <div class="consumer-msg">
            <p v-if="activeData.type === 'ACTIVITY_TYPE_VOLUNT'">预订人姓名：{{data.userName || '未知'}}（志愿者）</p>
            <p v-else>预订人姓名：{{data.userName || '未知'}}</p>
            <p>联系电话：{{data.userPhone || '未知'}}</p>
            <p>下单时间：{{data.createTime || '未知'}}</p>
            <p>预订渠道：{{data.channel || '未知'}}</p>
        </div>
        <!-- 商品信息 -->
        <div class="box">
            <p class="title-tool content-detail-title">
                <i class="cloud-icon">&#xe697;</i> 商品信息
            </p>
            <div class="content-detail-content product-detail-box">
                <div class="title-entity ivu-row">
                    <div class="ivu-col ivu-col-span-6" style="padding-left:20px;">商品信息11</div>
                    <div class="ivu-col ivu-col-span-4 tc">有效期</div>
                    <div class="ivu-col ivu-col-span-3 tc">预订数量</div>
                    <div class="ivu-col ivu-col-span-3 tc">支付金额</div>
                    <div class="ivu-col ivu-col-span-3 tc">支付积分</div>
                    <div class="ivu-col ivu-col-span-3 tc">退单数量</div>
                    <div class="ivu-col ivu-col-span-2 tc">已核销数</div>
                </div>
                <div class="product-detail entity ivu-row">
                    <div class="ivu-col ivu-col-span-6">
                        <div class="img-faith" v-if="data.image"  :class="{
                              'faith-audit': (data.faithAuditStatus && data.faithAuditValue),
                              'faith-use': (data.faithUseStatus && data.faithUseValue)}">
                            <img :src="data.image.split(',')[0]" class="ml15" >
                        </div>
                        <!--<p class="mt20 p-title">{{data.orderName}}</p>-->
                        <router-link style="display: block;" class="mt20 p-title" :to="{path: '/ac-detail', query: {id: id}}">{{data.orderName}}</router-link>
                        <p v-if="activeData.type === 'ACTIVITY_TYPE_VOLUNT'">招募人数：{{activeData.stock}}</p>
                        <p>活动地点：{{data.address}}</p>
                    </div>
                    <div class="ivu-col ivu-col-span-4 tc">
                        <template v-if="data.orderIndateStart && data.orderIndateEnd">
                            <p class="mt20">{{data.orderIndateStart.slice(0,-3)}}</p>
                            <p>至</p>
                            <p>{{data.orderIndateEnd.slice(0,-3)}}</p>
                        </template>
                        <template v-else>
                            <p style="line-height: 102px;">暂无</p>
                        </template>
                    </div>
                    <div class="ivu-col ivu-col-span-3 tc">{{data.orderNum || '暂无'}}</div>
                    <div class="ivu-col ivu-col-span-3 tc">{{data.payMoney || '暂无'}}</div>
                    <div class="ivu-col ivu-col-span-3 tc">{{data.payIntegral || '暂无'}}</div>
                    <div class="ivu-col ivu-col-span-3 tc">{{data.backNum || '暂无'}}</div>
                    <div class="ivu-col ivu-col-span-2 tc">{{data.consumeNum || '暂无'}}</div>
                </div>
            </div>
        </div>
        <!-- 志愿者订单 活动信息 -->
        <div v-if="activeData.type === 'ACTIVITY_TYPE_VOLUNT'" class="box">
            <p class="title-tool content-detail-title">
                <i class="cloud-icon">&#xe697;</i> 活动信息
            </p>
            <div class="active">
                <Row type="flex">
                    <i-col span="6">活动类型：{{ACTIVITY_TYPE[activeData.type] || '暂无'}}</i-col>
                    <i-col span="6">活动方式：{{ACTIVITY_METHOD[activeData.method] || '暂无'}}</i-col>
                    <i-col span="6">服务类别：{{activeData.tagNames || '暂无'}}</i-col>
                    <i-col span="6">所属区域：{{getRegionPath(activeData.region) || '暂无'}}</i-col>
                </Row>
                <Row type="flex">
                    <i-col span="6">所属场所：{{activeData.activityName || '暂无'}}</i-col>
                    <i-col span="6">所属社团：{{activeData.associationName || '暂无'}}</i-col>
                    <i-col span="6">服务时长：{{activeData.serviceTime + '小时' || '暂无'}}</i-col>
                    <i-col span="6">发起单位：{{activeData.sponsor || '暂无'}}</i-col>
                </Row>
                <Row type="flex">
                    <i-col span="6">活动负责人：{{activeData.liableName || '暂无'}}</i-col>
                    <i-col span="6">联系电话：{{activeData.phone || '暂无'}}</i-col>
                    <i-col span="6">取消设置：{{['不可取消','随时可取消','24小时内可取消',activeData.cancelTime + '小时内可取消'][activeData.cancelStatus] || '暂无'}}</i-col>
                    <i-col span="6" v-if="activeData.faithAuditStatus">诚信免审：志愿者诚信分值达
{{activeData.faithAuditValue}}分以上可享受预约免审核权益</i-col>
                </Row>
            </div>
        </div>
        <!-- 常规订单 活动信息 -->
        <div v-else class="box">
            <p class="title-tool content-detail-title">
                <i class="cloud-icon">&#xe697;</i> 活动信息
            </p>
            <div class="active">
                <Row type="flex">
                    <i-col span="6">联系电话：{{activeData.phone || '暂无'}}</i-col>
                    <i-col span="6">活动类型：{{ACTIVITY_TYPE[activeData.type] || '暂无'}}</i-col>
                    <i-col span="6">活动方式：{{ACTIVITY_METHOD[activeData.method] || '暂无'}}</i-col>
                    <i-col span="6">活动分类：{{activeData.activityClassifyName || '暂无'}}</i-col>
                </Row>
                <Row type="flex">
                    <i-col span="6">所属场所：{{activeData.activityName || '暂无'}}</i-col>
                    <i-col span="6">所属区域：{{getRegionPath(activeData.region) || '暂无'}}</i-col>
                    <i-col span="6">主办单位：{{activeData.sponsor || '暂无'}}</i-col>
                    <i-col span="6" v-if="activeData.faithUseStatus">诚信优享：用户分值达{{activeData.faithUseValue}}分以上可预约</i-col>
                </Row>
            </div>
        </div>
        <!-- 核销、取消 -->
        <div class="box hx-box">
            <p class="title-tool content-detail-title">
                <i class="cloud-icon">&#xe697;</i>
                {{data.orderStatus === 14?"取消记录":"核销信息"}}
            </p>
            <div class="content-detail-content">
                <div class="detail-text-info" v-if="data.recordList && data.recordList.length">
                    <!--已取消-->
                    <div v-if="data.orderStatus === 14">
                        <Row :key="i" type="flex" v-for="(item,i) in data.recordList">
                            <Col span="8">取消时间：{{item.createTime || '暂无'}}</Col>
                            <Col span="8">取消数量：{{item.num || '暂无'}}</Col>
                            <!--<i-col v-if="item.num" span="6">退还积分：{{item.num || '暂无'}}</i-col>-->
                            <Col v-if="item.money" span="8">退还金额：{{item.money || '暂无'}}</Col>
                        </Row>
                    </div>
                    <!--已失效-->
                    <div v-else-if="data.orderStatus === 13">
                        <p>订单失效，没有核销数据。</p>
                    </div>
                    <div v-else>
                        <p :key="i" v-for="(item,i) in data.recordList">
                            电子消费码：<span>{{item.code}}</span> 于 {{item.createTime}}
                            <span v-if="item.type==='VALID'">由 {{item.operateUser}}（{{item.phone}}）核销</span>
                            <span v-if="item.type==='CANCEL'">取消</span>
                            了{{item.num}}张。
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <Button type="primary" class="ml20" @click="back">返回</Button>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from "vue-property-decorator";
    import {getActiveOrderDetail, restartCode, getActivityDetial} from "@service/activity";
    import {getParentsRegion} from "@util/comm"
    import {ACTIVITY_METHOD, AUDIT_DATA_STATUS, ACTIVITY_TYPE} from "@constant/index"
    @Component({
        components: {}
    })
    export default class ComponentName extends Vue {
        // 状态
        private status = <object>{
            11: "待消费",
            12: "已完成",
            13: "已失效",
            14: "已取消"
        }
        // 详情数据
        private data = <any>{}
        // 订单id
        private id: any
        // 活动id
        private activityId: any
        // 活动数据
        private activeData = <any>{}
        private ACTIVITY_METHOD = ACTIVITY_METHOD;
        private AUDIT_DATA_STATUS = AUDIT_DATA_STATUS;
        private ACTIVITY_TYPE = ACTIVITY_TYPE;

        created () {
            this.id = this.$route.query.id
            this.activityId = this.$route.query.activityId
            this.getActiveOrderDetail(this.id)
            this.getActivityDetial()
        }
        // 算计地址
        private getRegionPath (region: string): string {
            if (!region) return '';
            return getParentsRegion(region).reverse().map((item: any) => item.name).join('-')
        }
        // 活动详情
        private getActivityDetial () {
            getActivityDetial({id: this.activityId}).then((res:any) => {
                if (res.code === 0 && res.data) {
                    this.activeData = res.data
                }
            })
        }
        // 获取当前应该显示的步骤
        private getCurrStep (status: number) {
            let steps = <any>{
                1: [11, 13],
                2: [14],
                3: [12]
            }
            for (let attr in steps) {
                if (steps[attr].includes(status)) return Number(attr);
            }
        }
        // 重置消费ma
        private reSendCode (id: string) {
            restartCode({id}).then((res: any) => {
              if (res.code === 0) {
                  this.$Message.success('发码成功！')
              } else {
                  this.$Message.error(res.message)
              }
            })
        }
        // 获取详情
        private getActiveOrderDetail (id: any) {
            getActiveOrderDetail({id}).then((res:any) => {
                if (res.code === 0) {
                    this.data = res.data
                }
            })
        }
        // back
        private back () {
            window.history.back()
        }
    }
</script>

<style lang='scss' scoped>
    .step {
        display: flex;
        .details-left {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 125px;
            text-align: center;
            border-right: 1px solid #e9eaec;
            p {
                font-size: 14px;
                color: #595961;
            }
            .status {
                font-size: $f16;
                color: $theme;
                font-weight: bold;
            }
        }
        .right {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 0 50px;
        }
    }
    .consumer-msg {
        display: flex;
        margin: 20px;
        line-height: 60px;
        border-top: 1px dashed #e9eaec;
        p {
            flex: 1;
        }
    }
    .box {
        margin-bottom: 25px;
        padding: 0 20px;
        .active {
            padding: 10px 0;
            border-top: 1px solid #dedede;
            line-height: 30px;
        }
    }

    .img-faith {
        &.faith-use:after {
            content: '诚信优享';
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 0 5px;
            color: #fff;
            background: rgba(255, 102, 0, 1);
            line-height: 20px;
            text-align: center;
            border-radius: 4px;
        }
        &.faith-audit:after {
            content: '诚信免审';
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 0 5px;
            color: #fff;
            background: rgba(20, 204, 86, 1);
            line-height: 20px;
            text-align: center;
            border-radius: 4px;
        }
    }

    .ivu-row {
        position: relative;
        margin-left: 0;
        margin-right: 0;
        height: auto;
        zoom: 1;
        display: block;
        &:after {
            clear: both;
            visibility: hidden;
            font-size: 0;
            height: 0;
        }
    }

    .ivu-row:after,
    .ivu-row:before {
        content: "";
        display: table;
    }

    .detail-text-info {
        padding-right: 15px;
        display: table;
        width:100%;
    }

    .detail-text-label {
        white-space: nowrap;
    }

    .detail-text-info {
        .detail-text-label {
            min-width: 70px;
            padding-right: 10px;
            text-align: right;
            color: $font01;
        }
        .detail-text-label,
        .detail-text-text {
            display: table-cell;
            font-size: 12px;
            font-weight: 400;
        }
        .detail-text-text {
            color: $font02;
        }
    }

    .content-detail-title {
        position: relative;
        padding: 0 15px;
        line-height: 40px;
        font-size: 14px;
        color: $font01;
        font-weight: 700;
        margin-bottom: 10px;
    }
    .title-tool {
        position: relative;
        width: 100%;
        line-height: 16px;
        padding-left: 10px;
        margin-bottom: 20px;
        i {
            position: absolute;
            top: 0;
            left: -8px;
            font-size: 20px;
            color: $theme;
        }
    }
    .product-detail-box {
        .ivu-col-span-3 {
            border-right: 1px solid $borderLight;
        }
        .ivu-col-span-4 {
            border-right: 1px solid $borderLight;
        }
        .ivu-col-span-6 {
            border-right: 1px solid $borderLight;
        }
    }
    .content-detail-content {
        padding: 10px 0;
        border-top: 1px solid #dedede;
        .product-detail {
            border-left: 1px solid #e9eaec;
            border-right: 1px solid #e9eaec;
            border-bottom: 1px solid #e9eaec;
            font-weight: 400;
            .img-faith {
                position: relative;
                float: left;
                width: 90px;
                height: 60px;
                border-radius: 5px;
                margin: 10px 10px 20px 20px;
                overflow: hidden;
                img {
                    width: 100%;
                }
            }
            p {
                line-height: 20px;
            }
            .p-title {
                font-size: $f14;
                color: $font01;
            }
            .ivu-col {
                min-height: 103px;
            }
            .ivu-col-span-3,
            .ivu-col-span-2 {
                line-height: 103px;
            }
        }
        .title-entity {
            font-size: $f12;
            color: $font01;
            background: #f2f4f7;
            line-height: 54px;
            border: 1px solid $borderLight;
        }
    }

    .hx-box {
        .detail-text-info {
            font-size: $f12;
            color: #263b4d;
            font-weight: normal;
            line-height: 25px;
            span {
                color: $theme;
            }
        }
    }
</style>
