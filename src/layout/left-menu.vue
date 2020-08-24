<template>
	<el-menu
		default-active="0"
		unique-opened="true"
		class="el-menu-vertical">
		<!--遍历菜单-->
		<!--有两个 有子菜单和 无子菜单-->
		<template v-for="(item,index) in menuList">
			<router-link :to="item.path" v-if="!item.children&&!item.hidden" :key="index">
				<el-menu-item :index="index">
					<i :class="item.icon"></i>
					<span slot="title">{{ item.name }}</span>
				</el-menu-item>
			</router-link>
			<el-submenu v-if="item.children&&!item.hidden" :key="index" :index="index">
				<template slot="title">
					<i :class="item.icon"></i>
					<span>{{ item.name }}</span>
				</template>
				<router-link :to="item.path+'/'+subItem.path" :key="subIndex" v-for="(subItem, subIndex) in item.children">
					<el-menu-item  v-if="!subItem.hidden" :index="index+'-'+subIndex">
						<i :class="subItem.icon"></i>
						<span slot="title" v-text="subItem.name"></span>
					</el-menu-item>
				</router-link>
			</el-submenu>
		</template>
	</el-menu>
</template>

<script>
import {routes} from '@/router';

export default {
	data() {
		return {
			menuList: []
		}
	},
	mounted() {
		let menuList = routes[0];
		this.menuList = menuList.children;
		console.log(menuList.children);
	}
}
</script>

<style scoped>
.el-menu-vertical a {
	text-decoration: none;
}
</style>