import HomeView from "../views/HomeView.vue";
import CreateCollege from "../views/CreateCollege.vue";
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
    path: "/",
    name: "Home",
    component: HomeView,
    beforeEnter: unAuth,
  },
  {
    path: "/create-college",
    name: "CreateCollege",
    component: CreateCollege,
    beforeEnter: unAuth,
  },
];
