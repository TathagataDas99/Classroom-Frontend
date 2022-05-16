import { createRouter, createWebHistory } from "vue-router";
import studentRouters from "./StudentRouters";
import authRouters from "./AuthRouters";
import teacherRouters from "./TeacherRouters";
import welcomeRouters from "./WelcomeRouters";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRouters,
    ...studentRouters,
    ...teacherRouters,
    ...welcomeRouters,
  ],
});

export default router;
