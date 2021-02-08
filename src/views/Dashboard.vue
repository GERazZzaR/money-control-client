<template>
  <div class="dashboard container">
    <MonthYearSelection class="bg-white pt-3 mt-3 mb-3" style="position: sticky; z-index: 999; top:80px;" />
    <DiagramInOut />
    <div class="row justify-content-between">
      <div class="col">
        <button
          type="button"
          class="btn btn-danger btn-big"
          data-toggle="modal"
          data-target="#transactionModal"
          data-dismiss="modal"
          @click="$parent.modalTitle = 'Neue Ausgabe hinzufügen'"
        >
          <span class="material-icons">remove_circle</span>
        </button>
      </div>
      <div class="col">
        <button
          type="button"
          class="btn btn-success btn-big"
          data-toggle="modal"
          data-target="#transactionModal"
          data-dismiss="modal"
          @click="$parent.modalTitle = 'Neue Einnahme hinzufügen'"
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
    <div class="row justify-content-center">
      <select v-model="selectedInOut"
          @change="$store.dispatch('updateSelectedCategory', selectedCategory)"
          class="form-control w-50 mt-5 mb-3"
      >
          <option selected>Ausgaben</option>
          <option>Einnahmen</option>
      </select>
    </div>
    <div class="row justify-content-center">
        <select v-model="selectedCategory" class="form-control w-50 mb-5 mt-3" @change="$store.dispatch('updateSelectedCategory', selectedCategory)">
            <option>Alle Kategorien</option>
            <option v-for="category in categories" :key="category.id">{{ category.name }}</option>
        </select>
    </div>
    <DiagramCategories ref="diaCats" />
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
import MonthYearSelection from "@/components/MonthYearSelection.vue";
import DiagramInOut from "@/components/DiagramInOut.vue";
import DiagramCategories from "@/components/DiagramCategories.vue";

export default {
  name: "Dashboard",
  components: {
    MonthYearSelection,
    DiagramInOut,
    DiagramCategories
  },
  data() {
    return {
      
    };
  },
  mounted() {
    this.callApp()
  },
  computed: {
    ...mapState(["categories", "totalBudget", "totalSpend", "selectedMonth", "selectedYear", "monatJahr", "selectedInOut", "selectedCategory"]),
    selectedInOut: {
      get() {
        return this.$store.state.selectedInOut;
      },
      set(value) {
        this.$store.dispatch('updateSelectedInOut', value);
        this.$refs.diaCats.initChart();
      }
    },
    selectedCategory: {
      get() {
        return this.$store.state.selectedCategory;
      },
      set(value) {
        this.$store.dispatch('updateSelectedCategory', value);
        this.$refs.diaCats.initChart();
      }
    }
  },
  methods: {
    callApp() {
      this.$parent.calculateAmounts();
    }
  }
};
</script>
