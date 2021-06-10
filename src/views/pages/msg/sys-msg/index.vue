<template>
    <div class="msg">
        <div class="p20 btn-box clearfix">
            <div class="clearfix left fl">
                <span class="fl" :class="{active: params.readStatus !== 0}" @click="changeStatus()">全部</span>
                <span class="fl" :class="{active: params.readStatus === 0}" @click="changeStatus(0)">未读 <i>{{unread}}</i></span>
            </div>
            <div class="fl right" v-if="unread"><span @click="setReaded" class="fl">全部设为已读</span></div>
        </div>
        <baseTable :configure="tableConfig" @getList="search" :sizeOpts="[5,10,15,25]" class="base-tb">
            <ul class="msg-list">
                <li class="type1 item" v-for="msg in list" :key="msg.id">
                    <div>
                        <h3 class="tit" :class="{readed: msg.readStatus === 1}">{{msg.title || '暂无'}}<span class="time fr">{{msg.createTime}}</span></h3>
                        <p class="des" v-if="msg.resourceType">{{msg.content}}</p>
                        <span class="more" @click="toDetail(msg)">查看详细 ></span>
                    </div>
                </li>
                <!--<li class="type2 item">
                    <div>
                        <h3 class="tit readed">你们想要的功能在V1.6.0都更新啦。快去看看吧！ <span class="time">2019年5月22日 18:24:32</span></h3>
                        <p class="des">
                            <router-link to="{}">费脑壳</router-link>提交了内容：<router-link to="{}">成都旅游攻略大全</router-link>请及时审理!
                    </p>
                        <router-link to="{}">查看详细 ></router-link>
                    </div>
                </li>-->
                <li class="item" v-if="list.length === 0"><p class="no-data">暂无数据！</p></li>
            </ul>
        </baseTable>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator'
    import BaseTable from "@components/baseTable/baseTable.vue"
    import {getMsgList, setAllRead} from "@service/common"
    import {getToPathByWsMsg} from '@util/util';
    import {getMsgDetail} from '@service/common'

    @Component({
        components: {
            BaseTable
        }
    })
    export default class SysMsg extends Vue {
        //
        private params = <any>{
            readStatus: ''
        }
        // 表格配置
        private tableConfig = <any>{
            page: {
                currPage: 1,
                pageSize: 5,
                total: 0
            },
            pagePosition: "left"
        };
        // 数据
        private list: Array<any> = []
        // 未读
        private unread: number = 0

        created () {
            this.changeStatus()
            this.getUnread()
        }
        // 跳详情
        private toDetail (data: any) {
            let path = getToPathByWsMsg(data)
            this.$router.push({
                path
            })
            getMsgDetail({ id: data.id });
        }

        // 消息状态点击切换
        private changeStatus (readStatus?: string) {
            this.params.readStatus = readStatus
            this.search()
        }

        // 获取未读
        private getUnread () {
            getMsgList({...this.params, readStatus: 0}).then((res:any) => {
                this.unread = res.page.total
            })
        }

        // 获取列表
        private search(page: any = this.tableConfig.page) {
            Object.assign(this.params, page);
            getMsgList(this.params).then((res:any) => {
                this.tableConfig.page = res.page
                this.list = res.datas
            })
        }

        // 设为已读
        private setReaded () {
            setAllRead().then((res:any) => {
                if (res.code === 0) {
                    this.$Message.success("操作成功！")
                    this.search()
                    this.getUnread()
                }
            })
        }
    }
</script>

<style lang='scss' scoped>
    .msg{
        padding:15px;
    }
    .clearfix:after {
        content: '';
        display: block;
        clear: both;
    }
    .p20 {
        padding: 20px;
    }

    .btn-box {
        background: #f0f3fa;
        div {
            margin-right: 20px;
            font-size: 12px;
            line-height: 28px;
            &.left {
                span:first-child {
                    border-right: 0;
                    border-radius: 5px 0 0 5px;
                }
                span:last-child {
                    border-left: 0;
                    border-radius: 0 5px 5px 0;
                    i {
                        background: #fc5252;
                        color: #fff;
                        padding: 3px 5px;
                        border-radius: 10px;
                    }
                }
            }
            &.right {
                span {
                    border-radius: 5px;
                    color: #23a1ee;
                    border-color: #23a1ee;
                }
            }
        }
        span {
            padding: 0 8px;
            border: 1px solid #adb6cc;
            cursor: pointer;
            &.active {
                color: #fff;
                background: #23a1ee;
                border-color: #23a1ee;
            }
        }
    }

    .msg-list {
        .item {
            margin-top: 15px;
            margin-left: -20px;
            padding: 20px;
            background: #f0f3fa;
            text-align: justify;
            div {
                width: 1050px;
            }
            .tit {
                color: #263b4d;
                font-size: 14px;
                line-height: 14px;
                &.readed {
                    color: #7d8c98;
                }
            }
            .time {
                color: #7d8c98;
                font-size: 12px;
            }
            .des {
                margin-top: 10px;
                color: #64737f;
                font-size: 12px;
                line-height: 21px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            &:last-child {
                margin-bottom: 20px;
            }
            .more {
                display: inline-block;
                margin-top: 12px;
                text-align: left;
                color: #5b6873;
                font-size: 12px;
                transition: .3s;
                cursor: pointer;
                &:hover {
                    color: $theme;
                }
            }
        }
    }

    .base-tb {
        padding-left: 20px;
    }
</style>
