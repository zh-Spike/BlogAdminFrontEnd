<template>
    <div>
        <el-container>
            <el-header id="admin-header-box">
                <top-header></top-header>
            </el-header>
            <el-container class="main-container">
                <el-aside id="left-menu-list-box" width="220px">
                    <left-menu></left-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
	mounted() {
		// 动态设置侧边长高度
		// let leftMenuBox = document.getElementById('left-menu-list-box');
		// let adminHeaderBox = document.getElementById('admin-header-box');
		// let dy = window.innerHeight - adminHeaderBox.offsetHeight;
		// if (leftMenuBox && adminHeaderBox) {
		// 	leftMenuBox.style.height = dy + 'px';
	}
}
</script>

<style>
#left-menu-list-box {
    z-index: 2000;
}

.main-container {
    position: absolute;
    top: 46px;
    width: 100%;
    bottom: 0;
}

#left-menu-list-box .el-menu {
    border-right: none;
    background-color: #F2F2F2;
}

.el-header {
    background-color: #B3C0D1;
    line-height: 60px;
    height: 46px !important;
}

.el-aside {
    line-height: 200px;
    background: #F2F2F2;
    border-right: solid 1px #e6e6e6;
}

.el-main {
    padding: 0;
}
</style>

