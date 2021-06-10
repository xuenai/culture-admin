<template>
  <div v-if="joinTeamRecord && joinTeamRecord.length">
    <div class="tips-panel clearfix mt20">
      <span class="fl title">入团记录</span>
    </div>
    <Timeline class="record-panel pd20">
      <Timeline-item
        v-for="(item, index) in joinTeamRecord"
        :key="item.id"
        v-if="item.operateStatus !== 4"
      >
        <p class="time">{{ item.operateTime }}</p>
        <div v-if="item.joinType == 'apply'">
          <p class="content">
            申请加入<router-link :to="`/volunteers-detail-team/${item.teamId}`"
              >【{{ item.teamName }}】</router-link
            >
          </p>
          <p class="content">
            由【{{ item.operateUserName }}】审核，审核结果：{{
              item.operateStatus == 6 ? '同意入团' : '不同意'
            }}。审核时间：{{ item.operateTime }} 。{{
              item.operateResult ? `审核备注：${item.operateResult}` : ''
            }}
            <a @click.stop="checkView(item)">查看详情 ></a>
          </p>
        </div>
        <div v-if="item.joinType == 'scanCode'">
          <p class="content">
            受邀加入<router-link :to="`/volunteers-detail-team/${item.teamId}`"
              >【{{ item.teamName }}】</router-link
            >
          </p>
          <p class="content">
            邀请人：{{ item.operateUserName }},邀请时间：{{ item.operateTime }}
          </p>
        </div>
      </Timeline-item>
    </Timeline>
    <Modal
      v-model="show"
      title="入团记录详情"
      @on-cancel="onClose"
      width="800"
      footer-hide
    >
      <div class="record-desc">
        <p class="label-name">申请加入的志愿团队</p>
        <p class="item mt10">{{ modalData.teamName }}</p>
        <p class="label-name mt20">申请时间</p>
        <p class="item mt10">{{ modalData.applyTime }}</p>
        <p class="label-name mt20">申请理由</p>
        <div class="item mt10">
          <p class="result" v-if="modalData.operateResult">
            {{ modalData.operateResult }}
          </p>
          <div
            class="img-box mt10"
            v-for="(item, index) in modalData.images"
            :key="item.id"
            @click.stop="previewPic(modalData.images, index, '申请理由')"
          >
            <img :src="item" alt="" class="cloud-img" />
          </div>
        </div>
      </div>
    </Modal>
    <PreviewPics
      v-model="previewPicShow"
      :imgs="imageUrls"
      :title="previewPicTitle"
      :currIndex="previewPicIndex"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { volunteerJoinTeamRecord } from '@service/audit'
import { PreviewPics } from '@components/index'
@Component({ components: { PreviewPics } })
export default class Volunt extends Vue {
  @Prop({ default: false }) private volunteerId!: boolean //志愿者id
  @Watch('volunteerId', { immediate: true, deep: true })
  refreshShow(id: boolean) {
    if (id) {
      this.getVolunteerJoinTeamRecord(id)
    }
  }
  //入团记录
  private joinTeamRecord: any = []
  getVolunteerJoinTeamRecord(volunteerId: any) {
    volunteerJoinTeamRecord({
      volunteerId: volunteerId
    }).then((res: any) => {
      if (res.code === 0) {
        this.joinTeamRecord = res.datas
      }
    })
  }
  /**S 弹窗 */
  private show: boolean = false
  private activeIndex: number = -1
  onClose() {
    this.show = false
  }
  private modalData: any = {}
  checkView(item: any) {
    this.modalData = item
    this.show = true
  }
  /**E 弹窗 */
  /**S 图片浏览 */
  private previewPicShow = false
  private imageUrls: Array<String> = []
  private previewPicIndex: Number = 0
  private previewPicTitle: string = ''
  previewPic(urls: any, index: Number, title: string) {
    this.imageUrls = urls
    this.previewPicShow = true
    this.previewPicIndex = index
    this.previewPicTitle = title
  }
  /**E 图片浏览 */
  mounted() {}
}
</script>

<style lang="scss" scoped>
.tips-panel {
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
}
.record-desc {
  .label-name {
    font-weight: 700;
    font-size: 14px;
  }
  .result {
    line-height: 25px;
  }
  .img-box {
    display: inline-block;
    width: 140px;
    height: 140px;
    border-radius: 10px;
    overflow: hidden;
    margin: 0 10px 10px 0;
  }
}
</style>
