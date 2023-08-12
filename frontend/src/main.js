import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'

Vue.config.productionTip = false
// 配置请求的根路劲
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 设置请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log('config.headers.Authorization', config.headers.Authorization)
  return config
})
Vue.prototype.$http = axios

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
