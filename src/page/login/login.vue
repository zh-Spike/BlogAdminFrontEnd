<template>
	<!--后台登录 只有登录-->
	<!--顶部内容-->
	<div class="admin-login-box">
		<div class="admin-login-header-box">
			<div class="admin-login-header-center center">
				<div class="admin-login-logo">
					博客系统 | 登录
				</div>
			</div>
		</div>
		<!--中间内容-->
		<div class="admin-login-box">
			<div class="center login-center-box">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form label-position="right" label-width="100px">
							<el-form-item label="账号" required>
								<el-input v-model="user.userName" placeholder="用户名/邮箱"></el-input>
							</el-form-item>
							<el-form-item label="密码" required>
								<el-input v-model="user.password" placeholder="密码"></el-input>
							</el-form-item>
							<el-form-item label="验证码" required>
								<el-input v-model="loginInfo.verifyCode" placeholder="请输入右侧验证码"></el-input>
							</el-form-item>
							<el-form-item class="login-button">
								<el-button type="primary" @click="doLogin" size="small">登录</el-button>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
			</div>
		</div>
		<!--底部内容-->
	</div>
</template>

<script>
export default {
	data() {
		return {
			user: {
				userName: '',
				password: '',
			},
			loginInfo: {
				verifyCode: '',
				captcha_key: '',
				from: '',
			}
		}
	},
	methods: {
		doLogin() {

		}
	}
}
</script>

<style scoped>
.admin-login-header-box {
	width: 100%;
	height: 46px;
	margin-bottom: 20px;
	background: dodgerblue;
}

.center {
	margin: 0 auto;
	width: 1140px;
}

.admin-login-header-center {
	line-height: 46px;
}

.login-center-box {
	border-radius: 4px;
	width: 1100px;
	padding: 20px;
	background: #ffffff;
	box-shadow: 0 1px 10px #afafaf;
}

.admin-login-logo {
	color: #ffffff;
	font-size: 18px;
	font-size: 600;
}

.login-center-box el-input__inner {
	border-radius: 0;
	border-bottom: #e6e6e6 solid 1px;
	height: 42px;
}

.login-center-box el-form-item__label {
	background: #FBFBFB;
	border-left: #e6e6e6 solid 1px;
	border-top: #e6e6e6 solid 1px;
	border-bottom: #e6e6e6 solid 1px;
	text-align: center;
}

.login-button {
	margin-bottom: 0;
}

</style>