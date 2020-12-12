<template>
  <div>
    <router-link to="/">Home</router-link> |
    <router-link to="/debug">Debug</router-link> |
    <router-link to="/frequency">Frequency</router-link> |
    <router-link to="/users">Users</router-link> |
    <router-link to="/batches">Batches</router-link> |
    <router-link to="/log">Log</router-link>
    |
    <a @click.prevent="signOut" href="#">Sign out</a> |
    <input
      type="checkbox"
      id="scrambleNames"
      name="scrambleNames"
      v-model="scrambleNamesFlag"
      @change="switchScrambleNames"
    />
    <label for="scrambleNames">Scramble Names</label>
  </div>
</template>

<script>
  const fb = require("@/firebaseConfig.js");
  import { mapGetters } from "vuex";

  export default {
    name: "Navbar",
    computed: {
      ...mapGetters({
        currentUser: "currentUser",
        shuffleName: "shuffleName",
      }),
    },
    components: {},
    data: function() {
      return { scrambleNamesFlag: false };
    },
    mounted: function() {
      this.scrambleNamesFlag = this.shuffleName;
    },
    methods: {
      switchScrambleNames: function() {
        this.$store.commit("setShuffleName", this.scrambleNamesFlag);
      },
      signOut: function() {
        fb.auth.signOut().then(() => {
          this.$store.dispatch("resetUser");
          this.$router.replace({
            name: "login",
          });
        });
      },
    },
  };
</script>
