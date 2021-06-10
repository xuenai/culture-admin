<template>
  <div class="ivu-transfer-list">
    <div class="ivu-transfer-list-header">
      <Checkbox :value="checkedAll" @on-change="toggleSelectAll"></Checkbox>
      <span class="ivu-transfer-list-header-title" @click="toggleSelectAll(!checkedAll)">{{title}}</span>
      <span class="ivu-transfer-list-header-count">{{count}}</span>
    </div>
    <div class="ivu-transfer-list-body">
      <ul class="ivu-transfer-list-content">
        <li class="ivu-transfer-list-content-item"
          v-for="item in showItems"
          :key="item.resourceId"
          @click.prevent="select(item)"
          :title="item.pname ? `${item.name}(${item.pname})` : `${item.name}`"
        >
          <Checkbox :value="isCheck(item)"></Checkbox>
          <span class="name">{{item.name}}<span v-if="item.pname">（{{item.pname}}）</span></span>
          <span class="theme" @click.stop="listItemClick(item)" v-if="showResourceType && childResourceIsShow(item.resourceType)">({{getResourceTxtByresourceType(item.resourceType)}})</span>
        </li>
        <li class="ivu-transfer-list-content-not-found">{{ notFoundText }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'

interface ResourseDataType {
  name: string;
  resourceId: string;
  resourceType: 'CONTENT_TYPE_VENUE' | 'CONTENT_TYPE_HOTEL' | 'CONTENT_TYPE_SCENERY' | 'CONTENT_TYPE_ACTIVITY_SHIU' | 'CONTENT_TYPE_SCENIC_SPOTS' | 'CONTENT_TYPE_HOTEL_ROOM' | 'CONTENT_TYPE_RESTAURANT' | 'CONTENT_TYPE_TOILET' | 'CONTENT_TYPE_PARKING';
  child?: Array<ResourseDataType>;
  pid?:string;
  pname?:string;
  ptype?: string;
}

@Component
export default class CTransferRightList extends Vue {
  // 列表标题
  @Prop() readonly title!:string;
  // 列表展示数据
  @Prop() readonly data!:Array<ResourseDataType>;
  // 没有数据展示的文本
  @Prop({default: '列表为空'}) readonly notFoundText!:string;
  // 是否显示点击子类型
  @Prop({default: false}) readonly showResourceType!:boolean;
  // 当前选中数量
  @Prop() readonly validKeysCount!:number;
  // 选中的选项
  @Prop() readonly checkedKeys!:Array<any>;
  // 筛选过后展示的列表数据
  private showItems:Array<ResourseDataType> = [];
  // 获取当前选中的长度
  get count () {
    const validKeysCount = this.validKeysCount;
    return (validKeysCount > 0 ? `${validKeysCount}/` : '') + `${this.data.length}`;
  }
  // 所有选中
  get checkedAll ():boolean {
    return this.showItems.length === this.validKeysCount && this.validKeysCount !== 0;
  }
  // 获取筛选的数据
  get filterData () {
      return this.showItems
  }
  // 监听列表数据变化
  @Watch("data", { immediate: true, deep: true })
  private updateFilteredData (val: Array<ResourseDataType>) {
      this.showItems = val;
  }
  // 获取子资源的名称
  getResourceTxtByresourceType (resourceType: string) {
    let resourceTypeName:any = {
      'CONTENT_TYPE_VENUE': '活动室',
      'CONTENT_TYPE_SCENERY': '景点',
      'CONTENT_TYPE_HOTEL': '客房'
    }
    return resourceTypeName[resourceType]
  }
  // 判断是否应该显示子资源点
  childResourceIsShow (resourceType: string) {
    let arr = 'CONTENT_TYPE_VENUE,CONTENT_TYPE_SCENERY,CONTENT_TYPE_HOTEL'.split(',');
    return arr.includes(resourceType)
  }
  // 子资源点击
  listItemClick (item: ResourseDataType) {
    this.$parent.getChildrenHandle(item)
  }
  /**
   * toggleSelectAll 转化全选模式
   * @params status {boolean} true: 全选 ，false:全部不选中
   */
  toggleSelectAll(status: boolean) {
    const keys = status ? this.filterData.map(data => data.resourceId) : [];
    this.$emit('on-checked-keys-change', keys);
  }
  /**
   * isCheck 判断是否选中
   */
  isCheck (item:ResourseDataType) {
    return this.checkedKeys.some(key => key === item.resourceId);
  }
  /**
   * 点击选中
   */
  select (item:ResourseDataType) {
    const index = this.checkedKeys.indexOf(item.resourceId);
    index > -1 ? this.checkedKeys.splice(index, 1) : this.checkedKeys.push(item.resourceId);
    this.$parent.handleCheckedKeys();
  }

}
</script>

<style lang='scss' scoped>
.ivu-transfer-list{
  width:240px;
}
.ivu-transfer-list-content-item{
  cursor: inherit;
  user-select:none;
}
.theme{
  color:$theme;
  cursor: pointer;
  vertical-align: middle;
}
.name{
  display: inline-block;
  vertical-align: middle;
  max-width:130px;
  @include ellipsis;
  cursor:pointer;
}
</style>
