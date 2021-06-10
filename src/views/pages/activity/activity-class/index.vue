<template>
    <div class="content">
        <Form ref="params" inline :label-width="70" :model="params">
            <FormItem label="分类名称">
                <Input
                    type="text"
                    placeholder="请输入关键字"
                    v-model="params.labelName"
                    @on-enter="search"
                    style="width: 200px"
                />
            </FormItem>
            <Button type="primary" style="margin-left: 5px;" @click="search">搜索</Button>
            <Button type="primary" style="margin-left: 15px;" @click="() => {AddTagShow = true;id = ''}">添加分类</Button>
            <Button type="primary" style="margin-left: 15px;" @click="sortFn">{{order?'保存':'排序'}}</Button>
        </Form>
        <div>
            <baseTable :configure="tableConfig" @getList="getList">
                <Table
                    border
                    :columns="header"
                    :data="list"
                    :loading="loading"
                >
                    <template slot-scope="{ row }" slot="activityImgFirst">
                        <div class="img-box">
                            <img :src="row.activityImgFirst" alt="">
                        </div>
                    </template>
                    <template slot-scope="{ row }" slot="activityImgSecond">
                        <div class="img-box">
                            <img :src="row.activityImgSecond" alt="">
                        </div>
                    </template>
                    <template slot-scope="{ row }" slot="sort">
                        <InputNumber v-if="order" :precision="0" :min="1" :max="999" @on-change="changeSort(row)" v-model="row.sort"></InputNumber>
                        <span v-else>{{row.sort}}</span>
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <span v-if="row.status === 3">草稿</span>
                        <div v-if="[1,2].includes(row.status)">
                            <span class="switchLabel">{{['正常','禁用'][row.status - 1]}}</span>
                            <span class="switchBox" @click="changeStatus(row)">
                                <i-switch :value="row.status === 1"/>
                                <span class="cover"></span>
                            </span>
                        </div>
                    </template>
                    <template slot-scope="{ row }" slot="action">
                        <a
                            href="javascript:;"
                            class="control"
                            @click="() => {AddTagShow = true; id = row.id}"
                        >修改</a>
                        <a
                            href="javascript:;"
                            class="control"
                            @click="deleteClass(row)"
                        >删除</a>
                    </template>
                </Table>
            </baseTable>
        </div>
        <AddActivityClass :show="AddTagShow" :id="id" @close="AddTagShow = false" @getClass="item => getList()"></AddActivityClass>
    </div>
</template>

<script lang='ts'>
    import { Component, Vue, Watch } from "vue-property-decorator";
    import AddActivityClass from "@components/add-activityclass/index.vue";
    import baseTable from "@components/baseTable/baseTable.vue";

    import {getActivityClassList} from "@service/activity";
    import {sortTags, updateTagsStatus, deleteTag} from "@service/common";

    @Component({
        components: {
            AddActivityClass,
            baseTable
        }
    })
    export default class ActivityClass extends Vue {
        private loading: boolean = false
        private order: boolean = false // 是否点击开启排序
        private AddTagShow: boolean = false // 是否显示添加活动类型弹窗
        private id: any = '';
        private list: Array<any> = []
        private params: {labelName: string} = {labelName: ''}
        private tableConfig = <{page: any, pagePosition: string}>{
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            pagePosition: "right"
        }
        private header = [
            {
                title: '分类名称',
                key: 'labelName',
                align: 'center'
            },
            {
                title: '默认图标',
                slot: 'activityImgFirst',
                align: 'center'
            },
            {
                title: '选中图标',
                slot: 'activityImgSecond',
                align: 'center'
            },
            {
                title: '活动数量',
                key: 'activityNum',
                align: 'center'
            },
            {
                title: '创建时间',
                key: 'createTime',
                align: 'center'
            },
            {
                title: '排序',
                slot: 'sort',
                align: 'center'
            },
            {
                title: '状态',
                slot: 'status',
                align: 'center'
            },
            {
                title: '操作',
                slot: 'action',
                align: 'center'
            }
        ]
        created () {
            this.search()
        }
        private search () {
            this.tableConfig.page.currPage = 1
            this.getList()
        }
        private getList (page: any = this.tableConfig.page) {
            this.loading = true
            this.order = false
            this.changeList.length = 0
            getActivityClassList({...this.params, ...page}).then((res:any) => {
                if (res.code === 0) {
                    this.tableConfig.page.currPage = res.page.currPage
                    this.tableConfig.page.total = res.page.total
                    this.list = res.datas as Array<any>
                }
            }).finally(() => this.loading = false)
        }
        private changeList: Array<any> = []
        private changeSort (row:any) {
            if (!this.changeList.some((item:any) => item.id === row.id)) {
                this.changeList.push(row)
            }
        }
        // 点击 保存/排序
        private sortFn () {
            this.order = !this.order
            if (!this.order && this.changeList.length) {
                sortTags({jsonDto: JSON.stringify(this.changeList.map((item:any) => ({sort: item.sort, id: item.id})))}).then((res:any) => {
                    if (res.code === 0) {
                        this.$Message.success('保存成功！');
                        this.getList()
                        this.loading = false
                    }
                })
            }
            this.changeList.length = 0
        }
        // 点击 状态切换
        private changeStatus (row:any) {
            updateTagsStatus({
                id: row.id,
                status: [2, 1][row.status - 1]
            }).then((res:any) => {
                if (res.code === 0) {
                    this.getList()
                    this.loading = false
                }
            })
        }
        // 删除
        private deleteClass (row:any) {
            this.$Modal.confirm({
                title: '删除提示',
                content: '是否确认删除“' + row.labelName + '”?',
                onOk: () => {
                    deleteTag({ids: row.id}).then((res:any) => {
                        if (res.code === 0) {
                            this.$Message.success('删除成功！')
                            this.getList()
                            this.loading = false
                        }
                    })
                }
            })
        }
    }
</script>

<style lang='scss' scoped>
.content {
    padding: 15px;
    .img-box {
        width: 24px;
        margin: 0 auto;
        img {
            width: 100%;
        }
    }
    .control {
        margin: 0 5px;
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
</style>
