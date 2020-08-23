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
.header-part {
    background: forestgreen;

}

.nav {
    background: aquamarine;
    width: 159px;
    height: 500px;
    float: left;
}

.content {
    width: 800px;
    background: beige;
    height: 500px;
    float: left;
}
</style>
