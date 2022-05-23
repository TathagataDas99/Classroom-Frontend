<template>
  <Transition>
    <div class="flex flex-row justify-evenly" v-if="error && showError">
      <div class="notification bg-danger-light">
        <p class="mx-1">
          {{ error }}
        </p>
        <XCircleIcon
          @click="closeNotification"
          class="inline-block h-10 w-10 font-bold text-bglight-shade md:h-6 md:w-6"
        />
      </div>
    </div>
  </Transition>
  <div class="login-view">
    <div class="absolute" v-if="loader">
      <LoaderView />
    </div>

    <img
      src="../../assets/login/login_3.svg"
      alt=""
      class="hidden h-full w-5/6 self-end lg:col-start-2 lg:block"
    />
    <main class="login-form">
      <img
        src="../../assets/login/man_2.png"
        alt="no user image found"
        class="mx-auto mt-5 h-auto w-2/6 rounded-full shadow-lg shadow-green-300/70"
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
        <div class="button-section">
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
import {
  MailIcon,
  LockClosedIcon,
  // LockOpenIcon,
  XCircleIcon,
} from "@heroicons/vue/solid";

export default {
  name: "LoginForm",
  components: {
    MailIcon,
    LockClosedIcon,
    XCircleIcon,
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
      showError: false,
      loader: false,
      notificationInterval: 2000,
    };
  },
  methods: {
    closeNotification() {
      this.showError = !this.showError;
    },
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
        } else if (user.userType === "teacher") {
          this.$router.push({ name: "TeacherDashboard" });
        } else {
          this.$router.push({ name: "DbaDashboard" });
        }
      } catch (e) {
        this.error = e.response.data.detail;
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, this.notificationInterval);
      }
      this.loader = false;
    },
  },
};
</script>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
