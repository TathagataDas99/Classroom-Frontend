<template>
  <div class="flex h-screen flex-col items-center justify-evenly">
    <form class="form" @submit.prevent="handelSignup">
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
      formValues: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async handelSignup() {
      await axios.post("/auth/users/", this.formValues);
    },
  },
};
</script>
