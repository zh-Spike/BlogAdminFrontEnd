import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu'
import topHeader from './layout/top-header'

Vue.config.productionTip = false

Vue.component('leftMenu', leftMenu);
Vue.component('topHeader', topHeader);
Vue.use(ElementUI);
const axios = require('axios');
router.beforeEach((to, from, next) => {
    // 如果是登录页面，则需要放行
    if (to.path === '/login') {
        // TODO: 如果跳到登录页面
        // 如果已经登录 就没必要在到登录页面 除非用户点击退出登录
        // 如果已经登陆 通过角色页面跳转
        next();
    } else {
        // 否则检查用户角色
        axios.get('/user/check-token').then(result => {
            let res = result.data;
            // console.log(res);
            if (res.code === 10000) {
                // 登录成功 判断角色
                if (res.data.roles === 'role_admin') {
                    next();
                } else {
                    location.href = 'https://www.baidu.com';
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