import { createRouter, createWebHistory } from "vue-router";
import studentRouters from "./StudentRouters";
import authRouters from "./AuthRouters";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRouters, ...studentRouters],
});

export default router;
