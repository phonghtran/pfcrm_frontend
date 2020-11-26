const fb = require("@/firebaseConfig.js");

function shuffleLetters(word) {
  var a = word.toLowerCase().split(""),
    n = a.length;

  for (var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * n);
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
}

const users = {
  state: {
    currentUser: {
      loggedIn: false,
      data: null,
    },
    shuffleName: false,
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
    shuffleName(state) {
      return state.shuffleName;
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
    setShuffleName(state, val) {
      state.shuffleName = val;
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
              shuffledName: shuffleLetters(tempContainer[doc.id]["name"]),
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
