<!--
 * @Author: 任智勇
 * @since: 2019-05-29 14:40:36
 * @LastAuthor   : 任智勇
 * @lastTime     : 2020-01-16 11:11:44
 -->
<template>
  <div class="container">
    <Row>
      <Col span="18 pd20 left">
        <div class="count-panel">
          <p class="cloud-icon">&#xe70d;</p>
          <p class="txt">待处理</p>
          <p class="count">{{ waitData.length }}</p>
        </div>
        <div id="alarmMap" class="alarmMap"></div>
      </Col>
      <Col span="6 right">
        <div class="ml10 right-content">
          <p class="tips-title border">求助实况</p>
          <div class="no-data" v-if="!waitData.length">暂无数据</div>
          <div class="list" v-if="waitData && waitData.length">
            <div
              class="item"
              :class="{ active: activeIndex === index }"
              v-for="(item, index) in waitData"
              :key="item.id"
              @click.stop="choiceMarker(item, index)"
            >
              <span class="num">{{ item.emergencyNumber }}.</span>
              <div class="item-content">
                <div class="content-left">
                  <div class="region-name" v-if="item.address">{{ item.address }}</div>
                  <div class="content">
                    <p class="txt" :class="{mt10:item.address}">{{ item.content }}</p>
                    <ul class="imgs mt10">
                      <li
                        class="img-item daq-no-photo"
                        v-for="(imgItem, picIndex) in item.image.split(',')"
                        v-if="imgItem"
                        :key="imgItem"
                        @click="viewImage(item.image.split(','), picIndex)"
                      >
                        <img class="cloud-img" :src="`${imgReqUrl}${imgItem}&width=80&height=80`" alt />
                      </li>
                      <li
                        class="img-item daq-no-photo view-images-box"
                        v-if="item.coverImage"
                        @click="openVideo(item,index)"
                        v-for="(videoItem,index) in item.coverImage.split(',')"
                      >
                        <img class="cloud-img" :src="`${videoItem}&width=80&height=80`" alt />
                        <span class="cover"></span>
                      </li>
                    </ul>
                  </div>
                  <div class="info">
                    <span class="date">{{ item.createTime }}</span>
                    <span class="patient">
                      求助者：{{ item.nickName }}
                      <em v-if="item.name">（{{ item.name }}）</em>
                    </span>
                  </div>
                </div>
                <Button type="primary" class="btn" @click="seeModal(item)"
                  >处理</Button
                >
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <div class="table-wrap pd20">
      <p class="tips-title">处理记录</p>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          class="table"
          :loading="loading"
          @on-selection-change="setChecked"
        >
          <template slot-scope="{ row }" slot="content">
            <div class="alarm-content" :title="row.content">{{ row.content }}</div>
            <span class="cloud-icon content-icon" v-if="row.image" @click="viewImage(row.image.split(','), 0)"
              >&#xe6f8;</span
            >
            <span class="cloud-icon content-icon ml5" v-if="row.video" v-for="(item,index) in row.video.split(',')"  @click="openVideo(row,index)"
              >&#xe6fa;</span
            >
          </template>
          <template slot-scope="{ row }" slot="handleStatus">
            <p v-if="row.handleStatus === 0">待处理</p>
            <p v-if="row.handleStatus === 1">忽略</p>
            <p v-if="row.handleStatus === 2">已处理</p>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a class="theme-blue action-btn" @click="deleteRow(row, index)"
              >删除</a
            >
          </template>
        </Table>
      </baseTable>
      <div class="text-center">
        <Button type="primary" @click="deleteRow(checkedIds, -1)"
          >批量删除</Button
        >
      </div>
    </div>
    <!-- 图片查看 -->
    <PreviewPics
      v-model="visible"
      :imgs="imgUrl"
      :currIndex="picIndex"
    ></PreviewPics>
    <!-- 视频播放 -->
    <VideoPlayer
      :showVideo="showVideo"
      :show="show"
      v-if="showVideo.url"
    ></VideoPlayer>
    <!-- 求助处理 -->
    <Modal
      class="modal-content"
      v-model="modal"
      :width="800"
      footer-hide
      title-hide
    >
      <div class="title">
        <span class="address"
          >{{ modalData.emergencyNumber }}.{{ modalData.address }}</span
        >
        <span>
          {{ modalData.createTime }} 求助者：{{ modalData.nickName }}
          <em v-if="modalData.name">（{{ modalData.name }}）</em>
        </span>
      </div>
      <div class="content mt10">
        <p class="txt">{{ modalData.content }}</p>
        <ul class="imgs mt10" v-if="modalData.image || modalData.video">
          <li
            class="img-item daq-no-photo"
            v-for="(imgItem, picIndex) in modalData.image.split(',')"
            v-if="imgItem"
            :key="imgItem"
            @click="viewImage(modalData.image.split(','), picIndex)"
          >
            <img class="cloud-img" :src="`${imgReqUrl}${imgItem}&width=80&height=80`" alt />
          </li>
          <li
            class="img-item daq-no-photo view-images-box"
            v-if="modalData.video"
            @click="openVideo(modalData,index)"
            v-for="(videoItem,index) in modalData.coverImage.split(',')"
          >
            <img class="cloud-img" :src="`${videoItem}&width=80&height=80`" alt />
            <span class="cover"></span>
          </li>
        </ul>
      </div>
      <div class="text mt10">
        <Input type="textarea" :rows="4" :maxlength="1000" v-model="handleContent" />
      </div>
      <div class="text-center footer mt20">
        <Button class="btn ml20" type="primary" @click="handleSubmit(2)"
          >已处理</Button
        >
        <Button class="btn ml20" type="primary" @click="handleSubmit(1)"
          >忽略</Button
        >
        <Button class="btn ml20" type="primary" @click="cancelSeeModal"
          >返回</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import baseTable from '@components/baseTable/baseTable.vue'
