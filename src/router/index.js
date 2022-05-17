import { createRouter, createWebHistory } from "vue-router";
import studentRouters from "./StudentRouters";
import authRouters from "./AuthRouters";
import teacherRouters from "./TeacherRouters";
import welcomeRouters from "./WelcomeRouters";
import DbaRouters from "./DbaRouters";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRouters,
    ...studentRouters,
    ...teacherRouters,
    ...welcomeRouters,
    ...DbaRouters,
  ],
});

export default router;
