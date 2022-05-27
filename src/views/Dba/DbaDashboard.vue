<template>
  <div>
    <!-- <h1 v-if="userProfile.is_owner">{{ dbaList }}</h1>  -->
    <!-- add dbas -->
    <template v-if="userProfile.is_owner">
      <button
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
            <select name="stream" id="stream" v-model="formValues.title">
              <option
                :value="stream.title"
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
              <option
                v-if="dba.dba_id != userProfile.dba_id"
                :value="dba.dba_id"
              >
                {{ dba.user.first_name + " " + dba.user.last_name }}
              </option>
            </template>
          </select>
        </div>
        <button class="bttn">Add</button>
      </form>
    </template>
    <!-- creating class room -->
    <section>
      <button
        class="btn rounded-full"
        @click="
          this.isCreateClassRoomFormOpen = !this.isCreateClassRoomFormOpen
        "
      >
        Add Classroom
      </button>
      <form
        v-if="isCreateClassRoomFormOpen"
        class="form place-content-center accent-primary-dark lg:col-span-2"
        enctype="multipart/form-data"
        @submit.prevent="createCollege"
      >
        <section class="form-section">
          <label class="label">Title</label>
          <section class="input-section">
            <input
              class="input-box"
              type="text"
              placeholder="classroom name"
              v-model.trim.lazy="createCollegeFormValues.title"
              required
            />
          </section>
        </section>
        <section class="form-section">
          <label class="label">Level</label>
          <section class="input-section">
            <select
              name="level"
              id="level"
              v-model="createCollegeFormValues.level"
            >
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
            </select>
          </section>
        </section>
        <section class="form-section">
          <label class="label">Stream</label>
          <section class="input-section">
            <select
              name="stream"
              id="stream"
              v-model="createCollegeFormValues.stream"
            >
              <option selected disabled>Select Stream</option>
              <option
                :value="stream.title"
                v-for="stream in userProfile.streams"
                :key="stream.stream_id"
              >
                {{ stream.title }}
              </option>
            </select>
          </section>
        </section>
        <section class="form-section">
          <label class="label">Start Year</label>
          <section class="input-section">
            <input
              class="input-box"
              type="number"
              v-model.trim.lazy="createCollegeFormValues.start_year"
              required
            />
          </section>
        </section>
        <section class="form-section">
          <label class="label">Course Duration</label>
          <section class="input-section">
            <input
              class="input-box"
              type="number"
              min="2"
              v-model.trim.lazy="duration"
            />
          </section>
        </section>
        <section class="form-section">
          <label class="label">Current Sem</label>
          <section class="input-section">
            <input
              class="input-box"
              type="number"
              min="1"
              v-model.trim.lazy="this.createCollegeFormValues.current_sem"
              required
            />
          </section>
        </section>
        <section class="form-section">
          <label class="label">Section</label>
          <section class="input-section">
            <select v-model="createCollegeFormValues.section">
              <option :value="i" v-for="i in sections" :key="i">
                {{ i }}
              </option>
            </select>
          </section>
        </section>
        <section class="form-section">
          <label class="label col-span-2">Teachers list</label>
          <section class="input-section-file">
            <input
              required
              class="input-file"
              ref="file_teacher"
              @change="handleTeacherFileUpload"
              type="file"
              title="upload the full teacher list of the college"
              accept=".xlsx, .csv"
            />
          </section>
        </section>
        <section class="form-section">
          <label class="label">Student list</label>
          <section class="input-section-file">
            <input
              class="input-file"
              ref="file_dba"
              @change="handleStudentFileUpload"
              type="file"
              title="upload the full dba list of the college"
              accept=".xlsx, .csv"
            />
          </section>
        </section>

        <section class="button-section">
          <button class="bttn">Create</button>
        </section>
      </form>
    </section>
    <!-- Showing classroom -->
    <div class="flex flex-row flex-wrap justify-evenly">
      <section
        class="card"
        v-for="classroom in classroomList"
        :key="classroom.id"
      >
        <h1 class="card-title">{{ classroom.title }}</h1>
      </section>
    </div>
    <!-- adding teachers to classroom -->
    <div>
      <button
        class="btn rounded-full"
        @click="this.isAddingTeacherFormOpen = !this.isAddingTeacherFormOpen"
      >
        Add Teacher To Classroom
      </button>
      <form
        v-if="isAddingTeacherFormOpen"
        class="form place-content-center accent-primary-dark lg:col-span-2"
        @submit.prevent="addTeacher"
      >
        <div class="form-section">
          <label class="label" for="classroom">Class Room</label>
          <select name="classroom" id="classroom" v-model="clasroomSlug">
            <template v-for="classroom in classroomList" :key="classroom.id">
              <option :value="classroom.slug">
                {{ classroom.title }}
              </option>
            </template>
          </select>
        </div>
        <section class="form-section">
          <label class="label">Email Id</label>
          <section class="input-section">
            <input
              class="input-box"
              type="email"
              placeholder="Email Id"
              v-model.trim.lazy="addTeacherForm.email"
              required
            />
          </section>
        </section>
        <section class="button-section">
          <button class="bttn">Add</button>
        </section>
      </form>
    </div>
    <!-- add teacher to the college -->
    <div v-if="userProfile.is_owner">
      <button
        class="btn rounded-full"
        @click="
          this.isAddingTeacherFormOpenCollege =
            !this.isAddingTeacherFormOpenCollege
        "
      >
        Add Teacher To College
      </button>
      <form
        v-if="isAddingTeacherFormOpenCollege"
        class="form place-content-center accent-primary-dark lg:col-span-2"
        @submit.prevent="addTeacherCollege"
      >
        <section class="form-section">
          <label class="label">Email Id</label>
          <section class="input-section">
            <input
              class="input-box"
              type="email"
              placeholder="Email Id"
              v-model.trim.lazy="addTeacherForm.email"
              required
            />
          </section>
        </section>
        <section class="button-section">
          <button class="bttn">Add</button>
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isCreateClassRoomFormOpen: false,
      isAddingTeacherFormOpen: false,
      isAddingTeacherFormOpenCollege: false,
      isFormOpen: false,
      sections: ["A", "B", "C", "D", "E", "F"],
      classroomList: [],
      formValues: {
        dba: "",
        title: "",
      },
      dbaList: [],
      duration: 2,
      createCollegeFormValues: {
        title: "",
        level: "Bachelors",
        stream: "",
        start_year: 2020,
        end_year: 2022,
        section: "A",
        no_of_semesters: 4,
        current_sem: 1,
        allowed_student_list: null,
        allowed_teacher_list: null,
      },
      clasroomSlug: "",
      addTeacherForm: {
        email: "",
      },
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

      const classroomListResp = await axios.get(
        `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/`,
        {
          headers: {
            Authorization: "JWT " + sessionStorage.getItem("token"),
          },
        }
      );
      this.classroomList = classroomListResp.data;
    } catch (e) {
      console.log(e);
    }
    this.loader = false;
  },
  computed: {
    ...mapGetters(["userType", "userProfile"]),
    // calculateEndYear: {
    //   get() {
    //     return this.createCollegeFormValues.start_year + this.duration;
    //   },
    // set(newValue) {
    //   this.createCollegeFormValues.end_year = newValue;
    // },
    // },
  },
  methods: {
    async addDbaToTheStream() {
      this.isFormOpen = !this.isFormOpen;
      const res = await axios.post(
        `/classroom-app/college-streams/${this.userProfile.college.slug}/stream/`,
        this.formValues
      );
      console.log(res);
    },
    handleTeacherFileUpload(event) {
      this.createCollegeFormValues.allowed_teacher_list = event.target.files[0];
      console.log(this.createCollegeFormValues.allowed_teacher_list);
    },
    handleStudentFileUpload(event) {
      this.createCollegeFormValues.allowed_student_list = event.target.files[0];
      console.log(this.createCollegeFormValues.allowed_student_list);
    },
    async createCollege() {
      this.isCreateClassRoomFormOpen = !this.isCreateClassRoomFormOpen;
      this.loader = true;
      const endYear =
        parseInt(this.createCollegeFormValues.start_year) +
        parseInt(this.duration);
      try {
        let formData = new FormData();
        formData.append("title", this.createCollegeFormValues.title);
        formData.append("level", this.createCollegeFormValues.level);
        formData.append("stream", this.createCollegeFormValues.stream);
        formData.append("start_year", this.createCollegeFormValues.start_year);
        formData.append("end_year", endYear);
        formData.append("section", this.createCollegeFormValues.section);
        formData.append(
          "no_of_semesters",
          this.createCollegeFormValues.no_of_semesters
        );
        formData.append(
          "current_sem",
          this.createCollegeFormValues.current_sem
        );
        formData.append(
          "allowed_teacher_list",
          this.createCollegeFormValues.allowed_teacher_list
        );
        formData.append(
          "allowed_student_list",
          this.createCollegeFormValues.allowed_student_list
        );
        const res = await axios.post(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/`,
          formData,
          {
            headers: {
              Authorization: "JWT " + sessionStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
              "Content-Disposition": [
                this.createCollegeFormValues.allowed_teacher_list,
                this.createCollegeFormValues.allowed_student_list,
              ],
              // boundary: "allowed_teacher_list",
              Filename: [
                this.createCollegeFormValues.allowed_teacher_list.name,
                this.createCollegeFormValues.allowed_student_list.name,
              ],
            },
          }
        );
        console.log(res);
        // }
      } catch (e) {
        console.log(e);
      }
      this.loader = false;
    },
    async addTeacher() {
      try {
        await axios.post(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/classroom/${this.clasroomSlug}/manage-teacher/`,
          this.addTeacherForm
        );
        this.addTeacherForm = "";
      } catch (e) {
        console.log(e);
      }
    },
    async addTeacherCollege() {
      try {
        await axios.post(
          `/classroom-app/college-dba/${this.userProfile.college.slug}/manage-teacher-college/`,
          this.addTeacherForm
        );
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
