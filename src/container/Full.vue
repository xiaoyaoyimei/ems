<template>
	<el-container>
 <app-header ></app-header>
  <el-col :span="24" class="mainview">
    <el-aside    :class="getCollapsed?'menu-collapsed':'menu-expanded'" ><app-sider></app-sider></el-aside>
    <el-container class="content-container">
      <el-main>
      	<bread-crumb></bread-crumb>
      	<router-view></router-view>
      </el-main>
      <el-footer><app-footer></app-footer></el-footer>
    </el-container>
  </el-col>
</el-container>
</template>

<script>
	 import { mapGetters,mapActions } from 'vuex'
	import AppSider from '@/components/SiderBar'
	import BreadCrumb from '@/components/BreadCrumb'
	import AppHeader from '@/components/Header'
	import AppFooter from '@/components/Footer'
		export default {
			data(){
				return {
				}
			},
        components:{
        	AppSider,
        	BreadCrumb,
        	AppHeader,
        	AppFooter
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

<style lang="scss">
 @import '~scss_color';
table {
	.fa{
		cursor: pointer;
    font-size: 1.125rem;
    margin-right: 5px;
	}
}
 .text-center{
 	text-align: center;
 }
.el-submenu i[class^="fa"]{
	 vertical-align: middle;
	margin-right: 5px;
	width: 24px;
	text-align: center;
	font-size: 18px;
 }
 .el-container .el-menu-item.is-active{
	color:$color-primary;
}
.el-button--primary{
	background-color:$color-primary;
	border-color:$color-primary;
}
 .m40{
 	max-width:40px;
 	max-height: 40px;
 	cursor: pointer;
 }
 .mb10{
 	margin-bottom:10px;
 }
.toolbar {
    background: #f2f2f2;
    padding:10px;
    margin: 10px 0px;
    .el-form-item{
					margin-bottom:0px
				}
}
 .mainview{
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    }
.el-menu {
    border-radius: 2px;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #eef1f6;
    height: 100%;
}
.el-table {
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    border: 1px solid #dfe6ec;
    font-size: 14px;
    color: #1f2d3d;
	th {
	    white-space: nowrap;
	    overflow: hidden;
	    background-color: #eef1f6;
	    text-align: left;
	    padding:6px 0
	}
	td{
		padding:5px 0
	}
}

				.collapsed{
					width:65px;
					.item{
						position: relative;
					}
					.submenu{
							position:absolute;
							top:0px;
							left:65px;
							z-index:99999;
							height:auto;
							display:none;
						}
                }
			.menu-collapsed{
				flex:0 0 65px;
				width: 65px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
.breadcrumb-container{
  	.title {
		width: 200px;
		float: left;
		color: #475669;
	}
	.breadcrumb-inner {
		float: right;
	}
	.content-wrapper {
		background-color: #fff;
		box-sizing: border-box;
	}
}
el-breadcrumb__item:last-child{
	color:#97a8be
}
.el-pagination {
	float:right;
    white-space: nowrap;
    padding: 2px 5px;
    color: #48576a;
		.el-pager, .el-pager li {
		    vertical-align: top;
		    display: inline-block;
		    margin: 0;
		}
		 .el-pager li{
			border-width:1px 0 1px 1px;
			border-style:solid;
			border-color:$color-border;
			padding: 0 4px;
		    background: #fff;
		    font-size: 13px;
		    min-width: 28px;
		    height: 28px;
		    line-height: 28px;
		    text-align: center;
		}
		.el-pager li.active {
		    border-color: $color-primary;
		    background-color: $color-primary;
		    color: #fff;
		    cursor: default;
		}
		 button.disabled {
		    color: #e4e4e4;
		    background-color: #fff;
		    cursor: not-allowed;
		}
		.btn-next, .btn-prev {
		    background: center center no-repeat #fff;
		    background-size: auto auto;
		    background-size: 16px;
		    border: 1px solid $color-border;
		    border-left-width: 1px;
		    border-left-style: solid;
		    border-left-color: rgb(209, 219, 229);
		    cursor: pointer;
		    margin: 0;
		    color: #97a8be;
		}
		 .btn-prev {
		    border-radius: 2px 0 0 2px;
		    border-right: 0;
		}
		 .btn-next {
		    border-radius: 0 2px 2px 0;
		    border-left: 0;
		}
		li:last-child {
		    border-right: 1px solid $color-border;
		}

}
</style>