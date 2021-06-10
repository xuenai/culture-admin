<template>
    <div class="head-container clearfix">
        <div class="head-img fl daq-no-photo">
            <img v-if="cover" :src="cover" class="cloud-img" alt="">
        </div>
        <div class="info fl ml20">
            <h2 class="title mt10">{{data.name}}</h2>
            <Button type="primary" ghost class="room-type">{{data.type||data.labelName}}</Button>
            <div class="address mt20">
                <span><i class="cloud-icon">&#xe606;</i>{{data.region}}{{data.address}}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";
    import {associationHeadInfo} from "@service/tool"

    @Component({
        components: {}
    })
    export default class edit extends Vue {
        @Prop() resourceType: any;
        private data: object = {};
        private cover:string = '';
        //头部场馆数据
        getCommunityData(id: any) {
            associationHeadInfo({id: id}).then((res: any) => {
                this.data = res.data;
                this.cover = res.data.images ? res.data.images.split(',')[0] : '';
            })
        }

        mounted() {
            this.getCommunityData(this.$route.query.communityId)
        }
    }
</script>

<style scoped lang="scss">
    .head-container {
        padding-bottom: 20px;
        border-bottom: 1px solid $borderLight;
        .head-img {
            border-radius: 5px;
            overflow: hidden;
            width: 160px;
            height: 120px;
        }
        .info {
            .title {
                font-size: 22px;
                font-weight: 600;
                color: $font01;
            }
            .room-type {
                min-width: 65px;
                height: 26px;
                line-height: 26px;
                padding: 0 5px;
                margin-top: 5px;
            }
            .address {
                color: $font04;
                font-size: 14px;
            }
        }
    }
</style>
