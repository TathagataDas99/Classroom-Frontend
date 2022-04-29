import axios from "axios";

axios.defaults.baseURL = "https://lms-classroom-api.herokuapp.com";

axios.defaults.headers.common["Authorization"] =
  "JWT " + localStorage.getItem("token");
