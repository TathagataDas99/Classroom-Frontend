<template>
<div class="flex flex-row justify-evenly  " v-if="error">
      <div class="notification bg-danger-light"  >
            {{ error }}
          </div>
    </div>
  <div class="grid grid-cols-1 grid-rows-1 grid-flow-row lg:grid-cols-2 lg:grid-flow-col h-screen lg:min-h-screen content-center justify-center gap-2 bg-gradient-to-br from-green-400/50 to-sky-400/90 ">
    <div class="absolute" v-if="loader">
      <LoaderView />

    </div>
    
    <img src="../../assets/login/login_3.svg" alt="" class="w-5/6 h-full hidden lg:col-start-2  lg:block self-end">
    <main class="login-form">
      <img
        src="../../assets/login/man_2.png"
        alt="no user image found"
        class="mx-auto h-auto w-2/6 mt-5 shadow-lg rounded-full shadow-green-300/70"
      />
      <form class="form" @submit.prevent="handelLogin">
        <section class="form-section">
          <label class="label">Email</label>
          <section class="input-section">
            <MailIcon class="input-icon" />
            <input
              required
              type="email"
              class="input-box"
              v-model.trim.lazy="formValues.email"
            />
          </section>
        </section>
        <section class="form-section">
          <label class="label">Password</label>
          <section class="input-section">
            <LockClosedIcon class="input-icon" />
            <input
              required
              type="password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$"
              class="input-box"
              v-model="formValues.password"
            />
          </section>
        </section>
        
        <div class="button-section">
          <button type="submit" class="bttn">Login</button>
        </div>
        <div class="button-section ">
          <router-link class="forgot-password" to="/forgot-password">
            Forgot password?</router-link
          >
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
import { MailIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/vue/solid";

export default {
  name: "LoginForm",
  components: {
    MailIcon,
    LockClosedIcon,
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
        const response = await axios.post("/login/jwt/create/", this.formValues);
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
        const userTypeResponse = await axios.get(`/classroom-app/user-type/${userId}`);
        // console.log(userTypeResponse);
        const user = {
          userType: userTypeResponse.data.user_type,
          userTypeId: Object.values(userTypeResponse.data)[1],
        };
        // console.log(user);
        //this.$store.state.user = user;
        if (user.userType === "student") {
          this.$router.push({ name: "StudentDashboard" });
        } else if (user.userType === "teacher") {
          this.$router.push({ name: "TeacherDashboard" });
        } else {
          this.$router.push({ name: "DbaDashboard" });
        }
      } catch (e) {
        this.error = e.response.data.detail;
      }
      this.loader = false;
    },
  },
};
</script>
