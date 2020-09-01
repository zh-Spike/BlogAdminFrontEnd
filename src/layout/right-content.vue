<template>
    <div>
        <!--显示内容-->
        <div class="content-title-box margin-bottom-20" v-text="$route.name"></div>
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
    padding: 10px;
}

.content-title-box {
    padding: 10px;
    font-weight: 600;
}
</style>
