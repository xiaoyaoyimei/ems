<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters">
				<el-form-item>
					 <el-select v-model="filters.groupId" multiple collapse-tags  placeholder="请选择集团">
			           <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName":value="item.id"></el-option>
					 </el-select>
  				</el-form-item>
  				<el-form-item>
					<el-input v-model="filters.roleName" placeholder="公司名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" @sort-change="sortChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="groupId" label="所属集团" width="180" sortable="custom"  :formatter="formatGroupId" >
			</el-table-column>
			<el-table-column prop="roleId" label="角色Id" min-width="180" sortable="custom">
			</el-table-column>
			<el-table-column prop="userName" label="用户名" min-width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="realName" label="真实姓名" min-width="100" sortable="custom">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom">
			</el-table-column>
			<el-table-column prop="mobilePhone" label="手机号 " min-width="100" sortable="custom">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--分页工具条-->
		<el-col :span="24" class="toolbar">
			 <el-pagination   @size-change="handleSizeChange"  @current-change="handleCurrentChange":current-page="pager.currentPage":page-sizes="pagerSizes":page-size="pager.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
		    </el-pagination>
	   </el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="addFormRules" ref="editForm">
				<el-form-item label="所属集团" prop="groupId">
					<el-select v-model="editForm.groupId" placeholder="请选择" @change="chooseCompanys">
				    	<el-option v-for="item in groupOptions" :key="item.id":label="item.groupName" :value="item.id"></el-option>
  					</el-select>
				</el-form-item>
					<el-form-item label="所属公司" prop="companyIds">
					<el-select v-model="editForm.companyIds" placeholder="请选择" multiple>
				    	<el-option v-for="item in companyOptions" :key="item.Id" :label="item.companyName" :value="item.Id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="角色名称 " prop="roleIds">
						<el-select v-model="editForm.roleIds" placeholder="请选择"  multiple>
				    	<el-option v-for="item in roleOptions" :key="item.id":label="item.roleName" :value="item.id"></el-option>
  					</el-select>
				</el-form-item>
					<el-form-item label="用户名 " prop="userName">
					<el-input type="text" placeholder="用户名 " v-model="editForm.userName" > </el-input>
				</el-form-item>	
				<el-form-item label="密码 " prop="password">
					<el-input type="text" placeholder="密码 " v-model="editForm.password" > </el-input>
				</el-form-item>
				<el-form-item label="真实姓名 " prop="realName">
					<el-input type="text" placeholder="真实姓名 " v-model="editForm.realName" > </el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobilePhone">
					<el-input type="text" placeholder="手机号 " v-model="editForm.mobilePhone" > </el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="所属集团" prop="groupId">
					<el-select v-model="addForm.groupId" placeholder="请选择" @change="chooseCompanys">
				    	<el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
  					</el-select>
				</el-form-item>
					<el-form-item label="所属公司" prop="companyIds">
					<el-select v-model="addForm.companyIds" placeholder="请选择" multiple>
				    	<el-option v-for="item in companyOptions" :key="item.id" :label="item.companyName" :value="item.Id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="角色名称 " prop="roleIds">
						<el-select v-model="addForm.roleIds" placeholder="请选择"  multiple>
				    	<el-option v-for="item in roleOptions" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="用户名 " prop="userName">
					<el-input type="text" placeholder="用户名 " v-model="addForm.userName" > </el-input>
				</el-form-item>	
				<el-form-item label="密码 " prop="password">
					<el-input type="text" placeholder="密码 " v-model="addForm.password" > </el-input>
				</el-form-item>
				<el-form-item label="真实姓名 " prop="realName">
					<el-input type="text" placeholder="真实姓名 " v-model="addForm.realName" > </el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobilePhone">
					<el-input type="text" placeholder="手机号 " v-model="addForm.mobilePhone" > </el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

	</div>
</template>
<script>
import {pager,pagerSizes} from '@/base/baseParam'
	export default {
		data() {
			return {
				//搜索
				filters:{
					companyCode: '',
					companyName:'',
					statusEnum:[],
				},
				groupOptions:[],
				companyOptions:[],
				roleOptions:[],
				users: [],
				total: 0,
				pager:pager,
				pagerSizes:pagerSizes,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {
					id: 0,
					groupId:'',
					roleName:'',
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					groupId: [
						{ required: true, message: '请选择所属集团', trigger: 'blur' }
					],
					companyIds:[
						{ required: true, message: '请选择所属公司', trigger: 'blur' }
					],
					roleIds:[
						{ required: true, message: '请选择角色', trigger: 'blur' }
					],
					userName:[
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
					password:[
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					groupId:'',
					companyIds:[],
					roleIds:[],
					password:'',
					userName:'',
					realName:'',
					mobilePhone:'',
				}
			}
		},
		methods: {
			formatGroupId(row,column){
				for(var i = 0 ;i < this.groupOptions.length;i++){
					if(this.groupOptions[i].id == row.groupId){
						return this.groupOptions[i].groupName;
					}
				}
			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getUsers();
			},
				handleSizeChange(val){
					this.pager.pageSize=val;
					this.getUsers();
				},
				sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getUsers();
				},
			//获取角色列表
			getUsers() {
				let para = {
					pager: this.pager
					//roleName: this.filters.roleName,
				};
				this.listLoading = true;
					this.$axios({
					    method: 'post',
					    url:'/system/user/page',
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						this.users = res.rows;
						this.listLoading = false;
					});
			},
			//获取所属集团
			getGroup(){
					this.$axios({
					    method: 'post',
					    url:'/group/baseinfo/list',
					    data:{},
					}).then((res)=>{
						this.groupOptions = res;
					});
			},
			chooseCompanys(val){
						this.$axios({
					    method: 'post',
					    url:'/group/company/list',
					    data:{groupId:val},
					}).then((res)=>{
						this.companyOptions = res;
					});
					this.$axios({
					    method: 'post',
					    url:'/system/role/list',
					    data:{groupId:val},
					}).then((res)=>{
						this.roleOptions = res;
					});
			},
			//删除
			handleDel(index, row){
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
						this.$axios({
								    method: 'DELETE',
								    url:'/system/user/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										duration:'1000',
										type: 'success'
										});
									this.getUsers();
								})
							}).catch(() => {
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/system/user/get/'+row.id,
						}).then((res)=>{
							this.editForm = Object.assign({},res);
				});
			},
			//显示新增界面
			handleAdd () {
				this.addFormVisible = true;
				this.addForm = {
					groupId:'',
					companyIds:[],
					roleIds:[],
					password:'',
					userName:'',
					realName:'',
					mobilePhone:''
				};
			},
			//编辑
			editSubmit () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							let id=para.id;
							this.$axios({
							    method: 'PUT',
							    url:'/system/user/update/'+id,
							    data:para,
							}).then((res)=>{
								this.users = res.rows;
								this.editLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
								this.$axios({
							    method: 'PUT',
							    url:'/system/user/add',
							    data:para,
								}).then((res)=>{
								this.users = res.rows;
								this.listLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getUsers();
							});
						});
					}
				});
			},
			selsChange (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getUsers();
			this.getGroup()
		}
	}

</script>

<style >
</style>