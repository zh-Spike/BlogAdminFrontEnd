<template>
    <div class="user-list-box">
        <!--搜索部分-->
        <div class="user-search-pat">
            <el-form :inline="true" size="medium">
                <el-form-item label="用户名">
                    <el-input v-model="search.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址">
                    <el-input v-model="search.email" placeholder="请输入邮箱地址">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="doSearch">查 询</el-button>
                    <el-button type="warning" @click="cleanSearch">清 空</el-button>
                </el-form-item>
            </el-form>
            >
        </div>
        <!--显示内容-->
        <div class="list-box margin-bottom-20">
            <el-table
                    v-loading="loading"
                    :data="userList"
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户名"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="头像"
                        width="60">
                    <template slot-scope="scope">
                        <el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="用户邮箱"
                        width="120">
                </el-table-column>
                <el-table-column
                        label="签名"
                        width="260">
                    <template slot-scope="scope">
                        <div v-if="scope.row.sign">
                            <span v-text="scope.row.sign"></span>
                        </div>
                        <div v-else>
                            <span>很酷,不说话!</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="200">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === '0'">
                            <el-tag type="danger">不可用</el-tag>
                        </div>
                        <div v-if="scope.row.state === '1'">
                            <el-tag type="success">正常</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建日期">
                    <template slot-scope="scope">
						<span v-text="formatDate(scope.row.createTime)">
						</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="更新日期">
                    <template slot-scope="scope">
						<span v-text="formatDate(scope.row.updateTime)">
						</span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="medium" @click="resetPassword(scope.row)">重置密码</el-button>
                        <el-button type="danger" v-if="scope.row.status !== '0'" size="medium"
                                   @click="deleteItem(scope.row)">删除
                        </el-button>
                        <el-button type="danger" v-if="scope.row.status === '0'" size="medium"
                                   @click="deleteItem(scope.row)" disabled>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-navigation-box margin-bottom-20 clearfix">
            <el-pagination
                    class="user-list-page-navigation-bar"
                    background
                    @current-change="onPageChange"
                    :current-page="pageNavigation.currentPage"
                    :page-size="pageNavigation.pageSize"
                    layout="prev, pager, next"
                    :total="pageNavigation.totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/api'
import * as dateUtils from "@/utils/date";

export default {
	data() {
		return {
			search: {
				userName: '',
				email: ''
			},
			loading: false,
			userList: [],
			pageNavigation: {
				currentPage: 1,
				totalCount: 0,
				pageSize: 10,
			}
		}
	},
	methods: {
		onPageChange(page) {
			this.pageNavigation.currentPage = page;
			console.log(this.pageNavigation.currentPage);
			this.listUsers();
		},
		cleanSearch() {
			this.search.email = '';
			this.search.userName = '';
			this.listUsers();
		},
		doSearch() {
			api.doUserSearch(this.search.userName, this.search.email).then(result => {
				this.handleListResult(result);
			});
		},
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		deleteItem() {

		},
		resetPassword() {

		},
		listUsers() {
			api.listUsers(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result => {
				this.handleListResult(result);
			});
			this.loading = true;
		},
		handleListResult(result) {
			if (result.code === api.success_code) {
				this.userList = result.data.content;
				this.pageNavigation.currentPage = result.data.number + 1;
				this.pageNavigation.totalCount = result.data.totalElements;
				this.pageNavigation.pageSize = result.data.size;
			} else {
				this.$message.error(result.message);
			}
			this.loading = false;
		}
	},
	mounted() {
		this.listUsers();
	}
}

</script>

<style>
.user-list-page-navigation-bar {
    margin-right: 50px;
    float: right;
}
</style>