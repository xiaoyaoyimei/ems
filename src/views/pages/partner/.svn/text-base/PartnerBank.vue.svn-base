<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getPartnerBank">
  				<el-form-item>
					<el-select v-model="filters.searchPartnerInfoId" multiple collapse-tags  placeholder="请选择客户名称">
			           <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.searchPaymentType" multiple collapse-tags  placeholder="请选择支付方式">
			           <el-option v-for="item in typeOptions" :key="item.key" :label="item.value":value="item.key"></el-option>
					 </el-select>
				</el-form-item>
						<el-form-item>
					<el-input v-model.trim="filters.likePaymentAccount" placeholder="付款账户"></el-input>
				</el-form-item>
					<el-form-item>
					<el-input v-model.trim="filters.likePaymentNo" placeholder="付款账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getPartnerBank">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="PartnerBank" highlight-current-row v-loading="listLoading"  style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="partnerInfoId" label="客户名称" width="200" sortable="custom" :formatter="formatPartnerinfo" ></el-table-column>
			<el-table-column prop="paymentType" label="支付方式" width="120" sortable="custom" :formatter="formatType"></el-table-column>
			<el-table-column prop="paymentAccount" label="付款账户" width="200" sortable="custom"></el-table-column>
			<el-table-column prop="paymentNo" label="付款账号" min-width="200" sortable="custom"></el-table-column>
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
					<el-select v-model="editForm.partnerInfoId" placeholder="请选择客户名称"  disabled>
				     	  <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="支付方式 " prop="paymentType">
				  <el-select placeholder="请选择"  v-model="editForm.paymentType" > 
				     	<el-option v-for="(item,index) in typeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="付款账户 " prop="paymentAccount">
						<el-input type="text" placeholder="付款账户 " v-model="editForm.paymentAccount" > </el-input>
				</el-form-item>
				<el-form-item label="付款账号 " prop="paymentNo">
						<el-input type="text" placeholder="付款账号" v-model="editForm.paymentNo" > </el-input>
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
					<el-select v-model="addForm.partnerInfoId" placeholder="请选择客户名称"   >
				     	  <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="支付方式 " prop="paymentType">
						 <el-select placeholder="请选择支付方式 "  v-model="addForm.paymentType"> 
				     	<el-option v-for="(item,index) in typeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="付款账户 " prop="paymentAccount">
						<el-input type="text" placeholder="付款账户 " v-model="addForm.paymentAccount" > </el-input>
				</el-form-item>
				<el-form-item label="付款账号 " prop="paymentNo">
						<el-input type="text" placeholder="付款账号" v-model="addForm.paymentNo" > </el-input>
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
				PartnerBank: [],
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
			getType(){
						this.$axios({
						    method: 'post',
						    url:'/partner/partnerbank/paymentTypeEnums',
						}).then((res)=>{
							this.typeOptions = res;
						});
			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getPartnerBank();
			},
			handleSizeChange(val){
					this.pager.pageSize=val;
					this.getPartnerBank();
				},
			sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getPartnerBank();
				},
			//获取bank列表
			getPartnerBank() {
				let para = {
					likePaymentAccount:this.filters.likePaymentAccount,
					likePaymentNo:this.filters.likePaymentNo,
					searchPaymentType: this.filters.searchPaymentType,
					searchPartnerInfoId:this.filters.searchPartnerInfoId
				};
					this.$axios({
					    method: 'post',
					    url:'/partner/partnerbank/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.PartnerBank = res.rows;
						}else{
							this.PartnerBank =[]
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
								    url:'/partner/partnerbank/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getPartnerBank();
									this.listLoading = false;
								})
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/partner/partnerbank/get/'+row.id,
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
							this.$axios({
							    method: 'post',
							    url:'/partner/partnerbank/update/'+id,
							    data:para,
							}).then((res)=>{
								this.editLoading = false;
								this.$message({message: '提交成功',type: 'success'});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getPartnerBank();
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
							    url:'/partner/partnerbank/add',
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
									this.getPartnerBank();
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
			this.getPartnerBank();
			this.getType();
			this.getPartnerinfo();
		}
	}
</script>
<style >
</style>