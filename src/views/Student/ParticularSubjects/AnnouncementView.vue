<template>
  <div class="w-screen">
    <div v-if="loader">
      <LoaderView />
    </div>
    <!-- <div>{{announcements}}</div> -->
    <section class="mt-5">
      <div
        tabindex="0"
        class="collapse-plus collapse rounded-box mx-24 my-2 border border-base-300 bg-base-100"
        v-for="announcement in announcements"
        :key="announcement.id"
      >
        <div class="collapse-title text-xl font-medium">
          {{ announcement.heading }}
        </div>
        <div class="collapse-content">
          <p>{{ announcement.body }}</p>
        </div>
        <!-- <div class="collapse-content">
          <p>{{ announcement.created_at }}</p> //TODO:show time
        </div> -->
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../../components/LoaderView.vue";
import { mapGetters } from "vuex";
export default {
  props: ["subject_slug", "no"],
  data() {
    return {
      loader: false,
      announcements: [],
      id: "",
      isActive: 1,
    };
  },
  components: {
    LoaderView,
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
      const announcementsResponse = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}/announcement/`
      );
      this.announcements = announcementsResponse.data;
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
