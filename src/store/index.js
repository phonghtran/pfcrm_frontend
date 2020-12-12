import Vue from "vue";
import Vuex from "vuex";
import batches from "./batches";

import users from "./users";
import entries from "./entries";

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    batches,
    users,
    entries,
  },
});

export default store;
