<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.Fcno" placeholder="FCNO"></el-input>
  				</el-form-item>
  				<el-form-item>
					<el-input v-model="filters.ItemNo" placeholder="ITEMNO"></el-input>
				</el-form-item>
					<el-form-item>
					<el-input v-model="filters.Model" placeholder="MODEL"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.SkuName" placeholder="产品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.Status" multiple collapse-tags  placeholder="请选择产品状态">
			           <el-option v-for="item in statusOptions" :key="item.key" :label="item.value":value="item.key"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.searchCreateTime" type="daterange"align="right" unlink-panels
      					range-separator="至"start-placeholder="创建开始日期" end-placeholder="创建结束日期" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getProductSkus">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col  class="toolbar" >
			<el-button type="success" @click="handleAdd">新增</el-button>
		</el-col>
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="mainImgUrl"  label="主图" min-width="120" sortable="custom" >
				<template slot-scope="scope">
					<img    v-bind:src="scope.row.mainImgUrl | imgfilter" class="m120">
				</template>
			</el-table-column>
				<el-table-column prop="model"  label="MODEL" min-width="120" sortable="custom"></el-table-column>
			<el-table-column prop="itemNo" label="ITEMNO" min-width="120" sortable="custom"></el-table-column>
			<el-table-column prop="fcno"   label="FCNO" min-width="150" sortable="custom"></el-table-column>
			<el-table-column prop="skuName" label="产品名称" width="180" sortable="custom"></el-table-column>
			<el-table-column prop="productSeries.seriesName" label="系列" width="80" sortable="custom"></el-table-column>
			<el-table-column prop="productType.typeName" label="类别" width="80" sortable="custom"></el-table-column>
			<el-table-column prop="listPrice" label="官方价" width="100" sortable="custom"></el-table-column>
			<el-table-column prop="listPrice" label="重量(KG)" width="120" sortable="custom"></el-table-column>
			<el-table-column prop="status" label="状态" width="80" sortable="custom">
				<template slot-scope="scope">
					{{scope.row.status | statusFilter  }}
				</template>
			</el-table-column>
			<el-table-column prop="packageLength" label="长宽高(CM)"width="120" sortable="custom">
					<template slot-scope="scope">
							{{scope.row.packageLength}}*{{scope.row.packageWidth}}*{{scope.row.packageHeight}}
					</template>
			</el-table-column>
			<el-table-column prop="barcode" label="产品条码" width="100" sortable="custom"></el-table-column>
            <el-table-column  label="创建时间" width="180" prop="createTime"></el-table-column>
			<el-table-column label="操作"width="100" >
		      <template slot-scope="scope">
		       	<icon name="edit" label="edit" @click="handleEdit(scope.$index, scope.row)"></icon>
		        <!--<el-popover trigger="hover" placement="bottom"  ref="popovercz">
		        	<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)" v-if="scope.row.status === 'created'">删除</el-button>
							<el-button size="small" @click="handleClosed(scope.$index, scope.row)">停用</el-button>
							<el-button size="small" type='warning' @click="handleUnPublished(scope.$index,scope.row)" v-if="scope.row.status === 'published'">下架</el-button>
						    <el-button size="small" type='success' @click="handlePublished(scope.$index,scope.row)" v-else>上架</el-button>
		          <div slot="reference" class="name-wrapper">
		          	 <i class="el-icon-info" ></i>
		          </div>
		        </el-popover>-->
		      </template>
		    </el-table-column>
		</el-table>

		<!--分页工具条-->
		<el-col :span="24" class="toolbar">
			 <el-pagination   @size-change="handleSizeChange"  @current-change="handleCurrentChange":current-page="pager.currentPage":page-sizes="pagerSizes":page-size="pager.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
		    </el-pagination>
	   </el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="50%">
			<el-form :model="editForm" label-width="120px" :rules="addFormRules" ref="editForm">
				<el-form-item label="产品主图 " prop="mainImgUrl">
		      <el-upload class="upload-demo" ref="upload"
					       action="#"
					     :file-list="fileList"
					     show-file-list
					     :limit="1"
                      :before-upload="beforeUpload"
					  :on-preview="handlePreview"
					   :on-remove="handleRemove"
					   list-type="picture"
					  v-model="editForm.mainImgUrl">
					  <el-button size="small" type="primary" >点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>	
					<el-form-item label="MODEL" prop="model">
						<el-input type="text" placeholder="MODEL" v-model="editForm.model" > </el-input>
					</el-form-item>
				<el-form-item label="ITEMNO" prop="itemNo">
					<el-input type="text" placeholder="ITEMNO" v-model="editForm.itemNo" > </el-input>
				</el-form-item>
	  	          <el-form-item label="FCNO" prop="FCNO">
					<el-input type="text" placeholder="FCNO" v-model="editForm.fcno" > </el-input>
				</el-form-item>
				<el-form-item label="产品名称" prop="skuName">
						<el-input type="text" placeholder="产品名称" v-model="editForm.skuName" > </el-input>
					</el-form-item>
					<el-form-item label="官方价" prop="listPrice">
						<el-input type="number" placeholder="官方价" v-model.number="editForm.listPrice" > </el-input>
					</el-form-item>
						<el-form-item label="重量(KG)" prop="weight">
						<el-input type="number" placeholder="重量(KG)" v-model.number="editForm.weight" > </el-input>
					</el-form-item>
						<el-form-item label="包装长(CM)" prop="packageLength">
						<el-input type="number" placeholder="包装长(CM)" v-model.number="editForm.packageLength" > </el-input>
					</el-form-item>
					<el-form-item label="包装宽(CM)" prop="packageWidth">
						<el-input type="number" placeholder="包装宽(CM)" v-model.number="editForm.packageWidth" > </el-input>
					</el-form-item>
					<el-form-item label="包装高(CM)" prop="packageHeight">
						<el-input type="number" placeholder="包装高(CM)" v-model.number="editForm.packageHeight" > </el-input>
					</el-form-item>
					<el-form-item label="产品条码" prop="barcode">
						<el-input type="text" placeholder="产品条码" v-model="editForm.barcode" > </el-input>
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
				<el-form-item label="产品主图 " prop="mainImgUrl">
					<el-upload ref="upload"
					     action="#"
					     :file-list="fileList"
					     show-file-list
					     :limit="1"
                      :before-upload="beforeUpload"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					    list-type="picture"
					  v-model="addForm.mainImgUrl"">
  			<el-button size="small" type="primary">点击上传</el-button>
 			 <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div></el-upload>
				</el-form-item>	
					<el-form-item label="MODEL" prop="model">
						<el-input type="text" placeholder="MODEL" v-model="addForm.model" > </el-input>
					</el-form-item>
				<el-form-item label="ITEMNO" prop="itemNo">
					<el-input type="text" placeholder="ITEMNO" v-model="addForm.itemNo" > </el-input>
				</el-form-item>
	  	          <el-form-item label="FCNO" prop="fcno">
					<el-input type="text" placeholder="FCNO" v-model="addForm.fcno" > </el-input>
				</el-form-item>
				<el-form-item label="产品名称" prop="skuName">
						<el-input type="text" placeholder="产品名称" v-model="addForm.skuName" > </el-input>
					</el-form-item>
					<el-form-item label="官方价" prop="listPrice">
						<el-input type="number" placeholder="官方价" v-model.number="addForm.listPrice" > </el-input>
					</el-form-item>
						<el-form-item label="重量(KG)" prop="weight">
						<el-input type="number" placeholder="重量(KG)" v-model.number="addForm.weight" > </el-input>
					</el-form-item>
						<el-form-item label="包装长(CM)" prop="packageLength">
						<el-input type="number" placeholder="包装长(CM)" v-model.number="addForm.packageLength" > </el-input>
					</el-form-item>
					<el-form-item label="包装宽(CM)" prop="packageWidth">
						<el-input type="number" placeholder="包装宽(CM)" v-model.number="addForm.packageWidth" > </el-input>
					</el-form-item>
					<el-form-item label="包装高(CM)" prop="packageHeight">
						<el-input type="number" placeholder="包装高(CM)" v-model.number="addForm.packageHeight" > </el-input>
					</el-form-item>
					<el-form-item label="产品条码" prop="barcode">
						<el-input type="text" placeholder="产品条码" v-model="addForm.barcode" > </el-input>
					</el-form-item>
				</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

	</div>
