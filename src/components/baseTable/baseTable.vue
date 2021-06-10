<!--
 * @Author: 任智勇
 * @since: 2019-05-24 17:08:08
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-25 11:29:12
 -->
<template>
  <div>
    <slot></slot>
    <div class="pageBox" :style="position">
      <Page
        class="pages"
        v-if="showPage"
        :style="position"
        @on-change="changePages"
        @on-page-size-change="changeSize"
        :total="configure.page.total"
        :current="configure.page.currPage"
        :page-size="configure.page.pageSize"
        :page-size-opts="sizeOpts"
        show-elevator
        show-sizer
        show-total
      />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

@Component({ components: {} })

/**
 * 组件绑定 @getList 方法用以切换分页时调用父组件的方法，参数为分页参数对象
 * data: 接口返回的数据
 * page: 分页信息
 * showPage: 是否显示分页
 * pagePosition:分页栏位置 left 、right、 center 默认 left
 */
export default class BaseTable extends Vue {
  // 设置prop类型
  @Prop() private configure!: any;
  @Prop({default: ()=>[10,20,50,100]}) sizeOpts!: Array<number>;
  @Watch("configure", { immediate: true, deep: true })
  refreshData(val: object) {
    this.setTableOption();
  }
  private showPage: boolean = true; // 是否显示分页
  private page: any; // 分页
  private position: string = ''; // 分页栏位置 
  mounted() {
    this.setTableOption();
  }
  // 切换页码
  private changePages(page: number) {
    this.page.currPage = page;
    this.$emit("getList", this.page);
  }
  // 切换页量
  private changeSize(size: number) {
    this.page.pageSize = size;
    this.$emit("getList", this.page);
  }

  // 设置表格数据
  private setTableOption() {
    this._setPage();
  }
  // 设置分页信息
  private _setPage() {
    this.page = this.configure.page;
    // 分页是否显示
    if (this.configure.showPage === false) {
      this.showPage = false;
    }
    // 分页栏位置
    switch (this.configure.pagePosition){
      case 'left': this.position = '';break
      case 'center': this.position = 'justify-content: center;';break
      case 'right': this.position = 'justify-content: flex-end;';break
    }
  }
}
</script>

<style lang='scss' scoped>
.pages {
  margin: 10px;
}
.pageBox {
  display: flex;
}
</style>
