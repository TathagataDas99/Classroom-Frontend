<template>
  <div v-if="loader">
    <LoaderView />
  </div>
  <div class="h-screen w-full">
    <!-- {{ uid }}
    {{ token }} -->
    <section class="flex h-full flex-col items-center justify-center">
      <button @click="handelSubmit" class="bttn">
        <span class="md:text-xl lg:text-2xl">Activate Your account</span>
      </button>
      <div v-if="error">
        <div
          class="text-2xl font-bold text-pink-500"
          v-for="e in error"
          :key="e"
        >
          {{ e }}
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";

export default {
  name: "ActivationAccount",
  props: ["uid", "token"],
  components: {
    LoaderView,
  },
  // created() {
  //   if (localStorage.getItem("token")) {
  //     this.$router.push("/dashboard");
  //   } else {
  //     this.$router.push({ name: "ActivationAccount" });
  //   }
  // },
  data() {
    return {
      loader: false,
      error: [],
    };
  },
  methods: {
    async handelSubmit() {
      this.error = [];
      this.loader = true;
      try {
        await axios.post("/auth/users/activation/", {
          uid: this.uid,
          token: this.token,
        });
        this.$router.push("/log-in");
      } catch (e) {
        this.error = Object.values(e.response.data)[0];
      }
      this.loader = false;
    },
  },
};
</script>
