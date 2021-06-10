<!--
 * @Author: xulr
 * @since: 2019-05-31 10:04:22
 * @LastAuthor: 陈艳玲
 * @lastTime: 2019-11-25 16:42:48
 -->
<template>
  <div class="pd20">
    <div class="wrap">
      <Form :label-width="80" inline>
        <FormItem class="item" label="名称">
          <Input placeholder="请输入标签名称" v-model="params.tagName" />
        </FormItem>
        <FormItem class="item" label="创建时间：">
          <Date-picker
            type="daterange"
            placement="bottom-end"
            placeholder="选择日期"
            @on-change="setTime"
          ></Date-picker>
        </FormItem>
        <FormItem class="item" label="故事超过">
          <inputNumber :min="0" placeholder type="number" v-model="params.storyNum" />条
        </FormItem>
        <FormItem class="item" label="状态">
          <Select class="w150" v-model="params.status">
            <Option value="">全部</Option>
            <Option :value="1">正常</Option>
            <Option :value="2">禁用</Option>
          </Select>
        </FormItem>
        <div class="submit">
          <Button type="primary" @click="search">搜索</Button>
          <Button
            type="primary"
            class="add-btn"
            style="margin-left:10px;"
            @click="renderModal(-1, -1)"
          >添加</Button>
        </div>
      </Form>
    </div>
    <div>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          class="table"
          :loading="loading"
          @on-selection-change="setChecked"
        >
          <template slot-scope="{row}" slot="name">
            <div class="topic-msg">
              <div class="img daq-no-photo">
                 <img class="cloud-img" :src="row.cover" @click.stop="viewImage(row.cover,row.name)" alt />
              </div>
              <div class="fl msg-panel">
                <span class="red" v-if="row.recommend === 1">[推荐]</span>
                <span class="red" v-if="row.top === 1">[置顶]</span>
                <router-link
                  tag="a"
                  :to="{path:'/story-list',query:{tag:row.name}}"
                  class="theme-blue topicTag ml5"
                >{{row.name}}</router-link>
              </div>
            </div>
          </template>
          <template slot-scope="{row}" slot="createUser">
            <span v-if="row.vipId">
              <router-link
                tag="a"
                :to="{path:'/member-detial',query:{id:row.vipId}}"
              >{{row.createUser}}</router-link>
            </span>
            <span v-else>{{row.createUser}}</span>
          </template>
          <template slot-scope="{row}" slot="sort">
            <span v-if="!sort">{{row.sort || '-'}}</span>
            <InputNumber
              v-if="sort"
              @on-change="changeSort(row)"
              :min="0"
              :max="999"
              v-model="row.sort"
            />
          </template>
          <template slot-scope="{row,index}" slot="status">
            <div>
              <span>{{row.status === 1 ? '正常' : '禁用'}}</span>
              <span class="switch">
                <i-switch :value="true" v-if="row.status === 1" />
                <i-switch :value="false" v-if="row.status === 2" />
                <i class="cover" @click="changeStatus(row, index)"></i>
              </span>
            </div>
          </template>
          <template slot-scope="{row,index}" slot="action">
            <!-- <router-link to class="theme-blue action-btn">预览</router-link> -->
            <dropCode
              class="action-btn"
              :id="'qrcodeTopic' + row.id"
              :key="'qrcodeTopic' + row.id"
              :value="$store.state.app.userInfo.h5Domain+'/#/story-list/' +row.id"
            >
              <span class="theme-blue action-btn">预览</span>
            </dropCode>
            <a class="theme-blue action-btn" v-if="operates.includes('edit')" @click="renderModal(row, index)">修改</a>
            <a class="theme-blue action-btn" v-if="operates.includes('delete')" @click="removeTag(row, index)">删除</a>
          </template>
        </Table>
      </baseTable>
    </div>
    <Row class="operate">
      <Col class="text-center">
        <footerButtons
          type="CONTENT_TYPE_SCENERY"
          :selectionList="footerList"
          :orderRowData="orderRowData"
          @changeOrder="changeOrder"
          @getList="getList"
          class="operate"
        >
          <Button
            type="primary"
            class="ml10"
            @click="removeTag(checkedBox, -1)"
            :disabled="sort"
          >批量删除</Button>
        </footerButtons>
      </Col>
    </Row>
    <Modal v-model="showTag" :title="tagId ? '修改标签' : '添加标签'" footer-hide>
      <Form ref="modalData" :rules="ruleValidate" :model="modalData">
        <FormItem label="标签名称：" :label-width="90" prop="labelName">
          <Input v-model="tagName" :maxlength="20" placeholder="请输入标签名称" />
        </FormItem>
        <FormItem label="标签图片：" :label-width="90" prop="labelImg">
          <uploadImg :limit="1" @getImagesList="getImage" :defaultImage="tagImage"></uploadImg>
          <span class="img-format">格式：png / jpg</span>
        </FormItem>
        <FormItem :label-width="90">
          <Button class="btn" @click="closeTag('close')">取消</Button>
          <Button class="btn" type="primary" @click="closeTag('ok')" style="margin-left:20px;">确定</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import footerButtons from "./tag-btn.vue";
