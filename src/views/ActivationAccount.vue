<template>
  <div class="h-screen w-full">
    <!-- {{ uid }}
    {{ token }} -->
    <section class="flex h-full flex-col items-center justify-center">
      <button @click="handelSubmit" class="bttn">
        <span class="md:text-xl lg:text-2xl">Activate Your account</span>
      </button>
    </section>
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
