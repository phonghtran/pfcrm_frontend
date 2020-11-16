import Vue from "vue";
import Vuex from "vuex";
const fb = require("@/firebaseConfig.js");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: {
      loggedIn: false,
      data: null,
    },
    users: [],
    usersListenerIsOn: false,
    entries: [],
    entriesListenerIsOn: false,
  },
  getters: {
    currentUser(state) {
      return state.currentUser;
    },
    users(state) {
      return state.users;
    },
    usersListenerIsOn(state) {
      return state.usersListenerIsOn;
    },
    entries(state) {
      return state.entries;
    },
    entriesListenerIsOn(state) {
      return state.entriesListenerIsOn;
    },
  },
  mutations: {
    setCurrentUser(state, data) {
      state.currentUser.data = data;
    },
    setLoggedIn(state, data) {
      state.currentUser.loggedIn = data;
    },
    setUsers(state, val) {
      state.usersListenerIsOn = true;
      state.users = val;
    },

    setEntries(state, val) {
      state.entriesListenerIsOn = true;
      state.entries = val;
    },
  },
  actions: {
    resetUser(context) {
      context.commit("setCurrentUser", null);

      localStorage.setItem("loggedIn", false);
    },
    fetchUser(context, user) {
      if (user) {
        context.commit("setCurrentUser", user);
        context.commit("setLoggedIn", true);
        localStorage.setItem("loggedIn", true);
      } else {
        context.commit("setCurrentUser", null);
        context.commit("setLoggedIn", false);
        localStorage.setItem("loggedIn", null);
      }
    },
    fetchAllUsers({ commit }) {
      fb.usersCollection
        .orderBy("lastInteraction", "desc")
        .get()
        .then((querySnapshot) => {
          let tempContainer = [];

          querySnapshot.forEach(function(doc) {
            tempContainer[doc.id] = doc.data();
            let obj = doc.data();

            obj = {
              ...obj,
              userID: doc.id,
            };

            tempContainer.push(obj);
          });

          commit("setUsers", tempContainer);
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    fetchAllEntries({ commit }) {
      fb.entriesCollection
        .orderBy("loggedDate", "desc")
        .get()
        .then((querySnapshot) => {
          let tempContainer = [];

          querySnapshot.forEach(function(doc) {
            tempContainer[doc.id] = doc.data();
            let obj = doc.data();

            obj = {
              ...obj,
              entryID: doc.id,
            };

            tempContainer.push(obj);
          });

          commit("setEntries", tempContainer);
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
  modules: {},
});
