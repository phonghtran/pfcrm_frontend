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
  },
  mutations: {
    setCurrentUser(state, data) {
      state.currentUser.loggedIn = true;
      state.currentUser.data = data;
      localStorage.setItem("loggedIn", true);
    },
    setUsers(state, val) {
      state.usersListenerIsOn = true;
      state.users = val;
    },
    setUsersListenerIsOn(state, val) {
      state.users = val;
    },
  },
  actions: {
    resetUser(context) {
      context.commit("setCurrentUser", null);
      context.commit("setUserProfile", null);
      localStorage.setItem("loggedIn", false);
    },
    fetchUser(context, user) {
      if (user) {
        context.commit("setCurrentUser", user);
      } else {
        context.commit("setCurrentUser", null);
      }
    },
    fetchAllUsers({ commit, getters }) {
      fb.usersCollection
        .orderBy("lastInteraction", "desc")
        .get()
        .then((querySnapshot) => {
          commit("setUsersListenerIsOn", true);

          let tempContainer = [];

          querySnapshot.forEach(function(doc) {
            if (doc.id === getters.userID) {
              commit("setUserProfile", doc.data());
            }

            tempContainer[doc.id] = doc.data();
            let obj = doc.data();

            obj = {
              ...obj,
              userID: doc.id,
            };

            tempContainer.push(obj);
          });

          commit("setUsers", tempContainer);
        });
    },
  },
  modules: {},
});
