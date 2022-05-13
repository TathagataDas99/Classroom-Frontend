import store from "../store";
import TeacherDashboard from "../views/Teacher/TeacherDashboard.vue";
import ClassroomView from "../views/Teacher/ClassroomView.vue";
import TeacherSubjectCards from "../views/Teacher/Subjects/TeacherSubjectCards.vue";

const isAuth = (to, from, next) => {
  console.log("isAuth : " + store.state.isAuth); //TODO: have to remove this console log
  if (!store.state.isAuth) {
    next("/log-in");
  } else {
    next();
  }
};

export default [
  {
    path: "/teacher-dashboard",
    name: "TeacherDashboard",
    component: TeacherDashboard,
    beforeEnter: isAuth,
  },
  {
    path: "/teacher-dashboard/:classroom_slug",
    name: "ClassroomView",
    component: ClassroomView,
    props: true,
    beforeEnter: isAuth,
  },
  {
    path: "/teacher-dashboard/:classroom_slug/semester-:semester_no",
    name: "TeacherSubjectCards",
    component: TeacherSubjectCards,
    props: true,
    beforeEnter: isAuth,
  },
];
