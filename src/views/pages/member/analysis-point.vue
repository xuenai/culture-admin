<!--
 * @Author: 任智勇
 * @since: 2019-05-21 14:07:13
 * @LastAuthor: SXQ
 * @lastTime: 2019-07-01 15:28:02
 -->
<template>
    <div class="container">
        <ul class="tab clearfix">
            <li class="fl"><span ref="7day" class="item" :class="{active: currTabIndex === 0}" @click="()=>{
                currTabIndex = 0;
                changeTime([new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date().getTime()])
            }">最近7天</span></li>
            <li class="fl"><span class="item" :class="{active: currTabIndex === 1}" @click="()=>{
                currTabIndex = 1;
                changeTime([new Date().getTime() - 30 * 24 * 60 * 60 * 1000, new Date().getTime()])
            }">最近30天</span></li>
            <li class="fl">
                <span class="item">自定义时间</span>
                <DatePicker type="daterange" placement="bottom-end" placeholder="选择时间范围"
                            :value="[params.startTime, params.endTime]"
                            @on-change="time => {
                                if (!time[0]) return;
                                currTabIndex = 2;
                                changeTime(time);
                            }"
                            style="position:relative;top: -2px;"></DatePicker>
            </li>
        </ul>
        <ul class="count-box">
            <li>
                <div class="icon">
                    <i class="cloud-icon">&#xe703;</i>
                </div>
                <div class="info">
                    <h3>{{giveIntegal || 0}}</h3>
                    <p>共计送出积分</p>
                </div>
            </li>
            <li v-if="false">
                <div class="icon">
                    <i class="cloud-icon">&#xe704;</i>
                </div>
                <div class="info">
                    <h3>345</h3>
                    <p>共计消耗积分</p>
                </div>
            </li>
        </ul>

        <h3 class="cloud-icon title">会员都喜欢做那些任务来获得积分？</h3>
        <div class="block1">
            <div class="left">
                <PieChart class="chart-div" :configure="pieChartConfig"></PieChart>
                <p class="nodata" v-if="!pieChartConfig.data.some(d => d.value > 0)">暂无数据</p>
            </div>
            <div class="right">
                <Table border height="400" :columns="tableData.columns1" :data="tableData.data2">
                    <template slot-scope="{ row }" slot="taskInfo">
                        <div class="info-list clearfix">
                            <div class="img-box fl" :style="{backgroundImage: `url(${row.icon})`}"></div>
                            <div class="introduce-content fl">
                                <p class="line1">{{row.name}}</p>
                                <p class="des" :title="row.synopsis">{{row.synopsis}}</p>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="{ row }" slot="rewardIntegal">
                        {{row.rewardIntegal}} 积分
                    </template>
                </Table>
            </div>
        </div>

        <h3 class="cloud-icon title">会员都喜欢在什么时间做任务？</h3>
        <div class="block2">
            <LineEchart :configure="lineEchartConfig" class="chart-div"></LineEchart>
        </div>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';
    import PieChart from "@components/pieChart/pieChart.vue";
    import LineEchart from "@components/groupChart/groupChart.vue";
    import {getTaskByHourCount, getIntegralCount, getIntegralTaskType, getTaskListCount} from '@service/member';
    import {formatterDate} from '@util/comm';

    @Component({
        components: {
            PieChart,
            LineEchart
        }
    })
    export default class MemberList extends Vue {
        private pieChartConfig = <any>{
            data: [
                /*{value: 10, name: '登录'},
                {value: 10, name: '注册'},
                {value: 10, name: '写故事'},
                {value:10, name: '参与活动'}*/
            ],
            seriesName: '会员统计',
            type: 'pie',
            unit: '人',
            label_line1: true,
            color: ["#5599ff", "#0dcdda", "#13d89e", "#5ac858", '#ff9051', '#f7bb3a', '#ff5b5b', '#987de6', '#e26ed3', '#53c168', '#e8aa15', '#ddc600', '#fa6286', '#c36ee2', '#7e83f1'], //颜色数组
        };
        private lineEchartConfig = <any>{
            data: [
//                 {ydata: "4.5", series: [12, 12 + 20, 12 + 30, 12 + 5]}
            ], //动态数据
            color: ["#5599ff", "#0dcdda", "#13d89e", "#5ac858", '#ff9051', '#f7bb3a', '#ff5b5b', '#987de6', '#e26ed3', '#53c168', '#e8aa15', '#ddc600', '#fa6286', '#c36ee2', '#7e83f1'], //颜色数组
            seriesName: [/*"文化场馆", "酒店", '景区', '餐饮','公共资源'*/], //系列名称
            seriesType: ["line", "line", "line", "line","line"], //系列类型
            isLenged: true, //是否开启图例
            selectedMode: true,
            lengedPosition: ["bottom", "", "", "right"], // 上,右,下,左
//             isLable:true,
            yCompany: ["单位：条"], // 如果不设置单位默认为个
        };
        private tableData = <any>{
            columns1: [
                {
                    title: '任务信息',
                    slot: 'taskInfo',
                    width: 290,
                    fixed: "left",
                },
                {
                    title: "任务奖励",
                    key: "rewardIntegal",
                    slot: "rewardIntegal",
                    align: "center",
                },
                {
                    title: "领取任务会员数量",
                    key: "receiveNum",
                    align: "center",
                    width: 136,
                },
                {
                    title: "完成任务数量",
                    key: "complateNum",
                    align: "center",
                    width: 110,
                }
            ],
            data2: [

            ]
        }

        mounted () {
            (this.$refs['7day'] as any).click()
        }
        // 请求参数
        private params = <any>{
            publishChannel: 'CULTURAL',
            cruxValue: this.$store.state.app.userInfo.siteId,
            startTime: '',
            endTime: '',
        }
        // 当前tab索引
        private currTabIndex = 0;
        // 时间切换
        private changeTime (time: Array<number | string>) {
            this.params.startTime = typeof time[0] === 'string' ? time[0] : formatterDate(time[0] as number).split(' ')[0]
            this.params.endTime = typeof time[1] === 'string' ? time[1] : formatterDate(time[1] as number).split(' ')[0]
            // 其他函数调用
            this.getTaskByHourCount()
            this.getIntegralCount()
            this.getIntegralTaskType()
            this.getTaskListCount()
        }
        // 获取会员都喜欢在什么时间做任务？
        private getTaskByHourCount () {
            getTaskByHourCount(this.params).then((res:any) => {
                if (res.code === 0) {
                    let list: Array<any> = []
                    let seriesName: Array<string> = res.datas.map((data:any) => {
                        data.dataNum.forEach((item:any, i:number) => {
                            if (list[i]) {
                                list[i].series.push(item.num)
                            } else {
                                list[i] = {ydata: item.hourTime + ':00', series: [item.num]}
                            }
                        })
                        return data.type
                    })
                    this.lineEchartConfig.seriesType = Array(seriesName.length).fill('line')
                    this.lineEchartConfig.data = list
                    this.lineEchartConfig.seriesName = seriesName
                }
            })
        }
        // 获取会员都喜欢做那些任务来获得积分？
        private getIntegralTaskType () {
            getIntegralTaskType(this.params).then((res:any) => {
                if (res.code === 0) {
                    res.datas.sort((a:any, b:any) => {
                        return b.num - a.num
                    });
                    this.pieChartConfig.data = res.datas.map((item:any) => ({
                        value: item.num || 0,
                        name: item.typeName
                    }))
                }
            })
        }
        // 获取会员都喜欢做那些任务来获得积分 旁边列表
        private getTaskListCount () {
            getTaskListCount(this.params).then((res:any) => {
                if (res.code === 0) {
                    this.tableData.data2 = res.datas
                } else {
                    this.tableData.data2 = []
                }
            })
        }
        // 攻击送出积分
        private giveIntegal: number = 0
        private getIntegralCount () {
            getIntegralCount(this.params).then((res:any) => {
                if (res.code === 0) {
                    this.giveIntegal = <number>res.data.giveIntegal
                } else {
                    this.giveIntegal = 0
                }
            })
        }
    }
