<template>
    <div>
        <!--显示内容-->
        <div class="article-post-box">
            <!--内容-->
            <div class="article-title-part margin-bottom-20">
                <el-input v-model="article.title" placeholder="文章标题(8~64字符)"
                          maxlength="64"
                          minlength="8"
                          show-word-limit></el-input>
            </div>
            <!--内容编辑-->
            <div class="article-post-part margin-bottom-20">
                <mavon-editor
                        v-model="article.content"
                        @htmlCode="htmlCode"
                        @change="onContentChange"/>
            </div>
            <!--文章设置:
			分类、封面、标签
			-->
            <div class="article-post-settings-part">
                <el-form label-width="100px">
                    <el-form-item label="文章分类" required>
                        <el-select v-model="article.categoryId" placeholder="请选择分类" size="medium">
                            <el-option
                                    v-for="item in categories"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="摘要" required>
                        <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="文章摘要"
                                v-model="article.summary">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="封面" required>
                        <div class="article-cover-selector" @click="showImageSelector">
                            <i class="el-icon-plus" v-if="article.cover===''"></i>
                            <el-image v-else :src="article.cover"></el-image>
                        </div>
                    </el-form-item>
                    <el-form-item label="标签" class="label-input-box" required>
                        <el-tag
                                :key="tag"
                                v-for="tag in labels"
                                closable
                                :disable-transitions="false"
                                @close="deleteLabel(tag)">
                            {{ tag }}
                        </el-tag>
                        <el-input
                                class="input-new-label"
                                v-if="labelInputVisible"
                                v-model="labelNewValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleLabelInputConfirm">
                        </el-input>
                        <el-button v-if="!labelInputVisible && !isEnough" class="button-new-tag" size="small"
                                   @click="showLabelInput"> + 添加标签
                        </el-button>

                    </el-form-item>

                </el-form>
            </div>
            <!--发布/草稿/预览按钮-->
            <div class="article-post-action-bar clear-fix">
                <div class="action-btn-container">
                    <el-button size="medium" plain>全屏预览</el-button>
                    <el-button size="medium" plain>保存草稿</el-button>
                    <el-button size="medium" type="primary">发表文章</el-button>
                </div>
            </div>
        </div>
        <div class="article-post-dialog-box">
            <el-dialog
                    title="图片选择"
                    :visible.sync="isImageSelectorShow"
                    width="500">
                <div class="image-selector-box">
                    <div class="image-action-bar">
                        <el-upload
                                class="image-selector-uploader"
                                action="/admin/image/article"
                                :show-file-list="false"
                                :on-success="uploadSuccess"
                                :on-error="onUploadError"
                                accept="image/*">
                            <el-button size="medium">上传图片</el-button>
                        </el-upload>
                    </div>
                    <div class="image-selector-list clear-fix">
                        <el-radio-group v-model="selectedImageUrl">
                            <el-radio-button v-for="(item,index) in images" :key="index" :label="item.url">
                                <el-image fit="cover"
                                          :src="blog_constant.baseUrl+'/portal/image/'+item.url">
                                </el-image>
                            </el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="image-picker-navigation">
                    <el-pagination
                            class="user-list-page-navigation-bar"
                            background
                            @current-change="onPageChange"
                            :current-page="pageNavigation.currentPage"
                            :page-size="pageNavigation.pageSize"
                            layout="prev, pager, next"
                            :total="pageNavigation.totalCount">
                    </el-pagination>
                </div>
                <span slot="footer" class="dialog-footer">
                        <el-button @click="isImageSelectorShow = false" size="medium">取 消</el-button>
                        <el-button type="primary" @click="onImageSelected" size="medium">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/api';