import dropCode from "@components/DropCode/DropCode.vue";
import uploadImg from "@components/upload/upload-image.vue";
import { PreviewPics } from '@components/index';
import { AppModule } from "@store/modules/app";
import {
  getStoryTagList,
  delTagList,
  updateTagStatus,
  saveTagList
} from "@service/topic";
@Component({
  components: {
    baseTable,
    footerButtons,
    dropCode,
    uploadImg,
    PreviewPics
  }
})
export default class tagList extends Vue {
    // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 排序
  private sort: boolean = false;
  private checkedBox: any;
  private loading: boolean = false;
  private footerList: Array<Object> = [];
  private orderRowData: object = {};
  private params: any = {
    status: "",
    storyNum: 0,
    createEndDate: "",
    tagName: "",
    createStartDate: ""
  };
  private tagName: String = "";
  private tagImage: String = "";
  private tagId: String = "";
  private tagIndex: number = -1;
  private showTag: Boolean = false;
  //自定义modal弹窗
  private renderModal(item: any, index: number) {
    if (item !== -1) {
      this.tagName = item.name;
      this.tagId = item.id;
      this.tagIndex = index;
    }
    this.tagImage = item.cover;
    this.showTag = true;
  }
  //标签图片
  private getImage(e: any) {
    this.tagImage = e[0];
  }
  // 排序
  /* S 排序 */
  private changeOrder(b: boolean) {
    this.sort = b;
  }
  // 修改排序行的数据
  private changeSort(row: any) {
    this.orderRowData = row;
  }
  modalData = {
    tagName: ""
  };
  //表单验证
  private ruleValidate: any = {
    // labelName: [{ required: true, message: "标签名称不能为空",trigger: 'blur'}],
    // labelImg: [{ required: true, message: "请选择标签图片"}],
  };

