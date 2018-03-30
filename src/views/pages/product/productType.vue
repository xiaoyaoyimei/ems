<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters">
  				<el-form-item>
					<el-input v-model="filters.likeTypeName" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getProductTypes">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
			<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="ProductTypes" highlight-current-row v-loading="listLoading"  style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="typeName" label="产品类型" min-width="180" sortable="custom"   >
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
				<el-form-item label="产品类型"  prop="typeName">
					<el-input v-model="editForm.typeName" type="text" placeholder="产品类型 "></el-input>
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
				<el-form-item label="产品类型 " prop="typeName">
						<el-input type="text" placeholder="产品类型 " v-model="addForm.typeName" > </el-input>
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
				filters:{},
				ProductTypes: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {typeName:''},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					typeName:[
						{ required: true, message: '请输入类型名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getProductTypes();
			},
				handleSizeChange(val){
					this.pager.pageSize=val;
					this.getProductTypes();
				},
				sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getProductTypes();
				},
			//获取type列表
				getProductTypes() {
				let para = {
					likeTypeName: this.filters.likeTypeName,
				};
					this.$axios({
					    method: 'post',
					    url:'/product/producttype/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.ProductTypes = res.rows;
						}else{
							this.ProductTypes =[]
						}
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
								    url:'/product/producttype/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getProductTypes();
								})
							}).catch(() => {
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/product/producttype/get/'+row.id,
						}).then((res)=>{
							this.editForm.typeName = res.typeName;
							this.editForm.id=res.id
				});
			},
			//显示新增界面
			handleAdd () {
				this.addFormVisible = true;
			},
			//编辑
			editSubmit () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = {
								"typeName":this.editForm.typeName
							};
							this.$axios({
							    method: 'post',
							    url:'/product/producttype/update/'+this.editForm.id,
							    data:para,
							}).then((res)=>{
								this.ProductTypes = res.rows;
								this.editLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getProductTypes();
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
							    method: 'post',
							    url:'/product/producttype/add',
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
									this.getProductTypes();
							});
						});
					}
				});
			},
		},
		mounted() {
			this.getProductTypes();
		}
	}

</script>

<style >
</style>