import Vue from "vue";
import moment from "moment";

Vue.filter("firestoreDateConvert", function (value) {
  if (!value) return "";

  return moment(value.seconds * 1000, "x").format("MMM D, YYYY hh:mm");
});
