<template>
    <div class="YearSelection">
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
    </div>
</template>

<script>
/* eslint-disable */
/* global $ */
/* global google */
import { mapState } from "vuex";
export default {
  name: "YearSelection",
  data: function() {
    return {
      date: ""
    };
  },
  mounted() {
    this.$store.dispatch('updateSelectedMonth', new Date().getMonth() + 1);
    this.$store.dispatch('updateSelectedYear', new Date().getFullYear());
    this.getDate();
  },
  computed: {
    ...mapState(["selectedMonth", "selectedYear", "monatJahr"])
  },
  watch: {
    
  },
  methods: {
    async getDate() {
      var d = new Date(this.selectedYear, this.selectedMonth-1);
      if (this.$route.path === "/fixcosts" || this.monatJahr === "Jahr") {
          this.date = d.getFullYear();
      } else if (this.monatJahr === "Monat") {
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
    },
    changeMonthYear(number) {
      if (this.$route.path === "/fixcosts" || this.monatJahr === "Jahr") {
          if (number == 1){
            this.$store.dispatch("updateSelectedYear", this.selectedYear + 1)
          } else {
            this.$store.dispatch("updateSelectedYear", this.selectedYear - 1)
          }
      } else if(this.monatJahr == "Monat"){
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
      if (this.$route.path === '/dashboard'){
          this.$parent.callDashboard();
      }
    },
  }
};
</script>

<style>

</style>