<template>
    <div class="wrap">
        <Form :label-width="50" inline>
            <FormItem class="item" label="编号">
                <Input  placeholder="请输入编号" v-model="data.code" @on-enter="handleSubmit"/>
            </FormItem>
            <FormItem class="item" label="名称">
                <Input  placeholder="请输入酒店名称" v-model="data.name" @on-enter="handleSubmit"/>
            </FormItem>
            <FormItem class="item" label="状态">
                <Select class="w150" v-model="data.status" @on-change="handleSubmit">
                    <Option value="" selected>全部</Option>
                    <Option value="1" >正常</Option>
                    <Option value="2">禁用</Option>
                    <Option value="3">草稿</Option>
                    <Option value="4">待审核</Option>
                    <Option value="7">回退</Option>
                    <Option value="8">撤回</Option>
                    <Option value="9">终止</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="等级">
                <Select class="w150" v-model="data.level" @on-change="handleSubmit">
                    <Option value="" selected>全部</Option>
                    <Option value="五星级" >五星级</Option>
                    <Option value="四星级">四星级</Option>
                    <Option value="三星级">三星级</Option>
                    <Option value="二星级">二星级</Option>
                    <Option value="一星级">一星级</Option>
                    <Option value="无星级">无星级</Option>
                    <Option value="金树叶级绿色饭店">金树叶级绿色饭店</Option>
                    <Option value="银树叶级绿色饭店">银树叶级绿色饭店</Option>
                    <Option value="金鼎级文化主题旅游饭店">金鼎级文化主题旅游饭店</Option>
                    <Option value="银鼎级文化主题旅游饭店">银鼎级文化主题旅游饭店</Option>
                    <Option value="银鼎级文化主题旅游饭店">银鼎级文化主题旅游饭店</Option>
                    <Option value="三星级农家乐">三星级农家乐</Option>
                    <Option value="四星级农家乐">四星级农家乐</Option>
                    <Option value="五星级农家乐">五星级农家乐</Option>
                    <Option value="一级主题饭店">一级主题饭店</Option>
                    <Option value="二级主题饭店">二级主题饭店</Option>
                    <Option value="三级主题饭店">三级主题饭店</Option>
                    <Option value="四级主题饭店">四级主题饭店</Option>
                    <Option value="五级主题饭店">五级主题饭店</Option>
                </Select>
            </FormItem>
            <FormItem class="item" label="时间">
                <Date-picker type="daterange" placement="bottom-end" placeholder="选择日期" @on-change="getDate" :value="date"></Date-picker>
            </FormItem>
            <div class="submit">
                <Button type="primary" class="" @click="handleSubmit">搜索</Button>
                <!-- <router-link :to="{path:'/hotel-add'}" v-if="operates.includes('save')&& $store.state.app.userInfo.dataType !== 'SITE'" class="btn-primary ml10">添加</router-link> -->
                <router-link :to="{path:'/hotel-search'}" v-if="operates.includes('save')" class="btn-primary ml10">添加</router-link>
            </div>
        </Form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@store/modules/app'
import { dictType } from '@service/common'
@Component
export default class search extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates
  }
  private date: string = ''
  private data: any = {
    code: '', //编号
    name: '', //场馆名称
    status: '', //状态
    level: '', //星级
    startTime: '', //提交时间
    endTime: '' //提交时间
  }
  // 选择时间段
  getDate(date: any) {
    this.date = date
    this.data.startTime = date[0]
    this.data.endTime = date[1]
    this.handleSubmit()
  }
  handleSubmit() {
    this.bus.$emit('requestHotelList', this.data)
  }
  private level:any=[];
  getLevel(){
    dictType({type:'HOTEL_LEVEL'}).then((res:any)=>{
      if(res.code==0){
        this.level=res.datas;
      }
    })
  }
  created(){
    this.getLevel();
  }
}
</script>

<style scoped lang="scss">
.inp-control {
  width: 70%;
}
.label-name {
  width: 75px;
  line-height: 35px;
}
.w150 {
  width: 150px;
}
.wrap {
  padding: 15px 15px 0 15px;
  background-color: $grayLight;
  .submit {
    display: inline-block;
    margin: 0 0 15px 10px;
  }
  .ivu-form-item {
    margin-bottom: 15px !important;
  }
}
</style>
