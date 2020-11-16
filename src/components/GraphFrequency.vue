<template>
  <div>
    <h1>Most Interactions</h1>
    <p>Users: {{ users.length }}</p>
    <p>
      Timeframe:

      <input
        type="range"
        id="volume"
        name="volume"
        min="1"
        max="365"
        v-model="timeFrameInDays"
      />
      {{ timeFrameInDays }} days
    </p>

    <div class="graph__container">
      <div class="graph__names">
        <p v-for="user in users" v-bind:key="user.userID">
          {{ user.name }}
        </p>
      </div>
      <canvas
        id="canvas"
        class="graph__canvas"
        v-bind:style="{ height: canvasHeight }"
      ></canvas>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import moment from "moment";

  export default {
    name: "UserRank",
    computed: {
      // map `this.user` to `this.$store.getters.user`
      ...mapGetters({
        currentUser: "currentUser",
        usersListenerIsOn: "usersListenerIsOn",
        users: "users",
      }),
      canvasHeight: function() {
        return this.users.length * 36 + this.dotRadius * 3 + "px";
      },
      sortByCountTotal: function() {
        let newList = this.users.slice();

        return newList.sort(function(a, b) {
          return b.countTotal - a.countTotal;
        });
      },
      timeFrameInSeconds: function() {
        return this.timeFrameInDays * 86400;
      },
    },
    data: function() {
      return { timeFrameInDays: 14, dotRadius: 5 };
    },
    watch: {
      timeFrameInDays: function() {
        this.renderGraph();
      },
    },
    created: function() {
      if (this.usersListenerIsOn === false) {
        this.$store.dispatch("fetchAllUsers");
      }
    },
    mounted: function() {
      this.renderGraph();
    },
    methods: {
      renderGraph: function() {
        var canvas = document.getElementById("canvas");

        const dpi = window.devicePixelRatio;
        const canvasheight = +getComputedStyle(canvas)
          .getPropertyValue("height")
          .slice(0, -2);
        const canvaswidth = +getComputedStyle(canvas)
          .getPropertyValue("width")
          .slice(0, -2);

        //scale the canvas
        canvas.setAttribute("height", canvasheight * dpi);
        canvas.setAttribute("width", canvaswidth * dpi);

        if (canvas.getContext) {
          var ctx = canvas.getContext("2d");

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const endAngle = Math.PI + (Math.PI * 3) / 2; // End point on circle

          const maxTimeValue = moment().unix();
          maxTimeValue;
          const minTimeValue = maxTimeValue - this.timeFrameInSeconds;

          const xMargin = canvaswidth * 0.01;
          const xWidth = canvaswidth * 0.98;

          for (
            var userRowOffset = 0;
            userRowOffset < this.users.length;
            userRowOffset++
          ) {
            const interactions = this.users[userRowOffset]["interactions"];

            for (var xOffset = 0; xOffset < interactions.length; xOffset++) {
              if (
                interactions[xOffset]["loggedDate"]["seconds"] >= minTimeValue
              ) {
                const timePercentage =
                  (maxTimeValue -
                    interactions[xOffset]["loggedDate"]["seconds"]) /
                  this.timeFrameInSeconds;

                const x = timePercentage * xWidth + xMargin;
                const y = userRowOffset * 36 + this.dotRadius * 3;

                ctx.beginPath();
                ctx.arc(x, y, this.dotRadius, 0, endAngle);
                ctx.fillStyle = "rgba(255, 165, 0, 0.5)";
                ctx.fill();
              } // if inside the timeframe
            } // for
          } // row users
        } // has context
      }, // render graph
    },
  };
</script>

<style scoped lang="scss">
  .graph {
    &__container {
      display: flex;
    }

    &__names {
      width: 20vw;
    }

    &__canvas {
      background-color: bisque;

      width: 80vw;
    }
  }
</style>
