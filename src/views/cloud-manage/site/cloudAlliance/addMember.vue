<!--
 * @Author: 任智勇
 * @since: 2019-05-31 15:19:24
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-29 15:01:54
 -->
<template>
  <div class="member">
    <ul>
      <li v-for="(item,index) in defaultList" :key="index">
        <div class="item">
          <div class="imgDiv" :class="{'daq-no-photo': !item.siteLogo}">
            <img :src="item.siteLogo" v-if="item.siteLogo">
            <div class="cover">
              <span class="cloud-icon" @click="remove(index)">&#xe631;</span>
              <span>移除成员</span>
            </div>
          </div>
          <p>{{item.name}}</p>
        </div>
      </li>
      <li>
        <div class="item">
          <div class="addDiv" @click="dialogConfig.show = true">
            <span class="cloud-icon">&#xe604;</span>
            <span>添加成员</span>
          </div>
        </div>
      </li>
    </ul>
    <Dialog :configer="dialogConfig" @onOk="okClick" @onClose="dialogConfig.show = false">
      <div class="condition">
        <div class="fromItem">
          <label>站点名称</label>
          <Input type="text" v-model="condition.keyword" placeholder="联盟名称"/>
        </div>
        <div class="fromItem">
          <label>站点类型</label>
          <Select v-model="condition.siteVersionType">
            <Option value selected>全部</Option>
            <Option value="AREA_CN">全域中文</Option>
            <Option value="AREA_EN">全域英文</Option>
            <Option value="PLAIN_CN">普通中文</Option>
            <Option value="PLAIN_EN">普通英文</Option>
          </Select>
        </div>
        <div class="fromItem">
          <label>站点类别</label>
          <Select v-model="condition.siteType">
            <Option value selected>全部</Option>
            <Option value="GOVERNMENT">政府</Option>
            <Option value="SCENIC">景区</Option>
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
          :width="1100"
          ref="table"
        >
          <template slot-scope="{ row }" slot="keyword">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.siteLogo||'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'">
              </div>
              <div class="info">
                <h3>{{row.name}}</h3>
                <p>{{row.info}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="type">
            <i>{{`${BASE[row.siteVersion]}（${BASE[row.siteLanguage]}）`}}</i>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{getSiteTypeName(row.siteType)}}</i>
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
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import Dialog from "@components/Dialog/Dialog.vue";
import { getSiteAuditList } from "@service/cloud-manage";

@Component({ components: { Dialog, baseTable } })
/**
 * 事件
 * onChange: 列表数据有变化时触发
 *
 * 参数
 * list:[
 *  id: 成员数据id
 *  siteLogo: 成员头像图片
 *  name: 成员名称
 * ]
 */
export default class addMember extends Vue {
  @Prop() private list!: any;
  private defaultList: any = [];
  @Watch("list", { immediate: true, deep: true })
  refreshList() {
    this.defaultList = this.list;
  }
  @Watch("dialogConfig", { immediate: true, deep: true })
  refreshSelectList() {
    this.getList()
  }
  private BASE: object = {
    AREA: "全域版",
    PLAIN: "普通版",
    CN: "中文",
    EN: "英文",
  }
  //   弹窗配置
  private dialogConfig: any = {
    title: "添加站点",
    show: false,
    tip: "不同类型不同语言的站点无法组成联盟"
  };
  //   查询条件
  private condition: any = {
    keyword: "",
    siteType: ""
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
    header: [
      {
        type: "selection",
        width: 60
      },
      {
        title: "站点信息",
        key: "name",
        width: 300,
        slot: "keyword"
      },
      {
        title: "站长手机号",
        key: "sitePhone",
        align: "center"
      },
      {
        title: "站点类型",
        align: "center",
        slot: "type"
      },
      {
        title: "类别",
        key: "siteType",
        align: "center",
        slot: "siteType"
      },
      {
        title: "所属行政区域",
        key: "regionName",
        align: "center"
      },
      {
        title: "状态",
        key: "status",
        align: "center",
        slot: "status"
      }
    ],
    list: []
  };
  // 弹窗表格选中的数据项
  private selectionList: Array<any> = [];
  mounted() {
    this.getList();
  }
  //   搜索查询
  private handleSubmit() {
    this.tableConfig.currPage = 1;
    this.getList();
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.condition, page);
    getSiteAuditList(this.condition).then((res: any) => {
      if (res.code === 0) {
        let arr:any = [];
        // 回显选中
        // res.datas.forEach((item:any) => {
        //   if(this.defaultList.length){
        //     for(let i = 0;i < this.defaultList.length ; i ++){
        //       if(this.defaultList[i].id == item.id && this.defaultList[i].resourceType == item.resourceType){
        //         item._checked = true;
        //       }
        //     }
        //   }
        //   arr.push(item);
        // });
        // this.data.list = arr;
        this.data.list = res.datas;
        this.loading = false;
        this.tableConfig.page = res.page;
      }
    });
  }
  // 移除成员
  private remove(index: number) {
    this.defaultList.splice(index, 1);
    this.$emit("onChange", this.defaultList);
  }
  // 点击弹窗确认按钮事件
  private okClick() {
    if (!this.selectionList.length) {
      this.$Message.info('未选择任何数据！');
      return
    }
    // 检查是否存在类型不一致的数据
    let arr: any[] = [...this.defaultList, ...this.selectionList]
    let notPass:boolean = arr.some((d:any) => (d.siteVersion !== arr[0].siteVersion || d.siteLanguage !== arr[0].siteLanguage));
    if (notPass) {
      this.$Message.error('不同类型不同语言的站点无法组成联盟！');
    } else {
      this.dialogConfig.show = false;
      // 遍历查找是否已经存在选择的元素，若存在则不添加
      for(let i:any = 0;i < this.selectionList.length;i++){
        let inArray:boolean = false;
        for(let j:any = 0;j < this.defaultList.length; j ++){
          if(this.selectionList[i].id === this.defaultList[j].id){
            inArray = true;
            break
          }
        }
        if(!inArray){
          this.defaultList.push(this.selectionList[i])
        }
      }
      // this.defaultList = this.selectionList
      this.$emit("onChange", this.defaultList);
    }
  }
  //   列表选择项数据变化
  private selectionTable(data: any) {
    this.selectionList = data;
  }
  // 匹配站点类型
  private getSiteTypeName(code: string) {
    if (code === "scenic") {
      return "景区";
    } else {
      return "政府";
    }
  }
}
</script>

<style lang='scss' scoped>
.item {
  display: inline-block;
  width: 80px;
}
ul{
  overflow: auto;
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
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
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
</style>
