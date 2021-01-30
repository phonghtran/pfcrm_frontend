<template>
  <div>
    <h1>Most Interactions</h1>
    <p>Users: {{ usersByCountTotal.length }}</p>

    <table>
      <tr v-for="user in usersByCountTotal" v-bind:key="user.userID">
        <td>
          {{ user.name | scrambleName(scrambledName) }} <br />
          {{ averageContactFrequency[user.userID]["averageContactFrequency"] }}

          {{
            averageContactFrequency[user.userID]["averageContactFrequency"] > 1
              ? "Days"
              : "Day"
          }}
        </td>
        <td>{{ user.countTotal }}</td>
        <td>{{ user.lastInteraction | firestoreDateConvert }}</td>
        <td>{{ user.count }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "UserRank",
    computed: {
      // map `this.user` to `this.$store.getters.user`
      ...mapGetters({
        currentUser: "currentUser",
        scrambledName: "scrambledName",
        users: "users",
        usersListenerIsOn: "usersListenerIsOn",
        usersByCountTotal: "usersByCountTotal",
      }),
      averageContactFrequency: function() {
        const newObject = {};

        this.users.forEach((user) => {
          const interactions = user.interactions;

          newObject[user.userID] = {
            userID: user.userID,
            name: user.name,
            averageContactFrequency: 0,
          };

          if (interactions.length > 1) {
            let totalTime = 0;

            let maxEntriesCount = 0;

            for (let i = 1; i < interactions.length; i++) {
              totalTime += Math.abs(
                interactions[i - 1]["loggedDate"]["seconds"] -
                  interactions[i]["loggedDate"]["seconds"]
              );
              maxEntriesCount++;

              if (maxEntriesCount > 5) break;
            }

            newObject[user.userID]["averageContactFrequency"] = Math.round(
              totalTime / maxEntriesCount / 60 / 60 / 24
            );
          }
        });

        return newObject;
      },
    },
    created: function() {
      if (this.usersListenerIsOn === false) {
        this.$store.dispatch("fetchAllUsers");
      }
    },
    methods: {},
  };
</script>
