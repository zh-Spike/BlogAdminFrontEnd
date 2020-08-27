<template>
	<div class="category-box">
		<div class="category-action-bar">
			<el-button type="primary" size="mini" @click="showAddCategory">添加分类</el-button>
		</div>
		<div class="category-list-box">
			<el-table
				:data="categories"
				style="width: 100%">
				<el-table-column
					fixed
					prop="id"
					label="ID"
					width="200">
				</el-table-column>
				<el-table-column
					prop="name"
					label="分类名称"
					width="120">
				</el-table-column>
				<el-table-column
					label="状态"
					width="200">
					<template slot-scope="scope">
						<div v-if="scope.row.status === '0'">
							<el-tag type="danger">已删除</el-tag>
						</div>
						<div v-if="scope.row.status === '1'">
							<el-tag type="success">正常</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="pinyin"
					label="拼音"
					width="200">
				</el-table-column>
				<el-table-column
					prop="description"
					label="描述">
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
						<el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
						<el-button type="danger" v-if="scope.row.status !== '0'" size="mini" @click="deleteItem(scope.row)">删除</el-button>
						<el-button type="danger" v-if="scope.row.status === '0'" size="mini" @click="deleteItem(scope.row)" disabled>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="category-dialog-box">
			<el-dialog
				title="删除提示"
				:visible.sync="deleteDialogShow"
				width="400px">
				<span>你确定要删除: {{ deleteMessage }} 这个分类吗？</span>
				<span slot="footer" class="dialog-footer">
                    <el-button size="mini" type="primary" @click="deleteDialogShow= false">取 消</el-button>
					<el-button size="mini" type="danger" @click="doDeleteItem">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog
				:title="editTitle"
				:visible.sync="editorDialogShow"
				width="400px">
				<div>这是一段信息</div>
				<span slot="footer" class="dialog-footer">
                    <el-button size="mini" type="danger" @click="editorDialogShow">取 消</el-button>
					<el-button size="mini" type="primary" @click="editorDialogShow">{{editorCommitText}}</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import * as api from "@/api/api";
import * as dateUtils from "@/utils/date";

export default {
	data() {
		return {
			editorCommitText: '修改分类',
			editorDialogShow: false,
			editTitle: '编辑分类',
			categories: [],
			deleteDialogShow: false,
			deleteMessage: '',
			deleteTargetId: ''
		}
	},
	methods: {
		edit(item) {
			console.log(item);
		},
		deleteItem(item) {
			// 不是马上删除 弹出确认方框
			this.deleteDialogShow = true;
			this.deleteMessage = item.name;
			this.deleteTargetId = item.id;
			// console.log(item);
		},
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		doDeleteItem() {
			api.deleteCategoryById(this.deleteTargetId).then(result => {
				if (result.code === 10000) {
					this.$message({
						type: 'success',
						center: true,
						message: result.message
					});
					this.listCategories();
				}
			});
			this.deleteDialogShow = false;
		},
		listCategories() {
			api.listCategories().then(result => {
				//	console.log(result);
				if (result.code === 10000) {
					this.categories = result.data;
				}
			});
		},
		showAddCategory() {
			this.editorDialogShow = true;
		}
	},
	mounted() {
		// 去获取分类
		this.listCategories();
	}
}
</script>

<style>
</style>