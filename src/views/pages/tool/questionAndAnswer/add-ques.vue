<template>
  <Form class="form" :label-width="80" ref="params" :model="params" :rules="ruleValidate">
    <h2 class="tit">添加问题</h2>
    <FormItem label="匹配模式" prop="matchType">
      <RadioGroup v-model="params.matchType">
        <Radio label="part">包含匹配</Radio>
        <Radio label="all">完全匹配</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="问题" prop="question">
      <Input placeholder="输入问题" :maxlength="100" v-model="params.question" class="w300" />
    </FormItem>
    <FormItem v-for="(ques, i) in questionList" label="相似问题" :key="i">
      <Input placeholder="输入相似问题" :maxlength="100" v-model="questionList[i]" class="w300" />
      <span class="delete-btn ques-btn"
        @click="questionList.length > 1 && questionList.splice(i, 1)">-</span>
      <span class="add-btn ques-btn" @click="questionList.splice(i + 1, 0, '')">+</span>
    </FormItem>
    <FormItem label="标准答案" prop="answer">
      <Ueditor id="uedit1" v-model="params.answer"></Ueditor>
    </FormItem>
    <!-- <FormItem label="选择分类" prop="qaType">
        <Select v-model="params.qaType" class="w300">
            <Option value="beijing">电商</Option>
        </Select>
    </FormItem> -->
    <FormItem label="生效时间" prop="aging">
      <RadioGroup v-model="params.aging">
        <Radio label="lasting">永久</Radio>
        <Radio label="interim">自定义</Radio>
      </RadioGroup>
      <DatePicker v-show="params.aging === 'interim'" :value="[params.startTime, params.endTime]"
        @on-change="setTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择起始日期、时间"
        style="width: 300px">
      </DatePicker>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="save(true)">保存并继续添加</Button>
      <Button style="margin-left: 20px" type="primary" @click="save()">保存</Button>
      <Button style="margin-left: 20px" @click="$router.go(-1)">返回</Button>
    </FormItem>
  </Form>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import Ueditor from "@components/ueditor/ueditor.vue";
import { saveQuesAnswer, getQuesAnswerInfo, deleteRecord } from "@service/tool";

enum keys { aging = 'aging' };

@Component({
  components: {
    Ueditor
  }
})
export default class knowledgeAdd extends Vue {
  // 相似问题列表，至少存在一个元素，不能为空
  private questionList: Array<any> = [""];
  // post参数
  private params: any = {
    matchType: "part",
    question: "", // 核心问题
    answer: "",
    aging: "lasting",
    startTime: "",
    endTime: "",
    qaType: "",
    depotType: ""
  };
  // 验证规则
  private ruleValidate = <any>{
    question: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ],
    answer: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ],
    matchType: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ],
    aging: [
      {
        required: true,
        message: "请将信息填写完整"
      },
      {
        validator: this.validate(keys.aging)
      }
    ]
  };
  created() {
    this.params.depotType = this.$route.path.split('/')[2];
    if (this.$route.query.id) {
      this.getQuesAnswerInfo(this.$route.query.id)
    } else if (this.$route.query.unknowid) {
      this.params.question = this.$route.query.question
    }
  }
  private validate(key: keys) {
    let aging = (rule: any, value: any, callback: Function) => {
      if ((!this.params.startTime || !this.params.endTime) && this.params.aging === "interim") {
        return callback(new Error("请设置时间范围"))
      }
      return callback()
    }
    return {aging}[key]
  }
  // 时间
  private setTime(time: Array<string>) {
    this.params.startTime = time[0] + ":00";
    this.params.endTime = time[1] + ":00";
    (this.$refs.params as any).validateField("aging");
  }
  // 保存
  private save(isContinue?: boolean) {
    (this.$refs.params as any).validate((valid: boolean) => {
      if (valid) {
        let params = {...this.params, question: undefined}
        params.questionList = JSON.stringify([this.params.question, ...this.questionList.filter((q:string)=>q)])
        saveQuesAnswer(params).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("保存成功！");
            if (isContinue) {
              this.reset()
            } else {
              this.$router.push({ path: this.params.depotType === "knowledge" ? "/ques-base/knowledge" : "/ques-base/greeting" });
            }
            if (this.$route.query.unknowid) {
              deleteRecord({ids: this.$route.query.unknowid})
            }
          }
        })
      } else {
        this.$Message.error("请将信息填写完整!");
      }
    })
  }
  // reset
  private reset() {
    (this.$refs.params as any).resetFields();
    this.questionList = ['']
    this.params.answer = ''
    this.params.startTime = ""
    this.params.endTime = ""
    this.params.aging = "lasting"
    this.params.matchType = "part"
  }
  // 获取详情
  private getQuesAnswerInfo(id: any) {
    getQuesAnswerInfo({id}).then((res: any) => {
      if (res.code === 0) {
        let quesList = res.data.questionList as Array<string>
        res.data.question = quesList[0]
        this.questionList = quesList.slice(1).length ? quesList.slice(1) : [''];
        this.params = {...this.params, ...res.data};
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding: 30px;
  .w300 {
    width: 300px;
  }
  .tit {
    margin: 0 8px 20px;
  }
  .ques-btn {
    margin-left: 10px;
    width: 20px;
    height: 20px;
    display: inline-block;
    border: 1px solid;
    border-radius: 50%;
    position: relative;
    top: 6px;
    text-align: center;
    font-size: 20px;
    line-height: 15px;
    cursor: pointer;
    color: #3fa0da;
    transition: 0.3s;
    overflow: hidden;
    &:hover {
      color: #77c2ef;
    }
    &.add-btn {
      line-height: 19px;
    }
  }
}
</style>