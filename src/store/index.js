import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    userType: null,
    isAuth: localStorage.getItem("Auth"),
    userProfile: null,
  },
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
    async update(context) {
      try {
        const response1 = await axios.get("/auth/users/me/", {
          headers: {
            Authorization: "JWT " + localStorage.getItem("token"),
          },
        });
        const userId = response1.data.id;
        const userTypeResponse = await axios.get(
          `/classroom-app/user-type/${userId}`
        );
        const userTypeObj = {
          userType: userTypeResponse.data.user_type,
          userTypeId: Object.values(userTypeResponse.data)[1],
        };
        context.commit("userType", userTypeObj);

        const userProfileResponse = await axios.get(
          `/classroom-app/student/${userTypeObj.userTypeId}/`
        );
        context.commit("userProfile", userProfileResponse.data);
      } catch (e) {
        console.log(e);
      }
    },
  },
});

export default store;
