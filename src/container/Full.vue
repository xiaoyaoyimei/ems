<template>
	<el-container>
  <el-header><app-header ></app-header></el-header>
  <el-container>
    <el-aside  width="200px"  :class="getCollapsed?'menu-collapsed':'menu-expanded'"><app-sider></app-sider></el-aside>
    <el-container>
      <el-main>
      	<bread-crumb :list="list" style="margin-bottom:20px"></bread-crumb><router-view></router-view></el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
	 import { mapGetters,mapActions } from 'vuex'
	import AppSider from '@/components/SiderBar'
	import BreadCrumb from '@/components/BreadCrumb'
	import AppHeader from '@/components/Header'
		export default {
			data(){
				return {
				}
			},
        components:{
        	AppSider,
        	BreadCrumb,
        	AppHeader
        },
        computed:{
        	 ...mapGetters([
      			'getCollapsed'
      // ...
  	 		 ]),
        	list(){
        		return this.$route.matched
        	}
        },
        methods:{
        /*	getcollapse(data){
        	  this.collapsed=data	
        	}*/
        }
       }
</script>

<style>

	.el-header{
		padding:0
	}
			.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		}
		.header {
			height: 60px;
			line-height: 60px;
			background: #3e97fd;
			color:#fff;
			}
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				}
			.userinfo	.userinfo-inner {
					cursor: pointer;
					color:#fff;
					}
				.userinfo-inner	img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
			
			.logo {
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				}
			.logo	img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.logo .txt {
					color:#fff;
				}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:65px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		.main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			}
		.main 	aside {
				flex:0 0 230px;
				width: 230px;
				}
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:65px;
					}
				.collapsed	.item{
						position: relative;
					}
				.collapsed	.submenu{
						position:absolute;
						top:0px;
						left:65px;
						z-index:99999;
						height:auto;
						display:none;
					}

			
			.menu-collapsed{
				flex:0 0 65px;
				width: 65px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				flex:1;
				overflow-y: scroll;
				padding: 20px;
				}
				.breadcrumb-container	.title {
						width: 200px;
						float: left;
						color: #475669;
					}
							.breadcrumb-container	.breadcrumb-inner {
						float: right;
					}
							.breadcrumb-container .content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
	
</style>