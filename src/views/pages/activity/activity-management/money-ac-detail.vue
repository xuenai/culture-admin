<template>
    <div class="list-panel">
        <Row class="item">
            <i-col span="2" class="item-name tit">基本信息</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动类型</i-col>
            <i-col span="22" class="item-content">{{ACTIVITY_TYPE[iData.type]}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动方式</i-col>
            <i-col span="22" class="item-content">{{ACTIVITY_METHOD[iData.method]}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">创建者</i-col>
            <i-col span="22" class="item-content">{{iData.createName}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动名称</i-col>
            <i-col span="22" class="item-content">{{iData.name}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动价格</i-col>
            <i-col span="22" class="item-content">￥{{iData.money}}元</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动分类</i-col>
            <i-col span="22" class="item-content">{{iData.activityClassifyName}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动标签</i-col>
            <i-col span="22" class="item-content">
                <span class="choice-tag active" v-for="tag in iData.labelNames" :key="tag.id">{{tag.labelName}}</span>
            </i-col>
        </Row>
        <Row class="item" v-if="iData.useStartTime && iData.useEndTime">
            <i-col span="2" class="item-name">活动时间</i-col>
            <i-col span="22" class="item-content">{{iData.useStartTime.slice(0,-3)}} - {{iData.useEndTime.slice(0,-3)}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动地址</i-col>
            <i-col span="22" class="item-content">{{iData.address}}</i-col>
        </Row>
        <Row class="item" v-if="iData.activityName">
            <i-col span="2" class="item-name">所属场所</i-col>
            <i-col span="22" class="item-content">{{iData.activityName}}</i-col>
        </Row>
        <Row class="item" v-if="iData.voluntTeamName">
            <i-col span="2" class="item-name">所属志愿团</i-col>
            <i-col span="22" class="item-content">{{iData.voluntTeamName}}</i-col>
        </Row>
        <Row class="item" v-if="iData.associationName">
            <i-col span="2" class="item-name">所属社团</i-col>
            <i-col span="22" class="item-content">{{iData.associationName}}</i-col>
        </Row>

        <!-- 添加图片 -->
        <Row class="item tit">
            <i-col span="2" class="item-name tit">添加图片</i-col>
        </Row>
        <Row class="item" v-if="iData.images && iData.images.length > 0">
            <i-col span="2" class="item-name">活动主图</i-col>
            <i-col span="22" class="item-content img-list">
                <p class="img" v-for="(img,imgIndex) in iData.images.split(',')" :key="imgIndex">
                    <img @click="viewImgWin(iData.images.split(','), imgIndex)" :src="img" alt>
                </p>
            </i-col>
        </Row>
        <Row class="item" v-if="iData.jumpType === 'ACTIVITY_JUMP_TYPE_EXTERNAL'">
            <i-col span="2" class="item-name">跳转至外部链接</i-col>
            <i-col span="22" class="item-content"><a :href="iData.jumpUrl" target="_blank">{{iData.jumpUrl}}</a></i-col>
        </Row>
        <Row class="item" v-else-if="iData.jumpType === 'ACTIVITY_JUMP_TYPE_INFO'">
            <i-col span="2" class="item-name">商品详情</i-col>
            <i-col span="22" class="item-content">
                <Table border :columns="columns1" :data="data1">
                    <template slot-scope="{ row }" slot="image">
                        <div class="img-box"><img :src="row.image" alt=""></div>
                    </template>
                    <template slot-scope="{ row }" slot="price">
                        ￥{{row.minSalePrice}} ～ ￥{{row.maxSalePrice}}
                    </template>
                </Table>
            </i-col>
        </Row>
        <PreviewPics v-model="imgView" :imgs="imgUrl" :currIndex="currIndex" ></PreviewPics>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {getTagDetail} from "@service/tool";
    import {getParentsRegion} from "@util/comm";
    import {PreviewPics} from '@components/index'
    import {ACTIVITY_METHOD, ACTIVITY_TYPE} from "@constant/index"
    @Component({
        components: {PreviewPics}
    })
    export default class ContentDetail extends Vue {
        @Prop() private data!: any;

        private ACTIVITY_METHOD = ACTIVITY_METHOD;
        private ACTIVITY_TYPE = ACTIVITY_TYPE;
        // 本页需要展示的数据集
        private iData: { [propName: string]: any } = {
            labelNames:[]
        };
        // 图片可显示
        private imgView:boolean = false;
        // 图
        private imgUrl: Array<string> = [];
        private currIndex = 0;

        private columns1: Array<any> = [
                {
                    title: '商品图',
                    align: 'center',
                    slot: 'image',
                    width: 140
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'productName'
                },
                {
                    title: '价格',
                    align: 'center',
                    slot: 'price'
                },
                {
                    title: '服务商',
                    align: 'center',
                    key: 'businessName'
                },
                {
                    title: '销售方式',
                    align: 'center',
                    key: 'saleTypeValue'
                }
        ]
        private data1:Array<any> = []

        @Watch("data", {immediate: true, deep: true})
        refreshData(data: any) {
            this.renderContent()
        }
        update(){
            this.renderContent()
        }

        // 回显数据
        private renderContent () {
            Object.assign(this.iData, this.data);
            if (this.iData && this.iData.region) {
                this.iData.address = getParentsRegion(this.iData.region).map((region:any) => region.baiduName).reverse().join('-') + '-' + this.iData.address
            }
            if (this.iData && this.iData.tag) {
                let allPromise = this.iData.tag.split(',').map((id: any) => this.getTagDetail(Number(id)))
                Promise.all(allPromise).then((res: Array<any>) => {
                    this.iData.labelNames = res.filter((label: any) => !!label)
                })
            }
            if (this.iData.jumpBody) {
                this.data1.push(JSON.parse(this.iData.jumpBody))
            }
        }

        // 预览图片
        private viewImgWin (src: Array<string> , idx: number) {
            this.imgUrl = src;
            this.imgView = true;
            this.currIndex = idx
        }

        // 获取标签详情
        private getTagDetail(id: number) {
            return new Promise((resolve, reject) => {
                getTagDetail({id}).then((res: any) => {
                    if (res.code === 0 && res.data) {
                        resolve(res.data)
                    } else {
                        resolve('')
                    }
                }).catch(e => resolve(''))
            })
        }
    }
</script>

<style scoped lang="scss">
    .img-box {
        width: 100px;
        height: 60px;
        padding: 0 10px;
        margin: 10px auto;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    .list-panel {
        margin-top: 10px;
        .item {
            padding: 10px 0;
            line-height: 25px;
            &.tit {
                border-top: 1px solid $borderLight;
            }
        }
        .red {
            vertical-align: middle;
        }
        .item-name {
            width: 150px;
            text-align: right;
            margin-right: 13px;
            font-weight: 600;
            color: $font01;
            &.tit {
                font-size: 1.2em;
            }
        }
        .item-content {
            width: 80%;
            color: $font05;
            .img {
                display: inline-block;
                width: 240px;
                height: 160px;
                border-radius: 4px;
                overflow: hidden;
                cursor: pointer;
                img {
                    width: 100%;
                }
                & + .img {
                    margin-left: 5px;
                }
            }
            &.simulate {
                p {
                    display: inline-block;
                    & + p {
                        margin-left: 20px;
                    }
                }
                .count {
                    margin-left: 3px;
                    width: 200px;
                    text-align: left;
                }
            }
        }
    }
</style>