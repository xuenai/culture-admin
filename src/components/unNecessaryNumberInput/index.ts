import PhoneComponent from './unNecessaryNumberInput.vue'
import { VueConstructor } from 'vue'

const number = {
  install: function (Vue:VueConstructor) {
    Vue.component('number', PhoneComponent)
  }
}
export default number
