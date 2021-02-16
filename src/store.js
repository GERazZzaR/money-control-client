import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    projects: [],
    activeProject: "",
    transactions: [],
    categories: [],
    availableBudget: 0.0,
    totalBudget: 0.0,
    totalSpend: 0.0,
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    years: [],
    monatJahr: "Monat",
    helperReloadTransactions: 0,
    selectedInOut: "Ausgaben",
    selectedCategory: "Alle Kategorien",
    recurringTransactionsAmount: 0,
  },
  mutations: {
    updateProjects(state, value) {
      state.projects = value;
    },
    updateActiveProject(state, value) {
      state.activeProject = value;
    },
    updateTransactions(state, value) {
      state.transactions = value;
    },
    updateCategories(state, value) {
      state.categories = value;
    },
    updateAvailableBudget(state, value) {
      state.availableBudget = value;
    },
    updateTotalBudget(state, value) {
      state.totalBudget = value;
    },
    updateTotalSpend(state, value) {
      state.totalSpend = value;
    },
    updateSelectedMonth(state, value) {
      state.selectedMonth = value;
    },
    updateSelectedYear(state, value) {
      state.selectedYear = value;
    },
    updateYears(state, value) {
      state.years = value;
    },
    updateMonatJahr(state, value) {
      state.monatJahr = value;
    },
    updateHelperReloadTransactions(state, value) {
      state.helperReloadTransactions += value;
    },
    updateSelectedInOut(state, value) {
      state.selectedInOut = value;
    },
    updateSelectedCategory(state, value) {
      state.selectedCategory = value;
    },
    updateRecurringTransactionsAmount(state, value) {
      state.recurringTransactionsAmount = value;
    }
  },
  actions: {
    updateProjects(context, value) {
      context.commit("updateProjects", value);
    },
    updateActiveProject(context, value) {
      context.commit("updateActiveProject", value);
    },
    updateTransactions(context, value) {
      context.commit("updateTransactions", value);
    },
    updateCategories(context, value) {
      context.commit("updateCategories", value);
    },
    updateAvailableBudget(context, value) {
      context.commit("updateAvailableBudget", value);
    },
    updateTotalBudget(context, value) {
      context.commit("updateTotalBudget", value);
    },
    updateTotalSpend(context, value) {
      context.commit("updateTotalSpend", value);
    },
    updateSelectedMonth(context, value) {
      context.commit("updateSelectedMonth", value);
    },
    updateSelectedYear(context, value) {
      context.commit("updateSelectedYear", value);
    },
    updateYears(context, value) {
      context.commit("updateYears", value);
    },
    updateMonatJahr(context, value) {
      context.commit("updateMonatJahr", value);
    },
    updateHelperReloadTransactions(context, value) {
      context.commit("updateHelperReloadTransactions", value);
    },
    updateSelectedInOut (context, value) {
      context.commit("updateSelectedInOut", value);
    },
    updateSelectedCategory(context, value) {
      context.commit("updateSelectedCategory", value);
    },
    updateSelectedCategory(context, value) {
      context.commit("updateRecurringTransactionsAmount", value);
    },
    updateRecurringTransactionsAmount(context, value) {
      context.commit("updateRecurringTransactionAmount", value);
    }
  },
});
