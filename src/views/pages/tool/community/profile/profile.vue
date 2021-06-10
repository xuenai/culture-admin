<!--
 * @Author: chenyl
 * @since: 2019-06-05 09:36:34
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-12 10:52:51
 -->
<template>
    <div class="container">
        <Row class="row count-wrap">
            <Col span="4" class="summary item">
                <p class="item-count">{{communityNum}}</p>
                <p class="item-name">文化社团总数</p>
            </Col>
            <Col span="4" class="item">
                <p class="item-count">{{fansNum}}</p>
                <p class="item-name">粉丝总数</p>
            </Col>
        </Row>
        <Row class="row chart-container">
            <Col span="24" class="col-item">
                <div class="chart-wrap pd15">
                    <div class="tips-title ">
                        社团分类统计情况
                    </div>
                    <div class="chart">
                        <LineEchart :configure="barData" class="chart-div"></LineEchart>
                    </div>
                </div>
            </Col>
            <Col span="24" class="mt15 ">
                <div class="chart-wrap pd15">
                    <div class="tips-title ">
                        最近1个月热门社团排行榜 TOP10
                    </div>
                    <div class="chart">
                        <Table border :columns="tableData.headList" :data="tableData.bodyList" class="table">
                            <template slot-scope="{row,index}" slot="sort">
                                <span>{{index+1}}</span>
                            </template>
                        </Table>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import LineEchart from "@components/groupChart/groupChart.vue";
    import {getAssociationNum,getAssociationNumByType,getAssociationTopTenMonth} from "@service/tool";
    @Component({
        components: {
            LineEchart
        }
    })
    export default class profile extends Vue {
        // 统计社团总数和关注数量
        private communityNum:any='';//社团总数
        private fansNum:any='';//社团总数
        private getCount(){
            getAssociationNum({}).then((res:any)=>{
                this.communityNum=res.data.associaNum;
                this.fansNum=res.data.associaNumFans;
            })
        }

        //热门社团排行榜 TOP10
        //表格数据
        private tableData: any = {
            headList: [
                {
                    title: '排序',
                    key: 'sort',
                    slot:'sort',
                    align: 'center'
                },
                {
                    title: '社团名称',
                    key: 'name',
                    align: 'center'
                },
                {
                    title: '类型',
                    key: 'type',
                    align: 'center'
                },
                {
                    title: '提交时间',
                    key: 'createTime',
                    align: 'center'
                },
                {
                    title: '粉丝数',
                    key: 'num',
                    align: 'center'
                },
            ],
            bodyList: []
        };
        private getTopTenMonth(){
            getAssociationTopTenMonth({}).then((res:any)=>{
                this.tableData.bodyList=res.datas
            })
        }
        //社团分类统计
        //柱状图
        private barData: any = {
            //线状图配置2
            data: [
                // {ydata: "音乐", series: [12]},
            ], //动态数据
            title: "",
            seriesName: ["社团分类统计"], //系列名称
            seriesType: ["bar", "bar", "bar", "bar","bar"], //系列类型
            lengedPosition: ["bottom", "", "", "right"], // 上,右,下,左
            yCompany: ["单位：个"], // 如果不设置单位默认为个
        };
        private getNumByType() {
            let _this=this;
            getAssociationNumByType({}).then((res:any)=>{
                res.datas.forEach((item:any)=>{
                    _this.barData.data.push({
                        ydata:item.name,
                        series:[item.num]
                    })
                })
            })
        }
        mounted(){
            this.getCount(); // 统计社团总数和关注数量
            this.getTopTenMonth();//热门社团排行榜 TOP10
            this.getNumByType(); //社团分类统计
        }
    }
</script>

<style scoped lang="scss">
    .container {
        height: 100vh;
        background-color: $grayDark;
        padding:0 !important;
        .tips-title {
            position: relative;
            padding: 15px 15px 15px 30px;
            font-weight: 600;
            font-size: 16px;
            color: $font01;
            &:after {
                position: absolute;
                left: 20px;
                top: 18px;
                content: '';
                width: 3px;
                height: 16px;
                background-color: $theme;
                border-radius: 1.5px;
            }
            .tip{
                font-size: 12px;
                color:$lightGray;
            }
        }
        .count-wrap {
            background-color: $bg01;
            padding:25px 15px;
        }
        .row {
            .item {
                text-align: center;
            }
            .item-count {
                font-size: 26px;
                color: $theme;
            }
            .item-name {
                font-size: 16px;
                color: $font01;
                margin-top: 10px;
            }
            .summary {
                position: relative;
                .item-count {
                    color: $danger !important;
                }
                &:after{
                    content:'';
                    position:absolute;
                    top:10px;
                    right: 1px;
                    height: 70px;
                    width: 1px;
                    background-color:$borderLight;
                }
            }
            & + .row {
                margin-top: 15px;
            }
        }
        .chart-container{
            position: relative;
            height: calc(75% - 180px);
            .col-item{
                height: 100%;
            }
        }
        .chart-wrap {
            height: 100%;
            padding-top: 5px;
            background-color: $bg01;
            .chart{
                height: calc(100% - 60px);
            }
            .chart-div {
                height: 100%;
            }
        }
        .topic-msg {
            padding: 8px 0;
            .img {
                width: 100px;
                height: 60px;
            }
            .msg-panel {
                margin-left: 8px;
            }
            .topic-name {
                margin-top: 7px;
            }
            .date {
                margin-top: 7px;
            }
        }
       // .active-wrap{
        //     background-color: $bg01;
        //    .progress{
        //        width: 30%;
        //    }
        //     .item{
        //         padding: 20px;
        //     }
        //    .label-name{
        //         width: 100px;
        //        text-align: right;
        //    }
        // }
    }

</style>
