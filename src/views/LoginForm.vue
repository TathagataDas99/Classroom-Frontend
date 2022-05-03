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
          v-model="formValues.email"
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
    </form>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../components/LoaderView.vue";

export default {
  name: "LoginForm",
  components: {
    LoaderView,
  },
  created() {
    if (localStorage.getItem("token")) {
      this.$router.push("/dashboard");
    } else {
      this.$router.push("/log-in");
    }
  },
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
        console.log(response);
        localStorage.setItem("token", response.data.access);
        this.$router.push({ name: "DashBoard" });
      } catch (e) {
        this.error = e.response.data.detail;
      }
      this.loader = false;
    },
  },
};
</script>
