<template>
  <!-- 场所 - 场馆预约-->
  <div class="container venues-reserve">
    <Head class="" resourceType="CONTENT_TYPE_VENUE"></Head>
    <Form ref="params" :label-width="120" :model="params" :rules="ruleValidate">
      <!--tab切换-->
      <Tabs
        active-key="key1"
        class="tab-wrap mt20"
        :animated="false"
        type="line"
      >
        <!--场馆预约设置-->
        <Tab-pane label="场馆预约设置" key="key1">
          <FormItem label="预约状态：" prop="orderStatus" class="mt20">
            <RadioGroup v-model="params.orderStatus">
              <Radio :label="1">
                <span>开启</span>
              </Radio>
              <Radio :label="0">
                <span>不开启</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <div v-if="params.orderStatus == 1">
            <FormItem
              label="可预约时间："
              prop="orderTimeType"
              class="mt20 choice-rule"
            >
              <RadioGroup
                v-model="params.orderTimeType"
                @on-change="getOrderTimeType"
              >
                <Radio label="ALL_YEAR_ORDER">
                  <span>全年</span>
                </Radio>
                <Radio label="USE_SEASON_ORDER">
                  <span>按季节</span>
                </Radio>
                <Radio label="PEAK_SEASON_ORDER">
                  <span>按淡旺季</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <div class="block-box">
              <!-- 全年 -->
              <div
                class="all-year"
                v-if="params.orderTimeType == 'ALL_YEAR_ORDER'"
              >
                <FormItem label="可预约日期：" prop="orderDate">
                  <div class="date-wrap">
                    <Input
                      class="control"
                      placeholder="选择可预约日期"
                      readonly
                      :value="
                        list1.orderDateStart && list1.orderDateEnd
                          ? `${list1.orderDateStart} 至 ${list1.orderDateEnd}`
                          : ''
                      "
                    />
                    <DatePicker
                      class="date"
                      type="daterange"
                      :editable="false"
                      :clearable="false"
                      separator=" 至 "
                      @on-change="
                        date => {
                          list1.orderDateStart = date[0].substr(
                            5,
                            date[0].length - 1
                          )
                          list1.orderDateEnd = date[1].substr(
                            5,
                            date[1].length - 1
                          )
                        }
                      "
                      :value="[
                        '2020-' + list1.orderDateStart,
                        '2020-' + list1.orderDateEnd
                      ]"
                      placeholder="选择可预约日期"
                      placement="bottom-start"
                    ></DatePicker>
                  </div>
                </FormItem>
                <FormItem label="可预约时段：" prop="orderTime" class="mt20">
                  <div class="date-item" v-for="(item, index) in list1.time">
                    <!-- 修改有提示 -->
                    <Poptip
                      content="修改会影响已预约订单，请及时电话告知用户相关变动"
                      placement="right"
                      trigger="focus"
                      v-if="params.id"
                    >
                      <TimePicker
                        type="timerange"
                        class="time"
                        format="HH:mm"
                        :editable="false"
                        :clearable="false"
                        placement="bottom-start"
                        placeholder="请选择时间段"
                        v-model="list1.time[index]"
                        @on-clear="$refs.params.validateField('orderTime')"
                      ></TimePicker>
                    </Poptip>
                    <!-- 新增无提示 -->
                    <TimePicker
                      v-if="!params.id"
                      type="timerange"
                      class="time"
                      format="HH:mm"
                      :editable="false"
                      :clearable="false"
                      placement="bottom-start"
                      placeholder="请选择时间段"
                      v-model="list1.time[index]"
                      @on-clear="$refs.params.validateField('orderTime')"
                    ></TimePicker>
                    <!-- <span
                      @click.stop="deleteLine('list1', index)"
                      v-if="index == list1.time.length - 1"
                      class="cloud-icon opera minus"
                      >&#xe65d;</span
                    >
                    <span
                      @click.stop="addLine('list1', index)"
                      class="cloud-icon opera add"
                      >&#xe604;</span
                    > -->
                  </div>
                </FormItem>
                <FormItem label="备注信息：">
                  <Input
                    class="control"
                    v-model="list1.remark"
                    placeholder="请输入备注信息，如什么时段不可预约入场"
                    :maxlength="50"
                  />
                </FormItem>
              </div>
              <!-- 按季节 -->
              <div
                class="items"
                v-if="params.orderTimeType == 'USE_SEASON_ORDER'"
              >
                <!-- 夏季 -->
                <div class="border">
                  <FormItem label="夏季可预约日期：" prop="orderDate">
                    <div class="date-wrap">
                      <Input
                        class="control"
                        placeholder="选择可预约日期"
                        readonly
                        :value="
                          list1.orderDateStart && list1.orderDateEnd
                            ? `${list1.orderDateStart} 至 ${list1.orderDateEnd}`
                            : ''
                        "
                      />
                      <DatePicker
                        class="date"
                        type="daterange"
                        :editable="false"
                        :clearable="false"
                        separator=" 至 "
                        @on-change="
                          date => {
                            list1.orderDateStart = date[0].substr(
                              5,
                              date[0].length - 1
                            )
                            list1.orderDateEnd = date[1].substr(
                              5,
                              date[1].length - 1
                            )
                          }
                        "
                        :value="[
                          '2020-' + list1.orderDateStart,
                          '2020-' + list1.orderDateEnd
                        ]"
                        placeholder="选择可预约日期"
                        placement="bottom-start"
                      ></DatePicker>
                    </div>
                  </FormItem>
                  <FormItem label="可预约时段：" class="mt20" prop="orderTime">
                    <div class="date-item" v-for="(item, index) in list1.time">
                      <!-- 修改有提示 -->
                      <Poptip
                        content="修改会影响已预约订单，请及时电话告知用户相关变动"
                        placement="right"
                        trigger="focus"
                        v-if="params.id"
                      >
                        <TimePicker
                          type="timerange"
                          class="time"
                          format="HH:mm"
                          :editable="false"
                          :clearable="false"
                          confirm
                          v-model="list1.time[index]"
                          placement="bottom-start"
                          placeholder="请选择时间段"
                          @on-clear="$refs.params.validateField('orderTime')"
                        ></TimePicker>
                      </Poptip>
                      <!-- 新增无提示 -->
                      <TimePicker
                        v-if="!params.id"
                        type="timerange"
                        class="time"
                        format="HH:mm"
                        :editable="false"
                        :clearable="false"
                        confirm
                        v-model="list1.time[index]"
                        placement="bottom-start"
                        placeholder="请选择时间段"
                        @on-clear="$refs.params.validateField('orderTime')"
                      ></TimePicker>
                      <!-- <span
                        class="cloud-icon opera minus"
                        @click.stop="deleteLine('list1', index)"
                        v-if="index == list1.time.length - 1"
                        >&#xe65d;</span
                      >
                      <span
                        class="cloud-icon opera add"
                        @click.stop="addLine('list1', index)"
                        >&#xe604;</span
                      > -->
                    </div>
                  </FormItem>
                  <FormItem label="备注信息：">
                    <Input
                      class="control"
                      placeholder="请输入备注信息，如什么时段不可预约入场"
                      :maxlength="50"
                      v-model="list1.remark"
                    />
                  </FormItem>
                </div>
                <!-- 冬季 -->
                <div class="mt20">
                  <FormItem label="冬季可预约日期：" prop="orderDate">
                    <div class="date-wrap">
                      <Input
                        class="control"
                        placeholder="选择可预约日期"
                        readonly
                        :value="
                          list2.orderDateStart && list2.orderDateEnd
                            ? `${list2.orderDateStart} 至 ${list2.orderDateEnd}`
                            : ''
                        "
                      />
                      <DatePicker
                        class="date"
                        type="daterange"
                        :editable="false"
                        :clearable="false"
                        separator=" 至 "
                        @on-change="
                          date => {
                            list2.orderDateStart = date[0].substr(
                              5,
                              date[0].length - 1
                            )
                            list2.orderDateEnd = date[1].substr(
                              5,
                              date[1].length - 1
                            )
                          }
                        "
                        :value="[
                          '2020-' + list2.orderDateStart,
                          '2020-' + list2.orderDateEnd
                        ]"
                        placeholder="选择可预约日期"
                        placement="bottom-start"
                      ></DatePicker>
                    </div>
                  </FormItem>
                  <FormItem label="可预约时段：" class="mt20" prop="orderTime">
                    <div class="date-item" v-for="(item, index) in list2.time">
                      <!-- 修改有提示 -->
                      <Poptip
                        content="修改会影响已预约订单，请及时电话告知用户相关变动"
                        placement="right"
                        trigger="focus"
                        v-if="params.id"
                      >
                        <TimePicker
                          type="timerange"
                          class="time"
                          format="HH:mm"
                          :editable="false"
                          :clearable="false"
                          placement="bottom-start"
                          placeholder="请选择时间段"
                          v-model="list2.time[index]"
                          @on-clear="$refs.params.validateField('orderTime')"
                        ></TimePicker>
                      </Poptip>
                      <!-- 新增无提示 -->
                      <TimePicker
                        v-if="!params.id"
                        type="timerange"
                        class="time"
                        format="HH:mm"
                        :editable="false"
                        :clearable="false"
                        placement="bottom-start"
                        placeholder="请选择时间段"
                        v-model="list2.time[index]"
                        @on-clear="$refs.params.validateField('orderTime')"
                      ></TimePicker>
                      <!-- <span
                        class="cloud-icon opera minus"
                        @click.stop="deleteLine('list2', index)"
                        v-if="index == list2.time.length - 1"
                        >&#xe65d;</span
                      >
                      <span
                        class="cloud-icon opera add"
                        @click.stop="addLine('list2', index)"
                        >&#xe604;</span
                      > -->
                    </div>
                  </FormItem>
                  <FormItem label="备注信息：">
                    <Input
                      class="control"
                      placeholder="请输入备注信息，如什么时段不可预约入场"
                      :maxlength="50"
                      v-model="list2.remark"
                    />
                  </FormItem>
                </div>
              </div>
              <!-- 按淡旺季 -->
              <div
                class="items"
                v-if="params.orderTimeType == 'PEAK_SEASON_ORDER'"
              >
                <!-- 淡季 -->
                <div class="border">
                  <FormItem label="淡季可预约日期：" prop="orderDate">
                    <div class="date-wrap">
                      <Input
                        class="control"
                        placeholder="选择可预约日期"
                        readonly
                        :value="
                          list1.orderDateStart && list1.orderDateEnd
                            ? `${list1.orderDateStart} 至 ${list1.orderDateEnd}`
                            : ''
                        "
                      />
                      <DatePicker
                        class="date"
                        type="daterange"
                        :editable="false"
                        :clearable="false"
                        separator=" 至 "
                        @on-change="
                          date => {
                            list1.orderDateStart = date[0].substr(
                              5,
                              date[0].length - 1
                            )
                            list1.orderDateEnd = date[1].substr(
                              5,
                              date[1].length - 1
                            )
                          }
                        "
                        :value="[
                          '2020-' + list1.orderDateStart,
                          '2020-' + list1.orderDateEnd
                        ]"
                        placeholder="选择可预约日期"
                        placement="bottom-start"
                      ></DatePicker>
                    </div>
                  </FormItem>
                  <FormItem label="可预约时段：" class="mt20" prop="orderTime">
                    <div class="date-item" v-for="(item, index) in list1.time">
                      <!-- 修改有提示 -->
                      <Poptip
                        content="修改会影响已预约订单，请及时电话告知用户相关变动"
                        placement="right"
                        trigger="focus"
                        v-if="params.id"
                      >
                        <TimePicker
                          type="timerange"
                          class="time"
                          format="HH:mm"
                          :editable="false"
                          :clearable="false"
                          placement="bottom-start"
                          placeholder="请选择时间段"
                          v-model="list1.time[index]"
                          @on-clear="$refs.params.validateField('orderTime')"
                        ></TimePicker>
                      </Poptip>
                      <!-- 新增无提示 -->
                      <TimePicker
                        v-if="!params.id"
                        type="timerange"
                        class="time"
                        format="HH:mm"
                        :editable="false"
                        :clearable="false"
                        placement="bottom-start"
                        placeholder="请选择时间段"
                        v-model="list1.time[index]"
                        @on-clear="$refs.params.validateField('orderTime')"
                      ></TimePicker>
                      <!-- <span
                        class="cloud-icon opera minus"
                        @click.stop="deleteLine('list1', index)"
                        v-if="index == list1.time.length - 1"
                        >&#xe65d;</span
                      >
                      <span
                        class="cloud-icon opera add"
                        @click.stop="addLine('list1', index)"
                        >&#xe604;</span
                      > -->
                    </div>
                  </FormItem>
                  <FormItem label="备注信息：">
                    <Input
                      class="control"
                      placeholder="请输入备注信息，如什么时段不可预约入场"
                      :maxlength="50"
                      v-model="list1.remark"
                    />
                  </FormItem>
                </div>
                <!-- 旺季 -->
                <div class="mt20">
                  <FormItem label="旺季可预约日期：" prop="orderDate">
                    <div class="date-wrap">
                      <Input
                        class="control"
                        readonly
                        placeholder="选择可预约日期"
                        readonly
                        :value="
                          list2.orderDateStart && list2.orderDateEnd
                            ? `${list2.orderDateStart} 至 ${list2.orderDateEnd}`
                            : ''
                        "
                      />
                      <DatePicker
                        class="date"
                        type="daterange"
                        :editable="false"
                        :clearable="false"
                        separator=" 至 "
                        @on-change="
                          date => {
                            list2.orderDateStart = date[0].substr(
                              5,
                              date[0].length - 1
                            )
                            list2.orderDateEnd = date[1].substr(
                              5,
                              date[0].length - 1
                            )
                          }
                        "
                        :value="[
                          '2020-' + list2.orderDateStart,
                          '2020-' + list2.orderDateEnd
                        ]"
                        placeholder="选择可预约日期"
                        placement="bottom-start"
                      ></DatePicker>
                    </div>
                  </FormItem>
                  <FormItem label="可预约时段：" class="mt20" prop="orderTime">
                    <div class="date-item" v-for="(item, index) in list2.time">
                      <!-- 修改有提示 -->
                      <Poptip
                        content="修改会影响已预约订单，请及时电话告知用户相关变动"
                        placement="right"
                        trigger="focus"
                        v-if="params.id"
                      >
                        <TimePicker
                          type="timerange"
                          class="time"
                          format="HH:mm"
                          :editable="false"
                          :clearable="false"
                          placement="bottom-start"
                          placeholder="请选择时间段"
                          v-model="list2.time[index]"
                          @on-clear="$refs.params.validateField('orderTime')"
                        ></TimePicker>
                      </Poptip>
                      <!-- 新增无提示 -->
                      <TimePicker
                        v-if="!params.id"
                        type="timerange"
                        class="time"
                        format="HH:mm"
                        :editable="false"
                        :clearable="false"
                        placement="bottom-start"
                        placeholder="请选择时间段"
                        v-model="list2.time[index]"
                        @on-clear="$refs.params.validateField('orderTime')"
                      ></TimePicker>
                      <!-- <span
                        class="cloud-icon opera minus"
                        @click.stop="deleteLine('list2', index)"
                        v-if="index == list2.time.length - 1"
                        >&#xe65d;</span
                      >
                      <span
                        class="cloud-icon opera add"
                        @click.stop="addLine('list2', index)"
                        >&#xe604;</span
                      > -->
                    </div>
                  </FormItem>
                  <FormItem label="备注信息：">
                    <Input
                      class="control"
                      placeholder="请输入备注信息，如什么时段不可预约入场"
                      :maxlength="50"
                      v-model="list2.remark"
                    />
                  </FormItem>
                </div>
              </div>
              <FormItem label="不可预约星期：">
                <!-- 修改有提示 -->
                <Poptip
                  content="修改会影响已预约订单，请及时电话告知用户相关变动"
                  placement="right"
                  trigger="click"
                  v-if="params.id"
                >
                  <CheckboxGroup v-model="week">
                    <Checkbox label="1">
                      <span>周一</span>
                    </Checkbox>
                    <Checkbox label="2">
                      <span>周二</span>
                    </Checkbox>
                    <Checkbox label="3">
                      <span>周三</span>
                    </Checkbox>
                    <Checkbox label="4">
                      <span>周四</span>
                    </Checkbox>
                    <Checkbox label="5">
                      <span>周五</span>
                    </Checkbox>
                    <Checkbox label="6">
                      <span>周六</span>
                    </Checkbox>
                    <Checkbox label="7">
                      <span>周日</span>
                    </Checkbox>
                  </CheckboxGroup>
                  <div class="mt10">
                    <span>国家法定节假日是否闭馆</span>
                    <i-switch
                      v-model="historyOrderStatus"
                      @on-change="changeHistoryOrderStatus"
                    >
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                    </i-switch>
                  </div>
                </Poptip>
                <!-- 新增无提示 -->
                 <div
                  v-if="!params.id"
                >
                  <CheckboxGroup v-model="week">
                    <Checkbox label="1">
                      <span>周一</span>
                    </Checkbox>
                    <Checkbox label="2">
                      <span>周二</span>
                    </Checkbox>
                    <Checkbox label="3">
                      <span>周三</span>
                    </Checkbox>
                    <Checkbox label="4">
                      <span>周四</span>
                    </Checkbox>
                    <Checkbox label="5">
                      <span>周五</span>
                    </Checkbox>
                    <Checkbox label="6">
                      <span>周六</span>
                    </Checkbox>
                    <Checkbox label="7">
                      <span>周日</span>
                    </Checkbox>
                  </CheckboxGroup>
                  <div class="mt10">
                    <span>国家法定节假日是否闭馆</span>
                    <i-switch
                      v-model="historyOrderStatus"
                      @on-change="changeHistoryOrderStatus"
                    >
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                    </i-switch>
                  </div>
                </div>
              </FormItem>
            </div>
            <FormItem
              label="用户预约类型："
              class="mt10"
              prop="userOrderStatus"
            >
              <div>
                <Checkbox
                  v-model="personOrderStatus"
                  @on-change="
                    () => {
                      this.params.personOrderStatus = personOrderStatus ? 1 : 0
                    }
                  "
                >
                  个人预约
                  <number
                    :precision="0"
                    class="w100"
                    :min="1"
                    :max="9999"
                    v-model="params.personNumMin"
                    placeholder=""
                    @on-change="$refs.params.validateField('userOrderStatus')"
                  />
                  -
                  <number
                    :precision="0"
                    class="w100"
                    :min="1"
                    :max="9999"
                    v-model="params.personNumMax"
                    placeholder=""
                    @on-change="$refs.params.validateField('userOrderStatus')"
                  />人，1位成人最多可带
                  <number
                    :precision="0"
                    class="w100"
                    :min="1"
                    :max="9999"
                    v-model="params.childNum"
                    placeholder=""
                    @on-change="$refs.params.validateField('userOrderStatus')"
                  />位儿童
                </Checkbox>
              </div>
              <div class="mt10">
                <Checkbox
                  label="团队"
                  v-model="teamOrderStatus"
                  @on-change="
                    () => {
                      this.params.teamOrderStatus = teamOrderStatus ? 1 : 0
                    }
                  "
                >
                  团队预约
                  <number
                    :precision="0"
                    class="w100"
                    :min="1"
                    :max="9999"
                    v-model="params.teamNumMin"
                    placeholder=""
                    @on-change="$refs.params.validateField('userOrderStatus')"
                  />
                  -
                  <number
                    :precision="0"
                    class="w100"
                    :min="1"
                    :max="9999"
                    v-model="params.teamNumMax"
                    placeholder=""
                    @on-change="$refs.params.validateField('userOrderStatus')"
                  />人
                </Checkbox>
              </div>
            </FormItem>
            <FormItem label="最大接待人数：" prop="maxNum">
              <number
                class="control"
                v-model="params.maxNum"
                placeholder=""
                :precision="0"
                :max="99999999"
              />
            </FormItem>
            <FormItem label="可预约天数：" prop="orderDay">
              <div>
                个人至少提前
                <Input
                  class="w150"
                  v-model="params.personAdvanceOrderDay"
                  placeholder="请填写正整数"
                />
                天
              </div>
              <div class="mt10" v-if="params.teamOrderStatus">
                团队至少提前
                <Input
                  class="w150"
                  v-model="params.teamAdvanceOrderDay"
                  placeholder="请填写正整数"
                />
                天
              </div>
            </FormItem>
            <FormItem
              class="mt20 cancel-set"
              label="取消设置："
              prop="cancelStatus"
            >
              <RadioGroup v-model="params.cancelStatus">
                <Radio :label="0">不可取消</Radio>
                <Radio :label="1">随时取消</Radio>
                <Radio :label="2">开始使用24小时前可取消</Radio>
                <Radio :label="3">
                  自定义可取消时间
                  <div class="item" v-if="params.cancelStatus == 3">
                    开始使用
                    <number
                      style="width:60px"
                      v-model="params.cancelTime"
                      :max="99999"
                      :min="0"
                      :precision="0"
                      placeholder="请输入小时数"
                    />小时前可取消
                  </div>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="核销设置：" prop="validStartValue">
              <div class="clearfix valid-time-set">
                <Input
                  v-model="params.validStartValue"
                  style="width: 250px;margin-right: 20px;"
                  class="fl"
                >
                  <span slot="prepend">预约开始时间前</span>
                  <Select
                    v-model="params.validTimeStartType"
                    slot="append"
                    style="width: 70px"
                  >
                    <Option value="VALID_TIME_TYPE_HOURS">小时</Option>
                    <Option value="VALID_TIME_TYPE_MINUTE">分钟</Option>
                  </Select>
                </Input>
                <Input
                  v-model="params.validEndValue"
                  style="width: 250px;"
                  class="fl"
                >
                  <span slot="prepend">预约开始时间后</span>
                  <Select
                    v-model="params.validTimeEndType"
                    slot="append"
                    style="width: 70px"
                  >
                    <Option value="VALID_TIME_TYPE_HOURS">小时</Option>
                    <Option value="VALID_TIME_TYPE_MINUTE">分钟</Option>
                  </Select>
                </Input>
              </div>
            </FormItem>
            <FormItem label="预约须知">
              <Input
                type="textarea"
                class="orderNotice"
                :rows="6"
                v-model="params.orderNotice"
                placeholder=""
              />
            </FormItem>
          </div>
        </Tab-pane>
        <!--讲解预约设置-->
        <!-- <Tab-pane label="讲解预约设置" key="key2"> </Tab-pane> -->
      </Tabs>
      <FormItem label class="submit">
        <Button type="primary" @click="save">提交</Button>
        <!-- <Button class="ml20" type="primary">存草稿</Button> -->
        <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { ctcVenueOrderSetUpSave, getVenueOrderInfo } from '@service/place'
