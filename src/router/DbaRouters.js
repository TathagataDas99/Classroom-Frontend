import store from "../store";
import DbaDashboard from "../views/Dba/DbaDashboard.vue";

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
    path: "/dba-dashboard",
    name: "DbaDashboard",
    component: DbaDashboard,
    beforeEnter: isAuth,
  },
];
