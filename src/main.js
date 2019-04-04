// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router  from '@/router/index'
import store from '@/vuex/store'
import axios from './http';
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import global_ from '@/base/baseParam';
//设置全局变量

Vue.use(ElementUI)
Vue.prototype.global_=global_;Vue.config.productionTip = false
Vue.component('icon', Icon)
Vue.prototype.$axios = axios;
/* eslint-disable no-new */
var app =new Vue({
  el: '#app',
  router,
  store,
  components: { App ,Icon},
  template: '<App/>'
})