</template>
<script>
	export default {
		filters: {
			
		 		//状态显示转换
			statusFilter(status) {
			  const statusMap = {
			  	"created":'已创建',
			    'unpublish':'未上架',
			    'published':'已上架',
			    'closed': '已停用'
			  }
			  return statusMap[status]
			},
		 },
		data() {
			
			var validateUser = (rule, value, callback) => {
				if(value===''){
		           callback(new Error('请输入用户名'));
		        } 
		         if  (value.length>12||value.length<6){
		        	  callback(new Error('用户名长度在6-12之间'));	
	         	 }
			     else {
				        this.$axios({
						    method: 'post',
						    url:'/product/productsku/list',
						    data:{ "userName": value},
						}).then((res)=>{
					         if(res.length>0){
					                callback(new Error('用户名已经存在'));	
					         }else{
					         	 callback()
					         }
						}).catch(function () {
              		  		callback(new Error('服务异常'))
            			})
			          }
		       
    		 };
			return {
				statusOptions:[],
				fileList:[],
				dialogImageUrl:'',
				dialogVisible:false,
				//搜索
				filters:{
					Fcno: '',
					ItemNo:'',
					Model:'',
					SkuName:'',
					Status:[],
					searchCreateTime:[]
				},
				groupOptions:[],
				companyOptions:[],
				roleOptions:[],
				users: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增-编辑界面验证
				addFormRules: {
					"model": [
						{ required: true, message: '请输入MODEL', trigger: 'blur' }
					],
					itemNo:[
						{ required: true, message: '请输入itemNo', trigger: 'blur' }
					],
					fcno:[
						{ required: true, message: '请输入FCNO', trigger: 'blur' }
					],
					skuName:[
						{  required: true,message: '请输入skuName', trigger: 'blur' }
					],
					listPrice:[
						{required: true,message: '请输入正确的价格', trigger: 'blur',type:'number'}
						],
					weight:[
						{required: true,message: '请输入正确的重量', trigger: 'blur',type:'number'}
						],
					packageLength:[
					  {required: true,message: '请输入长', trigger: 'blur',type:'number'}
					],
					packageWidth:[
					 {required: true,message: '请输入宽', trigger: 'blur',type:'number'}
					],
					packageHeight:[
					 {required: true,message: '请输入高', trigger: 'blur',type:'number'}
					]
				},
				//新增界面数据
				addForm: {
				}
			}
		},
		methods: {
			getStatus(){
					this.$axios({
					    method: 'post',
					    url:'/product/productsku/query/status',
					}).then((res)=>{
						this.statusOptions = res;
					});
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
					         this.addForm.mainImgUrl=res.message;
					         this.editForm.mainImgUrl=res.message;
					});
		      return false
		    },
			submitUpload() {
		        this.$refs.upload.submit();
		    },
		    handleRemove(file, fileList) {
		        console.log(file, fileList);
		    },
		    handlePreview(file) {
		    	 this.dialogImageUrl = file.url;
       			 this.dialogVisible = true;
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
				this.getProductSkus();
			},
			handleSizeChange(val){
				this.pager.pageSize=val;
				this.getProductSkus();
			},
			sortChange(val){
				val.order == 'ascending' ? val.order='asc':val.order='desc';
				this.pager.sortType=val.order;
				this.pager.sortName=val.prop;
				this.getProductSkus();
			},
			//获取SKU列表
			getProductSkus() {
				let para = {
					likeFcno:this.filters.Fcno,
					likeItemNo:this.filters.ItemNo,
					likeModel:this.filters.Model,
					likeSkuName:this.filters.SkuName,
					searchStatus:this.filters.Status,
					searchCreateTimeBegin:this.filters.searchCreateTime[0],
					searchCreateTimeEnd:this.filters.searchCreateTime[1],
				};
				this.listLoading = true;
					this.$axios({
					    method: 'post',
					    url:'/product/productsku/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						this.users = res.rows;
						this.listLoading = false;
					});
			},
			//删除
			handleDel(index, row){
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
						this.$axios({
								    method: 'post',
								    url:'/product/productsku/delete/'+row.id,
								}).then((res)=>{
									if(res.code=='200'){
										this.$message({
										message: '删除成功',
										duration:'1000',
										type: 'success'
										});
										this.getProductSkus();
									}
										if(res.code=='500'){
												this.$message({
											message: res.message,
											duration:'1000',
											type: 'error'
											});
										}
									
								})
							}).catch(() => {
							});
			},
			//停用
				handleClosed(index, row){
				this.$confirm('确认停用该产品吗?', '提示', {
					type: 'warning'
				}).then(() => {
						this.$axios({
								    method: 'post',
								    url:'/product/productsku/close/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '停用成功',
										duration:'1000',
										type: 'success'
										});
										this.getProductSkus();
								})
							});
			},
			//上架
				handlePublished(index, row){
				this.$confirm('确认上架该产品吗?', '提示', {
					type: 'warning'
				}).then(() => {
						this.$axios({
								    method: 'post',
								    url:'/product/productsku/publish/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '上架成功',
										duration:'1000',
										type: 'success'
										});
										this.getProductSkus();
								})
							});
			},
			//下架
				handleUnPublished(index, row){
				this.$confirm('确认下架该产品吗?', '提示', {
					type: 'warning'
				}).then(() => {
						this.$axios({
								    method: 'post',
								    url:'/product/productsku/unpublish/'+row.id,
								}).then((res)=>{
										this.$message({
										message: '下架架成功',
										duration:'1000',
										type: 'success'
										});
										this.getProductSkus();
								})
							});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.$axios({
						    method: 'post',
						    url:'/product/productsku/get/'+row.id,
						}).then((res)=>{
							this.editForm.id=res.id;
							this.editForm.model = res.model;
							this.editForm.itemNo=res.itemNo;
							this.editForm.fcno=res.fcno;
							this.editForm.skuName=res.skuName;
							this.editForm.listPrice=res.listPrice;
							this.editForm.weight=res.weight;
							this.editForm.packageLength=res.packageLength;
							this.editForm.packageWidth=res.packageWidth;
							this.editForm.packageHeight=res.packageHeight;
							this.editForm.barcode=res.barcode;
							this.editForm.mainImgUrl=res.mainImgUrl;
							this.fileList=[{'name':res.mainImgUrl,'url':this.global_.imgurl+res.mainImgUrl}];
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
							    url:'/product/productsku/update/'+id,
							    data:para,
							}).then((res)=>{
								this.users = res.rows;
								this.editLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getProductSkus();
							});
						});
					}
				});
			},
			//显示新增界面
			handleAdd () {
				this.filelist=[];
				this.addFormVisible = true;
			},
			//新增
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
								this.$axios({
							    method: 'post',
							    url:'/product/productsku/add',
							    data:para,
								}).then((res)=>{
								this.users = res.rows;
								this.listLoading = false;
								this.$message({
										message: '提交成功',
										type: 'success'
									});
								this.$refs['addForm'].resetFields();
								this.$refs['filelist']=[];
								this.addFormVisible = false;
									this.getProductSkus();
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
			this.getProductSkus();
			this.getStatus()
		}
	}

</script>

<style >
</style>