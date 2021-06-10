<!--
 * @Author: 任智勇
 * @since: 2019-06-03 17:57:38
 * @LastAuthor: 陈艳玲
 * @lastTime: 2019-11-25 20:19:18
 -->
<template>
  <div class="content-box">
    <div class="content">
      <Form :label-width="80" inline class="top">
        <FormItem class="item" label="栏目名称：">
          <i-input placeholder="请输入栏目名称" v-model="params.name"></i-input>
        </FormItem>
        <FormItem class="item" label="栏目代码：">
          <i-input placeholder="请输入栏目代码" v-model="params.channelCode"></i-input>
        </FormItem>
        <Button type="primary" @click="search">搜索</Button>
        <div class="btn-box">
          <router-link tag="a" to="/con-column-add" v-if="operates.includes('save')">
            <Button type="primary">添加</Button>
          </router-link>
          <a href="javascript:void(0);" style="position:relative;display:inline-block;cursor:pointer;">
            <Button v-if="operates.includes('import')">
              <i class="iconfont c-icon-daoru1"></i>导入
            </Button>
            <input class="upload-excel" type="file" @change="acceptExcel($event)" />
          </a>
          <Button v-if="operates.includes('export')" @click="outExcel">
            <i class="iconfont c-icon-daochu1"></i><span>导出</span>
          </Button>
        </div>
      </Form>
      <Table border :columns="columns" :data="columnList" class="channel-table">
        <template slot-scope="{row}" slot="name">
          <span :style="row.channelLevel ? 'padding-left:' + (row.channelLevel * 20) + 'px' : ''">
            <Icon type="md-arrow-dropdown" class="icon" v-if="row.subset.length"/>
            <!-- <Icon
              type="md-arrow-dropdown"
              class="icon01"
              v-if="row.channelLevel && !row.subset.length"
            /> -->
            {{row.name}}
          </span>
        </template>
        <template slot-scope="{ row}" slot="parentName">{{row.parentName ? row.parentName : '-'}}</template>
        <template slot-scope="{ row}" slot="showChannel">
          <div>
            <span>{{row.showChannel ? '展示' : '不展示'}}</span>
            <span class="switch">
              <i-switch :value="row.showChannel"/>
              <i class="cover" @click="changeShowChannel(row)"></i>
            </span>
          </div>
        </template>
        <template slot-scope="{row}" slot="sort">
                        <span v-if="!order">{{row.sort}}</span>
                        <Input v-else @on-change="changeSort(row)" v-model="row.sort"/>
                    </template>
          <template slot-scope="{ row}" slot="status">
              <div>
                  <span>{{row.status === 1 ? '正常' : '禁用'}}</span>
                  <span class="switch" v-if="row.status === 1">
              <i-switch :value="true"/>
              <i class="cover" @click="changeState(row)"></i>
            </span>
                  <span class="switch" v-if="row.status === 2">
              <i-switch :value="false"/>
              <i class="cover" @click="changeState(row)"></i>
            </span>
              </div>
          </template>
        <template slot-scope="{ row}" slot="operation">
          <router-link
            tag="a"
            :to="{path: '/con-column-add', query: {id: row.id}}"
            href="javascript:;"
            class="redit"
            v-if="operates.includes('edit')"
          >编辑</router-link>
          <a
            href="javascript:;"
            class="redit"
            @click="delChannel(row)"
            v-if="operates.includes('delete')"
          >删除</a>
        </template>
      </Table>
    </div>
     <div class="operate text-center mt15">
            <Button class="ml10" :disabled="order" type="primary" v-if="!order &&columnList.length" @click="setSort" >排序</Button>
            <Button class="ml10" type="primary" v-if="order " @click="saveSort">保存排序</Button>
        </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getColumnList, delColumn, updateStatusColumn,postChannelExcel } from "@service/content";
import { channelSetSort } from "@service/content";
import { AppModule } from "@store/modules/app";
import CONFIG from '@/util/config'
import {importExcelComplete} from '@util/comm'
import {exportExcel} from '@util/util'
import {shutOrShow} from '@service/content'

