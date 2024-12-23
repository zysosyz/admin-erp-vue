import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/LEDGER",
  },
  {
    path: "/LEDGER",
    name: "LEDGER",
    component: () => import("../view/LEDGER.vue"),
  },
  {
    path: "/SHIPPING",
    name: "SHIPPING",
    component: () => import("../view/SHIPPING.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
