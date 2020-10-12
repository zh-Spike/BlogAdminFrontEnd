import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu'
import topHeader from './layout/top-header'
import * as api from "@/api/api";
import constants from "@/utils/constants";
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false
Vue.prototype.blog_constant = constants;

Vue.component('leftMenu', leftMenu);
Vue.component('topHeader', topHeader);
Vue.use(ElementUI);
// Vue.use(mavonEditor);

router.beforeEach((to, from, next) => {
	// 如果是登录页面，则需要放行
	if (to.path === '/login') {
		// TODO: 如果跳到登录页面
		// 如果已经登录 就没必要在到登录页面 除非用户点击退出登录
		// 如果已经登陆 通过角色页面跳转
		next();
	} else {
		// 否则检查用户角色
		api.checkToken().then(result => {
			// console.log(result);
			if (result.code === api.success_code) {
				window.localStorage.setItem('avatar', result.data.avatar);
				window.localStorage.setItem('userName', result.data.userName);
				// 登录成功 判断角色
				if (result.data.roles === 'role_admin') {
					next();
				} else {
					location.href = 'http://localhost:3000/';
				}
			} else {
				next({
					path: '/login'
				})
			}
		});
		// 管理员放行
		// 普通用户跳转到门户
	}
});
new Vue({
	router,
	render: h => h(App),
}).$mount('#app');