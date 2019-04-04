<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getAnnounceInfo">
  				<el-form-item>
					<el-input v-model.trim="filters.likeTitle" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getAnnounceInfo">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
			<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="AnnounceInfo" highlight-current-row v-loading="listLoading" style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="publisher" label="发布人" width="180" sortable="custom"   :formatter="formatUser">
			</el-table-column>
			<el-table-column prop="receivier" label="接收人" width="180" sortable="custom"   >
			</el-table-column>
				<el-table-column prop="title" label="标题"  min-width="180"sortable="custom">
					<template slot-scope="scope"><div @click="handleshow(scope.$index, scope.row)">{{scope.row.title}}</div></template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"   >
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
				<el-form-item label="标题"  prop="title">
					<el-input v-model="editForm.title" type="text" placeholder="标题 "></el-input>
				</el-form-item>
				<el-form-item label="内容"  prop="content">
					<u-editor  :uevalue="editForm.content" @ievent='ievent' ></u-editor>
				</el-form-item>
				<el-form-item label="接收人 " prop="receivier">
						<el-input type="text" placeholder="接收人 " v-model="editForm.receivier" > </el-input>
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
				<el-form-item label="标题 " prop="title">
						<el-input type="text" placeholder="标题 " v-model="addForm.title" > </el-input>
				</el-form-item>
					<el-form-item label="内容 " prop="content">
						<u-editor @ievent='ievent'></u-editor>
				   </el-form-item>
							<el-form-item label="接收人 " prop="receivier">
						<el-input type="text" placeholder="接收人 " v-model="addForm.receivier" > </el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="success" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--显示-->
			<el-dialog title="公告详情" :visible.sync="showVisible" :close-on-click-modal="false">
						<div  v-html="showcontent" class="showcontent">{{showcontent}}</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showVisible = false">关闭</el-button>
			</div>
		</el-dialog>

	</div>
</template>
<script>
	//富文本
    import uEditor from '../../../components/uEditor'
	export default {
			  components: {
				//使用编辑器
   			'u-editor':uEditor,
  			},
		data() {
			return {
				uevalue:'',
					uploadUrl:'',
					fileName:'',
					showcontent:'',
				filters:{},
				AnnounceInfo: [],
				users:[],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {title:'',content:''},
				showVisible:false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				 orderId: '1',
			      isShowCheckOrder: false,
			      isShowErrDialog: false,
				//新增-编辑界面验证
				addFormRules: {
					title:[
						{ required: true, message: '请输入标题名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: { content:''}
			}
		},
		
		methods: {
					formatUser: function (row, column) {
				for(var i = 0 ;i < this.users.length;i++){
						if(this.users[i].id == row.publisher){
							return this.users[i].userName;
						}
					}
			},
			//接收子组件内容img上传后的URL
			ievent(...data){
				this.addForm.content=data;
				this.editForm.content=data[0];
    			},
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getAnnounceInfo();
			},
				handleSizeChange(val){
					this.pager.pageSize=val;
					this.getAnnounceInfo();
				},
				sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getAnnounceInfo();
				},
						//获取用户列表
			getUsers() {
				this.listLoading = true;
					this.$axios({
					    method: 'post',
					    url:'/system/systemuser/list',
					    data:{},
					}).then((res)=>{
						this.users = res;
						this.listLoading = false;
					});
			},
			//获取公告列表
			getAnnounceInfo() {
				this.listLoading = true;
				let para = {
					likeTitle: this.filters.likeTitle,
				};
					this.$axios({
					    method: 'post',
					    url:'/announce/announceinfo/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.AnnounceInfo = res.rows;
						}else{
							this.AnnounceInfo =[]
						}
						this.listLoading =false
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
								    url:'/announce/announceinfo/delete/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '删除成功',
										type: 'success'
										});
									this.getAnnounceInfo();
								})
							});
			},
			handleshow(index,row){
				
		this.showVisible = true;
				var self=this;
				self.$axios({
						    method: 'post',
						    url:'/announce/announceinfo/get/'+row.id,
						}).then((res)=>{
							self.showcontent = res.content;
				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				
				this.showVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/announce/announceinfo/get/'+row.id,
						}).then((res)=>{
							this.editForm.title = res.title;
							this.editForm.content = res.content;
							this.editForm.receivier = res.receivier;
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
								"title":this.editForm.title,
								"content":this.editForm.content,
								"receivier":this.editForm.receivier
							};
							this.$axios({
							    method: 'post',
							    url:'/announce/announceinfo/update/'+this.editForm.id,
							    data:para,
							}).then((res)=>{
								this.AnnounceInfo = res.rows;
								this.editLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getAnnounceInfo();
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
							let para={title:this.addForm.title,content:this.addForm.content[0],receivier:this.addForm.receivier};
								this.$axios({
							    method: 'post',
							    url:'/announce/announceinfo/add',
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
									this.getAnnounceInfo();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
				batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getAnnounceInfo();
			this.getUsers();
		},
	}

</script>

<style scoped="scoped">
	.showcontent img{
		display: block;
		margin: 0 auto;
	}
</style>