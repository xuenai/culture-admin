<template>
    <div class="activity">
        <div class="add-content-detail-title mt20">
            <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 基本信息</p>
            <div class="add-content-detail-content">
                <Form :model="formItem" :label-width="100">
                    <FormItem label="创建者" required>
                        <Input
                        placeholder="智游泸州"
                        style="width: 250px"
                        v-model="formItem.author"
                        />
                    </FormItem>
                    <FormItem label="活动名称" required>
                        <Input
                        placeholder="请输入活动名称"
                        style="width: 250px"
                        v-model="formItem.activityName"
                        />
                        <span class="prompt ml20">50字以内</span>
                    </FormItem>
                    <FormItem label="活动分类" required>
                        <Select style="width: 250px">
                            <Option
                                v-for="item in columnList"
                                :value="item.value"
                                :key="item.value"
                            >{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="活动场所" required>
                        <Select
                        placeholder="请选择活动场所，可多选"
                        multiple
                        style="width:250px">
                            <Option
                            v-for="item in placeList"
                            :value="item.value"
                            :key="item.value"
                            >
                            {{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="活动标签" required>
                        <!-- <Tag
                        v-for="item in count"
                        :key="item"
                        checkable
                        :name="item"
                        >
                        {{ item + 1}}
                        </Tag> -->
                        <span class="tags">自然风景区</span>
                        <span class="tags">自然风景区</span>
                        <Button icon="ios-add" type="dashed" size="small" @click="modelShow01()">添加标签</Button>
                        <Modal v-model="showModel01" footer-hide>
                            <Form class="form" ref="formInline" inline :label-width="80">
                                <FormItem label="新增标签" prop="name">
                                    <Input type="text" v-model="condition.name" placeholder="输入标签" style="width: 200px" />
                                    <Button class="ml20" type="primary">确认添加</Button>
                                    <Button class="ml20">取消</Button>
                                </FormItem>
                            </Form>
                        </Modal>
                    </FormItem>
                    <FormItem label="活动日期" required>
                        <DatePicker
                        :value="value2"
                        format="yyyy/MM/dd"
                        type="daterange"
                        placement="bottom-end"
                        placeholder="请选择活动起始日期"
                        style="width: 200px"
                        >
                        </DatePicker>
                    </FormItem>
                    <FormItem label="活动时间" required>
                        <TimePicker
                        :value="activityTime"
                        format="HH:mm:ss"
                        type="timerange"
                        confirm
                        placement="bottom-end"
                        placeholder="请选择活动起始时间"
                        style="width: 200px"
                        ></TimePicker>
                    </FormItem>
                    <FormItem label="联系电话">
                        <Input
                        placeholder="请输入联系电话"
                        style="width: 250px"
                        />
                    </FormItem>
                    <FormItem label="活动排序">
                        <Input
                        placeholder="9999"
                        style="width: 250px"
                        />
                    </FormItem>
                    <div class="mt20">
                        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 活动设置</p>
                        <div class="add-content-detail-content">
                            <FormItem label="活动库存" required>
                                <Input
                                placeholder="请输入库存数"
                                style="width: 250px"
                                />
                            </FormItem>
                            <FormItem label="限购数量" required>
                                <Input
                                placeholder="请输入限购数量"
                                style="width: 250px"
                                />
                            </FormItem>
                            <FormItem label="备注说明">
                                <Input
                                type="textarea"
                                style="width: 250px;"
                                :autosize="{minRows: 5,maxRows: 10}"
                                placeholder="请输入活动参与成功需要注意的特殊信息"
                                />
                            </FormItem>
                        </div>
                    </div>
                    
                    <div class="mt20">
                        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 活动单位</p>
                        <div class="add-content-detail-content">
                            <FormItem label="主办单位" required>
                                <Input
                                placeholder="请输入主办单位名称"
                                style="width: 250px"
                                />
                            </FormItem>
                            <FormItem label="协办单位">
                                <Input
                                placeholder="请输入协办单位名称"
                                style="width: 250px"
                                />
                            </FormItem>
                            <FormItem label="承办单位">
                                <Input
                                placeholder="请输入承办单位名称"
                                style="width: 250px"
                                />
                            </FormItem>
                        </div>
                    </div>
                    <div class="mt20">
                        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 活动介绍</p>
                        <div class="add-content-detail-content">
                            <FormItem label="活动主图" class="checkboxStyle" >
                               <Upload></Upload>
                            </FormItem>
                            <FormItem label="活动介绍">
                                <div class="uedit">
                                    <Ueditor :content="datas.introduce" bind="datas.introduce" id="uedit1"></Ueditor>
                                </div>
                            </FormItem>
                        </div>
                    </div>
                    <FormItem>
                        <Button type="primary">确认</Button>
                        <Button style="margin-left: 8px">取消</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { mount } from '@vue/test-utils'
import BaseTable from "@components/baseTable/baseTable.vue"
import Ueditor from "@components/ueditor/ueditor.vue"
import Upload from "@components/upload/upload-image.vue"
@Component({
    components:{
        BaseTable,
        Ueditor,
        Upload
    }
})
export default class FreeBooking extends Vue {
    private index = 0
    //表单
    private formItem: any = {
        author: "",
        activityName: ""
    }
    //活动日期
    private value2: any = ['2015-09-08', '2019-02-15']
    private activityTime: any = ['09:41:00', '12:00:00']
    //对话框
    private showModel01: boolean = false;
    private : boolean = false;
    private loading: boolean = true
    private data: any = {
        header: [],
        list: [],
        placeType: []
    }
    // 活动分类
    private columnList = [
        {
        name: "电影院",
        code: "01",
        value: 1
        },
        {
        name: "广场",
        code: "02",
        value: 2
        }
    ]
    // 活动场所
    private placeList = [
        {
            value: '测试1',
            label: '测试1'
        },
        {
            value: '测试2',
            label: '测试2'
        },
        {
            value: '测试3',
            label: '测试3'
        }
    ]
    
    //表格
    private columns: any = [];
    // 富文本
    private datas: object={
        topicName:'姥姥说',
        topicImgs:['http//placehold.it/200x100','http//placehold.it/200x100'],
        startDate:'2019-05-30',
        endDate:'2019-06-01',
        startTime:'12:00:00',
        endTime:'16:00:00',
        introduce:'',
        rule:'话题规则内容',
        sort:1
    }
     // 表格(弹出)
    private condition: any = {
        phone: "",
        name: "",
        sex: 0
    }
    
    // 分页
    private tableConfig: any = {
        page: {
        currPage: 1,
        pageSize: 10,
        total: 6
        },
        pagePosition: "right"
    }
    // 提交查询
    private handleSubmit() {
        this.getList()
    }
    // 获取列表数据的方法
    private getList() {
        this.data = {
        header: [
            {
            title: "序号",
            key: "num"
            },
            {
            title: "头像",
            key: "headerImg",
            render: (h: any, params: any) => {
                return h("span", params.row.headerImg);
            }
            },
            {
            title: "手机号",
            key: "phone"
            },
            {
            title: "昵称",
            key: "name"
            },
            {
            title: "性别",
            key: "sex"
            },
            {
            title: "所在地区",
            key: "are"
            },
            {
            title: "会员等级",
            key: "leav"
            },
            {
            title: "积分",
            key: "jf"
            },
            {
            title: "时间",
            key: "time"
            }
        ],
        list: [
            {
            id: 22,
            num: 12,
            headerImg: 12,
            phone: 12,
            name: 12,
            sex: 12,
            are: 12,
            leav: 12,
            jf: 12,
            time: 12
            }
        ]
        };
        this.loading = false;
    }
    // 获取关联场所数据
    private getPlaceList() {
        let _that = this
        this.data = {
        columns12: [
                {
                title: '活动信息',
                slot: 'name',
                width: 170
                },
                {
                title: '活动方式',
                key: 'activityType'
                },
                {
                title: '活动分类',
                key: 'activityClass'
                },
                {
                title: '创建者',
                key: 'authors'
                }
            ],
            data6: [
            {
                name: '经开区文化馆免费',
                src: 'http://image.test.jkxds.net/resize3_126x84//images/product/20190523/5f1d220a-1358-4fd3-8a57-2f11f5a845a4.jpg',
                activityType: "网上下单",
                activityClass: "赛事",
                authors: '景安静去博物馆'
            },
            {
                name: '经开区文化馆免费',
                src: 'http://image.test.jkxds.net/resize3_126x84//images/product/20190523/5f1d220a-1358-4fd3-8a57-2f11f5a845a4.jpg',
                activityType: "网上下单",
                activityClass: "赛事",
                authors: '景安静去博物馆'
            },
            {
                name: '经开区文化馆免费',
                src: 'http://image.test.jkxds.net/resize3_126x84//images/product/20190523/5f1d220a-1358-4fd3-8a57-2f11f5a845a4.jpg',
                activityType: "网上下单",
                activityClass: "赛事",
                authors: '景安静去博物馆'
            }
        ],
        // 关联场所
        placeType : [
            {
                value: '电影院',
                name: '电影院'
            },
            {
                value: '0',
                name: '云站点联盟'
            },
            {
                value: '电影院2',
                name: '电影院2'
            },
            {
                value: '电影院3',
                name: '电影院3'
            }
        ]
        }
    }
    mounted () {
        this.getList()
        this.getIndex()
        this.getPlaceList()
    }
    //弹出框
    modelShow01(){
        this.showModel01 = true
    }
    //   座位模板
    getIndex(){
        if (!(this.index as number)){
            this.index=1
        }else{
            this.index++
        }
        return this.index
    }
    private parentList: any = [{
        childList: [{
            index: 1,
            childName: "1-1"
            }, {
            index: 2,
            childName: "1-2"
            }, {
            index: 3,
            childName: "1-3"
            }, {
            index: 4,
            childName: "1-4"
            }, {
            index: 5,
            childName: "1-5"
            }, {
            index: 6,
            childName: "1-6"
            }, {
            index: 7,
            childName: "1-7"
            }, {
            index: 8,
            childName: "1-8"
            }, {
            index: 9,
            childName: "1-9"
            }, {
            index: 10,
            childName: "1-10"
            }, {
            index: 11,
            childName: "1-10"
            }, {
            index: 12,
            childName: "1-10"
            }, {
            index: 13,
            curr: true,
            childName: "1-10"
            }, {
            index: 14,
            curr: true,
            childName: "1-10"
            }, {
            index: 15,
            curr: true,
            childName: "1-10"
            }, {
            index: 16,
            childName: "1-10"
            }, {
            index: 17,
            childName: "1-10"
            }, {
            index: 18,
            childName: "1-10"
            }, {
            index: 19,
            childName: "1-10"
            }, {
            index: 20,
            childName: "1-10"
            }, {
            index: 21,
            childName: "1-10"
            }, {
            index: 22,
            childName: "1-10"
            }
        ]
    },
    {
        childList: [{
            index: 1,
            childName: "2-1"
        }, {
            index: 2,
            childName: "2-2"
        }, {
            index: 3,
            childName: "2-3"
        }, {
            index: 4,
            curr: true,
            childName: "2-4"
        }]
    },
    {
        childList: [{
            index: 1,
            childName: "3-1"
        }, {
            index: 2,
            childName: "3-2"
        }, {
            index: 3,
            childName: "3-3"
        }, {
            index: 4,
            childName: "3-4"
        }]
    },
    {
        childList: [{
            index: 1,
            childName: "4-1"
        }, {
            index: 2,
            childName: "4-2"
        }, {
            index: 3,
            childName: "4-3"
        }]
    },
    
    ]
}

</script>

<style lang='scss' scoped>

//基本信息
.add-content-detail-title{
    position: relative;
    padding: 0 15px;
    line-height: 40px;
    background: $bg01;
    font-size: $f14;;
    color: #1c2438;
    font-weight: bold;
    margin-bottom: 10px;
    .title-tool{
        position: relative;
        width: 100%;
        line-height: 16px;
        padding-left: 10px;
        margin-bottom: 20px;
        i{
        position: absolute;
        top: 0;
        left: -8px;
        font-size: 20px;
        color: $theme;
        }
    }
    .add-content-detail-content{
        padding: 0;
        padding-top: 10px;
        padding-bottom: 10px;
        border-top: 1px solid #dedede;
        .ivu-form-item{
            margin-bottom: 15px;
        }
        .ivu-select-multiple .ivu-tag{
            padding: 0 14px !important;
        }
        .prompt{
            font-size: $f12;
            color: #ccc;
        }
      
        .tags{
            width: 87px;
            height: 32px;
            color: $theme;
            background: $grayDark;
            border: 1px solid $theme;
            display: block;
            float: left;
            margin-right: 15px;
            text-align: center;
            border-radius: 5px;
        }
        .ivu-btn-dashed{
            width: 87px;
            height: 32px;
            color: $bg01;
            background: $theme;
            border: 1px solid $theme;
        }
        .uedit{
            position: relative;
            z-index: 1;
        }
        .check-sit{
            cursor: pointer;
        }
    }
}
.topic{
  width: 100%;
}
.title{
    width: 100%;
    height: 30px;
    background: #f2f4f7;
    margin: 15px 0;
    text-align: center;
    line-height: 30px;
    border-radius: 0 0 30px 30px;
}
.sit-list{
    width: 725px;
    margin: 5px auto;
    text-align: center;
    line-height: 24px;
    .sit-l{
        width: 24px;
        height: 24px;
        background: #ccc;
    }
    .sit-r{
        margin-left: 40px;
        .sit-item{
            display: block;
            width: 25px;
            height: 24px;
            margin-right: 5px;
            background: #ccc;
            background: url(./../../../../assets/image/sitBg.png);
            &.curr{
                background: url(./../../../../assets/image/sitNoBg.png) !important;
            }
        }
    }
}
.info-list{
    .img{
        margin: 10px 0;
    }
}
</style>
