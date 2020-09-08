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
        <div class="user-list-dialog-box">
            <el-dialog
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :show-close="false"
                    title="删除提示"
                    :visible.sync="deleteDialogShow"
                    width="400px">
                <span>你确定要删除: {{ deleteUserName }} 这个用户嘛 ？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="primary" @click="deleteDialogShow= false">取 消</el-button>
					<el-button size="medium" type="danger" @click="doDeleteItem">确 定</el-button>
				</span>
            </el-dialog>
            <el-dialog
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :show-close="false"
                    title="密码重置"
                    :visible.sync="resetPasswordShow"
                    width="400px">
                <div class="reset-password-box">
                    <div class="reset-tips-text">修改: {{ '"' + targetResetUserName + '"' }} 的密码</div>
                    <el-form label-width="70px" size="medium">
                        <el-form-item label="新密码" prop="pass">
                            <el-input type="password" v-model="resetPasswordValue" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="primary" @click="resetPasswordShow= false">取 消</el-button>
					<el-button size="medium" type="danger" @click="doResetPassword">确 定</el-button>
				</span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {hex_md5} from "@/utils/md5";
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
			},
			deleteDialogShow: false,
			deleteUserName: '',
			targetDeleteUserId: '',
			resetPasswordShow: false,
			resetPasswordValue: '',
			targetResetUserName: '',
			targetUserId: ''
		}
	},
	methods: {
		doResetPassword() {
			// 检查密码不为空
			if (this.resetPasswordValue === '') {
				this.$message.error('新密码不能为空');
				return;
			}
			api.resetPassword(this.targetUserId, hex_md5(this.resetPasswordValue)).then(result => {
				if (result.code === api.success_code) {
					this.resetPasswordShow = false;
					this.$message.success(result.message);
				} else {
					this.$message.error(result.message);
				}

			})
		},
		doDeleteItem() {
			// 删除用户
			api.deleteUserById(this.targetDeleteUserId).then(result => {
				if (result.code === api.success_code) {
					this.deleteDialogShow = false;
					// 处理结果
					this.$message.success(result.message);
					this.listUsers();
				} else {
					this.$message.error(result.message);
				}
			})
		},
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
		deleteItem(item) {
			this.targetDeleteUserId = item.id;
			this.deleteUserName = item.userName;
			this.deleteDialogShow = true;
		},
		resetPassword(item) {
			this.resetPasswordShow = true;
			this.targetResetUserName = item.userName;
			this.targetUserId = item.id;
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
.user-list-box {
    padding: 20px;
}

.reset-tips-text {
    margin-left: 15px;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 20px;
}

.user-list-page-navigation-bar {
    margin-right: 50px;
    float: right;
}
</style>