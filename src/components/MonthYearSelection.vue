<template>
    <div class="MonthYearSelection">
        <div class="form-check form-check-inline">
            <input class="form-check-input" @change="$store.dispatch('updateSelectedMonth', new Date().getMonth() + 1), $store.dispatch('updateSelectedYear', new Date().getFullYear()), $store.dispatch('updateMonatJahr', 'Monat'), $parent.callApp(), $refs.year.getDate()" type="radio" name="monatJahr" id="monatJahrRadios1" value="Monat" checked>
            <label class="form-check-label" for="exampleRadios1">
            Monat
            </label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" @change="$store.dispatch('updateMonatJahr', 'Jahr'), $parent.callApp(), $refs.year.getDate()" type="radio" name="monatJahr" id="monatJahrRadios2" value="Jahr">
            <label class="form-check-label" for="exampleRadios2">
            Jahr
            </label>
        </div>
        <YearSelection ref="year" />
    </div>
</template>

<script>
/* eslint-disable */
/* global $ */
/* global google */
import { mapState } from "vuex";
import YearSelection from "@/components/YearSelection.vue";
export default {
  name: "MonthYearSelection",
  components: {
    YearSelection
  },
  data: function() {
    return {
      date: ""
    };
  },
  mounted() {
    this.$store.dispatch('updateMonatJahr', 'Monat');
    this.$refs.year.getDate();
  },
  computed: {
    ...mapState(["selectedMonth", "selectedYear", "monatJahr"])
  },
  watch: {
    
  },
  methods: {
    callDashboard() {
      this.$parent.callApp();
    }
  }
};
</script>

<style>

</style>