</script>

<style lang='scss' scoped>
    .nodata {
        position: absolute;
        top: 40%;
        width: 100%;
        text-align: center;
    }
    
    .container {
        padding: 20px;
    }

    .count-box {
        height: 105px;
        background-color: $bg01;
        padding: 0 30px;
        display: flex;
        justify-content: flex-start;
        border-bottom: 1px solid #dedede;
        margin-bottom: 15px;
        > li {
            width: 200px;
            display: flex;
            align-items: center;
            &:nth-child(1) .icon {
                background-color: $theme;
            }
            &:nth-child(2) .icon {
                background-color: $theColor8;
            }
            &:nth-child(3) .icon {
                background-color: $theColor4;
            }
            &:nth-child(4) .icon {
                background-color: $theColor7;
            }
            .icon {
                width: 56px;
                height: 56px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                margin-right: 20px;
                i {
                    color: #fff;
                    font-size: 24px;
                }
            }
            .info {
                display: flex;
                flex-direction: column;
                h3 {
                    font-size: 26px;
                    color: $font01;
                }
            }
        }
    }

    .title::before {
        position: relative;
        top: 1px;
        content: "\e697";
        font-size: 20px;
        color: $theme;
        margin-right: 10px;
    }

    .tab {
        padding-bottom: 20px;
        border-bottom: 1px solid #dedede;
        .fl {
            margin-right: 15px;
            line-height: 32px;
            &:last-child {
                .item {
                    margin-right: 5px;
                    color: #263b4d;
                    cursor: default;
                }
            }
            .item {
                font-size: 16px;
                color: #148cf3;
                cursor: pointer;
                &.active {
                    color: #FC8675;
                    font-weight: bold;
                }
            }
        }
    }

    .title {
        line-height: 32px;
        color: $font01;
        font-weight: bold;
        font-size: 16px;
    }

    .block1 {
        display: flex;
        height: 400px;
        margin-bottom: 20px;
        position: relative;
        .left {
            position: relative;
            flex: .55;
        }
        .right{
            flex: .45;
        }
    }
    .block2 {
        height: 400px;
    }

    .info-list {
        padding: 6px 0;
        display: flex;
        align-items: center;
        .img-box {
            position: relative;
            width: 40px;
            height: 40px;
            background: url("../../../assets/image/daq-no-data.png") no-repeat center/cover;
            border-radius: 50%;
        }
        .introduce-content {
            margin-left: 10px;
            width: calc(100% - 50px);
        }
    }
    .des{
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>
