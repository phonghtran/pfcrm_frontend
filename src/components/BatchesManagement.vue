<template>
  <div class="container">
    <div class="row">
      <p>Count: {{ batches.length }}</p>
    </div>
    <div class="row">
      <b-card
        class="col-12 col-md-4"
        v-for="(batch, index) in batches"
        v-bind:key="batch.batchID"
      >
        <p>{{ batch.batchID }}</p>
        <p>Count: {{ batch.count }}</p>

        <p>{{ batch.loggedDate | firestoreDateConvert }}</p>
        <div v-for="(user, userID) in batch.users" v-bind:key="userID">
          <p>
            {{ user.name | scrambleName(scrambledName) }}
            <b-button
              @click="deletePerson(batch.batchID, userID)"
              size="sm"
              variant="outline-secondary"
              >Remove</b-button
            >
          </p>
        </div>

        <input
          type="checkbox"
          v-bind:id="'locked' + index"
          v-model="batch.locked"
          @click="lockBatch(batch.batchID, $event)"
        />
        <label v-bind:for="'locked' + index">Locked</label>
      </b-card>
    </div>
    <!-- row -->
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  const fb = require("@/firebaseConfig.js");

  export default {
    name: "UsersSearch",
    computed: {
      // map `this.user` to `this.$store.getters.user`
      ...mapGetters({
        batchesListenerIsOn: "batchesListenerIsOn",
        batches: "batches",
        currentUser: "currentUser",
        scrambledName: "scrambledName",
      }),
    },
    created: function() {
      if (this.batchesListenerIsOn === false) {
        this.$store.dispatch("fetchAllBatches");
      }
    },
    methods: {
      deletePerson: function(batchID, userID) {
        let matchBatch = this.batches.filter(
          (batch) => batch.batchID === batchID
        );

        if (matchBatch.length > 0) {
          delete matchBatch[0]["users"][userID];

          fb.batchesCollection
            .doc(batchID)
            .update({
              users: matchBatch[0]["users"],
            })
            .then(function() {
              console.log("Document successfully updated!");
            })
            .catch(function(error) {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
            });
        }
      },
      lockBatch: function(batchID, event) {
        console.log(event.target.checked, batchID);

        fb.batchesCollection
          .doc(batchID)
          .update({
            locked: event.target.checked,
          })
          .then(function() {
            console.log("Document successfully updated!");
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      },
    },
  };
</script>

<style lang="scss"></style>
