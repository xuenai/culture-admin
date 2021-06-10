<!--
 * @Author: 任智勇
 * @since: 2019-06-04 09:14:58
 * @LastAuthor: 陈艳玲
 * @lastTime: 2019-11-26 11:20:10
 -->
<template>
  <div class="container pd15">
    <div class="wrap">
      <Form :label-width="80" inline>
        <FormItem class="item" label="关键字">
          <Input placeholder="请输入关键字" v-model="params.name"/>
        </FormItem>
        <FormItem class="item" label="所属标签">
          <Input placeholder="请输入标签名称" v-model="params.tagName"/>
        </FormItem>
        <FormItem class="item" label="所属话题">
          <Input placeholder="请输入话题名称" v-model="params.topicName"/>
        </FormItem>
        <FormItem class="item" label="故事分类">
          <Select class="w150" v-model="params.storyType">
            <Option value>全部</Option>
            <Option value="story ">故事</Option>
            <Option value="strategy">攻略</Option>
            <Option value="ichWorks">非遗作品</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="审核方式">
          <Select class="w150" v-model="params.auditType">
            <Option value>全部</Option>
            <Option value="artificial ">人工审核</Option>
            <Option value="machine">人工智能</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="发布时间">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="请选择发布时间"
            @on-change="setTime"
          ></Date-picker>
        </FormItem>
        <div class="submit">
          <Button type="primary" class @click="search">搜索</Button>
        </div>
      </Form>
    </div>
    <baseTable :configure="tableConfig" @getList="getList">
      <Table
        border
        :columns="tableData.headList"
        :data="tableData.bodyList"
        class="table story-table"
        :loading="loading"
      >
        <template slot-scope="{row}" slot="story">
          <div class="story" v-if="row.storyType === 'story'">
            <h3 class="title">{{row.title}}</h3>
            <div class="content mt10 line5" :title="row.content" v-html="row.content"></div>
            <ul class="img-list mt10" v-if="row.images.length">
              <li class="img daq-no-photo" v-for="(items,picInd) in row.images" :key="picInd">
                <img :src="items" class="cloud-img" alt  @click.stop="viewImage(row.images,row.title,picInd)">
              </li>
            </ul>
            <div class="info mt10">
              <div class="address" v-if="row.resourceName">
                 <i class="cloud-icon">&#xe606;</i>
                 {{row.resourceName}}
               </div>
              <div class="address" v-if="row.longitude && row.latitude && row.address != '-1'&&!row.resourceName">
                <i class="cloud-icon">&#xe606;</i>
                {{row.address}}
              </div>
              <ul class="count-panel">
                <li>收藏数：{{row.collectionNum}}</li>
                <li>点赞数：{{row.likeNum}}</li>
                <li>评论数：{{row.commentNum}}</li>
              </ul>
            </div>
          </div>
          <div class="story" v-if="row.storyType === 'strategy'">
            <h3 class="title">{{row.title}}</h3>
            <!-- <div class="trip-panel">
              <ul class="trip-list" v-if="row.strategyDetail.length">
                <li class="item" v-for="(item, index) in row.strategyDetail" :key="index + 'i'">
                  <span class="day">DAY{{index + 1}}</span>
                  <span class="scenic-name">{{item.title}}</span>
                </li>
              </ul>
            </div> -->
            <ul class="img-list mt10" v-if="row.images.length">
              <li class="img daq-no-photo" v-for="(items,picInd) in row.images" :key="picInd">
                <img :src="items" class="cloud-img" alt  @click.stop="viewImage(row.images,row.title,picInd)">
              </li>
            </ul>
            <div class="info mt10">
              <ul class="count-panel">
                <li>收藏数：{{row.collectionNum}}</li>
                <li>点赞数：{{row.likeNum}}</li>
                <li>评论数：{{row.commentNum}}</li>
              </ul>
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="label">
          <div class="labels">
            <p v-if="row.tagName">#{{row.tagName}}#</p>
            <p v-if="row.topicName">话题：# {{row.topicName}} #</p>
            <p v-else>-</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="releasePeople">
          <div class="releasePeople">
            <div class="avatar">
              <img :src="row.vipHead" class="cloud-img" v-if="row.vipHead">
              <img v-else src="@assets/image/site-default.png" class="cloud-img" />
            </div>
            <div>
              <span class="name" v-if="row.ichHpName">{{row.ichHpName}}</span>
              <span class="name ml10" v-if="!row.ichHpName">{{row.vipNickName || '游客'}}</span>
              <span class="people-tag" v-if="row.ichHpName">非遗传承人</span>
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="auditType">
          <p>
            <span v-if="row.auditType === 'artificial'">人工审核</span>
            <span v-if="row.auditType === 'machine'">人工智能</span>
            <span v-if="!row.auditType">-</span>
          </p>
        </template>
          <template slot-scope="{ row }" slot="status">
              <span v-if="row.status === 3">草稿</span>
              <div v-if="[1,2].includes(row.status)">
                  <span class="switchLabel">{{['正常','禁用'][row.status - 1]}}</span>
                  <span class="switchBox" @click="changeStatus(row)">
                       <i-switch :value="row.status === 1"/>
                       <span class="cover"></span>
                   </span>
              </div>
          </template>

        <template slot-scope="{row}" slot="action">
          <dropCode
              class="action-btn"
              :id="'qrcodeTopic' + row.id"
              :key="'qrcodeTopic' + row.id"
              :value="$store.state.app.userInfo.h5Domain+'/#/' + (row.storyType === 'story' ? 'story-detail' : 'strategy-detail') + '/' +row.id"
            >
              <span class="theme-blue action-btn">预览</span>
          </dropCode>
          <a class="theme-blue action-btn" v-if="row.homeCover === 0 && row.listCover === 0" @click="setCover(row)">设为封面</a>
          <a class="theme-blue action-btn" v-else @click="outCover(row)" style="margin-left:10px;">取消封面</a>
          <router-link
            :to="{path: '/story-detail', query: {id: row.id}}"
            class="theme-blue action-btn"
          >查看
          </router-link>
        </template>
      </Table>
    </baseTable>
    <Modal
      v-model="show"
      title="提示"
      width="400"
      @on-ok="dialogConfirm('ok')"
      @on-cancel="dialogConfirm('close')"
    >
      <!--<p>此故事未添加标题，不能设为封面。</p>-->
      <div class="text-center">
        <p>你可以此故事设为时光主页封面或标签列表页封面，请选择：</p>
        <div class="mt20 btn-panel">
          <Button
            @click="setCoverActive('human')"
            :type="cover==='human'? 'primary':'default'"
          >设为时光主页封面</Button>
          <Button
            class="ml10"
            @click="setCoverActive('tagList')"
            :type="cover==='tagList'? 'primary':'default'"
          >设为标签列表页封面</Button>
        </div>
      </div>
    </Modal>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getStoryList, setCover, updateStoryStatus } from "@service/topic";
