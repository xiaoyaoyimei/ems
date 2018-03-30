<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-cascader :options="pResoure" change-on-select  v-model="filters.searchParentId"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.resourceCode" placeholder="资源代码"></el-input>
				</el-form-item>
					<el-form-item>
					<el-input v-model="filters.resourceName" placeholder="资源名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getSystemResource">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
			<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="sytsemresources" highlight-current-row v-loading="listLoading" @sort-change="sortChange" style="width: 100%;" >
			<el-table-column type="selection" width="55">
			</el-table-column>
	
			<el-table-column prop="level" label="资源层级" width="120" sortable="custom"  >
			</el-table-column>
			<el-table-column prop="parentId" label="上级资源"  width="180" sortable="custom" >
			</el-table-column>
			<el-table-column prop="resourceCode" label="资源代码 " width="250"  sortable="custom" >
			</el-table-column>
			<el-table-column prop="resourceName" label="资源名称" min-width="180" sortable="custom">
			</el-table-column>
					<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button   size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button  type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--分页工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pager.currentPage" :page-sizes="pagerSizes"  :page-size="pager.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="float:right;" >
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="addFormRules" ref="editForm">
				<el-form-item label="资源层级" >
				</el-form-item>
			 	<el-form-item label="资源代码" prop="resourceCode">
			 	 <el-input type="text" placeholder="资源名称 " v-model="editForm.resourceCode" > </el-input>
				</el-form-item>
				<el-form-item label="资源名称 " prop="resourceName">
					<el-input type="text" placeholder="资源名称 " v-model="editForm.resourceName" > </el-input>
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
				<el-form-item label="资源层级" prop="parentId">
					<el-cascader :options="pResoure" change-on-select  v-model="addForm.parentId"></el-cascader>
				</el-form-item>
				<el-form-item label="资源代码" prop="resourceCode">
					 <el-input v-model="addForm.resourceCode" auto-complete="off"></el-input>
				</el-form-item>
				</el-form-item>
				<el-form-item label="资源名称 "  prop="resourceName">
					<el-input type="text" placeholder="资源名称 " v-model="addForm.resourceName" > </el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="success" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

	</div>
</template>
<script>
	export default {
		data() {
			return {
				//搜索
				filters:{
					parentId:'',
					resourceCode:'',
					resourceName:''
				},
				pResoure:[],
				searchParentId:[],
				sytsemresources: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {
					id: 0,
					level:'',
					parentId:'',
					resourceCode:'',
					resourceName:''
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					resourceCode: [
						{ required: true, message: '请输入资源代码', trigger: 'blur' }
					],
					resourceName: [
						{ required: true, message: '请输入资源名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					parentId:'',
					resourceCode:'',
					resourceName:'',
				}
			}
		},
		methods: {
			//状态显示转换
			formatGroupId(row,column){
				for(var i = 0 ;i < this.groupOptions.length;i++){
					if(this.groupOptions[i].id == row.groupId){
						return this.groupOptions[i].groupName;
					}
				}
			},
			handleSizeChange(val) {
				this.pager.pageSize = val;
				this.getSystemResource();
			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getSystemResource();
			},
			//获取层级
			getpResoure(){
					this.$axios({
					    method: 'post',
					    url:'/system/systemresource/query/tree',
					}).then((res)=>{
						this.pResoure = res;
					});
			},
			//排序
			sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getSystemResource();
				},
			//获取资源列表
			getSystemResource() {
				let para = {
					likeResourceCode: this.filters.resourceCode,
					likeResourceName: this.filters.resourceName,
					searchParentId:this.filters.searchParentId
				};
				    this.listLoading = true;
					this.$axios({
					    method: 'post',
					    params:this.pager,
					    url:'/system/systemresource/page',
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						this.sytsemresources = res.rows;
						this.listLoading = false;
					});
			},
			//删除
			handleDel(index, row){
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
						this.$axios({
								    method: 'post',
								    url:'/system/systemresource/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getSystemResource();
								})
							}).catch(() => {
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/system/systemresource/get/'+row.id,
						}).then((res)=>{
							this.editForm = Object.assign({},res);
				});
			},
			//显示新增界面
			handleAdd () {
				this.addFormVisible = true;
				this.addForm = {};
			},
			//编辑
			editSubmit () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							console.log(this.editForm)
							let para = Object.assign({}, this.editForm);
							let id=para.id;
							this.$axios({
							    method: 'post',
							    url:'/system/systemresource/update/'+id,
							    data:para,
							}).then((res)=>{
							this.sytsemresources = res.rows;
							this.editLoading = false;
							this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getSystemResource();
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
							    method: 'post',
							    url:'/system/systemresource/add',
							    data:para,
								}).then((res)=>{
								this.systemresource = res.rows;
								this.addLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getSystemResource();
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
			this.getSystemResource();
			this.getpResoure();
		}
	}

</script>

<style >
</style>