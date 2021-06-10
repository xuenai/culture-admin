<template>
  <div class="itinerary-btns">
    <Dropdown
      trigger="click"
      placement="top"
      @on-visible-change="onVisibleChangeHandle"
      @on-click="setOperateByType"
      class="itinerary-btn"
    >
      <Button type="primary">
        推荐
        <Icon type="ios-arrow-up" class="arrow-icon" :class="{active: dropDownVisible}"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem name="RECOMMEND">推荐至首页</DropdownItem>
        <DropdownItem name="RECOMMEND_HOME">推荐至频道首页</DropdownItem>
        <DropdownItem name="RECOMMEND_ALL">全部推荐</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Button type="primary" class="itinerary-btn" @click="setOperateByType('CANCEL_RECOMMEND')">取消推荐</Button>
    <Button type="primary" class="itinerary-btn" @click="setOperateByType('TOP')">置顶</Button>
    <Button type="primary" class="itinerary-btn" @click="setOperateByType('CANCELTOP')">取消置顶</Button>
    <Button type="primary" class="itinerary-btn" v-if="!sort" @click="changeSortStatus">排序</Button>
    <Button type="primary" class="itinerary-btn" v-else @click="saveSort">保存排序</Button>
    <Button type="primary" class="itinerary-btn" @click="setOperateByType('DELETE')">批量删除</Button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { getJourneyList, setJouneryOperate } from "@service/tool.ts";
import { ModalConfig } from "iview/types";

// TOP(置顶) RECOMMEND_ALL(全部推荐) RECOMMEND(推荐至首页) RECOMMEND_HOME(推荐至频道首页)  SORT(排序) DELETE(删除) ENABLE(启用) DISPLAY(禁用)
const operation: any = {
  TOP: "置顶",
  CANCELTOP: "取消置顶",
  RECOMMEND_ALL: "全部推荐",
  RECOMMEND: "推荐至首页",
  RECOMMEND_HOME: "推荐至频道首页",
  CANCEL_RECOMMEND: "取消推荐",
  SORT: "排序",
  DELETE: "删除"
};

@Component
export default class FooterBtns extends Vue {
  // 表单选中数据
  @Prop({ default: [] }) selections!: Array<any>;
  // 表单整体数据 用于存储排序的
  @Prop({ default: [] }) datas!: Array<any>;
  // 是否在排序中
  @Prop({default: false}) isSort!:boolean;

  dropDownVisible = false;
  type = "";
  sort = false;
  @Watch('isSort')
  onIsSortChange (value: boolean) {
    this.sort = value;
  }
  // 保存操作后执行的操作
  @Emit()
  savedHandle () {
    return;
  }
  @Emit ()
  saveSort () {
    return;
  }
  @Emit ()
  changeSortStatus () {
    return !this.sort;
  }
  onVisibleChangeHandle(status: boolean) {
    this.dropDownVisible = status;
  }
  /**
   * 设置需要操作的类型
   */
  setOperateByType(type: string) {
    this.type = type;
    this.noticeModal();
  }
  noticeModal() {
    let _this = this;
    let operateName = operation[this.type];
    let title = `是否${operateName}选中的数据`;

    if (!this.selections.length) {
      this.$Message.error(`请先选择需要${operateName}的数据`);
      return;
    }
    let config: ModalConfig = {
      title: "操作提示",
      content: title,
      okText: `确认${operateName}`,
      cancelText: "关闭",
      onOk: () => {
        this.saveJouneryOperate();
      }
    };
    this.$Modal.confirm(config);
  }
  /**
   * getRequestParams 获取请求的type和params
   */
  getRequestParams() {
    // 置顶和取消置顶的操作类型是一样的都是TOP 置顶1 取消置顶0
    // 取消推荐 使用的操作类型是  RECOMMEND_ALL  值为0
    let type = "";
    let params = "";
    switch (this.type) {
      case "TOP": {
        type = "TOP";
        params = this.getParams(1);
        break;
      }
      case "CANCELTOP": {
        type = "TOP";
        params =  this.getParams(0);
        break;
      }
      case "DELETE": {
        type = "STATUS";
        params =  this.getParams(0);
        break;
      }
      case "RECOMMEND_ALL": {
        type = "RECOMMEND_ALL";
        params =  this.getParams(1);
        break;
      }
      case "RECOMMEND": {
        type = "RECOMMEND";
        params =  this.getParams(1);
        break;
      }
      case "RECOMMEND_HOME": {
        type = "RECOMMEND_HOME";
        params =  this.getParams(1);
        break;
      }
      case "CANCEL_RECOMMEND": {
        type = "RECOMMEND_ALL";
        params =  this.getParams(0);
        break;
      }
      default:
        break;
    }
    return { type, params };
  }
  /** 获取请求的params */
  getParams(status: 1 | 0) {
    let obj: any = {};
    this.selections.map((item: any) => {
      obj[item.id] = status;
    });
    return JSON.stringify(obj);
  }
  /** 保存操作 */
  saveJouneryOperate() {
    let params = this.getRequestParams();
    setJouneryOperate(params).then(res => {
      if (res.code === 0) {
        let operateName = operation[this.type];
        this.$Message.success(`${operateName}成功！`);
        this.savedHandle();
      }
    });
  }
}
</script>

<style lang='scss' scoped>
.itinerary-btns {
  padding: 10px;
  text-align: center;
  .arrow-icon {
    transition: all 0.3s ease-in;
    &.active {
      transform: rotate(180deg);
    }
  }
  .itinerary-btn {
    margin: 0 8px;
  }
}
</style>
