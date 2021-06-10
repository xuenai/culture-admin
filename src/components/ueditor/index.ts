/*
 * @Author: 任智勇
 * @since: 2019-07-08 15:38:06
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-08 15:38:47
 */
import ueditor from './ueditor.vue'
import { VueConstructor } from 'vue'

const phone = {
  install: function (Vue:VueConstructor) {
    Vue.component('Ueditor', ueditor)
  }
}
export default phone