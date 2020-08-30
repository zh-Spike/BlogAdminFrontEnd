<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
	name: 'App'
}
</script>

<style>
* {
    padding: 0;
    margin: 0;
}

.margin-bottom-20 {
    margin-bottom: 20px;
}

.clearfix {
    overflow: auto;
    zoom: 1;
}
</style>
