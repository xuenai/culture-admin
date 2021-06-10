<template>
  <Form class="form" ref="params" :model="params" :rules="ruleValidate" :label-width="90">
    <Tabs v-model="currTab" class="tabs">
      <TabPane label="1. 新增课程" class="pane">
        <FormItem label="课程名称" prop="name">
          <Input placeholder="请填写课程名称" v-model="params.name" :maxlength="20" class="w300" />
        </FormItem>
        <FormItem label="所属分类" prop="typeId">
          <Select v-model="params.typeId" filterable class="w300" style="text-align:left;">
            <Option v-for="course in courseTypeList" :value="course.id" :key="course.id" :label="course.name">
              {{course.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="主讲人" prop="lecturerId">
          <Select v-model="params.lecturerId" filterable class="w300">
            <Option v-for="lecturer in lecturerList" :value="lecturer.id" :key="lecturer.id" :label="lecturer.name">
              {{lecturer.name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="封面图" prop="image">
          <UploadImg :defaultImage="defaultImage" @getImagesList="arr => {params.image = arr[0];$refs.params.validateField('image')}"
            :limit="1" :wToh="{}" :compress="1"></UploadImg>
        </FormItem>
        <!-- <FormItem label="排序" prop="sort">
          <InputNumber :min="1" :max="999" v-model="params.sort" class="w300"></InputNumber>
        </FormItem> -->
        <FormItem label="课程简介" prop="introduction">
          <Input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
            v-model="params.introduction" :maxlength="150" class="w300" />
        </FormItem>
        <FormItem label="课程目标" prop="courseAims">
          <Ueditor id="uedit1" v-model="params.courseAims"></Ueditor>
        </FormItem>
        <FormItem label="主要内容" prop="content">
          <Ueditor id="uedit2" v-model="params.content"></Ueditor>
        </FormItem>
        <FormItem label="思考问题" prop="thinkingProblem">
          <Ueditor id="uedit3" v-model="params.thinkingProblem"></Ueditor>
        </FormItem>
        <FormItem label="面向对象" prop="objectOriented">
          <Button class="level-item" :type="label.checked ? 'success' : 'default'"
            v-for="label in forUserLabel" :key="label.id"
            @click="label.checked = !label.checked">{{ label.labelName }}</Button>
          <Button @click="addTagModle = true">＋添加</Button>
        </FormItem>
        <FormItem class="formItem" label="">
          <Button @click="() => {currTab = 1; $refs.params.$el.parentElement.parentElement.parentElement.scrollTop=0 }" type="primary">下一步</Button>
        </FormItem>
      </TabPane>

      <TabPane label="2. 编辑课程信息" class="pane">
        <p class="tip">小提示：拖拽章、节可排序！</p>
        <Card class="card" v-for="(chapter, i) in chapterTypeVOS" :key="i"
          v-dragging="{ list: chapterTypeVOS, item: chapter, group: 'chapterTypeVOS' }">
          <p class="title" slot="title">
            {{i+1}} 章名称 <Input v-model="chapter.name" :maxlength="20" class="w300" placeholder="输入章名字" />
            <Button class="fr"
              @click="chapterTypeVOS.splice(i + 1, 0, {name: '',ctcSchoolChapterVOS: [{name: '',duration: 0,playNum: 0,address: '',loading:false}]} )">＋插入章</Button>
            <Button class="fr mr24"
              @click="chapterTypeVOS.length > 1 && chapterTypeVOS.splice(i, 1)">－删除章</Button>
          </p>
          <div class="items" v-for="(section, j) in chapter.ctcSchoolChapterVOS" :key="j"
            v-dragging="{ list: chapter.ctcSchoolChapterVOS, item: section, group: 'ctcSchoolChapterVOS' + i }">
            {{`${i+1}.${j+1}`}} 节名称 <Input v-model="section.name" :maxlength="20" placeholder="输入节名字"
              class="w200 mr24" />
            时长 <Input :value="formatt(section.duration)" readonly :maxlength="100" class="w200 mr24" />
            <!-- 播放量 <InputNumber v-model="section.playNum" :maxlength="100" class="w200 mr24" /> -->
            视频 <Input readonly v-model="section.address" :maxlength="100" class="w200 mr24" />
            <Button :loading="section.loading" :disabled="section.loading" @click="()=>{$refs.fileInput.click();currSection=section}">{{
                section.loading ? '上传中' : section.address ? '重新上传' : '点击上传'
              }}</Button>
            <span class="delete-btn ques-btn"
              @click="chapter.ctcSchoolChapterVOS.length > 1 && chapter.ctcSchoolChapterVOS.splice(j, 1)">-</span>
            <span class="add-btn ques-btn" @click="chapter.ctcSchoolChapterVOS.splice(j + 1, 0, {name: '',duration: 0,playNum: 0,
          address: '',loading:false} )">+</span>
          </div>
        </Card>
        <input class="upload-file" type="file" accept="video/*" ref="fileInput"
          @change="acceptFile" />

        <Button @click="handleSave()" type="primary">保存</Button>
        <Button @click="currTab = 0" type="primary" class="ml10">上一步</Button>
        <Button type="primary" class="ml10" @click="back">返回</Button>
      </TabPane>
    </Tabs>

    <Modal v-model="addTagModle" title="添加标签" :width="400" footer-hide>
      <Form ref="tagParams" :model="tagParams" :rules="ruleTagValidate" :label-width="70" >
        <FormItem label="标签名称" prop="labelName">
          <Input v-model="tagParams.labelName" :maxlength="10" placeholder="请输入标签名称"/>
        </FormItem>
        <FormItem>
          <Button class="btn" @click="()=>{ addTagModle = false; tagParams.labelName = ''}">取消</Button>
          <Button class="btn" type="primary" @click="saveTags" style="margin-left:20px;">确认</Button>
        </FormItem>
      </Form>
    </Modal>
  </Form>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadImg from "@components/upload/upload-image-6.vue";
import { AppModule } from "@store/modules/app";
import {
  getSchoolCourse,
  saveSchoolCourse,
  getSchoolCourseTypeList,
  getSchoolLecturerList
} from "@service/tool";
import { getTagsSelect, saveTags } from "@service/common";
import Ueditor from "@components/ueditor/ueditor.vue";
import { uploadImage } from "@service/content";
import { getTime, getVideoCover } from "@util/comm"

@Component({
  components: {
    Ueditor,
    UploadImg
  }
})
export default class BrandAdd extends Vue {
  // 添加面向对象标签显示boolean值
  private addTagModle: boolean = false
  // 当前tab值
  private currTab: number = 0
  // 默认封面图
  private defaultImage: string[] = []
  // 新增标签参数对象
  private tagParams: any = { labelName: '', resourceType: 'CONTENT_TYPE_COURSE' }
  // 新增标签验证规则对象
  private ruleTagValidate = <any>{
    labelName: [{
      required: true,
      message: "请将信息填写完整",
      trigger: "blur"
    }]
  }
  // 表单提交参数
  private params = <any>{
    thinkingProblem: "",
    content: "",
    courseAims: "",
    objectOriented: "",
    lecturerId: "",
    typeId: "",
    introduction: "",
    image: "",
    name: ""
  }
  // 表单验证规则
  private ruleValidate = <any>{
    name: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      },
      {
        message: "只能输入1-20个字符",
        trigger: "blur",
        pattern: /^.{1,20}$/
      }
    ],
    typeId: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "change",
        pattern: /\d+/
      }
    ],
    lecturerId: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "change",
        pattern: /\d+/
      }
    ],
    image: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "change"
      },
      {
        validator: this.validateImage
      }
    ],
    introduction: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      }
    ]
  }
  // 章节信息
  private chapterTypeVOS: any[] = [
    {
      name: "",
      ctcSchoolChapterVOS: [
        {
          name: "",
          duration: 0,
          playNum: 0,
          address: "",
          loading: false
        }
      ]
    }
  ]
  // 添加面向对象标签的类型
  private labelType: string = 'CONTENT_TYPE_COURSE'
  // 当前上传视频的数据项坐标
  private currSection: any = null
  beforeRouteLeave(to:any, from:any, next: Function) {
    if (to.path === '/course-add') {
      (this.$refs.params as any).resetFields();
      this.params.id = ''
      this.defaultImage = []
      this.forUserLabel.forEach((d:any) => d.checked = false)
      this.chapterTypeVOS = [
        {
          name: "",
          ctcSchoolChapterVOS: [
            {
              name: "",
              duration: 0,
              playNum: 0,
              address: "",
              loading: false
            }
          ]
        }
      ]
    }
    next()
  }
  created() {
    this.currTab = Number(this.$route.query.currTab || 0)
    if (this.$route.query.id) {
      this.getSchoolCourse(this.$route.query.id).then(() => {
        this.getTagsSelect();
      })
    } else {
      this.getTagsSelect();
    }
    this.getSchoolCourseTypeList();
    this.getSchoolLecturerList();
  }

  // 面向对象点选改变就设置在params上
  @Watch('forUserLabel', {deep: true})
  setLabel(n: any) {
    this.params.objectOriented = this.forUserLabel.filter((d:any) => d.checked).map((d:any) => d.labelName).join('、')
  }

  // 验证图片
  private validateImage(rule: any, value: any, callback: Function) {
    if (this.params.image) {
      return callback()
    } else {
      return callback(new Error("请将信息填写完整"))
    }
  }
  
  // 格式化时间
  private formatt(second: number): string {
    let arr: string[] = []
    if (second) {
      arr.push(('0' + (second % 60)).slice(-2) + '秒');
      arr.push(('0' + (Math.floor(second / 60) % 60)).slice(-2) + '分');
      arr.push(Math.floor(second / 60 / 60) + '小时');
      arr.reverse()
    }
    return arr.filter((e: string) => /[1-9]+/.test(e)).join('') || '0'
  }

  // 文件选择handler
  private acceptFile(e: any) {
    let file = e.target.files[0];
    e.target.value = null;
    let formData = new FormData();
    formData.append("Filedata", file);
    formData.append("path", "cultural-tourism-cloud");
    let { currSection } = this
    currSection.loading = true
    uploadImage(formData).then((res:any) => {
      if (res.state === 0) {
        currSection.address = res.url
      }
    }).finally(() => { currSection.loading = false })
    getTime(file).then(res => {
      currSection.duration = Math.ceil(res.duration)
    }).catch((e) => {
      this.$Message.error('资源时长获取失败！')
    })
  }

  // 新增保存面向对象标签
  private saveTags() {
    (this.$refs.tagParams as any).validate((valid: boolean) => {
      if (valid) {
        saveTags(this.tagParams).then(res => {
          if (res.code === 0) {
            this.addTagModle = false
            this.$Message.success('添加成功！');
            this.getTagsSelect();
            this.tagParams.labelName = ''
          }
        })
      } else {
        this.$Message.info("请将信息填写完整！");
      }
    })
  }

  // 课程类型列表
  private courseTypeList: any[] = [];
  private getSchoolCourseTypeList() {
    getSchoolCourseTypeList({ pageSize: 9999 }).then((res: any) => {
      if (res.code === 0) {
        this.courseTypeList = res.datas;
      }
    })
  }

  // 讲师列表
  private lecturerList: any[] = [];
  private getSchoolLecturerList() {
    getSchoolLecturerList({ pageSize: 9999 }).then((res: any) => {
      if (res.code === 0) {
        this.lecturerList = res.datas;
      }
    })
  }

  // 面向对象标签
  private forUserLabel: any[] = []
  private getTagsSelect() {
    return getTagsSelect({ resourceType: this.labelType }).then((res: any) => {
      if (res.code === 0) {
        if (this.params.objectOriented) {
          res.datas.forEach((d:any) => d.checked = this.params.objectOriented.split('、').includes(d.labelName))
        } else {
          res.datas.forEach((d:any) => d.checked = false)
        }
        this.forUserLabel = res.datas
      }
    })
  }

  // 获取课程详情
  private getSchoolCourse(id: any) {
    return getSchoolCourse({ id }).then((res: any) => {
      if (res.code === 0) {
        let formData = res.data.data
        this.params = formData
        let chapterTypeVOS = formData.chapterTypeVOS || this.chapterTypeVOS
        chapterTypeVOS.forEach((chapter:any) => {
          chapter.ctcSchoolChapterVOS.forEach((section:any) => { section.loading = false })
        })
        this.chapterTypeVOS = chapterTypeVOS
        this.defaultImage = [formData.image]
      }
    })
  }

  // 点击保存
  private handleSave() {
    let { chapterTypeVOS } = this
    chapterTypeVOS = JSON.parse(JSON.stringify(chapterTypeVOS))
    if (  
      chapterTypeVOS.some((chapter:any) => {
        chapter.name = chapter.name.trim()
        return !Boolean(chapter.name) || chapter.ctcSchoolChapterVOS.some((section:any) => {
          delete section.loading
          section.name = section.name.trim()
          return !Boolean(section.name) || !Boolean(section.address)
        })
      })
    ) {
      this.$Message.info('请完善章节信息！');
      return
    } else {
      this.params.chapterTypeVOS = chapterTypeVOS
    }

    (this.$refs.params as any).validate((valid: any) => {
      if (valid) {
        saveSchoolCourse(this.params).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("保存成功！")
            if (this.$route.query.id) {
              this.back()
            } else {
              this.$router.push({ path: "/course-list" })
            }
          }
        })
      } else {
        this.$Message.info("请将表单信息填写完整！")
      }
    })
  }

  // 返回
  private back() {
    window.history.back()
  }
}
</script>

<style lang='scss' scoped>
.w300 {
  width: 300px;
}
.w200 {
  width: 200px;
}
.mr24 {
  margin-right: 24px;
}
.form {
  padding: 20px;
  .tabs {
    .level-item {
      margin-right: 10px;
    }
  }
  .card {
    margin: 0 200px 20px 0;
    background: linear-gradient(to bottom, #f2f4f5, #fff);
    .title {
      height: auto;
    }
    .items:not(:last-child) {
      margin-bottom: 15px;
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
  .tip {
    margin-bottom: 10px;
  }
  .upload-file {
    display: none;
  }
}
</style>
