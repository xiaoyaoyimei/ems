<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getPartnerRecharge">
  				<el-form-item>
					<el-select v-model="filters.searchPartnerId" multiple collapse-tags  placeholder="请选择客户名称">
			           <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.searchRechargeType" multiple collapse-tags  placeholder="请选择充值类型">
			           <el-option v-for="item in rechargeTypeOptions" :key="item.key" :label="item.value":value="item.key"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
				<el-select v-model="filters.searchStatus" multiple collapse-tags  placeholder="请选择状态">
			           <el-option v-for="item in statusOptions" :key="item.key" :label="item.value":value="item.key"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getPartnerRecharge">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="PartnerRecharge" highlight-current-row v-loading="listLoading"  style="width: 100%;" @sort-change="sortChange">
		<el-table-column prop="partnerId" label="客户名称" width="150" sortable="custom" :formatter="formatPartnerinfo" ></el-table-column>
		<el-table-column prop="paymentAccount" label="付款账户" width="120" sortable="custom" ></el-table-column>
		<el-table-column prop="paymentNo" label="付款账号" width="120" sortable="custom"></el-table-column>
		<el-table-column prop="paymentImg" label="付款凭证" width="100" sortable="custom">
			<template slot-scope="scope">
					<img    v-bind:src="scope.row.paymentImg | imgfilter" class="m40" @click="enlarge(scope.row.paymentImg)">
				</template></el-table-column>
		<el-table-column prop="paymentNote" label="付款附言" width="120" sortable="custom"></el-table-column>
		<el-table-column prop="paymentType" label="付款方式" width="120" sortable="custom" :formatter="formatType"></el-table-column>
		<el-table-column prop="paymentPerson" label="付款操作人" width="120" sortable="custom"></el-table-column>
		<el-table-column prop="receiveAccount" label="收款账户" width="120" sortable="custom"></el-table-column>
		<el-table-column prop="receiveNo" label="收款账号" width="120" sortable="custom"></el-table-column>
		<el-table-column prop="rechargeNo" label="充值流水号" width="120" sortable="custom"></el-table-column>
		<el-table-column prop="transNo" label="银行交易流水号" width="150" sortable="custom"></el-table-column>
		<el-table-column prop="receiveType" label="收款方式" width="120" sortable="custom" :formatter="formatType"></el-table-column>
		<el-table-column prop="rechargeType" label="充值类型" width="120" sortable="custom"  :formatter="formatRechargeType"></el-table-column>
		<el-table-column prop="status" label="充值状态" width="120" sortable="custom"  :formatter="formatStatus"></el-table-column>
		<el-table-column prop="totalFee" label="充值金额" width="120" sortable="custom"></el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<i class="fa fa-check"  @click="handleCheck(scope.$index, scope.row)" title="确认收款" v-if="scope.row.status === 'created'"></i>
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
				<el-form-item label="客户名称 " prop="partnerId">
					<el-select v-model="editForm.partnerId" placeholder="请选择客户名称"  >
				     	  <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="付款账户 " prop="paymentAccount">
						<el-input type="text" placeholder="付款账户 " v-model="editForm.paymentAccount" > </el-input>
				</el-form-item>
					<el-form-item label="付款账号 " prop="paymentNo">
						<el-input type="text" placeholder="付款账号" v-model="editForm.paymentNo" > </el-input>
				</el-form-item>
				<el-form-item label="付款凭证 " prop="paymentImg">
					<el-upload ref="upload" action="#" :file-list="fileList"     show-file-list :limit="1" :before-upload="beforeUpload"
					  list-type="picture"  v-model="editForm.paymentImg">
  					<el-button size="small" type="primary">点击上传单张图片</el-button>
 			 		<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div></el-upload>
				</el-form-item>	
					<el-form-item label="付款附言 " prop="paymentNote">
						<el-input type="text" placeholder="付款账号" v-model="editForm.paymentNote" > </el-input>
				</el-form-item>
					<el-form-item label="付款方式 " prop="paymentType">
						 <el-select placeholder="请选择付款方式 "  v-model="editForm.paymentType"> 
				     	<el-option v-for="(item,index) in paymentTypeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="收款账户 " prop="receiveAccount">
						<el-input type="text" placeholder="收款账户 " v-model="editForm.receiveAccount" > </el-input>
				</el-form-item>
				<el-form-item label="收款账号 " prop="receiveNo">
						<el-input type="text" placeholder="收款账号 " v-model="editForm.receiveNo" > </el-input>
				</el-form-item>
				<el-form-item label="收款方式 " prop="receiveType">
					<el-select placeholder="请选择收款方式 "  v-model="editForm.receiveType"> 
				     	<el-option v-for="(item,index) in paymentTypeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="充值类型 " prop="rechargeType">
					<el-select placeholder="请选择充值类型 "  v-model="editForm.rechargeType"> 
				     	<el-option v-for="(item,index) in rechargeTypeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="充值金额 " prop="totalFee">
						<el-input type="text" placeholder="充值金额 " v-model.number="editForm.totalFee" > </el-input>
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
				<el-form-item label="客户名称 " prop="partnerId">
					<el-select v-model="addForm.partnerId" placeholder="请选择客户名称"  >
				     	  <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="付款账户 " prop="paymentAccount">
						<el-input type="text" placeholder="付款账户 " v-model="addForm.paymentAccount" > </el-input>
				</el-form-item>
					<el-form-item label="付款账号 " prop="paymentNo">
						<el-input type="text" placeholder="付款账号" v-model="addForm.paymentNo" > </el-input>
				</el-form-item>
				<el-form-item label="付款凭证 " prop="paymentImg">
					<el-upload ref="upload" action="#" :file-list="fileList"     show-file-list :limit="1" :before-upload="beforeUpload"
					  list-type="picture"  v-model="addForm.paymentImg">
  					<el-button size="small" type="primary">点击上传单张图片</el-button>
 			 		<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div></el-upload>
				</el-form-item>	
					<el-form-item label="付款附言 " prop="paymentNote">
						<el-input type="text" placeholder="付款账号" v-model="addForm.paymentNote" > </el-input>
				</el-form-item>
					<el-form-item label="付款方式 " prop="paymentType">
						 <el-select placeholder="请选择付款方式 "  v-model="addForm.paymentType"> 
				     	<el-option v-for="(item,index) in paymentTypeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="收款账户 " prop="receiveAccount">
						<el-input type="text" placeholder="收款账户 " v-model="addForm.receiveAccount" > </el-input>
				</el-form-item>
				<el-form-item label="收款账号 " prop="receiveNo">
						<el-input type="text" placeholder="收款账号 " v-model="addForm.receiveNo" > </el-input>
				</el-form-item>
				<el-form-item label="收款方式 " prop="receiveType">
					<el-select placeholder="请选择收款方式 "  v-model="addForm.receiveType"> 
				     	<el-option v-for="(item,index) in paymentTypeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="充值类型 " prop="rechargeType">
					<el-select placeholder="请选择充值类型 "  v-model="addForm.rechargeType"> 
				     	<el-option v-for="(item,index) in rechargeTypeOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="充值金额 " prop="totalFee">
						<el-input type="text" placeholder="充值金额 " v-model.number="addForm.totalFee" > </el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="success" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="图片放大" :visible.sync="enlargeVisible" :close-on-click-modal="false" center >
				<div class="text-center"><img :src="enlargeImg | imgfilter"></div>
			</el-dialog>
			<el-dialog title="确认收款" :visible.sync="checkFormVisible" :close-on-click-modal="false">
			<el-form :model="checkForm" label-width="120px" :rules="addFormRules" ref="checkForm">
				<el-form-item label="银行交易流水号 " prop="transNo">
						<el-input type="text" placeholder="银行交易流水号 " v-model="checkForm.transNo" > </el-input>
				</el-form-item>
				<el-form-item label="实收金额 " prop="receiveFee">
						<el-input type="text" placeholder="实收金额 " v-model.number="checkForm.receiveFee" > </el-input>
				</el-form-item>
					<el-form-item label="收款附言 " prop="receiveNote">
						<el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入收款附言" v-model.number="checkForm.receiveNote" > </el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="checkFormVisible = false">取消</el-button>
				<el-button type="success" @click.native="checkSubmit" >提交</el-button>
			</div>
			</el-dialog>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				enlargeImg:'',
				fileList:[],
				partnerInfo:[],
				paymentTypeOptions:[],
				//搜索
				rechargeTypeOptions:[],
				statusOptions:[],
				filters:{},
				PartnerRecharge: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				enlargeVisible:false,
				checkFormVisible:false,
				addForm:{},
				checkForm:{},
				//编辑界面数据
				editForm: {partnerId:'',paymentType:'',rechargeType:''},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					partnerId:[
						{ required: true, message: '请选择客户名称', trigger: 'blur' }
					],
						paymentAccount:[
						{ required: true, message: '请输入付款账户', trigger: 'blur' }
					],
						paymentImg:[
						{ required: true, message: '请上传付款凭证', trigger: 'blur' }
					],
						paymentNo:[
						{ required: true, message: '请输入付款账号', trigger: 'blur' }
					],
						paymentType:[
						{ required: true, message: '请输入付款方式', trigger: 'blur' }
					],
						receiveAccount:[
						{ required: true, message: '请输入收款账户', trigger: 'blur' }
					],
						receiveNo:[
						{ required: true, message: '请输入收款账号', trigger: 'blur' }
					],
						receiveType:[
						{ required: true, message: '请选择收款方式', trigger: 'blur' }
					],
						rechargeType:[
						{ required: true, message: '请选择充值类型', trigger: 'blur' }
					],
					totalFee:[
						{ required: true, message: '请输入充值金额', trigger: 'blur' ,type:'number'}
					],
					transNo:[
						{ required: true, message: '请输入银行交易流水号', trigger: 'blur' }
					],
					receiveFee:[
						{ required: true, message: '请输入实收金额', trigger: 'blur' ,type:'number'}
					],
				},
			}
		},
		methods: {
			enlarge(val){
				this.enlargeVisible = true;
				this.enlargeImg=val
			},
			formatRechargeType:function(row, column){
				for(var i = 0 ;i < this.rechargeTypeOptions.length;i++){
					if(this.rechargeTypeOptions[i].key == row.rechargeType){
						return this.rechargeTypeOptions[i].value;
					}
				}
			},
			//状态显示转换
			formatStatus: function (row, column) {
				for(var i = 0 ;i < this.statusOptions.length;i++){
					if(this.statusOptions[i].key == row.status){
						return this.statusOptions[i].value;
					}
				}
			},
			formatPartnerinfo: function (row, column) {
				for(var i = 0 ;i < this.partnerInfo.length;i++){
					if(this.partnerInfo[i].id == row.partnerId){
						return this.partnerInfo[i].partnerName;
					}
				}
			},
				//类型显示转换
			formatType: function (row, column) {
				for(var i = 0 ;i < this.paymentTypeOptions.length;i++){
					if(this.paymentTypeOptions[i].key == row.paymentType){
						return this.paymentTypeOptions[i].value;
					}
				}
			},
					//上传文件
			beforeUpload (file) {
				 const isJPG = file.type === 'image/jpg'||'image/png';
		        const isLt2M = file.size / 1024 / 1024 < 2;
		        if (!isJPG) {
		          this.$message.error('上传头像图片只能是 JPG 或PNG格式!');
		          return false;
		        }
		        if (!isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 2MB!');
		            return false;
		        }
		      let fd = new FormData()
		      fd.append('file', file)
		      fd.append('path', 'product/sku')
		    	this.$axios({
					    method: 'post',
					    url:'/base/file/upload',
					    data:fd,
					}).then((res)=>{
					         this.fileList=[{'name':res.message,'url':this.global_.imgurl+res.message}];
					         this.addForm.paymentImg=res.message;
					         this.editForm.paymentImg=res.message;
					});
		      return false
		    },
			getStatus(){
						this.$axios({
						    method: 'post',
						    url:'/partner/partnerrecharge/getPartnerRechargeStatus',
						}).then((res)=>{
							this.statusOptions = res;
						});
			},
			getPaymentType(){
					this.$axios({
						    method: 'post',
						    url:'/partner/partnerbank/paymentTypeEnums',
						}).then((res)=>{
							this.paymentTypeOptions = res;
						});
			},
			getType(){
						this.$axios({
						    method: 'post',
						    url:'/partner/partnerrecharge/getPartnerRechargeTypes',
						}).then((res)=>{
							this.rechargeTypeOptions = res;
						});
			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getPartnerRecharge();
			},
			handleSizeChange(val){
					this.pager.pageSize=val;
					this.getPartnerRecharge();
				},
			sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getPartnerRecharge();
				},
			//获取bank列表
			getPartnerRecharge() {
				let para = {
					likePaymentAccount:this.filters.likePaymentAccount,
					likePaymentNo:this.filters.likePaymentNo,
					searchRechargeType: this.filters.searchRechargeType,
					searchPartnerId:this.filters.searchPartnerId,
					searchStatus:this.filters.searchStatus
				};
					this.$axios({
					    method: 'post',
					    url:'/partner/partnerrecharge/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.PartnerRecharge = res.rows;
						}else{
							this.PartnerRecharge =[]
						}
					});
			},
			//删除
			handleDel(index, row){
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.$axios({
								    method: 'post',
								    url:'/partner/partnerrecharge/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getPartnerRecharge();
								})
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/partner/partnerrecharge/get/'+row.id,
						}).then((res)=>{
							this.editForm.partnerId = res.partnerId;
							this.editForm.paymentAccount = res.paymentAccount;
							this.editForm.paymentImg = res.paymentImg;
							this.editForm.paymentNo = res.paymentNo;
							this.editForm.paymentNote = res.paymentNote;
							this.editForm.paymentType = res.paymentType;
							this.editForm.paymentPerson=res.paymentPerson;
							this.editForm.receiveAccount = res.receiveAccount;
							this.editForm.receiveNo = res.receiveNo;
							this.editForm.receiveType=res.receiveType;
							this.editForm.rechargeType = res.rechargeType;
							this.editForm.totalFee = res.totalFee;
							this.fileList=[{'name':res.paymentImg,'url':this.global_.imgurl+res.paymentImg}];
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
							    url:'/partner/partnerrecharge/update/'+id,
							    data:para,
							}).then((res)=>{
								this.editLoading = false;
								this.$message({message: '提交成功',type: 'success'});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getPartnerRecharge();
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
							    url:'/partner/partnerrecharge/add',
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
									this.getPartnerRecharge();
							});
						});
					}
				});
			},
				//显示check界面
			handleCheck (index,row) {
				this.checkFormVisible = true;
				this.checkForm.id=row.id;
			},
			checkSubmit() {
				this.$refs.checkForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let id=this.checkForm.id;
							let para = Object.assign({}, this.checkForm);
							delete para['id'];
								this.$axios({
							    method: 'post',
							    url:'/partner/partnerrecharge/receive/'+id,
							    data:para,
								}).then((res)=>{
								this.roles = res.rows;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['checkForm'].resetFields();
									this.checkFormVisible = false;
									this.getPartnerRecharge();
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
			this.getPartnerRecharge();
			this.getStatus();
			this.getPaymentType();
			this.getType();
			this.getPartnerinfo();
		}
	}
</script>
<style >
</style>