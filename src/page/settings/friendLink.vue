<template>
    <div class="settings-friend-link-box">
        <div class="friend-link-action-bar margin-bottom-10">
            <el-button type="primary" size="medium" @click="showFriendLinkDialog">添加友情链接</el-button>
        </div>
        <div class="friend-link-list-box">
            <el-table
                    v-loading="loading"
                    :data="links"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        label="友站名称">
                    <template slot-scope="scope">
                        <a class="friend-link-title" :herf="scope.row.url" target="_blank">{{ scope.row.name }}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        width="200"
                        label="logo">
                    <template slot-scope="scope">
                        <el-image fit="cover" :src="scope.row.logo" class="friend-link-image"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="order"
                        label="顺序"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="200">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === '0'">
                            <el-tag type="danger">不可用</el-tag>
                        </div>
                        <div v-if="scope.row.state === '1'">
                            <el-tag type="success">正常</el-tag>
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
                        width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="medium" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger" size="medium" @click="deleteItem(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="friend-link-dialog-box">
            <el-dialog
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :title="friendEditorTitle"
                    :visible.sync="friendLinkDialogShow"
                    width="600px">
                <div>
                    <el-form label-width="110px" size="medium">
                        <el-form-item label="对方网站名称">
                            <el-input v-model="link.name"></el-input>
                        </el-form-item>
                        <el-form-item label="跳转链接">
                            <el-input v-model="link.url"></el-input>
                        </el-form-item>
                        <el-form-item label="顺序">
                            <el-input-number v-model="link.order" :min="1" :max="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="link.state" placeholder="选择状态">
                                <el-option label="不可用" value="0"></el-option>
                                <el-option label="正常" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="logo">
                            <div class="friend-link-image-upload" @click="showLinkLogoDialog">
                                <i class="el-icon-plus" v-if="link.logo===''"></i>
                                <el-image v-else :src="'http://localhost:8082'+link.logo"></el-image>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                     <el-button @click="editorClose" type="danger" size="medium">取 消</el-button>
                     <el-button type="primary" @click="handleLoopEditorCommit"
                                size="medium">{{ friendLinkEditorDialogCommitText }}</el-button>
                </span>
            </el-dialog>
            <avatar-upload field="file"
                           @crop-upload-success="cropUploadSuccess"
                           @crop-upload-fail="cropUploadFail"
                           v-model="showLinkLogoCutter"
                           :width="300"
                           :height="300"
                           url="/admin/image/link"
                           img-format="png"></avatar-upload>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/api';
import avatarUpload from 'vue-image-crop-upload/upload-2';
import * as dateUtils from "@/utils/date";

export default {
	components: {
		'avatar-upload': avatarUpload,
	},
	data() {
		return {
			showLinkLogoCutter: false,
			friendLinkEditorDialogCommitText: '添 加',
			friendLinkDialogShow: false,
			friendEditorTitle: '添加友情链接',
			loading: false,
			links: [],
			link: {
				name: '',
				logo: '',
				order: 0,
				state: '1',
				url: ''
			},
		}
	},
	methods: {
		showLinkLogoDialog() {
			this.showLinkLogoCutter = true;
		},
		cropUploadSuccess(response) {
			if (response.code === api.success_code) {
				// 上传成功
				this.$message.success(response.message);
				this.link.logo = '/portal/image/' + response.data.id;
			} else {
				this.$message.error(response.message);
			}
		},
		cropUploadFail() {
			this.$message.error("上传失败");
		},
		listLinks() {
			api.listFriendLinks().then(result => {
				if (result.code === api.success_code) {
					this.links = result.data;
				}

			})
		},
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		showFriendLinkDialog() {
			this.friendLinkDialogShow = true;
		},
		editorClose() {
			this.friendLinkDialogShow = false;
		},
		handleLoopEditorCommit() {
			// 添加
			// 检查内容
			if (this.link.name === '') {
				this.$message.error("链接名称不能为空");
			}
			if (this.link.url === '') {
				this.$message.error("跳转链接不能为空");
			}
			if (this.link.logo === '') {
				this.$message.error("logo不能为空");
			}
		},
		doDeleteItem() {

		},
	},
	mounted() {
		this.listLinks();
	}
}

</script>

<style>
.friend-link-image img {
    width: 100px;
    height: 37px;
    border: #dfdfdf solid 1px;
}

.friend-link-title {
    text-decoration: none;
}

.friend-link-image-upload {
    width: 100px;
    text-align: center;
    cursor: pointer;
    border: #dfdfdf dashed 1px;
    height: 37px;
}
</style>