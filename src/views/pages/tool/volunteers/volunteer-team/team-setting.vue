<template>
  <div class="container pd20">
    <div class="head">
      <div class="left logo">
        <img class="cloud-img" src="http://placehold.it/100" />
      </div>
      <div class="right ml20 mt10">
        <p class="title">{{ data.teamName }}</p>
        <p class="tit-tip mt10" v-if="data.teamSlogan">{{ data.teamSlogan }}</p>
        <p class="info mt10">
          <span>服务地区：{{ data.serviceRegionName }}</span>
          <Divider type="vertical" />
          <span>团队归属：{{ data.attribution }}</span>
          <Divider type="vertical" />
          <span>团队类型：{{ data.teamType }}</span>
          <Divider type="vertical" v-if="data.establishTime" />
          <span v-if="data.establishTime"
            >成立日期：{{ data.establishTime }}</span
          >
        </p>
      </div>
    </div>
    <Divider />
    <!-- 负责人权限设置 -->
    <div class="items">
      <h3 class="items-tit">
        负责人权限设置
        <span class="tit-tip"
          >当权限关闭，负责人相关权限无法开启或禁用，开启后需重新设置</span
        >
      </h3>
      <Divider />
      <div class="item check">
        <div class="check-item">
          <p class="name">邀请志愿者入团：</p>
          <p class="txt">
            {{ data.inviteVolunteer ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch
                class="tab-switch"
                :value="data.inviteVolunteer"
              ></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(
                    data.inviteVolunteer,
                    'inviteVolunteer',
                    '邀请志愿者入团'
                  )
                "
              ></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">审核入团申请：</p>
          <p class="txt">
            {{ data.reviewJoinTeamApply ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch
                class="tab-switch"
                :value="data.reviewJoinTeamApply"
              ></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(
                    data.reviewJoinTeamApply,
                    'reviewJoinTeamApply',
                    '审核入团申请'
                  )
                "
              ></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">发布志愿招募活动：</p>
          <p class="txt">
            {{ data.publishActivity ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch
                class="tab-switch"
                :value="data.publishActivity"
              ></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(
                    data.publishActivity,
                    'publishActivity',
                    '发布志愿招募活动'
                  )
                "
              ></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">审核志愿招募活动报名：</p>
          <p class="txt">
            {{ data.reviewActivityApply ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch
                class="tab-switch"
                :value="data.reviewActivityApply"
              ></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(
                    data.reviewActivityApply,
                    'reviewActivityApply',
                    '审核志愿招募活动报名'
                  )
                "
              ></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">添加负责人：</p>
          <p class="txt">
            {{ data.addManage ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="data.addManage"></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(data.addManage, 'addManage', '添加负责人')
                "
              ></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">取消其他负责人：</p>
          <p class="txt">
            {{ data.cancelManage ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch
                class="tab-switch"
                :value="data.cancelManage"
              ></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(
                    data.cancelManage,
                    'cancelManage',
                    '取消其他负责人'
                  )
                "
              ></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">发布团队通知：</p>
          <p class="txt">
            {{ data.releaseNotice ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch
                class="tab-switch"
                :value="data.releaseNotice"
              ></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(
                    data.releaseNotice,
                    'releaseNotice',
                    '发布团队通知'
                  )
                "
              ></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">审核志愿者发布的服务足迹：</p>
          <p class="txt">
            {{ data.reviewFootprint ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch
                class="tab-switch"
                :value="data.reviewFootprint"
              ></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(
                    data.reviewFootprint,
                    'reviewFootprint',
                    '审核志愿者发布的服务足迹'
                  )
                "
              ></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">负责人权限设置：</p>
          <p class="txt">
            {{ data.authoritySet ? '启用' : '禁用' }}
            <span class="switch-box">
              <i-switch
                class="tab-switch"
                :value="data.authoritySet"
              ></i-switch>
              <i
                class="mask"
                @click="
                  statusChangeHandle(
                    data.authoritySet,
                    'authoritySet',
                    '负责人权限设置'
                  )
                "
              ></i>
            </span>
          </p>
        </div>
      </div>
    </div>
    <!-- 团队负责人 -->
    <div class="items" v-if="teamList && teamList.length">
      <h3 class="items-tit">
        团队负责人
      </h3>
      <Divider />
      <div class="item-wrap" v-for="(item, index) in teamList" :key="item.id">
        <div class="head-name">
          {{ item.name }}{{ item.founder ? '(主要负责人)' : '' }}
          <span
            class="cancel ml10"
            v-if="item.founder"
            @click.stop="
              () => {
                modalShow1 = true;
                outId=item.id;
                title='转让主要负责人权限'
              }
            "
            >转让</span
          >
          <span
            class="cancel ml10"
            v-if="!item.founder"
            @click.stop="cancelMemberManage(item)"
            >取消</span
          >
        </div>
        <div
          class="item check mt15"
          :class="{ disabled: !data.inviteVolunteer }"
        >
          <div class="check-item">
            <p class="name">邀请志愿者入团：</p>
            <p class="txt">
              {{ item.inviteVolunteer ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="item.inviteVolunteer"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.inviteVolunteer,
                      'inviteVolunteer',
                      '邀请志愿者入团',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
          <div
            class="check-item"
            :class="{ disabled: !data.reviewJoinTeamApply }"
          >
            <p class="name">审核入团申请：</p>
            <p class="txt">
              {{ item.reviewJoinTeamApply ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="item.reviewJoinTeamApply"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.reviewJoinTeamApply,
                      'reviewJoinTeamApply',
                      '审核入团申请',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
          <div class="check-item" :class="{ disabled: !data.publishActivity }">
            <p class="name">发布志愿招募活动：</p>
            <p class="txt">
              {{ item.publishActivity ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="item.publishActivity"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.publishActivity,
                      'publishActivity',
                      '发布志愿招募活动',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
          <div
            class="check-item"
            :class="{ disabled: !data.reviewActivityApply }"
          >
            <p class="name">审核志愿招募活动报名：</p>
            <p class="txt">
              {{ item.reviewActivityApply ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="item.reviewActivityApply"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.reviewActivityApply,
                      'reviewActivityApply',
                      '审核志愿招募活动报名',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
          <div class="check-item" :class="{ disabled: !data.addManage }">
            <p class="name">添加负责人：</p>
            <p class="txt">
              {{ item.addManage ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch class="tab-switch" :value="item.addManage"></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.addManage,
                      'addManage',
                      '添加负责人',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
          <div class="check-item" :class="{ disabled: !data.cancelManage }">
            <p class="name">取消其他负责人：</p>
            <p class="txt">
              {{ item.cancelManage ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="item.cancelManage"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.cancelManage,
                      'cancelManage',
                      '取消其他负责人',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
          <div class="check-item" :class="{ disabled: !data.releaseNotice }">
            <p class="name">发布团队通知：</p>
            <p class="txt">
              {{ item.releaseNotice ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="item.releaseNotice"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.releaseNotice,
                      'releaseNotice',
                      '发布团队通知',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
          <div class="check-item" :class="{ disabled: !data.reviewFootprint }">
            <p class="name">审核志愿者发布的服务足迹：</p>
            <p class="txt">
              {{ item.reviewFootprint ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="item.reviewFootprint"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.reviewFootprint,
                      'reviewFootprint',
                      '审核志愿者发布的服务足迹',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
          <div class="check-item" :class="{ disabled: !data.authoritySet }">
            <p class="name">负责人权限设置：</p>
            <p class="txt">
              {{ item.authoritySet ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="item.authoritySet"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    updateManageStatus(
                      item.authoritySet,
                      'authoritySet',
                      '负责人权限设置',
                      item.id,
                      index
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
        </div>
      </div>
      <Divider />
      <div class="add-manage">
        <span
          class="add"
          @click.stop="
            () => {
              modalShow1 = true;
              title='添加主要负责人';
            }
          "
          v-if="!founder"
          >+添加主要负责人</span
        >
        {{ !founder ? '/' : '' }}
        <span
          class="add"
          @click.stop="
            () => {
              modalShow2 = true
            }
          "
          >+添加负责人</span
        >
      </div>
    </div>
    <!-- 志愿者服务配置 -->
    <div class="items">
      <h3 class="items-tit">
        志愿者服务配置
      </h3>
      <Divider />
      <div class="con-item">
        <p class="con-tit">允许志愿者加入团队</p>
        <p class="con-tip">
          开启后，志愿者可以申请加入团队，审核通过后成为团队成员。
        </p>
        <div class="con-checks">
          <div class="con-check">
            <p class="txt">
              {{ data.joinStatus ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="data.joinStatus"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    statusChangeHandle(
                      data.joinStatus,
                      'joinStatus',
                      '允许志愿者加入团队'
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
        </div>
      </div>
      <Divider />
      <div class="con-item">
        <p class="con-tit">允许志愿者定点签到</p>
        <p class="con-tip">
          开启后，志愿者可以申请志愿服务，审核通过后到签到地进行签到签退计算服务时长。
        </p>
        <div class="con-checks">
          <div class="con-check">
            <p class="txt">
              {{ data.openSignIn ? '启用' : '禁用' }}
              <span class="switch-box">
                <i-switch
                  class="tab-switch"
                  :value="data.openSignIn"
                ></i-switch>
                <i
                  class="mask"
                  @click="
                    statusChangeHandle(
                      data.openSignIn,
                      'openSignIn',
                      '允许志愿者定点签到'
                    )
                  "
                ></i>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 转让主要负责人弹框 -->
    <setTeamHead
      :modalShow="modalShow1"
      :teamId="$route.query.id"
      @onClose="modalShow1 = false"
      @onOkClick="getTeamHead1"
      :checkWay="0"
      :title="title"
    ></setTeamHead>
    <!-- 添加团队负责人弹框 -->
    <setTeamHead
      :modalShow="modalShow2"
      :teamId="$route.query.id"
      @onClose="modalShow2 = false"
      @onOkClick="getTeamHead2"
      :checkWay="1"
    ></setTeamHead>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ModalConfig } from 'iview/types'
import setTeamHead from '@views/pages/tool/volunteers/common/set-teamHead.vue'
import {
  getVolunteerTeamConfig,
  updateVolunteerTeamConfig,
  teamVolunteerList,
  cancelMemberManage,
  transferManage,
  updateTeamMemberConfig,
  addMemberManage,
  addMemberFounder
} from '@service/tool'

import { AppModule } from '@store/modules/app'
interface SiteConfigDataType {
  inviteVolunteer?: boolean // 是否可以邀请志愿者
  reviewJoinTeamApply?: boolean // 是否可以审核入团申请
  publishActivity?: boolean // 是否可以发布活动
  addManage?: boolean // 是否可以添加负责人
  cancelManage?: boolean // 	是否可以取消负责人
  releaseNotice?: boolean // 	是否可以发布通知
  reviewFootprint?: boolean // 	是否可以审核足迹
  authoritySet?: boolean // 		是否可以设置权限
  reviewActivityApply?: boolean // 		是否可以审核活动报名
  openSignIn?: boolean // 		是否开启签到
  joinStatus?: boolean // 		是否允许志愿者加入
}
@Component({
  components: {
    setTeamHead
  }
})
export default class teamSetting extends Vue {
  /**
   * 团队权限配置修改
   * 点击switch按钮进行对应的弹窗提示
   * @params status {boolean} 当前按钮的值
   * @parmas code {string} 当前选项的键
   * @params name {string} 当前选项对应的名称
   */
  private statusChangeHandle(status: boolean, code: string, name: string) {
    let _this = this
    let title = status ? '禁用' : '启用'
    let config: ModalConfig = {
      title: '操作提示',
      content: `是否${title}${name}?`,
      okText: `确认${title}`,
      cancelText: '取消',
      onOk: () => {
        this.updateStatus({ [code]: !status }, `${title}${name}`)
      }
    }
    this.$Modal.confirm(config)
  }
  /**
   * 团队权限配置修改
   * 禁用启用部分选项请求
   * @params params 请求用参数
   * @params title 请求成功后提示的标题
   */
  private updateStatus(params: SiteConfigDataType, title: string) {
    this.spinShow = true
    updateVolunteerTeamConfig(
      Object.assign(params, { id: this.$route.query.id })
    )
      .then(res => {
        this.spinShow = false
        if (res.code === 0) {
          this.$Message.success(`${title}成功`)
          this.getSiteConfig()
        }
      })
      .catch(err => {
        this.spinShow = false
      })
  }
  /**
   * 团队负责人权限配置修改
   * 点击switch按钮进行对应的弹窗提示
   * @params status {boolean} 当前按钮的值
   * @parmas code {string} 当前选项的键
   * @params name {string} 当前选项对应的名称
   * @params volunteerId {any} 志愿者id
   * @params index {number} 选择修改的负责人索引
   */
  private updateManageStatus(
    status: boolean,
    code: string,
    name: string,
    volunteerId: any,
    index: number
  ) {
    let _this = this
    let title = status ? '禁用' : '启用'
    let config: ModalConfig = {
      title: '操作提示',
      content: `是否${title}${name}?`,
      okText: `确认${title}`,
      cancelText: '取消',
      onOk: () => {
        _this.spinShow = true
        updateTeamMemberConfig({
          [code]: !status,
          teamId: _this.$route.query.id,
          volunteerId: volunteerId
        })
          .then(res => {
            _this.spinShow = false
            if (res.code === 0) {
              _this.$Message.success(`${title}成功`)
              _this.teamList[index][code] = !status
            }
          })
          .catch(err => {
            _this.spinShow = false
          })
      }
    }
    this.$Modal.confirm(config)
  }

  // 获取配置
  private data: any = {}
  private getSiteConfig() {
    getVolunteerTeamConfig({
      id: this.$route.query.id
    }).then((res: any) => {
      this.data = res.data
    })
  }
  //获取团队成员
  teamList: any = []
  founder: boolean = false //是否存在主要负责人
  getVolunteerTeamItem() {
    teamVolunteerList({
      teamId: this.$route.query.id,
      manage: true
    }).then((res: any) => {
      if (res.code === 0) {
        this.teamList = res.datas
        let founderLen = res.datas.map((item: any) => {
          if (item.founder) {
            return item
          }
          return item
        })
        this.founder = founderLen.length > 0 ? true : false
      }
    })
  }
  //取消负责人
  cancelMemberManage(item: any) {
    let _this = this
    let config: ModalConfig = {
      title: '操作提示',
      content: `确定要取消（${item.name}）的负责人身份?`,
      okText: `确认`,
      cancelText: '取消',
      onOk: () => {
        cancelMemberManage({
          volunteerId: item.id,
          teamId: _this.$route.query.id
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success('取消成功')
            _this.getVolunteerTeamItem()
          }
        })
      }
    }
    this.$Modal.confirm(config)
  }
  /**S 负责人弹窗 */
  private modalShow1: boolean = false
  private modalShow2: boolean = false
  private title:string='';
  // 添加主要负责人
  outId:any='';//转出主要负责人Id
  getTeamHead1(list: Array<{ name: string; id: any }>) {
    let id = ''
    list.forEach((item: any) => {
      id = item.id
    })
    if (this.founder) {
      transferManage({
        outId:this.outId,
        intoId:id,
        teamId: this.$route.query.id
      }).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success('转让成功')
          this.getVolunteerTeamItem()
        }
      })
    } else {
      addMemberFounder({
        volunteerId: id,
        teamId: this.$route.query.id
      }).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success('添加成功')
          this.getVolunteerTeamItem()
        }
      })
    }
  }
  // 添加负责人
  getTeamHead2(list: Array<{ name: string; id: any }>) {
    let ids = list.map((item: any) => {
      return item.id
    })
    if (ids.length) {
      addMemberManage({
        volunteerIds: ids.toString(),
        teamId: this.$route.query.id
      }).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success('添加成功')
          this.getVolunteerTeamItem()
        }
      })
    }
  }
  /**E 负责人弹窗 */
  created() {
    this.getSiteConfig()
    this.getVolunteerTeamItem()
  }
}
</script>

<style lang="scss">
.modal-local-settin-info {
  .ivu-modal-header {
    border-bottom: none !important;
  }
  .ivu-modal-footer {
    border-top: none !important;
  }
}
</style>
<style lang="scss" scoped>
.head {
  padding: 0 0 20px 10px;
  display: flex;
  .logo {
    border-radius: 50%;
    overflow: hidden;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
  }
}
.items {
  .items-tit {
    padding-top: 16px;
  }
  .tit-tip {
    margin-left: 24px;
    font-size: 10px;
    color: #999;
    font-weight: normal;
  }
  .item-switch {
    margin-left: 8px;
  }
  .ivu-divider-horizontal {
    margin: 12px 0 24px;
  }
  .head-name {
    display: block;
    margin: 0 32px;
    padding-bottom: 15px;
    color: $theme;
    font-weight: 600;
    border-bottom: 2px dashed #f2f2f2;
    .cancel {
      display: inline-block;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .item {
    display: flex;
    margin-bottom: 32px;
    padding: 0 32px;

    &.check {
      flex-wrap: wrap;
      padding-left: 0;
    }
    &.inline {
      align-items: center;
    }
    &.mb-8 {
      margin-bottom: 8px;
    }
  }
  .check-item {
    min-width: 250px;
    margin: 0 0 18px 32px;
    display: flex;
    align-items: center;
    &.disabled {
      position: relative;
      color: #ccc;
      &:before {
        position: absolute;
        z-index: 99;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
  .name {
    min-width: 5em;
  }
  .ipt {
    flex: 1;
    max-width: 300px;
    margin-right: 16px;
  }
  .cloud-icon {
    margin-left: 8px;
    cursor: pointer;
  }
  .button {
    align-self: flex-end;
  }
  .con-tit {
    padding-bottom: 12px;
    font-size: 14px;
  }
  .con-tip {
    font-size: 10px;
    color: #999;
    em {
      color: $theColor1;
      font-style: normal;
    }
  }
  .con-checks {
    display: flex;
    padding: 12px 0;
  }
  .con-check {
    display: flex;
    margin: 0 60px 0 0;
    .name {
      min-width: auto;
    }
  }
  .machine-check {
    .number {
      width: 110px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    &-txt {
      width: 110px;
      padding: 12px 0;
      text-align: center;
    }
    &-btns {
      display: flex;
      align-items: center;
    }
    &-btn {
      margin-right: 12px;
    }
    &-btn1 {
      width: 110px;
    }
    &-phone {
      color: #999;
    }
  }
}
.add-manage {
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  .add {
    cursor: pointer;
    color: $theme;
  }
}
.ml-8 {
  margin-left: 8px;
}
.switch-box {
  position: relative;
  margin-left: 4px;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.control {
  width: 300px !important;
}
</style>