export default {
	data() {
		return {
			pageNavigation: {
				currentPage: 1,
				totalCount: 0,
				pageSize: 15,
			},
			selectedImageUrl: '',
			isImageSelectorShow: false,
			isEnough: false,
			labelNewValue: '',
			labelInputVisible: false,
			labels: ['java', 'vue.js'],
			categories: [],
			article: {
				title: '',
				content: '',
				categoryId: '',
				summary: '',
				cover: '',
			},
			images: [],
		}
	},
	methods: {
		onPageChange(page) {
			this.pageNavigation.currentPage = page;
			this.listImages();
		},
		onUploadError() {
			this.$message.error("图片上传失败");
		},
		uploadSuccess(response) {
			if (response.code === api.success_code) {
				this.$message.success(response.message);
				// 更新列表
				this.listImages();
			}
		},
		onImageSelected() {
			this.isImageSelectorShow = false;
			console.log(this.selectedImageUrl);
		},
		showImageSelector() {
			this.isImageSelectorShow = true;
		},
		htmlCode(status, value) {
			console.log(status);
			console.log(value);
		},
		onContentChange(value, render) {
			console.log(value);
			console.log(render);
		},
		showLabelInput() {
			// 判断个数 限制5个
			// 控制输入框的显示
			if (this.labels.length < 5) {
				this.labelInputVisible = true;
			} else {
				this.labelInputVisible = false;
			}
		},
		handleLabelInputConfirm() {
			// 时机: 回车
			if (this.labels.length < 5) {
				this.labels.push(this.labelNewValue);
				this.labelNewValue = '';
			}
			// 如果加完后5个后 隐藏输入框
			if (this.labels.length >= 5) {
				this.labelInputVisible = false;
				this.isEnough = true;
			}
		},
		deleteLabel(label) {
			// 从数组里删除
			this.labels.splice(this.labels.indexOf(label), 1);
			if (this.labels.length < 5) {
				this.isEnough = false;
				this.labelInputVisible = true;
			}
		},
		listCategories() {
			api.listCategories().then(result => {
				if (result.code === api.success_code) {
					this.categories = result.data;
				}
			});
		},
		listImages() {
			api.listImages(this.pageNavigation.currentPage, this.pageNavigation.pageSize, 'article').then(result => {
				if (result.code === api.success_code) {
					this.images = result.data.content;
					this.pageNavigation.currentPage = result.data.number + 1;
					this.pageNavigation.totalCount = result.data.totalElements;
					this.pageNavigation.pageSize = result.data.size;
				} else {
					this.$message.error(result.message());
				}
			});
		},
	},
	mounted() {
		// 获取文章分类
		this.listCategories();
		this.listImages();
	}


}
</script>

<style>
.image-picker-navigation {
    margin-top: 20px;
}

.image-action-bar {
    padding-left: 5px;
    margin-bottom: 20px;
}

.image-selector-list img {
    width: 179px;
    height: 179px;
    float: left;
}

.article-post-dialog-box .el-dialog__header {
    display: none;
}

.input-new-label {
    width: 120px;
}

.article-title-part input {
    border: none;
    padding-left: 20px;
    font-size: 20px;
}

.label-input-box .el-tag {
    margin-right: 20px;
}

.article-cover-selector i {
    line-height: 140px;
    color: #E5E5E5;
    font-size: 20px;
}

.article-cover-selector {
    width: 200px;
    height: 140px;
    cursor: pointer;
    border-radius: 4px;
    text-align: center;
    border: #E5E5E5 dashed 1px;
}

.article-post-settings-part .el-textarea {
    width: 400px;
}

.article-post-part .markdown-body {
    height: 800px;
    box-shadow: none !important;
}

.article-post-part {

}

.article-post-settings-part {
    margin-bottom: 120px;
}

.action-btn-container {
    float: right;
    margin-right: 50px;
    padding: 10px;
}

.article-post-action-bar {
    background: #ffffff;
    border-top: #E5E5E5 solid 1px;
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-left: -220px;
}

.article-post-part .v-note-op {
    position: sticky;
    top: 0;
}

.image-selector-list .el-radio-button__inner,
.el-radio-button:first-child .el-radio-button__inner,
.el-radio-button:last-child .el-radio-button__inner {
    border: none;
    padding: 3px;
    border-radius: 4px;
}
</style>