<template>
	<div class="category-box">
		<div class="category-action-box">
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
					width="150">
				</el-table-column>
				<el-table-column
					prop="name"
					label="分类名称"
					width="120">
				</el-table-column>
				<el-table-column
					prop="pinyin"
					label="拼音"
					width="120">
				</el-table-column>
				<el-table-column
					prop="description"
					label="描述">
				</el-table-column>
				<el-table-column
					fixed="right"
					label="操作"
					width="100">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
						<el-button type="major" size="mini" @click="delete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="navigation-bar">

		</div>
	</div>
</template>

<script>
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
		delete(item) {
			console.log(item);
		},
		mount(){

		}

	}
}
</script>

<style scoped>
</style>