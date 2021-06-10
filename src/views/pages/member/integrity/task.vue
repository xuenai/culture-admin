<template>
    <div class="task">
        <baseTable :configure="tableConfig" @getList="getList">
            <Table class="table mt15" border :columns="tableData.headList" :data="tableData.bodyList"
                   :loading="loading">
                <template slot="name" slot-scope="{row,index}">
                    <div class="name-box">
                        <div class="img-box"><img :src="row.icon" :alt="row.name"></div>
                        <span class="name">{{row.name}}</span>
                    </div>
                </template>
                <template slot="type" slot-scope="{row,index}">
                   <div v-if="row.type==='CREDIT_TYPE_SUBSCRIBE_ACTION'">
                       预约行为
                   </div>
                    <div v-if="row.type==='CREDIT_TYPE_IDENTITY'">
                        身份特征
                    </div>
                    <div v-if="row.type==='CREDIT_TYPE_HISTORY'">
                        守约历史
                    </div>
                </template>
            </Table>
        </baseTable>
    </div>
</template>

<script lang='ts'>
    import {Component, Vue} from 'vue-property-decorator';

    import {BaseTable} from "@components/index";
    import {getActionRuleList} from "@service/member";

    @Component({
        components: {
            BaseTable
        }
    })
    export default class Task extends Vue {
        private tableConfig: any = {
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0,
                totalPage: 1
            },
            pagePosition: "right"
        };
        // 表格加载动画
        private loading: boolean = true;
        // 表格数据
        private tableData: any = {
            headList: [
                {
                    title: "行为名称",
                    key: "name",
                    slot: 'name',
                    align: "center",
                },
                {
                    title: "行为类型",
                    key: "type",
                    slot:'type',
                    align: "center",
                },
                {
                    title: "守约加分",
                    key: "keepPromiseScore",
                    align: "center",
                },
                {
                    title: "失约减分",
                    key: "losePromiseScore",
                    align: "center",
                }
            ],
            bodyList: []
        };

        //获取表格数据
        getList() {
            let _this = this;
            getActionRuleList(_this.tableConfig.page).then((res: any) => {
                _this.tableData.bodyList = res.datas as [];
                _this.loading = false;
                _this.tableConfig.page = res.page ? res.page : {};
            })
        }

        created() {
            this.getList();
        }
    }
</script>

<style lang='scss' scoped>
    .task {
        position: relative;
        padding: 0 15px 15px;
    }

    .name-box {
        display: block;
        text-align: left;
        padding: 18px 0;
        overflow: hidden;
        .img-box {
            display: inline-block;
            height: 50px;
            width: 50px;
            margin-right:10px;
            img {
                width: 100%;
                height: 100%;
                vertical-align: middle;
            }
        }
    }
</style>
