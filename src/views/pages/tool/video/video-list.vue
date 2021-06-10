<template>
  <div class="container">
    <div class="topic">
      <Form
      class="form"
      ref="formInline"
      inline :label-width="70"
      :data="params"
      >
        <div>
          <FormItem label="场所类型">
              <Select
              style="width: 200px"
              v-model="params.placeType"
              >
                 <Option
                    v-for="item in placeTypes"
                    :key="item.value"
                    :value="item.value"
                >{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="关键字">
              <Input type="text" :maxlength="20" v-model="params.keyword" placeholder="视频名称/所属场所名称" style="width: 200px" />
              <Button type="info" class="ml20" @click="search">搜索</Button>
              <router-link :to="{path:'/video-upload'}">
                <Button class="ml20" type="info">添加</Button>
              </router-link>
          </FormItem>
        </div>
      </Form>
    </div>
    <div>
      <baseTable :configure="tableConfig" @getList="getVideoList">
        <Table border :columns="data.columns12" :data="data.list" :configure="tableConfig" :loading='loading'>
          <template slot-scope="{ row }" slot="name">
            <p class="title theme-blue" @click="openVideo(row)" v-if="operates.includes('list_detail')">{{row.name}}</p>
          </template>
          <template slot-scope="{ row }" slot="placeTypeList">
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
              <router-link :to="{path:'/video-detail',query:{id: row.id}}">
                  <span class="theme-blue" v-if="operates.includes('list_detail')">查看</span>
              </router-link>
              <!-- <span class="theme-blue">预览</span> -->
              <router-link :to="{path:'/video-edit',query:{id: row.id}}">
                  <span class="theme-blue" v-if="operates.includes('edit')">修改</span>
              </router-link>
              <span @click="removeFun(row.id)" class="theme-blue" v-if="operates.includes('delete')">删除</span>
            </div>
          </template>
        </Table>
      </baseTable>
    </div>
    <VideoPlayer :showVideo="showVideo" :show="show" v-if="showVideo.url"></VideoPlayer>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import BaseTable from "@components/baseTable/baseTable.vue";
import {PlACE_TYPES} from '@constant/index';
import VideoPlayer from "@components/video-play/video-play.vue";
import { AppModule } from "@store/modules/app";
import {
  getVideoList,
  updateStatusVideo,
  delVideoInfo
  } from "@service/tool";

interface videoType {
  url: String;
  image: String;
  title: String;
}

@Component({
  components: {
    BaseTable,
    VideoPlayer
  }
})
export default class UploadList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private loading = true; //数据是否加载中
  private show: Boolean = false; //视频播放开关
  private placeTypes = PlACE_TYPES; //场所类型
  
  private data: any = {
    /* 表格头 */
    columns12: [
      {
        title: '序号',
        type: "index",
        width: "80",
        align: 'center'
      },
      {
        title: '视频名称',
        key: 'name',
        slot: 'name'
      },
      {
        title: '场所类型',
        key: 'placeType',
        slot: 'placeTypeList',
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
        title: '上传时间',
        key: 'createTime',
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
    /* 表格列 */
    list: [],
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
  // 获取当前站点
  get currSite () {
    if (AppModule.siteList) {
    return AppModule.siteList[AppModule.currSiteIndex]
    } else {
    return {}
    }
  }
  private params: any = {
    currPage: 1,
    pageSize: 10,
    keyword: '', //	模糊查询 视频名称或者场所名称
    placeType: '' //模糊查询 场所类型
  }
  // 视频查看
  private showVideo: videoType = {
    url: "",
    image: "",
    title: ""
  };
  private openVideo(item: any) {
    this.showVideo.url = item.url;
    this.showVideo.image = item.imgUrl;
    this.showVideo.title = item.name;
    this.show = true;
  }
  /* S 删除 */
  removeFun(id: any){
    this.$Modal.confirm({
        title: '提示',
        content: '确认删除？',
        okText: "确认删除",
        cancelText: "取消",
        onOk: () => {
          delVideoInfo({
            ids: id
          }).then((res: any) => {
            if (res.code === 0) {
              this.$Message.success("已删除")
              this.getVideoList()
            }
          })
        },
        onCancel: () => {
            // this.$Message.info('Clicked cancel');
        }
    });
  }
  /* E 删除 */
  
  mounted() {
    this.getVideoList() //获取视频列表
  }
  //   搜索
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getVideoList();
  }
  /* S 获取视频列表 */
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: "right"
  };
  private getVideoList(page: any = this.tableConfig.page){
    Object.assign(this.params, page);
    getVideoList(this.params).then(data => {
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
        })
        this.data.list = data.datas;
        this.tableConfig.page = data.page ? data.page : {};
      }
    })
  }
  /* E 获取视频列表 */

  /* S 数据状态值切换 */
  private changeStatus(row: any, title: string) {
    let _this = this
    let config: any = {
      title: "风险操作提示",
      content: "确认是否" + title + "联盟？",
      okText: "确认" + title,
      cancelText: "取消",
      onOk: () => {
        _this.alliance(row);
      }
    };
    this.$Modal.confirm(config);
  }
  /* E 数据状态值切换 */
  /* S 联盟开启、禁用 */
  private alliance(row: any) {
    let status = 1;
    if (row.status === 1) {
      status = 2;
    }
    let data = {
      id: row.id,
      status: status
    }
    updateStatusVideo(data).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功")
        this.getVideoList()
      }
    })
  }
  /* S 联盟开启、禁用 */
}
</script>

<style lang='scss' scoped>
    .switchBox {
        margin-left: 10px;
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
    padding: 20px 0;
    img{
        height: 84px;
    }
  }
  .title{
    cursor: pointer;
  }
  .action{
    span{
      margin-right: 5px;
      cursor: pointer;
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
