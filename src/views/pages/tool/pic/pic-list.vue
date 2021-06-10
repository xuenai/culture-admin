<template>
  <div class="container">
    <Form
    class="topic"
    ref="formInline"
    inline :label-width="70"
    :model="params"
    >
      <div>
        <FormItem label="场所类型">
            <Select
              style="width: 200px"
              v-model="params.placeType">
              <Option
                  v-for="(item,i) in placeTypes"
                  :key="i+1"
                  :value="item.value"
              >{{item.name}}
              </Option>
            </Select>
        </FormItem>
        <FormItem label="关键字">
            <Input type="text" v-model="params.keyword" style="width: 200px" placeholder="图片名称/所属场所名称" :maxlength="20" />
            <Button type="info" class="ml20" @click="search">搜索</Button>
            <router-link :to="{path:'/pic-upload'}">
              <Button class="ml20" type="info">添加</Button>
            </router-link>
        </FormItem>
      </div>
    </Form>
    <div>
      <baseTable :configure="tableConfig" @getList="getPicList">
        <Table
        border
        class="tab"
        :columns="data.header"
        :data="data.list"
        :loading="loading"
        >
          <template slot-scope="{ row }" slot="src">
              <div class="info-list daq-no-photo title"><img class="daq-img" :src='row.url' v-if="row.url" @click.stop="viewImage(row.url,row.name)" /></div>
          </template>
          <template slot-scope="{ row }" slot="placeTypeArr">
            <span>{{placeTypeList(row.placeType)}}</span>
          </template>
          <template slot-scope="{ row }" slot="status" v-if="operates.includes('status')">
            <div v-if="row.status === 1">
              <span class="switchLabel">正常</span>
              <span class="switchBox" @click="changeStatus(row,'禁用')">
                <i-switch :value="row.status === 1"/>
                <span class="cover"></span>
              </span>
            </div>
            <div v-else>
              <span class="switchLabel">禁用</span>
              <span class="switchBox" @click="changeStatus(row,'启用')">
                <i-switch :value="row.status === 1"/>
                <span class="cover"></span>
              </span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="action">
              <router-link :to="{path:'/pic-detail',query:{id: row.id}}">
                <span class="theme-blue" v-if="operates.includes('list_detail')">查看</span>
              </router-link>
              <!-- <span class="theme-blue">预览</span> -->
              <router-link :to="{path:'/pic-edit',query:{id: row.id}}">
                <span class="theme-blue" v-if="operates.includes('edit')">修改</span>
              </router-link>
              <span @click="removeFun(row.id)" class="theme-blue" v-if="operates.includes('delete')">删除</span>
            </div>
           
          </template>
        </Table>
      </baseTable>
    </div>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import BaseTable from "@components/baseTable/baseTable.vue";
import {PlACE_TYPES} from '@constant/index';
import { AppModule } from "@store/modules/app";
import {PreviewPics} from '@components/index';
import {
  getPicList,
  updateStatusPic,
  delImgInfo
  } from "@service/tool";
