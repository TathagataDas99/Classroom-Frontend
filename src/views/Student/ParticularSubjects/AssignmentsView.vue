<template>
  <main @click="openedNotes = -1" class="w-screen">
    <div v-if="loader">
      <LoaderView />
    </div>
    <!-- {{ assignments }} -->
    <section class="mt-5">
      <div
        :tabindex="index"
        class="announcement-collapse"
        v-for="(assignment, index) in assignments"
        :key="assignment"
        :class="{ 'collapse-open': openedNotes === index }"
        @focusin="openedNotes = index"
      >
        <div class="collapse-title font-heading text-xl font-medium">
          <span class="text-primary-dark">{{ index + 1 }} .</span>
          {{ assignment.title }}
        </div>
        <section class="collapse-content grid grid-rows-4 lg:grid-cols-4">
        <div
          class="collapse-content row-start-1 flex flex-row flex-wrap lg:col-span-3 lg:col-start-1 lg:row-span-1"
        >
          <h1 class="font-heading">Description :</h1>
          <p class="coloumn-1 row-start-1">{{ assignment.description }}</p>
        </div>
        <div
          class="collapse-content col-span-3 col-start-1 row-start-2 flex flex-row flex-wrap lg:col-span-3 lg:row-span-1"
        >
          <h1 class="font-heading">Marks :</h1>
          <p class="coloumn-1 px-5 text-lg font-bold text-primary-dark">
            {{ assignment.alloted_marks }}
          </p>
        </div>
        <div
          class="collapse-content row-start-3 flex flex-row flex-wrap lg:col-span-3 lg:col-start-1 lg:row-span-1"
        >
          <h1 class="font-heading">Due Date :</h1>
          <p class="coloumn-1 px-5 text-xl font-bold text-danger-dark">
            {{ assignment.due_date }}
          </p>
        </div>
        <div
          class="collapse-content row-start-4 flex flex-row flex-wrap lg:col-span-3 lg:col-start-1 lg:row-span-1"
        >
          <h1 class="font-heading">Due Time :</h1>
          <p class="coloumn-1 px-5 text-xl font-bold text-danger-dark">
            {{ assignment.due_time }}
          </p>
        </div>
        <div
          class="collapse-content col-span-1 row-span-1 row-start-2 md:col-start-4"
        >
          <p>
            created at :-
            <span class="font-bold">{{
              assignment.created_at.split("T")[0]
            }}</span>
          </p>
          <p class="font-bold text-primary-light">Download Attached files:</p>
        </div>
        <div
          class="collapse-content col-span-1 row-span-3 flex flex-row flex-wrap items-center justify-end font-body lg:col-start-4 lg:row-start-3"
        >
          <!-- <span class="font-bold">Attached File</span> -->
          <a
            class="slow-effect flex-1 hover:text-primary-light"
            :href="assignment.attached_pdf"
          >
            <DocumentDownloadIcon
              class="slow-effect h-12 w-10 text-primary-dark hover:scale-110 hover:text-primary-light"
            />
            <span class="text-sm font-bold">file-1</span>
          </a>
        </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
import LoaderView from "../../../components/LoaderView.vue";
import { mapGetters } from "vuex";
import { DocumentDownloadIcon } from "@heroicons/vue/solid";
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
    };
  },
  components: {
    LoaderView,
    DocumentDownloadIcon,
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
    // isDownloaded() {
    //   this.isDownload = !this.isDownload;
    // },
  },
};
</script>

<style lang="scss" scoped></style>
