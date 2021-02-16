import Api from "@/services/Api";

export default {
  fetchAllCategories() {
    return Api().get("categories");
    console.log("fetching..")
  },

  addCategory(params) {
    return Api().post("categories", params);
  }
};
