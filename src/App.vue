<template>
  <div class="flex flex-col">
    <nav class="flex flex-row flex-wrap items-center justify-evenly shadow-lg">
      <router-link class="slow-effect link" :to="{ name: 'home' }"
        >Home</router-link
      >
      <router-link class="slow-effect link" :to="{ name: 'signIn' }"
        >Sign In</router-link
      >
      <router-link class="slow-effect link" :to="{ name: 'about' }"
        >About</router-link
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
