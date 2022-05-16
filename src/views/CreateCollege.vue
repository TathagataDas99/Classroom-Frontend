<template>
  {{ formValues }}
  <div>
    <form class="form accent-primary-dark" enctype="multipart/form-data">
      <div class="form-section">
        <label class="label">Name</label>
        <input
          class="input-box"
          type="text"
          v-model.trim.lazy="formValues.name"
        />
      </div>
      <div class="form-section">
        <label class="label">city</label>
        <input
          class="input-box"
          type="text"
          v-model.trim.lazy="formValues.city"
        />
      </div>
      <div class="form-section">
        <label class="label">city</label>
        <input
          class="input-box"
          type="text"
          v-model.trim.lazy="formValues.city"
        />
      </div>
      <div class="form-section">
        <label class="label">state</label>
        <input
          class="input-box"
          type="text"
          v-model.trim.lazy="formValues.state"
        />
      </div>
      <div class="form-section">
        <label class="label">address</label>
        <input
          class="input-box"
          type="text"
          v-model.trim.lazy="formValues.address"
        />
      </div>
      <div class="form-section">
        <label class="label">Teachers list</label>
        <input
          ref="file"
          @change="handleFileUpload"
          type="file"
          multiple
          accept=".xlsx, .pdf, .docs"
        />
        <div class="form-section">
          <label class="label">DBAS</label>
          <template v-for="i in count" :key="i">
            <input
              class="input-box"
              type="text"
              v-model.trim.lazy="formValues.allowed_dbs"
            />
          </template>
          <button @click="count++">+</button>
        </div>
      </div>
      <button class="bttn">Add</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      formValues: {
        name: "",
        city: "",
        state: "",
        address: "",
        allowed_teacher_list: null,
        allowed_dbas: [],
      },
    };
  },
  methods: {
    async handleFileUpload(event) {
      this.attached_file = event.target.files;
      console.log(this.attached_files);
    },
  },
};
</script>

<style lang="scss" scoped></style>
