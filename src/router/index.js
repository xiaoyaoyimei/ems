import HelloWorld from '@/components/HelloWorld'
import TableTest from '@/views/pages/TableTest'
import Sear from '@/views/pages/Sear'
import Full from '@/container/Full'
import Login from '@/views/Login'
let routes = [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      hidden:true
    },
      {
      path: '/login',
      name: '登录',
      component: Login,
      hidden:true
    },
    {
			path: '/components',
			name:'导航一',
			iconCls: 'el-icon-location',//图标样式class
			redirect: '/components/table',
			component: Full,
			children: [
				{
					name:'表格',
					path: 'table',
					component: TableTest
				}
				]
		},
        {
			path: '/test',
			name:'导航er',
			iconCls: 'el-icon-menu',
			redirect: '/test/test',
			component: Full,
			children: [
				{
					name:'测试导航',
					path: 'test',
					component: Sear
				}
				]
		}
  ]
export default routes;