const fb = require("@/firebaseConfig.js");

const batches = {
  state: {
    batches: [],
    batchesByCategory: {},
    batchesListenerIsOn: false,
  },
  getters: {
    batches(state) {
      return state.batches;
    },

    batchesListenerIsOn(state) {
      return state.batchesListenerIsOn;
    },
  },
  mutations: {
    setBatches(state, val) {
      state.batchesListenerIsOn = true;
      state.batches = val;
    },
  },
  actions: {
    fetchAllBatches({ state, commit }) {
      if (state.batches.length === 0) {
        console.log("fetching batches");
        fb.batchesCollection
          .orderBy("loggedDate", "desc")
          .get()
          .then((querySnapshot) => {
            let tempContainer = [];

            querySnapshot.forEach(function(doc) {
              tempContainer[doc.id] = doc.data();
              let obj = doc.data();

              obj = {
                ...obj,
                batchID: doc.id,
              };

              tempContainer.push(obj);
            });

            commit("setBatches", tempContainer);
          })
          .catch((err) => {
            this.error = err.message;
          });
      }
    },
  },
  modules: {},
};

export default batches;
