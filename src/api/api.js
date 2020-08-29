import http from './http'

export const success_code = 10000;
// 解析token
export const checkToken = () => {
	return http.requestGet('/user/check-token');
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
	return http.requestPost('/admin/loop/', loop);
};
// 删除轮播图
export const deleteLoop = (loopId) => {
	return http.requestDelete('/admin/loop/' + loopId);
};
