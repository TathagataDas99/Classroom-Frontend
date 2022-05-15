<template>
  <input type="file" @change="onChange($event)" />
</template>

<script>
export default {
  props: ["modelValue"],
  methods: {
    onChange(event) {
      this.$emit("update:modelValue", event.target.files[0]);
    },
  },
};
</script>
