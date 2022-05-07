<template>
  <div v-if="$store.state.isAuth" class="sticky top-0 z-20 flex flex-col">
    <nav class="navbar">
      <router-link
        @click="handelLogout"
        class="slow-effect link-danger"
        :to="{ name: 'Login' }"
        >Logout</router-link
      >
    </nav>
    <!-- <router-view /> -->
  </div>
  <div v-else class="sticky top-0 z-20 flex flex-col">
    <nav class="navbar">
      <template v-for="route in routes" :key="route.name">
        <router-link class="slow-effect link" :to="route">{{
          route.name
        }}</router-link>
      </template>
    </nav>
    <!-- <router-view /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [{ name: "Home" }, { name: "Signin" }, { name: "Login" }],
    };
  },
  methods: {
    handelLogout() {
      localStorage.removeItem("token");
      this.$store.state.user = null;
      localStorage.removeItem("Auth");
      this.$store.state.isAuth = false;
      this.$router.replace({ name: "Home" });
    },
  },
};
</script>
