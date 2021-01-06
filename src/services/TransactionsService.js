import Api from "@/services/Api";

export default {
  fetchAllTransactions() {
    return Api().get("transactions");
  },

  addTransaction(params) {
    return Api().post("transactions", params);
  },

  deleteTransaction(id) {
    return Api().delete("transactions/" + id);
  },

  updateTransaction(params) {
    return Api().put("transactions/" + params.id, params);
  },

  deleteAllTransactions() {
    return Api().delete("transactions/");
  }
};