  private closeTag(type: String) {
    if (type !== "close") {
      if (!this.tagName) {
        this.$Message.error("标签名称不能为空");
        return;
      }
      if (!this.tagImage) {
        this.$Message.error("标签图片不能为空");
        return;
      }
      this.showTag = false;
      saveTagList({
        id: this.tagId,
        name: this.tagName,
        cover:this.tagImage
      }).then(data => {
        if (data.code === 0) {
          if (!this.tagId) {
            this.$Message.success("保存成功");
            this.tableConfig.page.currPage = 1;
            this.getList();
          } else {
            this.$Message.success("修改成功");
            this.tableData.bodyList[this.tagIndex].name = this.tagName;
            this.getList();
          }
          this.tagName = "";
          this.tagId = "";
          this.tagIndex = -1;
          this.tagImage = "";
        }
      });
    } else {
      this.tagImage = "";
      this.tagName = "";
      this.tagId = "";
      this.tagIndex = -1;
      this.showTag = false;
    }
  }
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: "right"
  };
  mounted() {
    this.getList();
  }
  // 复选框
  private setChecked(e: any) {
    this.checkedBox = [];
    this.footerList = e;
    e.map((item: any) => {
      this.checkedBox.push(item.id as Number);
    });
  }
  //   搜索
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  // 列表
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.params, page);
    getStoryTagList(this.params).then(data => {
      this.tableConfig.page = data.page ? data.page : {};
      this.tableData.bodyList = data.datas as [];
      this.loading = false;
      this.checkedBox = [];
    });
  }
  private tableData: any = {
    headList: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "标签名称",
        key: "name",
        width: 260,
        slot: "name",
        align: "center"
      },
      {
        title: "创建人",
        key: "createUser",
        slot: "createUser",
        align: "center"
      },
      {
        title: "故事数",
        key: "storyNum",
        align: "center"
      },
      {
        title: "创建时间",
        key: "createDate",
        align: "center"
      },
      {
        title: "排序",
        key: "sort",
        align: "center",
        slot: "sort"
      },
      {
        title: "状态",
        key: "status",
        slot: "status",
        width: 120,
        align: "center"
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
  // 时间
  private setTime(e: any) {
    this.params.createStartDate = e[0];
    this.params.createEndDate = e[1];
  }
  //切换switch按钮
  changeStatus(item: any, index: Number) {
    // @ts-ignore
    // if (!this.operates.includes("status")) {
    //   return;
    // }
    let content =
      item.status === 2
        ? `确认是否启用“${item.name}”标签？`
        : `禁用标签后，该标签将不在用户端进行展示！`;
    let config: any = {
      title: item.status === 2 ? "启用标签" : "禁用标签",
      content: content,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        this.setTagStatue(item, index);
      }
    };
    this.$Modal.confirm(config);
  }
  private setTagStatue(item: any, index: Number) {
    updateTagStatus({
      id: item.id,
      status: item.status === 1 ? 2 : 1
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("修改成功");
        item.status = item.status === 1 ? 2 : 1;
      }
    });
  }
  //删除标签
  removeTag(item: any, index: Number) {
    let config: any = {
      title: "删除标签",
      content: "删除此标签后，归属此标签下的故事依然会在用户端进行展示。",
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        this.delTagStatue(item, index);
      }
    };
    this.$Modal.confirm(config);
  }
  private delTagStatue(item: any, index: Number) {
    delTagList({
      ids: index !== -1 ? item.id : this.checkedBox.toString()
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("删除成功");
        if (index !== -1) {
          this.tableData.bodyList.splice(index, 1);
        } else {
          this.tableConfig.page.currPage = 1;
          this.getList();
        }
      }
    });
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
}
</script>

<style scoped lang="scss">
.switch {
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  position: relative;
  width: 44px;
  height: 22px;
  .cover {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
  }
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
.wrap {
  padding: 15px 15px 0 15px;
  background-color: $grayLight;
  .submit {
    display: inline-block;
    margin: 0 0 15px 10px;
  }
  .ivu-form-item {
    margin-bottom: 15px !important;
  }
}
.table {
  margin-top: 15px;
  .action-btn {
    cursor: pointer;
    & + .action-btn {
      margin-left: 5px;
    }
  }
  .topic-msg {
    display: flex;
    padding: 8px 0;
    .img {
      width: 70px;
      height: 50px;
      margin-right: 10px;
      overflow: hidden;
    }
    .msg-panel {
      flex:1;
      overflow: hidden;
      text-align: left;
    }
    .topic-name {
      margin-top: 7px;
      text-align: left;
    }
    .topicTag {
      display: inline-block;
    }
    .date {
      margin-top: 7px;
      white-space: normal;
    }
  }
}
.img-format {
  color: #ccc;
}
</style>
