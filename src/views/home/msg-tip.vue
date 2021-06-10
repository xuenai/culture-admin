<template>
    <div class="msg-tip" v-if="data">
        <div class="tit">
            <h1 class="fl" v-html="(data.resourceType) ? data.title : '收到一条消息'"></h1>
            <i class="iconfont c-icon-guanbi fr" @click="close"></i>
        </div>
        <p class="time">{{data.createTime}}</p>
        <p class="des" v-html="(data.resourceType) ? (data.content || '无') : (data.title || '--')"></p>
        <span class="more fl" @click="toDetail">查看详细 ></span>
        <span class="more fr" @click="closeAll">关闭全部</span>
    </div>
</template>
<script lang='ts'>
    import {Component, Vue, Prop} from 'vue-property-decorator'
    import {getMsgDetail} from '@service/common'
    import {getToPathByWsMsg} from '@util/util';
    @Component
    export default class MsgTip extends Vue {
        //
        @Prop() data: any;
        // 关闭
        private close () {
            this.$emit('close')
        }
        private closeAll () {
            this.$emit('closeAll')
        }
        // 跳详情
        private toDetail () {
            let data = this.data
            let path = getToPathByWsMsg(data)
            this.$router.push({
                path
            })
            getMsgDetail({ id: data.id });
            this.close()
        }
    }
</script>
<style lang='scss' scoped>
.msg-tip {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 9999999;
    width: 320px;
    padding: 20px 20px 0 20px;
    border-radius: 4px;
    background: #fff;
    transition: .4s;
    border: 1px solid $borderLight;
    // box-shadow: 0 35px 50px 10px #ccc;

    .tit {
        display: inline-block;
        width: 100%;
        h1 {
            color: #263b4d;
            font-size: 14px;
            line-height: 14px;
        }
        i {
            margin-top: -2px;
            font-size: 12px;
            transition: .3s;
            color: #8ba0b3;
            cursor: pointer;
            &:hover {
                transform: rotate(180deg);
                text-shadow: 0 0 3px #666;
            }
        }
    }
    .time {
        color: #7d8c98;
        font-size: 12px;
        line-height: 30px;
        text-align: left;
    }
    .des {
        height: 84px;
        color: #5b6873;
        font-size: 12px;
        line-height: 20px;
        border-bottom: 1px solid #d5dae3;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        line-clamp:4;
        -webkit-box-orient: vertical;
    }
    .more {
        text-align: left;
        color: #5b6873;
        font-size: 12px;
        line-height: 40px;
        transition: .3s;
        cursor: pointer;
        &:hover {
            color: $theme;
        }
    }
}
</style>