import PhoneComponent from './unNecessaryPhoneInput.vue'
import { VueConstructor } from 'vue'

const phone = {
  install: function (Vue:VueConstructor) {
    Vue.component('phone', PhoneComponent)
  }
}
export default phone