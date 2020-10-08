<template>
    <div class="lab-box">
        <div class="lab-action-bar margin-bottom-10">
            <el-button type="primary" size="medium" @click="showAddLab">添加实验室</el-button>
        </div>
        <div class="lab-list-box">
            <el-table
                    v-loading="loading"
                    :data="labs"
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
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="labNumber"
                        label="实验室容量"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="labAvailable"
                        label="可用容量"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === '0'">
                            <el-tag type="danger">不可用</el-tag>
                        </div>
                        <div v-if="scope.row.state === '1'">
                            <el-tag type="success">正 常</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建日期"
                        width="200">
                    <template slot-scope="scope">
						<span v-text="formatDate(scope.row.createTime)">
						</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="更新日期"
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
                        <el-button type="primary" size="medium" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" v-if="scope.row.state !== '0'" size="medium"
                                   @click="deleteItem(scope.row)">删除
                        </el-button>
                        <el-button type="danger" v-if="scope.row.state === '0'" size="medium"
                                   @click="deleteItem(scope.row)" disabled>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="lab-dialog-box">
            <el-dialog
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :show-close="false"
                    title="删除提示"
                    :visible.sync="deleteDialogShow"
                    width="400px">
                <span>你确定要删除: {{ deleteMessage }} 这个实验室吗？</span>
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
                <div class="lab-editor-box">
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
			editorCommitText: '添加信息',
			editorDialogShow: false,
			editTitle: '添加实验室',
			labs: [],
			deleteDialogShow: false,
			deleteMessage: '',
			deleteTargetId: '',
			lab: {
				id: '',
				labName: '',
				labNumber: '',
				state: '1'
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
		deleteItem(item) {
			// 不是马上删除 弹出确认方框
			this.deleteDialogShow = true;
			this.deleteMessage = item.labName;
			this.deleteTargetId = item.id;
			// console.log(item);
		},
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		doDeleteItem() {
			api.deleteLab(this.deleteTargetId).then(result => {
				if (result.code === api.success_code) {
					this.$message({
						type: 'success',
						center: true,
						message: result.message
					});
					this.listLabs();
				}
			});
			this.deleteDialogShow = false;
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
		showAddLab() {
			this.lab.id = '';
			this.lab.labName = '';
			this.lab.labNumber = '';
			this.lab.state = '1';
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
		// 去获取分类
		this.editTitle = '添加实验室';
		this.editorCommitText = '添 加'
		this.listLabs();
	}
}
</script>

<style>
.lab-box {
    padding: 20px;
}

.lab-list-box {
    padding: 10px;
}

.lab-list-box .el-table {
    min-height: 200px;
}
</style>