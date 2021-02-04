<template>
    <div class="DiagramCategories">
        <div class="container donutCell">
            <div class="row justify-content-md-center">
                <select v-model="selectedInOut"
                    @change="changeSelectedCategory"
                    class="form-control w-50 mt-5 mb-3"
                >
                    <option selected>Ausgaben</option>
                    <option>Einnahmen</option>
                </select>
            </div>
            <div class="row justify-content-md-center">
                <select v-model="selectedCategory" class="form-control w-50 mb-5 mt-3" @change="changeSelectedCategory">
                    <option>Alle Kategorien</option>
                    <option v-for="category in categories" :key="category.id">{{ category.name }}</option>
                </select>
            </div>
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
      selectedInOut: "Ausgaben",
      selectedCategory: "Alle Kategorien",
      selectedTransactions: [],
      dataToDisplay: []
    };
  },
  mounted() {
    this.changeSelectedCategory();
    this.initChart();
  },
  computed: {
    ...mapState(["transactions", "categories", "availableBudget", "selectedMonth", "selectedYear", "monatJahr"])
  },
  watch: {
    availableBudget() {
      this.initChart();
    },
    selectedInOut() {
      this.initChart();
    },
    selectedCategory() {
      this.initChart();
    },
    monatJahr() {
      this.changeSelectedCategory();
    },
    selectedMonth() {
      this.changeSelectedCategory();
    },
    selectedYear() {
      this.changeSelectedCategory();
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
                this.selectedTransactions.forEach((transaction, i) => {
                    if(transaction.category === category.name){
                        thisCategoryAmount += Number(transaction.amount.$numberDecimal);
                    }
                })
                if(thisCategoryAmount < 0) thisCategoryAmount*=-1
                arrayCategories[index+1][0] = category.name
                arrayCategories[index+1][1] = thisCategoryAmount
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
                let monthYearAmountOk = (month === this.selectedMonth && year === this.selectedYear && amountOk === true);
                let yearAmountOk = (year === this.selectedYear && amountOk === true);
                let categorieOk = (this.selectedCategory === 'Alle Kategorien' || transaction.category === this.selectedCategory);

                if((this.monatJahr === 'Monat' && categorieOk && monthYearAmountOk) || (this.monatJahr === 'Jahr' && categorieOk && yearAmountOk)){
                    this.selectedTransactions.push(transaction)
                } 
            })
            this.initChart();
        }
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
