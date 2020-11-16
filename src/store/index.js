import Vue from "vue";
import Vuex from "vuex";
import users from "./users";
import entries from "./entries";

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    users,
    entries,
  },
});

export default store;
