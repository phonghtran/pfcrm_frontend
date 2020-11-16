import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/filters";

Vue.config.productionTip = false;

// Firebase
const fb = require("@/firebaseConfig.js");

fb.auth.onAuthStateChanged((user) => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
