<template>
  <div>
    <h1>Users</h1>
    <p>Users: {{ users.length }}</p>
    <pre>{{ users }}</pre>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

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
    methods: {},
  };
</script>
