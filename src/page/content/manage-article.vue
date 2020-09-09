<template>
    <div class="article-list-box">
        <div class="article-action-bar">

        </div>

        <div class="article-list-part">
            <el-table
                    v-loading="loading"
                    :data="articles"
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="标题"
                        width="300">
                </el-table-column>
                <el-table-column
                        prop="viewCount"
                        label="浏览量"
                        width="100">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === '0'">
                            <el-tag type="danger">已删除</el-tag>
                        </div>
                        <div v-if="scope.row.state === '1'">
                            <el-tag type="success">正 常</el-tag>
                        </div>
                        <div v-if="scope.row.state === '2'">
                            <el-tag type="warning">草 稿</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="summary"
                        label="摘要">
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
        <div class="article-page-navigation">

        </div>
        <div class="article-dialog-part">

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
			articles: [],

		}
	},
	methods: {
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		listArticle() {
			api.listArticle(1,10,'','','').then(result => {
				if (result.code === api.success_code) {
					this.articles = result.data.contents;
				}
			});
		},
	},
	mounted() {
		this.listArticle();
	}
}
</script>

<style>
</style>