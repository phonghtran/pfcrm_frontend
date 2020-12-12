<template>
  <div>
    <h1>Social Temp</h1>
    <p>Users: {{ users.length }}</p>

    <div
      v-for="(category, categoryName) in usersSortByTemp"
      v-bind:key="categoryName"
    >
      <h2>{{ categoryName }}</h2>
      <p>{{ category.label }}</p>
      <ul class="container d-flex">
        <li class="" v-for="user in category.items" v-bind:key="user.userID">
          <router-link v-if="!shuffleName" :to="`/log/${user.name}`">{{
            user.name
          }}</router-link>
          <span v-if="shuffleName"> user.shuffledName</span>
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
          chilling: { label: "Between 2-4 weeks", items: [] },
          cooling: { label: "Between 1-2 months", items: [] },
          freezing: { label: "Between 2-3 months", items: [] },
          frozen: { label: "More than three months", items: [] },
          recent: { label: "Within last two weeks", items: [] },
        };
        const nowTime = moment().unix();

        // 14 days, 30, 60, 180
        this.users.forEach((user) => {
          const timeDiff = nowTime - user.lastInteraction.seconds;

          if (timeDiff <= this.timeBoundaries[0]) {
            newList["recent"]["items"].push(user);
          }

          if (
            timeDiff > this.timeBoundaries[0] &&
            timeDiff <= this.timeBoundaries[1]
          ) {
            newList["chilling"]["items"].push(user);
          }
          if (
            timeDiff > this.timeBoundaries[1] &&
            timeDiff <= this.timeBoundaries[2]
          ) {
            newList["cooling"]["items"].push(user);
          }

          if (
            timeDiff > this.timeBoundaries[2] &&
            timeDiff <= this.timeBoundaries[3]
          ) {
            newList["freezing"]["items"].push(user);
          }
          if (timeDiff > this.timeBoundaries[3]) {
            newList["frozen"]["items"].push(user);
          }
        });

        return newList;
      },
    },
    data: function() {
      return { timeBoundaries: [1209600, 2419200, 5184000, 15552000] };
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
