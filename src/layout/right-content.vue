<template>
    <div class="right-content-container">
        <!--显示内容-->
        <div class="content-title-box " v-text="$route.name"></div>
        <div class="content-container-box">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {}
</script>
<style>
.content-container-box {
}

.content-title-box {
    padding: 10px;
    font-size: 20px;
    line-height: 30px;
}
</style>
