<template>
  <div class="flex flex-col">
    <nav class="flex flex-row flex-wrap items-center justify-evenly shadow-lg">
      <router-link class="slow-effect link" :to="{ name: 'HomeView' }"
        >Home</router-link
      >
      <router-link class="slow-effect link" :to="{ name: 'SignIn' }"
        >Sign In</router-link
      >
      <router-link class="slow-effect link" :to="{ name: 'LoginForm' }"
        >Log In</router-link
      >
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