import { AppModule } from '@store/modules/app'
import VideoPlayer from '@components/video-play/video-play.vue'
import { PreviewPics } from '@components/index'
// import markerIcon from "@assets/image/marker.png";
import {
  waitProcess,
  processList,
  deleteEmergency,
  handleEmergency
} from '@service/alarm'
import CONFIG from '@util/config'
interface videoType {
  url: String
  image: String
  title: String
}

@Component({ components: { baseTable, PreviewPics, VideoPlayer } })
export default class alarm extends Vue {
  //图片截取
  imgReqUrl:any= CONFIG.defaultUrl + "/config/ued/image?imageUrl=";
  //视频封面图截取
  videoReqUrl:any=CONFIG.defaultUrl + "/config/ued/interceptionVideoImage?videoUrl=";
  //处理请求
  private modal = false
  private modalData: Object = {}
  private handleContent: string = ''
  seeModal(data: any) {
    this.modal = true
    this.modalData = data
  }
  cancelSeeModal() {
    this.modal = false;
    this.handleContent="";
  }
  handleSubmit(handleStatus: any) {
    handleEmergency({
      id: (this.modalData as any).id,
      handleStatus: handleStatus,
      content: this.handleContent
    }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success(handleStatus === 2 ? '处理成功' : '已忽略')
        this.modal = false
        this.getData();
        this.getList();
        this.handleContent="";
      }
    })
  }
  /* S 视频播放 */
  private show: Boolean = false
  private showVideo: videoType = {
    url: '',
    image: '',
    title: ''
  }
  private openVideo(item:any,index:any) {
    this.showVideo.url = item.video.split(",")[index]
    this.showVideo.image = item.coverImage.split(",")[index]
    this.showVideo.title = '视频'
    this.show = true
  }
  /* E 视频播放 */
  /* S 查看大图 */
  private imgUrl: Array<string> = []
  private visible: Boolean = false // 图片查看
  private picIndex = 0
  private viewImage(url: Array<string>, index: number) {
    this.imgUrl = url
    this.visible = true
    this.picIndex = index
  }
  /* E 查看大图 */
  private lnglat: any = {
    lng: 116.205467,
    lat: 39.907761
  }
  private marker: any = {}
  map: any = {}
  // 初始化地图
  initMap() {
    let _this = this

    this.map = new AMap.Map('alarmMap', {
      resizeEnable: true,
      zoom: 13
    })
    this.map.clearMap() // 清除地图覆盖物
    this.markers = []
  }
  private markers: Array<any> = []
  private addMarker() {
    let _this = this
    this.map.setCenter([this.waitData[0].longitude, this.waitData[0].latitude])
    this.waitData.forEach(function(item, index) {
      if (item.longitude && item.latitude) {
        let icon =
          index == 0
            ? require('@assets/image/marker-active.png')
            : require('@assets/image/marker.png')
        let _offset = index == 0 ? [-40, -66] : [-25, -34]
        _this.markers.push(
          new AMap.Marker({
            map: _this.map,
            icon: icon, //小图标
            position: [item.longitude, item.latitude],
            offset: new AMap.Pixel(_offset[0], _offset[1])
          }).on('click', _this.markerHandler)
        )
      }
    })
  }
  // 点标记点击
  private markerHandler(e: any) {
    this.markerIconClear()
    e.target.setIcon(require('@assets/image/marker-active.png')) //大图标
    e.target.setOffset(new AMap.Pixel(-40, -66))
    this.map.panTo([e.lnglat.lng, e.lnglat.lat])
  }
  // 点击列表查看marker
  private activeIndex = -1
  private choiceMarker(item: any, index: any) {
    this.activeIndex = index
    this.markerIconClear()
    this.markers[index].setIcon(require('@assets/image/marker-active.png')) //大图标
    this.markers[index].setOffset(new AMap.Pixel(-40, -66)) //大图标
    this.map.panTo([item.longitude, item.latitude])
  }
  //还原小图标
  markerIconClear() {
    this.markers.map((markerItem: any, markerIndex: any) => {
      markerItem.setIcon(require('@assets/image/marker.png'))
      markerItem.setOffset(new AMap.Pixel(-25, -34)) //小图标
    })
  }
  /*S 表格 */
  //表格加载动画
  private loading: boolean = true
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: 'right'
  }

  //表格数据
  private tableData: any = {
    headList: [],
    bodyList: []
  }
  private params: object = {}
  getList(data: any = this.tableConfig.page) {
    let _this = this
    _this.tableData.headList = [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '编号',
        key: 'emergencyNumber',
        align: 'center'
      },
      {
        title: '地址',
        key: 'address',
        align: 'center'
      },
      {
        title: '求助者',
        key: 'name',
        align: 'center'
      },
      {
        title: '求助内容',
        key: 'content',
        slot: 'content',
        align: 'center'
      },
      {
        title: '求助时间',
        key: 'createTime',
        align: 'center'
      },
      {
        title: '处理人',
        key: 'handleName',
        align: 'center'
      },
      {
        title: '状态',
        key: 'handleStatus',
        slot: 'handleStatus',
        align: 'center'
      },
      {
        title: '处理时间',
        key: 'handleTime',
        align: 'center'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        slot: 'action'
      }
    ]

    this.params = Object.assign(this.params, data) //搜索条件
    processList(this.params).then((res: any) => {
      if (res.code === 0) {
        _this.tableData.bodyList = res.datas as []
        _this.loading = false
        _this.checkedIds = ''
        _this.tableConfig.page = res.page ? res.page : {}
      }
    })
  }
  // 复选框ID
  private checkedIds: string = ''

  // 复选框
  private setChecked(e: any) {
    let checkedIds: any = []
    e.map((item: any) => {
      checkedIds.push(item.id as Number)
    })
    this.checkedIds = checkedIds.join(',')
  }
  /*E 表格 */
  //删除行
  deleteRow(item: any, index: any) {
    let _this: any = this,
      checkedLen = _this.checkedIds ? _this.checkedIds.split(',').length : 0
    if (index === -1 && !checkedLen) {
      _this.$Message.error('请选择你要删除的记录')
      return
    }
    let config: any = {
      title: '操作提示',
      content: `确认要删除“编号${item.emergencyNumber ||
        '选中的' + checkedLen + '条'}”数据吗？`,
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        deleteEmergency({
          ids: index == -1 ? _this.checkedIds : item.id
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success('删除成功')
            _this.getList()
          }
        })
      }
    }
    this.$Modal.confirm(config)
  }
  // 处理信息
  // handleEmergency(row: any) {
  //   handleEmergency({
  //     id: row.id,
  //     handleStatus: row.handleStatus
  //   }).then((res: any) => {
  //     if (res.code === 0) {
  //       this.$Message.success('处理成功')
  //       this.getList();
  //     }
  //   })
  // }
  /*S 待处理信息 */
  private waitData: Array<any> = []
  getData() {
    return new Promise((resolve, reject) => {
      waitProcess().then((res: any) => {
        if (res.code === 0) {
          this.waitData = res.datas
        }
        resolve(res.datas)
      })
    })
  }
  /**
   * @description: 初始化Websocket连接
   * @param {string} name 对应存存储websocket对象的变量名字
   * @param {string} url 长连接地址
   * @param {function} callback 长连接返回消息时的回调
   * @return: void
   */
  private initWebsocket(
    name: string,
    url: string,
    callback: (res: any) => void
  ) {
    try {
      this[name] = new WebSocket(
        `ws://${url}?token=${this.$store.state.app.token}`
      )
    } catch (error) {
      console.log(error)
      return
    }
    this[name].onmessage = function(res: any) {
      callback && callback(JSON.parse(res.data))
    }
    // 对长连接 进行守护 如果超过2分钟未接收消息 则重新连接长链
    // let _this = this;
    // clearInterval(_this[`${name}IntervalTime`]);
    // _this[`${name}IntervalTime`] = setInterval(() => {
    //   let time = _this[`${name}ResponseTime`];
    //   if (time && new Date().getTime() - time > 2 * 60 * 1000) {
    //     _this.initWebsocket(name, url, callback);
    //   }
    // }, 10 * 1000);
  }

  // 创建链接
  createWebsocket() {
    this.initWebsocket('WebSocket', CONFIG.websocketUrl, (data: any) => {
      /* S websocket全局消息通知 */
      if (data.socketType == 'SOCKET_TYPE_EMERGENCY') {
        ;(this.waitData as any).unshift(data.data)
      }
    })
  }
  /*E 待处理信息 */
  mounted() {
    this.initMap()
    this.getData().then(res => {
      this.addMarker()
    })
    this.getList()
    this.createWebsocket()
  }
}
</script>
<style lang="scss" scoped>
.container {
  background-color: #f0f3fa;
}

