<template>
    <div class="dishonesty-list" v-if="list.length">
        <div class="count" v-if="count">
            <template v-if="count.creditStatus === 'LOSE_CREDIT'">
                <span>已失信</span>
                <Divider type="vertical" />
            </template>
            失约率：<span>{{count.losePercent}}%</span>
            <Divider type="vertical" />
            失约数：{{count.losePromiseCount}}次
            <Divider type="vertical" />
            总预约数：{{count.total}}次
        </div>

        <Timeline class="time-line">
            <TimelineItem v-for="(item, i) in list" :key="i">
                <p class="time">{{item.modifyTime}}</p>
                <p class="content">{{item.losePromiseDesc + ' ' + item.ruleName + ' ' + item.resourceName}}</p>
            </TimelineItem>
        </Timeline>
    </div>
</template>
<script lang="ts">
    /**
     * 使用prop传参 :params={phone: 18381671514}
     * 外部通过监听getList事件，判断内部是否有数据
     * */

    import { Vue, Prop, Component, Watch } from "vue-property-decorator";
    import {getDishonestyList, getCreditUser} from '@service/common'

    @Component({
        components: {}
    })
    export default class DishonestyList extends Vue {
        @Prop() private params!: any;
        private list: Array<any> = [];
        private count: any = null;
        private userInfo: any = this.$store.state.app.userInfo;

        created() {
            this.getCreditUser()
            this.getDishonestyList()
        }
        get useParams() {
            return {
                platformChannel: 'cultural',
                platformCode: this.userInfo.siteCode,
                recordType: 'LOSE_PROMISE',
                ownerPlatform: 'OWN',
                ...this.params}
        }
        private getCreditUser() {
            getCreditUser(this.useParams).then((res:any) => {
                if (res.code === 0) {
                    res.data = res.datas[0]
                    res.data.total = res.data.losePromiseCount + res.data.keepPromiseCount
                    res.data.losePercent = (100 * res.data.losePromiseCount / res.data.total).toFixed(2)
                    res.data.creditStatusTxt = res.data.creditStatus === 'LOSE_CREDIT' ? '已失信' : '';
                    this.count = res.data
                }
            })
        }
        private getDishonestyList() {
            this.list = []
            getDishonestyList(this.useParams).then((res:any) => {
                if (res.code === 0) {
                    if (res.datas.length !== res.page.total) {
                        getDishonestyList({...this.useParams, pageSize: res.page.total, currPage: 1}).then((res:any) => {
                            if (res.code === 0) {
                                this.list = res.datas
                            }
                        })
                    } else {
                        this.list = res.datas
                        this.$emit('getList', this.list)
                    }
                }
            })
        }
    }
</script>
<style lang="scss" scoped="">
    .dishonesty-list {
        overflow: hidden;
        .count,
        .time-line {
            margin: 15px;
        }
        .count {
            span {
                color: red;
            }
        }
    }
</style>
