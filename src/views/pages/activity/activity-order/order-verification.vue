<template>
    <div>
        <div class="verification-nav">
            <h2>消费码核销</h2>
            <div class="v-search clearfix">
                <input placeholder="请输入消费码或通过扫码抢扫码" class="v-search-box fl">
                <span class="v-search-btn fl"><i class="cloud-icon icon-search">&#xe6ae;</i>搜索</span>
            </div>
        </div>
        <!-- 列表 -->
        <div class="card-list">
            <ul class="verification-content">
                <li>
                    <div class="content-l">
                        <i class="iconappointment cloud-icon">&#xe628;</i><img
                            src="@/assets/image/beauty-qj.jpg">
                        <div class="information">
                            <p>测试信息</p>
                            <p><i class="cloud-icon">&#xe6f6;</i> 15198221637</p>
                        </div>
                    </div>
                    <div class="content-r">
                        <div class="name">自动预约自动核销</div>
                        <div class="info">
                            价格：￥0.01&nbsp;&nbsp;&nbsp;&nbsp;数量：1&nbsp;&nbsp;&nbsp;&nbsp;有效期：<span>长期有效</span>
                        </div>
                        <div class="info">供应商：测试站点</div>
                        <div class="reserve-main">
                            <label for="">预约信息</label>
                            <span>预约消费时间：2019-05-31</span>
                            <span>姓名：张三</span><br/>
                            <span>证件号：身份证（51390219806106599</span>
                            <span>电话：18785968574</span>
                        </div>
                    </div>
                </li>
                <li class="bg2">
                    <div class="content-l">
                        <img src="@/assets/image/beauty-qj.jpg">
                        <div class="information">
                            <p>测试信息</p>
                            <p><i class="cloud-icon">&#xe6f6;</i> 15198221637</p>
                        </div>
                    </div>
                    <div class="content-r">
                        <div class="name">自动预约自动核销</div>
                        <div class="info">
                            价格：￥0.01&nbsp;&nbsp;&nbsp;&nbsp;数量：1&nbsp;&nbsp;&nbsp;&nbsp;有效期：<span>长期有效</span>
                        </div>
                        <div class="info">供应商：测试站点</div>
                        <div class="verification-number">
                            <label for="">核销数量：</label>
                            <div class="number">
                      <span>
                        <p class="dec">-</p>
                      </span>
                                <input type="text"/>
                                <span>+</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div style="margin: 0 auto;width:80px;">
                <button type="button" @click="sureWin" class="ivu-btn ivu-btn-primary">确定核销</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator"
    @Component
    export default class auditResultHead extends Vue {
        private params = <any>{

        }
        mounted() {
        }

        //
        private sureWin () {
            let config = <any>{
                title: `系统提示`,
                content: `是否确定核销选中项目？`,
                okText: "确认",
                cancelText: "取消",
                onOk: () => {
                    console.log('ok')
                }
            };
            this.$Modal.confirm(config);
        }
    }
</script>

<style scoped lang="scss">
    .verification-nav {
        background-color: #fff;
        height: 87.5%;
        padding-bottom: 66px;
        text-align: center;
        h2 {
            height: 75px;
            line-height: 75px;
            font-size: 23px;
            color: #333;
            font-weight: 400;
        }
        .v-search {
            width: 489px;
            margin: 0 auto;
            .v-search-box {
                text-indent: 10px;
                width: 400px;
                height: 40px;
                font-size: 12px;
                color: #999;
                border-left: 1px solid $theme;
                border-top: 1px solid $theme;
                border-bottom: 1px solid $theme;
            }
            .v-search-btn {
                // display: inline-block;
                width: 88px;
                height: 40px;
                line-height: 40px;
                background-color: $theme;
                color: #fff;
                font-size: 16px;
                .icon-search {
                    font-size: 16px;
                    margin-right: 5px;
                }
            }
        }
    }

    .card-list {
        // width: 890px;
        // height: 327px;
        // background: #ccc;
        // margin: 0 auto;
        .verification-content {
            margin: 30px 40px 0 40px;
            li {
                width: 1152px;
                height: 186px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                border-radius: 10px;
                background: url(../../../../assets/image/verification-bg1.png) 100% 100% !important;
                &.bg2 {
                    height: 94px;
                    background: #fff;
                    background-size: 100% 100%;
                }
                .content-l {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 25%;
                    height: 100%;
                    .iconappointment {
                        position: absolute;
                        left: -15px;
                        top: 42%;
                        display: inline-block;
                        width: 28px;
                        height: 28px;
                        font-size: 17px;
                        line-height: 30px;
                        color: $bg01;
                        text-align: center;
                        background: $theme;
                        border-radius: 50%;
                    }
                    img {
                        margin: 0 6px 0 36px;
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                    }
                    .information {
                        text-align: left;
                        flex: 1;
                        i {
                            position: relative;
                            top: 1px;
                            font-size: 16px;
                        }
                    }
                }
                .content-r {
                    position: relative;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                    margin: 0 25px;
                    text-align: left;
                    .name {
                        font-size: 14px;
                        color: #333;
                    }
                    .info {
                        font-size: 12px;
                        color: #999;
                    }
                    .reserve-main {
                        margin-top: 5px;
                        padding: 12px;
                        width: 100%;
                        background-color: #fbfbe9;
                        font-size: 12px;
                        label {
                            display: block;
                            color: #666;
                            margin-bottom: 5px;
                        }
                        span {
                            display: inline-block;
                            width: 250px;
                            color: #333;
                        }
                    }
                    .verification-number {
                        display: inline-flex;
                        position: absolute;
                        text-align: center;
                        top: 23%;
                        right: 0;
                        height: 29px;
                        label {
                            display: inline-block;
                            line-height: 29px;
                            font-size: 14px;
                            color: #333;
                        }
                        .number {
                            width: 97px;
                            height: 29px;
                            line-height: 29px;
                            border-radius: 4px;
                            background-color: #95bffb;
                            span {
                                position: relative;
                                display: inline-block;
                                width: 30px;
                                line-height: 30px;
                                color: #fff;
                                font-size: 30px;
                                cursor: pointer;
                                .dec {
                                    position: absolute;
                                    top: -28px;
                                    left: 10px;
                                }
                            }
                            input {
                                display: inline-block;
                                width: 35px;
                                text-align: center;
                                height: 27px;
                                line-height: 27px;
                                vertical-align: text-bottom;
                                background-color: #fff;
                            }

                        }
                    }
                }
            }
        }
    }
</style>
