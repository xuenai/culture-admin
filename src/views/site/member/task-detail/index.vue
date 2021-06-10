<template>
  <div class="task">
    <Form :label-width="90" :model="params" :rules="ruleValidate" ref="params">
      <FormItem label="任务类型：" prop="taskTypeCode">
        <Select class="task-ipt small" v-model="params.taskTypeCode" disabled>
          <Option
            v-for="type in taskTypes"
            :value="type.taskTypeCode"
            :key="type.taskTypeCode"
          >{{type.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="任务标题：" prop="name">
        <Input class="task-ipt" placeholder="最多输入15个汉字" :maxlength="15" v-model="params.name" disabled/>
      </FormItem>
      <FormItem label="任务图标：" prop="icon">
        <div class="task-icon" v-if="params.icon">
          <img :src="params.icon" alt />
        </div>
        <div class="upload" v-else>
          <span class="cloud-icon" v-if="!uploadImgShow">&#xe604;</span>
          <Spin v-else :value="true" size="large"></Spin>
          <input
            type="file"
            class="upload-ipt"
            accept="image/*"
            ref="fileInput"
            @change="acceptImage($event)"
            disabled
          />
        </div>
      </FormItem>
      <FormItem label="领取方式：" prop="autoDraw">
        <RadioGroup v-model="params.autoDraw">
          <Radio :label="1" disabled>
            <span>自动领取</span>
          </Radio>
          <Radio :label="0" disabled>
            <span>手动领取</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="任务内容：" prop="taskRuleCode">
        <!-- 判断是不是 外链 任务 -->
        <div v-if="params.taskTypeCode === 'EXTERNAL_TASK'">
          <Input class="task-ipt large" v-model="params.externalUrl" :maxlength="200" disabled/>
          <p>请填写项目URL，请以HTTP或HTTPS开头</p>
        </div>
        <div v-else>
          <!-- 没有规则时 -->
          <div v-if="ruleList.length === 0">暂无任务规则</div>
          <!-- 当任务没有 一次性任务 和 重复任务选择时 -->
          <div v-else-if="ruleList.length === 1">
            <!-- 判断content的长度，如果content的长度大于1，则会存在单选 -->
            <div v-if="ruleList[0].content.length === 1">
              <!-- 检测规则中是不是没有输入框 -->
              <div v-if="ruleList[0].content[0].split('%s').length > 1">
                <span>{{ruleList[0].content[0].split('%s')[0]}}</span>
                <number
                  :precision="0"
                  class="task-ipt smaller ml-8"
                  :min="0"
                  empty
                  v-model="params.conditionValue"
                  disabled
                />
                <span class="ml-8">{{ruleList[0].content[0].split('%s')[1]}}</span>
              </div>
              <div v-else>{{ruleList[0].content[0]}}</div>
            </div>
            <div v-else-if="ruleList[0].content.length > 1">
              <!-- 循环对应的content,渲染对应的单选框 -->
              <RadioGroup vertical>
                <Radio v-for="(con, idx) in ruleList[0].content" :key="idx" :label="idx" disabled>
                  <span class="pd-8">
                    <!-- 检测规则中是不是没有输入框 -->
                    <span v-if="con.split('%s').length > 1">
                      <span>{{con.split('%s')[0]}}</span>
                      <number
                        :precision="0"
                        class="task-ipt smaller ml-8"
                        :min="0"
                        empty
                        v-model="params.conditionValue"
                        disabled
                      />
                      <span class="ml-8">{{con.split('%s')[1]}}</span>
                    </span>
                    <span v-else>{{con}}</span>
                  </span>
                </Radio>
              </RadioGroup>
            </div>
          </div>
          <!-- 当前任务类型 有 一次性任务 和 重复任务选择时 -->
          <div v-if="ruleList.length > 1">
            <div class="pd-8">
              <RadioGroup v-model="params.taskRuleCode">
                <Radio v-for="code in ruleList" :key="code.ruleCode" :label="code.ruleCode" disabled>
                  <span>{{code.name}}</span>
                </Radio>
              </RadioGroup>
            </div>
            <!-- 循环roleList -->
            <div v-for="role in ruleList" :key="role.ruleCode">
              <!-- 判断当前的ruleCode 和列表中的是不是相等 -->
              <div v-if="role.ruleCode === params.taskRuleCode">
                <!-- 判断content的长度，如果content的长度大于1，则会存在单选 -->
                <div v-if="role.content.length === 1">
                  <!-- 检测规则中是不是没有输入框 -->
                  <div v-if="role.content[0].split('%s').length > 1">
                    <span>{{role.content[0].split('%s')[0]}}</span>
                    <number
                      :precision="0"
                      class="task-ipt smaller ml-8"
                      :min="0"
                      empty
                      v-model="params.conditionValue"
                      disabled
                    />
                    <span class="ml-8">{{role.content[0].split('%s')[1]}}</span>
                  </div>
                  <div v-else>{{role.content[0]}}</div>
                </div>
                <div v-else-if="role.content.length > 1">
                  <!-- 循环对应的content,渲染对应的单选框 -->
                  <RadioGroup vertical :value="0">
                    <Radio v-for="(con, idx) in role.content" :key="idx" :label="idx" disabled>
                      <span class="pd-8">
                        <!-- 检测规则中是不是没有输入框 -->
                        <span v-if="con.split('%s').length > 1">
                          <span>{{con.split('%s')[0]}}</span>
                          <number
                            :precision="0"
                            class="task-ipt smaller ml-8"
                            :min="0"
                            empty
                            v-model="params.conditionValue"
                            disabled
                          />
                          <span class="ml-8">{{con.split('%s')[1]}}</span>
                        </span>
                        <span v-else>{{con}}</span>
                      </span>
                    </Radio>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem label="任务奖励：">
        <RadioGroup v-model="params.rewardType">
          <Radio label="INTEGRAL_REWARD_COMPLETE" disabled>
            <span>积分</span>
            <span class="ml-8">
              <number
                :precision="0"
                class="task-ipt smaller"
                :min="0"
                empty
                disabled
                v-model="params.rewardIntegral"
              />
            </span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="任务时间：" prop="startTime">
        <DatePicker
          class="task-ipt small"
          type="daterange"
          format="yyyy-MM-dd"
          disabled
          :value="date"
          separator=" 至 "
          placeholder="请选择任务时间"
        />
        <Checkbox
          class="ml-8"
          :value="params.taskLastStatus === 1"
          disabled
        >长期</Checkbox>
      </FormItem>
      <FormItem label="任务简介：" prop="synopsis">
        <Input class="task-ipt large" disabled v-model="params.synopsis" placeholder="最多可输入100个汉字" />
      </FormItem>
    </Form>
    <div class="btns">
      <Button class="btn" @click="goBack">返回</Button>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

import { AppModule } from "@store/modules/app";
import { getTaskTypeList, saveTask, getTaskDetail } from "@service/member";
import { uploadImage } from "@service/content";
import axios from 'axios'

@Component
export default class Task extends Vue {
  // 任务类型常量
  taskTypes: any = [];
  ruleValidate = {
    taskTypeCode: [
      { required: true, message: "请选择任务类型", trigger: "blur" }
    ],
    name: [
      { required: true, message: "请输入任务标题", trigger: "change" },
      { min: 1, message: "任务标题最少1个汉字", trigger: "change" }
    ],
    icon: [{ required: true, message: "请上传任务图标", trigger: "blur" }],
    autoDraw: [
      { required: true, message: "请选择任务领取方式", type: 'number', trigger: "change" }
    ],
    taskRuleCode: [
      { required: true, validator: this.validateContent }
    ],
    startTime: [{ required: true, validator: this.validateDate}],
    synopsis: [
      { required: true, message: "请输入任务简介", trigger: "change" },
      { min: 1, message: "任务简介最少1个汉字", trigger: "change" }
    ]
  };
  params = {
    externalUrl: "",
    id: "",
    name: "",
    synopsis: "",
    icon: "",
    taskRuleCode: "",
    taskTypeCode: "",
    taskLastStatus: 2, // 1为长期 、2为时间范围
    publishChannel: "CULTURAL",
    startTime: "",
    endTime: "",
    userId: this.$store.state.app.userInfo.id,
    sort: "",
    rewardType: "INTEGRAL_REWARD_COMPLETE", // 奖励类型，默认为全额积分奖励
    cruxValue: this.$store.state.app.userInfo.siteId,
    autoDraw: 1, // 1自动领取 0手动领取
    rewardIntegral: "", // 奖励积分
    conditionValue: 1
  };
  // 回显时的日期
  date:any = [];
  // 当前选中的任务类型的规则
  ruleList: any = [];
  // 上传图片是否展示
  uploadImgShow = false;
  // 验证表单中的开始时间是区域还是长期
  validateDate (rule: any, value: any, callback: any) {
    //return callback(new Error("手机号不正确"));
    // callback();
    let {taskLastStatus, startTime, endTime } = this.params;
    if (taskLastStatus === 1) {
      callback();
    } else {
      if (startTime && endTime) {
        callback();
      } else {
        return callback(new Error("请选择任务时间"));
      }
    }
  }
  // 验证内容字段（taskRuleCode）是否未设置
  validateContent (rule: any, value:any, callback: any) {
    let {taskRuleCode, externalUrl, taskTypeCode} = this.params;
    if (taskRuleCode) {
      if (taskTypeCode === 'EXTERNAL_TASK') {
        if (externalUrl) {
          callback();
        } else {
          return callback(new Error("请填写外链地址"));
        }
      } else {
        callback();
      }
    } else {
      return callback(new Error("请填写任务内容"));
    }
  }
  // 验证表单中的某个字段
  validateField (name: string) {
    (this.$refs.params as any).validateField(name);
  }
  /**
   * goBack 返回上一页
   */
  goBack() {
    // this.$router.go(-1);
    this.$router.replace({path: '/member-system', query: {name: 'task'}})
  }
  /**
   * 上传图片
   */
  acceptImage(e: any) {}
  // 获取类型列表
  getTaskTypes() {
    getTaskTypeList({ publishChannel: "CULTURAL" }).then(res => {
      if (res.code === 0) {
        this.taskTypes = res.datas;
      } else {
        this.$router.push({ path: "/error", query: { msg: res.message } });
      }
    });
  }
  created() {
    let {id} = this.$route.query;
    // 存在id 证明是编辑页面
    if (id) {
      AppModule.setAppFixedLoadingStatus(true)
      axios.all([getTaskTypeList({ publishChannel: "CULTURAL" }), getTaskDetail({id})])
      .then(axios.spread((typeRes, detailRes)=> {
        if (typeRes.code === 0 && detailRes.code === 0) {
          this.params = detailRes.data;
          this.taskTypes = typeRes.datas;
          this.ruleList = this.taskTypes.filter(
              (e: any) => e.taskTypeCode === this.params.taskTypeCode
            )[0].ruleList;
          this.date = [
            this.params.startTime.slice(0,10),
            this.params.endTime.slice(0,10)
          ];
        } else {
          this.$router.push({ path: "/error" });
        }
      })).finally(() => {
        AppModule.setAppFixedLoadingStatus(false);
      })
    } else {
      // 这个是新增页面
      this.getTaskTypes();
    }
  }
}
</script>

<style lang='scss' scoped>
.task {
  padding: 50px 15px 15px;
  .ml-8 {
    margin-left: 8px;
  }
  .pd-8 {
    padding-bottom: 8px;
  }
  &-ipt {
    max-width: 300px;
    &.smaller {
      max-width: 100px;
    }
    &.small {
      max-width: 200px;
    }
    &.large {
      max-width: 500px;
    }
    &.date {
      max-width: 150px;
    }
  }
  .task-icon {
    position: relative;
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    .cloud-icon {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $grayDark;
      color: $font02;
      font-size: 12px;
      cursor: pointer;
      transform: translate(50%, -50%);
    }
  }
  .upload {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 6px;
    overflow: hidden;
    background: $grayDark;
    .cloud-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px dashed $borderDark;
      border-radius: 4px;
    }

    &-ipt {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
  .btns {
    padding-top: 24px;
    .btn {
      margin-right: 24px;
      min-width: 100px;
    }
  }
}
</style>
