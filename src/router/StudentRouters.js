import store from "../store";
import StudentDashboard from "../views/Student/StudentDashboard.vue";
import SubjectCards from "../views/Student/SubjectCards.vue";
import ParticularSubject from "../views/Student/ParticularSubjects/ParticularSubject.vue";
import AnnouncementView from "../views/Student/ParticularSubjects/AnnouncementView.vue";
import AssignmentsView from "../views/Student/ParticularSubjects/AssignmentsView.vue";
import NotesView from "../views/Student/ParticularSubjects/NotesView.vue";

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
    redirect: { name: "AnnouncementView" },
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
];
