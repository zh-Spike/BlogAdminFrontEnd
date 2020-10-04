<template>
    <div class="appointment-box">
        <div class="appointment-action-bar margin-bottom-10">
            <el-button type="primary" size="medium" @click="showAddAppointment">新增预约审批</el-button>
        </div>
        <div class="appointment-list-box">
            <el-table
                    v-loading="loading"
                    :data="appointments"
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="labName"
                        label="实验室名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="用户"
                        width="200">
                    <template slot-scope="scope">
                        <a href="#" class="article-user-avatar clearfix">
                            <el-avatar :src="scope.row.userAvatar"></el-avatar>
                            <span class="article-user-name">{{ scope.row.userName }}</span>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="appointmentNumber"
                        label="预约人数"
                        width="100">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === '0'">
                            <el-tag type="danger">拒绝</el-tag>
                        </div>
                        <div v-if="scope.row.state === '1'">
                            <el-tag type="primary">审核中</el-tag>
                        </div>
                        <div v-if="scope.row.state === '2'">
                            <el-tag type="success">通过</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="startTime"
                        label="开始时间"
                        width="200">
                    <template slot-scope="scope">
						<span v-text="formatDate(scope.row.createTime)">
						</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="endTime"
                        label="结束时间"
                        width="200">
                    <template slot-scope="scope">
						<span v-text="formatDate(scope.row.updateTime)">
						</span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="300">
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" @click="edit(scope.row)">
                            修改
                        </el-button>
                        <el-button type="primary" v-if="scope.row.state === '1'" size="mini"
                                   @click="checkAppointment(scope.row)">
                            通过
                        </el-button>
                        <el-button type="success" v-else size="mini"
                                   @click="checkAppointment(scope.row)">
                            再给机会
                        </el-button>
                        <el-button type="danger" v-if="scope.row.state !== '0'" size="mini"
                                   @click="deleteItem(scope.row)">驳回
                        </el-button>
                        <el-button type="danger" v-if="scope.row.state === '0'" size="mini"
                                   @click="deleteItem(scope.row)" disabled>驳回
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页-->
        <div class="appointment-page-navigation">
            <el-pagination
                    class="appointment-list-page-navigation-bar"
                    background
                    @current-change="onPageChange"
                    :current-page="pageNavigation.currentPage"
                    :page-size="pageNavigation.pageSize"
                    layout="prev, pager, next"
                    :total="pageNavigation.totalCount">
            </el-pagination>
        </div>
        <div class="appointment-dialog-box">
            <el-dialog
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :show-close="false"
                    title="删除提示"
                    :visible.sync="deleteDialogShow"
                    width="400px">
                <span>你确定要删除: {{ deleteMessage }} 的审批吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="primary" @click="deleteDialogShow= false">取 消</el-button>
					<el-button size="medium" type="danger" @click="doDeleteItem">确 定</el-button>
				</span>
            </el-dialog>
            <el-dialog
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :show-close="false"
                    :title="editTitle"
                    :visible.sync="editorDialogShow"
                    width="500px">
                <div class="appointment-editor-box">
                    <el-form label-width="80px">
                        <el-form-item label="名称">
                            <el-input v-model="lab.labName"></el-input>
                        </el-form-item>
                        <el-form-item label="容量">
                            <el-input v-model="lab.labNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="lab.state" placeholder="选择状态">
                                <el-option label="不可用" value="0"></el-option>
                                <el-option label="正常" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="danger" @click="onEditorClose">取 消</el-button>
					<el-button size="medium" type="primary" @click="postLab">{{ editorCommitText }}</el-button>
				</span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import * as dateUtils from "@/utils/date";
import * as api from "@/api/api";

