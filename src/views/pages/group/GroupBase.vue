<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar">
			<el-form :inline="true" :model="filters" @keyup.enter.native="getGroupBase">
				 <el-col :md='8' :lg="3">
				<el-form-item >
					<el-input v-model="filters.groupCode" placeholder="集团编号"></el-input>
				</el-form-item>
				</el-col>
				 <el-col :md='8' :lg="3">
				<el-form-item > 
					<el-input v-model="filters.groupName" placeholder="集团名称"></el-input>
				</el-form-item>
					</el-col>
					<el-col :md='8' :lg="3">
					<el-form-item >
						<el-select v-model="filters.useStatus" multiple collapse-tags placeholder="请选择状态">
				           <el-option v-for="item in useStatus" :key="item.key" :label="item.value":value="item.key">
				           </el-option>
						 </el-select>
	  				</el-form-item>
  				</el-col>
					<el-col :md='12' :lg="6">
						<el-form-item > 
						<el-date-picker v-model="filters.searchCreateTime" type="daterange"align="right" unlink-panels
      					range-separator="至"start-placeholder="创建开始日期" end-placeholder="创建结束日期" value-format="yyyy-MM-dd"></el-date-picker>
				      </el-form-item>
					</el-col>
					<el-col :md='12' :lg="6">
						<el-form-item > 
						<el-date-picker v-model="filters.searchExpireTime" type="daterange"align="right" unlink-panels
      					range-separator="至"start-placeholder="到期开始日期" end-placeholder="到期结束日期" value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
					</el-col>
  				<el-col :md='6' :lg="3">
				<el-form-item >
					<el-button type="success" v-on:click="getGroupBase">查询</el-button>
				</el-form-item>
				</el-col>
			</el-form>
		</el-col>
		<!--按钮组-->
			<el-col :span="24" class="toolbar">	
				<el-button type="success" @click="handleAdd"  >新增</el-button>
			</el-col>
		<!--列表-->
		<el-table :data="groupbase"  ref="table" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" @sort-change="sortChange">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="groupCode" label="集团编号" width="120" sortable="custom">
			</el-table-column>
			<el-table-column prop="groupName" label="集团名称" width="180" sortable="custom">
			</el-table-column>
			<el-table-column prop="companyCount" label="允许创建公司数" width="150" sortable="custom">
			</el-table-column>
			<el-table-column prop="createTime" label="创建日期 " width="180"  sortable="custom">
			</el-table-column>
			<el-table-column prop="expireTime" label="到期日期" width="180" sortable="custom">
			</el-table-column>
			<el-table-column prop="useStatus"  label="状态" min-width="100" sortable="custom" :formatter="formatStatus">
			</el-table-column>
			<el-table-column label="操作" width="350">
				<template slot-scope="scope">
					<i class="fa fa-edit"  @click="handleEdit(scope.$index, scope.row)" title="编辑"></i>
		      		<i class="fa fa-trash-o"  @click="handleDel(scope.$index, scope.row)" title="删除"  v-show="scope.row.useStatus=='newly'"></i>
				  	<i class="fa fa-bookmark"  @click="handleQx(scope.$index,scope.row)" title="分配权限"></i>
				  	<i class="fa fa-minus-circle"  @click="handleAudit(scope.$index,scope.row)"   v-if="scope.row.useStatus === 'normal'" title="停用"></i>
				  	<i class="fa fa-repeat"  @click="handleAudit(scope.$index,scope.row)"   v-else title="启用"></i>
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
				<el-form-item label="集团编号" >
					<el-input v-model="editForm.groupCode" ></el-input>
				</el-form-item>
				<el-form-item label="集团名称" >
					<el-input v-model="editForm.groupName" ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="success" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="集团编号" prop="groupCode">
					<el-input v-model="addForm.groupCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="集团名称" prop="groupName">
					<el-input v-model="addForm.groupName" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--分配权限-->
		<el-dialog title="分配权限" :visible.sync="treeVisible" :close-on-click-modal="false" :lock-scroll="true">
			<el-input placeholder="输入关键字进行过滤" v-model="filterText" class="mb10"></el-input>
			<el-tree ref="tree"  :data="trees" show-checkbox     :props="defaultProps"  node-key="id"  :filter-node-method="filterNode" :default-expanded-keys="expandedKeys">
			</el-tree>
				<div slot="footer" class="dialog-footer">
				<el-button @click.native="treeVisible = false">取消</el-button>
				<el-button type="success" @click.native="getCheckedKeys" >提交</el-button>
			</div>
		</el-dialog>

	</div>
