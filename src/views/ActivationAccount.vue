<template>
  <div>
    {{ uid }}
    {{ token }}
    <button @click="handelSubmit">Activate Your account</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ActivationAccount",
  props: ["uid", "token"],
  methods: {
    async handelSubmit() {
      await axios.post(
        "https://lms-classroom-api.herokuapp.com/auth/users/activation/",
        {
          uid: this.uid,
          token: this.token,
        }
      );
    },
  },
};
</script>
