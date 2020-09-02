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
#app {
    min-width: 1140px;
}

* {
    padding: 0;
    margin: 0;
}

.margin-bottom-20 {
    margin-bottom: 20px;
}

.margin-bottom-10 {
    margin-bottom: 10px;
}

.clearfix {
    overflow: auto;
    zoom: 1;
}
</style>
