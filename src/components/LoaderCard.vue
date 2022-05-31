<template>
  <section class="h-4/6 w-3/6 overflow-clip rounded-xl bg-slate-200 shadow-md">
    <article
      class="h-1/2 w-full animate-pulse bg-slate-400 delay-200"
    ></article>
    <div
      class="my-2 mx-1 h-3 w-3/5 animate-pulse rounded-3xl bg-zinc-200 delay-300"
    ></div>
    <div
      class="my-2 mx-1 h-3 w-4/6 animate-pulse rounded-3xl bg-bgdark-shade delay-75"
    ></div>
    <div
      class="my-2 mx-1 h-3 w-4/5 animate-pulse rounded-3xl bg-gray-300 delay-100"
    ></div>
    <div class="flex flex-row items-center justify-evenly">
      <button
        class="h-10 w-2/4 animate-pulse rounded-xl bg-gray-500/60 align-middle"
      ></button>
    </div>
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
