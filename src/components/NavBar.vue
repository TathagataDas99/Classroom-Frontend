<template>
  <div v-if="$store.state.user" class="flex flex-col">
    <nav class="flex flex-row flex-wrap items-center justify-evenly shadow-lg">
      <router-link
        @click="handelLogout"
        class="slow-effect link"
        :to="{ name: 'Login' }"
        >Log-out</router-link
      >
    </nav>
    <router-view />
  </div>
  <div v-else class="flex flex-col">
    <nav class="flex flex-row flex-wrap items-center justify-evenly shadow-lg">
      <template v-for="route in routes" :key="route.name">
        <router-link class="slow-effect link" :to="route">{{
          route.name
        }}</router-link>
      </template>
    </nav>
    <router-view />
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
    },
  },
};
</script>
