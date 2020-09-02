<template>
    <div class="settings-web-info-box">
        <el-form label-width="100px" size="medium">
            <el-form-item label="网站名称">
                <el-input v-model="websiteTitle"></el-input>
            </el-form-item>
            <el-form-item label="网站关键字">
                <el-input v-model="keywords" placeholder="关键字用','隔开"></el-input>
            </el-form-item>
            <el-form-item label="网站描述">
                <el-input
                        type="textarea"
                        :rows="3"
                        v-model="description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateSeoInfo">更 新</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import * as api from '@/api/api';

export default {
	data() {
		return {
			websiteTitle: '',
			keywords: '',
			description: '',
			oldInfo: {
				websiteTitle: '',
				keywords: '',
				description: '',
			},
		}
	},
	methods: {
		updateSeoInfo() {
			// 检查数据
			if (this.websiteTitle === '') {
				this.$message.error("网站标题不能为空");
				return;
			}
			if (this.keywords === '') {
				this.$message.error("关键字不能为空");
				return;
			}
			if (this.description === '') {
				this.$message.error("描述不能为空");
				return;
			}
			let isSeoInfoUpdate = false;
			if (this.description !== this.oldInfo.description || this.keywords !== this.oldInfo.keywords) {
				// seo 关键字/描述 不一致
				isSeoInfoUpdate = true;
				api.updateSeoInfo(this.keywords, this.description).then(result => {
					if (result.code === api.success_code) {
						// 更新成功
						this.$message.success(result.message);
						this.getWebSiteInfo();
					}
				});
			}
			// 如果更新seo 不更新标题
			// 提交数据
			if (this.websiteTitle !== this.oldInfo.websiteTitle) {
				// 更新标题
				api.updateWebsiteTitle(this.websiteTitle).then(result => {
					if (result.code === api.success_code) {
						if (!isSeoInfoUpdate) {
							this.$message.success("网站标题更新成功");
						}
						this.getWebSiteTitle();
					}
				});
			}
		},
		getWebSiteInfo() {
			api.getSeoInfo().then(result => {
				if (result.code === api.success_code) {
					this.keywords = result.data['website_keywords'];
					this.description = result.data['website_description'];
					this.oldInfo.keywords = this.keywords;
					this.oldInfo.description = this.description;
				}
			});
		},
		getWebSiteTitle() {
			api.getSeoTitle().then(result => {
				if (result.code === api.success_code) {
					this.websiteTitle = result.data.value;
					this.oldInfo.websiteTitle = this.websiteTitle;
				}
			});
		}
	}
	,
	mounted() {
		this.getWebSiteInfo();
		this.getWebSiteTitle();
	}
}
</script>

<style>
.settings-user-info-box .el-input, .settings-user-info-box .el-textarea {
    width: 500px;
}
</style>