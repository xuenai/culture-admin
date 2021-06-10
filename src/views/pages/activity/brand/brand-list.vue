<template>
  <div class="content">
    <Form ref="formInline" :model="params" :rules="ruleValidate" :label-width="70" inline class="form">
      <div>
        <FormItem label="名称" prop="name">
          <Input type="text" placeholder="请输入品牌名称" v-model="params.name" style="width: 350px" @on-enter="search()" />
        </FormItem>
        <FormItem label="创建者" prop="siteName">
          <Input type="text" placeholder="请输入创建者名称" v-model="params.siteName" style="width: 350px" @on-enter="search()" />
        </FormItem>
        <FormItem label="行政区域" v-if="siteInfo.siteVersion === 'AREA'">
          <VDistpicker @onChange="data => { params.region = data.region; search() }" :disabledByLevel="true"></VDistpicker>
        </FormItem>
      </div>

      <div>
        <FormItem label="状态" prop="dataStatus">
          <Select style="width: 350px" v-model="params.dataStatus" @on-change="search()">
            <Option value>全部</Option>
            <Option value="1">正常</Option>
            <Option value="2">禁用</Option>
            <Option value="3">草稿</Option>
          </Select>
        </FormItem>
        <FormItem label="提交时间" prop="submitStart">
          <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择起始日期、时间"
          :value="[params.submitStart, params.submitEnd]"
          @on-change="selectTime"
            style="width: 350px">
          </DatePicker>
          <Button type="primary" style="margin-left: 20px;" @click="search()">搜索</Button>
          <Button v-if="operates.includes('save')" type="primary" style="margin-left: 20px;" @click="$router.push({path: '/brand-add'})">添加</Button>
        </FormItem>
      </div>
    </Form>

    <BaseTable :configure="tableConfig" @getList="search">
      <Table border :columns="data.header" :data="data.list" :loading="loading" @on-selection-change="list => checkedBox = list ">
        <template slot-scope="{ row }" slot="name">
          <p class="hot">
            <span v-if="row.top">[置顶]</span>
            <span v-if="row.recommend">[推荐]</span>
            <router-link :to="{ path: '/brand-detail/' + row.id}">{{ row.name }}</router-link>
          </p>
          <p>{{row.slogan}}</p>
        </template>
        <template slot-scope="{ row }" slot="sort">
          <InputNumber :precision="0" v-if="order" :min="1" :max="999" v-model="row.sort" @on-change="() => { data.list[row._index].sort = row.sort }"></InputNumber>
          <span v-else>{{row.sort}}</span>
        </template>
        <template slot-scope="{ row }" slot="dataStatus">
          <div v-if="row.dataStatus === 1">
            <span class="switchLabel">正常</span>
            <span class="switchBox" @click="changeStatus(row,2)">
              <i-switch :value="true" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else-if="row.dataStatus === 2">
            <span class="switchLabel">禁用</span>
            <span class="switchBox" @click="changeStatus(row,1)">
              <i-switch :value="false" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else>{{getStatusTxt[row.dataStatus]}}</div>
        </template>
        <template slot-scope="{ row }" slot="action">
          <dropCode class="control" v-if="row.dataStatus===1 && operates.includes('list_detail')" :id="'qrcode' + row.id"
            :value="$store.state.app.userInfo.h5Domain+'/#/brand-desc/' + row.id">
            <span class="control">预览</span>
          </dropCode>
          <router-link class="control" :to="{ path:'/brand-add', query:{id: row.id} }"
            v-if="[1,3].includes(row.dataStatus) && operates.includes('edit') && siteInfo.id === row.siteId">修改</router-link>
          <span class="control" v-if="row.dataStatus === 3 && operates.includes('submit')"
            @click="changeStatus(row,1)">提交</span>
          <span class="control"
            v-if="operates.includes('delete') && siteInfo.id === row.siteId"
            @click="brandDelete(row)">删除</span>
        </template>
      </Table>
    </BaseTable>

    <FooterButtons :selectionList="checkedBox" :AllList="data.list"
      @changeOrder="b => order = b" @finish="type => { if (type !== 'SORT') { checkedBox = [] }; search() }"
      class="operate">
      <Button type="primary" v-if="operates.includes('batchDelete')" :disabled="order || !hasOwn"
        @click="brandDelete()">批量删除</Button>
      <Button type="primary" v-if="operates.includes('batchSave')" :disabled="order"
        @click="changeStatus('',1,true)">批量提交</Button>
    </FooterButtons>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import VDistpicker from "@components/distPicker/distPicker.vue";
