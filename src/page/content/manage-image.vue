<template>
    <div class="image-manage-box">
        <!--列表-->
        <div class="image-list-box margin-bottom-20">
            <el-table
                    v-loading="loading"
                    :data="images"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="ID">
                </el-table-column>
                <el-table-column
                        prop="contentType"
                        label="格式">
                </el-table-column>
                <el-table-column
                        width="200"
                        label="图片">
                    <template slot-scope="scope">
                        <el-image fit="cover" class="image-manage-item"
                                  :src="blog_constant.imageBaseUrl+scope.row.url"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        label="来源"
                        width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.original === 'loop'">
                            <el-tag type="success" size="medium">轮播图</el-tag>
                        </div>
                        <div v-if="scope.row.original === 'article'">
                            <el-tag type="primary" size="medium">文章</el-tag>
                        </div>
                        <div v-if="scope.row.original === 'link'">
                            <el-tag type="info" size="medium">链接</el-tag>
                        </div>
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
            <div class="image-dialog-part">
                <el-dialog
                        :close-on-press-escape="false"
                        :close-on-click-modal="false"
                        title="删除提示"
                        :visible.sync="deleteDialogShow"
                        width="500px">
                    <span>你确定要删除: {{ deleteMessage }} 这个图片吗？</span>
                    <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="primary" @click="deleteDialogShow=false">取消</el-button>
                    <el-button size="medium" type="danger" @click="doDeleteItem">删除</el-button>
				</span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import * as dateUtils from "@/utils/date";
import * as api from "@/api/api";

export default {
	data() {
		return {
			deleteMessage: '',
			deleteDialogShow: false,
			loading: false,
			images: [],
			pageNavigation: {
				currentPage: 1,
				totalCount: 0,
				pageSize: 10,
			},
			targetDeleteImageId: '',
		};
	},
	methods: {
		doDeleteItem() {
			api.deleteImageById(this.targetDeleteImageId).then(result => {
				if (result.code === api.success_code) {
					// 删除图片
					this.deleteDialogShow = false;
					this.$message.success(result.message);
					this.listImages();
				} else {
					this.$message.error(result.message);
				}
			})
		},
		onPageChange(page) {
			this.pageNavigation.currentPage = page;
			this.listImages();
		},
		listImages() {
			this.loading = true;
			api.listImages(this.pageNavigation.currentPage, this.pageNavigation.pageSize, '').then(result => {
				if (result.code === api.success_code) {
					this.images = result.data.content;
					this.pageNavigation.currentPage = result.data.number + 1;
					this.pageNavigation.totalCount = result.data.totalElements;
					this.pageNavigation.pageSize = result.data.size;
				}
				this.loading = false;
			});
		},
		deleteItem(item) {
			this.targetDeleteImageId = item.id;
			this.deleteMessage = item.id;
			this.deleteDialogShow = true;
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
.image-manage-box {
    padding: 10px;
}

.image-manage-item img {
    width: 120px;
    height: 80px;
}
</style>