<template>
    <div class="Projects">
        <div class="row justify-content-center align-items-center">      
            <button class="btn mx-3" @click="changeActiveProject(project._id, project.name, project.date)" v-for="project in projects" :key="project.name" v-bind:class="[ (project.name === activeProject) ? 'btn-primary' : 'btn-outline-primary' ]">
                {{ project.name }}
            </button>
            <p v-if="projects.length === 0" class="mt-3">Du hast noch kein Projekt erstellt. Leg direkt los!</p><br>
            <button class="btn btn-primary mx-3" data-toggle="modal" data-target="#addProjectModal">+</button>
        </div>
        <hr class="w-75">

        <!--Modal Project hinzufügen-->
        <div
        class="modal fade"
        id="addProjectModal"
        tabindex="-1"
        data-backdrop="static"
        role="dialog"
        aria-labelledby="addProjectModalLabel"
        aria-hidden="true"
        >
        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
            <div class="modal-content p-3">
                <div class="modal-header">
                    <h5 class="modal-title" id="addProjectModalLabel">
                    Projekt hinzufügen
                    </h5>
                    <button
                    type="button"
                    @click="resetProject()"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    >
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="needs-validation-addCategory" 
                    novalidate="true"
                    @submit="$event.preventDefault(), addProject()"
                    >
                    <div class="form-group">
                        <label>Projektname *</label>
                        <input
                        v-bind:class="{ 'is-invalid': projectValidated }"
                        type="text"
                        class="form-control"
                        v-model="projectName"
                        placeholder="Name des Projekts *"
                        required
                        />
                        <div class="invalid-feedback" v-if="projectName === ''">
                            Gib den Namen des Projekts an.
                        </div>
                        <div class="invalid-feedback" v-if="projectExists">
                            Diesen Projektnamen gibt es bereits!
                        </div>
                    </div>
                    <br />
                    <div class="row justify-content-between">
                        <div class="col-mx-auto ml-3">
                        <button
                            id="closeProject"
                            type="button"
                            @click="resetProject()"
                            class="btn btn-secondary mt-1"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            Abbrechen
                        </button>
                        </div>
                        <div class="col-mx-auto mr-3">
                        <button
                            id="addProject"
                            type="submit"
                            class="btn btn-primary mt-1"
                            aria-label="Close"
                            @click="projectValidated = true"
                        >
                            Hinzufügen
                        </button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* global $ */
/* global google */
import ProjectsService from "@/services/ProjectsService";
import { mapState } from "vuex";
export default {
  name: "Projects",
  data: function() {
    return {
      projectName: "",
      projectValidated: false,
      projectExists: false,
    };
  },
  mounted() {
   
  },
  computed: {
    ...mapState(["projects", "activeProject"])
  },
  watch: {
    
  },
  methods: {
    async fetchAllProjects() {
      try {
        const response = await ProjectsService.fetchAllProjects();
        let projects = response.data.projects;
        await this.$store.dispatch("updateProjects", projects);
        await projects.forEach(project => {
            if (project.active === true)  this.$store.dispatch("updateActiveProject", project.name);
        })
        await this.$parent.fetchAllTransactions();
      } catch(e) {
        console.log(e)
      }     
    },
    async addProject() {
        this.projectExists = false;
        this.projects.forEach(project => {
            if(project.name === this.projectName){
            this.projectExists = true;
            };
        })
        if (this.projectName !== "" && this.projectExists === false) {
            $("#closeProject").trigger('click');
            await ProjectsService.addProject({
                name: this.projectName,
                active: true,
                date: new Date(),
            });
            await this.changeActiveProject(0, "", "");
        } else {
            this.projectValidated = true;
        }
    },
    resetProject() {
        this.projectName = "";
        this.projectValidated = false;
        this.projectExists = false;
    },
    async changeActiveProject(id, name, date) {
        let oldId = 0
        let oldName = ""
        let oldDate = ""
        this.projects.forEach(project => {
            if (project.active === true) {
                oldId = project._id;
                oldName = project.name;
                oldDate = project.date;
            }
        })

        if (oldId !== 0) {
            await ProjectsService.updateProject({
                id: oldId,
                name: oldName,
                active: false,
                date: oldDate
            });
        }
        if(id !== 0) {
            await ProjectsService.updateProject({
                id: id,
                name: name,
                active: true,
                date: date
            });
        }


        this.fetchAllProjects();
        this.resetProject();
    }
  }
};
</script>

<style>

</style>