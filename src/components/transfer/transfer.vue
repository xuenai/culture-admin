<template>
  <div>
    <div class="ivu-transfer">
      <List
        ref="left"
        title="选择场所"
        :data="leftData"
        :checkedKeys="leftCheckedKeys"
        :validKeysCount="leftValidKeysCount"
        :showResourceType="true"
        @on-checked-keys-change="handleLeftCheckedKeysChange"
      ></List>
      <Operation
        :leftActive="this.leftValidKeysCount > 0"
        :rightActive="this.rightValidKeysCount > 0"
      ></Operation>
      <RightList
        ref="right"
        title="已授权场所"
        :data="rightData"
        :checkedKeys="rightCheckedKeys"
        :validKeysCount="rightValidKeysCount"
        @on-checked-keys-change="handleRightCheckedKeysChange"
      ></RightList>
    </div>
    <TransferModal
      v-model="modalShow"
      :id="modalId"
      :name="modalPrarentName"
      :resourceType="modalResourceType"
      :targetKeys="targetKeys"
    ></TransferModal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import List from "./list.vue";
import RightList from './right-list.vue';
import Operation from "./operation.vue";
import TransferModal from "./modal.vue";

import { getParentObjectValidPower, getEchoDataValidPower } from "@service/app";

interface ResourseDataType {
  name: string;
  resourceId: string;
  resourceType:
    | "CONTENT_TYPE_VENUE"
    | "CONTENT_TYPE_HOTEL"
    | "CONTENT_TYPE_SCENERY"
    | "CONTENT_TYPE_ACTIVITY_SHIU"
    | "CONTENT_TYPE_SCENIC_SPOTS"
    | "CONTENT_TYPE_HOTEL_ROOM"
    | "CONTENT_TYPE_RESTAURANT"
    | "CONTENT_TYPE_TOILET"
    | "CONTENT_TYPE_PARKING";
  child?: Array<ResourseDataType>;
  pid?:string;
  ptype?: string;
  pname?:string;
}

@Component({
  components: { List, Operation, TransferModal, RightList }
})
export default class Ctransfer extends Vue {
  @Prop() readonly value!: Array<ResourseDataType>;
  @Prop({ default: false }) readonly disabled!: boolean;
  private data: Array<ResourseDataType> = [];
  private targetKeys: Array<any> = [];
  private target: Array<ResourseDataType> = [];
  // 左侧列表数据
  private leftData: Array<ResourseDataType> = [];
  // 右侧列表数据
  private rightData: Array<ResourseDataType> = [];
  private leftCheckedKeys: Array<any> = [];
  private rightCheckedKeys: Array<any> = [];
  private modalId = "";
  private modalPrarentName = "";
  private modalResourceType = "";
  private modalShow = false;
  get leftValidKeysCount() {
    return this.getValidKeys("left").length;
  }
  get rightValidKeysCount() {
    return this.getValidKeys("right").length;
  }
  @Watch("value", { immediate: true, deep: true })
  private onValueChange(val: Array<ResourseDataType>) {
    this.targetKeys = val;
  }
  @Watch("data", { immediate: true, deep: true })
  private onDataChange(val: Array<ResourseDataType>) {
    this.splitData();
  }
  @Watch("targetKeys", { immediate: true, deep: true })
  private onTargetKeysChange(val: Array<ResourseDataType>) {
    this.splitData();
    this.input(val)
  }
  @Emit()
  input(newTargetKeys: Array<any>) {
    return newTargetKeys;
  }
  getValidKeys(direction: string) {
    if (direction === 'right') {
      return this[`${direction}Data`].filter(
        (data: ResourseDataType) =>
          this[`${direction}CheckedKeys`].indexOf(data.resourceId) > -1
      );
    }
    if (direction === 'left') {
      // this.leftData.map((e:any) => {
      //   arr.concat(e.powerListVo.filter((vo:any) => this[`${direction}CheckedKeys`].indexOf(vo.resourceId) > -1));
      //   console.log(e.powerListVo.filter((vo:any) => this[`${direction}CheckedKeys`].indexOf(vo.resourceId) > -1));
      // });
      let arr:any = [];
      this.leftData.forEach((e:any, idx: number) => {
        arr = arr.concat(e.powerListVo.filter((vo:any) => this[`${direction}CheckedKeys`].indexOf(vo.resourceId) > -1));
      })
      return arr;
    }
  }
  getChildrenHandle(item: ResourseDataType) {
    this.modalId = item.resourceId;
    this.modalPrarentName = item.name;
    this.modalResourceType = item.resourceType;
    this.modalShow = true;
  }
  // 获取父级资源
  getParentObjectValidPower() {
    getParentObjectValidPower().then(res => {
      if (res.code === 0) {
        this.data = res.datas as Array<ResourseDataType>;
        this.splitData();
      }
    });
  }
  handleLeftCheckedKeysChange(keys: Array<any>) {
    this.leftCheckedKeys = keys;
  }
  handleRightCheckedKeysChange(keys: Array<any>) {
    this.rightCheckedKeys = keys;
  }
  handleCheckedKeys() {
    const sourceSelectedKeys = this.getValidKeys("left");
    const targetSelectedKeys = this.getValidKeys("right");
  }
  moveTo(direction: "left" | "right") {
    const targetKeys = this.targetKeys;
    const opposite = direction === "left" ? "right" : "left";
    const moveKeys = this.getValidKeys(opposite);

    let newTargetKeys:Array<any> = [];
    if (direction === "right") {
      newTargetKeys = moveKeys.concat(targetKeys.filter(
        targetKey =>
          !moveKeys.some(
            (checkedKey: any) =>
              targetKey.pid === checkedKey.resourceId
          )
      ));
    } else {
      newTargetKeys = targetKeys.filter(
        targetKey =>
          !moveKeys.some(
            (checkedKey: any) =>
              targetKey.resourceId === checkedKey.resourceId
          )
      );
    }
    (this.$refs[opposite] as Vue).toggleSelectAll(false);
    // emmit 新的右侧数组
    this.input(newTargetKeys);
  }
  splitData() {
    this.leftData = JSON.parse(JSON.stringify(this.data));
    this.rightData = [];
    if (this.targetKeys.length > 0) {
      this.targetKeys.forEach(targetKey => {
        this.leftData.forEach((e:any, idx:number) => {
          e.powerListVo.forEach((data:any, jdx:number) => {
              if (data.resourceId === targetKey.resourceId) {
                (this.leftData[idx] as any).powerListVo.splice(jdx, 1);
              }
          })
        })
        this.rightData.push(targetKey);
      });
    }
  }
  splitSelectedKey() {
    const selectedKeys = this.selectedKeys;
    if (selectedKeys.length > 0) {
      this.leftCheckedKeys = this.leftData
        .filter(data => selectedKeys.indexOf(data.resourceId) > -1)
        .map(data => data.resourceId);
      this.rightCheckedKeys = this.rightData
        .filter(data => selectedKeys.indexOf(data.resourceId) > -1)
        .map(data => data.resourceId);
    }
  }
  addChildResource(datas: Array<ResourseDataType>) {
    this.targetKeys = this.targetKeys.concat(datas);
  }
  created() {
    this.getParentObjectValidPower();
  }
}
</script>

<style lang='scss' scoped></style>
