import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignIn from "../views/SignIn.vue";
import ActivationAccount from "../views/ActivationAccount.vue";
import LoginForm from "../views/LoginForm.vue";
import DashBoard from "../views/DashBoard.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";

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
      path: "/forgot-password",
      name: "ForgotPassword",
      component: ForgotPassword,
    },
    {
      path: "/reset_password_confirm/:uid/:token",
      name: "ResetPassword",
      component: ResetPassword,
      props: true,
    },
    {
      path: "/dashboard",
      name: "DashBoard",
      component: DashBoard,
    },
  ],
});

export default router;
