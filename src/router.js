import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import IDE from "./views/IDE.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/ide",
      name: "IDE",
      component: IDE
    }
  ]
});
