const fb = require("@/firebaseConfig.js");

const users = {
  state: {
    currentUser: {
      loggedIn: false,
      data: null,
    },
    scrambledName: false,
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
    scrambledName(state) {
      return state.scrambledName;
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
    setScrambledName(state, val) {
      state.scrambledName = val;
    },
  },
  actions: {
    resetUser(context) {
      context.commit("setCurrentUser", null);
    },
    fetchUser(context, user) {
      if (user) {
        context.commit("setCurrentUser", user);
        context.commit("setLoggedIn", true);
      } else {
        context.commit("setCurrentUser", null);
        context.commit("setLoggedIn", false);
      }
    },
    fetchAllUsers({ state, commit }) {
      if (state.users.length === 0) {
        console.log("fetching users");
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
            console.log(state.users);
          })
          .catch((err) => {
            this.error = err.message;
          });
      }
    },
  },
  modules: {},
};

export default users;
