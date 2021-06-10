import MediaVue from './media-pop.vue'

// 默认配置
const defaultParam = {
  show: true,
  sourceType: 0,
  close: ()=>{},
  createUser: '',
  saveToSource: false,
  selectIds: [],
  selectUrls: [],
  onSure: () => {}
}

let Media: (options: any, instanceOption: {instance: any, destroy: Function} | null) => any = (options, instanceOption: {instance: any, destroy: Function} | null) => {
  options = { ...defaultParam, ...options }
  if (instanceOption) {
    if (!instanceOption.instance) {
      (MediaVue as any).currSourceType = options.sourceType
      instanceOption.instance = new MediaVue()
      instanceOption.instance.vm = instanceOption.instance.$mount()
      document.body.appendChild(instanceOption.instance.vm.$el)
    }
    instanceOption.instance = Object.assign(instanceOption.instance, { ...options })
    instanceOption.destroy = () => {
      document.body.removeChild((instanceOption as any).instance.vm.$el)
      instanceOption = null
    }
    return instanceOption
  }
}

// Media.install = (Vue) => {
//   Vue.prototype.Media = Media
// }
export default Media
