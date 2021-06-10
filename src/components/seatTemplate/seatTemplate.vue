<!--
 * @Author: 陈艳玲
 * @since: 2019-06-20 15:21:12
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-13 17:53:38
 -->
<template>
    <div class="template">
        <Modal
                v-model="templateShow"
                :title="tempState==='view'?'查看座位模板':'编辑座位模板'"
                width="1050px" class="template-warp" @on-cancel="onClose" :mask-closable="false" footer-hide>
            <div class="topic">
                <Form class="form" inline :label-width="70" ref="templateForm" :model="templateData"
                      :rules="ruleValidate1">
                    <FormItem label="模板编号" v-if="tempState=='view'">
                        <Input type="text" readonly v-model="templateData.name" style="width: 100px"/>
                    </FormItem>
                    <FormItem label="行数" prop="row">
                        <InputNumber :min="1" :max="100" v-if="tempState=='view'" readonly
                                     v-model="templateData.row" style="width: 90px"/>
                        <InputNumber :min="1" :max="100" v-else v-model="templateData.row" style="width: 90px"/>
                    </FormItem>
                    <FormItem label="列数" prop="col">
                        <InputNumber :min="1" :max="100" v-if="tempState=='view'" readonly
                                     v-model="templateData.col" style="width: 90px"/>
                        <InputNumber :min="1" :max="100" v-else v-model="templateData.col"
                                     style="width: 90px"/>
                    </FormItem>
                    <FormItem label="排序" required>
                        <Input :value="templateData.sort=='0'?'从左到右':'从右到左'" style="width: 90px" readonly v-if="tempState=='view'" />
                        <Select style="width: 90px" v-model="templateData.sort" @on-change="getTemplateSort" v-else>
                            <Option value="0">从左到右</Option>
                            <Option value="1">从右到左</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="容纳人数" prop="capacity">
                        <InputNumber :min="1" type="number" placeholder="1" readonly
                                     v-model="templateData.capacity" style="width: 90px"/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" v-if="tempState=='edit'" @click="createTemplate">生成模板</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="title">舞台/荧幕</div>
            <div class="seat-legend">
                <div class="item">
                    <i class="sit-item fl"></i>有座
                </div>
                <div class="item">
                    <i class="curr sit-item fl"></i>无座
                </div>
            </div>
            <div class="box-seat clearfix">
                <!--<ul class="sit-line " style="display: inline-block" v-if="templateData.seat.length">-->
                    <!--<li v-for="(item,index) in templateData.row" :key="item">-->
                        <!--{{index+1}}-->
                    <!--</li>-->
                <!--</ul>-->
                <div class="sit-list clearfix" v-for="(row,rowIndex) in templateData.seat" :key="rowIndex">
                    <p class="sit-l" v-if="row[0].realRow">{{row[0].realRow}}</p>
                    <div class="sit-r" v-if="tempState=='view'" >
                        <i :class="col.status==0 ? 'curr' : '' " class="sit-item "
                           v-for="(col,colIndex) in templateData.seat[rowIndex]"
                           :key="colIndex"><span v-if="col.status != '0'">{{col.realCol}}</span></i>
                    </div>
                    <div class="sit-r" v-else >
                        <i :class="col.status==0 ? 'curr' : '' " class="sit-item "
                           v-for="(col,colIndex) in templateData.seat[rowIndex]"
                           :key="colIndex" @click="setSit(rowIndex,colIndex,col.status)"><span v-if="col.status != '0'">{{col.realCol}}</span></i>
                    </div>
                </div>
            </div>
            <div class="footer">
                <Button class="ml20" type="primary" @click="saveTemplate" v-if="tempState==='edit'">保存</Button>
                <Button class="ml20" type="primary" v-if="viewEdit" @click="goEdit">修改</Button>
                <Button class="ml20" @click="onClose">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script lang='ts'>
    /**
     * * 使用示例：
     *
     * <seatTemplate :show="templateShow" :state='edit' :footer="true" :data="templateData" @getData="getTemplate" @onClose="templateShow=false"></seatTemplate>
     * 参数
     * show:显示隐藏模板
     * state:edit 编辑和保存模板  view 查看模板
     * footer:false 默认false 设置true  点击查看的时候显示修改按钮
     * data模板的回显值 （查看模板和编辑模板时候需要传值，新增不需要）
     * data:{
     *     id:id , 模板id
     *     name:templateName,  模板名称
     * }
     * 事件
     * @onClose 必须监听弹窗关闭时的事件，然后将 show 参数置为false,否则会有问题
     */
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {saveSeatTemplate, seatTemplateView,seatTemplateInfo, seatTemplateDelete} from "@service/common";

    const list = [
        {
            name: '周一',
            data: [{time: [], remarks: '', price: 0}]
        },
        {
            name: '周二',
            data: [{time: [], remarks: '', price: 0}]
        },
        {
            name: '周三',
            data: [{time: [], remarks: '', price: 0}]
        },
        {
            name: '周四',
            data: [{time: [], remarks: '', price: 0}]
        },
        {
            name: '周五',
            data: [{time: [], remarks: '', price: 0}]
        },
        {
            name: '周六',
            data: [{time: [], remarks: '', price: 0}]
        },
        {
            name: '周日',
            data: [{time: [], remarks: '', price: 0}]
        }
    ];
    @Component({components: {}})
    export default class seatTemplate extends Vue {
        private templateShow: boolean = false;
        private templateData: any = {
            name: '',//模板名称
            id: '',//模板id
            row: 1,//行
            col: 1,//列
            capacity: 1,//容纳人数
            seat: [],//座位
            sort: "0",//0:从左到右; 1:从右到左
            seatStatus: ''//每个座位状态之间 逗号 隔开 eg: 0,1
        };
        // 获取父组件的模板信息{id 模板id,name 模板名称}
        @Prop() private data!: object;

        @Watch('data')
        getData(data: any) {
            if(data.resourceType){
                this.templateData.activityId=data.activityId;
                this.templateData.resourceId=data.resourceId;
                this.templateData.resourceType=data.resourceType;
            }else {
                this.templateData.id = data.id;
                this.templateData.name = data.name;
            }
        }

        @Prop() private show!: boolean;

        //显示弹窗
        @Watch('show')
        getTemplateShow(value: boolean) {
            this.templateData.seat = [];
            this.templateShow = value;
            this.tempState=this.state;
            if (this.templateData.id || this.templateData.resourceType) {
                this.getTemplateView();
            }
            this.viewEdit = this.footer || false;
        }

        //监听弹窗的显示方式 edit: 编辑修改   view: 查看
        private tempState: string = '';
        @Prop() private state!: string;
        @Watch('state')
        getMethod(value: string) {
            this.tempState = value;
            if (this.templateData.id || this.templateData.resourceType) {
                this.getTemplateView();
            }
        }

        //footer:true 查看时需要显示修改按钮
        private viewEdit: boolean = false;
        @Prop() private footer!: boolean;
        @Watch('footer')
        getViewStatus(value: boolean) {
            this.viewEdit = value;
        }

        // 弹窗关闭时
        private onClose() {
            this.$emit("onClose", false);
            (this.$refs.templateForm as any).resetFields();
            this.templateData.seat = [];
            this.viewEdit = false;
        }

        //验证
        private ruleValidate1: any = {
            row: [{required: true, message: "请输入模板行数"}],
            col: [{required: true, message: "请输入模板列数"}]
        };

        /**
         * 设置座位
         * @param rowIndex 行
         * @param colIndex 列
         * @param status   座位状态 0:无座; 1:有座
         */
        setSit(rowIndex: any, colIndex: any, status: any) {
            (this.templateData as any).seat[rowIndex][colIndex].status = (status == '1' ? '0' : '1');
            // 判断状态来决定容纳数量的加减，或许会比双循环计算效率高一些？
            if (status == '1') {
                this.templateData.capacity--;
            } else {
                this.templateData.capacity++;
            }
            this.countColIndex(rowIndex);
        }
        /**
         * 计算座位下标数据
         */
        private countColIndex(rowIndex: any){
            // debugger
            // @ts-ignore
            let oldList = this.templateData.seat[rowIndex];// 需要变更下标的行数据
            let rowList = (this.templateData.sort == '1') ? oldList.reverse() : oldList;
            let col = 1;
            rowList.map((row:any)=>{
                // 有座的时候 计算下标
                if(row.status == '0'){
                    row.realCol = 0;
                } else {
                    row.realCol = col;
                    col++;
                }
                return row;
            });
            // 等于1 说明这一行被清空了
            if(col < 2){
                // 如果不为1 说明这一行重新被启用，没有办法，必须进行遍历了  o(╥﹏╥)o
                let realRow = 1;
                this.templateData.seat.forEach((row:any) => {
                    // 当前行是否为空行
                    let isEmpty = true;
                    for(let i = 0,len = row.length;i < len ; i++){
                        if(row[i].realCol){
                            isEmpty = false
                        }
                    }
                    if(isEmpty){
                        row[0].realRow = 0;
                        row[row.length-1].realRow = 0;
                    } else {
                        // 不为空行时，补齐当前下标
                        row[0].realRow = realRow;
                        row[row.length-1].realRow = realRow;
                        realRow++;
                    }
                });
            }
            // 修改完下标后 在转换为原本的升序 or 降序数据方式
            // @ts-ignore
            this.templateData.seat[rowIndex] = (this.templateData.sort == '1') ? rowList.reverse() : rowList;

        }

        //创建模板
        createTemplate() {
            let _this = this;
            _this.templateData.seat = [];
            for (let row = 1; row <= _this.templateData.row; row++) {
                let colList: Array<object> = [];//col列集合
                for (let col = 1; col <= _this.templateData.col; col++) {
                    colList.push({
                        realCol: col,
                        col: col,
                        row: row,
                        realRow: row,
                        name: '',
                        status: '1'
                    })
                }
                if (_this.templateData.sort === "0") {
                    _this.templateData.seat.push(colList);
                } else {
                    _this.templateData.seat.push(colList.reverse());
                }
            }
            // 创建成功后计算容纳人数
            this.templateData.capacity = _this.templateData.row * _this.templateData.col;
        }

        goEdit() {
            this.tempState = "edit";
            this.viewEdit = false;
        }

        //保存模板
        saveTemplate() {
            let _this = this;

            //生成模板名称
            let name = (new Date()).getTime();
            (this.templateData as any).name = name;

            //获取所有座位的状态0:无座; 1:有座
            let statusList: Array<object> = [];
            for (let row = 0; row < _this.templateData.seat.length; row++) {
                for (let col = 0; col < (_this.templateData as any).seat[row].length; col++) {
                    statusList.push((_this.templateData as any).seat[row][col].status);
                }
            }
            (this.templateData as any).seatStatus = statusList.join(',');
            //提交保存座位模板
            (_this.$refs.templateForm as any).validate((valid: any) => {
                if (valid && _this.templateData.seat.length>0) {
                    saveSeatTemplate(_this.templateData).then((res: any) => {
                        if (res.code === 0) {
                            this.$emit('getData', res.data);
                            (_this.data as any).templateId = res.data.ID || "";
                            (_this.data as any).templateName = res.data.NAME || "";
                            _this.$Message.success('模板保存成功');
                            this.onClose();
                        }
                    })
                } else {
                    _this.$Message.error('请求模板信息填写完整并生成模板');
                }
            })
        }

        //获取模板排序 0:从左到右; 1:从右到左
        getTemplateSort(value: any) {
            (this.templateData as any).sort = value
        }

        //获取模板详情
        getTemplateView() {
            let _this = this;
            _this.templateData.seat = [];
            if((_this.templateData as any).resourceType){
                let info={
                    activityId:(_this.templateData as any).activityId,
                    resourceId:(_this.templateData as any).resourceId,
                    resourceType:(_this.templateData as any).resourceType
                }
                seatTemplateInfo(info).then((res: any) => {
                    _this.templateData = res.data;
                    (_this.templateData as any).activityId=info.activityId;
                    (_this.templateData as any).resourceId=info.resourceId;
                    (_this.templateData as any).resourceType=info.resourceType;
                    _this.templateData.capacity = res.data.capacity ? res.data.capacity : 0;
                });
            }else {
                seatTemplateView({id: (this.templateData as any).id}).then((res: any) => {
                    _this.templateData = res.data;
                    _this.templateData.capacity = res.data.capacity ? res.data.capacity : 0;
                });
            }
        }

        created() {
            this.templateShow = this.show;
            this.tempState = this.state;
            this.viewEdit = this.footer;
            //获取模板详情信息
            if (this.templateData.id) {
                this.templateData.name = (this.data as any).name;
                this.templateData.id = (this.data as any).id;
                this.getTemplateView();
            }
        }

        mounted() {

        }
    }
