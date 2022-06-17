<template>
  <div v-if="error && showError">
    <template v-for="e in error" :key="e">
      <notificationView :error="e" @close="showError = false" />
    </template>
  </div>
  <div class="signin-view">
    <div v-if="loader">
      <LoaderView />
    </div>
    <img
      src="../../assets/signin/Certificate_Boy.svg"
      alt="No Certificate Boy Img Found"
      class="hidden md:col-span-2 md:row-span-full md:block md:place-self-end"
    />
    <img
      src="../../assets/signin/Teacher.svg"
      alt="No Certificate Boy Img Found"
      class="hidden md:place-self-end xl:col-span-2 xl:col-start-6 xl:row-span-full xl:block"
    />
    <form
      class="form row-span-full md:col-span-6 md:col-start-3 xl:col-span-3"
      @submit.prevent="handelSignup"
      autocomplete="off"
    >
      <section class="form-section">
        <label class="label" for="firstName">
          <span> First name <span class="text-danger-dark">*</span> </span>
        </label>
        <section class="input-section">
          <UserIcon class="input-icon" />
          <input
            class="input-box"
            type="text"
            pattern="[A-Za-z]+"
            title="Only Alphabets allowed"
            v-model.trim="formValues.first_name"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label" for="lastName">
          <span> Last name <span class="text-danger-dark">*</span> </span>
        </label>
        <section class="input-section">
          <UserIcon class="input-icon" />
          <input
            class="input-box"
            title="Only Alphabets allowed"
            type="text"
            pattern="[A-Za-z]+"
            v-model.trim="formValues.last_name"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label" for="email">
          <span> Email <span class="text-danger-dark">*</span> </span>
        </label>
        <section class="input-section">
          <MailIcon class="input-icon" />
          <input
            class="input-box"
            type="email"
            v-model.trim="formValues.email"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label" for="password">
          <span> password <span class="text-danger-dark">*</span> </span>
        </label>
        <div
          class="mx-auto rounded-lg px-2 text-xs font-semibold text-danger-dark lg:absolute lg:right-48 lg:bottom-6 lg:scale-75 lg:bg-white"
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
        <section class="input-section">
          <input
            class="input-box"
            :type="typePassword"
            v-model="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$"
          />
          <LockClosedIcon
            v-if="!isEyeOpen"
            @click="openEye"
            class="input-icon"
          ></LockClosedIcon>
          <LockOpenIcon
            class="input-icon"
            v-else
            @click="openEye"
          ></LockOpenIcon>
        </section>
      </section>
      <section class="form-section">
        <label class="label col-span-2">
          <span> Confirm Password <span class="text-danger-dark">*</span> </span>
        </label>
        <!-- <div class="input-box"> -->
        <section class="input-section">
          <input
            required
            class="input-box"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$"
            :type="typePassword"
            v-model="formValues.confirmPassword"
          />
          <!-- </div> -->
          <LockClosedIcon
            v-if="!isEyeOpen"
            @click="openEye"
            class="input-icon"
          ></LockClosedIcon>
          <LockOpenIcon
            class="input-icon"
            v-else
            @click="openEye"
          ></LockOpenIcon>
        </section>
      </section>
      <div class="button-section">
        <button class="bttn slow-effect" type="submit">Signin</button>
        <a
          v-show="!loader & isSubmitted & (error.length === 0)"
          class="bttn slow-effect text-center"
          :href="`mailto:${formValues.email}`"
          >Open Mail</a
        >
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
import notificationView from "../../components/notificationView.vue";
import {
  UserIcon,
  LockClosedIcon,
  LockOpenIcon,
  MailIcon,
} from "@heroicons/vue/solid";
export default {
  name: "SignIn",
  components: {
    LoaderView,
    UserIcon,
    LockClosedIcon,
    MailIcon,
    LockOpenIcon,
    notificationView,
  },
  data() {
    return {
      password: "",
      passwordErrorMsg: [
        "Should Contain mix of upper and lower case",
        "Should Contain at least one special char ",
        "Should have at least 6 characters",
      ],
      passwordPatternOk: false,
      error: [],
      formValues: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
      mailto: "mailto : ",
      loader: false,
      isSubmitted: false,
      notificationInterval: 4000,
      showError: false,
      typePassword: "password",
      isEyeOpen: false,
    };
  },
  // created() {
  //   if (sessionStorage.getItem("token")) {
  //     this.$router.push("/dashboard");
  //   } else {
  //     this.$router.push("/sign-in");
  //   }
  // },
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
    closeNotification() {
      this.showError = !this.showError;
    },
    openEye() {
      this.isEyeOpen = !this.isEyeOpen;
      if (this.isEyeOpen) {
        this.typePassword = "text";
      } else {
        this.typePassword = "password";
      }
    },
    async handelSignup() {
      this.error = [];
      this.loader = true;
      this.formValues.password = this.password;
      try {
        if (this.formValues.password === this.formValues.confirmPassword) {
          const response = await axios.post("/auth/users/", this.formValues);
          console.log(response);
        } else {
          throw {
            response: { data: ["Confirm Password Should Be Matched"] },
          };
        }
      } catch (e) {
        this.error = Object.values(e.response.data);
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, this.notificationInterval);
      }
      this.loader = false;
      this.isSubmitted = true;
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
