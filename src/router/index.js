import VueRouter from 'vue-router'
import Vue from "vue";

Vue.use(VueRouter);

// /*
// 登录页面
//  */
// const login = () => import("@/page/login/login");
/*
内容
 */
const postArticle = () => import("@/page/content/post-article");
const articleManage = () => import("@/page/content/manage-article");
const imageManage = () => import("@/page/content/manage-image");
const commentManage = () => import("@/page/content/manage-comment");
/*
首页
 */
const index = () => import("@/page/dashboard/index");
/*
运营
 */
const categoryManage = () => import("@/page/operation/manage-category");
const loopManage = () => import("@/page/operation/manage-loop");
/*
设置
 */
const friendLink = () => import("@/page/settings/friendLink");
const websiteInfo = () => import("@/page/settings/website-info");
/*
用户
 */
const email = () => import("@/page/user/email");
const info = () => import("@/page/user/info");
const list = () => import("@/page/user/list");
const restPassword = () => import("@/page/user/reset-password");
/*
布局
 */
const baseView = () => import("@/layout/base-view")
const rightView = () => import("@/layout/right-content")


// 路由 嵌套路由
const routes = [
    {
        path: '',
        component: baseView,
        redirect: '/index',
        children: [
            {
                path: "/index",
                component: index,
            },
            {
                path: "/content",
                component: rightView,
                children: [
                    {
                        path: 'post-article',
                        component: postArticle,
                    },
                    {
                        path: 'manage-article',
                        component: articleManage,
                    },
                    {
                        path: 'manage-comment',
                        component: commentManage,
                    },
                    {
                        path: 'manage-image',
                        component: imageManage,
                    }
                ]
            },
            {
                path: "/user",
                component: rightView,
                children: [
                    {
                        path: 'list',
                        component: list,
                    },
                    {
                        path: 'reset-password',
                        component: restPassword,
                    },
                    {
                        path: 'email',
                        component: email,
                    },
                    {
                        path: 'info',
                        component: info,
                    }
                ]
            },
            {
                path: "/operation",
                component: rightView,
                children: [
                    {
                        path: 'category',
                        component: categoryManage,
                    },
                    {
                        path: 'loop',
                        component: loopManage,
                    }
                ]
            },
            {
                path: "/settings",
                component: rightView,
                children: [
                    {
                        path: 'website-info',
                        component: websiteInfo,
                    },
                    {
                        path: 'friendLink',
                        component: friendLink,
                    }
                ]
            }
        ]
    }
];

const router = new VueRouter({
    routes // routes: routes
})

export default router;