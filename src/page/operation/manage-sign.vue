<template>
    <div class="sign-box">
        <div class="sign-list-box">
            <el-table
                    v-loading="loading"
                    :data="signs"
                    style="width: 100%">
                <el-table-column
                        fixed
                        prop="appointmentId"
                        label="预约ID"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="labName"
                        label="实验室"
                        width="150">
                </el-table-column>
                <el-table-column
                        label="用户"
                        width="200">
                    <template slot-scope="scope">
                        <a href="#" class="article-user-avatar clearfix">
                            <el-avatar :src="scope.row.userAvatar"></el-avatar>
                            <span class="article-user-name">{{ scope.row.userName }}</span>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === '0'">
                            <el-tag type="info">未激活</el-tag>
                        </div>
                        <div v-if="scope.row.state === '1'">
                            <el-tag type="primary">已签到</el-tag>
                        </div>
                        <div v-if="scope.row.state === '2'">
                            <el-tag type="danger">签退</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="number"
                        label="预约人数">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="更新日期"
                        width="200">
                    <template slot-scope="scope">
						<span v-text="formatDate(scope.row.createTime)">
						</span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.state === '0'" size="medium"
                                   @click="updateSign(scope.row)">
                            签到
                        </el-button>
                        <el-button type="primary" v-if="scope.row.state !== '0'" size="medium"
                                   @click="updateSign(scope.row)"
                                   disabled>签到
                        </el-button>
                        <el-button type="danger" v-if="scope.row.state === '1'" size="medium"
                                   @click="updateSign(scope.row)">签退
                        </el-button>
                        <el-button type="danger" v-if="scope.row.state !== '1'" size="medium"
                                   @click="updateSign(scope.row)" disabled>签退
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

import * as api from "@/api/api";
import * as dateUtils from "@/utils/date";

export default {
	data() {
		return {
			loading: false,
			signs: []
		};
	},
	methods: {
		formatDate(dateStr) {
			let date = new Date(dateStr);
			return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
		},
		updateSign(item) {
			api.updateSign(item.id).then(result => {
				if (result.code === api.success_code) {
					// 处理结果
					this.listSigns();
					this.$message.success(result.message);
				} else {
					this.$message.error(result.message);
				}
			});
		},
		listSigns() {
			this.loading = true;
			api.listSigns().then(result => {
				this.loading = false;
				console.log(result);
				if (result.code === api.success_code) {
					this.signs = result.data;
				}
			});
		},
	},
	mounted() {
		this.listSigns();
	}
}
</script>

<style>
.sign-box {
    padding: 20px;
}

.sign-list-box {
    padding: 10px;
}

.article-user-name {
    margin-left: 10px;
    font-weight: 600;
    color: #222222;
}

.article-user-avatar {
    display: block;
}

.article-user-avatar img {
    vertical-align: middle;
}

.article-user-avatar span {
    display: block;
    line-height: 40px;
    float: left;
}
.sign-list-box .el-table {
    min-height: 200px;
}
</style>