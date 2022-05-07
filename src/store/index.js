import { createStore } from "vuex";

const store = createStore({
  state: {
    user: null,
    isAuth: localStorage.getItem("Auth"),
  },
});

export default store;
