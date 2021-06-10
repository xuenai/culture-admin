<template>
  <input
    type="number"
    ref="number"
    :placeholder="defaultPlaceHolder"
    class="ivu-input ivu-input-default"
    v-model="showNumber"
    @blur="blurFun"
    @input="onchange"
  >
</template>

<script lang='ts'>
/**
 * <number :v-model="formData.number" :precision="0"></phone>
 * precision  默认不传 可输入小数, 0只能输入整数
 * 请设置宽度、否则默认为100%宽度
 *
 */
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

@Component({ components: {} })
export default class ComponentName extends Vue {
  private showNumber: string = "";
  private defaultPlaceHolder:string='';
  private defaultPrecision:any='';
  @Prop() value: any;
  @Prop() min:any;
  @Prop() max:any;
  @Prop() placeholder:any;
  @Prop() precision:any; //默认显示小数  设置该值为0 则为整数
  mounted() {
    this.showNumber = this.value;
    this.defaultPlaceHolder = this.placeholder
    this.defaultPrecision = this.precision
  }
  // 监听电话号码变化
  @Watch("value", { immediate: true, deep: true })
  getValue(){
      this.showNumber = this.value
  }
  @Watch("showNumber", { immediate: true, deep: true })
  freshshowNumber(newCode: string) {
      let str='';
      if(this.defaultPrecision == 0) {
          str = newCode.toString().replace(/[^0-9]/g, ""); //正整数
      }else{
          str = newCode.toString().replace(/(([1-9][0-9]*)\.([0-9]{10}))|[0]\.([0-9]{10})/g, this.max.toString()); //小数
      }
      str = str.substr(0, 1) == '0' ? '1' + str.substr(1, str.length - 1) : str; //第一位如果输入0 则替换成1
      str = parseInt(str) >= this.max ? this.max.toString() : str; //如果大于最大输入值 就替换成最大值
      this.showNumber = str;
      this.$emit("input", str);
  }
  onchange () {
    setTimeout(() => {
      this.$emit('on-change', this.showNumber);
    })
  }
  private blurFun(){  //输入不规则小数点 比如2.3...3 这样的就会替换
      let value=(this.$refs.number as any).value;
      if(!value){
          (this.$refs.number as any).value="";
          this.$emit("input", (this.$refs.number as any).value);
      }
  }
}
</script>

<style lang='scss' scoped></style>
