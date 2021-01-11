<template>
  <div>
    <h1>Most Interactions</h1>
    <p>Users: {{ usersByCountTotal.length }}</p>

    <table>
      <tr v-for="user in usersByCountTotal" v-bind:key="user.userID">
        <td>{{ user.name | scrambleName(scrambledName) }}</td>
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
        usersListenerIsOn: "usersListenerIsOn",
        usersByCountTotal: "usersByCountTotal",
      }),
    },
    created: function() {
      if (this.usersListenerIsOn === false) {
        this.$store.dispatch("fetchAllUsers");
      }
    },
    methods: {},
  };
</script>
