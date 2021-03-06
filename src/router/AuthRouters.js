import SignIn from "../views/Auth/SignIn.vue";
import ActivationAccount from "../views/Auth/ActivationAccount.vue";
import LoginForm from "../views/Auth/LoginForm.vue";
import ForgotPassword from "../views/Auth/ForgotPassword.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import store from "../store/";

const unAuth = (to, from, next) => {
  console.log("isAuth : " + store.state.isAuth); //TODO: have to remove this console log
  if (store.state.isAuth === null || store.state.isAuth === false) {
    next();
  } else {
    next({ name: "StudentDashboard" });
  }
};

export default [
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
];