import Head from '@views/pages/place/venues/activity-room/head.vue'
interface listType {
  id: number
  orderType: string
  orderDateStart: string
  orderDateEnd: string
  orderTimeSubStart: string
  orderTimeSubEnd: string
  remark: string
}
const list = {
  // orderType:'',//预订类型
  // orderDateStart: '',//预订日期开始
  // orderDateEnd: '',//预订日期结束
  // orderTimeSubStart:'',//预订时间开始
  // orderTimeSubEnd:'',//预订时间结束
  // remark:
  id: '',
  orderType: '', //预订类型
  remark: '',
  orderDateStart: '', //预订日期开始
  orderDateEnd: '', //预订日期结束
  time: [[]] //预订时间
}

const listTwo = {
  id: '',
  orderType: '', //预订类型
  remark: '',
  orderDateStart: '', //预订日期开始
  orderDateEnd: '', //预订日期结束
  time: [[]] //预订时间
}

@Component({
  components: {
    Head
  }
})
export default class venuesReserve extends Vue {
  /**S 切换按钮 （法定节假日是否闭馆） */
  historyOrderStatus: any = true
  changeHistoryOrderStatus(status: any) {
    this.params.historyOrderStatus = status ? 1 : 0
    this.historyOrderStatus = status
  }
  /**E 切换按钮 （法定节假日是否闭馆） */

