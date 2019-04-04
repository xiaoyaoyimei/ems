<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getRoles">
				<el-form-item>
					 <el-select v-model="filters.groupId"  collapse-tags  placeholder="请选择" multiple>
			           <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName":value="item.id"></el-option>
					 </el-select>
  				</el-form-item>
  				<el-form-item>
					<el-input v-model.trim="filters.roleName" placeholder="公司名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getRoles">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
			<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" @sort-change="sortChange">
			<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column prop="groupId" label="所属集团" width="180" sortable="custom"  :formatter="formatGroupId" >
			</el-table-column>
			<el-table-column prop="roleName" label="角色名称" min-width="180" sortable="custom"></el-table-column>
			<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<i class="fa fa-bookmark"  @click="handleQx(scope.$index,scope.row)" title="分配权限"></i>
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
				<el-button type="success" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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
				<el-button type="success" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--分配权限-->
		<el-dialog title="分配权限" :visible.sync="treeVisible" :close-on-click-modal="false" :lock-scroll="true">
			<el-input placeholder="输入关键字进行过滤" v-model="filterText" class="mb10"></el-input>
			<el-tree ref="tree"  :data="trees" show-checkbox    node-key="id"  :filter-node-method="filterNode"  :props="defaultProps" v-loading="loading"></el-tree>
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
				//搜索
				filters:{
					companyCode: '',
					companyName:'',
					statusEnum:[],
				},
				defaultProps: {
		          children: 'children',
		          label: 'label'
		        },
		        loading: true,
				treeVisible:false,
				filterText:'',
				trees:[],
				groupOptions:[],
				roles: [],
				chooseroleId:'',
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {
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
			filterNode(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		      },
			handleQx(index, row){
				this.loading=false
				    var data=[];
				this.chooseroleId=row.id;
					this.treeVisible=true;
					this.$axios({
					    method: 'post',
					    url:'/system/systemrole/edit/resource/'+row.id,
					}).then((res)=>{
						this.trees = res;
						  for (let i=0;i<res.length;i++){
							  	if(res[i].checked=="true"){
							  			data.push(res[i].id);
							  	}
						  	   for(let j=0;j < res[i].children.length;j++){
						  	   	    if(res[i].children[j].checked=="true"){
						  	   	    	data.push(res[i].children[j].id);
						  	   	    }
						  	   	    for(let n=0;n<res[i].children[j].children.length;n++){
							  	   	    if(res[i].children[j].children[n].checked=="true"){
							  	   	    	data.push(res[i].children[j].children[n].id);
							  	   	    }
						  	   	    }
						  	   }
						  }
		                        this.$refs.tree.setCheckedKeys(data);
					});
				},
			getCheckedKeys(){
		      	var resourceIds=this.$refs.tree.getCheckedKeys();
	     		this.$axios({
							    method: 'post',
							    url:'/system/systemrole/save/resource/'+this.chooseroleId,
							    data:resourceIds
								}).then((res)=>{
								this.$message({
										message: '分配权限成功',
										type: 'success'
								});
								this.treeVisible = false;
								//收缩tree
								for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
		         	  				this.$refs.tree.store._getAllNodes()[i].expanded=false;
		        					}
				});
			
			   },
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
					likeRoleName: this.filters.roleName,
					searchGroupId:this.filters.groupId,
				};
				this.listLoading = true;
					this.$axios({
					    method: 'post',
					    url:'/system/systemrole/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.roles = res.rows;
						}else{
							this.roles =[]
						}
						this.listLoading = false;
					});
			},
			//获取所属集团
			getGroup(){
					this.$axios({
					    method: 'post',
					    url:'/group/groupbase/list',
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
								    method: 'post',
								    url:'/system/systemrole/delete/'+row.id,
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
						    url:'/system/systemrole/get/'+row.id,
						}).then((res)=>{
							this.editForm.groupId = res.groupId;
							this.editForm.roleName = res.roleName;
							this.editForm.id=res.id
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
							let para = {
								"groupId":this.editForm.groupId,
								"roleName":this.editForm.roleName
							};
							this.$axios({
							    method: 'post',
							    url:'/system/systemrole/update/'+this.editForm.id,
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
							    method: 'post',
							    url:'/system/systemrole/add',
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