<template>
  <div class="modal" id="my-modal-1">
    <div class="modal-box">
      <h3 class="text-lg font-bold">File Format Should Be As Follow</h3>
      <table class="w-full table-auto">
        <tr>
          <td>File Types allowed</td>
          <td class="bg-warning-light text-center font-heading text-xl">
            .csv , .xlsx
          </td>
        </tr>
        <tr>
          <td>Header Name</td>
          <td class="bg-warning-light text-center font-heading text-xl">
            title
          </td>
        </tr>
        <tr>
          <td colspan="2">Example Given Below</td>
        </tr>
      </table>
      <table class="w-full table-auto">
        <tr
          class="border-2 border-gray-500 bg-sky-300 text-center font-heading text-lg"
        >
          <th>title</th>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td>Computer Science</td>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td>Math</td>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td>...</td>
        </tr>
      </table>
      <div class="modal-action">
        <a href="#" class="bttn text-center">Okay!</a>
      </div>
    </div>
  </div>
  <div class="modal" id="my-modal-2">
    <div class="modal-box">
      <h3 class="text-lg font-bold">File Format Should Be As Follow</h3>
      <table class="w-full table-auto">
        <tr>
          <td>File Types allowed</td>
          <td class="bg-warning-light text-center font-heading text-xl">
            .csv , .xlsx
          </td>
        </tr>
        <tr>
          <td>Header Name</td>
          <td class="bg-warning-light text-center font-heading text-xl">
            email
          </td>
        </tr>
        <tr>
          <td colspan="2">Example Given Below</td>
        </tr>
      </table>
      <table class="w-full table-auto">
        <tr
          class="border-2 border-gray-500 bg-sky-300 text-center font-heading text-lg"
        >
          <th>email</th>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td>teacher1@gmail.com</td>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td>teacher2@gmail.com</td>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td class="font-heading text-xl">...</td>
        </tr>
      </table>
      <div class="modal-action">
        <a href="#" class="bttn text-center">Okay!</a>
      </div>
    </div>
  </div>
  <div class="modal" id="my-modal-3">
    <div class="modal-box">
      <h3 class="text-lg font-bold">File Format Should Be As Follow</h3>
      <table class="w-full table-auto">
        <tr>
          <td>File Types allowed</td>
          <td class="bg-warning-light text-center font-heading text-xl">
            .csv , .xlsx
          </td>
        </tr>
        <tr>
          <td>Header Name</td>
          <td class="bg-warning-light text-center font-heading text-xl">
            email
          </td>
        </tr>
        <tr>
          <td colspan="2">Example Given Below</td>
        </tr>
      </table>
      <table class="w-full table-auto">
        <tr
          class="border-2 border-gray-500 bg-sky-300 text-center font-heading text-lg"
        >
          <th>email</th>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td>dba1@gmail.com</td>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td>dba2@gmail.com</td>
        </tr>
        <tr class="border-2 border-gray-500 text-center">
          <td class="font-heading text-xl">...</td>
        </tr>
      </table>
      <div class="modal-action">
        <a href="#" class="bttn text-center">Okay!</a>
      </div>
    </div>
  </div>
  <div v-if="error && showError">
    <template v-for="e in error" :key="e">
      <notificationView :error="e" @close="showError = false" />
    </template>
  </div>
  <div v-if="loader">
    <LoaderView />
  </div>
  <main class="college-create-view">
    <!-- {{ formValues }} -->
    <section class="college-form-info">
      <img
        class="college-form-icon h-full w-full"
        src="../assets/createcollege/cc_bg1.svg"
        alt=""
      />
    </section>
    <form
      class="form place-content-center accent-primary-dark lg:col-span-2"
      enctype="multipart/form-data"
      @submit.prevent="createCollege"
    >
      <section class="form-section">
        <label class="label">
          <span> Name <span class="text-danger-dark">*</span> </span>
        </label>
        <section class="input-section">
          <AcademicCapIcon class="input-icon" />
          <input
            required
            class="input-box"
            type="text"
            pattern="[A-Za-z\s]+"
            title="Only Alphabets allowed"
            placeholder="college name"
            v-model.trim.lazy="formValues.name"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label">
          <span> City <span class="text-danger-dark">*</span> </span>
        </label>
        <section class="input-section">
          <LocationMarkerIcon class="input-icon" />
          <input
            required
            class="input-box"
            type="text"
            pattern="[A-Za-z\s]+"
            title="Only Alphabets or space allowed"
            placeholder="college city"
            v-model.trim.lazy="formValues.city"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label">
          <span> state <span class="text-danger-dark">*</span> </span>
        </label>
        <section class="input-section">
          <LocationMarkerIcon class="input-icon" />
          <input
            required
            class="input-box"
            type="text"
            pattern="[A-Za-z\s]+"
            title="Only Alphabets or space allowed"
            placeholder="college state"
            v-model.trim.lazy="formValues.state"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label">
          <span> address <span class="text-danger-dark">*</span> </span>
        </label>
        <section class="input-section">
          <LocationMarkerIcon class="input-icon" />
          <input
            required
            class="input-box"
            type="text"
            placeholder="college address"
            v-model.trim.lazy="formValues.address"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label col-span-2">
          <span> Owner Email <span class="text-danger-dark">*</span> </span>
        </label>
        <section class="input-section">
          <MailIcon class="input-icon" />
          <input
            required
            type="email"
            class="input-box"
            v-model.trim.lazy="formValues.owner_email_id"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label col-span-2">
          <span> Stream list <span class="text-danger-dark">*</span> </span>
          <a href="#my-modal-1">
            <InformationCircleIcon class="w-7 text-info-dark" />
          </a>
        </label>
        <section class="input-section-file">
          <input
            required
            class="input-file"
            ref="file_stream"
            @change="handleStreamFileUpload"
            type="file"
            title="upload the full stream list of the college"
            accept=".xlsx, .csv"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label col-span-2">
          <span> Teachers list <span class="text-danger-dark">*</span> </span>
          <a href="#my-modal-2">
            <InformationCircleIcon class="w-7 text-info-dark" />
          </a>
        </label>
        <section class="input-section-file">
          <input
            required
            class="input-file"
            ref="file_teacher"
            @change="handleTeacherFileUpload"
            type="file"
            title="upload the full teacher list of the college"
            accept=".xlsx, .csv"
          />
        </section>
      </section>
      <section class="form-section">
        <label class="label">
          <span> DBA list <span class="text-danger-dark">*</span> </span>
          <a href="#my-modal-3">
            <InformationCircleIcon class="w-7 text-info-dark" />
          </a>
        </label>
        <section class="input-section-file">
          <input
            required
            class="input-file"
            ref="file_dba"
            @change="handleDBAFileUpload"
            type="file"
            title="upload the full dba list of the college"
            accept=".xlsx, .csv"
          />
        </section>
      </section>

      <section class="button-section">
        <button class="bttn">Create</button>
      </section>
    </form>
  </main>
