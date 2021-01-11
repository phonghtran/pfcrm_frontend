<template>
  <b-navbar toggleable="sm" sticky="true">
    <b-navbar-brand href="#">PFCRM</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
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
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto ">
        <div class="d-flex align-items-center">
          <input
            type="checkbox"
            id="scrambleNames"
            name="scrambleNames"
            v-model="scrambleNamesFlag"
            @change="switchScrambleNames"
          />
          <label for="scrambleNames">Scramble Names</label>
        </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
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
<style lang="scss"></style>
