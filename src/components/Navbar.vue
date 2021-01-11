<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" fixed="top">
    <a class="navbar-brand" href="#">PFCRM</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link class="nav-link" disabled="disabled" to="/debug"
            >Debug</router-link
          >
        </li> -->
        <li class="nav-item">
          <router-link class="nav-link" to="/frequency">Frequency</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/users">Users</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/batches">Batches</router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link class="nav-link" to="/log">Log</router-link>
        </li> -->
        <li class="nav-item">
          <a @click.prevent="signOut" class="nav-link" href="#">Sign out</a>
        </li>
      </ul>

      <div>
        <input
          type="checkbox"
          id="scrambleNames"
          name="scrambleNames"
          v-model="scrambleNamesFlag"
          @change="switchScrambleNames"
        />
        <label for="scrambleNames">Scramble Names</label>
      </div>
    </div>
  </nav>
</template>

<script>
  const fb = require("@/firebaseConfig.js");
  import { mapGetters } from "vuex";

  export default {
    name: "Navbar",
    computed: {
      ...mapGetters({
        currentUser: "currentUser",
        scrambledName: "scrambledName",
      }),
    },
    components: {},
    data: function() {
      return { scrambleNamesFlag: false };
    },
    mounted: function() {
      this.scrambleNamesFlag = this.scrambledName;
    },
    methods: {
      switchScrambleNames: function() {
        this.$store.commit("setScrambledName", this.scrambleNamesFlag);
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
