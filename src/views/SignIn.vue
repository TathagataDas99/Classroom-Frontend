<template>
  <div>
    <form @submit.prevent="handelSignup">
      <div>
        <label for="firstName">First name</label>
        <input type="text" v-model.trim="formValues.first_name" />
      </div>
      <div>
        <label for="lastName">Last name</label>
        <input type="text" v-model.trim="formValues.last_name" />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" v-model.trim="formValues.email" />
      </div>
      <div>
        <label for="password">password</label>
        <input type="password" v-model="formValues.password" />
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
      await axios.post(
        "https://lms-classroom-api.herokuapp.com/auth/users/",
        this.formValues
      );
    },
  },
};
</script>
