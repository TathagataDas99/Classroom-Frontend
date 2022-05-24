<template>
  <section
    class="relative grid h-3/5 w-3/5 grid-flow-row grid-cols-9 grid-rows-6 place-items-center place-self-center overflow-clip rounded-lg bg-slate-400 backdrop-blur-md backdrop-filter"
  >
    <img
      class="col-span-7 col-start-2 row-span-4 row-start-2 animate-pulse rounded-lg bg-slate-500"
      src="../assets/components/card_img_placeholder_1.svg"
    />
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
