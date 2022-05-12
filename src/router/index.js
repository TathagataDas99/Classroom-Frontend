import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignIn from "../views/Auth/SignIn.vue";
import ActivationAccount from "../views/Auth/ActivationAccount.vue";
import LoginForm from "../views/Auth/LoginForm.vue";
import ForgotPassword from "../views/Auth/ForgotPassword.vue";
import ResetPassword from "../views/Auth/ResetPassword.vue";
import StudentDashboard from "../views/Student/StudentDashboard.vue";
import SubjectCards from "../views/Student/SubjectCards.vue";
import ParticularSubject from "../views/Student/ParticularSubjects/ParticularSubject.vue";
import AnnouncementView from "../views/Student/ParticularSubjects/AnnouncementView.vue";
import AssignmentsView from "../views/Student/ParticularSubjects/AssignmentsView.vue";
import NotesView from "../views/Student/ParticularSubjects/NotesView.vue";
import store from "../store/";

const isAuth = (to, from, next) => {
  console.log("isAuth : " + store.state.isAuth); //TODO: have to remove this console log
  if (!store.state.isAuth) {
    next("/log-in");
  } else {
    next();
  }
};
const unAuth = (to, from, next) => {
  console.log("isAuth : " + store.state.isAuth); //TODO: have to remove this console log
  if (store.state.isAuth === null || store.state.isAuth === false) {
    next();
  } else {
    next({ name: "StudentDashboard" });
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
      path: "/student-dashboard",
      name: "StudentDashboard",
      component: StudentDashboard,
      beforeEnter: isAuth,
    },
    {
      path: "/student-dashboard/semester-:no/subjects",
      name: "SubjectCards",
      component: SubjectCards,
      props: true,
      beforeEnter: isAuth,
    },
    {
      path: "/student-dashboard/semester-:no/subjects/:subject_slug/",
      name: "ParticularSubject",
      component: ParticularSubject,
      props: true,
      beforeEnter: isAuth,
      children: [
        {
          path: "announcements",
          name: "AnnouncementView",
          component: AnnouncementView,
          props: true,
          beforeEnter: isAuth,
        },
        {
          path: "notes",
          name: "NotesView",
          component: NotesView,
          props: true,
          beforeEnter: isAuth,
        },
        {
          path: "assignments",
          name: "AssignmentsView",
          component: AssignmentsView,
          props: true,
          beforeEnter: isAuth,
        },
      ],
    },
  ],
});

export default router;
