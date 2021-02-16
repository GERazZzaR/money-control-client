import Api from "@/services/Api";

export default {
  fetchAllTransactions(project) {
    return Api().get("transactions/" + project);
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