</script>

<style lang='scss' scoped>
    .template-warp {
        position: relative;
        .topic {
            width: 100%;
        }
        .title {
            width: 100%;
            height: 30px;
            background: #f2f4f7;
            margin: 15px 0;
            text-align: center;
            line-height: 30px;
            border-radius: 0 0 30px 30px;
        }
        .box-seat {
            position: relative;
            max-width: 800px;
            height: 300px;
            overflow: auto;
        }
        .sit-line {
            margin-left: 35px;
            width: 24px;
            background: #f2f4f7;
            color: $font06;
            border:1px solid #f2f4f7;
            border-radius: 10px;
            li{
                height: 30px;
                line-height: 30px;
                text-align: center;
            }
        }
        .sit-list {
            position: relative;
            max-width: 725px;
            margin: 5px auto;
            text-align: center;
            line-height: 24px;
            .sit-l {
                position: absolute;
                left: 0;
                width: 24px;
                height: 24px;
                color: $font06;
                background: #f2f4f7;
                border:1px solid #f2f4f7;
            }
            .sit-r {
                display: inline-block;
                width: auto;
                margin-left: 40px;
                white-space: nowrap;
            }
        }
        .sit-item {
            cursor: pointer;
            display: inline-block;
            width: 25px;
            height: 24px;
            margin-right: 5px;
            color: $lightGray;
            background: #ccc;
            background: url(../../assets/image/sitBg.png);
            vertical-align: top;
            &.curr {
                background: url(../../assets/image/sitNoBg.png) !important;
            }
        }
        .seat-legend {
            position: absolute;
            right: 50px;
            top: 190px;
            width: 100px;
            height: 60px;
            .item {
                height: 30px;
            }
        }
        .footer {
            margin-top: 40px;
            text-align: center;
        }
    }
</style>
