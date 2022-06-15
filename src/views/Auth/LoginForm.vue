<template>
  <!-- <Transition>
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
  </Transition> -->
  <div v-if="error && showError">
    <template v-for="e in error" :key="e">
      <notificationView :error="e" @close="showError = false" />
    </template>
  </div>
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
        src="../../assets/login/man_2.svg"
        alt="no user image found"
        class="mx-auto mt-5 h-1/6 w-1/6 rounded-full"
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
            <LockClosedIcon
              v-show="!isEyeOpen"
              @click="openEye"
              class="input-icon cursor-pointer"
            ></LockClosedIcon>
            <LockOpenIcon
              class="input-icon cursor-pointer"
              v-show="isEyeOpen"
              @click="openEye"
            ></LockOpenIcon>
            <!-- <LockClosedIcon class="input-icon" /> -->
            <input
              required
              :type="typePassword"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$"
              class="input-box"
              v-model="password"
              @change="checkPassword"
            />
          </section>
          <div
            class="mx-auto rounded-lg px-2 text-xs font-semibold text-danger-dark lg:absolute lg:right-44 lg:scale-75 lg:bg-white"
            v-show="!passwordPatternOk"
          >
            <ul>
              <li
                class="text-xl"
                v-for="(msg, index) in passwordErrorMsg"
                :key="index"
              >
                *
                {{ msg }}
              </li>
            </ul>
          </div>
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
import notificationView from "../../components/notificationView.vue";
import {
  MailIcon,
  LockClosedIcon,
  LockOpenIcon,
  // XCircleIcon,
} from "@heroicons/vue/solid";

export default {
  name: "LoginForm",
  components: {
    MailIcon,
    LockClosedIcon,
    LockOpenIcon,
    // XCircleIcon,
    LoaderView,
    notificationView,
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
      password: "",
      formValues: {
        email: "",
        password: "",
      },
      passwordErrorMsg: [
        "Should Contain mix of upper and lower case",
        "Should Contain at least one special char ",
        "Should have at least 6 characters",
      ],
      passwordPatternOk: false,
      error: [],
      showError: false,
      loader: false,
      notificationInterval: 5000,
      typePassword: "password",
      isEyeOpen: false,
    };
  },
  watch: {
    password(newValue) {
      console.log(newValue);
      const pattern = RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$"
      );

      console.log(typeof pattern);
      if (!pattern.test(newValue)) {
        this.passwordPatternOk = false; // bad user input
      } else {
        this.passwordPatternOk = true; // bad user input
      }
    },
  },
  methods: {
    // checkPassword() {
    //   const pattern =
    //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$";
    //   if (!pattern.test(this.password)) {
    //     this.passwordPatternOk = false; // bad user input
    //   } else {
    //     this.passwordPatternOk = true; // bad user input
    //   }
    // },
    openEye() {
      console.log("in open eye func");
      this.isEyeOpen = !this.isEyeOpen;
      if (this.isEyeOpen) {
        this.typePassword = "text";
      } else {
        this.typePassword = "password";
      }
    },
    closeNotification() {
      this.showError = !this.showError;
    },
    async handelLogin() {
      this.loader = true;
      this.error = "";
      this.formValues.password = this.password;
      try {
        const response = await axios.post(
          "/login/jwt/create/",
          this.formValues
        );
        console.log(response);
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
        this.error = Object.values(e.response.data);
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
