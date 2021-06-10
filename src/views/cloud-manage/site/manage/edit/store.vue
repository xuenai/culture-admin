
<template>
  <div class="from-box">
    <Form :label-width="80">
      <FormItem label="选择店铺：" class="item">
        <Select filterable class="input" v-model="selectValue" @on-change="onSelectShopChange">
          <Option key="cancel" value="cancelBind">请选择</Option>
          <Option v-for="shop in shopList" :key="shop.id" :value="shop.sysCode">{{shop.name}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="getMsmRecharge">确定</Button>
      </FormItem>
    </Form>
    <h3>关联记录</h3>
    <baseTable :configure="tableConfig" @getList="getList">
      <Table border :columns="tableData.header" :loading="loading" :data="tableData.list"></Table>
    </baseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue,Watch, Prop } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getRechargeRecord, getMsmRecharge, getUserSnBySiteId, cacelShopBind } from "@service/cloud-manage";
import {getShopListByUserSn} from '@service/elec.ts'

@Component({
  components: { baseTable },
})
export default class Store extends Vue {
  @Prop(String) readonly code!: string
  @Watch('code')
  refreshCode(){
    this.selectValue = this.code;
  }
  private userSn = '0405524513'
  private shopList = []
  private selectValue = ''
  private saveParams = {
    id: '',
    code: '',
    shopName: '',
    url: '',
    type: 'SHOP'
  }
  isCancel = false;
  //   表格配置参数
  private loading = true;
  private tableData: any = {
    header: [
      {
        title: "操作时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "操作人",
        key: "name",
        align: "center"
      },
      {
        title: "关联店铺",
        key: "shopName",
        align: "center"
      }
    ],
    list: []
  };
  private tableConfig: any = {
    page: {
      id: "",
      type: "SHOP",
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  // 充值
  private getMsmRecharge() {
    if (this.isCancel) {
      if (this.code) {
        let config:any = {
          title: '系统提示',
          okText: "确认取绑",
          cancelText: "取消",
          onOk: () => {
            this.cacelShopBind()
          },
          render: (h: any, params: any) => {
            return h(
              "div",
                {
                  attrs: {
                    class: "info-store"
                  }
                },
                [
                  h("h3", {
                    style: {
                      fontSize: '14px'
                    },
                  }, '你确认要取消绑定店铺吗？'),
                  h("p", {
                    style: {
                      color: 'red',
                      fontSize: '14px'
                    },
                  }, "取消后，站点关联的商品将失效，用户端点击关联商品不能进行跳转。")
                ]
              )
          }
        }
        this.$Modal.confirm(config);
      } else {
        this.$Message.info('未绑定任何店铺！');
      }
      return false;
    }
    let {code} = this.saveParams
    // 检测是否进行选择了店铺
    if (!code.length) {
      this.$Message.error('请选择店铺');
      return false
    }
    if (code === this.code) {
      this.$Message.info('未修改关联店铺！');
    } else {
        let config:any = {
          title: '系统提示',
          okText: "确认切换",
          cancelText: "取消",
          onOk: () => {
            getMsmRecharge(this.saveParams).then(res => {
              if (res.code === 0) {
                this.$Message.success('关联成功');
                this.resetPage()
                this.getList()
              }
            })
          },
          render: (h: any, params: any) => {
            return h(
              "div",
                {
                  attrs: {
                    class: "info-store"
                  }
                },
                [
                  h("h3", {
                    style: {
                      fontSize: '14px'
                    },
                  }, '你确认要切换绑定店铺吗？'),
                  h("p", {
                    style: {
                      color: 'red',
                      fontSize: '14px'
                    },
                  }, "切换后，站点关联的商品将失效，用户端点击关联商品不能进行跳转。")
                ]
              )
          }
        }
        this.$Modal.confirm(config);
    }
  }
  private resetPage () {
    this.tableConfig.page.currPage = 1
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
  // 通过站点id获取userSn
  private getUserSnBySiteId () {
    getUserSnBySiteId({siteId: this.$route.query.id}).then(res => {
      let {userSn} = res.data
      this.userSn = userSn
      if (userSn) {
        this.getShopListByUserSn()
      } else {
        this.$Message.error('未获取到userSn');
      }
    })
  }
  // 通过userSn获取关联店铺列表
  getShopListByUserSn () {
    getShopListByUserSn({usersn: this.userSn}).then(res => {
      if (res.code == 1) {
        this.shopList = res.data;
        this.setSaveParams(this.code)
      } else {
        this.$Message.error(res.msg);
      }
    })
  }
  // 店铺选择改变时
  private onSelectShopChange (value: string) {
    if (value === 'cancelBind') {
      this.isCancel = true;
      this.saveParams.code = '';
    } else {
      this.isCancel = false;
      this.setSaveParams(value);
    }
  }
  setSaveParams (value:string) {
    let index = this.shopList.findIndex((e:any) => e.sysCode == value)
    let {name, customerDomain} = this.shopList[index]
    this.saveParams.code = value;
    this.saveParams.shopName = name;
    this.saveParams.url = customerDomain as string;
  }
  // 取消店铺绑定
  cacelShopBind () {
    cacelShopBind({id: this.$route.query.id}).then(res => {
      if (res.code === 0) {
        this.selectValue = ''
        this.$Message.success('取消绑定成功');
        this.resetPage()
        this.getList()
      }
    })
  }
  mounted() {
    this.selectValue = this.code
    this.tableConfig.page.id = this.$route.query.id;
    this.saveParams.id = this.$route.query.id as string;
    this.getList();
    this.getUserSnBySiteId()
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
