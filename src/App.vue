<template>
  <div id="app">
    <div class="nav">
      <router-link class="link" to="home">Home</router-link>
      <router-link class="link" to="map">Map</router-link>
      <router-link class="link" to="upload">Upload</router-link>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link {
  color: #4294ff;
  border-radius: 15px;
  margin-right: 20px;
}

.container {
  margin-top: 50px;
}
</style>