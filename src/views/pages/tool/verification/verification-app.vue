<template>
    <div class="content">
        <h1 class="tit">电子消费码核销APP</h1>
        <p class="des">电子消费码核销APP（安卓版）是集分销系统、电商平台、文化旅游云平台核销
为一体的应用，实现多平台统一核销。支持扫码核销和手动核销，操作简单，核
销记录一目了然。</p>
        <ul class="list">
            <li class="item">分销系统核销：景区门票</li>
            <li class="item">小电商核销：景区门票 / 虚拟商品 / 直通车</li>
            <li class="item">文化旅游云核销：文化活动预约 / 场馆活动室预约 </li>
        </ul>
        <div class="clearfix">
            <div class="qrcode-wrap fl">
                <div class="qrcode"><img class="fl" src="@/assets/image/verification-app.png" alt=""></div>
                <div class="qrcode-intro"><img src="@/assets/image/CT1.png" alt=""></div>
                <p>安卓手机用户扫描直接安装应用</p>
            </div>
            <div class="qrcode-wrap fl" style="margin-left:50px;">
                <div class="qrcode"><img class="fl" src="@/assets/image/verification-app-ios.jpg" alt=""></div>
                <div class="qrcode-intro"><img src="@/assets/image/CT2.png" alt=""></div>
                <p>苹果手机用户扫描二维码至APP 商城下载</p>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    @Component
    export default class VerificationApp extends Vue {}
</script>

<style lang='scss' scoped>
    .content {
        width: 1110px;
        height: 600px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -555px;
        margin-top: -300px;
        background: url("../../../../assets/image/iphonex.png") no-repeat right bottom;
        .tit {
            margin: 0;
            color: #333333;
            font: 40px/90px 'PingFangSC-Regular','微软雅黑';
        }
        .des {
            width: 630px;
            text-align: justify;
            color: #666666;
            font: 18px/28px 'PingFangSC-Regular','微软雅黑';
        }
        .list {
            margin-top: 30px;
            margin-bottom: 35px;
            color: #333333;
            font: 18px/27px 'PingFangSC-Regular','微软雅黑';
            text-indent: 30px;
            font-weight: bold;
            .item {
                margin-bottom: 11px;
                position: relative;
                &:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 5px;
                    width: 18px;
                    height: 18px;
                    background: #23a1ee;
                    border-radius: 50%;
                }
                &:after {
                    content: '';
                    position: absolute;
                    left: 4px;
                    top: 10px;
                    width: 10px;
                    height: 6px;
                    transform: rotate(-45deg);
                    border-left: 2px solid #fff;
                    border-bottom: 2px solid #fff;
                }
            }
        }
        .qrcode-wrap {
            width:210px;
            .qrcode {
                padding: 12px;
                border: 1px solid #e3e3e3;
                border-radius: 9px;
                overflow: hidden;
                width:210px;
                height:210px;
                img{
                    width: 100%;
                    height:100%;
                }
            }
            .qrcode-intro{
                width:160px;
                height:40px;
                margin:20px auto 0;
                img{
                    width:100%;
                    height:100%;
                }
            }
            p {
                padding-top:12px;
                text-align: center;
                color: #999;
                font-size: 14px;
            }
        }
    }
</style>
