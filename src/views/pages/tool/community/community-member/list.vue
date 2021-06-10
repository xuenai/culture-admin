<template>
    <div class="container pd15">
        <Head></Head>
        <Form class="wrap mt15" :label-width="80" inline>
            <FormItem class="item" label="关键字">
                <Input placeholder="姓名/职务" v-model="data.name" @on-enter="getList"/>
            </FormItem>
            <FormItem class="item" label="性别">
                <Select class="w150" v-model="data.sex" @on-change="getList">
                    <Option value="">全部</Option>
                    <Option value="0">女</Option>
                    <Option value="1">男</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="状态">
                <Select class="w150" v-model="data.status" @on-change="getList">
                    <Option value="" selected>全部</Option>
                    <Option value="1">正常</Option>
                    <Option value="2">禁用</Option>
                    <Option value="3">草稿</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="入团时间">
                <Date-picker type="daterange" placement="bottom-start" placeholder="入团时间" @on-change="getCreateTime"
                             :value="createTime"></Date-picker>
            </FormItem>
            <div class=" submit">
                <Button type="primary" @click="getList">搜索</Button>
                <router-link :to="{path:'/community-member-add',query:{communityId:data.associationId}}" class="btn-primary ml10">添加</router-link>
            </div>
        </Form>
        <baseTable :configure="tableConfig" @getList="getList">
            <Table class="table mt15" border :columns="tableData.headList" :data="tableData.bodyList"
                   :loading="loading" @on-selection-change="setChecked">
                <template slot-scope="{row,index}" slot="name">
                    <router-link tag="a" :to="{path:'/community-member-detail',query:{id:row.id,communityId:data.associationId}}">{{row.name}}</router-link>
                </template>
                <template slot-scope="{row,index}" slot="sex">
                    <span>{{row.sex||'未知'}}</span>
                </template>
                <template slot-scope="{row,index}" slot="duty">
                    <span>{{row.duty||'-'}}</span>
                </template>
                <template slot-scope="{row,index}" slot="startTime">
                    <span>{{row.startTime||'-'}}</span>
                </template>
                <template slot-scope="{row,index}" slot="joinTeamDate">
                    <span>{{row.joinTeamDate||'-'}}</span>
                </template>
                <template slot-scope="{row,index}" slot="sort">
                    <span v-if="!order">{{row.sort}}</span>
                    <InputNumber :min="1" :max="99999" :precision="0" v-else @on-change="changeSort(row)" v-model="row.sort"/>
                </template>
                <template slot-scope="{row,index}" slot="status">
                    <div v-if="row.status == 1">
                        <span class="switchLabel">正常</span>
                        <span class="switchBox" @click="changeStatus(row,'禁用')">
                        <i-switch :value="row.status == 1"/>
                        <span class="cover"></span>
                    </span>
                    </div>
                    <div v-else-if="row.status == 2">
                        <span class="switchLabel">禁用</span>
                        <span class="switchBox" @click="changeStatus(row,'启用')">
                        <i-switch :value="row.status == 1"/>
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
                    <a class="theme-blue action-btn" v-if="row.status==3 &&operates.includes('delete')" @click="submitCol(row,index)">提交</a>
                    <dropCode
                        v-if="row.status === 1"
                        :id="'qrcode' + row.id"
                        :key="'qrcode' + row.id"
                        :value="$store.state.app.userInfo.h5Domain+'/#/member-introduce/' +row.id"
                    >
                    <span class="theme-blue action-btn">预览</span>
                    </dropCode>
                    <router-link class="theme-blue action-btn" tag="a" :to="{path:'/community-member-add',query:{id:row.id,communityId:data.associationId,type:'list'}}"
                                 v-if="operates.includes('edit')">修改</router-link>
                    <a class="theme-blue action-btn" @click="deleteRow(row,index)" v-if="operates.includes('delete')">删除</a>
                </template>
            </Table>
        </baseTable>
        <div class="operate text-center mt15">
            <Button class="ml10" :disabled="order" type="primary" v-if="!order &&tableData.bodyList.length&&operates.includes('cancelTop')" @click="setSort" >排序</Button>
            <Button class="ml10" type="primary" v-if="order && operates.includes('cancelTop')" @click="saveSort">保存排序</Button>
            <Button class="ml10" :disabled="order" type="primary" @click="deleteRow('',-1)" v-if="operates.includes('batchDelete')">批量删除</Button>
            <Button class="ml10" :disabled="order" type="primary" @click="submitCol('',-1)" v-if="operates.includes('batchSave')">批量提交</Button>
            <Button type="default" class="ml10 import-panel" v-if="operates.includes('import')">
                <input class="upload-excel" type="file" @change="acceptExcel($event)">导入
            </Button>
            <Button type="default" class="ml10" @click="outExcel($event)" v-if="operates.includes('export')">导出</Button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import baseTable from '@components/baseTable/baseTable.vue'
    import dropCode from "@components/DropCode/DropCode.vue";
    import Head from './head.vue'
    import {dictType,setSort,updateStatus} from "@service/common";
    import {associationPersonList,personUpdateDataStatus,personImportExcel} from "@service/tool";
    import {submitBatch,deleteCol} from "@service/place";
    import {AppModule} from "@store/modules/app";
    import CONFIG from '@/util/config'
    import {importExcelComplete} from '@util/comm';
    @Component({
        components: {
            Head,
            baseTable,
            dropCode
        }
    })
    export default class commounitylist extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        //获取token
        get token() {
            return AppModule.token;
        }
        private data: any = {
            associationId:'',//社团id
            name: '',//名称
            sex: '',//性别
            status: '',//状态
            startCreateTime: '',//成立开始时间
            endCreateTime: '',//成立结束时间
        };
        /*S 时间段*/
        // 选择时间段
        private createTime: string = '';

        getCreateTime(date: any) {
            this.createTime = date;
            this.data.startCreateTime = date[0];
            this.data.endCreateTime = date[1];
            this.getList();
        }

        private addTime: string = '';

        getAddTime(date: any) {
            this.addTime = date;
            this.data.startAddTime = date[0];
            this.data.endAddTime = date[1];
        }

        /*E 时间段*/

        /*S 获取社团类型*/
        private types: object = {};

        getTypeList() {
            dictType({
                type: 'ASSOCIATE_TYPE'
            }).then((res: any) => {
                this.types = res.datas;
            })
        }

        /*E 获取社团类型*/

        /*S 获取列表*/
        //表格分页信息
        private tableConfig: any = {
            page: {
                currPage: 1,
                pageSize: 10,
                total: 6
            },
            pagePosition: "right"
        };
        //表格数据
        private tableData: any = {
            headList: [],
            bodyList: []
        };
        //表格加载动画
        private loading: boolean = true;

        getList(data: any = this.tableConfig.page) {
            let _this = this;
            _this.tableData.headList = [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '姓名',
                    key: 'name',
                    slot:'name',
                    align: 'center'
                },
                {
                    title: '性别',
                    key: 'sex',
                    slot:'sex',
                    align: 'center'
                },
                {
                    title: '职务',
                    key: 'duty',
                    slot: 'duty',
                    align: 'center'
                },
                {
                    title: '入团时间',
                    key: 'joinTeamDate',
                    slot: 'joinTeamDate',
                    align: 'center'
                },
                {
                    title: '排序',
                    key: 'sort',
                    slot: 'sort',
                    align: 'center',
                },
                {
                    title: '状态',
                    key: 'status',
                    slot: 'status',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    slot: 'action'
                }
            ];
            _this.data = Object.assign(_this.data, data); //搜索条件
            _this.loading = true;
            associationPersonList(_this.data).then((res: any) => {
                if (res.code === 0) {
                    _this.tableData.bodyList = res.datas as [];
                    _this.loading = false;
                    _this.tableConfig.page = res.page ? res.page : {};
                }
            })
        }

        /*E 获取列表*/
        /*S 更新状态*/

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
                status:status ,
                resourceType:'CONTENT_TYPE_ASSOCIATION_PERSON'
            };
            updateStatus(param).then((res: any) => {
                if (res.code === 0) {
                    this.$Message.success("更新成功!");
                    _this.getList()
                }
            });
        }

        /*E 更新状态*/

        //提交，删除，更新状态 公共接口请求方法
        private updateStatus(params:any,tips:string){
            let _this=this;
            personUpdateDataStatus(params).then((res: any) => {
                if (res.code === 0) {
                    this.$Message.success(tips+"成功!");
                    _this.getList()
                }
            });
        }

        /*S 底部操作按钮*/
       //排序
        private order: boolean = false; // 是否开启排序功能
        private sortParams: any = {}; // 修改排序后的数据
        private setSort() {
            let _this=this;
            _this.order=!_this.order;
        }
        private saveSort(){
            let _this=this;
            if(JSON.stringify(this.sortParams) != '{}'){
                setSort({
                    resourceType:'CONTENT_TYPE_ASSOCIATION_PERSON',
                    params: JSON.stringify(_this.sortParams)
                }).then((res: any) => {
                    if (res.code === 0) {
                        _this.$Message.success("操作成功");
                        // this.getList();
                    }
                });
                // 发送请求后将当前 对象清空
                _this.sortParams = {};
            }
            _this.order=false;
        }
        private changeSort(row:any){
            this.sortParams[row.id] = row.sort;
        }

        private footerList: Array<Object> = [];
        // 复选框ID
        private checkedIds: string = '';

        // 复选框
        private setChecked(e: any) {
            let checkedIds: any = [];
            this.footerList = e;
            e.map((item: any) => {
                checkedIds.push(item.id as Number);
            });
            this.checkedIds = checkedIds.join(',');
        }

        //提交||批量提交
        submitCol(item:any,index: any) {
            let _this = this, checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
            if (index === -1 && !checkedLen) {
                _this.$Message.error("请选择你要提交的社团");
                return;
            }
            let config: any = {
                title: "操作提示",
                content: `确认要提交“${item.name ||
                "选中的" + checkedLen + "条"}”数据吗？`,
                okText: "确认提交",
                cancelText: "取消",
                onOk: () => {
                    submitBatch({
                        ids: index == -1 ? _this.checkedIds : item.id,
                        type: 'CONTENT_TYPE_ASSOCIATION_PERSON'
                    }).then((res: any) => {
                        if (res.code === 0) {
                            _this.$Message.success("提交成功");
                            _this.getList();
                        }
                    })
                }
            };
            this.$Modal.confirm(config);
        }

        /*E 底部操作按钮*/

        /*S 删除行*/
        deleteRow(item: any, index: any) {
            let _this: any = this, checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
            if (index === -1 && !checkedLen) {
                _this.$Message.error("请选择你要删除的社团");
                return;
            }
            let config: any = {
                title: "操作提示",
                content: `确认要删除“${item.name ||
                "选中的" + checkedLen + "条"}”数据吗？删除后用户端将不再展示！`,
                okText: "确认删除",
                cancelText: "取消",
                onOk: () => {
                    deleteCol({
                        ids: index == -1 ? _this.checkedIds : item.id,
                        type: 'CONTENT_TYPE_ASSOCIATION_PERSON'
                    }).then((res: any) => {
                        if (res.code === 0) {
                            _this.$Message.success("删除成功");
                            _this.getList();
                        }
                    })
                }
            };
            this.$Modal.confirm(config);
        }

        /*E 删除行*/

        /*S 导出*/
        private outExcelApi: string = CONFIG.defaultUrl + '/res/site/ctcAssociationPerson/exportExcel?';
        outExcel(e:any){
            let _target=e.target as HTMLInputElement,_this=this;
            let checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
            if(checkedLen<1){
                this.$Message.error('请选择需要导出的数据！')
            }else{
                _target.setAttribute("href",this.outExcelApi+"token="+this.token+"&ids="+this.checkedIds);
            }
        }
        /*E 导出*/
        /* S 导入 */
        private spinShow:boolean=false;
        private acceptExcel (e:any) {
            let _this = this;
            let files = e.target.files;
            let formData = new FormData();
            formData.append("file", files[0]);
            formData.append('token', this.token)
            this.spinShow = true;
            personImportExcel(formData).then((blob:any) => {
                _this.spinShow = false;
                // importExcelComplete(blob, function () {
                //     _this.$Message.success('导入成功');
                //     _this.tableConfig.page.currPage = 1;
                //     _this.getList();
                // })
                importExcelComplete(blob).then(res => {
                    this.$Message.success('导入成功');
                }).finally(() => {
                    _this.tableConfig.page.currPage = 1;
                    _this.getList();
                })
            })
        }
        /* E 导入 */
        mounted() {
            this.data.associationId=this.$route.query.communityId;
            this.getTypeList();
            this.getList();
        }
    }
</script>

<style scoped lang="scss">
    .w150 {
        width: 150px;
    }

    .wrap {
        padding: 15px 15px 0 15px;
        background-color: $grayLight;
        .submit {
            display: inline-block;
            margin: 0 0 15px 10px;
        }
        .ivu-form-item {
            margin-bottom: 15px !important;
        }
    }
    .table {
        margin-top: 15px;
        .action-btn {
            cursor:pointer;
            display: inline-block;
            white-space:nowrap;
            & + .action-btn {
                margin-left: 5px;
            }
        }
        .switchLabel {
            margin-right: 5px;
        }
        .switchBox {
            position: relative;
            display: inline-block;
            .cover {
                cursor: pointer;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
        }
    }
    .import-panel {
        position: relative;
        .upload-excel {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            opacity: 0;
        }
    }
</style>
