<template>
  <div>
    <h1 v-if="!currentUser.loggedIn">Not signed in</h1>
    <button @click="login" v-if="!currentUser.loggedIn">Login</button>
    <button @click="addEntry" disabled="disabled">Add User</button>
    <button @click="addRawEntries">Add Raw Entries</button>
    <button @click="addBatches" disabled="disabled">Add Batches</button>

    <p><button @click="clearOut">clear</button></p>

    <h1>Batches</h1>
    <pre>{{ batches.length }}</pre>
    <pre>{{ batches }}</pre>

    <h1>Users raw</h1>
    <pre>{{ users }}</pre>
  </div>
</template>

<script>
  import { airtable } from "@/assets/airtable";
  import { mapGetters } from "vuex";
  import moment from "moment";
  const fb = require("@/firebaseConfig.js");

  export default {
    name: "HelloWorld",
    computed: {
      // map `this.user` to `this.$store.getters.user`
      ...mapGetters({
        currentUser: "currentUser",
        usersListenerIsOn: "usersListenerIsOn",
        users: "users",
      }),
      batches: function() {
        let batches = [];

        this.users.forEach((person) => {
          person.interactions.forEach((interaction) => {
            const batchClone = batches.slice();
            let noMatches = true;

            for (let i = 0; i < batchClone.length; i++) {
              for (let j = 0; j < batchClone[i].loggedDate.length; j++) {
                const timeDiff = Math.abs(
                  batchClone[i].loggedDate[j].seconds -
                    interaction.loggedDate.seconds
                );
                if (timeDiff < 240 && timeDiff > 0) {
                  noMatches = false;
                  batches[i]["loggedDate"].push(interaction.loggedDate);
                  batches[i]["users"][person.userID] = { name: person.name };
                  break;
                }

                if (timeDiff === 0) {
                  noMatches = false;
                  break;
                }
              } // each interaction date
            } // for loop

            if (noMatches === true) {
              const newEntry = {
                loggedDate: [interaction["loggedDate"]],
                users: {},
              };

              newEntry["users"][person.userID] = { name: person.name };

              batches.push(newEntry);
            } // if new
          }); // each persons interactions
        }); // each person

        const cleanup = [];

        batches.forEach((batch) => {
          if (batch.loggedDate.length > 1) {
            cleanup.push(batch);
          }
        });

        return cleanup;
      },
      compiledUsers: function() {
        let users = [];

        this.airtable.forEach((item) => {
          const loggedDate = moment(item["Logged Date"], "MM/DD/YYYY h:mma");
          const formattedDate = fb.timestamp.fromDate(loggedDate.toDate());
          const name = item["Name"];
          const interaction = item["Interaction"];

          const searchList = users.slice();

          let doesUserExist = false;

          for (let i = 0; i < searchList.length; i++) {
            if (searchList[i]["name"] === name) {
              if (users[i]["count"][interaction]) {
                users[i]["count"][interaction] =
                  users[i]["count"][interaction] + 1;
              } else {
                users[i]["count"][interaction] = 1;
              }

              if (users[i]["lastInteraction"].seconds < formattedDate.seconds) {
                users[i]["lastInteraction"] = formattedDate;
              }

              users[i]["interactions"].push({
                interaction: interaction,
                loggedDate: formattedDate,
              });

              doesUserExist = true;
            } // if match
          } // for search

          if (doesUserExist === false && name !== "...Willow Dena") {
            let contents = {
              name: name,
              count: {},
              lastInteraction: formattedDate,
              interactions: [
                {
                  interaction: interaction,
                  loggedDate: formattedDate,
                },
              ],
            };
            contents["count"][interaction] = 1;

            users.push(contents);
          }
        });

        return users;
      },
    },
    data: function() {
      return { airtable: airtable };
    },
    created: function() {
      if (this.usersListenerIsOn === false) {
        this.$store.dispatch("fetchAllUsers");
      }
    },

    methods: {
      addBatches: function() {
        var batch = fb.db.batch();

        this.batches.forEach((item) => {
          console.log(item);

          const entry = {
            loggedDate: item["loggedDate"][0],
            users: {},
          };

          entry["users"] = item["users"];

          console.log(entry);

          var newUserRef = fb.db.collection("batches").doc();
          batch.set(newUserRef, entry);
        });

        batch
          .commit()
          .then((res) => console.log("obj updated", res))
          .catch((err) => console.log("Error obj updated", err));
      },
      addEntry: function() {
        var batch = fb.db.batch();

        this.compiledUsers.forEach((item) => {
          console.log(item);

          var newUserRef = fb.db.collection("users").doc();
          batch.set(newUserRef, item);
        });

        batch
          .commit()
          .then((res) => console.log("obj updated", res))
          .catch((err) => console.log("Error obj updated", err));
      },
      addRawEntries: function() {
        var batch = fb.db.batch();
        let count = 0;

        this.airtable.forEach((entry) => {
          const loggedDate = moment(entry["Logged Date"], "MM/DD/YYYY h:mma");
          const formattedDate = fb.timestamp.fromDate(loggedDate.toDate());
          const name = entry["Name"];
          const interaction = entry["Interaction"];

          const item = {
            loggedDate: formattedDate,
            interaction: interaction,
            users: {},
          };

          // search users
          this.users.forEach((user) => {
            if (user.name === name) {
              item["users"][user.userID] = {
                name: name,
              };
              return;
            }
          });

          console.log(item);

          var newUserRef = fb.db.collection("entries").doc();
          batch.set(newUserRef, item);

          count++;

          if (count > 300) {
            batch
              .commit()
              .then((res) => console.log("obj updated", res))
              .catch((err) => console.log("Error obj updated", err));

            batch = fb.db.batch();
            count = 0;
            console.log(item);
          }
        });
        batch
          .commit()
          .then((res) => console.log("obj updated", res))
          .catch((err) => console.log("Error obj updated", err));
      },
      clearOut: function() {
        var clearCollection = fb.db.collection("entries");
        var batch = fb.db.batch();
        var ids = [];
        var count = 0;

        clearCollection
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              ids.push(doc.id);
            });
          })
          .then(() => {
            ids.forEach((e) => {
              const doc = clearCollection.doc(e);
              batch.delete(doc);

              count++;
              console.log(count);

              if (count > 300) {
                count = 0;
                batch
                  .commit()
                  .then((res) => console.log("obj updated", res))
                  .catch((err) => console.log("Error obj updated", err));

                batch = fb.db.batch();
              }
            });
          })
          .then(() => {
            batch
              .commit()
              .then((res) => console.log("obj updated", res))
              .catch((err) => console.log("Error obj updated", err));
          });
      },
      login: function() {
        fb.auth()
          .signInWithEmailAndPassword(
            "phong@phonghtran.com",
            process.env.VUE_APP_LOGIN_PASSWORD
          )
          .then(() => {
            this.$router.replace({ name: "Home" });
          })
          .catch((err) => {
            this.error = err.message;
          });
      },
    },
    unmounted: function() {},
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
