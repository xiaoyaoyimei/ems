import axios from 'axios';
import router from '@/router/index';

// axios 配置
console.log(process.env.API_HOST)
axios.defaults.timeout = 9000;
//测试环境
axios.defaults.baseURL =`/api`;
//修改flj
//生产环境
//axios.defaults.baseURL='/mall/pc'
// http request 拦截器
axios.interceptors.request.use(
    config => {
//      if (store.state.token) {
//        config.headers['token'] = store.state.token;
//		  config.headers['loginUserId']=store.state.userId
//      }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
    	if(response.data.code=='401'){
    		 store.commit('LOGOUT');
    		  router.replace({
                        name: '/login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
    	  }
        return response.data;
    },
    error => {
       // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response)
    });

export default axios;
