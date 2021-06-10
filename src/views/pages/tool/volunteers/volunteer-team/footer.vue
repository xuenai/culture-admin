<!--
 * @Author: 任智勇
 * @since: 2019-06-18 15:19:40
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-12 11:37:36
 -->
<template>
    <div class="btn-box">
        <Button type="primary" :disabled="order" v-if="operates.includes('recommend')" @click="setRecommendStatus">推荐</Button>
        <Button type="primary" :disabled="order" v-if="operates.includes('cancelRecommend')" @click="unRecommendStatus">取消推荐
        </Button>
        <Button type="primary" :disabled="order" v-if="operates.includes('top')" @click="setTopStatus(1,'置顶')">置顶</Button>
        <Button type="primary" :disabled="order" v-if="operates.includes('cancelTop')" @click="setTopStatus(0,'取消')">取消置顶
        </Button>

        <Button type="primary" v-if="!order && operates.includes('sort')" @click="orderTrue">排序</Button>
        <Button type="primary" v-if="order && operates.includes('sort')" @click="orderClick">保存排序</Button>
        <slot></slot>
    </div>
</template>

<script lang='ts'>
    /**
     * 代码示例 slot 为自定义按钮区
     * 模板示例
     <footerButtons
     type="CONTENT"
     :selectionList="selectionList"
     :orderRowData = "orderRowData"
     @changeOrder="changeOrder"
     @getList="getList"
     >
     <Button type="primary" :disabled="order" @click="patchDelete">批量删除</Button>
     <Button type="primary" :disabled="order" @click="patchSubmit">批量提交</Button>
     <Button type="primary" :disabled="order" @click="transferSite">转移</Button>
     <Button type="primary" :disabled="order" @click="reportSite">上报</Button>
     <Button type="primary" :disabled="order" @click="showAilenDialog">云联盟</Button>
     <Button :disabled="order">导入</Button>
     <Button :disabled="order">导出</Button>
     </footerButtons>


     * 参数说明
     * type: 资源类型，如内容为: "CONTENT"
     * selectionList: 列表复选框数据项变化时 的数组值
     *  即：表格监听到的变化时的返回值 @on-selection-change="selectionTable"
     * orderRowData: 排序数据发生改变时需要修改的数据
     * js中代码示例
     private order: boolean = false; // 是否开启排序功能
     private changeOrder(b: boolean) {
        this.order = b;
    }
     // 修改排序行的数据
     private orderRowData:object = {}
     private changeSort(row: any) {
        this.orderRowData = row;
    }
     *
     * 事件说明
     * changeOrder: 排序功能开启关闭时的触发事件
     * 排序模板一般像下面这样写
     *   iview表格slot模板示例
     *        <template slot-scope="{ row }" slot="sort">
     <span v-if="!order">{{row.sort}}</span>
     <Input v-else @on-change="changeSort(row)" v-model="row.sort"/>
     </template>

     * getList:     当发生操作后需要更新列表数据时触发此事件
     */

    /**
     * 对外接口： 三个参数 两个事件
     * */
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {setSort, setRecommendStatus, setTopStatus} from "@service/common";
    import {AppModule} from "@store/modules/app";
    @Component({components: {}})
    export default class FooterButtons extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        @Prop() private selectionList!:Array<object>;
        @Prop() private continueAddRowData!:{id: any, sort: any, [propName: string]: any}; // 持续增加
        @Prop() private resourceType!: string;

        private order: boolean = false; // 是否开启排序功能
        private sortParams: any = {}; // 修改排序后的数据

        @Watch("continueAddRowData", {immediate: true, deep: true})
        refreshConfig() {
            if (JSON.stringify(this.continueAddRowData) !== "{}") {
                // 将当前改变的排序值进行记录
                this.sortParams[this.continueAddRowData.id] = this.continueAddRowData.sort;
            }
        }

        /* S 排序 */
        private orderTrue() {
            this.order = true;
            this.$emit("changeOrder", this.order);
        }

        // 点击保存排序
        private orderClick() {
            this.order = false;
            this.$emit("changeOrder", this.order);
            this.setSort();
        }

        // 设置排序
        private setSort() {
            if (JSON.stringify(this.sortParams) != '{}') {
                setSort({
                    resourceType: this.resourceType,
                    params: JSON.stringify(this.sortParams)
                }).then((res: any) => {
                    if (res.code === 0) {
                        this.$Message.success("操作成功");
                        this.selectionList.length = 0;
                    }
                    this.$emit("getList");
                });
                // 发送请求后将当前 对象清空
                this.sortParams = {};
            }
        }
        /* E 排序 */

        // 推荐
        private setRecommendStatus() {
            if (!this.selectionList.length) {
                this.$Message.error("请先选择需要推荐的数据");
                return;
            }

            let params = {
                resourceType: this.resourceType,
                ids: this.selectionList.map((item:any) => item.id).toString(),
                recommendHomePage: 1,
                recommendChannelHomePage: 1
            };
            let config: any = {
                title: "操作提示",
                okText: "确认推荐",
                cancelText: "取消",
                onOk: () => {
                    setRecommendStatus(params).then((res: any) => {
                        if (res.code === 0) {
                            this.$Message.success("推荐成功");
                            this.selectionList.length = 0;
                            this.$emit("getList");
                        }
                    });
                },
                render: (h: any, params: any) => {
                    return h(
                        "p",
                        "是否要推荐选中的" + this.selectionList.length + "条数据？"
                    );
                }
            };
            this.$Modal.confirm(config);
        }

        // 取消推荐
        private unRecommendStatus() {
            if (!this.selectionList.length) {
                this.$Message.error("请先选择需要取消推荐的数据");
                return;
            }

            let params = {
                resourceType: this.resourceType,
                ids: this.selectionList.map((item:any) => item.id).toString(),
                recommendHomePage: 0,
                recommendChannelHomePage: 0
            };
            let config: any = {
                title: "操作提示",
                okText: "确认取消",
                cancelText: "取消",
                onOk: () => {
                    setRecommendStatus(params).then((res: any) => {
                        if (res.code === 0) {
                            this.$Message.success("取消推荐成功");
                            this.selectionList.length = 0;
                            this.$emit("getList");
                        }
                    });
                },
                render: (h: any, params: any) => {
                    return h(
                        "p",
                        "是否要取消推荐选中的" + this.selectionList.length + "条数据？"
                    );
                }
            };
            this.$Modal.confirm(config);
        }

        // 置顶-取消置顶
        private setTopStatus(top: Number, name: string) {
            if (!this.selectionList.length) {
                this.$Message.error("请先选择需要置顶/取消的数据");
                return;
            }

            let params = {
                resourceType: this.resourceType,
                ids: this.selectionList.map((item:any) => item.id).toString(),
                top: top
            };
            let config: any = {
                title: "操作提示",
                okText: "确认" + name,
                cancelText: "取消",
                onOk: () => {
                    setTopStatus(params).then((res: any) => {
                        if (res.code === 0) {
                            this.$Message.success(name + "成功");
                            this.selectionList.length = 0;
                            this.$emit("getList");
                        }
                    });
                },
                render: (h: any, params: any) => {
                    return h(
                        "p",
                        "是否要" + name + "选中的" + this.selectionList.length + "条数据？"
                    );
                }
            };
            this.$Modal.confirm(config);
        }
    }
</script>

<style lang='scss' scoped>
    .btn-box {
        margin-top: 12px;
        display: flex;
        justify-content: center;
        button {
            margin: 0 6px;
        }
    }
</style>
