import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// import store from "@/store";
import router from "@/router";


const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});

// app.use(store);
app.use(router);
app.mount("#app");

export default app;
