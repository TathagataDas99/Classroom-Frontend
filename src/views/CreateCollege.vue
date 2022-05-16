<template>
  {{ formValues }}
  {{ tags }}
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
      <div class="grid grid-flow-col grid-cols-7">
        <label class="label col-span-3">Teachers list</label>
        <input
          class="col-span-4 block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
          ref="file"
          @change="handleFileUpload"
          type="file"
          multiple
          accept=".xlsx, .pdf, .docs"
        />
        <!-- <div class="form-section">
          <label class="label">DBAS</label>
          <template v-for="i in count" :key="i">
            <input
              class="input-box"
              type="text"
              v-model.trim.lazy="formValues.allowed_dbs"
            />
          </template>
          <button @click="count++">+</button>
        </div> -->
      </div>
      <div class="form-section">
        <input
          type="email"
          v-model="tempEmail"
          class="input-box"
          placeholder="dba@email.com"
          required
        />
        <PlusCircleIcon
          @click="addEmail"
          class="h-10 w-10 self-center font-semibold text-primary-dark"
        />
      </div>
      <!-- <div class="form-sections">
        <VueTagsInput
          class="w-full"
          v-model="tag"
          :tags="tags"
          :validation="validation"
          @tags-changed="(newTags) => (tags = newTags)"
        />
      </div> -->
      <div class="form-section">
        <section
          tabindex="0"
          class="mx-10 h-4/5 w-full justify-evenly rounded-md border border-base-300 bg-base-100 shadow-md"
        >
          <ul class="grid grid-flow-row grid-cols-3">
            <li
              v-for="(dba_email, index) in formValues.allowed_dbas"
              :key="dba_email.email"
              class="badge badge-outline badge-lg badge-info col-span-1 row-span-1 m-1 px-3"
            >
              {{ dba_email.email }}
              <XCircleIcon
                class="mx-1 inline-block h-5 w-5 self-center"
                @click="removeMail(index)"
              />
            </li>
          </ul>
        </section>
      </div>
      <button class="bttn">Add</button>
    </form>
  </div>
</template>

<script>
import { PlusCircleIcon, XCircleIcon } from "@heroicons/vue/outline";

export default {
  components: {
    // VueTagsInput,
    PlusCircleIcon,
    XCircleIcon,
  },
  computed: {
    // validEmail(email) {
    //   let re =
    //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //   return re.test(email);
    // },
  },
  data() {
    return {
      count: 0,
      tempEmail: "",
      tag: "",
      tags: [],
      validation: [
        {
          classes: "font-bold text-danger-dark",
          rule: (tags) => tags.length < 1,
        },
        {
          classes: "text-danger-dark",
          rule: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/,
        },
      ],
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
    validEmail(email) {
      let re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    addEmail() {
      if (this.validEmail(this.tempEmail)) {
        this.formValues.allowed_dbas.push({ email: this.tempEmail });
        this.tempEmail = "";
      } else {
        console.log("email not valid");
      }
    },
    removeMail(index) {
      this.formValues.allowed_dbas.splice(index, 1);
    },
    handleFileUpload(event) {
      this.attached_file = event.target.files;
      console.log(this.attached_files);
    },
  },
};
</script>

<style lang="scss" scoped></style>
