<template>
  <div class="wrap">
    <Form :label-width="50" inline>
      <FormItem class="item" label="编号">
        <Input placeholder="请输入编号" v-model="data.code" @on-enter="handleSubmit" />
      </FormItem>
      <FormItem class="item" label="名称">
        <Input placeholder="请输入场馆名称" v-model="data.name" @on-enter="handleSubmit" />
      </FormItem>
      <FormItem class="item" label="状态">
        <Select class="w150" v-model="data.status" @on-change="handleSubmit">
          <Option value="" selected>全部</Option>
          <Option value="1">正常</Option>
          <Option value="2">禁用</Option>
          <Option value="3">草稿</Option>
          <Option value="4">待审核</Option>
          <Option value="7">回退</Option>
          <Option value="8">撤回</Option>
          <Option value="9">终止</Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="类型">
        <Select class="w150" v-model="data.type" @on-change="handleSubmit">
          <Option value="">
            全部
          </Option>
          <Option :value="item.value" v-for="(item,index) in venueTypes" :key="index">
            {{item.name}}
          </Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="等级">
        <Select class="w150" v-model="data.venueLevel" @on-change="handleSubmit">
          <Option value="">
            全部
          </Option>
          <Option :value="item.value" v-for="(item,index) in venueLevels" :key="index">
            {{item.name}}
          </Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="时间">
        <Date-picker type="daterange" placement="bottom-end" placeholder="选择日期" @on-change="getDate" :value="date"></Date-picker>
      </FormItem>
      <div class=" submit">
        <Button type="primary" class="" @click="handleSubmit">搜索</Button>
        <!-- <router-link :to="{path:'/venues-add'}" v-if="operates.includes('save') && $store.state.app.userInfo.dataType !== 'SITE'" class="btn-primary ml10">添加</router-link> -->
        <!-- <router-link :to="{path:'/venues-search'}" v-if="operates.includes('save') " class="btn-primary ml10">添加</router-link> -->
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { dictType } from "@service/common";
import { AppModule } from "@store/modules/app";
@Component
export default class contentSearch extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private date: string = "";
  private data: any = {
    code: "", //编号
    name: "", //场馆名称
    status: "", //状态
    type: "", //类型
    venueLevel: "", //等级
    startTime: "", //开始时间
    endTime: "" //结束时间
  };
  // 选择时间段
  getDate(date: any) {
    this.date = date;
    this.data.startTime = date[0];
    this.data.endTime = date[1];
    this.handleSubmit();
  }
  //获取场馆类型
  private venueTypes: object = {};
  getVenueType() {
    let _this = this;
    dictType({
      type: "VENUE_TYPE"
    }).then((res: any) => {
      _this.venueTypes = res.datas;
    });
  }
  //获取场馆类型
  private venueLevels: object = {};
  getVenueLevel() {
    let _this = this;
    dictType({
      type: "VENUE_LEVEL"
    }).then((res: any) => {
      _this.venueLevels = res.datas;
    });
  }
  handleSubmit() {
    this.bus.$emit("requestVenuesList", this.data);
  }
  mounted() {
    this.getVenueType();
    this.getVenueLevel();
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