export default {
	data() {
		return {
			loading: false,
			editorCommitText: '修改信息',
			editorDialogShow: false,
			editTitle: '编辑信息',
			appointments: [],
			deleteDialogShow: false,
			deleteMessage: '',
			deleteTargetId: '',
			lab: {
				id: '',
				labName: '',
				labNumber: '',
				state: '1'
			},
			pageNavigation: {
				currentPage: 1,
				totalCount: 0,
				pageSize: 10,
			}
		};
	},
	methods: {

		onEditorClose() {
			this.editorDialogShow = false;
			this.resetLab();
		},
		postLab() {
			// 检查内容
			if (this.lab.labName === '') {
				this.showWarning('名称不能为空');
				return;
			}
			if (this.lab.labNumber === '') {
				this.showWarning('人数不能为空');
				return;
			}
			// 提交数据
			// 提示结果
			// 刷新数据
			// 如果有ID的就是更新
			if (this.lab.id === '') {
				// 如果没有ID的就是添加
				api.postLab(this.lab).then(result => {
					this.editorDialogShow = false;
					if (result.code === api.success_code) {
						this.$message({
							message: '添加成功',
							center: true,
							type: 'success'
						});
						// 刷新列表
						this.listLabs();
						// 重置数据
						this.resetLab();
					} else {
						this.showWarning(result.message);
					}
				});
			} else {
				api.updateLab(this.lab.id, this.lab).then(result => {
					if (result.code === api.success_code) {
						this.$message.success(result.message);
						this.editorDialogShow = false;
						this.listLabs();
						this.resetLab();
					} else {
						this.$message.error(result.message);
					}
				})
			}
		},
		edit(item) {
			// 赋值 先请求单个数据 再显示 数据回显
			// 显示dialog
			this.lab.id = item.id;
			this.lab.labName = item.labName;
			this.lab.labNumber = item.labNumber;
			this.lab.state = item.state;
			// console.log(item);
			this.editorDialogShow = true;
			this.editorCommitText = '修改信息';
			this.editTitle = '编辑实验室';
		},
		resetLab() {
			this.lab.labName = '';
			this.lab.labNumber = '';
			this.lab.state = '1';
		},
		checkAppointment(item) {
			api.checkAppointment(item.id).then(result => {
				if (result.code === api.success_code) {
					// 处理结果
					this.listAppointments();
					this.$message.success(result.message);
				} else {
					this.$message.error(result.message);
					this.listAppointments();
				}
			})
		},
		deleteItem(item) {
			// 不是马上删除 弹出确认方框
			this.deleteDialogShow = true;
			this.deleteMessage = item.userName;
			this.deleteTargetId = item.id
			// console.log(item);
		},
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		doDeleteItem() {
			api.deleteAppointment(this.deleteTargetId).then(result => {
				if (result.code === api.success_code) {
					this.$message({
						type: 'success',
						center: true,
						message: result.message
					});
					this.listAppointments();
				}
			});
			this.deleteDialogShow = false;
		},
		listAppointments() {
			this.loading = true;
			api.listAppointments(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result => {
				this.loading = false;
				//	console.log(result);
				if (result.code === api.success_code) {
					this.appointments = result.data.content;
					this.pageNavigation.currentPage = result.data.number + 1;
					this.pageNavigation.totalCount = result.data.totalElements;
					this.pageNavigation.pageSize = result.data.size;
				}
			});
		},
		onPageChange(page) {
			this.pageNavigation.currentPage = page;
			this.listAppointments();
		},
		showAddAppointment() {
			this.editorDialogShow = true;
		},
		showWarning(msg) {
			this.$message({
				message: msg,
				type: 'warning',
				center: true
			})
		}
	},
	mounted() {
		this.editTitle = '添加预约审批';
		this.editorCommitText = '添 加'
		this.listAppointments();
	}
}
</script>

<style>
.appointment-box {
    padding: 20px;
}

.appointment-list-box {
    padding: 10px;
}

.appointment-list-box .el-table {
    min-height: 200px;
}

.article-user-name {
    margin-left: 10px;
    font-weight: 600;
    color: #222222;
}

.article-user-avatar {
    display: block;
}

.article-user-avatar img {
    vertical-align: middle;
}

.article-user-avatar span {
    display: block;
    line-height: 40px;
    float: left;
}
</style>