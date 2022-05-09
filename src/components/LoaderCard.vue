<template>
  <section class="card mx-10 my-10">
    <div
      class="h-3/6 w-full animate-pulse rounded-md bg-slate-400/30 transition duration-300"
    ></div>
    <div
      class="h-3 w-3/5 animate-pulse self-start rounded-3xl bg-slate-300/30 transition duration-150"
    ></div>
    <div
      class="h-2 w-full animate-pulse self-start rounded-3xl bg-slate-300/30 transition duration-200"
    ></div>
    <div
      class="h-2 w-full animate-pulse self-start rounded-3xl bg-slate-400/30 transition duration-300"
    ></div>
    <div
      class="h-2 w-full animate-pulse self-start rounded-3xl bg-slate-300/30 transition duration-200"
    ></div>
    <div
      class="h-2 w-full animate-pulse self-start rounded-3xl bg-slate-400/30 transition duration-300"
    ></div>
  </section>
</template>

<script>
export default {
  name: "LoaderCard",
  // props: {
  //   text: {
  //     required: false,
  //     type: String,
  //     default: "Loading",
  //   },
  // },
};
</script>

<style lang="scss" scoped></style>
