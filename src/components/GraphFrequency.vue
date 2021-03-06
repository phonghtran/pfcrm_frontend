<template>
  <div>
    <h1>Most Interactions</h1>
    <p>Users: {{ usersByCountTotal.length }}</p>

    <span
      class="legendColor"
      style="background-color:rgba(255, 165, 0, 0.5)"
    ></span>
    Message

    <span
      class="legendColor"
      style="background-color:rgba(168, 89, 255, 0.5)"
    ></span>
    Call

    <span
      class="legendColor"
      style="background-color:rgba(255, 219,13, 0.5)"
    ></span>
    Email

    <span
      class="legendColor"
      style="background-color:rgba(96, 255, 65, 0.5)"
    ></span>
    Video

    <span
      class="legendColor"
      style="background-color:rgba(255, 43, 40, 0.5)"
    ></span>
    In-Person

    <span
      class="legendColor"
      style="background-color:rgba(81, 125, 255, 0.5)"
    ></span>
    Extended Hang

    <span
      class="legendColor"
      style="background-color:rgba(25, 247, 255, 0.5)"
    ></span>
    Mail

    <span
      class="legendColor"
      style="background-color:rgba(255, 41, 157, 0.5)"
    ></span>
    Attempted Call

    <div class="filter__container">
      <div>
        Timeframe:

        <input
          class="filter__rangeTimeframe"
          type="range"
          id="volume"
          name="volume"
          min="1"
          max="365"
          v-model="timeFrameInDays"
        />
        {{ timeFrameInDays }} days
      </div>

      <div class="filter__timeline">
        <div v-for="(interval, index) in dateIntervals" v-bind:key="index">
          {{ interval }}
        </div>
      </div>
    </div>

    <canvas
      id="canvas"
      class="graph__canvas"
      v-bind:style="{ height: canvasHeight }"
    ></canvas>
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
        usersByCountTotal: "usersByCountTotal",
        scrambledName: "scrambledName",
      }),

      canvasHeight: function() {
        return this.calculateRowHeight(this.usersByCountTotal.length) + "px";
      },
      dateIntervals: function() {
        let dateFormat = "MM-DD";

        if (this.timeFrameInSeconds <= 86400) {
          dateFormat = "h:mma";
        } else if (
          this.timeFrameInSeconds > 86400 &&
          this.timeFrameInSeconds < 10 * 86400
        ) {
          dateFormat = "Do h:mma";
        } else if (this.timeFrameInSeconds > 10 * 30 * 86400) {
          dateFormat = "MMM YYYY";
        }

        const maxTimeValue = moment().unix();
        const intervals = [moment(maxTimeValue, "X").format(dateFormat)];

        for (var i = 1; i < 10; i++) {
          const p = this.timeFrameInSeconds * (i / 10);

          intervals.push(moment(maxTimeValue - p, "X").format(dateFormat));
        }

        return intervals;
      },
      sortByCountTotal: function() {
        let newList = this.usersByCountTotal.slice();

        return newList.sort(function(a, b) {
          return b.countTotal - a.countTotal;
        });
      },
      timeFrameInSeconds: function() {
        return this.timeFrameInDays * 86400;
      },
    },
    data: function() {
      return { timeFrameInDays: 30, dotRadius: 5, rowHeight: 34 };
    },
    watch: {
      rowHeight: function() {
        this.renderGraph();
      },
      scrambledName: function() {
        this.renderGraph();
      },
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
      window.addEventListener("resize", this.renderGraph);
    },
    beforeDestroy() {
      // Unregister the event listener before destroying this Vue instance
      window.removeEventListener("resize", this.renderGraph);
    },
    methods: {
      renderGraph: function() {
        var canvas = document.getElementById("canvas");

        const dpi = 1; //window.devicePixelRatio;
        const canvasheight = +getComputedStyle(canvas)
          .getPropertyValue("height")
          .slice(0, -2);
        const canvaswidth = +getComputedStyle(canvas)
          .getPropertyValue("width")
          .slice(0, -2);

        // console.log("dpi", dpi, "width", canvaswidth, "height", canvasheight);

        //scale the canvas
        canvas.setAttribute("height", canvasheight * dpi);
        canvas.setAttribute("width", canvaswidth * dpi);

        if (canvas.getContext) {
          var ctx = canvas.getContext("2d");

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const endAngle = Math.PI + (Math.PI * 3) / 2; // End point on circle

          const maxTimeValue = moment().unix();

          const minTimeValue = maxTimeValue - this.timeFrameInSeconds;

          const xMargin = canvaswidth * 0.01;
          const xWidth = canvaswidth * 0.98;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, canvasheight);
          ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
          ctx.stroke();

          for (var i = 1; i <= 10; i++) {
            const x = (i / 10) * canvaswidth;

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasheight);
            ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
            ctx.stroke();
          }

          for (
            var userRowOffset = 0;
            userRowOffset < this.usersByCountTotal.length;
            userRowOffset++
          ) {
            const interactions = this.usersByCountTotal[userRowOffset][
              "interactions"
            ];
            const name = this.scrambledName
              ? this.$options.filters.scrambleName(
                  this.usersByCountTotal[userRowOffset]["name"],
                  true
                )
              : this.usersByCountTotal[userRowOffset]["name"];

            const y = this.calculateRowHeight(userRowOffset);

            ctx.font = "18px serif";
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillText(name, 0, y);

            for (var xOffset = 0; xOffset < interactions.length; xOffset++) {
              if (
                interactions[xOffset]["loggedDate"]["seconds"] >= minTimeValue
              ) {
                const timePercentage =
                  (maxTimeValue -
                    interactions[xOffset]["loggedDate"]["seconds"]) /
                  this.timeFrameInSeconds;

                const x = timePercentage * xWidth + xMargin;

                ctx.beginPath();
                ctx.arc(x, y + 12, this.dotRadius, 0, endAngle);

                switch (interactions[xOffset]["interaction"]) {
                  case "Message":
                    ctx.fillStyle = "rgba(255, 165, 0, 0.5)";
                    break;

                  case "Call":
                    ctx.fillStyle = "rgba(168, 89, 255, 0.5)";
                    break;

                  case "Email":
                    ctx.fillStyle = "rgba(255, 219,13, 0.5)";
                    break;

                  case "Video":
                    ctx.fillStyle = "rgba(96, 255, 65, 0.5)";
                    break;

                  case "In-Person":
                    ctx.fillStyle = "rgba(255, 43, 40, 0.5)";
                    break;

                  case "Extended Hang":
                    ctx.fillStyle = "rgba(81, 125, 255, 0.5)";

                    break;

                  case "Mail":
                    ctx.fillStyle = "rgba(25, 247, 255, 0.5)";
                    break;

                  case "Attempted Call":
                    ctx.fillStyle = "rgba(255, 41, 157, 0.5)";
                    break;

                  default:
                    ctx.fillStyle = "rgba(0, 165, 255, 0.5)";
                }

                ctx.fill();
              } // if inside the timeframe
            } // for
          } // row users
        } // has context
      }, // render graph
      calculateRowHeight: function(userOffset) {
        return userOffset * this.rowHeight + 20;
      },
    },
  };
</script>

<style scoped lang="scss">
  .legendColor {
    border-radius: 1rem;
    display: inline-block;
    height: 1rem;
    width: 1rem;
  }

  .graph {
    &__canvas {
      width: 100%;
    }
  }

  .filter {
    &__container {
      background-color: bisque;
      position: sticky;
      top: 0;
      width: 100%;
    }

    &__rangeTimeframe {
      width: 50vw;
    }

    &__timeline {
      display: flex;

      div {
        width: 10%;
      }
    }
  }
</style>
