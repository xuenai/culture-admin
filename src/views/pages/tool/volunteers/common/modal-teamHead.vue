<template>
  <div>
    <Modal
      v-model="show"
      title="选择团队负责人"
      @on-ok="okClick"
      @on-cancel="onClose"
      @on-visible-change="getStatus"
      width="1000"
      footer-hide
    >
      <div class="condition">
        <div class="fromItem">
          <label>关键字</label>
          <Input
            type="text"
            style="width:150px;"
            @on-enter="getList"
            v-model="condition.name"
            placeholder="名称"
          />
        </div>
        <div class="fromItem">
          <Button type="primary" class="submit" @click="getList">搜索</Button>
        </div>
      </div>
      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table
          border
          @on-selection-change="selectionTable"
          :columns="checkType.columns5"
          :loading="loading"
          :data="list"
          ref="table"
          height="468"
        >
          <template slot-scope="{ row }" slot="name">
            <div class="name" :title="row.name">{{ row.name }}</div>
          </template>
          <template slot-scope="{ row }" slot="serviceRegionName">
            <div class="address" :title="row.serviceRegionName">
              {{ row.serviceRegionName }}
            </div>
          </template>
          <template slot-scope="{ row }" slot="team">
            <span
              :title="item.teamName"
              v-for="item in row.volunteerTeam"
              v-if="row.volunteerTeam.length"
              >{{ item.teamName
              }}{{ row.volunteerTeam.length > 1 ? ',' : '' }}</span
            >
            <span v-if="!row.volunteerTeam.length">-</span>
          </template>
        </Table>
      </baseTable>

      <div class="mt20 text-center">
        <Button type="primary" @click="okClick">确认</Button>
        <Button class="ml20" @click="onClose">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import baseTable from '@components/baseTable/baseTable.vue'
import { getVolunteerManList } from '@service/tool.ts'

@Component({ components: { baseTable } })
export default class Volunt extends Vue {
  private show: boolean = false
  @Prop({ default: false }) private modalShow!: boolean // 显示/隐藏
  @Watch('modalShow', { immediate: true, deep: true })
  refreshShow(modalShow: boolean) {
     this.show=modalShow;
    //            if (show && !this.list.length) this.getList();
    if (modalShow) {
      this.condition.keyword = ''
      this.getList()
    }
  }
  private checkIndex: number = -1 // 单选时，当前选中的元素索引
  @Prop({ default: 1 }) private checkWay!: number // 0 有所属社团，1无所属社团
  private checkTypes: Array<object> = [
    {
      columns5: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '名称',
          key: 'name',
          width: 250,
          slot: 'name',
          align: 'center'
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center'
        },
        {
          title: '年龄',
          key: 'age',
          align: 'center'
        },
        {
          title: '联系电话',
          key: 'phone',
          align: 'center'
        },
        {
          title: '服务地区',
          slot: 'serviceRegionName',
          align: 'center'
        },
        {
          title: '所属团队',
          slot: 'team',
          align: 'center'
        }
      ]
    },
    {
      columns5: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '名称',
          key: 'name',
          width: 250,
          slot: 'name',
          align: 'center'
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center'
        },
        {
          title: '年龄',
          key: 'age',
          align: 'center'
        },
        {
          title: '联系电话',
          key: 'phone',
          align: 'center'
        },
        {
          title: '服务地区',
          slot: 'serviceRegionName',
          align: 'center'
        }
      ]
    }
  ]
  private checkType: object = this.checkTypes[this.checkWay]

  // 默认选中id
  @Prop({ default: () => [] }) selectIds!: Array<number | string>

  created() {
    this.getList()
  }

  // 表格配置
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: 'right'
  }
  private loading = true
  // 列表数据
  private list: Array<any> = []
  //   查询条件
  private condition: any = {
    keyword: '',
    status: 1
  }
  // 获取列表数据的方法
  private getList(page?: any) {
    this.checkIndex = -1
    this.loading = true
    this.selectionList = []
    if (page) {
      Object.assign(this.condition, page)
    } else {
      this.condition.currPage = 1
    }
    getVolunteerManList(this.condition)
      .then((res: any) => {
        if (res.code === 0) {
          res.datas.forEach((item: any, i: number) => {
            if (
              this.selectIds.includes(item.id) ||
              this.selectIds.includes(item.id + '')
            ) {
              item._checked = true
              this.selectionList.push(item)
            }
          })
          this.list = res.datas
          this.tableConfig.page = res.page
        }
      })
      .finally(() => {
        this.loading = false
      })
  }

  // 弹窗表格选中的数据项
  private selectionList: Array<any> = []
  //  复选表格 列表选择项数据变化
  private selectionTable(data: Array<any>) {
    this.selectionList = data
  }
  // 点击弹窗确认按钮事件
  private okClick() {
    if (!this.selectionList || !this.selectionList.length) {
      this.$Message.info('未选中数据')
    } else {
      this.onClose()
      this.$emit('onOkClick', this.selectionList)
      this.$emit('onGetCondition', this.condition)
    }
  }
  // 弹窗关闭时
  private onClose() {
    this.$emit('onClose', false)
  }
  getStatus(status: any) {
    if (!status) {
      this.$emit('onClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.condition {
  margin-bottom: 10px;
  .fromItem {
    label {
      margin-right: 5px;
    }
    display: inline-block;
    margin-right: 10px;
  }
}

.table {
  margin-top: 10px;
  .siteInfoDiv {
    display: flex;
    margin: 5px 0;
    .imgDiv {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .address {
    max-width: 100%;
    @include ellipsis();
  }
  .name {
    max-width: 100%;
    @include ellipsis();
  }
}
</style>
