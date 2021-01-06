import Vue from "vue";
import Router from "vue-router";
import { authGuard } from "./auth/authGuard";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./views/Home.vue")
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("./views/Dashboard.vue"),
      beforeEnter: authGuard
    },
    {
      path: "/fixcosts",
      name: "Fixkosten",
      component: () => import("./views/Fixkosten.vue"),
      beforeEnter: authGuard
    },
    {
      path: "/transactions",
      name: "Transactions",
      component: () => import("./views/Transactions.vue"),
      beforeEnter: authGuard
    },
    {
      path: "/transactionsapi",
      name: "TransactionsAPI",
      component: () => import("./views/TransactionsAPI.vue"),
      beforeEnter: authGuard
    }
  ]
});
