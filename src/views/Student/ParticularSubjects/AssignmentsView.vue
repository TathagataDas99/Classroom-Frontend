<template>
  <main @click="openedNotes = -1" class="w-screen">
    <div v-if="loader">
      <LoaderView />
    </div>
    <!-- {{ assignments }} -->
    <section class="mt-5">
      <div
        :tabindex="index"
        class="collapse my-3 mx-5 md:mx-20"
        v-for="(assignment, index) in assignments"
        :key="assignment.id"
        :class="{ 'collapse-open': openedNotes === index }"
        @focusin="openedNotes = index"
      >
        <div class="collapse-title font-heading text-xl font-medium">
          <span class="text-primary-dark">{{ index + 1 }} .</span>
          {{ assignment.title }}
        </div>
        <section class="collapse-content w-full">
          <table class="my-2 w-full table-auto">
            <tr class="border-t-2 border-gray-600">
              <th class="font-heading text-xl font-semibold">Description</th>
              <th class="font-heading text-xl font-semibold">Marks</th>
              <th class="font-heading text-xl font-semibold">Due Date</th>
              <th class="font-heading text-xl font-semibold">Due Time</th>
            </tr>
            <tr class="text-center">
              <td>
                <p class="coloumn-1">
                  {{ assignment.description }}
                </p>
              </td>
              <td>
                <p class="coloumn-1 px-5 text-lg font-bold text-primary-dark">
                  {{ assignment.alloted_marks }}
                </p>
              </td>
              <td>
                <p class="coloumn-1 px-5 text-xl font-bold text-danger-dark">
                  {{ assignment.due_date }}
                </p>
              </td>
              <td>
                <p class="coloumn-1 px-5 text-xl font-bold text-danger-dark">
                  {{ assignment.due_time }}
                </p>
              </td>
            </tr>
          </table>
          <table class="my-2 w-full table-auto border-t-2 border-gray-600">
            <tr class="border-t-2 border-gray-600">
              <th class="font-heading text-xl font-semibold">Assignment PDF</th>
              <th class="font-heading text-xl font-semibold">Created At</th>
            </tr>
            <tr class="text-center">
              <td class="text-center">
                <a
                  class="slow-effect flex-1 items-center justify-evenly hover:text-primary-light"
                  :href="assignment.attached_pdf"
                >
                  <DocumentDownloadIcon
                    class="slow-effect mx-auto w-16 content-center align-middle text-primary-dark hover:scale-110 hover:text-primary-light"
                  />
                  <span class="py-2 px-3 text-center text-sm font-bold"
                    >PDF</span
                  >
                </a>
              </td>
              <td>
                <span class="font-bold">{{
                  assignment.created_at.split("T")[0]
                }}</span>
              </td>
            </tr>
          </table>

          <table class="w-full table-auto rounded-xl">
            <tr
              class="border-t-2 border-gray-600"
              v-if="assignment.submittedValue.length === 0"
            >
              <th colspan="2" class="font-heading text-xl font-semibold">
                Submit Assignment
              </th>
            </tr>
            <tr
              v-if="assignment.submittedValue.length !== 0"
              class="rounded-xl bg-yellow-200/80 text-center"
            >
              <!-- <td class="label">Submitted File:</td> -->
              <td class="text-center font-heading text-2xl">
                Submitted Solution
              </td>
              <td
                class="slow-effect flex flex-col items-center justify-evenly rounded-lg px-10 py-4"
              >
                <DocumentTextIcon
                  class="slow-effect group w-16 text-info-dark hover:scale-125"
                />
                <span class="group:hover:scale-125 uppercase text-info-dark">
                  pdf
                </span>
              </td>
            </tr>
            <tr v-if="assignment.submittedValue.length === 0">
              <!-- <td class="label">submit your assignment</td> -->
              <td colspan="2">
                <form
                  class="form"
                  enctype="multipart/form-data"
                  @submit.prevent="addAssignment(assignment.id, index)"
                >
                  <section class="input-section-file">
                    <input
                      title="1 PDF only, Max Size: 5 MB"
                      class="input-file"
                      ref="file"
                      @change="handleFileUpload"
                      type="file"
                      accept="application/pdf"
                    />
                  </section>
                  <section class="button-section">
                    <button class="bttn col-span-2">upload</button>
                  </section>
                </form>
              </td>
            </tr>
            <tr
              v-else
              class="mb-4 rounded-lg border-2 border-primary-dark py-10 px-2 text-center shadow-lg"
            >
              <!-- <td class="py-10 font-heading text-xl font-bold">Result :</td> -->
              <td
                colspan="2"
                v-if="!assignment.submittedValue[0].has_scored"
                class="py-10 font-heading text-xl font-bold text-danger-dark"
              >
                Result Not Yet Published
              </td>
              <td
                v-if="assignment.submittedValue[0].has_scored"
                class="slow-effect my-2 rounded-xl py-7 font-heading text-4xl font-bold hover:bg-yellow-100"
              >
                Score achieved :
                <span class="text-primary-dark">{{
                  assignment.submittedValue[0].score
                }}</span>
              </td>
              <td
                v-if="assignment.submittedValue[0].has_scored"
                class="py-10 font-heading text-xl font-bold text-info-dark"
              >
                Remarks : {{ assignment.submittedValue[0].remarks }}
              </td>
            </tr>
          </table>
        </section>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import LoaderView from "../../../components/LoaderView.vue";
