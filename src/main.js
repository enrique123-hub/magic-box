import Vue from 'vue'
import App from './App.vue'

import './style/reset.css'
import './style/color.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
