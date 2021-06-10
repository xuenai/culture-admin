<template>
    <div class="btn-box">
        <Button type="primary" :disabled="order" v-if="operates.includes('recommend')" @click="setOperateStatus(1, 'RECOMMENT')">推荐</Button>
        <Button type="primary" :disabled="order" v-if="operates.includes('cancelRecommend')" @click="setOperateStatus(0, 'RECOMMENT')">取消推荐
        </Button>
        <Button type="primary" :disabled="order" v-if="operates.includes('top')" @click="setOperateStatus(1, 'TOP')">置顶</Button>
        <Button type="primary" :disabled="order" v-if="operates.includes('cancelTop')" @click="setOperateStatus(0, 'TOP')">取消置顶
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
    import { brandOperate } from "@service/activity";
    import {AppModule} from "@store/modules/app";

    enum OperateType {
        RECOMMENT = "RECOMMENT",
        TOP = "TOP"
    }

    @Component({components: {}})
    export default class FooterButtons extends Vue {
        // 权限列表
        get operates() {
            return AppModule.operates;
        }
        @Prop() private AllList!:Array<object>; // 列表数据
        @Prop() private selectionList!:Array<object>; // 选择数据

        private order: boolean = false; // 是否开启排序功能

        /* S 排序 */
        private orderTrue() {
            this.order = true;
            this.$emit("changeOrder", this.order);
        }

        // 点击保存排序
        private orderClick() {
            this.order = false;
            this.$emit("changeOrder", this.order);

            let params:{[prop:number]: number} = {}
            this.AllList.forEach((d:any) => params[d.id as number] = d.sort as number)
            brandOperate({
                type: 'SORT',
                params: JSON.stringify(params)
            }).then((res:any) => {
                if (res.code === 0) {
                    this.$Message.success("操作成功")
                    this.$emit("finish", "SORT");
                }
            })
        }
        /* E 排序 */

        // 推荐、置顶 设置
        private setOperateStatus(status: number, type: OperateType) {
            if (!this.selectionList.length) {
                this.$Message.error("请先选择数据");
                return;
            }
            let txt = {
                RECOMMENT: '推荐',
                TOP: '置顶'
            }
            let config: any = {
                title: "操作提示",
                okText: "确认",
                cancelText: "取消",
                onOk: () => {
                    let params:{[prop:number]: number} = {}
                    this.selectionList.forEach((d:any) => params[d.id as number] = status)
                    brandOperate({
                        type,
                        params: JSON.stringify(params)
                    }).then((res:any) => {
                        if (res.code === 0) {
                            this.$Message.success("操作成功");
                            this.$emit("finish", type);
                        }
                    })
                },
                render: (h: any, params: any) => {
                    return h(
                        "p",
                        `是否确认${status ? txt[type] : ('取消' + txt[type])}选择的数据？`
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
