import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import moment from 'moment';

Vue.config.productionTip = false
// 使用ElementUI
Vue.use(ElementUI)

// 配置全局axios请求的baseURL
// axios.defaults.baseURL = "http://3.112.132.86:8888/api/private/v1/"
axios.defaults.baseURL = "http://www.xiaomadagege.cn:8888/api/private/v1/"
// axios.defaults.baseURL = "http://54.65.230.22:8878/api/private/v1/"
// axios.defaults.baseURL = 'http://3.112.132.86:8878'


// 这个方法（axios拦截器）什么时候出发？发送axios请求时触发
// axios.interceptors.request.use(config => {
//   let token = localStorage.getItem('token')
//   if (token) {
//     config.header['Authorization'] = token
//   }
//   return config
// })
// Vue.config.productionTip = false
Vue.prototype.axios = axios

// 全局过滤器 处理时间
Vue.filter('formatDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')