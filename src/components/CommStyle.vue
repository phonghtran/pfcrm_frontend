<template>
  <div>
    <h1>Entries</h1>
    <p>Entries: {{ entries.length }}</p>
    <pre>{{ entriesSortByCategory }}</pre>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "CommStyle",
    computed: {
      // map `this.user` to `this.$store.getters.user`
      ...mapGetters({
        currentUser: "currentUser",

        entriesListenerIsOn: "entriesListenerIsOn",
        entries: "entries",
      }),

      entriesSortByCategory: function() {
        const counts = {};

        this.entries.forEach((entry) => {
          if (counts[entry["interaction"]]) {
            counts[entry["interaction"]]++;
          } else {
            counts[entry["interaction"]] = 1;
          }
        });

        return counts;
      },
    },
    created: function() {
      if (this.entriesListenerIsOn === false) {
        this.$store.dispatch("fetchAllEntries");
      }
    },
    methods: {},
  };
</script>
