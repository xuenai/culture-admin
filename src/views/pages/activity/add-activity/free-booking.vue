<!--
 * @Author: 任智勇
 * @since: 2019-05-23 09:02:49
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-16 15:26:01
 -->
<template>
  <div class="activity page-activity-add">
    <div class="add-content-detail-title">
      <!-- 进度条 -->
      <ul class="header-goods">
        <li class="active">
          <em class="demo2"></em>
          <span class="demo1 hasNo"></span>
          <span>1 创建活动</span>
        </li>
        <li>
          <em class="demo2 noRightM"></em>
          <span>2 编辑活动内容</span>
        </li>
      </ul>
      <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 基本信息</p>
      <div class="add-content-detail-content">
        <Form
          ref="formData"
          :model="formData"
          :label-width="100"
          :rules="ruleValidate"
        >
          <FormItem label="活动类型" required>
            <span class="detail-text-text">{{
              getStatusTxt[$route.query.classify]
            }}</span>
          </FormItem>
          <FormItem label="活动方式" required>
            <span class="detail-text-text">{{
              getStatusTxt[$route.query.method]
            }}</span>
          </FormItem>
          <FormItem label="创建者">
            <!-- 回显修改时不允许再次编辑 -->
            <Select
              v-model="formData.createCompany"
              @on-change="createCompanyChange"
              :disabled="!isSite"
              filterable
              style="width: 250px"
            >
              <Option
                v-for="option in siteList"
                :value="option.id"
                :key="option.id"
                >{{ option.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="活动名称" prop="name">
            <Input
              placeholder="请输入活动名称"
              style="width: 250px"
              v-model="formData.name"
              :maxlength="50"
            />
            <span class="prompt ml20">50字以内</span>
          </FormItem>
          <FormItem
            label="报名方式"
            required
            prop="lineFlag"
            v-if="formData.type == 'ACTIVITY_TYPE_ENROLL'"
          >
            <Select
              style="width: 250px"
              v-model="formData.lineFlag"
              :disabled="formData.method === 'ACTIVITY_MODE_ENROLL_INTEGRAL'"
            >
              <Option value="1">线上报名</Option>
              <Option value="0">线下报名</Option>
            </Select>
          </FormItem>
          <div v-if="formData.type !== 'ACTIVITY_TYPE_SERVICE'">
            <FormItem label="活动分类" prop="activityClassify">
              <Select style="width: 250px" v-model="formData.activityClassify">
                <Option
                  :value="item.id"
                  v-for="item in activityClassify"
                  :key="item.id"
                  >{{ item.labelName }}</Option
                >
              </Select>
              <span class="ml20 linkTxt" @click="AddTagShow = true"
                >添加分类</span
              >
            </FormItem>
          </div>
          <FormItem
            v-if="formData.type === 'ACTIVITY_TYPE_SERVICE'"
            label="活动分类"
            prop="activityClassify"
          >
            <span
              class="choice-tag"
              :class="formData.activityClassify == item.id ? 'active' : ''"
              v-for="item in activityClassify"
              :key="item.id"
              @click="
                () => {
                  formData.activityClassify = item.id
                }
              "
              >{{ item.labelName }}</span
            >
          </FormItem>
          <div>
            <FormItem label="所属场所" prop="activityName">
              <Input
                placeholder="请选择所属场所"
                readonly
                style="width: 250px"
                :disabled="keyContrll"
                :title="formData.activityName"
                clearable
                @on-clear="formData.resourceParams = activityIds = ''"
                v-model="formData.activityName"
                @on-focus="!keyContrll && showPlaceDialog()"
              />
            </FormItem>
          </div>
          <FormItem label="所属志愿团队" prop="voluntTeamName">
            <Input
              placeholder="请选择活动所属志愿团队，可多选"
              readonly
              style="width: 250px"
              :disabled="keyContrll"
              clearable
              :title="formData.voluntTeamName"
              @on-clear="formData.voluntTeamStr = ''"
              v-model="formData.voluntTeamName"
              @on-focus="!keyContrll && (voluntShow0 = true)"
            />
          </FormItem>
          <FormItem label="所属社团" prop="associationName">
            <Input
              placeholder="请选择活动所属社团，可多选"
              readonly
              style="width: 250px"
              clearable
              :title="formData.associationName"
              @on-clear="formData.associationStr = ''"
              v-model="formData.associationName"
              @on-focus="voluntShow1 = true"
            />
          </FormItem>

          <div class="tag-box">
            <FormItem label="活动标签" prop="tag">
              <tags
                resourceType="CONTENT_TYPE_ACTIVITY"
                labelType="ACTIVITY_LABEL"
                :defaultIds="formData.tag"
                @onChange="getTagIds"
              ></tags>
            </FormItem>
          </div>
          <!--<FormItem :label="formData.type == 'ACTIVITY_TYPE_ENROLL'?'报名日期':'活动日期'"-->

          <FormItem
            label="报名时间"
            required
            prop="signStartTime"
            v-if="formData.type == 'ACTIVITY_TYPE_ENROLL'"
          >
            <DatePicker
              :disabled="keyContrll"
              :value="[formData.signStartTime, formData.signEndTime]"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              @on-change="setSignTime"
              placeholder="请选择招募起始日期、时间"
              style="width: 300px"
            ></DatePicker>
          </FormItem>
          <div>
            <FormItem
              label="预约时间"
              prop="signStartTime"
              v-if="
                ['ACTIVITY_MODE_FREE', 'ACTIVITY_MODE_INTEGRAL'].includes(
                  formData.method
                )
              "
            >
              <DatePicker
                :disabled="keyContrll"
                :value="[formData.signStartTime, formData.signEndTime]"
                @on-change="setSignTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                placeholder="请选择活动预约的起始日期、时间"
                style="width: 300px"
              ></DatePicker>
            </FormItem>
          </div>
          <div>
            <FormItem label="活动时间" prop="useStartTime">
              <DatePicker
                :disabled="keyContrll"
                :value="[formData.useStartTime, formData.useEndTime]"
                @on-change="setActivityTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                placeholder="请选择活动起始日期、时间"
                style="width: 300px"
              ></DatePicker>
            </FormItem>
          </div>
          <!--<FormItem :label="formData.type == 'ACTIVITY_TYPE_ENROLL'?'报名时间':'活动时间'"-->
          <FormItem label="联系电话">
            <phone v-model="formData.phone" style="width:250px;"></phone>
          </FormItem>
          <FormItem label="活动地址" prop="address">
            <VDistpicker
              :default="formData.regionPath"
              @onChange="pickerChange"
            ></VDistpicker>
            <Input
              placeholder="请输入街道门牌号..."
              v-model="formData.address"
              style="width: 250px"
              class="ml20"
              :maxlength="50"
            />
          </FormItem>
          <FormItem v-if="hasMounted" prop="longitude">
            <Map
              :id="'map' + stamp"
              :lab="$route.query.method !== 'ACTIVITY_MODE_PLAIN'"
              :address="[formData.longitude, formData.latitude]"
              :region="formData.region"
              @getAddress="getAddress"
            ></Map>
          </FormItem>
          <!--<FormItem label="活动排序" v-if="$store.state.app.userInfo.dataType == 'SITE'">
                        <InputNumber :min="1" :max="999" v-model="formData.sort"
                                     style="width: 250px"></InputNumber>
          </FormItem>-->
          <!-- 普通活动 -->
          <!--<FormItem label="备注说明" v-if="formData.type == 'ACTIVITY_TYPE_PLAIN'">-->
          <!--<Input-->
          <!--type="textarea"-->
          <!--style="width: 250px;"-->
          <!--v-model="formData.remark"-->
          <!--:maxlength="200"-->
          <!--:autosize="{minRows: 5,maxRows: 10}"-->
          <!--placeholder="请输入活动参与成功需要注意的特殊信息，200字以内"-->
          <!--/>-->
          <!--</FormItem>-->

          <!--活动设置-->
          <div
            class="mt20"
            v-if="
              formData.type == 'ACTIVITY_TYPE_RESERVE' ||
                formData.type == 'ACTIVITY_TYPE_ENROLL'
            "
          >
            <p class="title-tool">
              <i class="cloud-icon">&#xe697;</i> 活动设置
            </p>
            <!-- 预订 -->
            <div
              class="add-content-detail-content"
              v-if="formData.type == 'ACTIVITY_TYPE_RESERVE'"
            >
              <FormItem
                v-if="siteInfo.creditStatus === 1"
                label
                prop="faithUseStatus"
                class="switch"
              >
                <div class="label">
                  <img src="@assets/image/credit.png" alt />诚信优享
                </div>
                <i-switch
                  v-model="formData.faithUseStatus"
                  true-color="#19BE6B"
                  size="large"
                >
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
                <span class="tip"
                  >（只有诚信分值达到设置标准的用户才能预订活动）</span
                >
                <transition name="ani1">
                  <div v-if="formData.faithUseStatus" class="num-box">
                    <span>用户诚信分值达</span>
                    <InputNumber
                      v-model="formData.faithUseValue"
                      class="input"
                      :max="9999"
                      :min="0"
                    ></InputNumber>
                    <span>分以上可预订</span>
                    <span
                      class="levels ml20 linkTxt"
                      @click="CreditLevelShow = true"
                      >用户诚信等级</span
                    >
                  </div>
                </transition>
              </FormItem>
              <FormItem label="活动库存" prop="stock">
                <InputNumber
                  v-model="formData.stock"
                  placeholder="请输入库存数"
                  :max="99999999"
                  style="width: 250px"
                ></InputNumber>
              </FormItem>
              <FormItem label="限购数量" prop="limitNum">
                <InputNumber
                  :min="0"
                  :max="formData.stock"
                  placeholder="请输入限购数量"
                  v-model="formData.limitNum"
                  style="width: 250px"
                ></InputNumber>
              </FormItem>
              <FormItem label="取消设置" prop="cancelStatus">
                <RadioGroup v-model="formData.cancelStatus">
                  <Radio label="0" :disabled="keyContrll">不可取消</Radio>
                  <Radio label="1" :disabled="keyContrll">随时取消</Radio>
                  <Radio label="2" :disabled="keyContrll"
                    >活动开始24小时前可取消</Radio
                  >
                  <Radio label="3" :disabled="keyContrll">
                    自定义可取消时间：活动开始
                    <Input
                      :disabled="keyContrll"
                      v-model="formData.cancelTime"
                      type="text"
                      style="width: 60px;"
                    />小时前可取消
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem
                label="所需积分"
                prop="integral"
                v-if="formData.method == 'ACTIVITY_MODE_INTEGRAL'"
              >
                <InputNumber
                  :min="1"
                  placeholder="请输入所需积分"
                  v-model="formData.integral"
                  style="width: 250px"
                ></InputNumber>
              </FormItem>
              <!--<FormItem label="备注说明">-->
              <!--<Input-->
              <!--type="textarea"-->
              <!--style="width: 250px;"-->
              <!--v-model="formData.remark"-->
              <!--:maxlength="200"-->
              <!--:autosize="{minRows: 5,maxRows: 10}"-->
              <!--placeholder="请输入活动参与成功需要注意的特殊信息，200字以内"-->
              <!--/>-->
              <!--</FormItem>-->
              <!--回显修改时不允许修改-->
              <FormItem label="在线选座">
                <Select
                  style="width: 250px"
                  v-model="formData.seatId"
                  :disabled="keyContrll"
                >
                  <Option value>请选择</Option>
                  <Option
                    v-for="item in checkSit"
                    :value="item.roomId"
                    :key="item.roomId"
                    >{{ item.name }}</Option
                  >
                </Select>
                <span class="ml20 check-sit linkTxt" @click="showSeatsTmpl()"
                  >查看座位模板</span
                >
              </FormItem>
              <FormItem label="核销设置" prop="validStartValue">
                <div class="clearfix valid-time-set">
                  <Input
                    :disabled="keyContrll"
                    v-model="formData.validStartValue"
                    style="width: 250px;margin-right: 20px;"
                    class="fl"
                  >
                    <span slot="prepend">预约开始时间前</span>
                    <Select
                      :disabled="keyContrll"
                      v-model="formData.validTimeStartType"
                      slot="append"
                      style="width: 70px"
                    >
                      <Option value="VALID_TIME_TYPE_HOURS">小时</Option>
                      <Option value="VALID_TIME_TYPE_MINUTE">分钟</Option>
                    </Select>
                  </Input>
                  <Input
                    :disabled="keyContrll"
                    v-model="formData.validEndValue"
                    style="width: 250px;"
                    class="fl"
                  >
                    <span slot="prepend">预约开始时间后</span>
                    <Select
                      :disabled="keyContrll"
                      v-model="formData.validTimeEndType"
                      slot="append"
                      style="width: 70px"
                    >
                      <Option value="VALID_TIME_TYPE_HOURS">小时</Option>
                      <Option value="VALID_TIME_TYPE_MINUTE">分钟</Option>
                    </Select>
                  </Input>
                </div>
              </FormItem>
            </div>
            <!-- 报名 -->
            <div
              class="add-content-detail-content"
              v-else-if="formData.type == 'ACTIVITY_TYPE_ENROLL'"
            >
              <FormItem
                v-if="siteInfo.creditStatus === 1 && formData.lineFlag == 1"
                label
                prop="faithUseStatus"
                class="switch"
              >
                <div class="label">
                  <img src="@assets/image/credit.png" alt />诚信优享
                </div>
                <i-switch
                  v-model="formData.faithUseStatus"
                  true-color="#19BE6B"
                  size="large"
                >
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </i-switch>
                <span class="tip"
                  >（只有诚信分值达到设置标准的用户才能预订活动）</span
                >
                <transition name="ani1">
                  <div v-if="formData.faithUseStatus" class="num-box">
                    <span>用户诚信分值达</span>
                    <InputNumber
                      v-model="formData.faithUseValue"
                      class="input"
                      :max="9999"
                      :min="0"
                    ></InputNumber>
                    <span>分以上可预订</span>
                    <span
                      class="levels ml20 linkTxt"
                      @click="CreditLevelShow = true"
                      >用户诚信等级</span
                    >
                  </div>
                </transition>
              </FormItem>
              <FormItem label="招募人数" prop="stock">
                <InputNumber
                  :min="0"
                  placeholder="请输入招募人数"
                  v-model="formData.stock"
                  style="width: 250px"
                ></InputNumber>
              </FormItem>
              <FormItem
                label="所需积分"
                prop="integral"
                v-if="formData.method == 'ACTIVITY_MODE_ENROLL_INTEGRAL'"
              >
                <InputNumber
                  :min="1"
                  placeholder="请输入所需积分"
                  v-model="formData.integral"
                  style="width: 250px"
                ></InputNumber>
              </FormItem>
              <FormItem
                label="取消设置"
                v-if="formData.lineFlag === '1'"
                prop="cancelStatus"
              >
                <RadioGroup v-model="formData.cancelStatus">
                  <Radio label="0" :disabled="keyContrll">不可取消</Radio>
                  <Radio label="1" :disabled="keyContrll">随时取消</Radio>
                  <Radio label="2" :disabled="keyContrll"
                    >活动开始24小时前可取消</Radio
                  >
                  <Radio label="3" :disabled="keyContrll">
                    自定义可取消时间：活动开始
                    <Input
                      :disabled="keyContrll"
                      v-model="formData.cancelTime"
                      type="text"
                      style="width: 60px;"
                    />小时前可取消
                  </Radio>
                </RadioGroup>
              </FormItem>
              <!--<FormItem label="备注说明">
                                <Input
                                        type="textarea"
                                        style="width: 250px;"
                                        v-model="formData.remark"
                                        :maxlength="200"
                                        :autosize="{minRows: 5,maxRows: 10}"
                                        placeholder="请输入活动参与成功需要注意的特殊信息，200字以内"
                                />
              </FormItem>-->
              <!--<FormItem label="在线选座">
                                &lt;!&ndash;回显修改时不允许修改&ndash;&gt;
                                &lt;!&ndash;@on-change="changeRoom"&ndash;&gt;
                                <Select style="width: 250px" v-model="formData.seatId" :disabled="keyContrll">
                                    <Option value>请选择</Option>
                                    <Option
                                            v-for="item in checkSit"
                                            :value="item.roomId"
                                            :key="item.roomId"
                                    >{{ item.name }}
                                    </Option>
                                </Select>
                                <span class="ml20 check-sit linkTxt"
                                      @click="showSeatsTmpl()">查看座位模板</span>
              </FormItem>-->
              <FormItem
                v-if="formData.lineFlag === '1'"
                label="核销设置"
                prop="validStartValue"
              >
                <div class="clearfix">
                  <Input
                    :disabled="keyContrll"
                    v-model="formData.validStartValue"
                    style="width: 250px;margin-right: 20px;"
                    class="fl"
                  >
                    <span slot="prepend">预约开始时间前</span>
                    <Select
                      :disabled="keyContrll"
                      v-model="formData.validTimeStartType"
                      slot="append"
                      style="width: 70px"
                    >
                      <Option value="VALID_TIME_TYPE_HOURS">小时</Option>
                      <Option value="VALID_TIME_TYPE_MINUTE">分钟</Option>
                    </Select>
                  </Input>
                  <Input
                    :disabled="keyContrll"
                    v-model="formData.validEndValue"
                    style="width: 250px;"
                    class="fl"
                  >
                    <span slot="prepend">预约开始时间后</span>
                    <Select
                      :disabled="keyContrll"
                      v-model="formData.validTimeEndType"
                      slot="append"
                      style="width: 70px"
                    >
                      <Option value="VALID_TIME_TYPE_HOURS">小时</Option>
                      <Option value="VALID_TIME_TYPE_MINUTE">分钟</Option>
                    </Select>
                  </Input>
                </div>
              </FormItem>
            </div>
          </div>

          <!--活动单位-->
          <div class="mt20">
            <p class="title-tool">
              <i class="cloud-icon">&#xe697;</i> 活动单位
            </p>
            <div class="add-content-detail-content">
              <FormItem label="主办单位" required prop="sponsor">
                <Input
                  v-model="formData.sponsor"
                  placeholder="请输入主办单位名称"
                  :maxlength="50"
                  style="width: 250px"
                />
              </FormItem>
              <FormItem label="协办单位">
                <Input
                  v-model="formData.coOrganizer"
                  placeholder="请输入协办单位名称"
                  :maxlength="50"
                  style="width: 250px"
                />
              </FormItem>
              <FormItem label="承办单位">
                <Input
                  v-model="formData.undertakeUnit"
                  placeholder="请输入承办单位名称"
                  :maxlength="50"
                  style="width: 250px"
                />
              </FormItem>
              <FormItem label="指导单位">
                <Input
                  v-model="formData.teachUnit"
                  placeholder="请输入指导单位名称"
                  :maxlength="50"
                  style="width: 250px"
                />
              </FormItem>
            </div>
          </div>

          <!--活动介绍-->
          <div class="mt20">
            <p class="title-tool">
              <i class="cloud-icon">&#xe697;</i> 活动介绍
            </p>
            <div class="add-content-detail-content">
              <!--<FormItem label="活动主图" class="checkboxStyle" prop="images">
                                <Upload limit="9" :defaultImage="formData.images"
                                        @getImagesList="getImagesList"></Upload>
              </FormItem>-->
              <FormItem>
                <UploadImg2
                  :defaultImage="defaultImage"
                  @getImagesList="getImagesList"
                  :limit="9"
                ></UploadImg2>
                <FormItem
                  label="活动主图"
                  class="activity-img"
                  prop="images"
                ></FormItem>
              </FormItem>
              <FormItem label="活动介绍" required prop="introduce">
                <div class="uedit">
                  <Ueditor v-model="formData.introduce" id="uedit1"></Ueditor>
                </div>
              </FormItem>
              <FormItem label="温馨提示">
                <div class="uedit">
                  <Ueditor v-model="formData.hint" id="uedit2"></Ueditor>
                </div>
              </FormItem>
            </div>
          </div>
          <FormItem>
            <Button type="primary" @click="activitySaveStatus1">保存</Button>
            <Button
              type="primary"
              style="margin-left: 8px"
              v-if="showDraft"
              @click="activitySaveStatus2"
              >存草稿</Button
            >
            <Button style="margin-left: 8px" @click="goBack">返回</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <uninPlace
      :show="place"
      :orgId="formData.createCompany"
      :defaultChoose="getPlaceIds"
      @onOkClick="onOkClick"
      @onClose="place = false"
    ></uninPlace>
    <!--座位模板弹窗-->
    <seatTemplate
      :show="templateShow"
      :data="templateData"
      state="view"
      @onClose="templateShow = false"
    ></seatTemplate>
    <Voluntteam
      :show="voluntShow0"
      :selectIds="voluntIds"
      @onClose="voluntShow0 = false"
      @onOkClick="getVolunt"
      :type="0"
    ></Voluntteam>
    <Voluntteam
      :show="voluntShow1"
      :selectIds="associatioIds"
      @onClose="voluntShow1 = false"
      @onOkClick="getAssociation"
      :type="1"
    ></Voluntteam>
    <CreditLevel
      :show="CreditLevelShow"
      @close="CreditLevelShow = false"
    ></CreditLevel>
    <AddTag
      v-model="AddTagShow"
      @getTag="item => activityClassify.push(item)"
    ></AddTag>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import { mount } from '@vue/test-utils'
import BaseTable from '@components/baseTable/baseTable.vue'
import Map from '@components/map/marker.vue'
import Ueditor from '@components/ueditor/ueditor.vue'
import Upload from '@components/upload/upload-image.vue'
import uninPlace from '@components/uninPlace/uninPlace.vue'
import Voluntteam from '@components/pop/volunt-team.vue'
import UploadImg2 from '@components/upload/upload-image2.vue'
import CreditLevel from '@components/pop/credit-level.vue'
// import AddTag from "@components/add-activityclass/index.vue";
import AddTag from './addTag.vue'

// import phone from "@components/unNecessaryPhoneInput/unNecessaryPhoneInput.vue";
import tags from '@components/tags/tags.vue'
import VDistpicker from '@components/distPicker/distPicker.vue'
import seatTemplate from '@components/seatTemplate/seatTemplate.vue'
import {
  getActivityRoomList,
  activitySave,
  getActivityDetial
} from '@service/activity'
import { getTagsSelect } from '@service/common'
import { createrList } from '@service/content'
import { getParentsRegion, getStatusTxt } from '@util/comm'

@Component({
  components: {
    BaseTable,
    Map,
    Ueditor,
    Upload,
    uninPlace,
    tags,
    VDistpicker,
    seatTemplate,
    UploadImg2,
    Voluntteam,
    CreditLevel,
    AddTag
    // phone
  }
})
export default class FreeBooking extends Vue {
  private getStatusTxt = getStatusTxt
  private stamp: number = new Date().getTime()
  private hasMounted: boolean = false
  private isSite = this.$store.state.app.userInfo.dataType === 'SITE'
  private siteInfo = this.$store.state.app.siteInfo
  //座位模板弹窗是否显示
  private templateShow: boolean = false
  //等级弹窗显示布尔值
  private CreditLevelShow: boolean = false
  //添加活动分类弹窗显示布尔值
  private AddTagShow: boolean = false
  //查看模板
  private templateData: { [propName: string]: any } = {
    resourceType: '', //活动室资源类型
    resourceId: '', //活动室资源id
    activityId: '' //活动id
  }

  // 报名时间
  private setSignTime(time: Array<string>) {
    this.formData.signStartTime = time[0] ? time[0] + ':00' : ''
    this.formData.signEndTime = time[1] ? time[1] + ':00' : ''
    ;(this.$refs.formData as any).validateField('signStartTime')
  }
  // 活动时间
  private setActivityTime(time: Array<string>) {
    this.formData.useStartTime = time[0] ? time[0] + ':00' : ''
    this.formData.useEndTime = time[1] ? time[1] + ':00' : ''
    ;(this.$refs.formData as any).validateField('useStartTime')
  }

  private voluntShow0: boolean = false
  private voluntShow1: boolean = false
  // 志愿团回显
  get voluntIds() {
    return this.formData.voluntTeamStr.split(',')
  }
  // 社团回显
  get associatioIds() {
    return this.formData.associationStr.split(',')
  }
  // 获取志愿团list
  private getVolunt(list: Array<{ name: string; id: any }>) {
    let names = this.formData.voluntTeamName
      ? this.formData.voluntTeamName.split(',')
      : []
    let ids = this.formData.voluntTeamStr
      ? this.formData.voluntTeamStr.split(',')
      : []
    list.forEach((item: { name: string; id: any }) => {
      if (!ids.includes(String(item.id))) {
        names.push(item.name)
        ids.push(item.id)
      }
    })
    this.formData.voluntTeamName = names.toString()
    this.formData.voluntTeamStr = ids.toString()
  }
  // 获取社团list
  private getAssociation(list: Array<{ name: string; id: any }>) {
    let names = this.formData.associationName
      ? this.formData.associationName.split(',')
      : []
    let ids = this.formData.associationStr
      ? this.formData.associationStr.split(',')
      : []
    list.forEach((item: { name: string; id: any }) => {
      if (!ids.includes(String(item.id))) {
        names.push(item.name)
        ids.push(item.id)
      }
    })
    this.formData.associationName = names.toString()
    this.formData.associationStr = ids.toString()
  }

  /* S 关联场所弹窗 */
  private place = false
  private showPlaceDialog() {
    this.place = true
  }
  private activityIds: string = '' // 活动场所ids
  private onOkClick(list: Array<any>) {
    let txt = this.formData.activityName
        ? this.formData.activityName.split(',')
        : [],
      ids = this.activityIds ? this.activityIds.split(',') : [],
      resource = this.formData.resourceParams
        ? JSON.parse(this.formData.resourceParams)
        : []
    list.forEach((item: any) => {
      // 过滤已有项
      if (
        !resource.some(
          (d: any) =>
            d.resourceId === item.id && d.resourceType === item.resourceType
        )
      ) {
        txt.push(item.name)
        ids.push(item.id)
        resource.push({
          resourceType: item.resourceType,
          resourceId: item.id
        })
      }
    })
    this.formData.activityName = txt.toString()
    this.activityIds = ids.toString()
    this.formData.resourceParams = JSON.stringify(resource)
  }
  @Watch('activityIds')
  wActivityIds(v: any) {
    // 查询活动室
    this.getActivityRoom()
  }
  /* E 关联场所弹窗 */
  // 创建者下拉匹配框数据
  private siteList: any = []
  private getcreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.siteList = res.datas
      }
    })
  }
  //表单
  private formData: any = {
    id: '',
    status: 1, // 状态，存草稿时 为3
    type: '', //活动类型
    method: '', // 活动方式
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    name: '', // 活动名称
    activityClassify: '', // 活动分类
    activityName: '', // 所属场所校验字段
    resourceParams: '', // 资源类型数据-活动场所
    tag: '', // 标签
    phone: '', // 联系电话
    region: '', // 地区编码
    regionPath: '', // 地区编码路径
    address: '', // 活动地址
    longitude: '', // 活动经度
    latitude: '', // 活动维度
    // sort: undefined, // 活动排序
    stock: 1, // 活动库存 招募人数
    limitNum: 1, // 活动限购数量
    integral: 1, // 所需积分
    remark: '', // 备注说明
    sponsor: '', // 主办单位
    coOrganizer: '', // 协办单位
    undertakeUnit: '', // 承办单位
    images: '', // 活动主图
    introduce: '', // 活动介绍
    hint: '', // 温馨提示
    seatId: '', // 活动室id
    lineFlag: '1', // 活动室id
    voluntTeamStr: '',
    associationStr: '',
    voluntTeamName: '',
    associationName: '',
    useEndTime: '',
    useStartTime: '',
    signStartTime: '',
    signEndTime: '',
    cancelStatus: '',
    cancelTime: '',
    validTimeStartType: 'VALID_TIME_TYPE_HOURS',
    validStartValue: '',
    validEndValue: '',
    validTimeEndType: 'VALID_TIME_TYPE_HOURS',
    faithUseStatus: false, // 诚信优享
    faithUseValue: 500, // 诚信优享
    teachUnit: '', //
  }
  // 是否显示保存草稿
  get showDraft() {
    return (
      !Boolean(this.formData.id) || [3].includes(this.formData.status)
    )
  }
  // 创建者变化时
  private createCompanyChange() {
    Object.assign(this.formData, { activityName: '', resourceParams: '' })
  }
  // 回显修改的时候，部分字段不嫩修改 0可以修改， 1不能修改
  private modKeyControll: number = 0
  // 控制字段是否能编辑
  get keyContrll() {
    // keyContrll:true表示不能修改
    return Boolean(this.formData.id) && Boolean(this.modKeyControll)
  }
  mounted() {
    this.formData.type = this.$route.query.classify || ''
    this.formData.method = this.$route.query.method || ''
    this.formData.id = this.$route.query.id || ''
    this.formData.auditFlag = this.$route.query.auditFlag || '' // 保存审核内容时 传1
    this.getActivityClassify()
    this.getcreaterList()
    // 编辑时数据回显
    if (this.formData.id) {
      this.getActivityDetial()
    }
    this.hasMounted = true
  }

  // pop资源弹窗回显的
  get getPlaceIds() {
    let res = []
    if (this.formData.resourceParams && this.formData.resourceParams.length) {
      res = JSON.parse(this.formData.resourceParams).map((item: any) => ({
        resourceType: item.resourceType,
        id: item.resourceId
      }))
    }
    return res
  }
  // 回显图片
  private defaultImage: Array<any> = []
  // 获取详情
  private getActivityDetial() {
    let _this = this
    getActivityDetial({ id: this.formData.id }).then((res: any) => {
      if (res.code === 0) {
        if (typeof res.data.lineFlag === 'number') res.data.lineFlag += ''
        // res.data.sort = Number(res.data.sort)
        res.data.faithUseStatus = Boolean(res.data.faithUseStatus)
        if (typeof res.data.cancelStatus === 'number')
          res.data.cancelStatus += ''
        Object.assign(_this.formData, res.data)
        this.modKeyControll = res.data.orderCount
        if (this.formData.activityClassifyName.length === 0) {
          this.formData.activityClassify = ''
        }
        let venues = res.data.resourceParams
        if (venues && JSON.parse(venues).length) {
          getActivityRoomList({
            ids: JSON.parse(venues)
              .map((item: any) => item.resourceId)
              .join(',')
          }).then((res: any) => {
            this.checkSit = res.datas
          })
        }
        if (this.formData.images) {
          this.defaultImage = this.formData.images
            .split(',')
            .map((img: any, i: number) => ({
              id: 'id-' + i,
              url: img
            }))
        }
      }
    })
  }

  // 直接保存
  private activitySaveStatus1() {
    this.formData.status = 1
    this.activitySave()
  }

  // 存草稿
  private activitySaveStatus2() {
    this.formData.status = 3
    this.activitySave()
  }

  // 返回
  private goBack() {
    this.$router.go(-1)
  }

  // 保存
  private activitySave() {
    (this.$refs.formData as any).validate((valid: any) => {
      if (valid) {
        let saveData = this.formData
        if (
          this.formData.lineFlag === '0' &&
          (this.formData.method === 'ACTIVITY_MODE_ENROLL_FREE' ||
            this.formData.method === 'ACTIVITY_MODE_ENROLL_INTEGRAL')
        ) {
          // 线下报名活动
          saveData.validStartValue = ''
          saveData.validEndValue = ''
          saveData.cancelStatus = ''
        }
        saveData.faithUseStatus = Number(saveData.faithUseStatus)
        if (this.siteInfo.creditStatus !== 1) {
          // 未开启诚信体系
          saveData.faithUseStatus = undefined
          saveData.faithUseValue = undefined
        }
        activitySave(saveData).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success('保存成功!')
            if (this.formData.id) {
              this.$router.go(-1)
            } else {
              this.$router.push({ path: '/ac-list' })
            }
          }
        })
      } else {
        this.$Message.error('请将信息填写完整!')
      }
    })
  }

  created() {
    if (this.$route.query.classify === 'ACTIVITY_TYPE_PLAIN') {
      this.ruleValidate.activityName = []
      this.ruleValidate.activityClassify = []
      this.ruleValidate.address = []
    }
    if (
      ['ACTIVITY_MODE_FREE', 'ACTIVITY_MODE_INTEGRAL'].includes(
        this.$route.query.method as string
      )
    ) {
      this.ruleValidate.signStartTime.push({
        validator: this.validSignTime,
        message:
          '可预约的开始时间必须早于或等于活动开始的时间，可预约的结束时间必须早于或等于活动结束的时间',
        trigger: 'change'
      })
      this.ruleValidate.useStartTime.push({
        validator: this.validSignTime,
        message:
          '可预约的开始时间必须早于或等于活动开始的时间，可预约的结束时间必须早于或等于活动结束的时间',
        trigger: 'change'
      })
    }
  }
  // 验证预约时间是否符合活动时间
  private validSignTime(rule: any, value: any, callback: Function) {
    if (this.formData.signStartTime && this.formData.useStartTime) {
      if (
        this.formData.signStartTime > this.formData.useStartTime ||
        this.formData.signEndTime > this.formData.useEndTime
      ) {
        return callback(new Error())
      }
    }
    callback()
  }
  // 表单验证
  private ruleValidate = <any>{
    name: [
      { required: true, message: '请将信息填写完整', trigger: 'blur' },
      { type: 'string', max: 50, message: '最多输入50个字符' }
    ],
    activityClassify: [
      {
        required: true,
        message: '请将信息填写完整',
        trigger: 'change',
        validator: this.checkedCreateCompany
      }
    ],
    activityName: [
      { required: true, message: '请将信息填写完整', trigger: 'change|blur' }
    ],
    tag: [{ required: true, message: '请将信息填写完整' }],
    address: [
      { required: true, message: '请将信息填写完整', trigger: 'blur' },
      { validator: this.checkRegion, message: '请选择地区', trigger: 'blur' }
    ],
    stock: [
      { required: true, message: '请将信息填写完整' }, 
      { message: '只能输入1-99999999之间的整数', trigger: 'change', pattern:/^\d{1,8}$/ }
    ],
    limitNum: [
      { required: true, message: '请将信息填写完整' }, 
      { message: '只能输入1-99999999之间的整数', trigger: 'change', pattern:/^\d{1,8}$/}
    ],
    integral: [
      { required: true, message: '请将信息填写完整' }, 
      { message: '只能输入1-99999999之间的整数', trigger: 'change', pattern:/^\d{1,8}$/}
    ],
    images: [{ required: true, message: '请将信息填写完整', trigger: 'blur' }],
    sponsor: [{ required: true, message: '请将信息填写完整', trigger: 'blur' }],
    introduce: [{ required: true, message: '请将信息填写完整' }],
    cancelStatus: [
      { required: true, message: '请将信息填写完整' },
      {
        validator: this.checkCancel,
        message: '请设置多少小时内',
        trigger: 'change'
      }
    ],
    validStartValue: [
      { validator: this.validNum, message: '', trigger: 'blur' }
    ],
    useStartTime: [
      { required: true, message: '请将信息填写完整', trigger: 'change' }
    ],
    useEndTime: [
      { required: true, message: '请将信息填写完整', trigger: 'change' }
    ],
    signStartTime: [
      { required: true, message: '请将信息填写完整', trigger: 'change' }
    ],
    signEndTime: [
      { required: true, message: '请将信息填写完整', trigger: 'change' }
    ],
    faithUseStatus: [
      {
        validator: this.validFaithUse,
        message: '请设置分值',
        trigger: 'change'
      }
    ]
  }
  // 验证诚信优享分值
  private validFaithUse(rule: any, value: any, callback: Function) {
    if (this.formData.faithUseStatus && !this.formData.faithUseValue) {
      return callback(new Error('请设置分值'))
    }
    callback()
  }

  // 检查自定义时间
  private checkCancel(rule: any, value: any, callback: Function) {
    if (this.formData.cancelStatus == 3 && !this.formData.cancelTime) {
      return callback(new Error('请输入小时数'))
    }
    if (this.formData.cancelStatus != 3) {
      this.formData.cancelTime = ''
    }
    callback()
  }
  // 检查核销时间设置
  private validNum(rule: any, value: any, callback: Function) {
    let start = String(this.formData.validStartValue).trim()
    if (/^[1-9]\d*$/.test(start)) {
      if (parseFloat(start) > 9999) {
        return callback(new Error('请填写0-9999的整数'))
      }
    } else if (start) {
      return callback(new Error('请填写大于0的整数'))
    }

    let end = String(this.formData.validEndValue).trim()
    if (/^[1-9]\d*$/.test(end)) {
      if (parseFloat(end) > 9999) {
        return callback(new Error('请填写0-9999的整数'))
      }
    } else if (end) {
      return callback(new Error('请填写大于0的整数'))
    }
    //            let reg = /(([^0]\d+\.\d+$)|([1-9]+$)|(0\.\d+$))/ // 数字验证 比如：10.15 120 0.2611

    /*开始时间*/
    /*let r1 = reg.test(this.formData.validStartValue.trim())
             if (r1) { // 通过数字验证
             if (parseFloat(this.formData.validStartValue.trim()) > 9999) {
             return callback(new Error("请填写0-9999的数字"));
             } else if (this.formData.validStartValue.trim().indexOf('.') > -1) {
             if (this.formData.validStartValue.trim().split('.')[1].length > 2) {
             return callback(new Error("最小精确到0.01"));
             }
             }
             } else if (this.formData.validStartValue.trim()){
             return callback(new Error("请填写大于0的数字"));
             }*/
    /*结束时间*/
    /*let r2 = reg.test(this.formData.validEndValue.trim())
             if (r2) { // 通过数字验证
             if (parseFloat(this.formData.validEndValue.trim()) > 9999) {
             return callback(new Error("请填写0-9999的数字"));
             } else if (this.formData.validEndValue.trim().indexOf('.') > -1) {
             if (this.formData.validEndValue.trim().split('.')[1].length > 2) {
             return callback(new Error("最小精确到0.01"));
             }
             }
             } else if (this.formData.validEndValue.trim()){
             return callback(new Error("请填写大于0的数字"));
             }*/

    this.formData.validStartValue = start
    this.formData.validEndValue = end
    callback() // 直接过
  }
  // 检查地区选择
  private checkRegion(rule: any, value: any, callback: Function) {
    if (!this.formData.region) {
      return callback(new Error('请将信息填写完整'))
    }
    callback()
  }

  // 单独校验 活动分类
  // private setCom() {
  //     (this.$refs.formData as any).validateField("activityClassify");
  // }

  private checkedCreateCompany(rule: any, value: any, callback: any) {
    if (!this.formData.activityClassify) {
      return callback(new Error('请将信息填写完整'))
    }
    callback()
  }

  // 活动分类
  private activityClassify: Array<any> = []

  private getActivityClassify() {
    let params: any = {}
    if (this.formData.type !== 'ACTIVITY_TYPE_SERVICE') {
      params = {
        resourceType: 'CONTENT_TYPE_ACTIVITY',
        labelType: 'ACTIVITY_CLASSIFY'
      }
    } else {
      params = {
        resourceType: 'CONTENT_TYPE_ACTIVITY',
        labelType: 'ACTIVITY_CLASSIFY',
        activityType: 'ACTIVITY_TYPE_SERVICE'
      }
    }
    getTagsSelect(params).then((res: any) => {
      if (res.code === 0) {
        this.activityClassify = res.datas.filter(
          (data: any) => data.labelName !== '志愿服务'
        )
      }
    })
  }
  // 标签值改变
  private getTagIds(ids: string) {
    this.formData.tag = ids
  }

  // 获取活动地点经纬度
  private getAddress(e: any) {
    this.formData.longitude = e.lnglat.lng
    this.formData.latitude = e.lnglat.lat
  }

  // 地区region改变
  private pickerChange(e: any) {
    this.formData.region = e.region
  }

  /* S 活动室 */
  // 活动室列表
  private checkSit: any = []

  private getActivityRoom() {
    if (this.activityIds) {
      getActivityRoomList({ ids: this.activityIds }).then((res: any) => {
        this.checkSit = res.datas
        this.formData.seatId = ''
      })
    } else {
      this.checkSit = []
      this.formData.seatId = ''
    }
  }

  // 切换活动室
  private changeRoom(value: any) {
    this.formData.roomId = value
  }

  // 查看座位模板
  showSeatsTmpl() {
    if (this.formData.seatId) {
      this.templateData = this.checkSit.filter(
        (item: any) => item.roomId === this.formData.seatId
      )[0]
      this.templateData.resourceId = this.templateData.roomId
      this.templateData.resourceType = 'CONTENT_TYPE_ACTIVITY_SHIU'
      this.templateData.activityId = this.$route.query.id || ''
      this.templateShow = true
    } else {
      this.$Message.info('请先选择所属场所，再选择在线选座，最后查看座位模板！')
    }
  }

  /* E 活动室 */
  // 选择图片
  private getImagesList(list: Array<{ url: string }>) {
    this.formData.images = list.map((data: any) => data.url).toString()
  }
}
</script>