.left {
  position: relative;
  height: 640px;
  background-color: #fff;
  .count-panel {
    position: absolute;
    z-index: 9;
    top: 40px;
    right: 40px;
    width: 103px;
    height: 138px;
    border-radius: 3px;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    .cloud-icon {
      width: 65px;
      height: 35px;
      margin: 20px 0 0 20px;
      font-size: 28px;
      background-color: #fff;
      color: #98947f;
      border-radius: 3px;
    }
    .txt {
      margin-top: 10px;
      font-size: 16px;
    }
    .count {
      font-size: 26px;
      font-weight: 600;
    }
  }
}
.right {
  padding-left: 10px;
  &-content {
    height: 640px;
    padding: 20px 20px 10px 20px;
    background-color: #fff;
  }
}
.tips-title {
  position: relative;
  padding: 0 0 10px 10px;
  color: $font01;
  font-weight: 600;
  font-size: 16px;
  &:after {
    position: absolute;
    left: 0;
    top: 4px;
    content: '';
    width: 3px;
    height: 16px;
    border-radius: 1.5px;
    background-color: $theme;
  }
}
.alarmMap {
  width: 100%;
  height: 600px;
  position: relative;
  touch-action: none;
}
.list {
  height: 95%;
  overflow-y: auto;
  border-top: 1px solid $borderLight;
}
.no-data {
  text-align: center;
  align-items: center;
  justify-content: center;
  color: #999;
}
.item {
  display: flex;
  padding: 20px 10px 0 0;
  cursor: pointer;
  .num {
    margin-right: 5px;
    font-size: 12px;
    color: $font01;
    line-height: 22px;
  }
  &-content {
    position: relative;
    flex: 1;
    padding-bottom: 10px;
    border-bottom: 1px solid $borderLight;
    .content-left{
      width:88%;
    }
    .btn {
      position: absolute;
      top: 0;
      right: 0;
    }
    .region-name {
      font-size: 14px;
      color: $font01;
      font-weight: 600;
    }
    .content {
      color: $font06;
    }
    .btn {
      width: 40px;
      height: 26px;
      padding: 0 !important;
      text-align: center;
    }
  }
  .info {
    margin-top: 10px;
    font-size: 12px;
  }
  &.active {
    color: $theme;
    .region-name,
    .txt,
    .num {
      color: $theme;
    }
  }
}
.imgs {
  .img-item {
    display: inline-block;
    width: 80px;
    height: 78px;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 5px;
    .cover{
      display: inline-block;
    }
  }
}
.modal-content {
  .address {
    display: inline-block;
    margin-right: 10px;
    font-size: 16px;
    color: $font01;
    font-weight: 600;
  }
  .txt {
    font-size: 14px;
  }
}
.table-wrap {
  margin-top: 20px;
  background-color: #fff;
  .alarm-content {
    @include ellipsis();
  }
  .content-icon {
    cursor:pointer;
    color: $theme;
  }
}
</style>
