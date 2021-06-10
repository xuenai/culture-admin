<!--
 * @Author: 任智勇
 * @since: 2019-06-19 16:39:09
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-25 13:47:42
 -->
<template>
    <div class="tagsDiv">
        <div class="clearfix" v-if="!isDetail">
            <p
                class="fl tags-box"
                v-for="items in tags"
                :key="items.id"
                @click="handleTags(items.id,tagsArrObj[items.id] == 1)"
            >
                <span class="choice-tag" :class="{'active':tagsArrObj[items.id] == 1}">{{items.labelName}}</span>
                <Icon v-if="items.labelOwner != 0" type="ios-close-circle" class="icon" @click.stop="deleteFile(items.id)"></Icon>
            </p>
            <Button class="fl add-tag-btn" icon="ios-add" type="dashed" @click="addTagsModel=true">添加标签</Button>
        </div>
        <div class="clearfix" v-else>
            <p
                class="fl tags-box"
                v-for="items in tags"
                :key="items.id"
                v-if="tagsArrObj[items.id] == 1"
            >
                <span class="choice-tag" :class="{'active':tagsArrObj[items.id] == 1}">{{items.labelName}}</span>
            </p>
        </div>
        <div class="note" v-if="limit && !isDetail">注：最多可选择{{limit}}个标签</div>
        <Modal v-model="addTagsModel" title="添加标签" footer-hide>
            <Form :model="TagsData" class="form" ref="TagsData" inline :label-width="80">
                <FormItem label="标签名" prop="tagName">
                    <Input style="width: 200px;" placeholder="请输入标签名" :maxlength="20" v-model="TagsData.tagName"/>
                    <Button class="ml20" type="primary" @click="addTagsFun">添加</Button>
                    <Button class="ml20" @click="addTagsModel=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang='ts'>
    /**
     * 代码示例
     * <tags resourceType="MEDIA" labelType="AUDIO" defaultIds="" @onChange="getTagIds"></tags>
     *
     * 参数说明
     * resourceType: 标签的资源类型
     * labelType: 标签类型
     * limit: 选中标签数量
     * defaultIds: 默认已选中的标签 ids 字符串,英文逗号分隔
     *
     * 事件说明
     * @onChange : 每当切换选中标签时触发,参数为 当前选中的标签 ids 字符串
     */
    import {Component, Prop, Watch, Vue} from "vue-property-decorator";
    import {getTagsSelect, saveTags, deleteTag} from "@service/common";

    @Component({components: {}})
    export default class ComponentName extends Vue {
        // 默认值列表
        @Prop() private resourceType!: string;
        @Prop() private labelType!: string;
        @Prop() private defaultIds!: any;
        @Prop({default: false}) isDetail!:boolean;
        @Watch("defaultIds", {immediate: true, deep: true})
        getDefaultIds(value:any) {
            let _this = this;
            if (value) {
                value.split(",").map((item: any) => {
                    _this.tags.forEach((el:any) => {
                        if(el.id == item){
                            // 值 = 1 表示需要回显选中
                            _this.tagsArrObj[item] = 1;
                        }
                    });
                });
                // 不做tags是否存在限制将外吐空字符串会导致bug
                _this.tags.length && _this.$emit("onChange", _this.getTagIds());
            }
        }

        @Prop() private limit!: any;

        private addTagsModel: Boolean = false; //添加标签-弹框
        private tags: Array<any> = []; // 所有的标签数组
        @Watch("tags", {immediate: true, deep: true})
        refreshTagsData(val: any) {
            // 列表数据发生变化时，更新
            if (this.tags.length > 0) {
                let obj: any = {};
                this.tags.forEach((item: any) => {
                    obj[item.id] = 0;
                });
                this.tagsArrObj = Object.assign({}, obj, this.tagsArrObj);
                this.defaultIds && this.getDefaultIds(this.defaultIds)
            }
        }

        mounted() {
            this.getTagsSelect();
        }

        /* 标签Data */
        private TagsData: any = {
            id: "",
            tagName: ""
        };

        // 获取标签数据
        private getTagsSelect() {
            getTagsSelect({
                resourceType: this.resourceType,
                labelType: this.labelType
            }).then((data: any) => {
                if (data.code === 0) {
                    this.tags = data.datas;
                }
            });
        }

        //   添加新标签
        private addTagsFun() {
            if (this.TagsData.tagName) {
                saveTags({
                    resourceType: this.resourceType,
                    labelType: this.labelType,
                    labelName: this.TagsData.tagName
                }).then((data: any) => {
                    if (data.code === 0) {
                        this.$Message.success("添加成功");
                        this.getTagsSelect();
                        this.addTagsModel = false;
                        this.TagsData.tagName = "";
                    }
                });
            } else {
                this.$Message.error("请输入标签名称");
            }
        }

        // 删除标签
        private deleteFile(index: Number) {
            let _this = this;
            let config: any = {
                title: "提示",
                content: "确认删除？",
                okText: "确认",
                cancelText: "关闭",
                onOk: () => {
                    deleteTag({
                        ids: index
                    }).then((data: any) => {
                        if (data.code === 0) {
                            this.$Message.success("删除成功");
                            this.getTagsSelect();
                        }
                    });
                }
            };
            this.$Modal.confirm(config);
        }

        /* S 选中标签 */
        private tagsArrObj: any = {}; //选中标签容器 key 为标签id，value为 1表示该标签为选中，0表示该标签未选中
        // id: 点击的标签, flag: true 点击前为选中, false 点击前为未选中
        private handleTags(id: any, flag: boolean) {
            if (flag) {
                this.tagsArrObj[id] = 0;
            } else {
                //规定数量限制
                if (this.limit) {
                    if(this.limit == 1){
                        // 限制只能选择一个时，直接切换
                        for(let item in this.tagsArrObj){
                            this.tagsArrObj[item] = 0
                        }
                        this.tagsArrObj[id] = 1;
                    } else {
                        let length = this.getTagIds() ? this.getTagIds().split(",").length:0;
                        if (length < parseInt(this.limit)) {
                            this.tagsArrObj[id] = 1;
                        } else {
                            this.$Message.error("最多选" + this.limit + "个标签哦!");
                        }
                    }
                } else {
                    this.tagsArrObj[id] = 1;
                }
            }
            this.$emit("onChange", this.getTagIds());
        }

        /* E 选中标签 */

        // 获取当前选中的标签ids
        private getTagIds() {
            let ids = "";
            for (let key in this.tagsArrObj) {
                if (this.tagsArrObj[key] == 1) {
                    ids += key + ",";
                }
            }

            ids = ids.substr(0, ids.length - 1);
            return ids;
        }
    }
</script>

<style lang='scss' scoped>
    .tagsDiv {
        display: inline-block;
    }

    .tags-box {
        position: relative;
        &:hover {
            .icon {
                display: block;
            }
        }
        .icon {
            position: absolute;
            right: 7px;
            top: -10px;
            font-size: 24px;
            cursor: pointer;
            display: none;
            &:hover {
                color: $theme;
            }
        }
        .choice-tag {
            margin-bottom: 5px;
            max-width: 300px !important;
        }
        .choice-tag.active {
            color: #5ac858;
            border-color: #5ac858;
            max-width: 300px !important;
        }
    }

    .note {
        margin-top: 5px;
        color: $lightGray;
        font-size: 12px;
        line-height: 14px;
    }
</style>
