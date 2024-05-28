<template>
    <div class="wrap">
        <el-dialog :modelValue="isShow" title="获取经纬度" width="50%" :close-on-click-modal="false" align-center
            @close="mapClose" :modal-append-to-body='false'>
            <div class="mb-2">
                <span style="font-size: 16px;">经纬度：</span>
                <span style="font-size: 14px;">{{ coord }}</span>
            </div>
            <div class="home">
                <div id="map-box"></div>
                <div class="info-box">
                    <el-select v-model="keyword" placeholder="输入关键字搜索" :remote-method="handleSearch" filterable remote
                        clearable :loading="loading" reserve-keyword>
                        <el-option v-for="item in data" :key="item.id" :label="item.address" :value="item.name"
                            @click="handleSelect(item)">
                            <div class="df jcsb">
                                <span>{{ item.name }}</span>
                                <span style="font-size: 10px; color:var(--el-text-color-secondary)">{{ item.address
                                }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="mapClose"> 取消 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { shallowRef, ref, nextTick, watch } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { ElMessage } from "element-plus";

const map = shallowRef(null);
const keyword = ref('');
const coord = ref('');
const data = ref([]);
const loading = ref(false)
let AMapObj, placeSearch, marker, geocoder;

const props = defineProps({
    isShow: {
        type: Boolean,
    },
});

const emits = defineEmits(["onMapClose", 'onSubmit']);

watch(props, (newValue, oldValue) => {
    if (newValue) {
        nextTick(() => {
            initMap();
        })

    }
});


// 你申请的安全密钥
window._AMapSecurityConfig = {
    securityJsCode: '3b6eeb4cf9996a5567d0466141db62eb',
};

//  key
const initMap = () => {
    AMapLoader.load({
        key: 'd54b5cb31bb2c63c0ec57bb23e01c3ae', // 设置您的key
        version: '2.0',
        plugins: ['AMap.ToolBar', 'AMap.Driving'],
        AMapUI: {
            version: '1.1',
            plugins: [],
        },
        Loca: {
            version: '2.0.0',
        },
    })
        .then((AMap) => {
            AMapObj = AMap;
            map.value = new AMap.Map('map-box', {
                viewMode: '2D',
                zoom: 10,
                zooms: [2, 22],
                center: [117.240380, 29.301516],
            });
            map.value.on('click', onMapClick);
            AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.AutoComplete'], () => {
                // 缩放条
                const toolbar = new AMap.ToolBar();
                // 比例尺
                const scale = new AMap.Scale();
                // 定位
                const geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: 10000, // 超过10秒后停止定位，默认：5s
                    position: 'RT', // 定位按钮的停靠位置
                    buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
                });
                geocoder = new AMap.Geocoder({
                    city: '全国',
                });
                map.value.addControl(geolocation);
                map.value.addControl(toolbar);
                map.value.addControl(scale);
                placeSearch = new AMap.PlaceSearch({
                    city: '全国',
                    pageSize: 10, // 单页显示结果条数
                    pageIndex: 1, // 页码
                    citylimit: false, // 是否强制限制在设置的城市内搜索
                    autoFitView: true,
                    // panel: 'list',
                    // map: map.value,
                });
            });
        })
        .catch((e) => {
            console.log(e);
        });
};

// 搜索地图
const handleSearch = (query) => {
    if (query) {
        loading.value = true;
        placeSearch.search(query, (status, result) => {
            console.log(result, status);
            if (status === 'complete' && result.info === 'OK' && result.poiList) {
                loading.value = false;
                data.value = result.poiList.pois;
            }
        });
    }

};

//点击搜索选项
const handleSelect = (item) => {
    drawMarker(item.location)
    if (item.location != null) {
        coord.value = item.location.lng + ',' + item.location.lat
    }
}

// 点击地图
const onMapClick = (e) => {
    coord.value = e.lnglat.lng + ',' + e.lnglat.lat;
    geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
            // result为对应的地理位置详细信息
            keyword.value = result.regeocode.formattedAddress;
        }
    });
    drawMarker(e.lnglat);
};

// 绘制地点marker
const drawMarker = (location) => {
    if (location == null) return;
    let longitude = location.lng,
        latitude = location.lat;
    if (marker) {
        marker.setMap(null);
    }
    marker = new AMapObj.Marker({
        position: new AMapObj.LngLat(longitude, latitude),
        anchor: 'bottom-center',
    });
    marker.on('click', () => {
        coord.value = location;
    });
    map.value.add(marker);
    map.value.setZoomAndCenter(16, [longitude, latitude]);
};


//保存
const onSubmit = () => {
    if (coord.value) {
        emits("onSubmit", coord.value, keyword.value);
    } else {
        ElMessage.error('还没有选择地址！')
    }
};

//关闭地图
const mapClose = () => {
    keyword.value = '';
    coord.value = '';
    if (placeSearch) {
        placeSearch.clear();
    }
    initMap();
    emits("onMapClose");
}


</script>

<style lang="scss" scoped>
.home {
    height: 450px;
    width: 100%;
    padding: 0px;
    margin: 0px;
    position: relative;
}

.info-box {
    position: absolute;
    top: 8px;
    right: 8px;
}

#map-box {
    height: 100%;
    width: 100%;
    padding: 0px;
    margin: 0px;
}
.el-select {
    min-width: 500px;
}
</style>