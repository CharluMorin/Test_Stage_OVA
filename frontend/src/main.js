import { createApp } from "vue";
import { createPinia } from "pinia";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.vue";
import "./style.css";

createApp(App).use(createPinia()).mount("#app");
