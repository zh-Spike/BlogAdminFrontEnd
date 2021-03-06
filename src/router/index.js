import VueRouter from 'vue-router'
import Vue from "vue";

Vue.use(VueRouter);

/*
登录页面
 */
const login = () => import("@/page/login/login");
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
const labManage = () => import("@/page/operation/manage-lab");
const appointmentManage = () => import("@/page/operation/manage-appointment");
const signManage = () => import("@/page/operation/manage-sign");
const categoryManage = () => import("@/page/operation/manage-category");
const loopManage = () => import("@/page/operation/manage-loop");
/*
设置
 */
const email = () => import("@/page/settings/email");
const info = () => import("@/page/settings/info");
const friendLink = () => import("@/page/settings/friendLink");
const websiteInfo = () => import("@/page/settings/website-info");
/*
用户
 */
const list = () => import("@/page/user/list");
/*
布局
 */
const baseView = () => import("@/layout/base-view")
const rightView = () => import("@/layout/right-content")


// 路由 嵌套路由
export const routes = [
	{
		path: '',
		component: baseView,
		redirect: '/index',
		children: [
			{
				path: "/index",
				hidden: false,
				name: '首页',
				icon: 'el-icon-s-home',
				component: index,
			},
			{
				path: "/content",
				hidden: false,
				name: '内容',
				icon: 'el-icon-tickets',
				component: rightView,
				children: [
					{
						path: 'post-article',
						hidden: false,
						icon: 'el-icon-plus',
						name: '发表文章',
						component: postArticle,
					},
					{
						path: 'manage-article',
						hidden: false,
						icon: 'el-icon-document',
						name: '文章管理',
						component: articleManage,
					},
					{
						path: 'manage-comment',
						hidden: false,
						icon: 'el-icon-chat-line-round',
						name: '评论管理',
						component: commentManage,
					},
					{
						path: 'manage-image',
						hidden: false,
						icon: 'el-icon-picture-outline-round',
						name: '图片管理',
						component: imageManage,
					}
				]
			},
			{
				path: "/user",
				hidden: false,
				name: '用户',
				icon: 'el-icon-user',
				component: rightView,
				children: [
					{
						path: 'list',
						hidden: false,
						name: '用户列表',
						icon: 'el-icon-user-solid',
						component: list,
					}
				]
			},
			{
				path: "/operation",
				icon: 'el-icon-thumb',
				hidden: false,
				name: '运营',
				component: rightView,
				children: [
					{
						path: 'category',
						name: '分类管理',
						icon: 'el-icon-help',
						hidden: false,
						component: categoryManage,
					},
					{
						path: 'loop',
						name: '轮播图管理',
						icon: 'el-icon-s-help',
						hidden: false,
						component: loopManage,
					},
					{
						path: 'sign',
						name: '签到管理',
						icon: 'el-icon-s-order',
						hidden: false,
						component: signManage,
					},
					{
						path: 'lab',
						name: '实验室管理',
						icon: 'el-icon-school',
						hidden: false,
						component: labManage,
					},
					{
						path: 'appointment',
						name: '预约审批管理',
						icon: 'el-icon-s-check',
						hidden: false,
						component: appointmentManage,
					},
				]
			},
			{
				path: "/settings",
				hidden: false,
				name: '设置',
				icon: 'el-icon-setting',
				component: rightView,
				children: [
					{
						path: 'email',
						name: '邮箱设置',
						icon: 'el-icon-message',
						hidden: false,
						component: email,
					},
					{
						path: 'info',
						hidden: false,
						icon: 'el-icon-postcard',
						name: '用户信息',
						component: info,
					},
					{
						path: 'website-info',
						name: '网站信息',
						icon: 'el-icon-ship',
						hidden: false,
						component: websiteInfo,
					},
					{
						path: 'friendLink',
						name: '友情链接',
						icon: 'el-icon-link',
						hidden: false,
						component: friendLink,
					}
				]
			}
		]
	},
	{
		path: '/login',
		component: login
	}
];

const router = new VueRouter({
	routes // routes: routes
})

export default router;