import { mapGetters } from "vuex";
import { DocumentDownloadIcon, DocumentTextIcon } from "@heroicons/vue/solid";
export default {
  props: ["subject_slug", "no"],
  data() {
    return {
      loader: false,
      assignments: [],
      id: "",
      isActive: 1,
      // isDownload: true,
      openedNotes: -1,
      // formValues: [],
      formValues: {
        submitted_file: null,
      },
      submissions: [],
    };
  },
  components: {
    LoaderView,
    DocumentDownloadIcon,
    DocumentTextIcon,
  },
  computed: {
    ...mapGetters(["userType", "userProfile", "semCards"]),
  },
  async created() {
    this.loader = true;
    for (let semCard of this.semCards) {
      if (`${semCard.sem_no}` === this.no) {
        this.id = semCard.id;
      }
    }
    try {
      const assignmentsResponse = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}/assignment/`
      );
      this.assignments = assignmentsResponse.data;
      let count = 0;
      for (let i of this.assignments) {
        const res = await axios.get(
          `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}/assignment/${i.id}/submission/`,
          {
            headers: {
              Authorization: "JWT " + sessionStorage.getItem("token"),
            },
          }
        );
        this.assignments[count++]["submittedValue"] = res.data;
        console.log(res);
      }
      // console.log(assignmentsResponse);
      // console.log(this.subject_slug, this.id, this.userProfile.classroom.slug);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    activeTab(no) {
      this.isActive = no;
    },
    async handleFileUpload(event) {
      this.formValues.submitted_file = event.target.files[0];
    },
    async addAssignment(id) {
      //TODO: Convert to FormData
      try {
        console.log("the uploaded file -> ");
        console.log(this.formValues.submitted_file);
        console.log("------------ uploaded file ------------- ");
        const FormDataValues = new FormData();
        FormDataValues.append("submitted_file", this.formValues.submitted_file);
        FormDataValues.append("is_submitted", true);
        FormDataValues.append("answer_section", "");
        const res = await axios.post(
          `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}/assignment/${id}/submission/`,
          FormDataValues,
          {
            headers: {
              Authorization: "JWT " + sessionStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
              "Content-Disposition": this.formValues.submitted_file,
              boundary: "submitted_file",
              Filename: this.formValues.submitted_file.name,
            },
          }
        );
        // const assignmentResponse = await axios.get(
        //   `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}/assignment/${id}/submission/`
        // );
        // this.assignments = assignmentResponse.data;
        console.log(res);
      } catch (e) {
        console.log(e);
      }
      this.$router.go();
    },
    // async assignmentSubmission(id) {
    //   const res = await axios.get(``);
    // },
  },
};
</script>

<style lang="scss" scoped></style>
