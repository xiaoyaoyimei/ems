<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getProductSeries">
  				<el-form-item>
					<el-input v-model.trim="filters.likeseriesName" placeholder="系列名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getProductSeries">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
			<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="ProductSeries" highlight-current-row v-loading="listLoading" style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="seriesName" label="系列名称" min-width="180" sortable="custom"   >
			</el-table-column>
				<el-table-column label="操作" width="150">
				<template slot-scope="scope">
				<i class="fa fa-edit"  @click="handleEdit(scope.$index, scope.row)" title="编辑"></i>
		      	<i class="fa fa-trash-o"  @click="handleDel(scope.$index, scope.row)" title="删除"></i>
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
				<el-form-item label="系列名称"  prop="seriesName">
					<el-input v-model="editForm.seriesName" type="text" placeholder="系列名称 "></el-input>
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
				<el-form-item label="系列名称 " prop="seriesName">
						<el-input type="text" placeholder="系列名称 " v-model="addForm.seriesName" > </el-input>
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
				filters:{},
				ProductSeries: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {seriesName:''},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					seriesName:[
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
				this.getProductSeries();
			},
				handleSizeChange(val){
					this.pager.pageSize=val;
					this.getProductSeries();
				},
				sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getProductSeries();
				},
			//获取type列表
			getProductSeries() {
				let para = {
					likeseriesName: this.filters.likeseriesName,
				};
					this.$axios({
					    method: 'post',
					    url:'/product/productseries/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.ProductSeries = res.rows;
						}else{
							this.ProductSeries =[]
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
								    url:'/product/productseries/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getProductSeries();
								})
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/product/productseries/get/'+row.id,
						}).then((res)=>{
							this.editForm.seriesName = res.seriesName;
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
								"seriesName":this.editForm.seriesName
							};
							this.$axios({
							    method: 'post',
							    url:'/product/productseries/update/'+this.editForm.id,
							    data:para,
							}).then((res)=>{
								this.ProductSeries = res.rows;
								this.editLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getProductSeries();
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
							    url:'/product/productseries/add',
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
									this.getProductSeries();
							});
						});
					}
				});
			},
		},
		mounted() {
			this.getProductSeries();
		}
	}

</script>

<style >
</style>