@Component({
  components: {
    BaseTable,
    PreviewPics
  }
})
export default class picList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private loading = true; // 数据是否加载中
  private placeTypes = PlACE_TYPES; // 场所类型
  // 接口请求params
  private params: any = {
    currPage: 1,
    pageSize: 10,
    // placesType: '',// 场所类型
    keyword: '', //	模糊查询 图片名称或者场所名称
    placeType: '' // 模糊查询 场所类型
  }

  private placeTypeList(name: string){
    switch(name){
      case "CONTENT_TYPE_VENUE": {
        return "场馆"
      }
      case "CONTENT_TYPE_SCENERY": {
        return "景区"
      }
      case "CONTENT_TYPE_HOTEL": {
        return "酒店"
      }
      case "CONTENT_TYPE_RESTAURANT": {
        return "餐饮"
      }
      case "CONTENT_TYPE_TOILET": {
        return "厕所"
      }
      case "CONTENT_TYPE_PARKING": {
        return "停车场"
      }
      default: {
        return "-"
      }
    }
  }
  private data: any = {
    // 表格头
    header: [
        {
          title: '缩略图',
          slot: 'src',
          width: 120
        },
        {
          title: '图片名称',
          key: 'name'
        },
        {
          title: '场所类型',
          key: 'placeTypeArr',
          slot:'placeTypeArr',
          align: 'center'
        },
        {
          title: '所属场所',
          key: 'placeName',
          align: 'center'
        },
        {
          title: '创建者',
          key: 'createUserName',
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          slot: "status",
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
    ],
    // 表格列
    list: []
  }
  mounted() {
    this.getPicList() //获取列表数据
  }

  // 获取当前站点
  get currSite () {
    if (AppModule.siteList) {
      return AppModule.siteList[AppModule.currSiteIndex]
    } else {
      return {}
    }
  }

  //   搜索
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getPicList();
  }

  /* S 场所类型选择 */
  plaecTypeSwitch(value: string) {
    this.params.placeType = value
  }
  /* E 场所类型选择 */
  
  /* S 获取列表数据 */
  //分页
  private tableConfig: any = {
    page: {},
    pagePosition: "right"
  }
  private getPicList(page: any = this.tableConfig.page) {
    Object.assign(this.params, page)
    getPicList(this.params).then((data: any) => {
      let datas: any = [];
      if (data.code === 0){
        this.loading = false;
        (data.datas as []).map((item: any) => {
          if(item.orgId === -1){
            item.createUserName = this.currSite.name;
          }
        });
        (data.datas as []).forEach((item: any) => {
          if(!item.placeName){
            item.placeName = '-'
          }
        });
        this.data.list = data.datas;
        this.tableConfig.page = data.page;
      }
    });
  }
  /* E 获取列表数据 */

  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private imgTitle: String = '';
  private currIndex = 0;
  private viewImage(url: any,name: String, index?: number) {
    // 判断url的类型 如果是数组 则直接赋值 如果不是数组 则先清空数组 再将url写到数组里面去
    if (Object.prototype.toString.call(url) === '[object Array]') {
      this.imgUrl = url;
    }
    if (Object.prototype.toString.call(url) === '[object String]') {
      this.imgUrl = []
      this.imgUrl.push(url)
    }
    this.imgTitle = name;
    this.visible = true;
    this.currIndex = index || 0
  }
  /* E 查看大图 */
  
  /* S 删除 */
  removeFun(id: any){
    this.$Modal.confirm({
        title: '提示',
        content: '确认删除？',
        okText: "确认删除",
        cancelText: "取消",
        onOk: () => {
          delImgInfo({
            ids: id
          }).then((res: any) => {
            if (res.code === 0) {
              this.$Message.success("已删除")
              this.getPicList()
            }
          })
        },
        onCancel: () => {
            // this.$Message.info('Clicked cancel');
        }
    });
  }
  /* E 删除 */
  
  /* S 数据启用/禁用状态值切换 */
  private changeStatus(row: any, title: string) {
    let _this = this;
    let config: any = {
      title: "提示",
      content: "确认是否" + title,
      okText: "确认" + title,
      cancelText: "取消",
      onOk: () => {
        _this.alliance(row);
      }
    }
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
    updateStatusPic(data).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功")
        this.getPicList()
      }
    })
  }
  /* E 数据启用/禁用状态值切换 */
}
</script>

<style lang='scss' scoped>
    .switchBox {
        margin-left: 10px;
    }
.ivu-form-item{
  margin-bottom: 10px;
}
.container{
  padding: 15px;
    .topic{
        width: 100%;
        padding: 15px 0 0 0;
        margin-bottom: 20px;
        background: $grayLight;
    }
    .info-list{
        margin: 15px 0;
        height: 50px;
        overflow: hidden;
        img{
            height: 100%;
            min-width: 100%;
        }
    }
  .title{
    cursor: pointer;
  }
  .action{
    span{
      cursor: pointer;
      margin-right: 5px
    }
  }
}
.switchBox {
  position: relative;
  display: inline-block;
  .cover {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
