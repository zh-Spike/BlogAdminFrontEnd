import VueRouter from 'vue-router'
import Vue from "vue";

/*
导入的内容
 */
const home = () => import("@/components/home");
const article = () => import("@/components/article");

Vue.use(VueRouter);

const routes = [
    {path: '/home', component: home},
    {path: '/article', component: article}
];

const router = new VueRouter({
    routes // routes: routes
})

export default router;