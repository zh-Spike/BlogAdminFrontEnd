<template>
    <div class="head-part clearfix">
        <div class="header-left-box float-left">
            <div class="head-logo">博客系统管理中心</div>
        </div>
        <div class="header-right-box float-right">
            <div class="header-user-info clearfix">
                <div class="header-user-avatar float-left">
                    <img style="object-fit: cover"
                         :src="avatar">
                </div>
                <div class="header-user-name float-left">
                    <el-dropdown @command="handlerCommand">
                        <span class="el-dropdown-link">
                            {{ userName }} <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-user" command="userInfo">用户信息</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-orange" command="logout">退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as api from '@/api/api'

export default {
	data() {
		return {
			userName: '',
			avatar: ''
		}
	},
	methods: {
		handlerCommand(command) {
			if (command === 'userInfo') {
				this.$router.push({
					path: '/settings/info'
				})
			} else if (command === 'logout') {
				api.doLogout().then(result => {
					if (result.code === api.success_code) {
						// 返回到登录页面
						this.$router.push({
							path: '/login'
						})
					} else {
						this.$message.error(result.message);
					}
				});
			}
		},
	},
	mounted() {
		this.userName = window.localStorage.getItem('userName');
		this.avatar = window.localStorage.getItem('avatar');
	}
}
</script>

<style>

.header-user-info {
    margin-right: 40px;
}

.header-user-name .el-dropdown-link {
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    color: #fff;
    margin-left: 10px;
}

.header-user-avatar img {
    height: 36px;
    width: 36px;
    border-radius: 50%;
    vertical-align: middle;
}

.head-logo {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
}
</style>