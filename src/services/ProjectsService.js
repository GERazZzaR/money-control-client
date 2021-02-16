import Api from "@/services/Api";

export default {
  fetchAllProjects() {
    return Api().get("projects");
  },

  addProject(params) {
    return Api().post("projects", params);
  },

  updateProject(params) {
    return Api().put("projects/" + params.id, params);
  },
};
