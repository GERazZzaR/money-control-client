<template>
  <div class="fixkosten container">
    <YearSelection class="bg-white pt-3 mt-3 mb-3" style="position: sticky; z-index: 999; top:80px;" />
    <hr class="w-50">
    <h1 class="my-3">Monatliche Fixkosten</h1>
    <p>Deine monatlichen Fixkosten im Jahr {{ selectedYear }} betragen: <br><br>
      <b style="color: red; font-size: 40px;">{{ Number(-recurringTransactionsAmount).toFixed(2) }} €</b>.
    </p>
    <DiagramCategories />
  </div>
</template>

<script>
import { mapState } from "vuex";
import YearSelection from "@/components/YearSelection.vue";
import DiagramCategories from "@/components/DiagramCategories.vue";

export default {
  name: "Fixkosten",
  components: {
     YearSelection,
     DiagramCategories
  },
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState(["transactions", "categories", "years", "selectedYear", "recurringTransactionsAmount"])
  },
  mounted: function() {

  },
  methods: {

  }
};
</script>
