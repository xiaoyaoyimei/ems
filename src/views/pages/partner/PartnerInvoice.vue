<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getPartnerInovice">
  				<el-form-item>
					<el-select v-model="filters.searchPartnerInfoId" multiple collapse-tags  placeholder="请选择客户名称">
			           <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model.trim="filters.invoiceBankName" placeholder="开户银行"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.searchInvoiceType" multiple collapse-tags  placeholder="请选择发票类型">
			           <el-option v-for="item in typeOptions" :key="item.key" :label="item.value":value="item.key"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getPartnerInovice">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="PartnerInovice" highlight-current-row v-loading="listLoading"  style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="partnerInfoId" label="客户信息" width="200" sortable="custom" :formatter="formatPartnerinfo" ></el-table-column>
			<el-table-column prop="invoiceBankName" label="开户银行" width="200" sortable="custom"></el-table-column>
			<el-table-column prop="invoiceBankNo" label="银行账号" width="200" sortable="custom"></el-table-column>
			<el-table-column prop="invoiceCode" label="纳税人识别码" width="180" sortable="custom"></el-table-column>
			<el-table-column prop="invoiceTitle" label="发票抬头" min-width="200" sortable="custom"></el-table-column>
			<el-table-column prop="invoiceType" label="发票类型" width="120" sortable="custom" :formatter="formatType"></el-table-column>
			<el-table-column prop="invoicePhone" label="注册电话" width="120" sortable="custom"></el-table-column>
			<el-table-column prop="invoiceAddr" label="注册地址" width="200" sortable="custom"></el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
			    <i class="fa fa-edit"  @click="handleEdit(scope.$index, scope.row)" title="编辑"></i>
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
				<el-form-item label="注册地址 " prop="invoiceAddr">
						<el-input type="text" placeholder="注册地址 " v-model="editForm.invoiceAddr" > </el-input>
				</el-form-item>
				<el-form-item label="开户银行 " prop="invoiceBankName">
						<el-input type="text" placeholder="开户银行 " v-model="editForm.invoiceBankName" > </el-input>
				</el-form-item>
				<el-form-item label="银行账号 " prop="invoiceBankNo">
						<el-input type="text" placeholder="银行账号 " v-model="editForm.invoiceBankNo" > </el-input>
				</el-form-item>
				<el-form-item label="纳税人识别码 " prop="invoiceCode">
						<el-input type="text" placeholder="纳税人识别码" v-model="editForm.invoiceCode" > </el-input>
				</el-form-item>
				<el-form-item label="注册电话 " prop="invoicePhone">
						<el-input type="text" placeholder="注册电话 " v-model="editForm.invoicePhone" > </el-input>
				</el-form-item>
				<el-form-item label="发票抬头 " prop="invoiceTitle">
						<el-input type="text" placeholder="发票抬头 " v-model="editForm.invoiceTitle" > </el-input>
				</el-form-item>
				<el-form-item label="发票类型" prop="invoiceType">
			 	 	 <el-select placeholder="请选择"  v-model="editForm.invoiceType" > 
				     	<el-option v-for="(item,index) in typeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="客户名称 " prop="partnerInfoId">
					 <el-select v-model="editForm.partnerInfoId" placeholder="请选择"  disabled>
				     	  <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
  					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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
				PartnerInovice: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {invoiceAddr:'',invoiceType:''},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					invoiceTitle:[
						{ required: true, message: '请输入发票抬头', trigger: 'blur' }
					],
					invoiceType:[{ required: true, message: '请选择发票类型', trigger: 'blur' }]
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
					if(this.typeOptions[i].key == row.invoiceType){
						return this.typeOptions[i].value;
					}
				}
			},
			getType(){
						this.$axios({
						    method: 'post',
						    url:'/partner/partnerinvoice/inoviceTypeEnums',
						}).then((res)=>{
							this.typeOptions = res;
						});
			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getPartnerInovice();
			},
			handleSizeChange(val){
					this.pager.pageSize=val;
					this.getPartnerInovice();
				},
			sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getPartnerInovice();
				},
			//获取type列表
			getPartnerInovice() {
				let para = {
					invoiceBankName:this.filters.invoiceBankName,
					searchInvoiceType: this.filters.searchInvoiceType,
					searchPartnerInfoId:this.filters.searchPartnerInfoId
				};
					this.$axios({
					    method: 'post',
					    url:'/partner/partnerinvoice/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.PartnerInovice = res.rows;
						}else{
							this.PartnerInovice =[]
						}
					});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/partner/partnerinvoice/get/'+row.id,
						}).then((res)=>{
							this.editForm.invoiceAddr = res.invoiceAddr;
							this.editForm.invoiceBankName = res.invoiceBankName;
							this.editForm.invoiceBankNo = res.invoiceBankNo;
							this.editForm.invoiceCode = res.invoiceCode;
							this.editForm.invoicePhone = res.invoicePhone;
							this.editForm.invoiceTitle = res.invoiceTitle;
							this.editForm.invoiceType = res.invoiceType;
							this.editForm.partnerInfoId = res.partnerInfoId;
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
							    url:'/partner/partnerinvoice/update/'+id,
							    data:para,
							}).then((res)=>{
								this.editLoading = false;
								this.$message({message: '提交成功',type: 'success'});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getPartnerInovice();
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
			this.getPartnerInovice();
			this.getType();
			this.getPartnerinfo();
		}
	}
</script>
<style >
</style>