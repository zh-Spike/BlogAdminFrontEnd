import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

Vue.use(VueRouter);
/*
导入的内容
 */
const home = () => import("@/components/home");
const article = () => import("@/components/article");

const routes = [
    {path: '/home', component: home},
    {path: '/article', component: article}
];

const router = new VueRouter({
    routes // routes: routes
})
new Vue({
    router,
    render: h => h(App),
}).$mount('#app');