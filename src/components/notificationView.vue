<template>
  <Transition>
    <div class="flex flex-row justify-evenly">
      <div class="notification bg-danger-light">
        <p class="mx-1">
          {{ error }}
        </p>
        <XCircleIcon
          @click="$emit('close')"
          class="inline-block h-10 w-10 font-bold text-bglight-shade md:h-6 md:w-6"
        />
      </div>
    </div>
  </Transition>
</template>

<script>
import { XCircleIcon } from "@heroicons/vue/solid";
export default {
  props: ["error"],
  components: {
    XCircleIcon,
  },
  emits: ["close"],
};
</script>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
