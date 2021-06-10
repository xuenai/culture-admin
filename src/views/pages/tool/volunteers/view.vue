<template>
<div class="volunteers-view">
    <Row type="flex" class="list">
        <Col span="3" class="ind">
            <span>{{countVolunteer.total}}</span>
            <p>志愿者总数</p>
        </Col>
        <Col span="3" class="box">
            <span>{{countVolunteer.waitAuditNum}}</span>
            <p>待审核</p>
        </Col>
        <Col span="3" class="box">
            <span>{{countVolunteer.fiveStar}}</span>
            <p>五星</p>
        </Col>
        <Col span="3" class="box">
            <span>{{countVolunteer.fourStar}}</span>
            <p>四星</p>
        </Col>
        <Col span="3" class="box">
            <span>{{countVolunteer.threeStar}}</span>
            <p>三星</p>
        </Col>
        <Col span="3" class="box">
            <span>{{countVolunteer.twoStar}}</span>
            <p>二星</p>
        </Col>
        <Col span="3" class="box">
            <span>{{countVolunteer.oneStar}}</span>
            <p>一星</p>
        </Col>
    </Row>
    <Row type="flex" class="list">
        <Col span="3" class="ind">
            <span>{{countVolunteerTeam.total}}</span>
            <p>志愿团队总数</p>
        </Col>
        <Col span="3" class="box">
            <span>{{countVolunteerTeam.waitAuditNum}}</span>
            <p>待审核</p>
        </Col>
        <Col span="3" class="box" v-for="(item,index) in countVolunteerTeamClassify" :key="index*9">
            <span>{{item.num}}</span>
            <p>{{item.teamType}}</p>
        </Col>
    </Row>

    <div class="clearfix mt15 content">
        <div class="left fl">
            <p class="title-ind"><span>近7天新增志愿者</span></p>
            <Chart :configure="confVolunteer" class="char-div"></Chart>
        </div>
        <div class="right fr">
            <p class="title-ind"><span>近7天新增志愿团队</span></p>
            <Chart :configure="confVolunteam" class="char-div"></Chart>
        </div>
    </div>

    <div class="content mt15" style="padding: 20px;background: #fff">
        <p class="title-ind"><span>最近一月志愿活动参与数量统计</span></p>
        <Chart :configure="confPrevMonth" class="char-div"></Chart>
    </div>
</div>
</template>
<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import Chart from "@components/groupChart/groupChart.vue";
import {
    getVolunteerSurveyCount,
    getCountLatelyVolunteer,
    getCountLatelyVolunteerTeam} from '@service/tool';
import {getBrokenLineActivity} from  '@service/activity'

@Component({ components: {Chart} })
export default class VolunteerView extends Vue {
    // config 近7天新增志愿者
    private confVolunteer = <any>{
        data: [], //动态数据
        seriesName: ["志愿者数"], //系列名称
        seriesType: ["line", "line"], //系列类型
        lengedPosition: ["bottom", "", "", "center"], // 上,右,下,左
        yCompany: ["单位：人"], // 如果不设置单位默认为个
        xRotate:30,
        interval: 2
    }
    // config 近7天新增志愿团队
    private confVolunteam = <any>{
        data: [/*{ ydata: "4.5", series: [12] }*/], //动态数据
        color: ["#987de6", "#13d89e"], //颜色数组
        seriesName: ["自发布", "企业添加"], //系列名称
        seriesType: ["line", "line"], //系列类型
        isLenged: true, //是否开启图例
        lengedPosition: ["top", "", "", "center"], // 上,右,下,左
        // isLable:true,
        yCompany: ["单位：个"], // 如果不设置单位默认为个
        xRotate:15,
        interval: 2,
    }
    // config 最近一月志愿活动参与数量统计
    private confPrevMonth = <any>{
        data: [], //动态数据
        color: ["#987de6", "#13d89e"], //颜色数组
        seriesName: ['数量'], //系列名称
        seriesType: ["line", "line"], //系列类型
        isLenged: false, //是否开启图例
        lengedPosition: ["top", "", "", "center"], // 上,右,下,左
        // isLable:true,
        yCompany: ["单位：人"], // 如果不设置单位默认为个
        xRotate:15,
        interval: 2,
    }
    // 志愿者总数
    private countVolunteer = <any>{};
    // 志愿团队总数
    private countVolunteerTeam = <any>{};
    private countVolunteerTeamClassify = <any>[];

    created () {
        this.getVolunteerSurveyCount();
        this.getCountLatelyVolunteer();
        this.getCountLatelyVolunteerTeam();
        this.getBrokenLineActivity();
    }

    // 获取志愿者概况统计
    private getVolunteerSurveyCount () {
        getVolunteerSurveyCount().then((res:any) => {
            if (res.code === 0) {
                this.countVolunteer = res.data.countVolunteer;
                this.countVolunteerTeam = res.data.countVolunteerTeam
                this.countVolunteerTeamClassify = res.data.countVolunteerTeamClassify
            }
        })
    }

    // 获取最近7天新增志愿者
    private getCountLatelyVolunteer () {
        getCountLatelyVolunteer().then((res:any) => {
            if (res.code === 0) {
                this.confVolunteer.data = res.datas
            }
        })
    }

    // 获取最近7天发布志愿者团队
    private getCountLatelyVolunteerTeam () {
        getCountLatelyVolunteerTeam().then((res:any) => {
            if (res.code === 0) {
                this.confVolunteam.data = res.datas
            }
        })
    }

    // 获取最近一月志愿活动参与数量统计
    private getBrokenLineActivity () {
        getBrokenLineActivity({type: 'ACTIVITY_TYPE_VOLUNT'}).then((res:any) => {
            if (res.code === 0) {
                this.confPrevMonth.data = res.datas
            }
        })
    }
}

</script>
<style lang="scss" scoped>
.volunteers-view {
    background: #f0f3fa;
}
.list {
        height: 150px;
        background: #fff;
        text-align: center;
        span {
            font-size: 26px;
            display: block;
            margin-top: 35px;
        }
        p {
            font-size: 16px;
            color: #263b4d;
        }
        .ind {
            position: relative;
            :after {
                position: absolute;
                top: 50%;
                right: 0;
                width: 1px;
                height: 80px;
                margin-top: -45px;
                content: "";
                border-right: 1px solid #dee3ed;
            }
            span {
                color: red;
            }
        }
        .box {
            span {
                color: #23a1ee;
            }
        }
    }
.content {
    .title-ind {
        position: relative;
        padding:15px 15px 15px 10px;
        color: #263b4c;
        font-size: 16px;
        font-weight: bold;
    }
    .left {
        position: relative;
        width: 50%;
        padding: 20px;
        background: #fff;
    }
    .right {
        position: relative;
        width: 50%;
        padding: 20px;
        background: #fff;
    }
}
.char-div {
    height: 400px;
}
</style>