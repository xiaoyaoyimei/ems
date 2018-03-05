<template>
 <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item class="breadcrumb-item" v-for="(item, index) in list" :key="item.id">
      <span class="active" v-if="isLast(index)">
      	{{item.name}}
      </span>
      <strong v-else>  	{{item.name}}</strong>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
	 export default {
	 	props:{
	 		list:{
	 			type:Array,
	 			required:true,
	 			default:()=>[]
	 		}
	 	},
	 	methods:{
	 		  isLast (index) {
      			return index === this.list.length - 1
    		}
  		}
    }
</script>

<style>

</style>