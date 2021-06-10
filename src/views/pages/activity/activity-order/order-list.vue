<template>
    <div class="content">
        <!--tab切换-->
        <Tabs v-model="currName" class="tab-wrap" :animated="false">
            <!--全部-->
            <Tab-pane label="全部" key="key1" name="all">
                <Pane :currName="currName"></Pane>
            </Tab-pane>
            <!--待消费-->
            <Tab-pane label="待消费" key="key2" name="11">
                <Pane :currName="currName" :dataStatus="11"></Pane>
            </Tab-pane>
            <!--已完成-->
            <Tab-pane label="已完成" key="key3" name="12">
                <Pane :currName="currName" :dataStatus="12"></Pane>
            </Tab-pane>
            <!--已失效-->
            <Tab-pane label="已失效" key="key4" name="13">
                <Pane :currName="currName" :dataStatus="13"></Pane>
            </Tab-pane>
            <!--已取消-->
            <Tab-pane label="已取消" key="key5" name="14">
                <Pane :currName="currName" :dataStatus="14"></Pane>
            </Tab-pane>
        </Tabs>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator'
    import Pane from './pane.vue'
    @Component({
        components: {
            Pane
        }
    })
    export default class OrderList extends Vue {
        private currName: string = 'all';
//        private changeStatus(){
//            this.bus.$emit('changeStatus')
//        }
    }
</script>

<style lang='scss' scoped>
    .content {
        padding: 0 15px;
        /*.orderHeader {
            padding: 16px 0;
            background-color: #e9eaec;
            li {
                overflow: hidden;
                .big, .middle {
                    float: left;
                    text-align: center;
                }
                .big {
                    width: 37%;
                    text-align: left;
                }
                .middle {
                    width: 12%;
                    text-align: center;
                    a.help {
                        background: #ed3f14;
                        font-size: 10px;
                        color: #fff;
                        border-radius: 50%;
                        position: relative;
                        top: 0;
                        left: 8px;
                        display: inline-block !important;
                        width: 15px;
                        height: 15px;
                        line-height: 17px !important;
                        padding-top: 1px;
                    }
                }
            }
        }
        .tab {
            position: relative;
            overflow: hidden;
            .line {
                float: left;
                text-align: left !important;
                max-width: 400px;
                line-height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .rowList {
                div {
                    float: left;
                    text-align: center;
                }
                margin-top: 20px;
                border: 1px solid #e9eaec;
                line-height: 50px;
                border-bottom: 1px solid #e9eaec;
                > div.info {
                    background-color: #fff;
                    width: 100%;
                    padding: 16px 0;
                    .big, .middle {
                        float: left;
                        text-align: center;
                    }
                    .big {
                        width: 37%;
                        text-align: left;
                        img {
                            width: 50px;
                            height: 50px;
                            float: left;
                        }
                    }
                    .middle {
                        width: 12%;
                        text-align: center;
                        a {
                            display: block;
                            line-height: 20px;
                            margin: 0;
                            padding: 0;
                        }
                    }
                }
            }
            .colBox {
                background-color: #f4f9fe;
                width: 100%;
                padding-left: 20px;
                .detail-text-info {
                    padding-right: 40px !important;
                    .detail-text-label {
                        white-space: nowrap;
                    }
                    .detail-text-text {
                        color: #7b8292;
                    }
                }
            }
            .detail-text-info .detail-text-label, .detail-text-info .detail-text-text {
                display: table-cell;
                font-size: 12px;
                font-weight: 400;
            }
        }
        .topic {
            width: 100%;
            padding-top: 15px;
            background: $grayLight;
        }*/
    }
    .tab-wrap{
        padding-top:15px;
    }
</style>
