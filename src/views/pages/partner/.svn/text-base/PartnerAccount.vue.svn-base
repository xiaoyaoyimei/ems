<template>
	<div>
		<!--搜索工具条-->
		<el-col :span="24" class="toolbar" >
			<el-form :inline="true" :model="filters" @keyup.enter.native="getPartnerAccount">
  				<el-form-item>
					<el-select v-model="filters.partnerInfoId"    placeholder="请选择客户名称" clearable>
			           <el-option v-for="item in partnerInfo" :key="item.id" :label="item.partnerName":value="item.id"></el-option>
					 </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getPartnerAccount">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="PartnerAccount" highlight-current-row v-loading="listLoading"  style="width: 100%;" @sort-change="sortChange">
			<el-table-column prop="partnerInfoId" label="客户名称" width="300" sortable="custom" :formatter="formatPartnerinfo" ></el-table-column>
			<el-table-column prop="totalBalance" label="当前余额" width="200" sortable="custom" ></el-table-column>
			<el-table-column prop="totalFee" label="充值总额" min-width="200" sortable="custom"></el-table-column>
		</el-table>

		<!--分页工具条-->
		<el-col :span="24" class="toolbar">
			 <el-pagination   @size-change="handleSizeChange"  @current-change="handleCurrentChange":current-page="pager.currentPage":page-sizes="pagerSizes":page-size="pager.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
		    </el-pagination>
	   </el-col>

	</div>
</template>
<script>
	export default {
	
		data() {
			return {
				//搜索
				partnerInfo:[],
				typeOptions:[],
				filters:{},
				PartnerAccount: [],
				total: 0,
				pager:this.global_.pager,
				pagerSizes:this.global_.pagerSizes,
				listLoading: false,
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
			handleCurrentChange(val) {
				this.pager.currentPage = val;
				this.getPartnerAccount();
			},
			handleSizeChange(val){
					this.pager.pageSize=val;
					this.getPartnerAccount();
				},
			sortChange(val){
					val.order == 'ascending' ? val.order='asc':val.order='desc';
					this.pager.sortType=val.order;
					this.pager.sortName=val.prop;
					this.getPartnerAccount();
				},
			//获取account列表
			getPartnerAccount() {
				let para = {
					partnerInfoId:this.filters.partnerInfoId,
				};
					this.$axios({
					    method: 'post',
					    url:'/partner/partneraccount/page',
					    params:this.pager,
					    data:para,
					}).then((res)=>{
						this.total = res.totalRows;
						if(res.totalRows>0){
						this.PartnerAccount = res.rows;
						}else{
							this.PartnerAccount =[]
						}
					});
			},
			getPartnerInfo(){
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
			this.getPartnerAccount();
			this.getPartnerInfo()
		}
	}
</script>
<style >
</style>