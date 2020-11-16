const fb = require("@/firebaseConfig.js");

const entries = {
  state: {
    entries: [],
    entriesByCategory: {},
    entriesListenerIsOn: false,
  },
  getters: {
    entries(state) {
      return state.entries;
    },
    entriesByCategory(state) {
      return state.entriesByCategory;
    },
    entriesListenerIsOn(state) {
      return state.entriesListenerIsOn;
    },
  },
  mutations: {
    setEntries(state, val) {
      state.entriesListenerIsOn = true;
      state.entries = val;
    },
    setEntriesByCategory(state, val) {
      state.entriesByCategory = val;
    },
  },
  actions: {
    fetchAllEntries({ commit }) {
      fb.entriesCollection
        .orderBy("loggedDate", "desc")
        .get()
        .then((querySnapshot) => {
          let tempContainer = [];
          let categoryContainer = {};

          querySnapshot.forEach(function(doc) {
            tempContainer[doc.id] = doc.data();
            let obj = doc.data();

            obj = {
              ...obj,
              entryID: doc.id,
            };

            tempContainer.push(obj);

            //for category
            const interaction = tempContainer[doc.id]["interaction"];
            if (categoryContainer[interaction]) {
              categoryContainer[interaction]++;
            } else {
              categoryContainer[interaction] = 1;
            }
          });
          console.log(categoryContainer);

          commit("setEntries", tempContainer);
          commit("setEntriesByCategory", categoryContainer);
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
  modules: {},
};

export default entries;
