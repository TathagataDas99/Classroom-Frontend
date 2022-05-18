<template>
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
  <div class="forgot-password-email-form">
    <div v-if="loader">
      <LoaderView />
    </div>
    <form class="form" @submit.prevent="handelSubmit">
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
      <!-- <div class="text-2xl font-bold text-pink-500" v-if="error">
        {{ error }}
      </div> -->
      <div class="button-section">
        <button type="submit" class="bttn">Submit</button>
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
import { MailIcon, XCircleIcon } from "@heroicons/vue/solid";

export default {
  name: "ForgotPassword",
  components: {
    MailIcon,
    LoaderView,
    XCircleIcon,
  },
  // created() {
  //   if (sessionStorage.getItem("token")) {
  //     this.$router.push("/dashboard");
  //   } else {
  //     this.$router.push("/forgot-password");
  //   }
  // },
  data() {
    return {
      formValues: {
        email: "",
      },
      error: "",
      loader: false,
      showError: false,
    };
  },
  methods: {
    closeNotification() {
      this.showError = !this.showError;
    },

    async handelSubmit() {
      this.loader = true;
      this.error = "";
      try {
        const response = await axios.post(
          "/auth/users/reset_password/",
          this.formValues
        );
        console.log(response);
      } catch (e) {
        this.error = e.response.data.detail;
      }
      this.loader = false;
      this.isSubmitted = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
