<template>
  <div class="h-screen">
    <div v-if="loader">
      <LoaderView />
    </div>
    <div class="tabs flex flex-row items-stretch justify-start px-3 pt-3">
      <router-link
        :to="{ name: 'AnnouncementView', props: { no, subject_slug } }"
        class="tab tab-lifted"
        :class="{ 'tab-active': isActive === 1 }"
        @click="activeTab(1)"
        >Announcement</router-link
      >

      <router-link
        class="tab tab-lifted"
        :to="{ name: 'NotesView', props: { no, subject_slug } }"
        :class="{ 'tab-active': isActive === 2 }"
        @click="activeTab(2)"
        >Notes</router-link
      >

      <router-link
        class="tab tab-lifted"
        :to="{ name: 'AssignmentsView', props: { no, subject_slug } }"
        :class="{ 'tab-active': isActive === 3 }"
        @click="activeTab(3)"
        >Assignments</router-link
      >
    </div>
    <router-view />
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
      announcements: "",
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
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}/`
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

<style lang="scss" scoped></style>
