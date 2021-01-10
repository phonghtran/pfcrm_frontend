<template>
  <div>
    <h1>Users</h1>
    <p>Users: {{ users.length }}</p>

    <div class="" v-for="user in users" v-bind:key="user.userID">
      <h3>{{ user.name }}</h3>
      <h4>{{ user.userID }} // {{ user.shuffledName }}</h4>
      <h4>count total</h4>
      <p>{{ user.countTotal }}</p>
      <h4>count</h4>
      <pre>{{ user.count }}</pre>
      <h4>last interaction</h4>
      <pre>{{ user.lastInteraction | firestoreDateConvert }}</pre>
      <h4>interaction</h4>

      <ul>
        <li
          class=""
          v-for="(interaction, index) in user.interactions"
          v-bind:key="index"
        >
          {{ interaction.interaction }} -
          {{ interaction.loggedDate | firestoreDateConvert }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  const fb = require("@/firebaseConfig.js");

  export default {
    name: "UsersSearch",
    computed: {
      // map `this.user` to `this.$store.getters.user`
      ...mapGetters({
        currentUser: "currentUser",

        usersListenerIsOn: "usersListenerIsOn",
        users: "users",
      }),
    },
    created: function() {
      if (this.usersListenerIsOn === false) {
        this.$store.dispatch("fetchAllUsers");
      }
    },
    methods: {
      fixCounts: function() {
        var batch = fb.db.batch();

        for (var j = 0; j < this.users.length; j++) {
          let x = this.users[j];

          let count = {};

          for (var i = 0; i < x["interactions"].length; i++) {
            const type = x["interactions"][i]["interaction"];

            if (count[type]) {
              count[type] += 1;
            } else {
              count[type] = 1;
            } // add interaction count
          }

          var userDoc = fb.db.collection("users").doc(this.users[j]["userID"]);
          batch.update(userDoc, {
            countTotal: x["interactions"].length,
            count: count,
          });
        }
        batch
          .commit()
          .then((res) => console.log("obj updated", res))
          .catch((err) => console.log("Error obj updated", err));
      },
    },
  };
</script>
