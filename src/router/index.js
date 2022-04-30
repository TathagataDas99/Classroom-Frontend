import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignIn from "../views/SignIn.vue";
import ActivationAccount from "../views/ActivationAccount.vue";
import LoginForm from "../views/LoginForm.vue";
import DashBoard from "../views/DashBoard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/sign-in",
      name: "Signin",
      component: SignIn,
    },
    {
      path: "/activate/:uid/:token",
      name: "ActivationAccount",
      component: ActivationAccount,
      props: true,
    },
    {
      path: "/log-in",
      name: "Login",
      component: LoginForm,
    },
    {
      path: "/dashboard",
      name: "DashBoard",
      component: DashBoard,
    },
  ],
});

export default router;
