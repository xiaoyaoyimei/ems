<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters">
				<el-form-item>
					 <el-select v-model="filters.groupId"  collapse-tags  placeholder="请选择">
			           <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName":value="item.id"></el-option>
					 </el-select>
  				</el-form-item>
  				<el-form-item>
					<el-input v-model="filters.roleName" placeholder="公司名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRoles">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" @sort-change="sortChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
				<el-table-column prop="groupId" label="所属集团" width="180" sortable="custom"  :formatter="formatGroupId" >
			</el-table-column>
			<el-table-column prop="roleName" label="角色名称" min-width="180" sortable="custom">
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
			 	  <el-select v-model="editForm.groupId" placeholder="请选择">
				    <el-option
				      v-for="item in groupOptions"
				      :key="item.id"
				      :label="item.groupName"
				      :value="item.id">
				    </el-option>
  				</el-select>
				</el-form-item>
					<el-form-item label="角色名称" >
					<el-input v-model="editForm.roleName" ></el-input>
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
					<el-select v-model="addForm.groupId" placeholder="请选择">
				    <el-option v-for="item in groupOptions"
				      :key="item.id"
				      :label="item.groupName"
				      :value="item.id">
				    </el-option>
  				</el-select>
				</el-form-item>
				<el-form-item label="角色名称 " prop="roleName">
						<el-input type="text" placeholder="角色名称 " v-model="addForm.roleName" > </el-input>
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
				roles: [],
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
					groupId:0,
					roleName:'',
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					groupId: [
						{ required: true, message: '请选择所属公司', trigger: 'blur' }
					],
					roleName:[
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					groupId:'',
					roleName:'',
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
				this.getRoles();
			},
				handleSizeChange(val){
					this.pager.pageSize=val;
					this.getRoles();
				},
				sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getRoles();
				},
			//获取角色列表
			getRoles() {
				let para = {
					pager: this.pager,
					groupId:this.filters.groupId,
					roleName: this.filters.roleName
				};
				this.listLoading = true;
					this.$axios({
					    method: 'post',
					    url:'/system/role/page',
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						this.roles = res.rows;
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
			//删除
			handleDel(index, row){
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
						this.$axios({
								    method: 'DELETE',
								    url:'/system/role/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getRoles();
								})
							}).catch(() => {
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/system/role/get/'+row.id,
						}).then((res)=>{
							this.editForm = Object.assign({},res);
				});
			},
			//显示新增界面
			handleAdd () {
				this.addFormVisible = true;
				this.addForm = {
					roleName:'',
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
							    url:'/system/role/update/'+id,
							    data:para,
							}).then((res)=>{
								this.roles = res.rows;
								this.editLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getRoles();
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
							this.listLoading = true;
							let para = Object.assign({}, this.addForm);
								this.$axios({
							    method: 'PUT',
							    url:'/system/role/add',
							    data:para,
								}).then((res)=>{
								this.roles = res.rows;
								this.listLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getRoles();
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
			this.getRoles();
			this.getGroup()
		}
	}

</script>

<style >
</style>