import { PreviewPics } from '@components/index';
import dropCode from "@components/DropCode/DropCode.vue";
@Component({
  components: {
    baseTable,
    PreviewPics,
    dropCode
  }
})
export default class storyList extends Vue {
  private show: boolean = false;
  private cover: string = "human";
  private loading: boolean = false;
  private item: any = {};
  private params: any = {
    auditStatus: 6,
    auditType: "",
    createEndDate: "",
    createStartDate: "",
    name: "",
    tagName: "",
    topicName: "",
    storyType:""
  };
  private tableData: any = {
    headList: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "故事",
        key: "story",
        slot: "story",
        width: 400
      },
      {
        title: "所属标签",
        key: "label",
        slot: "label",
        align: "center"
      },
      {
        title: "发布人",
        key: "releasePeople",
        slot: "releasePeople",
        width: 150,
        align: "center"
      },
      {
        title: "发布时间",
        key: "createDate",
        align: "center"
      },
      {
        title: "审核方式",
        key: "auditType",
        align: "center",
        slot: "auditType"
      },
      {
        title: "状态",
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
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: "right"
  };
  mounted() {
    this.params.tagName = this.$route.query.tag||'';
    this.getList();
  }
  //   搜索
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  // 时间
  private setTime(e: any) {
    this.params.createStartDate = e[0];
    this.params.createEndDate = e[1];
  }
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
  // 列表
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.params, page);
    getStoryList(this.params).then(data => {
      this.tableConfig.page = data.page ? data.page : {};
      (data.datas as []).map((item: any) => {
          if (item.storyType === 'strategy') {
              if (item.cover) item.images.unshift(item.cover)
          }
          item.address = ''
          if (item.longitude && item.latitude) {
              this.geocoder(item.longitude, item.latitude).then((address:string) => item.address = address);
          }
      });
      this.tableData.bodyList = data.datas as [];
      this.loading = false;
    });
  }

    private geocoderObj = new AMap.Geocoder();
    //经纬度转换为地址
    private geocoder(lnglatX: number | string, lnglatY: number | string): Promise<string> {
        return new Promise((resolve: Function, reject: Function) => {
            if (!lnglatX || !lnglatY) {
                reject()
            } else {
                this.geocoderObj.getAddress([lnglatX, lnglatY], function (status: string, result: any) {
                    if (status === "complete" && result.info === "OK") {
                        resolve(result.regeocode.formattedAddress)
                    } else {
                        reject()
                    }
                });
            }
        })
    }

  //弹框确认按钮
  dialogConfirm(type: string) {
    if (type === "ok") {
      setCover({
        id: this.item.id,
        homeCover: this.cover === "human" ? 1 : 0,
        listCover: this.cover === "tagList" ? 1 : 0
      }).then(data => {
        if (data.code === 0) {
          this.$Message.success("设置成功！");
          this.getList()
        }
      });
    } else {
      this.cover = "human";
      this.item = {};
    }
  }
  setCover(row: object) {
    this.item = row;
    this.show = true;
  }
  //设置封面按钮
  setCoverActive(data: string) {
    this.cover = data;
  }
  outCover(row:any){
    this.$Modal.confirm({
      title: '取消封面',
      content: '<p>是否取消封面设置</p>',
      onOk: () => {
        setCover({
          id: row.id,
          homeCover: 0,
          listCover: 0
        }).then(data => {
          if (data.code === 0) {
            this.$Message.success("操作成功！");
            this.getList()
          }
        });
      },
      onCancel: () => {

      }
    });
  }
    // 点击 状态切换
    private changeStatus (row:any) {
        updateStoryStatus({
            id: row.id,
            status: [2, 1][row.status - 1]
        }).then((res:any) => {
            if (res.code === 0) {
                this.getList()
                this.loading = false
            }
        })
    }
}
</script>
<style lang="scss">
.story-table{
  .ivu-table-cell{
    overflow:inherit;
  }
}
</style>
<style lang="scss" scoped>
.switchLabel {
    margin-right: 5px;
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

.line5 {
    @include ellipsisLn(5);
}
.inp-control {
  width: 70%;
}
.w150 {
  width: 150px;
}
.label-name {
  width: 75px;
  line-height: 35px;
}
.add-btn {
  width: 100px;
}
.wrap {
  padding: 15px 15px 0 15px;
  background-color: $grayLight;
  .submit{
    display: inline-block;
    margin:0 0 15px 10px;
  }
  .ivu-form-item{
    margin-bottom: 15px!important;
  }
}
.table {
  margin-top: 15px;
  .action-btn {
    cursor:pointer;
    & + .action-btn {
      margin-left: 5px;
    }
  }

  .releasePeople {
    position:relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    .avatar {
      position: relative;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      // overflow: hidden;
      img{
        width:100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .name {
      // line-height: 20px;
    }
    .people-tag{
      // position:absolute;
      z-index:9999;
      display:inline-block;
      // left:26px;
      top:-6px;
      width:65px;
      height:20px;
      line-height:20px;
      font-size:12px;
      color:#ff9051;
      border:1px solid #ff9051;
      border-radius:4px;
    }
  }
  .story {
    padding: 8px 0;
    .img-list {
      @include clearfix;
      .img {
        float: left;
        width: 50px;
        height: 50px;
        overflow: hidden;
        cursor: pointer;
        & + .img {
          margin-left: 5px;
        }
      }
    }
    .info {
      @include clearfix;
    }
    .address {
      float: left;
      background-color: $bg;
      padding: 2px 5px;
      border-radius: 4px;
      color: $font02;
    }
    .count-panel {
      float: left;
      margin-top: 2px;
      li {
        display: inline-block;
        margin-left: 10px;
        & + li {
          position: relative;
          padding-left: 8px;
          &:after {
            position: absolute;
            left: 0;
            top: 3px;
            content: "";
            height: 12px;
            width: 1px;
            background-color: $borderDark;
          }
        }
      }
    }
    .trip-panel {
      /*border:1px solid red;*/
      margin-bottom: 15px;
    }
    .trip-list {
      @include clearfix;
      .item {
        vertical-align: top;
        position: relative;
        display: inline-block;
        height: 1px;
        border-top: 1px solid $borderLight;
        min-width: 70px;
        max-width: 150px;
        margin: 30px 0;
        text-align: center;
        &:before {
          top: -5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid $borderLight;
        }
        &:first-of-type {
          &:before {
            position: absolute;
            content: "";
            left: -10px;
          }
        }
        &:last-of-type {
          &:before {
            position: absolute;
            content: "";
            right: -10px;
          }
        }
        &:after {
          position: absolute;
          left: 50%;
          top: 0;
          content: "";
          height: 10px;
          width: 1px;
          border-left: 1px dashed $borderLight;
        }
      }
      .day {
        position: absolute;
        width: 100%;
        text-align: center;
        top: -20px;
        left: 0;
      }
      .scenic-name {
        display: block;
        width: 100%;
        text-align: center;
        padding-top: 10px;
        @include ellipsis();
      }
    }
  }
}
</style>
