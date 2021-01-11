import Vue from "vue";
import moment from "moment";

Vue.filter("firestoreDateConvert", function(value) {
  if (!value) return "";

  return moment(value.seconds * 1000, "x").format("MMM D, YYYY hh:mm");
});

Vue.filter("scrambleName", function(value, state) {
  // if (!value) return value;
  if (!value || state === false) return value;

  var a = value.toLowerCase().split(""),
    n = a.length;

  for (var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * n);
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
});
