<template>
  <div>
    <h1>{{ userProfile }}</h1>
    <!-- <h1 v-if="userProfile.is_owner">{{ dbaList }}</h1>  -->
    <div v-for="stream in userProfile.streams" :key="stream.stream_id">
      <div>
        {{ stream.title }}
      </div>
    </div>
    <button
      v-show="userProfile.is_owner"
      class="btn rounded-full"
      @click="this.isFormOpen = !this.isFormOpen"
    >
      Add dba to the stream
    </button>
    <form
      v-if="isFormOpen"
      class="form accent-primary-dark"
      @submit.prevent="addDbaToTheStream"
    >
      <div class="form-section">
        <label class="label" for="stream">stream</label>
        <div>
          <select name="stream" id="stream" v-model="streamId">
            <option
              :value="stream.stream_id"
              v-for="stream in userProfile.streams"
              :key="stream.stream_id"
            >
              {{ stream.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-section">
        <label class="label" for="dba">DBA</label>
        <select name="dba" id="dba" v-model="formValues.dba">
          <template v-for="dba in dbaList" :key="dba.dba_id">
            <option v-if="dba.dba_id != userProfile.dba_id" :value="dba.dba_id">
              {{ dba.user.first_name + " " + dba.user.last_name }}
            </option>
          </template>
        </select>
      </div>
      <button class="bttn">Add</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isFormOpen: true,
      formValues: {
        dba: "",
      },
      streamId: "",
      dbaList: [],
    };
  },
  async created() {
    this.loader = true;
    try {
      const response1 = await axios.get("/auth/users/me/", {
        headers: {
          Authorization: "JWT " + sessionStorage.getItem("token"),
        },
      });
      const userId = response1.data.id;
      const userTypeResponse = await axios.get(
        `/classroom-app/user-type/${userId}`
      );
      const userTypeObj = {
        userType: userTypeResponse.data.user_type,
        userTypeId: Object.values(userTypeResponse.data)[1],
      };
      this.$store.dispatch("userType", userTypeObj);

      const userProfileResponse = await axios.get(
        `/classroom-app/dba/${userTypeObj.userTypeId}/`
      );
      this.$store.dispatch("userProfile", userProfileResponse.data);

      const dbaListRes = await axios.get(
        `/classroom-app/college-create/${this.userProfile.college.slug}/dbas/`
      );
      this.dbaList = dbaListRes.data;
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
  },
  methods: {
    async addDbaToTheStream() {
      this.isFormOpen = !this.isFormOpen;
      const res = await axios.patch(
        `/classroom-app/college-streams/${this.userProfile.college.slug}/stream/${this.streamId}/`,
        this.formValues
      );
      console.log(res);
    },
  },
};
</script>

<style lang="scss" scoped></style>
