<template>
  <div v-if="loader">
    <LoaderView />
  </div>
  <Transition>
    <div class="flex flex-row justify-evenly" v-if="error && showError">
      <div class="notification bg-danger-light">
        <p class="mx-1 block">
          {{ error[0] }}
        </p>
        <XCircleIcon
          @click="closeNotification"
          class="inline-block h-10 w-10 font-bold text-bglight-shade md:h-6 md:w-6"
        />
      </div>
    </div>
  </Transition>
  <div
    class="grid h-screen grid-cols-1 grid-rows-5 place-content-center bg-gradient-to-br from-sky-200 to-green-200 align-middle"
  >
    <form
      class="form row-span-3 row-start-2 place-self-center self-center"
      @submit.prevent="handelSubmit"
    >
      <div class="form-section">
        <label class="label">Password</label>
        <section class="input-section">
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
          <input
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$"
            :type="typePassword"
            class="input-box"
            v-model="formValues.password"
          />
        </section>
      </div>
      <section class="form-section">
        <label class="label col-span-2">Confirm Password</label>
        <!-- <div class="input-box"> -->
        <section class="input-section">
          <input
            required
            :type="typePassword"
            class="input-box"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,15}$"
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
      <!-- <div class="text-2xl font-bold text-pink-500" v-if="error">
        <div v-for="e in error" :key="e">
          {{ e }}
        </div>
      </div> -->
      <section class="button-section">
        <button type="submit" class="bttn">Submit</button>
      </section>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
import {
  LockOpenIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/vue/outline";

export default {
  name: "ActivationAccount",
  props: ["uid", "token"],
  components: {
    LoaderView,
    XCircleIcon,
    LockOpenIcon,
    LockClosedIcon,
  },
  // created() {
  //   if (sessionStorage.getItem("token")) {
  //     this.$router.push("/dashboard");
  //   } else {
  //     this.$router.push({ name: "ResetPassword" });
  //   }
  // },
  data() {
    return {
      loader: false,
      error: [],
      showError: false,
      errorShowInterval: 2000,
      formValues: {
        password: "",
        confirmPassword: "",
      },
      typePassword: "password",
      isEyeOpen: false,
    };
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
    async handelSubmit() {
      this.loader = true;
      this.error = [];
      if (this.formValues.password === this.formValues.confirmPassword) {
        try {
          await axios.post("/auth/users/reset_password_confirm/", {
            uid: this.uid,
            token: this.token,
            new_password: this.formValues.password,
          });
          this.$router.push("/log-in");
        } catch (e) {
          console.log(e);
          this.showError = true;
          this.error = Object.values(e.response.data)[0];
          setTimeout(() => {
            this.showError = false;
          }, this.errorShowInterval);
        }
      } else {
        this.showError = true;
        this.error[0] = "Password and Confirm Password should be same.";
        setTimeout(() => {
          this.showError = false;
        }, this.errorShowInterval);
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
