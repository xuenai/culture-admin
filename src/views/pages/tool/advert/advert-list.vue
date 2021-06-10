<template>
  <div class="content">
    <div class="topic">
      <Form :data='params' class="form" ref="formInline" inline :label-width="80">
        <div>
          <FormItem label="广告名称">
            <Input type="text" placeholder="请输入关键字" :maxlength="20" style="width: 200px" v-model="params.adName"/>
          </FormItem>
          <FormItem label="广告位名称">
            <Input type="text" placeholder="请输入关键字" :maxlength="20" style="width: 200px" v-model="params.adPositionName"/>
          </FormItem>
          <FormItem label="发布渠道">
            <Select style="width: 200px" v-model="params.publishChannel">
              <Option v-for="item in columnList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <Button type="info" @click="search">搜索</Button>
          <router-link :to="{path:'/advert-upload'}">
            <Button class="ml20" type="info">添加</Button>
          </router-link>
        </div>
      </Form>
    </div>
    <baseTable :configure="tableConfig" @getList="getList">
      <Table
        :columns="tableData.headList"
        :data="tableData.bodyList"
        :loading="loading"
        class="mt20"
        border
      >
        <template slot-scope="{row}" slot="imgs">
          <div class="clearfix">
            <p
              class="img daq-no-photo daq-no-data fl"
              v-for="(item, picIndex) in row.imgs"
              :key="item"
              v-show="row.imgs && row.imgs.length"
            >
              <img class="daq-img" :src='item' @click.stop="viewImage(row.imgs, picIndex)" />
            </p>
          </div>
          <span v-if="!row.imgs.length">-</span>
        </template>
        <template slot-scope="{row}" slot="adPositionStatus">
          <span v-if="row.adPositionStatus === 1">启用</span>
          <span v-if="row.adPositionStatus === 2">禁用</span>
        </template>
        <template slot-scope="{row}" slot="publishChannel">{{getPubChannelTxt(row.publishChannel)}}</template>
        <template slot-scope="{row}" slot="status" v-if="operates.includes('status')">
          <div v-if="row.status === 1">
            启用
            <span class="switch">
              <i-switch :value="true"/>
              <i class="cover" @click="changeState(row)"></i>
            </span>
          </div>
          <div v-if="row.status === 2">
            禁用
            <span class="switch">
              <i-switch :value="false"/>
              <i class="cover" @click="changeState(row)"></i>
            </span>
          </div>
        </template>
        <template slot-scope="{row, index}" slot="action">
          <router-link :to="{path: '/advert-detail', query:{id: row.id}}" class="theme-blue action-btn" v-if="operates.includes('list_detail')">查看</router-link>
          <router-link
            :to="{path: '/advert-edit', query: {id: row.id}}"
            class="theme-blue action-btn"
            v-if="operates.includes('edit')"
          >修改</router-link>
          
          <a class="theme-blue action-btn" @click="del(row, index)" v-if="operates.includes('delete')">删除</a>
        </template>
      </Table>
    </baseTable>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="picIndex"></PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import {PreviewPics} from '@components/index';
import {
  getAdLsit,
  delAdLsit,
  updateStatusAdv
  } from "@service/tool";