import BaseTable from "@components/baseTable/baseTable.vue";
import dropCode from "@components/DropCode/DropCode.vue";
import FooterButtons from "./operate-button.vue";
import { AppModule } from "@store/modules/app";
import { getStatusTxt } from "@util/comm";
import { brandList, brandUpdate, brandDelete } from "@service/activity";

@Component({ 
  components: {
    VDistpicker,
    BaseTable,
    dropCode,
    FooterButtons
  }
})
export default class ComponentName extends Vue {
  private params: any = {
    pageSize: 10,
    currPage: 1,
    submitStart: "",
    submitEnd: "",
    region: "",
    name: "",
    dataStatus: "",
    siteName: "",
  }
  private siteInfo: any = this.$store.state.app.siteInfo;
  private ruleValidate: any = {}
  private selectTime (time: string[]) {
    this.params.submitStart = time[0] ? (time[0] + ':00') : time[0];
    this.params.submitEnd = time[1] ? (time[1] + ':00') : time[1];
    this.search()
  }
  
  created() {
    this.search()
  }
  private order: boolean = false; // 是否开始排序
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 是否有当前站点建的品牌数据
  get hasOwn() {
    return this.data.list.some((d:any) => d.siteId === this.siteInfo.id);
  }
  private loading: boolean = false;
  private getStatusTxt: Object = getStatusTxt as Object;
  // 选中数据
  private checkedBox: Array<any> = [];
  // 删除
  private brandDelete(row?: any) {
    let title = '',
        ids = '';
    if (row) {
      title = `确认是否删除${row.name as string}？` 
      ids = row.id
    } else {
      if (this.checkedBox.length) {
        if (!this.checkedBox.every((d:any) => d.siteId === this.siteInfo.id)) {
          this.$Message.info('只能选择当前站点自己的数据！')
          return 
        }
        title = `确认是否删除${this.checkedBox.length}条数据？`
        ids = this.checkedBox.map((d:any) => d.id).toString()
      } else {
        this.$Message.info('请选择要删除的数据！')
        return 
      }
    }
    this.$Modal.confirm({
      title: "风险操作提示",
      content: title,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        brandDelete({ids}).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("删除成功!");
            this.search();
          }
        });
      }
    })
  }

  // 数据状态值切换
  private changeStatus(row: any, status: number, multipleSubmit?:boolean) {
    let title = '',
        ids = '';
    if (multipleSubmit) {
      let data3 = this.checkedBox.filter((d:any) => d.dataStatus === 3)
      if (data3.length) {
        title = `确认是否提交${this.checkedBox.length}条草稿数据？`
        ids = data3.map((d:any) => d.id).toString()
      } else {
        this.$Message.info('请选择要提交的草稿数据！')
        return 
      }
    } else {
      title = `确认是否修改数据状态？`
      ids = row.id
    }
    this.$Modal.confirm({
      title: "风险操作提示",
      content: title,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        brandUpdate({
          ids,
          status
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("更新状态成功!");
            this.search(this.tableConfig.page);
          }
        })
      }
    })
  }
  private data: any = {
    header: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "品牌名称",
        slot: "name",
        width: 500,
        align: "left"
      },
      {
        title: "创建者",
        key: "siteName",
        align: "center"
      },
      {
        title: "目的地",
        key: "siteCount",
        align: "center"
      },
      {
        title: "景区",
        key: "scenicCount",
        align: "center"
      },
      {
        title: "提交时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "排序",
        slot: "sort",
        align: "center"
      },
      {
        title: "状态",
        slot: "dataStatus",
        align: "center"
      },
      {
        title: "操作",
        slot: "action",
        align: "center"
      }
    ],
    list: []
  };
  private search(page?: any) {
    this.loading = true
    if (page) {
      Object.assign(this.params, page)
    } else {
      this.params.currPage = 1
    }
    brandList(this.params).then((res:any) => {
      if (res.code === 0) {
        this.tableConfig.page = res.page
        this.data.list = res.datas
      }
    }).finally(() => this.loading = false);
  }
}
</script>

<style lang='scss' scoped>
.content {
  padding: 20px 15px;
  .switchBox {
    position: relative;
    .cover {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .form {
    background: $grayLight;
    padding: 15px 0 0;
    margin-bottom: 15px;
  }
  .hot {
    margin-top: 5px;
    & + p {
      margin-bottom: 5px;
    }
    span {
      color: $danger;
    }
  }
  .switchLabel {
    margin-right: 5px;
  }
  .control {
    color: $theme;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
