import {Message, ModalInstance, Notice, Spin} from 'iview/types'
import { LoadingBarClass } from 'iview/types/loading-bar';

declare module 'vue/types/vue' {
  interface Vue {
    $Notice: Notice
    $Message: Message
    $Modal: ModalInstance
    $Loading: LoadingBarClass
    $Spin: Spin
    [key: string]: any
  }
}