</template>
<script>
	export default {
		data() {
			return {
				//树
				value3:true,
				filterText:'',
			    defaultProps: {
		          children: 'children',
		          label: 'label'
		       },
		       expandedKeys:[],
		       defaultKeys:[],
			    count: 1,
			     useStatus:[],
				//搜索
				filters:
				{
					groupCode: '',
					groupName:'',
					useStatus:[],
					searchCreateTime:[],
					searchExpireTime:[]
				},
				groupbase: [],
				trees:[],
				total: 0,
				updateId:'',
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {
					groupCode:'',
					groupName: ''
				},
				treeVisible:false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					groupCode: [
						{ required: true, message: '请输入集团编号', trigger: 'blur' }
					],
					groupName: [
						{ required: true, message: '请输入集团名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					groupCode:'',
					groupName: ''
				}

			}
		},
	watch: {
	      filterText(val) {
	        this.$refs.tree.filter(val);
	      }
	    },
		methods: {
			
			//状态显示转换
			formatStatus: function (row, column) {
				for(var i = 0 ;i < this.useStatus.length;i++){
					if(this.useStatus[i].key == row.status){
						return this.useStatus[i].value;
					}
				}
			},
			//权限树过滤
			 filterNode(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		      },
		
			formatStatus: function (row, column) {
				for(var i = 0 ;i < this.useStatus.length;i++){
						if(this.useStatus[i].key == row.useStatus){
							return this.useStatus[i].value;
						}
					}
			},
			handleSizeChange(val) {
				this.pager.pageSize = val;
				this.getGroupBase();
			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getGroupBase();
			},
			//表格排序
			sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getGroupBase();
			},
			//获取基础信息列表
			getGroupBase() {
				let para = {
					likeGroupCode: this.filters.groupCode,
					likeGroupName: this.filters.groupName,
					searchUseStatus:this.filters.useStatus,
					searchCreateTimeStart:this.filters.searchCreateTime[0],
					searchCreateTimeEnd:this.filters.searchCreateTime[1],
					searchExpireTimeStart:this.filters.searchExpireTime[0], 
					searchExpireTimeEnd:this.filters.searchExpireTime[1], 
				};
				this.listLoading = true;
					this.$axios({
					    method: 'post',
					    url:'/group/groupbase/page',
					    params:this.pager,
					    data:para
					}).then((res)=>{
						this.total = res.totalRows;
						this.groupbase = res.rows;
						this.listLoading = false;
					});
			},
			//获取状态
			getUseStatus(){
					this.$axios({
					    method: 'post',
					    url:'/group/groupbase/query/useStatus',
					}).then((res)=>{
						this.useStatus = res;
						this.listLoading = false;
					});
			},
			//删除
			handleDel (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
						this.$axios({
								    method: 'post',
								    url:'/group/groupbase/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getGroupBase();
								})
							})
			},
			//停用
			handleAudit(index, row){
				this.$confirm('确认停用该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
						this.$axios({
								    method: 'post',
								    url:'/group/groupbase/audit/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '停用成功',
										type: 'success'
										});
									this.getGroupBase();
								})
						});
			},
			//显示编辑界面
			handleEdit (index, row) {
				this.updateId=row.id;
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/group/groupbase/get/'+row.id,
						}).then((res)=>{
							this.editForm.groupCode = res.groupCode;
							this.editForm.groupName = res.groupName;
				});
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
				  companyCount: 1,
					expireTime:'',
					groupCode:'',
					groupName: ''
				};
			},
			handleQx(index, row){
				this.treeVisible = true;
				this.choosegroupId=row.id
				    var tempfirst=[],tmepsecond=[],tmepthird=[],secondchildren=[];
	     			this.$axios({
							    method: 'post',
							    url:'/group/groupbase/resource/'+row.id,
								}).then((res)=>{
									//第一层
								 for (let i=0;i<res.length;i++){
								 	if(res[i].checked=="true"){
								 		this.defaultKeys.push(res[i].id);
								 	}
				          			if( res[i].level=="first"){
				          				 tempfirst.push({"id":res[i].id,"label":res[i].name,children: []});
				          			}
				          			else if(res[i].level=="second"){
				          		       tmepsecond.push(res[i])
				          			}
				          			else{
				          				tmepthird.push(res[i])
				          			}
				          		}
								for(let f=0;f<tempfirst.length;f++){
					          		for (let s=0;s<tmepsecond.length;s++){
						          			if( tmepsecond[s].pId==tempfirst[f].id){
						          				tempfirst[f].children.push({"id":tmepsecond[s].id,"label":tmepsecond[s].name,children: []});
						          		 	}
					          		  }
			     				}
								//获取第二层(包含children)
								for(var item in tempfirst){
									if(tempfirst[item].children.length>0){
										for(var children in tempfirst[item].children){
										     secondchildren.push(tempfirst[item].children[children]);
										}
								    }
								}
								for(let se=0;se<secondchildren.length;se++){
											for (let t=0;t<tmepthird.length;t++){
							          			if( tmepthird[t].pId==secondchildren[se].id){
							          				secondchildren[se].children.push({"id":tmepthird[t].id,"label":tmepthird[t].name});
							          		 	}
						          		  }
									}
							this.trees=tempfirst;
							this.setCheckedKeys(this.defaultKeys);
					});
			},
			//设置权限选中
			setCheckedKeys(val){
				 this.$refs.tree.setCheckedKeys(val);
				 this.defaultKeys=[];
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.listLoading = true;
							let para = Object.assign({}, this.editForm);
							this.$axios({
							    method: 'post',
							    url:'/group/groupbase/update/'+this.updateId,
							    data:para,
							}).then((res)=>{
							this.baseinfo = res.rows;
							this.listLoading = false;
							this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getGroupBase();
							});
						});
					}
				});
			},
			//新增
			addSubmit () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
								this.$axios({
							    method: 'post',
							    url:'/group/groupbase/add',
							    data:para,
								}).then((res)=>{
								this.baseinfo = res.rows;
								this.listLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
								});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getGroupBase();
							});
						});
					}
				});
			},
			selsChange (sels) {
				this.sels = sels;
			}, 
	     	getCheckedKeys(){
	     	    var resource=this.$refs.tree.getCheckedKeys();
	     	    //半选中（在）
		      	var resourcehalf=this.$refs.tree.getHalfCheckedKeys();
		    	var resourceIds=resource.concat(resourcehalf);
	     		this.$axios({
							    method: 'post',
							    url:'/group/groupbase/group/update/'+this.choosegroupId,
							    data:resource
								}).then((res)=>{
								this.$message({
										message: '分配权限成功',
										type: 'success'
								});
								this.treeVisible = false;
								for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
		           					this.$refs.tree.store._getAllNodes()[i].expanded=false;
		        				}
				});
				this.$refs.table.clearSelection();
				
	     	},
		},
		mounted() {
			this.getGroupBase();
			this.getUseStatus();
		}
	}

</script>

<style  scoped="scoped">
	
	.mb10{
		margin-bottom:10px
	}
</style>