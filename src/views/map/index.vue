<template>
    <div>
        <el-button type="primary" @click="isShow = true">获取定位</el-button>
        <Map :isShow="isShow" @onMapClose="handleCloseMap" @onSubmit="handleSubmit"></Map>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Map from "@/components/map/index.vue";

const isShow = ref(false);

//关闭地图
const handleCloseMap = () => {
    isShow.value = false;
};

//保存地图
const handleSubmit = (coord, keyword) => {
    console.log(coord, keyword);
    // isShow.value = false;
};
</script>

<style lang="scss" scoped></style>