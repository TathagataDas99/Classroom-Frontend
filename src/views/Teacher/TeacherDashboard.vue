<template>
  <div v-if="error && showError">
    <template v-for="e in error" :key="e">
      <notificationView :error="e" @close="showError = false" />
    </template>
  </div>
  <div
    class="grid min-h-screen grid-flow-row md:grid-flow-col md:grid-cols-5 md:grid-rows-1 lg:grid-cols-8"
  >
    <div v-if="loader" class="teacher-dashboard">
      <template v-for="i in 4" :key="i">
        <LoaderCard />
      </template>
    </div>
    <main v-else class="teacher-dashboard">
      <!-- {{ userProfile }} -->
      <template
        v-for="classroom in userProfile.classroom_list"
        :key="classroom.slug"
      >
        <section class="col-span-1 row-span-1">
          <div class="ClassroomCard">
            <table class="mx-3 mt-4 table-fixed px-2">
              <tr>
                <td class="font-heading text-xl font-bold text-primary-dark">
                  Title:
                </td>
                <td class="font-body text-lg font-semibold">
                  {{ classroom.title }}
                </td>
              </tr>
              <tr>
                <td class="font-heading text-xl font-bold text-primary-dark">
                  Stream:
                </td>
                <td class="font-body text-lg font-semibold">
                  {{ classroom.stream }}
                </td>
              </tr>
              <tr>
                <td class="font-heading text-xl font-bold text-primary-dark">
                  Batch:
                </td>
                <td class="font-body text-lg font-semibold">
                  {{ classroom.start_year }} - {{ classroom.end_year }}
                </td>
              </tr>
              <tr>
                <td class="font-heading text-xl font-bold text-primary-dark">
                  Section:
                </td>
                <td class="font-body text-lg font-semibold">
                  {{ classroom.section }}
                </td>
              </tr>
              <tr>
                <td class="font-heading text-xl font-bold text-primary-dark">
                  Level:
                </td>
                <td class="font-body text-lg font-semibold">
                  {{ classroom.level }}
                </td>
              </tr>
              <tr>
                <td class="font-heading text-xl font-bold text-primary-dark">
                  Sem:
                </td>
                <td class="font-body text-lg font-semibold">
                  {{ classroom.current_sem }}
                </td>
              </tr>
            </table>
            <div class="button-section">
              <button
                class="bttn place-self-end"
                @click="handelOpen(classroom.slug)"
              >
                <LoginIcon class="inline-block w-6 lg:w-5" /> Enter
              </button>
            </div>
          </div>
        </section>
      </template>
    </main>
    <aside
      class="row-start-2 my-4 mx-2 grid grid-cols-1 grid-rows-3 gap-2 md:col-span-2 md:row-start-1 lg:col-span-3 lg:row-start-auto"
    >
      <section
        tabindex="0"
        :class="{ 'collapse-open': !contactEdit }"
        class="slow-effect collapse focus:shadow-md"
      >
        <div class="collapse-title-addition collapse-title">
          <span class="font-semibold text-danger-dark">Welcome</span>
          {{ userProfile.user.first_name }} {{ userProfile.user.last_name }}
        </div>
        <div class="collapse-content-layout collapse-content">
          <span class="collapse-content-label">Email : </span>
          <p class="col-span-3">
            {{ userProfile.user.email }}
          </p>
          <span class="collapse-content-label">Contact </span>
          <p class="relative col-span-2">
            <span
              class="absolute -bottom-6 text-sm text-danger-light"
              v-show="
                userProfile.user.contact_no != null &&
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
    </aside>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import notificationView from "../../components/notificationView.vue";
import LoaderCard from "../../components/LoaderCard.vue";
import { PencilIcon, CheckCircleIcon } from "@heroicons/vue/solid";
import { LoginIcon } from "@heroicons/vue/outline";
export default {
  name: "TeacherDashboard",
  data() {
    return {
      contactEdit: true,
      msg: "",
      loader: "",
      showError: false,
      error: [],
      notificationInterval: 8000,
    };
  },
  components: {
    LoaderCard,
    PencilIcon,
    CheckCircleIcon,
    LoginIcon,
    notificationView,
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
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
        `/classroom-app/teacher/${userTypeObj.userTypeId}/`
      );
      this.$store.dispatch("userProfile", userProfileResponse.data);
      console.log(this.userProfile);
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
    handelOpen(slug) {
      this.$router.push({
        name: "ClassroomView",
        params: {
          classroom_slug: slug,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
