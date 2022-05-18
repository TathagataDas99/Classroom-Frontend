<template>
  <div v-if="loader">
    <LoaderView />
  </div>
  <main class="college-create-view">
    <!-- {{ formValues }} -->
    <section class="college-form-info">
      <div class="college-form-icon">
        <span
          class="mx-auto h-2/3 w-2/3 rounded-full bg-info-dark text-center align-middle text-xl font-extrabold ordinal text-bglight-shade"
          >1st</span
        >
      </div>
      <article class="college-form-text col-start-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione sit et
        voluptates cupiditate consequatur, laudantium at tempore suscipit
        facilis consectetur neque quidem, error obcaecati aspernatur delectus
        unde officiis. Aliquam, corporis!
      </article>
      <img src="" alt="College details" />
      <article></article>
      <img src="" alt="College details" />
      <article></article>
    </section>
    <form
      class="form accent-primary-dark"
      enctype="multipart/form-data"
      @submit.prevent="createCollege"
    >
      <section class="form-section">
        <label class="label">Name</label>
        <section class="input-section">
          <AcademicCapIcon class="input-icon" />
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.name"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label">city</label>
        <section class="input-section">
          <LocationMarkerIcon class="input-icon" />
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.city"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label">state</label>
        <section class="input-section">
          <LocationMarkerIcon class="input-icon" />
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.state"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label">address</label>
        <section class="input-section">
          <LocationMarkerIcon class="input-icon" />
          <input
            class="input-box"
            type="text"
            v-model.trim.lazy="formValues.address"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label">Teachers list</label>
        <section class="input-section-file">
          <input
            class="input-file"
            ref="file_teacher"
            @change="handleFileUpload"
            type="file"
            accept=".xlsx, .csv"
          />
        </section>
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
      </section>
      <section class="form-section">
        <label class="label">DBA list</label>
        <section class="input-section-file">
          <input
            class="input-file"
            ref="file_dba"
            @change="handleDBAFileUpload"
            type="file"
            accept=".xlsx, .csv"
          />
        </section>
      </section>
      <!-- <div class="form-section">
        <input
          type="email"
          v-model="tempEmail"
          class="input-box"
          placeholder="dba@email.com"
        />
        <PlusCircleIcon
          @click="addEmail"
          class="h-10 w-10 self-center font-semibold text-primary-dark"
        />
      </div> -->
      <!-- <div class="form-sections">
        <VueTagsInput
          class="w-full"
          v-model="tag"
          :tags="tags"
          :validation="validation"
          @tags-changed="(newTags) => (tags = newTags)"
        />
      </div> -->
      <!-- <div class="form-section">
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
      </div> -->
      <section class="button-section">
        <button class="bttn">Create</button>
      </section>
    </form>
  </main>
</template>

<script>
// import { PlusCircleIcon, XCircleIcon } from "@heroicons/vue/outline";
import axios from "axios";
import LoaderView from "../components/LoaderView.vue";
import { AcademicCapIcon, LocationMarkerIcon } from "@heroicons/vue/solid";

export default {
  // components: {
  //   // VueTagsInput,
  //   // PlusCircleIcon,
  //   // XCircleIcon,
  // },
  components: {
    LoaderView,
    // PencilIcon,
    AcademicCapIcon,
    LocationMarkerIcon,
  },
  data() {
    return {
      count: 0,
      tempEmail: "",
      loader: false,
      formValues: {
        name: "",
        city: "",
        state: "",
        address: "",
        allowed_teacher_list: null,
        allowed_dba_list: null,
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
      this.formValues.allowed_teacher_list = event.target.files[0];
      console.log(this.formValues.allowed_teacher_list);
    },
    handleDBAFileUpload(event) {
      this.formValues.allowed_dba_list = event.target.files[0];
      console.log(this.formValues.allowed_dba_list);
    },
    async createCollege() {
      this.loader = true;
      try {
        // if (this.formValues.allowed_dbas.length >= 1) {
        let formData = new FormData();
        formData.append("name", this.formValues.name);
        formData.append("city", this.formValues.city);
        formData.append("state", this.formValues.state);
        formData.append("address", this.formValues.address);
        formData.append(
          "allowed_teacher_list",
          this.formValues.allowed_teacher_list
        );
        formData.append("allowed_dba_list", this.formValues.allowed_dba_list);
        // formData.append("allowed_dbas", this.formValues.allowed_dbas);
        const res = await axios.post(
          "/classroom-app/college-create/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
              "Content-Disposition": [
                this.formValues.allowed_teacher_list,
                this.formValues.allowed_dba_list,
              ],
              // boundary: "allowed_teacher_list",
              Filename: [
                this.formValues.allowed_teacher_list.name,
                this.formValues.allowed_dba_list.name,
              ],
            },
          }
        );
        this.$router.push({ name: "Signin" });
        console.log(res);
        // }
      } catch (e) {
        console.log(e);
      }
      this.loader = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