  /**S 详情 */
  private isEdit = false
  private orderList1: any = []
  private orderList2: any = []
  private descOrderTimeType: any = {}
  getDesc() {
    this.list1 = this.getInitRuleList()
    this.list2 = this.getInitRuleList()
    getVenueOrderInfo({ id: this.$route.query.venueId }).then((res: any) => {
      if (res.code === 0 && res.data.setUp) {
        this.descOrderTimeType = res.data.setUp.orderTimeType
        this.isEdit = true
        this.params = res.data.setUp
        delete this.params.createTime
        delete this.params.updateTime
        this.week = res.data.setUp.notOrderWeek.split(',')
        this.teamOrderStatus = this.params.teamOrderStatus == 1 ? true : false
        this.personOrderStatus =
          this.params.personOrderStatus == 1 ? true : false
        this.params.historyOrderStatus = res.data.setUp.historyOrderStatus
        this.historyOrderStatus = res.data.setUp.historyOrderStatus
          ? true
          : false
        /**S 处理预约时段 */
        switch (this.params.orderTimeType) {
          case 'ALL_YEAR_ORDER':
            {
              //全年
              this.orderList1 = res.data.allYearOrder
            }
            break
          case 'USE_SEASON_ORDER':
            {
              //季节
              this.orderList1 = this.orderList1.concat(res.data.summerOrder)
              this.orderList2 = this.orderList2.concat(res.data.winterOrder)
            }
            break
          case 'PEAK_SEASON_ORDER':
            {
              //淡旺季
              this.orderList1 = this.orderList1.concat(res.data.lowSeasonOrder)
              this.orderList2 = this.orderList2.concat(res.data.busySeasonOrder)
            }
            break
        }
        this.setOrderList()
        /**E 处理预约时段 */
      }
    })
  }
  //回显详情返回的预订时间段
  setOrderList() {
    //全年/淡季/夏季
    this.orderList1.forEach((item: any, index: any) => {
      this.list1.id = item.id
      this.list1.orderType = item.orderType
      this.list1.remark = item.remark
      this.list1.orderDateStart = item.orderDateStart
      this.list1.orderDateEnd = item.orderDateEnd
      this.list1.time[index] = [item.orderTimeSubStart, item.orderTimeSubEnd]
    })
    ///旺季/冬季
    this.orderList2.forEach((item: any, index: any) => {
      this.list2.id = item.id
      this.list2.orderType = item.orderType
      this.list2.remark = item.remark
      this.list2.orderDateStart = item.orderDateStart
      this.list2.orderDateEnd = item.orderDateEnd
      this.list2.time[index] = [item.orderTimeSubStart, item.orderTimeSubEnd]
    })
  }
  /**E 详情 */

