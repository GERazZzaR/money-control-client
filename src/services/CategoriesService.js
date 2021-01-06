import Api from "@/services/Api";

export default {
  fetchAllCategories() {
    return Api().get("categories");
  },

  addCategory(params) {
    return Api().post("categories", params);
  }
};
