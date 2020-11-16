<template>
  <div>
    <h1>Entries</h1>
    <p>Entries: {{ entries.length }}</p>
    <pre>{{ entriesByCategory }}</pre>
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
        entriesByCategory: "entriesByCategory",
      }),
    },
    created: function() {
      if (this.entriesListenerIsOn === false) {
        this.$store.dispatch("fetchAllEntries");
      }
    },
    methods: {},
  };
</script>
