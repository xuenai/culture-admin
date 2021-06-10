<!--
 * @Author: sunxiaoqian
 * @since: 2019-05-29 20:19:06
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-31 10:35:58
 -->
<template>
  <div class="content">
    <Form class="form" ref="formInline" inline :label-width="70">
          <FormItem label="手机号">
              <Input
                      type="text"
                      placeholder="请输入手机号"
                      v-model="params.phone"
                      @on-enter="getList"
                      style="width: 250px"
              />
          </FormItem>
          <FormItem label="任务类型" class="select">
              <Select style="width: 250px" v-model="params.taskTypeCode" @on-change="getList">
                  <Option value="">请选择</Option>
                  <Option v-for="item in taskTypeList" :value="item.taskTypeCode" :key="item.taskTypeCode">{{item.name}}</Option>
              </Select>
          </FormItem>
          <FormItem label="日期">
              <DatePicker
                      type="daterange"
                      separator=" 至 "
                      @on-change="time => {params.startDate=time[0];params.endDate=time[1];getList()}"
                      placeholder="选择日期筛选"
                      placement="bottom-end"
                      style="width: 250px"
              ></DatePicker>
              <Button style="margin-left: 20px;" type="primary" @click="getList">搜索</Button>
          </FormItem>
      </Form>
    <baseTable :configure="tableConfig" @getList="getTaskRecord">
      <Table
          border
          :columns="data.header"
          :data="data.list"
          :configure="tableConfig"
          :loading="loading"
          class="table-list"
      >
          <template slot-scope="{ row }" slot="userInfo">
              <div class="info-list clearfix">
                  <div class="img-box fl" :class="{volunteer: row.volunteerStatus === 1}" :style="{backgroundImage: `url(${row.head})`}" v-if="row.head"></div>
                  <div class="img-box fl" :class="{volunteer: row.volunteerStatus === 1, 'daq-no-photo': !row.head}" v-else></div>
                  <div class="introduce-content fl">
                      <p class="nick">{{row.nickName || '游客'}}</p>
                      <p class="tel">{{row.phone}}</p>
                  </div>
              </div>
          </template>
          <template slot-scope="{ row }" slot="taskObj">
              <Dropdown v-if="row.finishTaskObjectList.length > 1">
                  <a href="javascript:void(0)">
                      查看多个任务对象
                      <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                      <DropdownItem v-for="(item, i) in row.finishTaskObjectList" :key="i">
                          <a href="javascript:void(0)"  @click="pageTurn(item)">{{item.majorName}}</a>
                      </DropdownItem>
                  </DropdownMenu>
              </Dropdown>
              <a v-else-if="row.finishTaskObjectList.length === 1" href="javascript:void(0)" @click="pageTurn(row.finishTaskObjectList[0])">{{row.finishTaskObjectList[0].majorName}}</a>
          </template>
      </Table>
    </baseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import {getTaskTypeList} from "@service/common";
import {getTaskRecord} from '@service/member'

@Component({
  components: {
    BaseTable,
  }
})
export default class ComponentName extends Vue {
  private soureType = <any>{
      CONTENT: '/con-detail',
      CONTENT_TYPE_TOILET: '/toilet-detail',
      CONTENT_TYPE_PARKING: '/parking-detail',
      CONTENT_TYPE_RESTAURANT: '/food-detail',
      CONTENT_TYPE_VENUE: '/venues-detail',
      CONTENT_TYPE_ACTIVITY_SHIU: '/audit-room-detail',
      CONTENT_TYPE_SCENERY: '/scenic-detail',
      CONTENT_TYPE_SCENIC_SPOTS: '/attractions-detail',
      CONTENT_TYPE_HOTEL: '/hotel-detail',
      CONTENT_TYPE_HOTEL_ROOM: '/guestroom-detail',
      CONTENT_TYPE_TOPIC: '/topic-detail',
      CONTENT_TYPE_STORY: '/story-detail',
      CONTENT_TYPE_ACTIVITY: '/ac-detail',
      CONTENT_TYPE_VOLUNTEER_TEAM: '/volunteers-detail-team',
      CONTENT_TYPE_ASSOCIATION: '/community-detail',
      CONTENT_TYPE_VOLUNTEER: '/volunteers-management-desc',
  }
  // 点击跳转
  private pageTurn (item: any) {
      let url = this.soureType[item.majorType]
      if (url) {
            if (item.majorType === 'CONTENT_TYPE_VOLUNTEER_TEAM') {
                this.$router.push({
                    path: url + '/' + item.majorValue
                })
            } else if (item.majorType === 'CONTENT_TYPE_VOLUNTEER') {
                this.$router.push({
                    path: url + '/' + item.majorValue + '/false'
                })
            } else {
                this.$router.push({
                    path: url,
                    query: {id: item.majorValue}
                })
            }
      }
  }
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: "right"
  };
  private loading = true;
  private data = <any>{
    header: [
      {
        title: "用户信息",
        slot: "userInfo"
      },
      {
        title: "任务类型",
        align: "center",
        key: "taskType",
      },
      {
        title: "任务描述",
        key: "taskSummary",
        align: "center"
      },
      {
        title: "任务奖励",
        key: "integral",
        align: "center"
      },
      {
        title: "完成时间",
        key: "finishTime",
        align: "center"
      },
      {
        title: "任务对象",
        slot: "taskObj",
        align: "center"
      }
    ],
    list: []
  };
  mounted() {
    this.getTaskRecord();
    this.getTaskTypeList();
  }
    // 请求参数
    private params = <any>{
        taskTypeCode: '',
        startDate: '',
        endDate: '',
        phone: '',
    }
    private getList () {
        this.tableConfig.page.currPage = 1;
        this.getTaskRecord();
    }
    // 获取list数据
    private getTaskRecord (page:any = this.tableConfig.page) {
        Object.assign(this.params, page)
        this.loading = true
        getTaskRecord(this.params).then((res:any) => {
            if (res.code === 0) {
                this.tableConfig.page = res.page;
                this.data.list = res.datas
            }
        }).finally(() => {
            this.loading = false
        })
    }
    // 获取任务类型名称列表
    private taskTypeList: Array<any> = [];
    private getTaskTypeList () {
        getTaskTypeList({publishChannel: 'CULTURAL'}).then((res:any) => {
            if (res.code === 0) {
                this.taskTypeList = res.datas
            }
        })
    }
}
</script>

<style lang='scss' scoped>
.content {
  padding: 15px 15px 50px;
  height: auto !important;
  .form {
    width: 100%;
    padding-top: 15px;
    background: $grayLight;
    margin-bottom: 15px;
  }
}
.table-list {
    overflow: visible;
}
.info-list {
    padding: 10px 0;
    display: flex;
    align-items: center;
    .img-box {
        position: relative;
        width: 60px;
        height: 60px;
        background: url("../../../assets/image/site-default.png") no-repeat center/cover;
        border-radius: 50%;
        &.volunteer:after {
            content: '';
            position: absolute;
            right: -10px;
            width: 30px;
            height: 30px;
            background: url("../../../assets/image/volunteer-log.png") no-repeat center/contain;
        }
    }
    .introduce-content {
        margin-left: 20px;
        width: calc(100% - 100px);
    }
}
</style>
