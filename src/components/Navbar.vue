<template>
  <div>
    <router-link to="/">Home</router-link> |
    <router-link to="/debug">Debug</router-link> |
    <a @click.prevent="signOut" href="#">Sign out</a>
  </div>
</template>

<script>
  const fb = require("@/firebaseConfig.js");

  export default {
    name: "Navbar",
    components: {},
    methods: {
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
