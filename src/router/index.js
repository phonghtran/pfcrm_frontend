import Vue from "vue";
import VueRouter from "vue-router";

import firebase from "firebase";

import Batches from "@/views/Batches";
import Debug from "@/views/Debug";
import Frequency from "@/views/Frequency.vue";
import Home from "@/views/Home.vue";
import Log from "@/views/Log";
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
    path: "/log/:name",
    name: "Log",
    component: Log,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/batches",
    name: "Batches",
    component: Batches,
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

  if (to.query.secretToken === process.env.VUE_APP_SECRET_TOKEN) {
    firebase
      .auth()
      .signInWithEmailAndPassword(
        process.env.VUE_APP_LOGIN_EMAIL,
        process.env.VUE_APP_LOGIN_PASSWORD
      )
      .then(() => {
        next();
      })
      .catch((err) => {
        this.error = err.message;
      });
  } else {
    const currentUser = firebase.auth().currentUser;

    if (requiresAuth && !currentUser) {
      next("login");
    } else if (requiresAuth && currentUser) {
      next();
    } else {
      next();
    }
  }
});

export default router;
