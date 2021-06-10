import Vue from 'vue'
import Vuex from 'vuex'
import { AppModule } from './modules/app'

Vue.use(Vuex)

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store({})
