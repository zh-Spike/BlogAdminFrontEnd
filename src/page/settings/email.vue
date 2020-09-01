<template>
    <div class="setting-email-box">
        <el-form label-width="100px" size="medium">
            <el-form-item
                    label="新邮箱" required>
                <el-input v-model="newEmail"></el-input>
                <el-button v-if="!isCountDowning" type="primary" @click="getVerifyCode"
                           class="email-get-verify-code-btn">获取验证码
                </el-button>
                <el-button v-else type="primary" @click="getVerifyCode" class="email-get-verify-code-btn" disabled>
                    {{ countDownText }}
                </el-button>
            </el-form-item>
            <el-form-item
                    label="验证码" required>
                <el-input v-model="verifyCode"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateEmailAddress">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import * as api from '@/api/api';

export default {
	data() {
		return {
			isCountDowning: false,
			newEmail: '',
			verifyCode: '',
			countDownText: '重新发送(60s)',
		}
	},
	methods: {
		getVerifyCode: function () {
			// 1. 校验邮箱格式是否正确
			// 检查邮箱格式，判空
			let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
			if (!reg.test(this.newEmail)) {
				this.$message.error("邮箱地址错误");
				return;
			}
			// this.$message.success("邮箱格式正确");
			// 2. 发起请求 获取验证码
			api.getVerifyCode(this.newEmail, 'update').then(result => {
				// console.log(result);
				if (result.code === api.success_code) {
					// 2. 启用禁止按钮 开始倒计时 异步操作
					this.startCountDown();
					this.$message.success(result.message);
				} else {
					this.$message.error(result.message);
				}
			});
		},
		startCountDown() {
			let time = 60;
			this.isCountDowning = true;
			let that = this;
			let interval = setInterval(function () {
				// 执行倒计时内容
				time--;
				if (time <= 0) {
					that.isCountDowning = false;
					clearInterval(interval);
				}
				// console.log('倒计时 == > ' + time)
				that.countDownText = '重新发送(' + time + ')s';
			}, 1000);
		},
		updateEmailAddress() {
			// 内容校验
			if (this.newEmail === '') {
				this.$message.error('邮箱地址不能为空');
				return;
			}
			if (this.verifyCode === '') {
				this.$message.error('验证码不能为空');
			}
			api.updateEmailAddress(this.newEmail, this.verifyCode).then(result => {
				if (result.code === api.success_code) {
					// 更新成功
					// 给出toast
					this.$message.success(result.message);
					// 重置表单
					this.verifyCode = '';
				} else {
					// 给出提示
					this.$message.success(result.message);
					this.verifyCode = '';
				}
			});
		},
	}
}
</script>

<style>
.email-get-verify-code-btn {
    margin-bottom: 20px;
}

.setting-email-box .el-input {
    max-width: 250px;
}
</style>