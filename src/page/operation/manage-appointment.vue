<template>
    <div class="appointment-box">
        <div class="appointment-action-bar">
            <!--文章发表、搜索-->
            <el-form :inline="true" size="medium">
                <el-form-item>
                    <el-input v-model="search.userId" placeholder="请输入用户ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="search.state" placeholder="请选择状态">
                        <el-option label="驳回" value="0"></el-option>
                        <el-option label="审核中" value="1"></el-option>
                        <el-option label="通过" value="2"></el-option>
                        <el-option label="所有状态" value=""></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="doSearch">查询</el-button>
                    <el-button type="danger" @click="cleanSearch">清除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="category-action-bar margin-bottom-10">
            <el-button type="primary" size="medium" @click="showAddAppointment">新建预约</el-button>
        </div>

        <div class="appointment-list-box">
            <el-table
                    v-loading="loading"
                    :data="appointments"
                    :row-class-name="tableRowClassName"
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
                        prop="userId"
                        label="用户ID"
                        width="200">
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
						<span v-text="formatDate(scope.row.startTime)">
						</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="endTime"
                        label="结束时间"
                        width="200">
                    <template slot-scope="scope">
						<span v-text="formatDate(scope.row.endTime)">
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
                    width="700px">
                <div class="appointment-editor-box">
                    <el-form label-width="100px">
                        <el-table
                                ref="singleTable"
                                :data="labs"
                                style="width: 100%;padding-bottom: 20px">
                            <el-table-column
                                    property="labName"
                                    label="实验室名称"
                                    width="150">
                            </el-table-column>
                            <el-table-column
                                    property="labAvailable"
                                    label="可用容量"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    property="state"
                                    label="可用性">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.state === '0'">
                                        <el-tag type="danger">不可用</el-tag>
                                    </div>
                                    <div v-if="scope.row.state === '1'">
                                        <el-tag type="success">正 常</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-form-item label="选择实验室">
                            <el-select v-model="appointment.labId">
                                <el-option v-for="item in labs"
                                           :key="item.id"
                                           :label="item.labName"
                                           :disabled="item.state==='0'"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预约人数">
                            <el-input v-model="appointment.appointmentNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="appointment.state">
                                <el-option label="驳回" value="0"></el-option>
                                <el-option label="审批中" value="1"></el-option>
                                <el-option label="通过" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="起始时间">
                            <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" v-model="appointment.startTime"
                                                style="width: 100%;"></el-date-picker>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-time-picker placeholder="选择时间" v-model="appointment.startTime"
                                                style="width: 100%;"></el-time-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="结束时间">
                            <el-col :span="11">
                                <el-date-picker type="date" placeholder="选择日期" v-model="appointment.endTime"
                                                style="width: 100%;"></el-date-picker>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-time-picker placeholder="选择时间" v-model="appointment.endTime"
                                                style="width: 100%;"></el-time-picker>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="danger" @click="onEditorClose">取 消</el-button>
					<el-button size="medium" type="primary" @click="postAppointment">{{ editorCommitText }}</el-button>
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
			editorCommitText: '添加',
			editorDialogShow: false,
			editTitle: '新增预约',
			appointments: [],
			labs: [],
			deleteDialogShow: false,
			deleteMessage: '',
			deleteTargetId: '',
			lab: {
				id: '',
				labName: '',
				state: ''
			},
			appointment: {
				id: '',
				labId: '',
				appointmentNumber: '',
				state: '1',
				startTime: '',
				endTime: ''
			},
			search: {
				userId: '',
				state: ''
			},
			pageNavigation: {
				currentPage: 1,
				totalCount: 0,
				pageSize: 10,
			},
			currentTime: new Date(),
		};
	},
	methods: {
		cleanSearch() {
			this.pageNavigation.currentPage = 1;
			this.pageNavigation.pageSize = 10;
			this.search.userId = '';
			this.search.state = '';
			this.listAppointments();
		},
		doSearch() {
			this.pageNavigation.currentPage = 1;
			this.pageNavigation.pageSize = 10;
			// console.log('do article search...')
			this.listAppointments();
		},
		onEditorClose() {
			this.editorDialogShow = false;
			this.resetLab();
		},
		postAppointment() {
			// 检查内容
			if (this.appointment.labId === '') {
				this.showWarning('实验室不能为空');
				return;
			}
			if (this.appointment.appointmentNumber === '') {
				this.showWarning('人数不能为空');
				return;
			}
			if (this.appointment.startTime === '') {
				this.showWarning('起始时间不能为空');
				return;
			}
			if (this.appointment.endTime === '') {
				this.showWarning('结束时间不能为空');
				return;
			}
			if (this.appointment.endTime < this.appointment.startTime) {
				this.showWarning('时间不要搞错┗|｀O′|┛ 嗷~~');
				return;
			}
			if (this.appointment.id === '') {
				// 如果没有ID的就是添加
				api.postAppointment(this.appointment).then(result => {
					this.editorDialogShow = false;
					if (result.code === api.success_code) {
						this.$message({
							message: '添加成功',
							center: true,
							type: 'success'
						});
						// 刷新列表
						this.listAppointments();
						// 重置数据
						this.resetAppointment();
					} else {
						this.showWarning(result.message);
					}
				});
			} else {
				// console.log(this.appointment);
				api.updateAppointment(this.appointment.id, this.appointment).then(result => {
					if (result.code === api.success_code) {
						this.$message.success(result.message);
						this.editorDialogShow = false;
						this.listAppointments();
						this.resetAppointment();
					} else {
						this.$message.error(result.message);
					}
				})
			}
		},
		edit(item) {
			// 赋值 先请求单个数据 再显示 数据回显
			this.appointment.id = item.id;
			// 显示dialog
			// console.log(this.currentRow);
			this.appointment.labId = item.labId;
			this.appointment.appointmentNumber = item.appointmentNumber;
			this.appointment.startTime = item.startTime;
			this.appointment.endTime = item.endTime;
			// console.log(item);
			this.editorDialogShow = true;
			this.editorCommitText = '修改信息';
			this.editTitle = '编辑预约申请';
		},
		resetAppointment() {
			this.appointment.appointmentNumber = '';
			this.appointment.state = '1';
			this.appointment.startTime = '';
			this.appointment.endTime = '';
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
		tableRowClassName({row}) {
			if (row.state === "2" && Date.parse(row.startTime)>new Date()) {
				return 'success-row';
			}
			return '';
		},
		listAppointments() {
			this.loading = true;
			api.listAppointments(this.pageNavigation.currentPage,
				this.pageNavigation.pageSize,
				this.search.state,
				this.search.userId).then(result => {
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
		listLabs() {
			this.loading = true;
			api.listLabs().then(result => {
				this.loading = false;
				//	console.log(result);
				if (result.code === api.success_code) {
					this.labs = result.data;
				}
			});
		},
		onPageChange(page) {
			this.pageNavigation.currentPage = page;
			this.listAppointments();
		},
		showAddAppointment() {
			this.appointment.id = '';
			this.appointment.labId = '';
			this.appointment.appointmentNumber = '';
			this.appointment.startTime = '';
			this.appointment.endTime = '';
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
		this.editTitle = '添加预约';
		this.editorCommitText = '添 加'
		this.listAppointments();
		this.listLabs();
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

.el-table .success-row {
    background: #f0f9eb;
}
</style>