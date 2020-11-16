<template>
  <div>
    <h1>Social Temp</h1>
    <p>Users: {{ users.length }}</p>

    <div
      v-for="(category, categoryName) in usersSortByTemp"
      v-bind:key="categoryName"
    >
      <h2>{{ categoryName }}</h2>
      <ul>
        <li v-for="user in category" v-bind:key="user.userID">
          {{ shuffleName ? user.shuffledName : user.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import moment from "moment";

  export default {
    name: "SocialTemp",
    computed: {
      // map `this.user` to `this.$store.getters.user`
      ...mapGetters({
        currentUser: "currentUser",
        usersListenerIsOn: "usersListenerIsOn",
        users: "users",
        entriesListenerIsOn: "entriesListenerIsOn",
        entries: "entries",
        shuffleName: "shuffleName",
      }),

      usersSortByTemp: function() {
        let newList = {
          recent: [],
          chilling: [],
          cooling: [],
          freezing: [],
          frozen: [],
        };
        const nowTime = moment().unix();

        const timeBoundaries = [1209600, 1814400, 5184000, 15552000]; // 14 days, 21, 60, 180

        this.users.forEach((user) => {
          const timeDiff = nowTime - user.lastInteraction.seconds;

          if (timeDiff <= timeBoundaries[0]) {
            newList["recent"].push(user);
          }

          if (timeDiff > timeBoundaries[0] && timeDiff <= timeBoundaries[1]) {
            newList["chilling"].push(user);
          }
          if (timeDiff > timeBoundaries[1] && timeDiff <= timeBoundaries[2]) {
            newList["cooling"].push(user);
          }

          if (timeDiff > timeBoundaries[2] && timeDiff <= timeBoundaries[3]) {
            newList["freezing"].push(user);
          }
          if (timeDiff > timeBoundaries[3]) {
            newList["frozen"].push(user);
          }
        });

        return newList;
      },
    },
    created: function() {
      if (this.usersListenerIsOn === false) {
        this.$store.dispatch("fetchAllUsers");
      }

      if (this.entriesListenerIsOn === false) {
        this.$store.dispatch("fetchAllEntries");
      }
    },
    methods: {},
  };
</script>

<style scoped lang="scss">
  ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;

    li {
      display: inline;
      flex: 200px;
    }
  }
</style>
