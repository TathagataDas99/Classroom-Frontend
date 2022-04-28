<template>
  <div
    class="flex h-screen w-screen flex-col items-center justify-evenly scrollbar-hide"
  >
    <nav class="flex flex-row items-center justify-evenly">
      <router-link
        class="m-1 rounded-3xl px-3 py-2 text-lg font-bold hover:bg-green-500 hover:text-white"
        :to="{ name: 'home' }"
        >Home</router-link
      >
      <router-link
        class="m-1 rounded-3xl px-3 py-2 text-lg font-bold hover:bg-green-500 hover:text-white"
        :to="{ name: 'about' }"
        >About</router-link
      >
      <router-link
        class="m-1 rounded-3xl px-3 py-2 text-lg font-bold hover:bg-green-500 hover:text-white"
        :to="{ name: 'singIn' }"
        >Sign In</router-link
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
