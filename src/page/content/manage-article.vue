<template>
    <div class="article-list-box">
        <div class="article-action-bar">
            <!--文章发表、搜索-->
            <el-form :inline="true" size="medium">
                <el-form-item>
                    <el-input v-model="search.keyword" placeholder="请输入标题关键字"></el-input>
                </el-form-item>
                <el-form-item label="活动区域">
                    <el-select v-model="search.state" placeholder="请输入状态">
                        <el-option label="已删除" value="0"></el-option>
                        <el-option label="已发布" value="1"></el-option>
                        <el-option label="草稿" value="2"></el-option>
                        <el-option label="置顶" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="search.categoryId" placeholder="请选择分类">
                        <el-option
                                v-for="item in categories"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="doArticleSearch">查询</el-button>
                    <el-button type="danger" @click="cleanSearch">清除</el-button>
                </el-form-item>
            </el-form>
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
                            <el-tag type="danger" size="medium">已删除</el-tag>
                        </div>
                        <div v-if="scope.row.state === '1'">
                            <el-tag type="success" size="medium">已发布</el-tag>
                        </div>
                        <div v-if="scope.row.state === '2'">
                            <el-tag type="warning" size="medium">草 稿</el-tag>
                        </div>
                        <div v-if="scope.row.state === '3'">
                            <el-tag type="success" size="medium">置 顶</el-tag>
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
			search: {
				keyword: '',
				state: '',
				categoryId: ''
			},
			categories: []
		}
	},
	methods: {
		listCategories() {
			api.listCategories().then(result => {
				if (result.code === api.success_code) {
					this.categories = result.data;
				}
			});
		},
		cleanSearch() {
			this.search.categoryId = '';
			this.search.state = '';
			this.search.keyword = '';
			this.listCategories();
		},
		doArticleSearch() {
			this.listCategories();
		},
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		listArticles() {
			api.listArticle(1, 10, this.search.state, this.search.keyword,
				this.search.categoryId).then(result => {
				if (result.code === api.success_code) {
					this.articles = result.data.contents;
				}
			});
		},
	},
	mounted() {
		this.listArticles();
		this.listCategories();
	}
}
</script>

<style>
</style>