@Component({
  components: { baseTable }
})
export default class ColumnManagement extends Vue {
    // outExcelApi
    private outExcelApi: string = CONFIG.defaultUrl + '/res/site/channel/exportExcel?token=' + this.$cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`)

  private params: Object = {
    name: "",
    channelCode: ""
  };
  private columns: Array<Object> = [
    {
      title: "栏目名称",
      slot: "name",
      align: "left"
    },
    {
      title: "栏目代码",
      key: "channelCode",
      align: "center"
    },
    {
      title: "父级栏目",
      slot: "parentName",
      align: "center"
    },
    {
      title: "公共展示",
      slot: "showChannel",
      align: "center"
    },
    {
      title: "排序",
      slot: "sort",
      align: "center"
    },
    {
      title: "状态",
      slot: "status",
      align: "center"
    },
    {
      title: "操作",
      slot: "operation",
      align: "center"
    }
  ];
  mounted() {
    this.getColumnList();
  }
  private search() {
    this.columnList = [];
    this.getColumnList();
  }
  // 权限列表
  get operates() {
    return AppModule.operates;
  }

    /* S 导入 */
    private acceptExcel (e:any) {
        let files = e.target.files;
        let formData = new FormData();
        let _this = this;
        formData.append("file", files[0]);
        formData.append('token', this.$store.state.app.token)
        postChannelExcel(formData).then((blob:any) => {
            // importExcelComplete(blob, function () {
            //   _this.$Message.success('导入成功');
            //   _this.columnList = [];
            //   _this.getColumnList();
            // })
            importExcelComplete(blob).then(res => {
                this.$Message.success('导入成功');
            }).finally(() => {
                _this.columnList = [];
                _this.getColumnList();
            })
        })
    }
    /* E 导入 */

  // 删除
  private delChannel(item: any) {
    let content = `确认是否删除“${item.name}”栏目？`;
    let _this = this;
    let config: any = {
      title: "删除栏目",
      content: content,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        let params = {
          id: item.id
        };
        delColumn(params).then(data => {
          if (data.code === 0) {
            this.$Message.success("删除栏目成功！");
            this.getColumnList()
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  // 改变状态
  private changeState(item: any) {
    // @ts-ignore
    if (!this.operates.includes("status")) {
      return;
    }
    let content =
      item.status === 2
        ? `确认是否启用“${item.name}”栏目？`
        : `确认要禁用“${
            item.name
          }”栏目？禁用后用户端将不显示该栏目及栏目对应的内容！`;
    let config: any = {
      title: item.status === 2 ? "启用栏目" : "禁用栏目",
      content: content,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        let params = {
          id: item.id,
          status: item.status === 2 ? 1 : 2
        };
        updateStatusColumn(params).then(data => {
          if (data.code === 0) {
            this.$Message.success("修改成功！");
            this.getColumnList()
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }
  // 栏目
  private columnList: Array<Object> = [];
  // 栏目列表
  private getColumnList() {
    getColumnList(this.params).then(data => {
      let datas: any = [];
      this.filterArr(data.datas);
    });
  }
  private filterArr(arr: any) {
    let _this = this;
    _this.columnList = []
    arr.filter((item: any) => {
      _this.columnList.push(item);
      item.channelLevel = 0;
      return _this.filterObj(item);
    });
  }
  private filterObj(item: any) {
    let _this = this;
    if (item.hasOwnProperty("subset")) {
      item.hasOwn = true;
      item.subset.filter(function(child: any) {
        child.channelLevel = item.channelLevel + 1;
        _this.columnList.push(child);
        if (child.hasOwnProperty("subset")) {
          return _this.filterObj(child);
        }
      });
    }
  }
  private outExcel () {
    exportExcel(this.outExcelApi)
    // let a = document.createElement('a')
    // let div = document.createElement('div');
    // a.appendChild(div);
    // a.style.display = 'none';
    // (window.document as any).querySelector('body').appendChild(a);
    // a.href = this.outExcelApi
    // div.click()
    // document.removeChild(a);
  }

  private changeShowChannel(row:any) {
      // @ts-ignore
//      if (!this.operates.includes("status")) {
//          return;
//      }
      let content =
              row.showChannel
              ? `确认是否关闭展示“${row.name}”栏目？关闭后用户端将不显示该栏目及栏目对应的内容！`
              : `确认是否开启展示“${row.name}”栏目？`;
      let config: any = {
          title: row.showChannel ? "关闭展示" : "开启展示",
          content: content,
          okText: "确认",
          cancelText: "关闭",
          onOk: () => {
              shutOrShow({isShow: !row.showChannel, id: row.id}).then((res:any) => {
                  if (res.code === 0) {
                      this.$Message.success("修改成功！");
                      this.getColumnList()
                  }
              })
          }
      };
      this.$Modal.confirm(config);
  }
   /*S 底部操作按钮*/
        private order: boolean = false; // 是否开启排序功能
       private sortParams: any = {}; // 修改排序后的数据
        private setSort() {
            let _this=this;
            _this.order=!_this.order;
        }
        private saveSort(){
            let _this=this;
            if(JSON.stringify(this.sortParams) != '{}'){
                channelSetSort({
                    params: JSON.stringify(_this.sortParams)
                }).then((res: any) => {
                    if (res.code === 0) {
                        _this.$Message.success("操作成功");
                        // this.getList();
                    }
                });
                // 发送请求后将当前 对象清空
                _this.sortParams = {};
            }
            _this.order=false;
        }

        // 修改排序行的数据
        private orderRowData: object = {}

        private changeSort(row: any) {
           this.sortParams[row.id] = row.sort;
        }

        /*E 底部操作按钮*/
}
</script>

<style lang='scss' scoped>
    .upload-excel {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 0;
        z-index:1;
    }
.channel-table {
  margin-top: 15px;
}
.icon {
  font-size: 20px;
  text-align: left;
  width: 20px;
  color: #8ba0b3;
}
.icon01 {
  width: 10px;
  font-size: 0;
}
.redit {
  margin: 0 5px;
  font-size: 12px;
  color: $theme;
  &:hover {
    color: $theme-hover;
  }
}
.cloud-icon {
  padding-right: 10px;
}
.top {
  padding: 20px;
  background: #f8fafe;
}
.content-box {
  background: $grayDark;
  .content {
    padding: 15px;
    background: #fff;
    .item {
      margin-bottom: 0;
    }
  }
}
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
.btn-box {
  margin-top: 20px;
  button {
    margin-right: 10px;
  }
  .cloud-icon {
    font-size: 12px;
  }
    .iconfont {
        font-size: 12px;
        margin-right: 5px;
        color: #515a6e;
    }
}
</style>
