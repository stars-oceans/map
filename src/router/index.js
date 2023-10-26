import { createRouter, createWebHashHistory } from "vue-router";

export const constansRoutes = [
  {
    path: "/home",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/map",
    component: () => import("@/views/map/index.vue"),
  },
  {
    path: "/upload",
    component: () => import("@/views/upload/index.vue"),
  },
];

const router = createRouter({
  routes: constansRoutes,
  history: createWebHashHistory(),
});

export default router;
