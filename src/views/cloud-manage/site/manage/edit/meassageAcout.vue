/*
 * @Author: Hexg
 * @Date: 2019-07-08 19:18:38
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-07-08 21:47:23
 */

<template>
  <div class="from-box">
    <Form :label-width="120">
      <FormItem :label="title" class="item">{{num}}</FormItem>
      <FormItem label="充值条数：" class="item">
        <Input class="input" type="number" v-model="smsNum"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="getMsmRecharge">确定</Button>
      </FormItem>
    </Form>
    <h3>充值记录</h3>
    <baseTable :configure="tableConfig" @getList="getList">
      <Table border :columns="tableData.header" :loading="loading" :data="tableData.list"></Table>
    </baseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getRechargeRecord, getMsmRecharge } from "@service/cloud-manage";

@Component({
  components: { baseTable },
})
export default class MeassageAcout extends Vue {
  @Prop({default: 0, type:Number}) num!:number
  @Prop ({default: 'SHORT', type: String}) private type?: string;
  private title = '短信剩余条数：'
  //   表格配置参数
  private loading = true;
  private tableData: any = {
    header: [
      {
        title: "充值时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "充值人",
        key: "name",
        align: "center"
      },
      {
        title: "充值数量",
        key: "num",
        align: "center"
      }
    ],
    list: []
  };
  private tableConfig: any = {
    page: {
      id: "",
      type: "SHORT",
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  // 短信充值条数
  private smsNum: number = 0;
  // 充值
  private getMsmRecharge() {
    if (this.smsNum > 0) {
      let param = {
        id: this.$route.query.id,
        num: this.smsNum,
        type: this.type
      };
      getMsmRecharge(param).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success("充值成功");
          this.smsNum = 0;
          this.getList();
          this.$emit("onChange");
        }
      });
    } else {
      this.$Message.error("请输入正确的充值数");
    }
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    getRechargeRecord(page).then((res: any) => {
      if (res.code === 0) {
        this.tableData.list = res.datas;
        this.loading = false;
        Object.assign(this.tableConfig.page, res.page);
      }
    });
  }
  mounted() {
    this.tableConfig.page.id = this.$route.query.id;
    this.tableConfig.page.type = this.type
    if (this.type === 'AUDIT') {
      this.title = '剩余条数：'
    }
    this.getList();
  }
}
</script>

<style lang='scss' scoped>
.from-box {
  padding: 15px;
  background-color: $bg01;
  .item {
    margin: 10px 0;
  }
  .input {
    width: 150px;
  }
  h3 {
    height: 60px;
    line-height: 80px;
    margin-top: 20px;
    border-top: 1px solid $borderLight;
    color: $font01;
  }
}
</style>
