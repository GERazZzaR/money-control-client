import Vue from "vue";
import Router from "vue-router";

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
    },
    {
      path: "/fixcosts",
      name: "Fixkosten",
      component: () => import("./views/Fixkosten.vue"),
    },
    {
      path: "/transactions",
      name: "Transactions",
      component: () => import("./views/Transactions.vue"),
    },
    {
      path: "/transactionsapi",
      name: "TransactionsAPI",
      component: () => import("./views/TransactionsAPI.vue"),
    }
  ]
});
