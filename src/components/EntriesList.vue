<template>
  <div>
    <h1>entries</h1>
    <p>entries: {{ entries.length }}</p>

    <div v-for="(entries, entriesID) in entries" v-bind:key="entriesID">
      <div v-for="(user, userID) in entries.users" v-bind:key="userID">
        <p>{{ user.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "EntriesList",
    computed: {
      // map `this.user` to `this.$store.getters.user`
      ...mapGetters({
        currentUser: "currentUser",

        entriesListenerIsOn: "entriesListenerIsOn",
        entries: "entries",
      }),
    },
    created: function() {
      if (this.usersListenerIsOn === false) {
        this.$store.dispatch("fetchAllEntries");
      }
    },
    methods: {},
  };
</script>
