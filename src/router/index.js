let routes = [
    {
      path: '/',
      redirect: '/login',
      hidden:true
    },
      {
      path: '/login',
      name: '登录',
      component:  resolve => require(['@/views/Login.vue'], resolve),
      hidden:true
    },
    {
			path: '/product',
			name:'产品管理',
			iconCls: 'el-icon-goods',//图标样式class
			redirect: '/product/productsku',
			component:  resolve => require(['@/container/Full.vue'], resolve),
			children: [
				{
					name:'产品列表',
					path: '/product/productsku',
					component: resolve => require(['@/views/pages/product/ProductSku.vue'], resolve)
				}
				]
		},
    {
			path: '/system',
			name:'系统管理',
			iconCls: 'el-icon-star-on',//图标样式class
			redirect: '/system/role',
			component:  resolve => require(['@/container/Full.vue'], resolve),
			children: [
				{
					name:'权限列表',
					path: '/system/systemresource',
					component: resolve => require(['@/views/pages/system/SystemResource.vue'], resolve)
				},
				{
					name:'角色列表',
					path: '/system/role',
					component: resolve => require(['@/views/pages/system/SystemRole.vue'], resolve)
				},
				{
					name:'用户管理',
					path: '/system/user',
					component: resolve => require(['@/views/pages/system/SystemUser.vue'], resolve)
				}
				]
		},
        {
			path: '/group',
			name:'集团管理',
			iconCls: 'el-icon-menu',
			redirect: '/group/baseinfo',
			component:resolve => require(['@/container/Full.vue'], resolve),
			children: [
					{
						name:'集团列表',
						path: '/group/groupbase',
						component: resolve => require(['@/views/pages/group/GroupBase.vue'], resolve)
					},{
						name:'公司信息',
						path: '/group/company',
						component: resolve => require(['@/views/pages/group/GroupCompany.vue'], resolve)
					}
				]
		},
		{
	        path: '*',
	        component:resolve => require(['@/container/Full.vue'], resolve),
	        hidden:true,
	        children: [
					{
						name:'错误信息',
						path: '/404',
						component: resolve => require(['@/views/404.vue'], resolve)
					}
					]
    	},
  ]
export default routes;