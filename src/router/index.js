import Vue from "vue";
import VueRouter from "vue-router";

import firebase from "firebase";

import Debug from "@/views/Debug";
import Login from "@/views/Login";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/debug",
    name: "Debug",
    component: Debug,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  let currentUser;

  if (!localStorage.getItem("loggedIn")) {
    currentUser = firebase.auth().currentUser;
  } else {
    currentUser = localStorage.getItem("loggedIn");
  }
  console.log(firebase.auth().currentUser, currentUser, requiresAuth);

  // console.log(to, from, next);
  if (requiresAuth && !currentUser) {
    console.log("login");
    next("login");
  } else {
    console.log("pass");
    next();
  }
});

export default router;
