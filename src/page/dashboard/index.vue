<template>
    <div class="dashboard-box">
        <div class="web-size-info-box margin-bottom-20">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        注册用户:1
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        文章数量:1
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        评论数量:1
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" size="medium">写文章</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="dashboard-bottom-part">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        最新评论
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        快捷操作
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
	name: "index"
}
</script>

<style>
.dashboard-box {
    min-width: 1140px;
    padding: 20px;
}

.bg-purple {
    background: #d3dce6;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>