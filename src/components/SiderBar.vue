<template>
	<!--导航菜单-->
	<el-menu :default-active="$route.path"  router  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="getCollapsed">
  <el-submenu index="1">
    <template slot="title">
      <i class="el-icon-location"></i>
      <span slot="title">导航一</span>
    </template>
 	<el-menu-item index="/components/table">表格</el-menu-item>
  </el-submenu>
	  <el-submenu index="2">
	         <template slot="title"> <i class="el-icon-menu"></i>
	        <span slot="title">导航二</span>
	        </template>
	        <el-menu-item index="/test/test">ceshi</el-menu-item>
	   </el-submenu>
</el-menu>
</template>

<script>
	 import { mapGetters,mapActions } from 'vuex'
	 export default {
	    data() {
	      return {
	      }
   		},
      computed: {
  					// 使用对象展开运算符将 getters 混入 computed 对象中
			    ...mapGetters([
			      'getCollapsed'
			      // ...
			    ])
    		},
	    methods: {
	     handleOpen(key, keyPath) {
	     	//this.refs['menu'].style.width="300px"
      		},
	      handleClose(key, keyPath) {
	      // this.refs['menu'].style.width="60px"
	      }
	    }
  }
</script>
</script>

<style>
</style>