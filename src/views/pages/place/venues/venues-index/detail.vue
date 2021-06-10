<template>
  <div class="perform-wrap detail-wrap pd20">
    <!--审核结果-->
    <auditHead :data="headData" v-if="headData.status"></auditHead>
    <!--tab切换-->
    <Tabs active-key="key2" class="tab-wrap" :animated="false">
      <!--基础资料-->
      <Tab-pane label="基本资料" key="key1">
        <Row class="item mt20">
          <Col span="4" class="label-name">场馆名称</Col>
          <Col span="20" class="item-content">{{ desc.name }}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">场馆类型</Col>
          <Col span="20" class="item-content">{{
            desc.typeName || '暂无'
          }}</Col>
        </Row>
        <Row class="item mt20" v-if="desc && desc.venueLevelName">
          <Col span="4" class="label-name">场馆等级</Col>
          <Col span="20" class="item-content">{{ desc.venueLevelName }}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">场馆位置</Col>
          <Col span="20" class="item-content"
            >{{ desc.region }} {{ desc.address }}</Col
          >
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">开放时间</Col>
          <Col span="20" class="item-content">
            <ul class="clearfix t-wrap">
              <li
                class="fl item"
                v-for="(item, index) in openWeek.week"
                :key="index"
              >
                <p class="title">{{ item.name }}</p>
                <p
                  class="text-center item-time"
                  v-if="item.time[0] && item.time[1]"
                >
                  {{ item.time[0] }}~{{ item.time[1] }}
                </p>
                <p class="text-center item-time" v-else>暂无</p>
                <p class="text-center item-time" v-if="item.remarks">
                  {{ item.remarks }}
                </p>
              </li>
            </ul>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.chargeStatus">
          <Col span="4" class="label-name">收费规则</Col>
          <Col span="20" class="item-content">￥{{ desc.payRule || 0 }}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.maxNum">
          <Col span="4" class="label-name">最大服务人数</Col>
          <Col span="20" class="item-content">{{ desc.maxNum || 0 }}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">联系电话</Col>
          <Col span="20" class="item-content">{{ desc.phone || '暂无' }}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">建议游玩时长</Col>
          <Col span="20" class="item-content">{{ desc.suggestedHour }}小时</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">资源互通编码</Col>
          <Col span="20" class="item-content">{{
            desc.resourceCode || '暂无'
          }}</Col>
        </Row>

        <!--个性标签-->
        <div class="tips-panel clearfix">
          <span class="fl title">个性标签</span>
          <p class="fl tag-content">真实的选择个性信息，让游客更好了解景区。</p>
        </div>

        <Row class="item mt20" v-if="desc.tag">
          <Col span="4" class="label-name">场馆主题</Col>
          <Col span="20" class="btn-list">
            <p
              class="tags-box"
              v-for="(item, index) in tagList.themeList"
              :key="index"
            >
              <span class="choice-tag active">{{ item.labelName }}</span>
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.crowd">
          <Col span="4" class="label-name">适合人群</Col>
          <Col span="20" class="btn-list">
            <p
              class="tags-box"
              v-for="(item, index) in tagList.crowdList"
              :key="index"
            >
              <span class="choice-tag active">{{ item.labelName }}</span>
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.longitude && desc.latitude">
          <Col span="4" class="label-name">场馆位置</Col>
          <Col span="20" class="map">
            <descMap
              id="map"
              :longitude="desc.longitude"
              :latitude="desc.latitude"
            ></descMap>
          </Col>
        </Row>

        <!--下属活动室-->
        <div class="tips-panel clearfix" v-if="roomList.length">
          <span class="fl title">下属活动室</span>
        </div>
        <ul class="item mt20" v-if="roomList.length">
          <li class="items" v-for="item in roomList" :key="item.id">
            <router-link
              tag="a"
              target="_blank"
              :to="{
                path: '/room-detail',
                query: { venueId: desc.id, id: item.id, type: 'list' }
              }"
              class="cloud-img activity-room daq-no-photo"
            >
              <img
                :src="item.images.split(',')[0]"
                :alt="item.name"
                v-if="item.images"
              />
            </router-link>
            <router-link
              tag="a"
              target="_blank"
              class="activity-room-name"
              :to="{
                path: '/room-detail',
                query: { venueId: desc.id, id: item.id, type: 'list' }
              }"
              >{{ item.name }}</router-link
            >
          </li>
        </ul>
      </Tab-pane>
      <!--场馆介绍-->
      <Tab-pane label="场馆介绍" key="key2" class="item">
        <Row class="item mt20" v-if="desc.images">
          <Col span="4" class="label-name">场馆图片</Col>
          <Col span="22" class="item-content img-list">
            <p
              class="img"
              v-for="(item, index) in desc.images.split(',')"
              :key="index"
            >
              <img
                :src="item"
                alt
                @click.stop="viewImage(desc.images.split(','), index)"
              />
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.audio">
          <Col span="4" class="label-name">语音介绍</Col>
          <Col span="22" class="item-content img-list">
            <uploadAudio
              :defaultAudio="desc.audio"
              :readonly="true"
            ></uploadAudio>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.video">
          <Col span="4" class="label-name">视频</Col>
          <Col span="22" class="item-content img-list">
            <p class="img daq-no-photo view-images-box" @click="openVideo">
              <span class="cover"></span>
              <img
                :src="desc.videoCover"
                alt
                v-if="desc.videoCover"
                class="daq-img"
              />
            </p>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">720全景</Col>
          <Col span="20" class="item-content">
            <a
              :href="desc.panoramaUrl"
              v-if="desc.panoramaUrl"
              target="_blank"
              >{{ desc.panoramaUrl }}</a
            >
            <span v-else>暂无</span>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.officialUrl">
          <Col span="4" class="label-name">公众号二维码</Col>
          <Col span="22" class="item-content img-list">
            <p class="img">
              <img
                :src="desc.officialUrl"
                alt
                @click.stop="viewImage(desc.officialUrl.split(','), 0)"
              />
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.officialName">
          <Col span="4" class="label-name">公众号名称</Col>
          <Col span="20" class="item-content">{{ desc.officialName }}</Col>
        </Row>

        <Row class="item mt20" v-if="desc.websiteUrl">
          <Col span="4" class="label-name">官网地址</Col>
          <Col span="20" class="item-content">{{ desc.websiteUrl }}</Col>
        </Row>
        <Row class="item mt20" v-if="desc.onlineReadingImage">
          <Col span="4" class="label-name">在线阅读图片</Col>
          <Col span="22" class="item-content img-list">
            <p class="img">
              <img
                :src="desc.onlineReadingImage"
                alt
                @click.stop="viewImage(desc.onlineReadingImage.split(','), 0)"
              />
            </p>
          </Col>
        </Row>
        <Row class="item mt20" v-if="desc.onlineReadingOfficialName">
          <Col span="4" class="label-name">在线阅读公众号</Col>
          <Col span="20" class="item-content">{{
            desc.onlineReadingOfficialName
          }}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">场馆概述</Col>
          <Col span="20" class="item-content">{{
            desc.briefing || '暂无'
          }}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">场馆简介</Col>
          <Col span="20" class="item-content">{{ desc.summary || '暂无' }}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">场馆介绍</Col>
          <Col
            span="20"
            class="item-content"
            v-html="desc.introduce || '暂无'"
          ></Col>
        </Row>
      </Tab-pane>
      <!--交通信息-->
      <Tab-pane label="交通信息" key="key3" class="item">
        <Row class="item mt20">
          <Col span="4" class="label-name">交通信息</Col>
          <Col
            span="20"
            class="item-content"
            v-html="desc.trafficInfo || '暂无'"
          ></Col>
        </Row>
      </Tab-pane>
      <Tab-pane label="预约信息" key="key4" v-if="isOpen">
        <Row class="item mt20">
          <Col span="4" class="label-name">预约状态</Col>
          <Col span="20" class="item-content">
            {{ orderDesc.setUp.orderStatus == 1 ? '开启' : '不开启' }}
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">可预约时间</Col>
          <Col span="20" class="item-content">
            <!-- 全年 -->
            <div v-if="orderDesc.setUp.orderTimeType == 'ALL_YEAR_ORDER'">
              <p>
                全年,<span v-if="orderDesc.allYearOrder[0].remark"
                  >{{ orderDesc.allYearOrder[0].remark }}，</span
                >国家法定节假日{{
                  orderDesc.setUp.historyOrderStatus ? '' : '不'
                }}闭馆
              </p>
              <ul class="clearfix t-wrap">
                <li class="fl item" v-for="(item, index) in orderWeek">
                  <p class="title">{{ item.name }}</p>
                  <p class="text-center item-time" v-if="item.isClose">闭馆</p>
                  <p class="text-center item-time" v-if="!item.isClose">
                    {{ orderDesc.allYearOrder[0].orderTimeSubStart }}~{{
                      orderDesc.allYearOrder[0].orderTimeSubEnd
                    }}
                  </p>
                </li>
              </ul>
            </div>
            <!-- 淡旺季 -->
            <div v-if="orderDesc.setUp.orderTimeType == 'PEAK_SEASON_ORDER'">
              <!-- 旺季 -->
              <p>
                旺季，<span v-if="orderDesc.busySeasonOrder[0].remark"
                  >{{ orderDesc.busySeasonOrder[0].remark }}，</span
                >国家法定节假日{{
                  orderDesc.setUp.historyOrderStatus ? '' : '不'
                }}闭馆
              </p>
              <ul class="clearfix t-wrap">
                <li class="fl item" v-for="(item, index) in orderWeek">
                  <p class="title">{{ item.name }}</p>
                  <p class="text-center item-time" v-if="item.isClose">闭馆</p>
                  <p class="text-center item-time" v-if="!item.isClose">
                    {{ orderDesc.busySeasonOrder[0].orderTimeSubStart }}~{{
                      orderDesc.busySeasonOrder[0].orderTimeSubEnd
                    }}
                  </p>
                </li>
              </ul>
              <!-- 淡季 -->
              <p>
                淡季，<span v-if="orderDesc.lowSeasonOrder[0].remark"
                  >{{ orderDesc.lowSeasonOrder[0].remark }}，</span
                >国家法定节假日{{
                  orderDesc.setUp.historyOrderStatus ? '' : '不'
                }}闭馆
              </p>
              <ul class="clearfix t-wrap">
                <li class="fl item" v-for="(item, index) in orderWeek">
                  <p class="title">{{ item.name }}</p>
                  <p class="text-center item-time" v-if="item.isClose">闭馆</p>
                  <p class="text-center item-time" v-if="!item.isClose">
                    {{ orderDesc.lowSeasonOrder[0].orderTimeSubStart }}~{{
                      orderDesc.lowSeasonOrder[0].orderTimeSubEnd
                    }}
                  </p>
                </li>
              </ul>
            </div>
            <!-- 按季节 -->
            <div v-if="orderDesc.setUp.orderTimeType == 'USE_SEASON_ORDER'">
              <!-- 夏时令 -->
              <p>
                夏时令，<span v-if="orderDesc.summerOrder[0].remark"
                  >{{ orderDesc.summerOrder[0].remark }}，</span
                >国家法定节假日{{
                  orderDesc.setUp.historyOrderStatus ? '' : '不'
                }}闭馆
              </p>
              <ul class="clearfix t-wrap">
                <li class="fl item" v-for="(item, index) in orderWeek">
                  <p class="title">{{ item.name }}</p>
                  <p class="text-center item-time" v-if="item.isClose">闭馆</p>
                  <p class="text-center item-time" v-if="!item.isClose">
                    {{ orderDesc.summerOrder[0].orderTimeSubStart }}~{{
                      orderDesc.summerOrder[0].orderTimeSubEnd
                    }}
                  </p>
                </li>
              </ul>
              <!-- 冬时令 -->
              <p>
                冬时令，<span v-if="orderDesc.winterOrder[0].remark"
                  >{{ orderDesc.winterOrder[0].remark }}，</span
                >国家法定节假日{{
                  orderDesc.setUp.historyOrderStatus ? '' : '不'
                }}闭馆
              </p>
              <ul class="clearfix t-wrap">
                <li class="fl item" v-for="(item, index) in orderWeek">
                  <p class="title">{{ item.name }}</p>
                  <p class="text-center item-time" v-if="item.isClose">闭馆</p>
                  <p class="text-center item-time" v-if="!item.isClose">
                    {{ orderDesc.winterOrder[0].orderTimeSubStart }}~{{
                      orderDesc.winterOrder[0].orderTimeSubEnd
                    }}
                  </p>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">用户预约类型</Col>
          <Col span="20" class="item-content">
            <p
              class="inline-block"
              v-if="orderDesc.setUp.personOrderStatus === 1"
            >
              个人预约
              <span
                v-if="
                  orderDesc.setUp.personNumMin && orderDesc.setUp.personNumMax
                "
              >
                ({{ orderDesc.setUp.personNumMin }}-{{
                  orderDesc.setUp.personNumMax
                }})人</span
              >
              <span v-if="orderDesc.setUp.childNum"
                >，1 位成人最多可带 {{ orderDesc.setUp.childNum }} 个儿童</span
              >
              <span
                v-if="
                  !orderDesc.setUp.personNumMin && !orderDesc.setUp.personNumMax
                "
                >(不限制人数)</span
              >、
            </p>
            <p
              class="inline-block"
              v-if="orderDesc.setUp.teamOrderStatus === 1"
            >
              团队预约
              <span
                v-if="orderDesc.setUp.teamNumMin && orderDesc.setUp.teamNumMax"
              >
                ({{ orderDesc.setUp.teamNumMin }}-{{
                  orderDesc.setUp.teamNumMax
                }})人
              </span>
              <span v-else>(不限制人数)</span>
            </p>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">最大接待人数</Col>
          <Col span="20" class="item-content">{{ orderDesc.setUp.maxNum }}</Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">可预约天数</Col>
          <Col span="20" class="item-content">
            <p class="inline-block">
              <span v-if="orderDesc.setUp.personAdvanceOrderDay >= 0"
                >个人至少提前{{
                  orderDesc.setUp.personAdvanceOrderDay
                }}天，</span
              >
              <span v-if="orderDesc.setUp.teamAdvanceOrderDay >= 0"
                >团队至少提前{{ orderDesc.setUp.teamAdvanceOrderDay }}天</span
              >
            </p>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">取消设置</Col>
          <Col span="20" class="item-content">
            <span v-if="orderDesc.setUp.cancelStatus === 0">不可取消</span>
            <span v-if="orderDesc.setUp.cancelStatus === 1">随时取消</span>
            <span v-if="orderDesc.setUp.cancelStatus === 2"
              >开始使用24小时前可取消</span
            >
            <span v-if="orderDesc.setUp.cancelStatus === 3"
              >开始使用{{ orderDesc.setUp.cancelTime }}小时前可取消</span
            >
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">核销设置</Col>
          <Col span="20" class="item-content">
            <span v-if="orderDesc.setUp.validStartValue >= 0"
              >预约开始时间 前{{ orderDesc.setUp.validStartValue }}
              {{
                orderDesc.setUp.validTimeStartType == 'VALID_TIME_TYPE_HOURS'
                  ? '小时'
                  : '分钟'
              }},
            </span>
            <span v-if="orderDesc.setUp.validEndValue >= 0"
              >预约开始时间 后{{ orderDesc.setUp.validEndValue }}
              {{
                orderDesc.setUp.validTimeEndType == 'VALID_TIME_TYPE_HOURS'
                  ? '小时'
                  : '分钟'
              }}
            </span>
          </Col>
        </Row>
        <Row class="item mt20">
          <Col span="4" class="label-name">预约须知</Col>
          <Col span="20" class="item-content">
            {{ orderDesc.setUp.orderNotice || '-' }}
          </Col>
        </Row>
      </Tab-pane>
    </Tabs>
    <!--审核记录-->
    <div
      class="tips-panel clearfix"
      v-if="recordsLog && recordsLog.length >= 1"
    >
      <span class="fl title">审核记录</span>
    </div>
    <Timeline class="timeLine">
      <Timeline-item v-for="(item, index) in recordsLog" :key="index">
        <p class="time">{{ item.createTime }}</p>
        <p class="content">
          由【{{ item.name }}】【{{
            item.phone.substr(item.phone.length - 4, item.phone.length)
          }}】审核，审核结果：{{ getStatusTitle(item.auditStatus) }}。
          <span v-if="item.auditResult">审核备注：{{ item.auditResult }}</span>
        </p>
      </Timeline-item>
    </Timeline>
    <Row class="item mg20 submit-panel" v-if="!isAudit">
      <Col span="24">
        <Button
          type="primary"
          class="btn-cancel"
          v-if="operates.includes('edit') && desc.status != 4"
          @click="goEdit"
          >修改</Button
        >
        <Button class="submit ml20" @click="goBack" v-if="showBackBtn">返回</Button>
      </Col>
    </Row>
    <VideoPlayer
      :showVideo="showVideo"
      :show="show"
      v-if="showVideo.url"
    ></VideoPlayer>
    <PreviewPics
      v-model="visible"
      :imgs="imgUrl"
      :currIndex="currIndex"
    ></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import auditHead from '@views/pages/common/result-head.vue'
