<template>
  <div>
    <h1>Most Interactions</h1>
    <p>Users: {{ users.length }}</p>

    <table>
      <tr v-for="user in sortByCountTotal" v-bind:key="user.userID">
        <td>{{ user.name }}</td>
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
        usersListenerIsOn: "usersListenerIsOn",
        users: "users",
      }),
      sortByCountTotal: function() {
        let newList = this.users.slice();

        return newList.sort(function(a, b) {
          return b.countTotal - a.countTotal;
        });
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
