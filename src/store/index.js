import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state: {
    userType: null,
    isAuth: localStorage.getItem("Auth"),
    userProfile: null,
    semCards: [],
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
    semCards(state) {
      return state.semCards;
    },
  },
  mutations: {
    userType(state, payload) {
      state.userType = payload;
    },
    userProfile(state, payload) {
      state.userProfile = payload;
    },
    semCards(state, payload) {
      state.semCards = payload;
    },
  },
  actions: {
    userType(context, payload) {
      context.commit("userType", payload);
    },
    userProfile(context, payload) {
      context.commit("userProfile", payload);
    },
    semCards(context, payload) {
      context.commit("semCards", payload);
    },
  },
});

export default store;
