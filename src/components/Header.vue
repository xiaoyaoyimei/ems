<template>
	<div>
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="getCollapsed?'logo-collapse-width':'logo-width'">
				{{getCollapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click="collapsed">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">
					<img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
	</div>
</template>

<script>
 import { mapGetters,mapActions } from 'vuex'
	export default {
			data() {
				return {
					sysName:'DXRACER',
					sysUserName: '方方大魔王',
					sysUserAvatar:require("../assets/logo.png")
				}
			},
		   computed: {
  					// 使用对象展开运算符将 getters 混入 computed 对象中
			    ...mapGetters([
			      'getCollapsed'
			      // ...
			    ])
    		},
			methods:{
					 ...mapActions([
		      		'collapsed' // 映射 this.increment() 为 this.$store.dispatch('increment')
		    ]),
			logout(){
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});
			},
			//折叠导航栏
		/*	collapse(){
				this.collapsed=!this.collapsed;
				this.$emit('listen-to',this.collapsed)
			}*/
		},
	}
</script>

<style scoped >

</style>