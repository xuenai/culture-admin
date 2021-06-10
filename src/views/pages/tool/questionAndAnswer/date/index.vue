<template>
  <div class="box">
    <SelectDate ref="date" @select="d => range = d"></SelectDate>
    <EditGreet :range="range" @saveFinish="b => b && $refs.date.refresh()"></EditGreet>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import SelectDate from './SelectDate.vue';
import EditGreet from './editGreet.vue';

@Component({
  components: {
    SelectDate,
    EditGreet
  }
})
export default class ComponentName extends Vue {
  private range: any = null;
}
</script>

<style lang='scss' scoped>
.box {
  display: flex;
}
</style>
