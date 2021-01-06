<template>
  <div class="dashboard container">
    <div class="form-check form-check-inline">
      <input class="form-check-input" @change="$store.dispatch('updateSelectedMonth', new Date().getMonth() + 1), $store.dispatch('updateSelectedYear', new Date().getFullYear()), $store.dispatch('updateMonatJahr', 'Monat'), $parent.calculateAmounts(), getDate()" type="radio" name="monatJahr" id="monatJahrRadios1" value="Monat" checked>
      <label class="form-check-label" for="exampleRadios1">
        Monat
      </label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" @change="$store.dispatch('updateMonatJahr', 'Jahr'), $parent.calculateAmounts(), getDate()" type="radio" name="monatJahr" id="monatJahrRadios2" value="Jahr">
      <label class="form-check-label" for="exampleRadios2">
        Jahr
      </label>
    </div>
    <div class="row justify-content-center">      
      <button 
        type="button" 
        class="h-50 btn btn-outline-primary mr-3 mt-4 btn-sm"
        @click="
          changeMonthYear(-1),
          getDate()
        "
      >
        <span class="material-icons">chevron_left</span>
      </button>
      <div class="col-5"><h1 class="my-3">{{ date }}</h1></div>
      <button 
        type="button" 
        class="h-50 btn btn-outline-primary ml-3 mt-4 btn-sm"
        @click="
          changeMonthYear(1),
          getDate()
        "
      >
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
    <DiagramInOut />
    <div class="row justify-content-between">
      <div class="col">
        <button
          type="button"
          class="btn btn-danger btn-big"
          data-toggle="modal"
          data-target="#newMinusModal"
          data-dismiss="modal"
        >
          <span class="material-icons">remove_circle</span>
        </button>
      </div>
      <div class="col">
        <button
          type="button"
          class="btn btn-success btn-big"
          data-toggle="modal"
          data-target="#newPlusModal"
          data-dismiss="modal"
        >
          <span class="material-icons">add_circle</span>
        </button>
      </div>
    </div>
    <div class="row justify-content-between mt-3">
      <div class="col">
        <p style="color:#dc3545">
          <b>{{ totalSpend }} €</b>
        </p>
        <hr color="#dc3545" style="height:2px" class="w-25" />
        <p class="mb-5">Ausgaben</p>
      </div>
      <div class="col">
        <p>
          <b>{{ totalBudget }} €</b>
        </p>
        <hr color="#28a745" style="height:2px" class="w-25" />
        <p class="mb-5">Budget</p>
      </div>
    </div>
    <hr>
    <h1 class="mt-5">Kategorien</h1>
    <DiagramCategories />
  </div>
</template>

<style>
.btn-big {
  width: 80px;
  height: 80px;
}
</style>

<script>
import { mapState } from "vuex";
import DiagramInOut from "@/components/DiagramInOut.vue";
import DiagramCategories from "@/components/DiagramCategories.vue";

export default {
  name: "Dashboard",
  components: {
    DiagramInOut,
    DiagramCategories
  },
  data() {
    return {
      date: "",
    };
  },
  mounted() {
    this.getDate();
  },
  computed: {
    ...mapState(["totalBudget", "totalSpend", "selectedMonth", "selectedYear", "monatJahr"])
  },
  methods: {
    async getDate() {
      var d = new Date(this.selectedYear, this.selectedMonth-1);
      if(this.monatJahr == "Monat"){
        var month = new Array();
        month[0] = "Januar";
        month[1] = "Februar";
        month[2] = "März";
        month[3] = "April";
        month[4] = "Mai";
        month[5] = "Juni";
        month[6] = "Juli";
        month[7] = "August";
        month[8] = "September";
        month[9] = "Oktober";
        month[10] = "November";
        month[11] = "Dezember";
        this.date = month[d.getMonth()] + " " + d.getFullYear();
      }
      else{
        this.date = d.getFullYear();
      }
    },
    changeMonthYear(number){
      if(this.monatJahr == "Monat"){
        if (number == 1){
          if(this.selectedMonth == 12){
            this.$store.dispatch("updateSelectedMonth", 1)
            this.$store.dispatch("updateSelectedYear", this.selectedYear + 1)
          }
          else{
            this.$store.dispatch("updateSelectedMonth", this.selectedMonth + 1)
          }
        }
        else{
          if(this.selectedMonth == 1){
            this.$store.dispatch("updateSelectedMonth", 12)
            this.$store.dispatch("updateSelectedYear", this.selectedYear - 1)
          }
          else{
            this.$store.dispatch("updateSelectedMonth", this.selectedMonth - 1)
          }
        }
      }
      else{
        if (number == 1){
          this.$store.dispatch("updateSelectedYear", this.selectedYear + 1)
        }
        else{
          this.$store.dispatch("updateSelectedYear", this.selectedYear - 1)
        }
      }
      
      this.$parent.calculateAmounts();
    }
  }
};
</script>
