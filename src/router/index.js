import { createRouter, createWebHistory } from "vue-router";
import studentRouters from "./StudentRouters";
import authRouters from "./AuthRouters";
import teacherRouters from "./TeacherRouters";
import welcomeRouters from "./WelcomeRouters";
import DbaRouters from "./DbaRouters";
import notFound from "../views/NotFount.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRouters,
    ...studentRouters,
    ...teacherRouters,
    ...welcomeRouters,
    ...DbaRouters,
    {
      path: "/:catchAll(.*)",
      name: notFound,
      component: notFound,
    },
  ],
});

export default router;
