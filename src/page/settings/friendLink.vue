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
                        <el-image fit="cover" :src="blog_constant.imageBaseUrl+scope.row.logo"
                                  class="friend-link-image"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="order"
                        label="顺序"
                        width="50">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100">
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
                                <el-image v-else :src="blog_constant.imageBaseUrl+link.logo"></el-image>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                     <el-button @click="editorClose" type="danger" size="medium">取 消</el-button>
                     <el-button type="primary" @click="handleFriendLinkEditorCommit"
                                size="medium">{{ friendLinkEditorDialogCommitText }}</el-button>
				</span>
            </el-dialog>
            <el-dialog
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    title="删除提示"
                    :show-close="false"
                    :visible.sync="deleteDialogShow"
                    width="400px">
                <span>你确定要删除: {{ deleteMessage }} 这个友情链接吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" type="primary" @click="deleteDialogShow= false">取 消</el-button>
					<el-button size="medium" type="danger" @click="doDeleteItem">确 定</el-button>
                </span>
            </el-dialog>
            <avatar-upload field="file"
                           @crop-upload-success="cropUploadSuccess"
                           @crop-upload-fail="cropUploadFail"
                           v-model="showLinkLogoCutter"
                           :width="200"
                           :height="74"
                           url="/admin/image/link"
                           img-format="png">
            </avatar-upload>
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
			deleteMessage: '',
			deleteDialogShow: false,
			showLinkLogoCutter: false,
			friendLinkEditorDialogCommitText: '添 加',
			friendLinkDialogShow: false,
			friendEditorTitle: '添加友情链接',
			loading: false,
			links: [],
			link: {
				id: '',
				name: '',
				logo: '',
				order: 0,
				state: '1',
				url: ''
			},
			targetDeleteLinkId: ''
		}
	},
	methods: {
		edit(item) {
			this.friendLinkEditorDialogCommitText = '更 新';
			this.friendEditorTitle = '更新友情链接';
			// 回显数据
			this.link.id = item.id;
			this.link.name = item.name;
			this.link.logo = item.logo;
			this.link.order = item.order;
			this.link.state = item.state;
			this.link.url = item.url;
			// 弹窗
			this.friendLinkDialogShow = true;
		},
		showLinkLogoDialog() {
			this.showLinkLogoCutter = true;
		},
		cropUploadSuccess(response) {
			if (response.code === api.success_code) {
				// 上传成功
				this.$message.success(response.message);
				this.link.logo = response.data.id;
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
			this.friendLinkEditorDialogCommitText = '添 加';
			this.friendEditorTitle = '添加友情链接';
		},
		editorClose() {
			this.friendLinkDialogShow = false;
		},
		handleFriendLinkEditorCommit() {
			// 添加
			// 检查内容
			if (this.link.name === '') {
				this.$message.error("链接名称不能为空");
				return;
			}
			if (this.link.url === '') {
				this.$message.error("跳转链接不能为空");
				return;
			}
			if (this.link.logo === '') {
				this.$message.error("Logo不能为空");
				return;
			}
			// 判断是更新还是添加
			// 如果有ID就更新 不然是添加
			if (this.link.id !== '') {
				// 更新
				// 提交数据
				api.updateFriendLink(this.link, this.link.id).then(result => {
					if (result.code === api.success_code) {
						this.friendLinkDialogShow = false;
						this.$message.success(result.message);
						this.listLinks();
						// 重置内容
						this.resetLink();
					} else {
						this.$message.error(result.message);
					}
				});

			} else {
				// 提交数据
				api.postFriendLink(this.link).then(result => {
					if (result.code === api.success_code) {
						this.friendLinkDialogShow = false;
						this.$message.success(result.message);
						this.listLinks();
						// 重置内容
						this.resetLink();
					} else {
						this.$message.error(result.message);
					}
				});
			}
		},
		resetLink() {
			this.link.name = '';
			this.link.logo = '';
			this.link.order = 0;
			this.link.state = '1';
			this.link.url = '';
		},
		deleteItem(item) {
			this.targetDeleteLinkId = item.id;
			this.deleteMessage = item.name;
			this.deleteDialogShow = true;
		},
		doDeleteItem() {
			api.deleteFriendLink(this.targetDeleteLinkId).then(result => {
				if (result.code === api.success_code) {
					this.$message.success(result.message);
					this.listLinks();
					this.deleteDialogShow = false;
					this.targetDeleteLinkId = '';
				} else {
					this.$message.error(result.message);
				}
			})
		},
	},
	mounted() {
		this.listLinks();
	}
}

</script>

<style>
.settings-friend-link-box {
    padding: 20px;
}

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