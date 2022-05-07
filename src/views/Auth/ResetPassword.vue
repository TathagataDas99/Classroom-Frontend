<template>
  <div v-if="loader">
    <LoaderView />
  </div>
  <div class="flex h-screen flex-col items-center justify-evenly">
    <form class="form" @submit.prevent="handelSubmit">
      <div class="form-section">
        <label class="label">Password</label>
        <input
          required
          :type="typePassword"
          class="input-box"
          v-model="formValues.password"
        />
      </div>
      <div class="form-section">
        <label class="label">Confirm Password</label>
        <!-- <div class="input-box"> -->
        <input
          required
          :type="typePassword"
          class="input-box"
          v-model="formValues.confirmPassword"
        />
        <!-- </div> -->
        <EyeOffIcon
          v-if="!isEyeOpen"
          @click="openEye"
          class="h-5 w-5 self-center text-primary-dark"
        ></EyeOffIcon>
        <EyeIcon
          class="h-5 w-5 self-center text-danger-dark"
          v-else
          @click="openEye"
        ></EyeIcon>
      </div>
      <div class="text-2xl font-bold text-pink-500" v-if="error">
        <div v-for="e in error" :key="e">
          {{ e }}
        </div>
      </div>
      <button type="submit" class="bttn">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
import { EyeIcon, EyeOffIcon } from "@heroicons/vue/outline";

export default {
  name: "ActivationAccount",
  props: ["uid", "token"],
  components: {
    LoaderView,
    EyeIcon,
    EyeOffIcon,
  },
  // created() {
  //   if (localStorage.getItem("token")) {
  //     this.$router.push("/dashboard");
  //   } else {
  //     this.$router.push({ name: "ResetPassword" });
  //   }
  // },
  data() {
    return {
      loader: false,
      error: [],
      formValues: {
        password: "",
        confirmPassword: "",
      },
      typePassword: "password",
      isEyeOpen: false,
    };
  },
  methods: {
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
          this.error = Object.values(e.response.data)[0];
        }
      } else {
        this.error[0] = "Password and Confirm Password should be same.";
      }
      this.loader = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
