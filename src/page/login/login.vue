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
                    <el-col :span="12">
                        <el-form label-position="right" label-width="100px">
                            <el-form-item label="账号" required>
                                <el-input v-model="user.userName" placeholder="用户名/邮箱"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" required>
                                <el-input type="password" v-model="user.password" placeholder="密码"></el-input>
                            </el-form-item>
                            <el-form-item label="验证码" required>
                                <el-input v-model="loginInfo.verifyCode" placeholder="请输入右侧验证码"
                                          @keyup.enter.native="doLogin"></el-input>
                                <img :src="captchaPath" @click="updateVerifyCode" class="captcha-code">
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
import * as api from "@/api/api";

export default {
	data() {
		return {
			user: {
				userName: '',
				password: ''
			},
			loginInfo: {
				verifyCode: '',
				captcha_key: ''
			},
			captchaPath: ''
		}
	},
	methods: {
		toastE(msg) {
			this.$message({
				message: msg,
				center: true,
				type: 'error'
			});
		},
		doLogin() {
			// 发起登录
			// 检查数据
			if (this.user.userName === '') {
				this.toastE('账号不能为空');
				return;
			}
			if (this.user.userName === '') {
				this.toastE('账号不能为空');
				return
			}
			if (this.loginInfo.verifyCode === '') {
				this.toastE('验证码不能为空');
				return;
			}
			// 向服务器提交数据
			api.doLogin(this.loginInfo.verifyCode, this.loginInfo.captcha_key, this.user).then(result => {
				// 处理登陆结果
				// 判断状态
				if (result.code === api.success_code) {
					this.$message({
						message: result.message,
						center: true,
						type: 'success'
					})
					// 成功 跳转 普通用户条到首页 管理员到管理中心
					// TODO:
					this.$router.push({path: '/index'});
				} else {
					// 其他则给出提示
					// 更新验证码
					this.toastE(result.message);
					this.updateVerifyCode();
				}
			});
		},
		updateVerifyCode() {
			this.captchaPath = '/user/captcha?captcha_key=' + this.loginInfo.captcha_key + "&random" + Date.parse(new Date());
			console.log(this.captchaPath);
		}
	},
	mounted() {
		// TODO: 检查登录是否有效
		this.loginInfo.captcha_key = Date.parse(new Date());
		this.updateVerifyCode();
	}
}
</script>

<style>
.captcha-code {
    cursor: pointer;
    width: 120px;
    height: 42px;
    padding-left: 10px;
    padding-right: 10px;
    vertical-align: middle;
    margin-left: 10px;
    border: #e6e6e6 solid 1px;
}

.login-button {
    margin-bottom: 0;
}

.admin-login-header-box {
    width: 200%;
    height: 46px;
    margin-bottom: 20px;
    background: dodgerblue;
}

.center {
    margin: 0 auto;
    width: 1140px;
}

.login-center-box .el-input {
    width: 200px;
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
    font-weight: 600;
}

.login-center-box .el-input__inner {
    border-radius: 0;
    border-bottom: #e6e6e6 solid 1px;
    height: 42px;
}

.login-center-box .el-form-item__label {
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