<style lang="scss">
/*志愿页编辑页样式*/
.page-activity-add {
  .activity-img {
    margin: 0 !important;
    .ivu-form-item-label {
      position: absolute;
      left: -100px;
      top: 0;
    }
  }
  .tag-box {
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
    .ivu-form-item-content {
      line-height: 0;
    }
  }
  .valid-time-set {
    .ivu-select-dropdown {
      right: 0 !important;
      left: auto !important;
    }
  }
}
</style>
<style lang="scss" scoped>
// 进度条
.header-goods {
  max-width: 1100px;
  overflow: hidden;
  background: $bg01;
  padding: 20px 0 0 0;
  font-size: 0;
  li {
    position: relative;
    width: 50%;
    float: left;
    font-size: 16px;
    color: #595961;
    height: 45px;
    line-height: 45px;
    background: #f2f2f6;
    .demo1 {
      width: 0;
      height: 0;
      /*overflow: hidden;*/
      font-size: 0;
      position: absolute;
      right: -24px;
      border-top: 23px solid #f2f2f6;
      border-right: 23px solid #f2f2f6;
      border-bottom: 22px solid #f2f2f6;
      border-left: 40px solid $bg01;
      z-index: 1;
      &:after {
        content: '';
        position: absolute;
        left: -47px;
        top: -24px;
        width: 7px;
        height: 46px;
        background: #fff;
      }
    }
    .demo2 {
      width: 0;
      height: 0;
      /*overflow: hidden;*/
      font-size: 0;
      position: absolute;
      right: -17px;
      border-top: 23px solid transparent;
      border-right: 23px solid transparent;
      border-bottom: 22px solid transparent;
      border-left: 40px solid #f2f2f6;
      z-index: 2;
    }
    span:last-child {
      position: relative;
      left: 40%;
    }
    &:nth-child(2) {
      /*margin-left: -46px;*/
      background-color: #6ed35e;
      color: #fff;
      .demo2 {
        right: -23px;
        border-color: #fff;
        border-left-color: #6ed35e;
      }
    }
    .noBorder {
      border-bottom: 24px solid $bg01 !important;
      border-left: 25px solid $bg01;
    }
    .noRightM {
      /*right: 2px!important;*/
    }
    &.active {
      height: 51px;
      line-height: 51px;
      background: #6ed35e;
      color: $bg01;
      border: 3px solid $bg01;
      border-right: none;
      border-left: none;
      margin-top: -3px;
      position: relative;
      .demo1 {
        border-top: 23px solid #6ed35e;
        border-right: 23px solid #6ed35e;
        border-bottom: 22px solid #6ed35e;
        border-left: 40px solid $bg01;
      }
      .demo2 {
        border-top: 23px solid transparent;
        border-right: 23px solid transparent;
        border-bottom: 22px solid transparent;
        border-left: 40px solid #6ed35e;
      }
    }
    .hasNo {
      border-top: 23px solid #6ed35e !important;
      border-right: 23px solid #6ed35e !important;
      border-bottom: 22px solid #6ed35e !important;
      border-left: 40px solid $bg01;
    }
    .hasWirte,
    .noBorder {
      border-top: 23px solid #6ed35e !important;
      border-right: 23px solid #6ed35e !important;
      right: 0 !important;
    }
  }
}
@-webkit-keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    -webkit-transform: translate3d(3000px, 0, 0);
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(-25px, 0, 0);
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }

  90% {
    -webkit-transform: translate3d(-5px, 0, 0);
    transform: translate3d(-5px, 0, 0);
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
@keyframes bounceInRight {
  0%,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    -webkit-transform: translate3d(3000px, 0, 0);
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(-25px, 0, 0);
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }

  90% {
    -webkit-transform: translate3d(-5px, 0, 0);
    transform: translate3d(-5px, 0, 0);
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
.ani1-enter-active {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: bounceInRight;
  animation-name: bounceInRight;
}

@-webkit-keyframes fadeOutDown {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes fadeOutDown {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }
}
.ani1-leave-active {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: fadeOutDown;
  animation-name: fadeOutDown;
}
//基本信息
.title-tool {
  position: relative;
  width: 100%;
  line-height: 16px;
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
  i {
    position: absolute;
    top: 0;
    left: -8px;
    font-size: 20px;
    color: $theme;
  }
}

.tip {
  color: #ff6600;
}

.switch {
  position: relative;
  .label {
    position: absolute;
    left: -84px;
    top: 0;
    color: #19be6b;
    font-weight: bold;
    height: 32px;
    img {
      width: 22px;
      height: 21px;
      margin-right: 2px;
      position: relative;
      top: 6px;
    }
  }
  .num-box {
    .input {
      margin: 0 5px;
    }
  }
}

.add-content-detail-title {
  padding: 0 20px;
  .add-content-detail-content {
    padding: 10px 0;
    border-top: 1px solid #dedede;
    .linkTxt {
      color: $theme;
      cursor: pointer;
    }
    .ivu-form-item {
      margin: 20px 0 15px 0;
    }
    .ivu-select-multiple .ivu-tag {
      padding: 0 14px !important;
    }
    .prompt {
      font-size: $f12;
      color: #ccc;
    }
    .tags {
      width: 87px;
      height: 32px;
      color: $theme;
      background: $grayDark;
      border: 1px solid $theme;
      display: block;
      float: left;
      margin-right: 15px;
      text-align: center;
      border-radius: 5px;
    }
    .ivu-btn-dashed {
      width: 87px;
      height: 32px;
      color: $bg01;
      background: $theme;
      border: 1px solid $theme;
    }
    .uedit {
      position: relative;
      z-index: 1;
    }
    .check-sit {
      cursor: pointer;
    }
  }
}

.topic {
  width: 100%;
}

.title {
  width: 100%;
  height: 30px;
  background: #f2f4f7;
  margin: 15px 0;
  text-align: center;
  line-height: 30px;
  border-radius: 0 0 30px 30px;
}

.sit-list {
  width: 725px;
  margin: 5px auto;
  text-align: center;
  line-height: 24px;
  .sit-l {
    width: 24px;
    height: 24px;
    background: #ccc;
  }
  .sit-r {
    margin-left: 40px;
    .sit-item {
      display: block;
      width: 25px;
      height: 24px;
      margin-right: 5px;
      background: #ccc;
      background: url(./../../../../assets/image/sitBg.png);
      &.curr {
        background: url(./../../../../assets/image/sitNoBg.png) !important;
      }
    }
  }
}

.info-list {
  .img {
    margin: 10px 0;
  }
}
</style>
