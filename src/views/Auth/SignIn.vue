<template>
  <div class="flex h-screen flex-col items-center justify-evenly">
    <div v-if="loader">
      <LoaderView />
    </div>
    <Transition>
      <div class="flex flex-row justify-evenly" v-if="error && showError">
        <div class="notification bg-danger-light" v-for="e in error" :key="e">
          <p class="mx-1">
            {{ e }}
          </p>
          <XCircleIcon
            @click="closeNotification"
            class="inline-block h-10 w-10 font-bold text-bglight-shade md:h-6 md:w-6"
          />
        </div>
      </div>
    </Transition>
    <form class="form" @submit.prevent="handelSignup" autocomplete="off">
      <section class="form-section">
        <label class="label" for="firstName">First name</label>
        <section class="input-section">
          <UserIcon class="input-icon" />
          <input
            class="input-box"
            type="text"
            v-model.trim="formValues.first_name"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label" for="lastName">Last name</label>
        <section class="input-section">
          <UserIcon class="input-icon" />
          <input
            class="input-box"
            type="text"
            v-model.trim="formValues.last_name"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label" for="email">Email</label>
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
        <label class="label" for="password">password</label>
        <section class="input-section">
          <LockClosedIcon class="input-icon" />
          <input
            class="input-box"
            type="password"
            v-model="formValues.password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$"
          />
        </section>
      </section>
      <!-- <div class="text-2xl font-bold text-pink-500" v-if="error">
        <div v-for="e in error" :key="e">
          {{ e }}
        </div>
      </div> -->
      <div class="button-section">
        <button class="bttn slow-effect" type="submit">Signin</button>
        <a
          v-show="!loader & isSubmitted & (error.length === 0)"
          class="bttn slow-effect"
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
import {
  UserIcon,
  LockClosedIcon,
  MailIcon,
  XCircleIcon,
} from "@heroicons/vue/solid";
export default {
  name: "SignIn",
  components: {
    LoaderView,
    UserIcon,
    LockClosedIcon,
    MailIcon,
    XCircleIcon,
  },
  data() {
    return {
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
      notificationInterval: 2000,
      showError: false,
    };
  },
  // created() {
  //   if (sessionStorage.getItem("token")) {
  //     this.$router.push("/dashboard");
  //   } else {
  //     this.$router.push("/sign-in");
  //   }
  // },
  methods: {
    closeNotification() {
      this.showError = !this.showError;
    },
    async handelSignup() {
      this.error = [];
      this.loader = true;
      try {
        const response = await axios.post("/auth/users/", this.formValues);
        console.log(response);
      } catch (e) {
        this.error = Object.values(e.response.data)[0];
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
