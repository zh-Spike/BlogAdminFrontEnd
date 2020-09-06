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
                <mavon-editor v-model="article.content"/>
            </div>
            <!--文章设置:
			分类、封面、标签
			-->
            <div class="article-post-settings-part">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
                        <div class="article-cover-selector">
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
                        <el-button v-else class="button-new-tag" size="small" @click="showLabelInput">+ 添加标签</el-button>

                    </el-form-item>

                </el-form>
            </div>
            <!--发布/草稿/预览按钮-->
            <div class="article-post-action-bar clear-fix">
                <div class="action-btn-container">
                    <el-button plain>全屏预览</el-button>
                    <el-button plain>保存草稿</el-button>
                    <el-button type="primary">发表文章</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/api';

export default {
	data() {
		return {
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
			}
		}
	},
	methods: {
		showLabelInput() {

		},
		handleLabelInputConfirm() {

		},
		deleteLabel() {

		},
		listCategories() {
			api.listCategories().then(result => {
				if (result.code === api.success_code) {
					this.categories = result.data;
				}
			});
		},
	},
	mounted() {
		// 获取文章分类
		this.listCategories();
	}


}
</script>

<style>
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
    color: #DCDFE6;
    font-size: 20px;
}

.article-cover-selector {
    width: 200px;
    height: 140px;
    cursor: pointer;
    border-radius: 4px;
    text-align: center;
    border: #DCDFE6 dashed 1px;
}

.article-post-settings-part .el-textarea {
    width: 400px;
}

.article-post-part .markdown-body {
    height: 800px;
    box-shadow: none !important;
}

.article-post-part {
    background: #99ffaa;
}

.article-post-settings-part {
}

.action-btn-container {
    float: right;
    margin-right: 50px;
    padding: 10px;
}

.article-post-action-bar {
    background: #98;
}
</style>