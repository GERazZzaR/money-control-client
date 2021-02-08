<template>
    <div class="DiagramCategories">
        <div class="container donutCell">
            <div v-if="selectedTransactions.length > 0" align="center" class="donutDiv pb-5" id="piechartCategories"></div>
            <p v-if="selectedTransactions.length === 0" class="pb-5">Keine Daten vorhanden :-(</p>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
/* global $ */
/* global google */
import { mapState } from "vuex";
export default {
  name: "DiagramCategories",
  data: function() {
    return {
      selectedTransactions: [],
      dataToDisplay: []
    };
  },
  mounted() {
    if (this.$route.path === "/fixcosts") this.fetchRecurringCosts();
    else this.changeSelectedCategory();
  },
  computed: {
    ...mapState(["transactions", "categories", "availableBudget", "selectedMonth", "selectedYear", "monatJahr", "selectedInOut", "selectedCategory", "recurringTransactionsAmount"])
  },
  watch: {
    availableBudget() {
      if (this.$route.path === "/dashboard") this.changeSelectedCategory();
    },
    monatJahr() {
      if (this.$route.path === "/dashboard") this.changeSelectedCategory();
    },
    selectedInOut() {
      if (this.$route.path === "/dashboard") this.changeSelectedCategory();
    },
    selectedCategory() {
      if (this.$route.path === "/dashboard") this.changeSelectedCategory();
    },
    selectedMonth() {
      if (this.$route.path === "/dashboard") this.changeSelectedCategory();
    },
    selectedYear() {
        if (this.$route.path === "/dashboard") this.changeSelectedCategory();
        else if (this.$route.path === "/fixcosts") this.fetchRecurringCosts();
    }
  },
    methods: {
        initChart() {
            let arrayCategories = new Array();
            arrayCategories[0] = new Array(2);
            arrayCategories[0][0] = "Geld";
            arrayCategories[0][1] = "Euro";

            this.categories.forEach((category, index) => {
                arrayCategories[index+1] = new Array(2)
                let thisCategoryAmount = 0.0;
                this.selectedTransactions.forEach((transaction) => {
                    if(transaction.category === category.name){
                        thisCategoryAmount += Number(transaction.amount.$numberDecimal);
                    }
                })
                if(thisCategoryAmount < 0) thisCategoryAmount*=-1
                arrayCategories[index+1][0] = category.name
                if(this.$route.path === '/fixcosts') arrayCategories[index+1][1] = thisCategoryAmount/12
                else arrayCategories[index+1][1] = thisCategoryAmount
            })
            arrayCategories.sort((index, i) => {return i[1]-index[1]})
            this.dataToDisplay = arrayCategories;
            this.loadGoogleCharts()
            

        },
        loadGoogleCharts(){
            // Load google charts
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(this.drawChart);
        },
        // Draw the chart and set the chart values
        drawChart() {
            var data = google.visualization.arrayToDataTable(this.dataToDisplay);
            var formatter = new google.visualization.NumberFormat({
                suffix: ' €'
            });
            formatter.format(data, 1);

        // Optional; add a title and set the width and height of the chart
            var options = {
                width: $(window).width() * 0.5,
                height: $(window).height() * 0.5,
                legend: "none",
                pieSliceText: "label",
                chartArea: {
                    top: 10,
                    bottom: 10,
                    right: 10,
                    left: 10,
                    width: "100%",
                    height: "100%"
                }
            };

            // Display the chart inside the <div> element with id="piechart"
            if(this.selectedTransactions.length > 0){
                 var chart = new google.visualization.PieChart(
                document.getElementById("piechartCategories")
                );
                chart.draw(data, options);
            }
        },
        changeSelectedCategory() {
            this.selectedTransactions = [];
            this.transactions.forEach(transaction => {
                let amountPositive = transaction.amount.$numberDecimal > 0;
                let amountOk = (amountPositive === true && this.selectedInOut === 'Einnahmen') || (amountPositive === false && this.selectedInOut === 'Ausgaben');
                let month = Number(transaction.date[3] + transaction.date[4]);
                let year = Number(transaction.date[6] + transaction.date[7] + transaction.date[8] + transaction.date[9]);
                let yearAmountOk = (year === this.selectedYear && amountOk === true);
                let monthYearAmountOk = (month === this.selectedMonth && yearAmountOk);
                let categorieOk = (this.selectedCategory === 'Alle Kategorien' || transaction.category === this.selectedCategory);

                if((this.monatJahr === 'Monat' && categorieOk && monthYearAmountOk && transaction.wiederkehrend !== 'Jahr') || (this.monatJahr === 'Jahr' && categorieOk && yearAmountOk)){
                    this.selectedTransactions.push(transaction)
                } 
            })
            this.initChart();
        },
        fetchRecurringCosts() {
            this.selectedTransactions = [];
            this.recurringTransactionsAmountComp = 0;
            this.transactions.forEach(transaction => {
                let year = transaction.date.substring(6,10)
                if(transaction.wiederkehrend !== 'Nie' && transaction.amount.$numberDecimal < 0 && year === String(this.selectedYear)) {
                    this.recurringTransactionsAmountComp += Number(transaction.amount.$numberDecimal)
                    this.selectedTransactions.push(transaction)
                }
            })
            this.recurringTransactionsAmountComp/=12
            if (!this.recurringTransactionsAmountComp > 0) this.recurringTransactionsAmountComp = 0;
            this.$store.commit('updateRecurringTransactionsAmount', this.recurringTransactionsAmountComp)
            this.initChart();
        },   
    }
};
</script>

<style>
select {
    cursor: pointer; 
    text-align-last: center;
}

.donutCell {
    position: relative;
}

.centerLabel {
    position: absolute;
    left: 0%;
    width: 100%;
    line-height: 100%;
    text-align: center;
}
</style>
