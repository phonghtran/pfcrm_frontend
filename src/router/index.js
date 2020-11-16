import Vue from "vue";
import VueRouter from "vue-router";

import firebase from "firebase";

import Debug from "@/views/Debug";
import Frequency from "@/views/Frequency.vue";
import Home from "@/views/Home.vue";
import Login from "@/views/Login";
import Users from "@/views/Users";

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
    path: "/frequency",
    name: "Frequency",
    component: Frequency,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: {
      requiresAuth: true,
    },
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
