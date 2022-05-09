<template>
  <div>
    <div v-if="loader">
      <LoaderView />
    </div>
    {{ subjectCards }}
  </div>
</template>

<script>
import axios from "axios";
import LoaderView from "../../components/LoaderView.vue";
import { mapGetters } from "vuex";
// import { mapActions } from "vuex";
export default {
  data() {
    return {
      loader: false,
      subjectCards: {},
      id: "",
    };
  },
  props: ["no"],
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
    console.log(this.id);
    console.log(this.userProfile.classroom.slug);
    try {
      const subjectCards = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/${this.id}/`
      );
      this.subjectCards = subjectCards;
      console.log(this.semCards);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
};
</script>

<style lang="scss" scoped></style>
