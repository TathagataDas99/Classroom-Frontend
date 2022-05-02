<template>
  <div class="flex h-screen flex-col items-center justify-evenly">
    <form class="form" @submit.prevent="handelSignup" autocomplete="off">
      <div class="form-section">
        <label class="label" for="firstName">First name</label>
        <input
          class="input-box"
          type="text"
          v-model.trim="formValues.first_name"
        />
      </div>
      <div class="form-section">
        <label class="label" for="lastName">Last name</label>
        <input
          class="input-box"
          type="text"
          v-model.trim="formValues.last_name"
        />
      </div>
      <div class="form-section">
        <label class="label" for="email"
          ><span class="md:px-1 lg:px-2">Email</span></label
        >
        <input class="input-box" type="email" v-model.trim="formValues.email" />
      </div>
      <div class="form-section">
        <label class="label" for="password">password</label>
        <input
          class="input-box"
          type="password"
          v-model="formValues.password"
        />
      </div>
      <div class="text-2xl font-bold text-pink-500" v-if="error">
        <div v-for="e in error" :key="e">
          {{ e }}
        </div>
      </div>
      <button class="bttn slow-effect" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignIn",
  data() {
    return {
      error: [],
      formValues: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
    };
  },
  created() {
    if (localStorage.getItem("token")) {
      this.$router.push("/dashboard");
    } else {
      this.$router.push("/sign-in");
    }
  },
  methods: {
    async handelSignup() {
      try {
        await axios.post("/auth/users/", this.formValues);
      } catch (e) {
        this.error = Object.values(e.response.data)[0];
      }
    },
  },
};
</script>
