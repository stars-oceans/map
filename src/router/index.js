import { createRouter, createWebHashHistory } from "vue-router";

export const constansRoutes = [

  {
    path: "/map",
    component: () => import("@/views/map/index.vue"),
  },

];

const router = createRouter({
  routes: constansRoutes,
  history: createWebHashHistory(),
});

export default router;
