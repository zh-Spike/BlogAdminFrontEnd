<template>
	<div class="category-box">
		<div class="category-action-bar">
			<el-button type="primary" size="mini">添加分类</el-button>
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
						<el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import {listCategories} from "@/api/api";
import * as dateUtils from "@/utils/date";

export default {
	data() {
		return {
			categories: []
		}
	},
	methods: {
		edit(item) {
			console.log(item);
		},
		deleteItem(item) {
			console.log(item);
		},
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		}
	},
	mounted() {
		// 去获取分类
		listCategories().then(result => {
			//	console.log(result);
			if (result.code === 10000) {
				this.categories = result.data;
			}
		})
	}
}
</script>

<style>
</style>