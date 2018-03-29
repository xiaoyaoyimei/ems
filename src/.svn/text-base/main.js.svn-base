// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import store from '@/vuex/store'
import 'font-awesome/css/font-awesome.min.css'
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.config.productionTip = false
import axios from 'axios';
import global_ from '@/base/baseParam';
axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.global_=global_;
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://10.0.0.24:8888/dxracer/web';
axios.defaults.withCredentials=true
axios.interceptors.response.use((result) => {  
    /* 假设当status为200时代表响应成功 */
    if (result.status != 200) {
        return Promise.reject(result)
    }
    return result.data
}, result => {
    return Promise.reject(result)
})
/*axios.defaults.headers.common['Authorization'] = store.getState().session.token;*/
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('message');
    sessionStorage.removeItem('companyId');
  }
  let loginuserinfo = JSON.parse(sessionStorage.getItem('message'));
//  let companyId=sessionStorage.getItem('companyId')
  if(loginuserinfo){
  	axios.defaults.headers['token']=loginuserinfo.token;
  	console.log(axios.defaults.headers['token']);
//	if(companyId==null){
//		axios.defaults.headers['companyId']=loginuserinfo.user.groupCompanys[0].id;
//	}
  }
  if (!loginuserinfo && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
Vue.filter('imgfilter', function (value) {
  if (!value) return ''
  value = value.toString()
  return  global_.imgurl+value
})
var ems=new Vue({
  el: '#app',
  router,
  store,//使用store
  components: { App },
  template: '<App/>'
})
