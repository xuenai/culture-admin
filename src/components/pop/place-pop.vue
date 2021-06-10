
// 关联场所
<template>
  <div class="pop">
    <Dialog :configer="dialogConfig" @onClose="closePop">
      <div class="condition">
        <div class="fromItem">
          <label>场所名称</label>
          <Input type="text" v-model="condition.name" placeholder="场所名称"/>
        </div>
        <div class="fromItem">
          <label>场所类型</label>
          <Select v-model="condition.type">
            <Option value="0" selected>全部</Option>
            <Option value="1">11</Option>
            <Option value="2">22</Option>
          </Select>
        </div>
        <div class="fromItem">
          <Button type="primary" class="submit" @click="handleSubmit">搜索</Button>
        </div>
      </div>
      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table
          border
          @on-selection-change="selectionTable"
          :columns="data.header"
          :loading="loading"
          :data="data.list"
          ref="table"
        >
          <template slot-scope="{ row }" slot="name">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.url">
              </div>
              <div class="info">
                <h3>{{row.name}}</h3>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 1">正常</span>
            <span v-else>禁用</span>
          </template>
        </Table>
      </baseTable>
    </Dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import Dialog from "@components/Dialog/Dialog.vue";

@Component({ components: { Dialog, baseTable } })
/**
 * 事件
 * onChange: 列表数据有变化时触发
 *
 * 参数
 * list:[
 *  id: 成员数据id
 *  url: 成员头像图片
 *  name: 成员名称
 * ]
 */
export default class addMember extends Vue {
  @Prop() private list!: Array<object>;
  // 显示隐藏
  @Prop() private show!: Boolean
  // 关闭弹窗
  closePop () {
    this.$parent.showPlace = false
  }
  //   弹窗配置
  private dialogConfig: any = {
    title: "关联场所",
    show: false
  };
  //   查询条件
  private condition: any = {
    name: "",
    type: ""
  };
  //   表格配置
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  private loading = true;
  private data: any = {
    header: [],
    list: []
  };
  // 弹窗表格选中的数据项
  private selectionList:Array<any> = []
  mounted() {
    this.getList();
  }
  // 监听显示隐藏
  @Watch("show")
  setShow (val: Boolean, oldValue: Boolean) {
    this.dialogConfig.show = val
  }
  //   搜索查询
  private handleSubmit() {
    this.getList();
  }
  // 获取列表数据的方法
  private getList() {
    this.data = {
      header: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          width: 400,
          slot: "name"
        },
        {
          title: "类型",
          key: "phone",
          width: 120,
          align: "center"
        },
        {
          title: "地址",
          key: "type",
          align: "center"
        }
      ],
      list: [
        {
          id: 22,
          phone: 13526485925,
          name: "据说这是联盟名称",
          type: "政府",
          area: "成都",
          status: 1,
          url:
            "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1905452358,4132262221&fm=27&gp=0.jpg"
        }
      ]
    };
    this.loading = false;
  }
  //   列表选择项数据变化
  private selectionTable(data: any) {
    console.log(data);
    this.selectionList = data;
  }
}
</script>

<style lang='scss' scoped>
.item {
  display: inline-block;
  width: 80px;
}
li {
  float: left;
  color: $font04;
  margin-right: 10px;
  p {
    text-align: center;
    margin-top: 10px;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
  }
  .imgDiv {
    display: inline-block;
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 3px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
    .cover {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all 0.33s;
      color: #fff;
      .cloud-icon {
        cursor: pointer;
        font-size: 18px;
        color: $danger;
      }
    }
    &:hover .cover {
      top: 0;
    }
  }
  .addDiv {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80px;
    border: 1px dotted $borderLight;
    border-radius: 3px;
    &:hover {
      border-color: $borderDark;
      background-color: $grayDark;
    }
  }
}
.condition {
  min-width: 800px;
  display: flex;
  .fromItem {
    display: flex;
    align-items: center;
    margin-right: 10px;
    label {
      display: inline-block;
      width: 80px;
      text-align: right;
      margin-right: 5px;
    }
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
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      display: flex;
      flex: 1;
      margin-left: 5px;
      justify-content: center;
      flex-direction: column;
      p {
        height: 16px;
        line-height: 16px;
      }
    }
  }
}
.condition {
  width: 800px;
}
</style>
