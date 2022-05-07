import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignIn from "../views/Auth/SignIn.vue";
import ActivationAccount from "../views/Auth/ActivationAccount.vue";
import LoginForm from "../views/Auth/LoginForm.vue";
import DashBoard from "../views/DashBoard.vue";
import ForgotPassword from "../views/Auth/ForgotPassword.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import store from "../store/";

const isAuth = (to, from, next) => {
  console.log(store.state.isAuth);
  if (!store.state.isAuth) {
    next("/log-in");
  } else {
    next();
  }
};
const unAuth = (to, from, next) => {
  console.log(store.state.isAuth);
  if (store.state.isAuth === null || store.state.isAuth === false) {
    next();
  } else {
    next("/dashboard");
  }
};
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      beforeEnter: unAuth,
    },
    {
      path: "/sign-in",
      name: "Signin",
      component: SignIn,
      beforeEnter: unAuth,
    },
    {
      path: "/activate/:uid/:token",
      name: "ActivationAccount",
      component: ActivationAccount,
      props: true,
      beforeEnter: unAuth,
    },
    {
      path: "/log-in",
      name: "Login",
      component: LoginForm,
      beforeEnter: unAuth,
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: ForgotPassword,
      beforeEnter: unAuth,
    },
    {
      path: "/reset_password_confirm/:uid/:token",
      name: "ResetPassword",
      component: ResetPassword,
      props: true,
      beforeEnter: unAuth,
    },
    {
      path: "/dashboard",
      name: "DashBoard",
      component: DashBoard,
      beforeEnter: isAuth,
    },
  ],
});

export default router;
