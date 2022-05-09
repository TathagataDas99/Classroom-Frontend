import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state: {
    userType: null,
    isAuth: localStorage.getItem("Auth"),
    userProfile: null,
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  getters: {
    userType(state) {
      return state.userType;
    },
    userProfile(state) {
      return state.userProfile;
    },
  },
  mutations: {
    userType(state, payload) {
      state.userType = payload;
    },
    userProfile(state, payload) {
      state.userProfile = payload;
    },
  },
  actions: {
    userType(context, payload) {
      context.commit("userType", payload);
    },
    userProfile(context, payload) {
      context.commit("userProfile", payload);
    },
  },
});

export default store;
