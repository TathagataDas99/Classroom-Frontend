<template>
  <div>
    <form @submit.prevent="handelSingup">
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
      <button
        class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900"
        type="submit"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
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
    async handelSingup() {
      await axios.post(
        "https://lms-classroom-api.herokuapp.com/auth/users/",
        this.formValues
      );
    },
  },
};
</script>