</template>

<script>
import axios from "axios";
import LoaderView from "../components/LoaderView.vue";
import notificationView from "../components/notificationView.vue";
import {
  AcademicCapIcon,
  LocationMarkerIcon,
  MailIcon,
  InformationCircleIcon,
} from "@heroicons/vue/solid";

export default {
  components: {
    LoaderView,
    AcademicCapIcon,
    LocationMarkerIcon,
    InformationCircleIcon,
    MailIcon,
    notificationView,
  },
  data() {
    return {
      count: 0,
      tempEmail: "",
      loader: false,
      error: [],
      notificationInterval: 8000,
      showError: false,
      formValues: {
        name: "",
        city: "",
        state: "",
        address: "",
        owner_email_id: "",
        stream_list: null,
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
    handleStreamFileUpload(event) {
      this.formValues.stream_list = event.target.files[0];
      console.log(this.formValues.stream_list);
    },
    handleTeacherFileUpload(event) {
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
        formData.append("owner_email_id", this.formValues.owner_email_id);
        formData.append("stream_list", this.formValues.stream_list);
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
                this.formValues.stream_list,
                this.formValues.allowed_teacher_list,
                this.formValues.allowed_dba_list,
              ],
              // boundary: "allowed_teacher_list",
              Filename: [
                this.formValues.stream_list.name,
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
        this.error = Object.values(e.response.data);
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, this.notificationInterval);
      }
      this.loader = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