  /**S 验证 */
  private ruleValidate: any = {
    orderStatus: [{ required: true, message: '请选择预约状态' }],
    orderTimeType: [{ required: true, message: '请选择可预约时间' }],
    maxNum: [
      { required: true, message: '请填写最大接待人数' },
      { validator: this.maxNum }
    ],
    orderDay: [{ required: true, validator: this.orderDay, trigger: 'blur' }],
    cancelStatus: [{ required: true, validator: this.cancelStatus }],
    userOrderStatus: [{ required: true, validator: this.userOrderStatus }],
    orderDate: [{ required: true, validator: this.orderDate }],
    orderTime: [
      { required: true, validator: this.orderTime, trigger: 'change' }
    ],
    validValue: [{ validator: this.validValue }],
    validStartValue: [{ validator: this.validNum, trigger: 'blur' }]
  }
  // 检查核销时间设置
  private validNum(rule: any, value: any, callback: Function) {
    let start = String(this.params.validStartValue).trim()
    if (/^[0-9]\d*$/.test(start)) {
      if (parseFloat(start) > 9999) {
        return callback(new Error('请填写0-9999的整数'))
      }
    } else if (start) {
      return callback(new Error('请填写正整数'))
    }

    let end = String(this.params.validEndValue).trim()
    if (/^[0-9]\d*$/.test(end)) {
      if (parseFloat(end) > 9999) {
        return callback(new Error('请填写0-9999的整数'))
      }
    } else if (end) {
      return callback(new Error('请填写正整数'))
    }
    this.params.validStartValue = start
    this.params.validEndValue = end
    callback() // 直接过
  }
  //核销设置
  validValue(rule: any, value: any, callback: any) {}
  //最大接待人数
  maxNum(rule: any, value: any, callback: any) {
    if (
      this.personOrderStatus &&
      this.teamOrderStatus &&
      this.params.personNumMax &&
      this.params.teamNumMax &&
      parseInt(this.params.maxNum) < parseInt(this.params.teamNumMax)
    ) {
      callback(new Error('最大接待人数不能低于团队预约最大人数'))
    } else if (
      this.personOrderStatus &&
      this.params.personNumMax &&
      parseInt(this.params.maxNum) < parseInt(this.params.personNumMax)
    ) {
      callback(new Error('最大接待人数不能低于个人预约最大人数'))
    } else {
      callback()
    }
  }
  //可预约时段
  orderTime(rule: any, value: any, callback: any) {
    //全年
    if (this.params.orderTimeType == 'ALL_YEAR_ORDER') {
      if (this.list1.time.length >= 1 && !this.list1.time[0][0]) {
        callback(new Error('请选择可预约时段'))
      } else {
        callback()
      }
    }
    //淡旺季/夏冬季
    if (this.params.orderTimeType !== 'ALL_YEAR_ORDER') {
      if (
        (this.list1.time.length >= 1 && !this.list1.time[0][0]) ||
        (this.list2.time.length >= 1 && !this.list2.time[0][0])
      ) {
        callback(new Error('请选择可预约时段'))
      } else {
        callback()
      }
    }
  }
  //可预约日期验证
  orderDate(rule: any, value: any, callback: any) {
    //全年
    if (this.params.orderTimeType == 'ALL_YEAR_ORDER') {
      if (!this.list1.orderDateStart && !this.list1.orderDateStart) {
        callback(new Error('请选择可预约日期'))
      } else {
        callback()
      }
    }
    //淡旺季/夏季冬季
    let list1Start = new Date(this.list1.orderDateStart).valueOf() - 86400000
    let list1End = new Date(this.list1.orderDateEnd).valueOf() - 86400000
    let list2Start = new Date(this.list2.orderDateStart).valueOf() - 86400000
    let list2End = new Date(this.list2.orderDateEnd).valueOf() - 86400000
    if (this.params.orderTimeType !== 'ALL_YEAR_ORDER') {
      if (
        !this.list1.orderDateStart &&
        !this.list1.orderDateEnd &&
        !this.list2.orderDateStart &&
        !this.list2.orderDateEnd
      ) {
        callback(new Error('请选择可预约日期'))
      } else if (
        (list2Start <= list1End && list2Start >= list1Start) ||
        (list1Start <= list2End && list1Start >= list2Start)
      ) {
        callback(new Error('不能设置重复的可预约日期范围'))
      } else {
        callback()
      }
    }
  }
  //可预约天数验证
  orderDay(rule: any, value: any, callback: any) {
    let person = String(this.params.personAdvanceOrderDay).trim()
    let team = String(this.params.teamAdvanceOrderDay).trim()
    let reg = /^[0-9]\d*$/
    //团队预约选中
    if (reg.test(person)) {
      if (parseFloat(person) > 9999) {
        callback(new Error('请填写个人可预约天数,0-9999的整数'))
      }
    } else if (person) {
      callback(new Error('个人可预约天数,请填写正整数'))
    }
    if (this.params.teamOrderStatus == 1) {
      if (reg.test(team)) {
        if (parseFloat(team) > 9999) {
          callback(new Error('请填写团队可预约天数,0-9999的整数'))
        }
      } else if (team) {
        callback(new Error('团队可预约天数,请填写正整数'))
      }
    }
    callback()
  }
  //用户预约类型验证
  userOrderStatus(rule: any, value: any, callback: any) {
    if (!this.personOrderStatus && !this.teamOrderStatus) {
      callback(new Error('请选择用户预约类型'))
    } else if (
      (this.personOrderStatus &&
        (!this.params.personNumMin || !this.params.personNumMax)) ||
      (this.teamOrderStatus &&
        (!this.params.teamNumMin || !this.params.teamNumMax))
    ) {
      callback(new Error('请填写完整选中类型人数'))
    }
    //个人预约最大人数不能低于个人最少人数
    else if (
      this.personOrderStatus &&
      parseInt(this.params.personNumMin) > parseInt(this.params.personNumMax)
    ) {
      callback(
        new Error(`个人预约最大人数不能低于${this.params.personNumMin}个人`)
      )
    } else if (
      // 小孩数量不能超过个人最大数量
      this.personOrderStatus &&
      parseInt(this.params.childNum) >= parseInt(this.params.personNumMax)
    ) {
      callback(
        new Error(
          `1位成人可带${this.params.personNumMax -
            1}位小孩哦，不能超过个人预约最大数量`
        )
      )
    } else if (
      // 团队最少人数不能低于个人最大人数
      this.personOrderStatus &&
      this.teamOrderStatus &&
      parseInt(this.params.teamNumMax) < parseInt(this.params.personNumMax)
    ) {
      callback(
        new Error(`团队预约人数最低不能少于${this.params.personNumMax}个`)
      )
    }
    //团队最大人数不能低于最少人数
    else if (
      this.teamOrderStatus &&
      parseInt(this.params.teamNumMin) > parseInt(this.params.teamNumMax)
    ) {
      callback(
        new Error(`团队预约最大人数不能低于${this.params.teamNumMin}个人`)
      )
    } else {
      callback()
    }
  }
  //取消设置验证
  cancelStatus(rule: any, value: any, callback: any) {
    if (!this.params.cancelStatus && this.params.cancelStatus !== 0) {
      callback(new Error('请选择取消设置类型'))
    }
    if (this.params.cancelStatus == 3 && !this.params.cancelTime) {
      callback(new Error('请设置自定义可取消的时间'))
    } else {
      callback()
    }
  }
  /**E 验证 */
  /**S 保存*/
  private week: any = [] //不可预约星期
  private list1: any = list //预订时间段
  private list2: any = list //预订时间段
  private personOrderStatus: any = false //个人预约状态
  private teamOrderStatus: any = false //团队预约状态
  private params: any = {
    venueId: '',
    orderStatus: 0, //预约状态
    orderTimeType: 'ALL_YEAR_ORDER', //全年 ALL_YEAR_ORDER；季节 USE_SEASON_ORDER；淡旺季 PEAK_SEASON_ORDER；
    orderTimes: [], //预订时间段
    personNumMin: '', //个人预约人数区间 最小值
    personNumMax: '', //个人预约人数区间 最大值
    personOrderStatus: 0, //个人预约状态1 打开 0 关闭
    childNum: '', //可带小孩数量
    teamOrderStatus: 0, //团队预约状态1 打开 0 关闭
    teamNumMin: '', //团队预约人数区间 最小值
    teamNumMax: '', //团队预约人数区间 最大值
    maxNum: '', //最大接待人数
    personAdvanceOrderDay: 0, //个人至少提前天数
    teamAdvanceOrderDay: 0, //团队至少提前天数
    cancelStatus: '', //取消类型：不可取消0，随时取消1，24小时内2，自定义取消时间3
    cancelTime: '1', //可取消时间
    validStartValue: '', //核销开始前值
    validEndValue: '', //核销结束后值
    validTimeStartType: 'VALID_TIME_TYPE_HOURS', //核销开始前类型
    validTimeEndType: 'VALID_TIME_TYPE_HOURS', //核销结束后类型
    orderNotice: '', //预约须知
    notOrderWeek: '', //不可预约星期
    historyOrderStatus: 0, //节假日是否开放状态 1 开放 0 不开放
    id: ''
  }

