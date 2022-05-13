<template>
  <div class="flex h-screen flex-col items-center justify-evenly">
    <div v-if="loader">
      <LoaderView />
    </div>
    <form class="form" @submit.prevent="handelSubmit">
      <div class="form-section">
        <label class="label">Email</label>
        <input
          required
          type="email"
          class="input-box"
          v-model="formValues.email"
        />
      </div>
      <div class="text-2xl font-bold text-pink-500" v-if="error">
        {{ error }}
      </div>
      <button type="submit" class="bttn">Submit</button>
      <a
        v-show="!loader & isSubmitted & (error.length === 0)"
        class="bttn slow-effect text-center"
        :href="`mailto:${formValues.email}`"
        >Open Mail</a
      >
    </form>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";

export default {
  name: "ForgotPassword",
  components: {
    LoaderView,
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
    };
  },
  methods: {
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
