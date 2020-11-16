const fb = require("@/firebaseConfig.js");

const users = {
  state: {
    currentUser: {
      loggedIn: false,
      data: null,
    },
    users: [],
    usersByCountTotal: [],
    usersListenerIsOn: false,
  },
  getters: {
    currentUser(state) {
      return state.currentUser;
    },
    users(state) {
      return state.users;
    },
    usersByCountTotal(state) {
      return state.usersByCountTotal;
    },
    usersListenerIsOn(state) {
      return state.usersListenerIsOn;
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

      let newList = val.slice();

      state.usersByCountTotal = newList.sort(function(a, b) {
        return b.countTotal - a.countTotal;
      });
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
  },
  modules: {},
};

export default users;
