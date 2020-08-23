<template>
    <div>
        <el-container>
            <el-header id="admin-header-box">顶部内容</el-header>
            <el-container>
                <el-aside id="left-menu-list-box" width="200px">
                    <left-menu></left-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <div class="content">
                            <router-view></router-view>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default {
    mounted: function () {
        // 动态设置侧边长高度
        let leftMenuBox = document.getElementById('left-menu-list-box');
        let adminHeaderBox = document.getElementById('admin-header-box');
        let dy = window.innerHeight - adminHeaderBox.offsetHeight;
        if (leftMenuBox && adminHeaderBox) {
            leftMenuBox.style.height = dy + 'px';
        }
    }
}
</script>

<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 46px !important;
}

.el-aside {
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
}

body > .el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>

