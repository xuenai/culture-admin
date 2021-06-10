<template>
  <div class="head-container clearfix">
    <div class="head-img fl daq-no-photo">
      <img v-if="cover" :src="cover" class="cloud-img" alt />
    </div>
    <div class="info fl ml20">
      <h2 class="title mt10">{{data.name}}</h2>
      <Button type="primary" ghost class="room-type">{{data.type}}</Button>
      <Button type="primary" ghost class="room-type ml10">{{data.level}}</Button>
      <Button type="primary" ghost class="room-type ml10">{{data.batch}}</Button>
      <div class="address mt20">
        <span v-if="data.sysRegion">
          <i class="cloud-icon">&#xe606;</i>
          {{data.sysRegion}}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { getByHeritageItemId } from "@service/activity";

@Component({
  components: {}
})
export default class edit extends Vue {
  @Prop() resourceType: any;
  @Prop({default: ''}) value!: string;
  private data: object = {};
  private cover: string = "";
  @Emit()
  input (val:string) {
    return val
  }
  //头部非遗项目数据
  getHeadDesc() {
    getByHeritageItemId({ id: this.$route.query.pid }).then((res: any) => {
      if (res.code === 0) {
        this.data = res.data;
        this.$emit("getCode",res.data.resourceCode);
        this.cover = res.data.images ? res.data.images.split(",")[0] : "";
        this.input(res.data.sysRegion)
      }
    });
  }
  mounted() {
    this.getHeadDesc();
  }
}
</script>

<style scoped lang="scss">
.head-container {
  padding-bottom: 20px;
  border-bottom: 1px solid $borderLight;
  .head-img {
    border-radius: 5px;
    overflow: hidden;
    width: 160px;
    height: 120px;
  }
  .info {
    .title {
      font-size: 22px;
      font-weight: 600;
      color: $font01;
    }
    .room-type {
      min-width: 65px;
      height: 26px;
      line-height: 26px;
      padding: 0 5px;
      margin-top: 5px;
    }
    .address {
      color: $font04;
      font-size: 14px;
    }
  }
}
</style>
