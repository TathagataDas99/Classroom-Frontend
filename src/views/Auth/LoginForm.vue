<template>
  <div class="flex h-screen flex-col items-center justify-evenly">
    <div v-if="loader">
      <LoaderView />
    </div>
    <form class="form" @submit.prevent="handelLogin">
      <div class="form-section">
        <label class="label">Email</label>
        <input
          required
          type="email"
          class="input-box"
          v-model.trim.lazy="formValues.email"
        />
      </div>
      <div class="form-section">
        <label class="label">Password</label>
        <input
          required
          type="password"
          class="input-box"
          v-model="formValues.password"
        />
      </div>
      <div class="text-2xl font-bold text-pink-500" v-if="error">
        {{ error }}
      </div>
      <button type="submit" class="bttn">Submit</button>
      <router-link class="text-green-700" to="/forgot-password">
        Forgot password?</router-link
      >
    </form>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";

export default {
  name: "LoginForm",
  components: {
    LoaderView,
  },
  // created() {
  //   if (sessionStorage.getItem("token")) {
  //     this.$router.push("/dashboard");
  //   } else {
  //     this.$router.push("/log-in");
  //   }
  // },//TODO: Delete this comment
  data() {
    return {
      formValues: {
        email: "",
        password: "",
      },
      error: "",
      loader: false,
    };
  },
  methods: {
    async handelLogin() {
      this.loader = true;
      this.error = "";
      try {
        const response = await axios.post(
          "/login/jwt/create/",
          this.formValues
        );
        // console.log(response);
        sessionStorage.setItem("token", response.data.access);
        sessionStorage.setItem("Auth", true);
        this.$store.state.isAuth = true;
        const response1 = await axios.get("/auth/users/me/", {
          headers: {
            Authorization: "JWT " + sessionStorage.getItem("token"),
          },
        });
        // console.log(response1.data.id);
        const userId = response1.data.id;
        const userTypeResponse = await axios.get(
          `/classroom-app/user-type/${userId}`
        );
        // console.log(userTypeResponse);
        const user = {
          userType: userTypeResponse.data.user_type,
          userTypeId: Object.values(userTypeResponse.data)[1],
        };
        // console.log(user);
        //this.$store.state.user = user;
        if (user.userType === "student") {
          this.$router.push({ name: "StudentDashboard" });
        }
        // else{

        // }
        // console.log(this.$store.state.user);
      } catch (e) {
        this.error = e.response.data.detail;
      }
      this.loader = false;
    },
  },
};
</script>
