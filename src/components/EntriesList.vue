<template>
  <div>
    <h1>entries</h1>
    <p>entries: {{ entries.length }}</p>

    <div v-for="(entry, entryID) in entries" v-bind:key="entryID">
      <div v-for="(user, userID) in entry.users" v-bind:key="userID">
        <h4>{{ user.name | scrambleName(scrambledName) }}</h4>
        <p>
          {{ entry.interaction }} -
          {{ entry.loggedDate | firestoreDateConvert }}
        </p>
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
        scrambledName: "scrambledName",
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
