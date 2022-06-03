import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/css/index.css";
import "@/css/style.css";
import "./axios";
import store from "./store";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const app = createApp(App);

// eslint-disable-next-line vue/multi-word-component-names
app.component("Datepicker", Datepicker);

app.use(router);

app.use(store);

app.mount("#app");
