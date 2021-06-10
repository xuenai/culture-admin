<template>
  <div>
    <Icon :custom="`iconfont ${value}`" />
    <Tooltip placement="right" content="点击进行修改" v-if="!disabled">
      <i class="cloud-icon" @click="openModal">&#xe6b9;</i>
    </Tooltip>
    <Modal v-model="showModal" title="选择菜单图标" class="modal-local-settin-info" :closable="false" :mask-closable="false">
      <div class="icon-items">
        <div class="icon-item" v-for="icon in icons" :key="icon" :class="{active: icon === selectIcon}" @click="selsectCron(icon)">
          <Icon :custom="`iconfont ${icon}`" :size="24"/>
        </div>
      </div>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" type="text" size="large" @click="closeModal">取消</Button>
        <Button class="btn" type="primary" @click="modalConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
/**
 * MenuCronSelect 用法
 * v-model 图标类名 数据双向绑定的 {string}
 * disabled 是否展示编辑按钮 点击编辑按钮进行编辑 {boolean} 默认为false展示按钮 为true时不展示按钮
 */
// <MenuCronSelect v-model="form.cron" :disabled="true"></MenuCronSelect>
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import {icons} from '@constant/index.ts'

@Component
export default class MenuCronSelect extends Vue {
  @Prop() readonly value !: string;
  @Prop({default: false}) readonly disabled !: boolean;
  // 菜单图标
  private icons = icons
  // 弹窗中当前选中的图标
  private selectIcon = '';
  // 选择图标弹窗
  private showModal = false;
  @Emit()
  input () {
    return this.selectIcon
  }
  // 选取图标弹窗
  private openModal () {
    this.showModal = true
  }
  // 选取图标
  private selsectCron (cron: string) {
    this.selectIcon = cron
  }
  // 关闭弹窗
  private closeModal () {
    this.showModal = false
  }
  // 弹窗确定按钮点击
  private modalConfirm () {
    this.showModal = false
    this.input()
  }
}
</script>
<style lang="scss">
.modal-local-settin-info {
  .ivu-modal-header {
    border-bottom: none !important;
  }
  .ivu-modal-footer {
    border-top: none !important;
  }
}
</style>
<style lang='scss' scoped>
.iconfont{
  font-size:20px;
  margin-right:8px;
}
.cloud-icon{
  cursor:pointer;
}
.icon-items{
  padding: 0 44px;
  .icon-item{
    display:inline-flex;
    align-items:center;
    justify-content: center;
    width:60px;
    height:50px;
    margin:10px;
    border-radius:4px;
    cursor:pointer;
    &:hover{
      background: $grayDark;
    }
    &:active,
    &.active{
      color: #fff;
      background:$theme-active;
      box-shadow: 0px 11px 14px 0px rgba(0, 67, 161, 0.2);
    }
  }
}
</style>
