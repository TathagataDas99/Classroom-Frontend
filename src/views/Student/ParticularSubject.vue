<template>
  <div>
    <div v-if="loader">
      <LoaderView />
    </div>
    <h1>{{ announcements }}</h1>
    
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
import { mapGetters } from "vuex";
export default {
  props: ["subject_slug", "no"],
  data() {
    return {
      loader: false,
      announcements : "",
      id: "",
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
};
</script>

<style lang="scss" scoped></style>