import descMap from '@components/map/desc-map.vue'
import VideoPlayer from '@components/video-play/video-play.vue'
import uploadAudio from '@components/upload/upload-audio.vue'
import { venueView, activityRoomList, getVenueOrderInfo } from '@service/place'
import { getTagsSelect, tagViewList } from '@service/common'
import { AppModule } from '@store/modules/app'
import { PreviewPics } from '@components/index'
interface videoType {
  url: String
  image: String
  title: String
}

@Component({
  components: {
    auditHead,
    descMap,
    VideoPlayer,
    uploadAudio,
    PreviewPics
  }
})
export default class detail extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates
  }

  //是否从审核查看
  @Prop() private audit!: boolean
  private isAudit: boolean = false

  /*S 获取详情*/
  private headData: object = {
    remark: '', //审核备注
    date: '', //审核日期
    status: -1 //审核状态
  }
  //审核流程信息
  private recordsLog: Array<object> = []
  private desc: object = {}

  private openWeek: any = {
    setType: 0,
    week: [
      {
        name: '周一',
        time: [],
        remarks: ''
      },
      {
        name: '周二',
        time: [],
        remarks: ''
      },
      {
        name: '周三',
        time: [],
        remarks: ''
      },
      {
        name: '周四',
        time: [],
        remarks: ''
      },
      {
        name: '周五',
        time: [],
        remarks: ''
      },
      {
        name: '周六',
        time: [],
        remarks: ''
      },
      {
        name: '周日',
        time: [],
        remarks: ''
      }
    ]
  }

  //获取接口数据
  getData() {
    let _this = this
    venueView({
      id: _this.$route.query.id
    }).then((res: any) => {
      if (res.code === 0) {
        _this.desc = res.data.ctcVenue
        let _data = res.data.ctcVenue
        _this.showVideo.url = _data.video as string
        _this.showVideo.title = _data.name as string
        _this.showVideo.image = _data.videoCover as string
        _this.isOpen = res.data.ctcVenue.isOpen //场馆预约是否开放
        //主题标签
        if (res.data.ctcVenue.tag) {
          _this.getTagList(res.data.ctcVenue.tag, 'themeList')
        }
        //适合人群标签
        if (res.data.ctcVenue.crowd) {
          _this.getTagList(res.data.ctcVenue.crowd, 'crowdList')
        }
        //审核结果信息
        _this.headData = {
          remark: res.data.auditRecordsVo.currentAuditResult,
          date: res.data.auditRecordsVo.dateTime,
          status: res.data.auditRecordsVo.currentAuditStatus
        }
        //审核流程信息
        _this.recordsLog = res.data.auditRecordsVo.recordsLog
        _this.openWeek = (_this.desc as any).openWeek
          ? JSON.parse((_this.desc as any).openWeek)
          : {}
      }
    })
  }

  //标签
  private tagList: object = {
    themeList: [],
    crowdList: []
  }
  // 获取标签
  getTagList(ids: any, type: any) {
    tagViewList({
      ids: ids
    }).then((res: any) => {
      ;(this.tagList as any)[type] = res.datas
    })
  }

  //获取审核状态中文结果
  getStatusTitle(status: any) {
    switch (status) {
      case 7: {
        return '回退'
      }
      case 8: {
        return '撤回'
      }
      case 9: {
        return '终止'
      }
      case 6: {
        return '审核通过'
      }
    }
  }

  //下属活动室
  private roomList: Array<object> = []

  activityRoomList() {
    let _this = this
    activityRoomList({
      venueId: _this.$route.query.id
    }).then((res: any) => {
      _this.roomList = res.datas
    })
  }

  /*E 获取详情*/
  /*S 场馆预约详情*/
  private isOpen: any = 0
  private orderDesc: any = {}
  private orderWeek: any = [
    { name: '周一', isClose: false, value: '1' },
    { name: '周二', isClose: false, value: '2' },
    { name: '周三', isClose: false, value: '3' },
    { name: '周四', isClose: false, value: '4' },
    { name: '周五', isClose: false, value: '5' },
    { name: '周六', isClose: false, value: '6' },
    { name: '周日', isClose: false, value: '7' }
  ]
  getVenueOrderDesc() {
    getVenueOrderInfo({ id: this.$route.query.id }).then((res: any) => {
      if (res.code === 0) {
        this.orderDesc = res.data
        //不可预约星期(闭关星期)
        if (this.orderDesc.setUp && this.orderDesc.setUp.notOrderWeek) {
          this.orderDesc.setUp.notOrderWeek
            .split(',')
            .forEach((item: any, index: any) => {
              this.orderWeek.map((weekItem: any) => {
                weekItem.isClose = item == weekItem.value
              })
            })
        }
      }
    })
  }
  /*E 场馆预约详情*/

  //返回
  goBack() {
    this.$router.go(-1)
  }

  //去修改
  goEdit() {
    this.$router.push({
      path: '/venues-edit',
      query: { id: this.$route.query.id, type: this.$route.query.type }
    })
  }

  /*S视频*/
  private show: Boolean = false
  private showVideo: videoType = {
    url: '',
    image: '',
    title: ''
  }

  private openVideo() {
    this.show = true
  }
  /*E视频*/

  /* S 查看大图 */
  private visible: Boolean = false
  private imgUrl: Array<string> = []
  private currIndex = 0
  private viewImage(url: Array<string>, idx: number) {
    this.imgUrl = url
    this.visible = true
    this.currIndex = idx
  }
  /* E 查看大图 */
  showBackBtn = true;
  mounted() {
    let _this = this
    _this.getData()
    _this.activityRoomList()
    _this.getVenueOrderDesc()
    this.showBackBtn = !this.$route.query.showBackBtn
    //是否从审核详情查看
    if (_this.audit) {
      _this.isAudit = true
    }
  }
  beforeRouteUpdate(to: any, from: any, next: Function) {
    this.getData()
    this.activityRoomList()
    this.getVenueOrderDesc()
    //是否从审核详情查看
    if (this.audit) {
      this.isAudit = true
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
.mt20 {
  margin-top: 10px;
}
.detail-wrap {
  padding: 10px 15px 0;
  .label-name {
    width: 100px;
    line-height: 25px;
    padding-right: 10px;
    vertical-align: middle;
    text-align: right;
    color: $font01;
    font-weight: 600;
  }
  .no {
    display: inline-block;
    line-height: 25px;
  }
  .item-content {
    width: 65%;
    line-height: 25px;
    color: $font05;
    .img {
      display: inline-block;
      width: 240px;
      height: 160px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
      & + .img {
        margin-left: 5px;
      }
    }
    &.simulate {
      p {
        display: inline-block;
        & + p {
          margin-left: 20px;
        }
      }
      .count {
        margin-left: 3px;
        width: 200px;
        text-align: left;
      }
    }
  }
  .map {
    height: 450px;
  }
  .items {
    display: inline-block;
    vertical-align: top;
    margin-right: 20px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }
  .cloud-img {
    display: block;
    &.activity-room {
      width: 200px;
      height: 150px;
      border-radius: 4px;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .activity-room-name {
    display: block;
    font-size: 14px;
    color: $font01;
    margin-top: 12px;
  }
  .tips-panel {
    margin-top: 30px;
    background-color: $grayLight;
    padding: 20px;
    .title {
      position: relative;
      padding-left: 10px;
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
    .tag-content {
      margin-left: 30px;
      color: $font02;
      line-height: 24px;
    }
  }
  .item-content {
    .button {
      & + .button {
        margin-left: 15px;
      }
    }
  }
  .w150 {
    width: 150px;
  }
  .submit-panel {
    margin-top: 40px;
  }
  .t-wrap {
    display: inline-block;
    width: 100%;
    .title {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid $borderLight;
      background-color: #f2f4f7;
    }
    .item-time {
      width: 100%;
      padding: 10px;
      border: 1px solid $borderLight;
      margin-top: -1px;
      word-wrap: break-word;
    }
    .item {
      width: 14%;
      & + .item {
        margin-left: -1px;
      }
    }
  }
  .timeLine {
    padding: 20px 20px 0;
  }
}
</style>
