<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getPartnerInfo">
  				<el-form-item>
					<el-input v-model.trim="filters.likePartnerName" placeholder="客户名称" name="likePartnerName"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model.trim="filters.likeShopName" placeholder="店铺名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.Status" multiple collapse-tags  placeholder="请选择状态">
			           <el-option v-for="item in statusOptions" :key="item.key" :label="item.value":value="item.key"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getPartnerInfo">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="PartnerInfo" highlight-current-row v-loading="listLoading"  style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="partner_name" label="客户名称" width="120" sortable="custom"></el-table-column>
			<el-table-column prop="province" label="省份" width="100" sortable="custom"></el-table-column>
			<el-table-column prop="city" label="城市" width="100" sortable="custom"></el-table-column>
			<el-table-column prop="district" label="区县" width="100" sortable="custom"></el-table-column>
			<el-table-column prop="addr" label="地址" width="120" sortable="custom"></el-table-column>
			<el-table-column prop="shopName" label="店铺名称" width="120" sortable="custom"></el-table-column>
			<el-table-column prop="shopAddr" label="店铺地址" min-width="120" sortable="custom"></el-table-column>
			<el-table-column prop="email" label="邮箱" width="200" sortable="custom"></el-table-column>
			<el-table-column prop="mobile" label="手机" width="150" sortable="custom"></el-table-column>
			<el-table-column prop="phone" label="电话" width="120" sortable="custom"></el-table-column>
			<el-table-column prop="qq" label="QQ" width="120" sortable="custom"></el-table-column>
			<el-table-column prop="status" label="状态" width="80" sortable="custom" :formatter="formatStatus" >
					<!--<template slot-scope="scope">
						{{scope.row.status | statusPartner}}
					</template>-->
			</el-table-column>
			<el-table-column label="操作" width="150">
			    <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDel(scope.$index, scope.row)">删除</el-button>
      </template>
      </el-table-column>
			<!--<el-table-column label="操作" width="150">
				<template slot-scope="scope">
			    <i class="fa fa-edit"   @click="handleEdit(scope.$index, scope.row)" title="编辑"></i>
		      	<i class="fa fa-trash-o"  @click="handleDel(scope.row)" title="删除"></i>
				</template>
			</el-table-column>-->
		</el-table>

		<!--分页工具条-->
		<el-col :span="24" class="toolbar">
			 <el-pagination   @size-change="handleSizeChange"  @current-change="handleCurrentChange":current-page="pager.currentPage":page-sizes="pagerSizes":page-size="pager.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
		    </el-pagination>
	   </el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="addFormRules" ref="editForm">
				<el-form-item label="客户名称 " prop="partnerName">
						<el-input type="text" placeholder="客户名称 " v-model.trim="editForm.partnerName" > </el-input>
				</el-form-item>
				<el-form-item label="省市区" > 
					  <el-cascader    expand-trigger="hover"    :options="optionsAddr"    v-model="editForm.selectedOptionsAddr"   >	  </el-cascader>
				</el-form-item>
				<el-form-item label="地址 " prop="addr">
						<el-input type="text" placeholder="地址 " v-model="editForm.addr" > </el-input>
				</el-form-item>
				<el-form-item label="店铺名称 " prop="shopName">
						<el-input type="text" placeholder="店铺名称 " v-model="editForm.shopName" > </el-input>
				</el-form-item>
				<el-form-item label="店铺地址 " prop="shopAddr">
						<el-input type="text" placeholder="店铺地址 " v-model="editForm.shopAddr" > </el-input>
				</el-form-item>
				<el-form-item label="邮箱 " prop="email">
						<el-input type="text" placeholder="邮箱 " v-model="editForm.email" > </el-input>
				</el-form-item>
				<el-form-item label="手机 " prop="mobile">
						<el-input type="text" placeholder="手机 " v-model="editForm.mobile" > </el-input>
				</el-form-item>
				<el-form-item label="电话 " prop="phone">
						<el-input type="text" placeholder="电话 " v-model="editForm.phone" > </el-input>
				</el-form-item>
				<el-form-item label="QQ " prop="qq">
						<el-input type="text" placeholder="QQ " v-model="editForm.qq" > </el-input>
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
				<el-form-item label="客户名称 " prop="partnerName">
						<el-input type="text" placeholder="客户名称 " v-model.trim="addForm.partnerName" > </el-input>
				</el-form-item>
				<el-form-item label="省市区" > 
					  <el-cascader    expand-trigger="hover"    :options="optionsAddr"    v-model="addForm.selectedOptionsAddr" >	  </el-cascader>
				</el-form-item>
				<el-form-item label="地址 " prop="addr">
						<el-input type="text" placeholder="地址 " v-model="addForm.addr" > </el-input>
				</el-form-item>
				<el-form-item label="店铺名称 " prop="shopName">
						<el-input type="text" placeholder="店铺名称 " v-model="addForm.shopName" > </el-input>
				</el-form-item>
				<el-form-item label="店铺地址 " prop="shopAddr">
						<el-input type="text" placeholder="店铺地址 " v-model="addForm.shopAddr" > </el-input>
				</el-form-item>
				<el-form-item label="邮箱 " prop="email">
						<el-input type="text" placeholder="邮箱 " v-model="addForm.email" > </el-input>
				</el-form-item>
				<el-form-item label="手机 " prop="mobile">
						<el-input type="text" placeholder="手机 " v-model="addForm.mobile" > </el-input>
				</el-form-item>
				<el-form-item label="电话 " prop="phone">
						<el-input type="text" placeholder="电话 " v-model="addForm.phone" > </el-input>
				</el-form-item>
				<el-form-item label="QQ " prop="qq">
						<el-input type="text" placeholder="QQ " v-model="addForm.qq" > </el-input>
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
				statusOptions:[],
				selectedOptionsAddr:[],
				optionsAddr:[],
				filters:{},
				PartnerInfo: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {partnerName:''},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					partnerName:[
						{ required: true, message: '请输入客户名称', trigger: 'blur' }
					],
					selectedOptionsAddr:[{ required: true, message: '请选择省市区', trigger: 'blur' }]
				},
				//新增界面数据
				addForm: {}
			}
		},
		methods: {
				//状态显示转换
			formatStatus: function (row, column) {
				for(var i = 0 ;i < this.statusOptions.length;i++){
					if(this.statusOptions[i].key == row.status){
						return this.statusOptions[i].value;
					}
				}
			},
			getStatus(){
						this.$axios({
						    method: 'post',
						    url:'/partner/partnerinfo/statusEnums',
						}).then((res)=>{
							this.statusOptions = res;
						});
			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getPartnerInfo();
			},
			handleSizeChange(val){
					this.pager.pageSize=val;
					this.getPartnerInfo();
				},
			sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getPartnerInfo();
				},
			//获取type列表
			getPartnerInfo() {
				let para = {
					likePartnerName: this.filters.likePartnerName,
				};
					this.$axios({
					    method: 'post',
					    url:'/partner/partnerinfo/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.PartnerInfo = res.datas;
				
//						this.total = res.totalRows;
//						if(res.totalRows>0){
//						this.PartnerInfo = res.rows;
//						}else{
//							this.PartnerInfo =[]
//						}
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
								    url:'/partner/partnerinfo/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getPartnerInfo();
									this.listLoading = false;
								})
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/partner/partnerinfo/get/'+row.id,
						}).then((res)=>{
							var res=res.rows[0];
							this.editForm.partnerName = res.partner_name;
							console.log(res.partner_name);
							this.editForm.selectedOptionsAddr=[res.province, res.city,res.district];
							this.editForm.addr = res.addr;
							this.editForm.shopName = res.shopName;
							this.editForm.shopAddr = res.shopAddr;
							this.editForm.email = res.email;
							this.editForm.mobile = res.mobile;
							this.editForm.phone = res.phone;
							this.editForm.qq = res.qq;
							this.editForm.id=res.id
				});
			},
			//编辑
			editSubmit () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
						     let temp=this.editForm;
						     let id=this.editForm.id;
							temp.province=this.editForm.selectedOptionsAddr[0];
							temp.city=this.editForm.selectedOptionsAddr[1];
							temp.district=this.editForm.selectedOptionsAddr[2];
							delete temp['selectedOptionsAddr']
							delete temp['id'];
							this.$axios({
							    method: 'post',
							    url:'/partner/partnerinfo/update/'+id,
							    data:temp,
							}).then((res)=>{
								this.PartnerInfo = res.rows;
								this.editLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getPartnerInfo();
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
							let temp=this.addForm;
//							temp.province=this.addForm.selectedOptionsAddr[0];
//							temp.city=this.addForm.selectedOptionsAddr[1];
//							temp.district=this.addForm.selectedOptionsAddr[2];
//							delete temp['selectedOptionsAddr']
							let para = Object.assign({}, temp);
								this.$axios({
							    method: 'post',
							    url:'/partner/partnerinfo/add',
							    data:para,
								}).then((res)=>{
									console.log(res)
								this.roles = res.rows;
								this.listLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getPartnerInfo();
							});
						});
					}
				});
			},
			getAddr(){
							this.$axios({
							    method: 'post',
							    url:'/common/address',
								}).then((res)=>{
									this.optionsAddr=res
								})
			}
		},
		mounted() {
			this.getPartnerInfo();
			//this.getAddr();
			//this.getStatus()
		}
	}
</script>
<style >
</style>