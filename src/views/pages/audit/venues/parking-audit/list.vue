<template>
    <div class="venues-audit">
        <Tabs active-key="key1" class="tab-wrap" :animated="false" @on-click="setStatus">
            <Tab-pane label="全部" key="key1" ></Tab-pane>
            <Tab-pane :label="waitNum>0?waitLabel:'待审核'" key="key2" ></Tab-pane>
            <Tab-pane label="不通过" key="key3" ></Tab-pane>
        </Tabs>
        <Form :label-width="80" inline class="wrap">
            <FormItem class="item" label="编号">
                <i-input  placeholder="请输入编号" v-model="params.code"></i-input>
            </FormItem>
            <FormItem class="item" label="名称">
                <i-input  placeholder="请输入名称" v-model="params.name"></i-input>
            </FormItem>
            <FormItem class="item" label="审核状态" v-if="tabIndex===0">
                <Select class="w150" v-model="params.status" style="width:150px">
                    <Option value="" selected>全部</Option>
                    <Option value="4">待审核</Option>
                    <!--<Option value="5">审核中</Option>-->
                    <Option value="79">审核不通过</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="时间">
                <Date-picker type="daterange" @on-change="getDate" placement="bottom-start" placeholder="选择日期"></Date-picker>
                <Button type="primary" class="ml20" @click="getList">搜索</Button>
            </FormItem>
        </Form>
        <baseTable :configure="tableConfig" @getList="getList">
            <Table border :columns="tableData.headList" :data="tableData.bodyList" class="table" :loading="loading" @on-selection-change="setChecked">
                <template slot-scope="{row}" slot="name">
                    <router-link :to="{path:'/audit-parking-edit',query:{id:row.resourceId,resourceName:row.name}}" class="theme-blue">{{row.name}}({{row.code}})</router-link>
                </template>
                <template slot-scope="{row}" slot="integrity">
                    <Progress :percent="parseInt(row.percent)" :stroke-width="5"></Progress>
                </template>
                <template slot-scope="{row}" slot="status">
                    <div v-if="row.status == 1">
                        <span class="switchLabel">正常</span>
                        <span class="switchBox" @click="changeStatus(row,'禁用')">
                        <i-switch :value="row.status === 1"/>
                        <span class="cover"></span>
                    </span>
                    </div>
                    <div v-else-if="row.status == 2">
                        <span class="switchLabel">禁用</span>
                        <span class="switchBox" @click="changeStatus(row,'启用')">
                        <i-switch :value="row.status === 1"/>
                        <span class="cover"></span>
                    </span>
                    </div>
                    <div v-else-if="row.status==3">
                        草稿
                    </div>
                    <div v-else-if="row.status==4">
                        待审核
                    </div>
                    <div v-else-if="row.status==5">
                        审核中
                    </div>
                    <div v-else-if="row.status==6">
                        审核通过
                    </div>
                    <div v-else-if="row.status==7">
                        回退
                    </div>
                    <div v-else-if="row.status==8">
                        撤回
                    </div>
                    <div v-else-if="row.status==9">
                        终止
                    </div>
                    <div v-else-if="row.status==10">
                        等待回调
                    </div>
                </template>
                <template slot-scope="{row,index}" slot="action">
                    <router-link :to="{path:'/audit-parking-edit',query:{id:row.resourceId,resourceName:row.name}}" v-if="operates.includes('audit') && row.status==4" class="theme-blue action-btn">审核</router-link>
                    <a class="theme-blue action-btn ml5" v-if="operates.includes('process') " @click="getParkingAuditProcess(row.resourceId)">流程</a>
                    <router-link :to="{path:'/audit-parking-modify',query:{id:row.resourceId,type:'audit'}}" v-if="operates.includes('edit')&& row.status!=7 && row.status!=9 " class="theme-blue action-btn ml5">修改</router-link>
                    <a class="theme-blue action-btn ml5" v-if="operates.includes('delete')&& row.status!=4" @click="deleteRow(row,index)">删除</a>
                </template>
            </Table>
        </baseTable>
        <div class="operate text-center">
            <Button type="primary" v-if="operates.includes('batchDelete')" @click="deleteRow(checkedIds,-1)">批量删除</Button>
        </div>
        <Modal v-model="modal" title="审批流程" footer-hide>
            <auditProcess :data="processData"></auditProcess>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import baseTable from '@components/baseTable/baseTable.vue'
    import auditProcess from "@components/auditProcess/auditProcess.vue";
    import {getAuditResourceList,delVenuesAuditList,getAuditCountNum} from '@service/audit'
    import {updateStatus} from '@service/common'
    import {getParkingAuditProcess} from '@service/place'
    import {AppModule} from '@store/modules/app';
    @Component({
        components: {
            baseTable,
            auditProcess
        }
    })
    export default class vunuesAudit extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        private loading: boolean = true;
        private tableData:any={
            headList:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '停车场名称',
                    key: 'name',
                    slot:'name',
                    align: 'center',
                },
                {
                    title: '资料完整度',
                    key: 'integrity',
                    align: 'center',
                    slot: 'integrity'
                },
                {
                    title: '提交时间',
                    key: 'createTime',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '创建者',
                    key: 'userName',
                    align: 'center',
                },
                {
                    title: '审核状态',
                    key: 'status',
                    slot:'status',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    slot: 'action'
                }],
            bodyList:[]
        };
        private tabIndex:any=0;
        private params:object={
            type:'CONTENT_TYPE_PARKING',
            code:'',//编号
            name:'',//名称
            status:'',//审核状态
            startTime:'',//开始时间
            endTime:''//结束时间
        };
        //表格分页信息
        private tableConfig: any = {
            page: {
                currPage: 1,
                pageSize: 10
            },
            pagePosition: "right"
        };
        //表格数据
        getList(data:any=this.tableConfig.page){
            let _this = this;
            this.params = Object.assign(this.params, data); //搜索条件
            getAuditResourceList(this.params).then((res: any) => {
                if (res.code === 0) {
                    _this.tableData.bodyList = [];
                    _this.loading=false;
                    _this.tableData.bodyList=res.datas;
                    this.tableConfig.page = res.page;
                    this.getAuditCount();
                }
            });
        }

        private waitNum:any=0;//待审核
        //待审核数量/不通过数量
        private getAuditCount() {
            getAuditCountNum({
                type: 'CONTENT_TYPE_PARKING'
            }).then((res: any) => {
                this.waitNum = res.data.auditPending;//待审核
            });
        }
        /*S 删除行*/
        private checkedIds:string='';
        // 复选框
        private setChecked(e: any) {
            let checkedIds :any= [];
            e.map((item: any) => {
                checkedIds.push(item.id as Number);
            });
            this.checkedIds=checkedIds.join(',');
        }
        deleteRow(item:any,index:any){
            let _this:any=this;
            if (index === -1 && !this.checkedBox.length) {
                _this.$Message.error("请选择你要删除的厕所");
                return;
            }
            let config: any = {
                title: "操作提示",
                content: `确认要删除“${item.name ||
                "选中"}”厕所？删除后用户端将不再展示！`,
                okText: "确认",
                cancelText: "关闭",
                onOk: () => {
                    delVenuesAuditList({
                        ids:index==-1?_this.checkedIds:item.id,
                        type:'CONTENT_TYPE_VENUE' //场馆资源类型
                    }).then((res:any)=>{
                        if(res.code===0){
                            _this.$Message.success("删除成功");
                            _this.getList();
                        }
                    })
                }
            };
            this.$Modal.confirm(config);
        }
        /*E 删除行*/
        //  更新状态值
        private changeStatus(row: any, title: string) {
            let _this = this;
            let config: any = {
                title: "操作提示",
                content: "确认是否" + title + "？",
                okText: "确认",
                cancelText: "关闭",
                onOk: () => {
                    _this.adPosition(row);
                }
            };
            this.$Modal.confirm(config);
        }
        //   广告位开启、禁用
        private adPosition(row: any) {
            let _this = this;
            let status = 2;
            if (row.status == 2) {
                status = 1;
            }
            let param = {
                id: row.id,
                status: status,
                resourceType:(this.params as any).type
            };
            updateStatus(param).then((res: any) => {
                if (res.code === 0) {
                    this.$Message.success("更新成功!");
                    _this.getList()
                }
            });
        }
        //获取时间
        getDate(value:any){
            (this.params as any).startTime=value[0];
            (this.params as any).endTime=value[1];
        }
        //获取状态
        setStatus(index:any){
            let _this=this;
            _this.tabIndex=index;
            _this.loading=true;
            switch (index) {
                case 0:{
                    (this.params as any).status='';
                }break;
                case 1:{
                    (this.params as any).status='4';
                }break;
                case 2:{
                    (this.params as any).status='79';
                }break;
            }
            _this.getList();
        }
        //tab 状态待审核数量
        private waitLabel(h: any) {
            let _this = this;
            return h("div", [
                h("span", "待审核"),
                h("Badge", {
                    props: {
                        count: _this.waitNum
                    }
                })
            ]);
        }

        // 获取审核流程信息
        private modal: boolean = false;
        private processData: any = {};
        private getParkingAuditProcess(id: any) {
            this.modal = true;
            getParkingAuditProcess({ id: id }).then((res: any) => {
                this.processData = res.data;
            });
        }
        mounted(){
            let _this = this;
            _this.getList();
        }
    }
</script>
<style scoped lang="scss">
    .venues-audit {
        padding: 0 15px 15px;
        .wrap{
            background: $grayLight;
            margin-bottom: 15px;
            padding-top: 15px;
        }
        .page {
            float: right;
            margin-top: 20px;
        }
    }
</style>