  //保存
  save() {
    this.mergeOrderTime() //处理预约时间段
    this.params.notOrderWeek = this.week.toString()
    this.params.validStartValue = !this.params.validStartValue
      ? 0
      : this.params.validStartValue //不填默认值为0
    this.params.validEndValue = !this.params.validEndValue
      ? 0
      : this.params.validEndValue //不填默认值为0
    ;(this.$refs.params as any).validate((valid: any) => {
      if (valid) {
        ctcVenueOrderSetUpSave({
          venueOrder: JSON.stringify(this.params),
          orderStatus: this.params.orderStatus, //预约状态
          venueId: this.params.venueId
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success('保存成功')
            this.$router.go(-1)
          }
        })
      }
    })
  }
  //合并预约时间段
  mergeOrderTime() {
    let orderList: any = []
    this.params.orderTimes = []
    let orderTimeType = this.params.orderTimeType
    this.list1.time.forEach((item: any, index: any) => {
      let type: any =
        orderTimeType == 'ALL_YEAR_ORDER'
          ? orderTimeType
          : orderTimeType == 'USE_SEASON_ORDER'
          ? 'SUMMER_ORDER'
          : 'LOW_SEASON_ORDER' //预约时间类型(全年/夏季/淡季)
      let obj: listType = {
        orderType: type,
        id: this.list1.id,
        orderDateStart: this.list1.orderDateStart,
        orderDateEnd: this.list1.orderDateEnd,
        orderTimeSubStart: item[0],
        orderTimeSubEnd: item[1],
        remark: this.list1.remark
      }
      this.params.orderTimes.push(obj)
    })

    //冬季/旺季
    if (orderTimeType !== 'ALL_YEAR_ORDER') {
      this.list2.time.forEach((item: any, index: any) => {
        //判断预约时间（全年/季节/淡旺季）
        let type: any =
          orderTimeType == 'ALL_YEAR_ORDER'
            ? orderTimeType
            : orderTimeType == 'USE_SEASON_ORDER'
            ? 'WINTER_ORDER'
            : 'BUSY_SEASON_ORDER'
        let obj: listType = {
          orderType: type,
          id: this.list2.id,
          orderDateStart: this.list2.orderDateStart,
          orderDateEnd: this.list2.orderDateEnd,
          orderTimeSubStart: item[0],
          orderTimeSubEnd: item[1],
          remark: this.list2.remark
        }
        this.params.orderTimes.push(obj)
      })
    }
    // this.params.orderTimes=JSON.stringify(orderList);
  }
  //切换可预约时间
  getOrderTimeType(type: any) {
    //如果选中的是详情返回的类型就回显数据
    if (type === this.descOrderTimeType) {
      this.setOrderList()
    } else {
      //清空 初始化list
      this.list1 = this.getInitRuleList()
      this.list2 = this.getInitRuleList()
    }
  }
  //初始化预约字段
  getInitRuleList() {
    let list: any = {
      id: '',
      orderType: '', //预订类型
      remark: '',
      orderDateStart: '', //预订日期开始
      orderDateEnd: '', //预订日期结束
      time: [[]] //预订时间
    }
    return list
  }
  /**E 保存*/
  addLine(list: any, index: number) {
    let arr: any = []
    let startTime = this[list].time[index][0]
    let endTime = this[list].time[index][1]
    if (!startTime || !endTime) {
      this.$Message.error('请先填写时间段再添加')
    } else {
      this[list].time.push(arr)
    }
  }
  deleteLine(list: any, index: number) {
    this[list].time.pop()
    if (index == 0) {
      this[list].time.push([])
    }
  }
  goBack() {
    this.$router.go(-1)
  }
  created() {
    this.params.venueId = this.$route.query.venueId
    this.getDesc()
  }
}
</script>
<style lang="scss">
.venues-reserve {
  .date-wrap {
    .ivu-date-picker-header-label:first-of-type {
      display: none;
    }
    .date {
      .ivu-input {
        opacity: 0;
      }
    }
    .ivu-date-picker-prev-btn-arrow-double,
    .ivu-date-picker-next-btn-arrow-double {
      display: none;
    }
  }
  .ivu-select-dropdown {
    z-index: 999 !important;
  }
}
</style>
<style lang="scss" scoped>
.container {
  padding: 15px;
  .w100 {
    width: 100px;
  }
  .w150 {
    width: 150px;
  }
  .control {
    width: 300px;
  }
  .orderNotice {
    width: 500px;
  }
  .date-wrap {
    position: relative;
    height: 32px;
    .date {
      position: absolute;
      left: 0;
      top: 0;
      // z-index: 3;
      // opacity:0;
      width: 200px;
    }
    .control {
      width: 200px;
      position: absolute;
      left: 0;
      top: 0;
      // z-index: 1;
    }
  }
  .cancel-set {
    .item {
      display: inline-block;
      color: $lightGray;
    }
  }
  .opera {
    display: inline-block;
    margin-left: 10px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    vertical-align: middle;
    border: 1px solid $borderDark;
    &:hover {
      color: $bg01;
      background-color: $theme;
      border: 1px solid $theme;
    }
  }
  .block-box {
    background-color: #f8f6f6;
    padding: 15px 0 5px 0;
  }
  .choice-rule {
    margin-bottom: 0;
  }
  .border {
    position: relative;
    padding: 10px 0 5px 0;
    &:after {
      position: absolute;
      content: '';
      left: 5%;
      bottom: 0;
      width: 90%;
      margin: 0 auto;
      height: 1px;
      border: 1px dashed #bcbcbc;
    }
  }
  .date-item {
    & + .date-item {
      margin-top: 10px;
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
