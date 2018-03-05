<template>
	<section>
		<el-button type="default" @click="edit()" :disabled="this.sels.length===0">编辑</el-button>
		<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
		
	<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			<!--	<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>-->
			</el-form>
		</el-col>
  <el-table
    :data="tableData"
    style="width: 100%"
    @selection-change="selsChange"
   >
  <el-table-column type="selection" width="55">
			</el-table-column>
    <el-table-column
      label="日期"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      width="180"  prop="name">
    </el-table-column>
    	<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
				<el-table-column prop="age" label="年龄" width="100" sortable>
			</el-table-column>
    <el-table-column  label="地址"
      width="280"> <template slot-scope="scope">{{ scope.row.addr }}</template></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
  <!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.date"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
</section>
</template>

<script>
  export default {
    data() {
      return {
      	filters: {
					name: ''
				},
      	 self: this,
      	editFormVisible:false,
      	sels: [],
      	users:[],
      	listLoading: false,
      	total: 0,
		editForm: {
			id: 0,
			name: '',
			sex: -1,
			age: 0,
			birth: '',
			addr: '测试地址'
		},
		editLoading: false,
		editFormRules: {
			name: [
				{ required: true, message: '请输入姓名', trigger: 'blur' }
			]
		},
		     columns7: [
		      {
                        title: '日期',
                        key: 'date'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        render (row, column, index) {
                            return `<Icon type="person"></Icon> <strong>${row.name}</strong>`;
                        }
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'addr'
                    },
                     {
                        title: '性别',
                        key: 'sex'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render (row, column, index) {
                            return `<i-button type="primary" size="small" @click.native="show(${index})">查看</i-button> <i-button type="error" size="small" @click="remove(${index})">删除</i-button>`;
                        }
                    }
                ],
        tableData: [
        {
        	id:1,
          date: '2016-05-02',
          name: '方丽静',
          age:20,
          sex:1,
          addr: '上海市普陀区金沙江路 1518 弄'
        }, {
        		id:2,
          date: '2016-05-04',
          name: '张强',
          sex:0,
          age:21,
          addr: '上海市普陀区金沙江路 1517 弄'
        }, {
        	id:3,
          date: '2016-05-01',
          name: '丽丽',
          age:22,
          sex:1,
          addr: '上海市普陀区金沙江路 1519 弄'
        }, {
          id:4,
          date: '2016-05-03',
          name: '王小虎',
          sex:1,
            age:23,
          addr: '上海市普陀区金沙江路 1516 弄'
        }],
      }
    },
    methods: {
    	//获取数据源
    	edit(){
    		    var item = this.sels;
    		    if(this.sels.length>1){
			         this.$message({
			          showClose: true,
			          message: '请选择当行操作',
			          type: 'warning'
			        });
			        return false
    		    }
    		    this.editFormVisible = true;
				this.editForm = Object.assign({}, item[0]);
    	},
    		getUsers() {
				this.listLoading = true;
				this.$axios({
					    method: 'post',
					    url:'http://10.0.0.2:8080/dxracer/code/columns',
					    data:{
					    	table_schema:'dx_b2b',
					        table_name:'t_system_business'
					    }
					}).then((res)=>{
					    console.log(res.data)
					    this.total = res.data.total;
					this.users = res.data;
					this.listLoading = false;
					}).catch(function (reason) {
	    			   console.log('失败：' + reason);
					});
			},
    		formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
    	handleCurrentChange(val) {
				this.page = val;
				//this.getUsers();
			},
    	selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
    	batchRemove() {
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
			},
      //编辑
			editSubmit () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
      handleDelete(index, row) {
      		this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.tableData.splice(index,1);
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
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
			this.getUsers();
		}
  }
</script>