<template>
  <div>
    <NavBar />
    <router-view class="relative" />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
};
</script>
