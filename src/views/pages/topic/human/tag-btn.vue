<!--
 * @Author: 任智勇
 * @since: 2019-06-18 15:19:40
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-18 19:36:31
 -->
<template>
  <div class="btn-box">
     <Button type="primary" v-if="operates.includes('recommend')" @click="setRecommendStatus" :disabled="order">
        推荐
      </Button>
    <!-- <Button type="primary" v-if="operates.includes('recommend')" :disabled="true">推荐</Button> -->
    <Button
      type="primary"
      :disabled="order"
      @click="unRecommendStatus"
      v-if="operates.includes('cancelRecommend')"
    >取消推荐</Button>
    <Button
      type="primary"
      :disabled="order"
      @click="setTopStatus(1)"
      v-if="operates.includes('top')"
    >置顶</Button>
    <Button
      type="primary"
      :disabled="order"
      @click="setTopStatus(0)"
      v-if="operates.includes('cancelTop')"
    >取消置顶</Button>
    <Button type="primary" v-if="!order && operates.includes('cancelTop')" @click="orderTrue">排序</Button>
    <Button type="primary" v-if="order && operates.includes('cancelTop')" @click="orderClick">保存排序</Button>
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { setRecommendStatus, setTopStatus, setSort } from "@service/topic";
import { AppModule } from "@store/modules/app";
@Component({ components: {} })
export default class ComponentName extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  @Prop() private selectionList!: Array<object>;
  @Prop() private orderRowData!: object;

  @Watch("orderRowData", { immediate: true, deep: true })
  refreshConfig() {
    if (JSON.stringify(this.orderRowData) !== "{}") {
      // 将当前改变的排序值进行记录
      this.changeSort(this.orderRowData);
    }
  }

  /* S 排序 */
  private order: boolean = false; // 是否开启排序功能
  private sortParams: any = {}; // 修改排序后的数据
  private orderTrue() {
    this.order = true;
    this.$emit("changeOrder", this.order);
  }
  // 修改排序
  private changeSort(row: any) {
    this.sortParams[row.id] = row.sort;
  }
  // 点击保存排序
  private orderClick() {
    this.order = false;
    this.$emit("changeOrder", this.order);
    this.setSort();
  }
  // 设置排序
  private setSort() {
    setSort({
      params: JSON.stringify(this.sortParams)
    }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功");
      }
      this.$emit("getList");
    });
    // 发送请求后将当前 对象清空
    this.sortParams = {};
  }
  /* E 排序 */

  // 推荐
  private setRecommendStatus(name: string) {
    let params = {
      ids: this.getSelectIds(),
      recommend: 1
    };
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认推荐",
      cancelText: "取消",
      onOk: () => {
        setRecommendStatus(params).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("推荐成功");
            this.$emit("getList");
          }
        });
      },
      render: (h: any, params: any) => {
        return h(
          "p",
          "是否要推荐选中的" + _this.selectionList.length + "条数据？"
        );
      }
    };
    if (_this.selectionList.length > 0) {
      this.$Modal.confirm(config);
    } else {
      _this.$Message.error("请先选择需要推荐的数据");
    }
  }
  // 取消推荐
  private unRecommendStatus() {
    let params = {
      ids: this.getSelectIds(),
      recommend: 0
    };
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认取消",
      cancelText: "取消",
      onOk: () => {
        setRecommendStatus(params).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("取消推荐成功");
            this.$emit("getList");
          }
        });
      },
      render: (h: any, params: any) => {
        return h(
          "p",
          "是否要取消推荐选中的" + _this.selectionList.length + "条数据？"
        );
      }
    };
    if (_this.selectionList.length > 0) {
      this.$Modal.confirm(config);
    } else {
      _this.$Message.error("请先选择需要取消推荐的数据");
    }
  }
  // 置顶-取消置顶
  private setTopStatus(top: Number) {
    let params = {
      ids: this.getSelectIds(),
      top: top
    };
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认置顶",
      cancelText: "取消",
      onOk: () => {
        setTopStatus(params).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("置顶成功");
            this.$emit("getList");
          }
        });
      },
      render: (h: any, params: any) => {
        return h(
          "p",
          "是否要置顶/取消选中的" + _this.selectionList.length + "条数据？"
        );
      }
    };
    if (_this.selectionList.length > 0) {
      this.$Modal.confirm(config);
    } else {
      _this.$Message.error("请先选择需要置顶/取消的数据");
    }
  }

  // 获取表格选中的数据的 ids
  private getSelectIds() {
    let ids = "";
    if (this.selectionList) {
      this.selectionList.forEach((item: any) => {
        ids += item.id + ",";
      });
      ids = ids.substr(0, ids.length - 1);
    }
    return ids;
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
