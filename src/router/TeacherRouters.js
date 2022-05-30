import store from "../store";
import TeacherDashboard from "../views/Teacher/TeacherDashboard.vue";
import ClassroomView from "../views/Teacher/ClassroomView.vue";
import TeacherSubjectCards from "../views/Teacher/TeacherSubjectCards.vue";
import particularSubjectView from "../views/Teacher/Subjects/particularSubjectView.vue";
import announcementTeacher from "../views/Teacher/Subjects/announcementTeacher.vue";
import notesTeacher from "../views/Teacher/Subjects/notesTeacher.vue";
import assignmentTeacher from "../views/Teacher/Subjects/assignmentTeacher.vue";
import assignmentSubmission from "../views/Teacher/Subjects/AssignmentSubmission.vue";

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
  {
    path: "/teacher-dashboard/:classroom_slug/semester-:semester_no/:subject_slug/",
    name: "particularSubjectView",
    component: particularSubjectView,
    redirect: { name: "announcementTeacher" },
    props: true,
    beforeEnter: isAuth,
    children: [
      {
        path: "announcements",
        name: "announcementTeacher",
        component: announcementTeacher,
        props: true,
        beforeEnter: isAuth,
      },
      {
        path: "notes",
        name: "notesTeacher",
        component: notesTeacher,
        props: true,
        beforeEnter: isAuth,
      },
      {
        path: "assignments/",
        name: "assignmentTeacher",
        component: assignmentTeacher,
        props: true,
        beforeEnter: isAuth,
        children: [
          {
            path: ":id",
            name: "assignmentSubmission",
            component: assignmentSubmission,
            props: true,
            beforeEnter: isAuth,
          },
        ],
      },
    ],
  },
  /* {
    path: "/teacher-dashboard/:classroom_slug/semester-:semester_no/:subject_slug/assignments/:id",
    name: "assignmentSubmission",
    component: assignmentSubmission,
    props: true,
    beforeEnter: isAuth,
  }, */
];
