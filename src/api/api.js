import http from './http'

export const success_code = 10000;
export const failed_code = 40000;
// 解析token
export const checkToken = () => {
	return http.requestGet('/user/check_token');
};
// 登录
export const doLogin = (verifyCode, captchaKey, user) => {
	return http.requestPost('/user/login/' + verifyCode + '/' + captchaKey + '?from=p_', user);
};
// 获取分类列表
export const listCategories = () => {
	return http.requestGet('/admin/category/list/');
};
// 删除分类
export const deleteCategoryById = (categoryId) => {
	return http.requestDelete('/admin/category/' + categoryId);
};
// 添加分类
export const postCategory = (category) => {
	return http.requestPost('/admin/category/', category);
};
// 更新分类
export const updateCategory = (categoryId, category) => {
	return http.requestPut('/admin/category/' + categoryId, category);
};
// 获取轮播图列表
export const listLoop = () => {
	return http.requestGet('/admin/loop/list');
};
// 添加轮播图
export const postLoop = (loop) => {
	return http.requestPost('/admin/loop', loop);
};
// 删除轮播图
export const deleteLoop = (loopId) => {
	return http.requestDelete('/admin/loop/' + loopId);
};
//  更新轮播图
export const updateLoop = (loopId, loop) => {
	return http.requestPut('/admin/loop/' + loopId, loop);
};
// 获取用户列表
export const listUsers = (page, size) => {
	return http.requestGet('/user/list?page=' + page + '&size=' + size);
};
// 获取用户列表
export const doUserSearch = (userName, email) => {
	return http.requestGet('/user/list?page=1&size=10&userName=' + userName + '&email=' + email);
};
// 删除用户
export const deleteUserById = (userId) => {
	return http.requestDelete('/user/' + userId);
};
// 重置密码
export const resetPassword = (userId, newPassword) => {
	return http.requestPut('/user/reset_password/' + userId + '?password=' + newPassword);
};
// 获取邮箱验证码
export const getVerifyCode = (emailAddress, type) => {
	return http.requestGet('/user/verify_code?email=' + emailAddress + '&type=' + type);
};
// 重置邮箱
export const updateEmailAddress = (emailAddress, verifyCode) => {
	return http.requestPut('/user/email?email=' + emailAddress + '&verify_code=' + verifyCode);
};
// 检查用户名是否占用
export const checkUserName = (userName) => {
	return http.requestGet('/user/user_name?userName=' + userName);
};
// 更新用户信息
export const updateUserInfo = (userInfo, userId) => {
	return http.requestPut('/user/user_info/' + userId, userInfo);
};
// 获取SEO信息
export const getSeoInfo = () => {
	return http.requestGet('/admin/web_site_info/seo');
};
// 获取网站标题
export const getSeoTitle = () => {
	return http.requestGet('/admin/web_site_info/title');
};
// 更新网站标题
export const updateWebsiteTitle = (title) => {
	return http.requestPut('/admin/web_site_info/title?title=' + title);
};
// 更新网站SEO
export const updateSeoInfo = (keywords, description) => {
	return http.requestPut('/admin/web_site_info/seo?description=' + description + '&keywords=' + keywords);
};
// 获取友情链接
export const listFriendLinks = () => {
	return http.requestGet('/admin/friend_link/list');
};
// 添加友情链接
export const postFriendLink = (friendLink) => {
	return http.requestPost('/admin/friend_link', friendLink);
};
// 更新友情链接
export const updateFriendLink = (friendLink, linkId) => {
	return http.requestPut('/admin/friend_link/' + linkId, friendLink);
};
// 删除友情链接
export const deleteFriendLink = (linkId) => {
	return http.requestDelete('/admin/friend_link/' + linkId);
};
// 获取图片列表
export const listImages = (page, size, original) => {
	return http.requestGet('/admin/image/list/' + page + '/' + size + '?origin=' + original);
};
// 发表文章
export const postArticle = (article) => {
	return http.requestPost('/admin/article', article);
};
// 保存草稿
export const saveArticleDraft = (article) => {
	return http.requestPost('/admin/article', article);
};
// 获取文章列表
export const listArticle = (page, size, state, keyword, categoryId) => {
	return http.requestGet('/admin/article/list/' + page + '/' + size + '?state=' + size + '&categoryId=' +
		categoryId + '&keyword=' + keyword);
};
