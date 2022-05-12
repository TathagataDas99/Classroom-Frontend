<template>
  <div>
    <div v-if="loader">
      <LoaderView />
    </div>
    <section class="mt-5">
      <div
        tabindex="0"
        class="collapse-plus collapse rounded-box mx-24 my-2 h-3/5 border border-base-300 bg-base-100"
        v-for="note in notes"
        :key="note"
      >
        <div class="collapse-title text-xl font-medium">
          {{ note.title }}
        </div>
        <div class="collapse-content">
          <p>{{ note.description }}</p>
        </div>
        <div class="collapse-content">
          <p>
            {{ note.posted_by.user.first_name }}
            {{ note.posted_by.user.last_name }}
          </p>
        </div>
        <div class="collapse-content">
          <p>created at :- {{ note.created_at.split("T")[0] }}</p>
        </div>
        <!-- <button class="btn btn-accent" @click="note.file_path">Button</button> -->
        <div
          class="collapse-content flex flex-row flex-wrap items-center justify-end"
        >
          <a
            class="flex-1"
            :href="file.file_path"
            v-for="file in note.attached_files"
            :key="file.title"
          >
            <DocumentDownloadIcon class="h-12 w-10 text-primary-dark" />
          </a>
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
  },
};
</script>

<style lang="scss" scoped></style>
