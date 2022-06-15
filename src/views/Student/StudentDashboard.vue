<template>
  <div v-if="error && showError">
    <template v-for="e in error" :key="e">
      <notificationView :error="e" @close="showError = false" />
    </template>
  </div>
  <div class="student-dashboard">
    <section v-if="loader" class="student-dashboard-card-section">
      <template v-for="i in 4" :key="i">
        <LoaderCard></LoaderCard>
      </template>
    </section>
    <main v-else class="student-dashboard-card-section">
      <!-- <img
        src="../../assets/semester_student/bg_1.svg"
        alt="No Sem BG found"
        class="absolute bottom-0 left-24 hidden lg:col-span-full lg:block"
      /> -->
      <div class="SemCard" v-for="semCard in semCards" :key="semCard.id">
        <button title="This is the on going semester">
          <BadgeCheckIcon class="sem-badge" v-show="semCard.is_current_sem" />
        </button>
        <h1 class="text-center font-heading text-2xl text-zinc-700">
          Semester-{{ semCard.sem_no }}
        </h1>
        <section class="button-section">
          <button class="bttn" @click="handelOpen(semCard.sem_no)">Open</button>
        </section>
      </div>
    </main>
    <aside
      class="row-start-2 my-2 mx-2 grid grid-cols-1 grid-rows-3 gap-2 lg:row-start-auto"
    >
      <section
        tabindex="0"
        :class="{ 'collapse-open': !contactEdit }"
        class="collapse"
      >
        <div class="collapse-title-addition collapse-title">
          <span class="font-semibold text-danger-dark">Welcome</span>
          {{ userProfile.user.first_name }} {{ userProfile.user.last_name }}
        </div>
        <div class="collapse-content-layout collapse-content">
          <span class="collapse-content-label">University Roll: </span>
          <p class="col-span-3">
            {{ userProfile.university_roll }}
          </p>
          <span class="collapse-content-label">Email : </span>
          <p class="col-span-3">
            {{ userProfile.user.email }}
          </p>
          <span class="collapse-content-label">Contact </span>
          <p class="relative col-span-2">
            <span
              class="absolute -bottom-6 text-sm text-danger-light"
              v-show="
                userProfile.user.contact_no &&
                !contactEdit &&
                userProfile.user.contact_no.length != 10
              "
              >*contact no must be 10 digit</span
            >
            <input
              minlength="10"
              maxlength="10"
              v-if="userProfile.user.contact_no || !contactEdit"
              class="w-full bg-bglight-shade px-4 outline-none focus:invalid:text-danger-dark"
              :class="{
                'mr-4 border-b-2 border-primary-light focus:invalid:border-danger-dark':
                  !contactEdit,
              }"
              type="tel"
              :disabled="contactEdit"
              v-model="userProfile.user.contact_no"
            />
            <template v-else>
              <span class="col-span-3">Not Available</span>
            </template>
          </p>
          <PencilIcon
            class="collapse-content-icon"
            @click="contactEdit = !contactEdit"
            v-if="contactEdit"
          />
          <CheckCircleIcon
            class="collapse-content-icon text-primary-light"
            v-if="
              !contactEdit &&
              userProfile.user.contact_no != null &&
              (userProfile.user.contact_no.length === 10 ||
                userProfile.user.contact_no.length === 0)
            "
            @click="editContact"
          />
        </div>
      </section>
      <section tabindex="2" class="collapse">
        <div class="collapse-title-addition collapse-title">
          <span class="font-semibold text-danger-dark">College : </span>
          {{ userProfile.classroom.college.name }}
        </div>
        <div class="collapse-content-layout collapse-content">
          <span class="collapse-content-label">City : </span>
          <p class="col-span-3">
            {{ userProfile.classroom.college.city }}
          </p>
          <span class="collapse-content-label">State : </span>
          <p class="col-span-3">
            {{ userProfile.classroom.college.state }}
          </p>
          <span class="collapse-content-label">Address : </span>
          <p class="col-span-3">
            {{ userProfile.classroom.college.address }}
          </p>
        </div>
      </section>
      <section tabindex="3" class="collapse">
        <div class="collapse-title-addition collapse-title">
          <span class="font-semibold text-danger-dark">Classroom : </span>
          {{ userProfile.classroom.title }}
        </div>
        <div class="collapse-content-layout collapse-content">
          <span class="collapse-content-label">Level : </span>
          <p class="col-span-3">
            {{ userProfile.classroom.level }}
          </p>
          <span class="collapse-content-label">Stream : </span>
          <p class="col-span-3">
            {{ userProfile.classroom.stream }}
          </p>
          <span class="collapse-content-label">Section : </span>
          <p class="col-span-3">
            {{ userProfile.classroom.section }}
          </p>
          <span class="collapse-content-label">Batch of: </span>
          <p class="col-span-3">
            {{ userProfile.classroom.start_year }} -
            {{ userProfile.classroom.end_year }}
          </p>
          <span class="collapse-content-label"># Semesters: </span>
          <p class="col-span-3">
            {{ userProfile.classroom.no_of_semesters }}
          </p>
        </div>
      </section>
    </aside>
  </div>
</template>

<script>
import axios from "axios";
import notificationView from "../../components/notificationView.vue";
import { mapGetters } from "vuex";
import {
  BadgeCheckIcon,
  PencilIcon,
  CheckCircleIcon,
} from "@heroicons/vue/solid";
import LoaderCard from "../../components/LoaderCard.vue";
// import { mapActions } from "vuex";
export default {
  name: "StudentDashboard",
  data() {
    return {
      msg: "",
      loader: true,
      contactEdit: true,
      showError: false,
      error: [],
      notificationInterval: 8000,
      // semCards: [],
    };
  },
  components: {
    // LoaderView,
    BadgeCheckIcon,
    LoaderCard,
    PencilIcon,
    CheckCircleIcon,
    notificationView,
  },
  computed: {
    ...mapGetters(["userType", "userProfile", "semCards"]),
  },
  // methods: {
  //   ...mapActions(["userType", "userProfile"]),
  // },
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
        `/classroom-app/student/${userTypeObj.userTypeId}/`
      );
      this.$store.dispatch("userProfile", userProfileResponse.data);

      const semCardsResponse = await axios.get(
        `/classroom-app/classroom/${this.userProfile.classroom.slug}/semester/`
      );
      // this.semCards = semCardsResponse.data;
      this.$store.dispatch("semCards", semCardsResponse.data);
      console.log(semCardsResponse.data);
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  methods: {
    async editContact() {
      try {
        this.contactEdit = !this.contactEdit;
        if (this.userProfile.user.contact_no == "") {
          this.userProfile.user.contact_no = null;
        }
        await axios.patch(
          `/auth/users/me/`,
          { contact_no: this.userProfile.user.contact_no },
          {
            headers: {
              Authorization: "JWT " + sessionStorage.getItem("token"),
            },
          }
        );
        this.$router.go();
      } catch (e) {
        this.error = Object.values(e.response.data)[0];
        this.showError = true;
        this.userProfile.user.contact_no = null;
        setTimeout(() => {
          this.showError = false;
        }, this.notificationInterval);
      }
    },
    handelOpen(no) {
      this.$router.push({
        name: "SubjectCards",
        params: {
          no: no,
        },
      });
    },
  },
};
</script>
