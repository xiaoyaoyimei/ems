<template>
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
					<el-dropdown trigger="hover" style="margin-right:20px;">
					<span class="el-dropdown-link userinfo-inner">
					{{sysUserCompany}}<i class="el-icon-arrow-down el-icon--right"></i></span>
					<el-dropdown-menu slot="dropdown" >
						<el-dropdown-item v-for="item in groupCompanys" @click.native="changecompanyId(item)" :key="item.id">{{item.companyName}}</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">
					{{sysUserName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
</template>

<script>
 import { mapGetters,mapActions } from 'vuex';
  export default {
			data() {
				return {
					sysName:'DXRACER',
					sysUserName: '',
					sysUserCompany:'',
					groupCompanys:[]
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
						this.$axios({
								    method: 'post',
								    url:'/system/user/logout',
								}).then((res)=>{
								  sessionStorage.removeItem('user');
									_this.$router.push('/login');
								})
							}).catch(() => {
							});
			},
			changecompanyId(data){
				this.sysUserCompany=data.companyName;
				sessionStorage.setItem('companyId',data.id);
				window.location.reload()
			},
		},
			mounted() {
			var message = sessionStorage.getItem('message');
			if (message) {
				message = JSON.parse(message);
				this.sysUserName = message.user.realName || '';
				this.groupCompanys=message.user.groupCompanys||[];
				if(sessionStorage.getItem('companyId')!=null){
					for (let i=0;i<message.user.groupCompanys.length;i++){
						if(message.user.groupCompanys[i].id == sessionStorage.getItem('companyId')){
							this.sysUserCompany=message.user.groupCompanys[i].companyName;
						}
					}
				}else{
					this.sysUserCompany=message.user.groupCompanys[0].companyName||'';	
				}
				if(sessionStorage.getItem('companyId')!=null){
					this.$axios.defaults.headers['companyId'] = sessionStorage.getItem('companyId');
				}else{
					this.$axios.defaults.headers['companyId']=message.user.groupCompanys[0].id;
				}
			}

		}
	}
</script>

<style scoped  lang="scss">
@import '~scss_color';
.header {
	 		padding:0;
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
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
		}
</style>