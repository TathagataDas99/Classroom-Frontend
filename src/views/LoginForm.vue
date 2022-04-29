<template>
  <div class="flex h-screen flex-col items-center justify-evenly">
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
      <button type="submit" class="bttn">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginForm",
  data() {
    return {
      formValues: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async handelLogin() {
      const response = await axios.post("/login/jwt/create/", this.formValues);
      console.log(response);
      localStorage.setItem("token", response.data.access);
      this.$router.push({ name: "HomeView" });
    },
  },
};
</script>
