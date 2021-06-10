<template>
    <div class="head-container clearfix">
        <div class="head-img fl daq-no-photo">
            <img :src="desc.images.split(',')[0]" class="cloud-img" alt="">
        </div>
        <div class="info fl ml20">
            <h2 class="title mt10">{{desc.name}}</h2>
            <Button type="primary" ghost class="room-type">{{desc.level|| '无星级'}}</Button>
            <div class="address mt20">
                <i class="cloud-icon">&#xe606;</i>
                {{desc.regionName}}{{desc.address}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {getHotelHeadDesc} from "@service/place";

    @Component({
        components: {}
    })
    export default class edit extends Vue {
        private desc:object={};
        //获取详情信息
        getHeadDesc(){
            getHotelHeadDesc({id:this.$route.query.hotelId}).then((res:any)=>{
                this.desc=res.data;
            })
        }
        mounted(){
            this.getHeadDesc();
        }

    }
</script>

<style scoped lang="scss">
    .head-container {
        padding-bottom: 20px;
        border-bottom:1px solid $borderLight;
        .head-img{
            border-radius: 4px;
            overflow: hidden;
            width: 160px;
            height: 120px;
        }
        .info{
            .title{
                font-size: 22px;
                font-weight: 600;
                color:$font01;
            }
            .room-type{
                width: 65px;
                height: 26px;
                line-height: 26px;
                padding:0;
                margin-top:5px;
                cursor: default;
                pointer-events: none;
            }
            .address{
                color:$font04;
                font-size: 14px;
            }
        }
    }
</style>
