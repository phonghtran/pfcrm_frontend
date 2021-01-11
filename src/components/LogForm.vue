<template>
  <div>
    <span v-if="scrambledName"> Disable this</span>
    <input type="text" v-model="newEntry.name" />

    <p>
      <input
        type="radio"
        id="one"
        value="Message"
        checked
        v-model="newEntry.interaction"
      />
      <label class="radio__label" for="one">Message</label>
      <br />
      <input
        type="radio"
        id="two"
        value="Call"
        v-model="newEntry.interaction"
      />
      <label class="radio__label" for="two">Call</label>
      <br />
      <input
        type="radio"
        id="three"
        value="Email"
        v-model="newEntry.interaction"
      />
      <label class="radio__label" for="three">Email </label>
      <br />
      <input
        type="radio"
        id="four"
        value="Video"
        v-model="newEntry.interaction"
      />
      <label class="radio__label" for="four">Video</label>
      <br />
      <input
        type="radio"
        id="five"
        value="In-Person"
        v-model="newEntry.interaction"
      />
      <label class="radio__label" for="five">In-Person</label>
      <br />
      <input
        type="radio"
        id="six"
        value="Extended Hang"
        v-model="newEntry.interaction"
      />
      <label class="radio__label" for="six">Extended Hang</label>
      <br />
      <input
        type="radio"
        id="seven"
        value="Mail"
        v-model="newEntry.interaction"
      />
      <label class="radio__label" for="seven">Mail </label>
      <br />
      <input
        type="radio"
        id="eight"
        value="Attempted Call"
        v-model="newEntry.interaction"
      />
      <label class="radio__label" for="eight">Attempted Call</label>
    </p>

    <button @click="submitNewEntry">Submit</button>
  </div>
</template>

<script>
  // const fb = require("@/firebaseConfig.js");
  import { mapGetters } from "vuex";

  export default {
    name: "LogForm",
    computed: {
      ...mapGetters({
        currentUser: "currentUser",
        scrambledName: "scrambledName",
      }),
    },
    components: {},
    data: function() {
      return {
        newEntry: {
          name: "",
          interaction: "Message",
        },
      };
    },
    props: {
      name: String,
    },
    mounted: function() {
      this.newEntry.name = this.name;
    },
    methods: {
      submitNewEntry: function() {
        console.log(this.newEntry);

        const url =
          "https://us-central1-friendcrm-4014e.cloudfunctions.net/app/api/create";

        fetch(url, {
          method: "POST",

          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.VUE_APP_LOG_API_KEY,
          },
          body: {
            name: "Tester",
            interaction: "Message",
          },
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
          })

          .catch(function(error) {
            console.log("Request failed", error);
          });
      },
    },
  };
</script>

<style lang="scss"></style>
