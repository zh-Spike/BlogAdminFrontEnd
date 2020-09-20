<template>
    <div>
        <!--列表-->
        <div class="image-list-box margin-bottom-20">
            <el-table
                    v-loading="loading"
                    :data="images"
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        label="图片">
                    <template slot-scope="scope">
                        <el-image fit="cover" class="image-manage-item"
                                  :src="blog_content.imageBaseUrl+scope.row.url"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === '0'">
                            <el-tag type="danger" size="medium">删除</el-tag>
                        </div>
                        <div v-if="scope.row.state === '1'">
                            <el-tag type="primary" size="medium">正常</el-tag>
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
                        width="250">
                    <template slot-scope="scope">
                        <el-button type="danger" v-if="scope.row.state !== '0'" size="mini"
                                   @click="deleteItem(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页-->
        <div class="image-list-page-navigation margin-bottom-20">
            <el-pagination
                    class="comment-list-page-navigation-bar"
                    background
                    @current-change="onPageChange"
                    :current-page="pageNavigation.currentPage"
                    :page-size="pageNavigation.pageSize"
                    layout="prev, pager, next"
                    :total="pageNavigation.totalCount">
            </el-pagination>
        </div>
        <!--dialog-->
        <div class="image-list-image-dialog">
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
			images: [],
			pageNavigation: {
				currentPage: 1,
				totalCount: 0,
				pageSize: 10,
			},
		};
	},
	methods: {
		onPageChange(page) {
			this.pageNavigation.currentPage = page;
			this.listImages();
		},
		listImages() {
			api.listImages(this.pageNavigation.currentPage, this.pageNavigation.pageSize, '').then(result => {
				if (result.code === api.success_code) {
					this.images = result.data.content;
					this.pageNavigation.currentPage = result.data.number + 1;
					this.pageNavigation.totalCount = result.data.totalElements;
					this.pageNavigation.pageSize = result.data.size;
				}
			});
		},
		deleteItem() {

		},
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
	},
	mounted() {
		this.listImages();
	}
}
</script>

<style>
.image-manage-item img {
    width: 120px;
    height: 80px;
}
</style>