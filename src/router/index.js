import { createRouter, createWebHistory } from "vue-router";
import studentRouters from "./StudentRouters";
import authRouters from "./AuthRouters";
import teacherRouters from "./TeacherRouters";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRouters, ...studentRouters, ...teacherRouters],
});

export default router;