@Component({
  components: {
    baseTable,
    PreviewPics
  }
})
export default class advertList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private loading: Boolean = false;//数据是否加载中

  // 发布渠道
  private columnList = [
    {
      name: "全部",
      value: ""
    },
    {
      name: "PC",
      value: "PC"
    },
    {
      name: "APP",
      value: "APP"
    },
    {
      name: "微网站",
      value: "MICRO_SITE"
    },
    {
      name: "小程序",
      value: "SMALL_PROGRAM"
    }
  ];
  getPubChannelTxt(txt: string){
    switch (txt) {
      case "MICRO_SITE": {
        return "微网站"
      }
      case "SMALL_PROGRAM": {
        return "小程序"
      }
      default:{
        return txt;
      }
    }
  }
  // 标题
  private tableData: any = {
    headList: [
      {
        title: "广告图",
        key: "imgs",
        slot: "imgs"
      },
      {
        title: "广告名称",
        key: "name"
      },
      {
        title: "所属广告位",
        key: "adPositionName",
        align: "center"
      },
      {
        title: "发布渠道",
        key: "publishChannel",
        align: "center",
        slot: 'publishChannel'
      },
      {
        title: "广告位状态",
        key: "adPositionStatus",
        align: "center",
        slot: "adPositionStatus"
      },
      {
        title: "广告状态",
        key: "status",
        align: "center",
        slot: "status"
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        slot: "action"
      }
    ],
    bodyList: []
  };
  

 
  mounted() {
    this.getList(); //   列表
  }
  //   搜索
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  /* S 获取列表信息 */
  private params: Object = {
    publishChannel: "", // 发布渠道
    adPositionName: "", // 广告位名称
    adName: "" // 广告名称
  };
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: "right"
  };
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.params, page);
    getAdLsit(this.params).then(data => {
      if(data.code === 0){
        this.tableConfig.page = data.page ? data.page : {};
        this.tableData.bodyList = data.datas as [];
        this.loading = false;
      }
    });
  }
  /* E 获取列表信息 */

  /* S 修改状态 */
  private changeState(item: any) {
    // @ts-ignore
    // if (!this.operates.includes("status")) {
    //   return;
    // }
    let _this = this;
    let config: any = {
      title: item.status === 2 ? "启用广告" : "禁用广告",
      content:
        item.status === 2
          ? `确认是否启用“${item.name}”广告？`
          : `确认要禁用“${item.name}”广告？禁用后用户端将不显示广告！`,
      okText: item.status === 2 ? `确认启用` : `确认禁用`,
      cancelText: "取消",
      onOk: () => {
        // 改变状态
         _this.alliance(item);
      }
    };
    this.$Modal.confirm(config);
  }
  private alliance(row: any) {
    let status = 1;
    if (row.status === 1) {
      status = 2;
    }
    let data = {
      id: row.id,
      status: status
    }
    updateStatusAdv(data).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功")
        this.getList();
      }
    })
  }
  /* E 修改状态 */
  
  /* S 查看大图 */
  private imgUrl:Array<string> = []
  private visible: Boolean = false // 图片查看
  private picIndex = 0
  private viewImage(url: Array<string>, index:number) {
      this.imgUrl = url;
      this.visible = true;
      this.picIndex = index
  }
  /* E 查看大图 */
  
  /* S 删除 */
  private del(item: any, index: any) {
    let config: any = {
      title: "删除广告",
      content: `确认要删除“${item.name}”广告？删除后用户端将不显示广告`,
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        // 删除
        this.delAdv(item, index)
      }
    };
    this.$Modal.confirm(config);
  }
  
  private delAdv(item: any, index: any) {
    delAdLsit({
      ids: item.id
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("删除成功");
          // this.tableConfig.page.currPage = 1;
          this.getList();
        // if (index !== -1) {
        //   this.tableData.bodyList.splice(index, 1);
        // } else {
        //   this.tableConfig.page.currPage = 1;
        //   this.getList();
        // }
      }
    });
  }
  /* E 删除 */
}
</script>

<style lang='scss' scoped>
.action-btn {
  cursor:pointer;
  margin-right: 5px;
}
.switch {
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  position: relative;
  width: 44px;
  height: 22px;
  cursor: pointer;
  .cover {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
  }
}
.content {
  overflow: hidden;
  padding: 15px;
  .topic {
    width: 100%;
    padding: 15px 0 0 0;
    background: $grayLight;
  }
  .orderHeaderAde {
    padding: 16px 0;
    background-color: #f2f2f2;
    position: relative;
    .big,
    .middle {
      float: left;
    }
    .big {
      width: 40%;
      text-align: center;
    }
    .middle {
      width: 10%;
      text-align: center;
    }
  }
  .img {
    width: 55px;
    height: 30px;
    overflow: hidden;
    cursor: pointer;
    margin: 10px 10px 10px 0;
    img{
    min-width: 100%;
      height: 100%;
    }
  }
}
.action{
  p{
    margin-top: 10px;
  }
}
</style>
