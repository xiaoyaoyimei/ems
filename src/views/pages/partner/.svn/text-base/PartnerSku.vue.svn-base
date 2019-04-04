<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getPartnerSku">
  				<el-form-item>
					<el-select v-model="filters.searchPartnerInfoId" multiple collapse-tags  placeholder="请选择客户名称">
			           <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
					 </el-select>
				</el-form-item>
				<!--<el-form-item>
					<el-select v-model="filters.searchSkuId" multiple collapse-tags  placeholder="请选择支付方式">
			           <el-option v-for="item in typeOptions" :key="item.key" :label="item.value":value="item.key"></el-option>
					 </el-select>
				</el-form-item>-->
				<el-form-item>
					<el-button type="success" v-on:click="getPartnerSku">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="PartnerSku" highlight-current-row v-loading="listLoading"  style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="partnerInfoId" label="客户名称" width="200" sortable="custom" :formatter="formatPartnerinfo" ></el-table-column>
			<el-table-column prop="productSku" label="ProductSku" width="200" sortable="custom" :formatter="formatType"></el-table-column>
			<el-table-column prop="salePrice" label="经销价" width="120" sortable="custom"></el-table-column>
			<el-table-column prop="skuId" label="SKUID" min-width="200" sortable="custom"></el-table-column>
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
				<el-form-item label="客户名称 " prop="partnerInfoId">
					<el-select v-model="editForm.partnerInfoId" placeholder="请选择客户名称"  >
				     	  <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="ProductSku " prop="productSku">
						<el-input type="text" placeholder="ProductSku " v-model="editForm.productSku" > </el-input>
				</el-form-item>
				<el-form-item label="经销价 " prop="salePrice">
						<el-input type="text" placeholder="经销价 " v-model="editForm.salePrice" > </el-input>
				</el-form-item>
				<el-form-item label="SKUID " prop="skuId">
						<el-input type="text" placeholder="SKUID" v-model="editForm.skuId" > </el-input>
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
				<el-form-item label="客户名称 " prop="partnerInfoId">
					<el-select v-model="addForm.partnerInfoId" placeholder="请选择客户名称"  >
				     	  <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="ProductSku " prop="productSku">
						<el-input type="text" placeholder="ProductSku " v-model="addForm.productSku" > </el-input>
				</el-form-item>
				<el-form-item label="经销价 " prop="salePrice">
						<el-input type="text" placeholder="经销价 " v-model="addForm.salePrice" > </el-input>
				</el-form-item>
				<el-form-item label="SKUID " prop="skuId">
						<el-input type="text" placeholder="SKUID" v-model="addForm.skuId" > </el-input>
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
				partnerInfo:[],
				//搜索
				typeOptions:[],
				filters:{},
				PartnerSku: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				addForm:{},
				//编辑界面数据
				editForm: {partnerInfoId:'',paymentType:''},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
				},
			}
		},
		methods: {
			formatPartnerinfo: function (row, column) {
				for(var i = 0 ;i < this.partnerInfo.length;i++){
					if(this.partnerInfo[i].id == row.partnerInfoId){
						return this.partnerInfo[i].partnerName;
					}
				}
			},
				//类型显示转换
			formatType: function (row, column) {
				for(var i = 0 ;i < this.typeOptions.length;i++){
					if(this.typeOptions[i].key == row.paymentType){
						return this.typeOptions[i].value;
					}
				}
			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getPartnerSku();
			},
			handleSizeChange(val){
					this.pager.pageSize=val;
					this.getPartnerSku();
				},
			sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getPartnerSku();
				},
			//获取bank列表
			getPartnerSku() {
				let para = {
					searchSkuId: this.filters.searchSkuId,
					searchPartnerInfoId:this.filters.searchPartnerInfoId
				};
					this.$axios({
					    method: 'post',
					    url:'/partner/partnersku/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.PartnerSku = res.rows;
						}else{
							this.PartnerSku =[]
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
								    url:'/partner/partnersku/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getPartnerSku();
									this.listLoading = false;
								})
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/partner/partnersku/get/'+row.id,
						}).then((res)=>{
							this.editForm.partnerInfoId = res.partnerInfoId;
							this.editForm.paymentType = res.paymentType;
							this.editForm.paymentAccount = res.paymentAccount;
							this.editForm.paymentNo = res.paymentNo;
							this.editForm.id=res.id
				});
			},
			//编辑
			editSubmit () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
						   	let para = Object.assign({}, this.editForm);
							let id=para.id;
							delete para['id'];
							delete para['partnerInfoId'];
							this.$axios({
							    method: 'post',
							    url:'/partner/partnersku/update/'+id,
							    data:para,
							}).then((res)=>{
								this.editLoading = false;
								this.$message({message: '提交成功',type: 'success'});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getPartnerSku();
							});
						});
					}
				});
			},
			//显示新增界面
			handleAdd () {
				this.addFormVisible = true;
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
							    url:'/partner/partnersku/add',
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
									this.getPartnerSku();
							});
						});
					}
				});
			},
			getPartnerinfo(){
				this.$axios({
							    method: 'post',
							    url:'/partner/partnerinfo/list',
							    data:{}
								}).then((res)=>{
								this.partnerInfo = res;
								});
			}
		},
		mounted() {
			this.getPartnerSku();
			this.getPartnerinfo();
		}
	}
</script>
<style >
</style>