<template>
  <div class="h-screen">
    <div v-if="loader">
      <LoaderView />
    </div>

    <div
      class="flex flex-col items-stretch justify-between px-3 pt-3 md:flex-row"
    >
      <nav class="tabs w-full md:w-1/2">
        <router-link
          :to="{ name: 'AnnouncementView', props: { no, subject_slug } }"
          class="tab tab-lifted md:tab-md"
          :class="{
            'tab-active': isActive === 1,
            'font-semibold text-primary-light': isActive === 1,
          }"
          @click="activeTab(1)"
          >Announcement</router-link
        >
        <router-link
          class="tab tab-lifted md:tab-md"
          :to="{ name: 'NotesView', props: { no, subject_slug } }"
          :class="{
            'tab-active': isActive === 2,
            'font-semibold text-primary-light': isActive === 2,
          }"
          @click="activeTab(2)"
          >Notes</router-link
        >
        <router-link
          class="tab tab-lifted md:tab-md"
          :to="{ name: 'AssignmentsView', props: { no, subject_slug } }"
          :class="{
            'tab-active': isActive === 3,
            'font-semibold text-primary-light': isActive === 3,
          }"
          @click="activeTab(3)"
          >Assignments</router-link
        >
      </nav>
      <div class="mr-7">
        <button
          class="link-danger"
          @click="
            $router.replace({
              name: 'SubjectCards',
              no,
            })
          "
        >
          Go Back
        </button>
      </div>
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
      announcements: "", //#FIXME: this might be an array
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
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/subject/${this.subject_slug}`
      );
      this.announcements = announcementsResponse.data;
      this.$router.replace({
        name: "AnnouncementView",
      });
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
