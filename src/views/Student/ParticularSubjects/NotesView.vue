<template>
  <div>
    <div v-if="loader">
      <LoaderView />
    </div>
    <section class="mt-5">
      <div
        tabindex="0"
        class="collapse-plus collapse rounded-box mx-24 my-2 h-3/5 overflow-clip border border-base-300 bg-base-100"
        v-for="note in notes"
        :key="note"
        @focusin="isDownloaded"
        :class="{ 'collapse-open': isDownload }"
      >
        <div class="collapse-title text-xl font-medium">
          {{ note.title }}
        </div>
        <div class="collapse-content grid grid-cols-4 grid-rows-3">
          <div
            class="collapse-content col-span-3 col-start-1 row-span-3 row-start-1"
          >
            <p class="coloumn-1">{{ note.description }}</p>
          </div>
          <div class="collapse-content col-span-1 row-span-1">
            <p>Created By</p>
            <p class="font-bold">
              {{ note.posted_by.user.first_name }}
              {{ note.posted_by.user.last_name }}
            </p>
          </div>
          <div class="collapse-content col-span-1 row-span-1">
            <p>
              created at :-
              <span class="font-bold">{{ note.created_at.split("T")[0] }}</span>
            </p>
            <p class="font-bold text-primary-light">Download Attached files:</p>
          </div>
          <div
            class="collapse-content col-span-1 col-start-4 row-span-1 row-start-3 flex flex-row flex-wrap items-center justify-end"
          >
            <!-- <span class="font-bold">Attached Files</span> -->
            <a
              class="slow-effect flex-1 hover:text-primary-light"
              :href="file.file_path"
              v-for="(file, index) in note.attached_files"
              @focus="isDownloaded"
              :key="file.title"
            >
              <DocumentDownloadIcon
                class="slow-effect h-12 w-10 text-primary-dark hover:scale-110 hover:text-primary-light"
              />
              <span class="text-sm font-bold">file-{{ index + 1 }}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
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
      notes: [],
      id: "",
      isActive: 1,
      isDownload: false,
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
      const notesResponse = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}/notes/`
      );
      this.notes = notesResponse.data;
      // console.log(notesResponse);
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
    isDownloaded() {
      this.isDownload = !this.isDownload;
    },
  },
};
</script>

<style lang="scss" scoped></style>
