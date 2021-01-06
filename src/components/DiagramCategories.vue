<template>
    <div class="DiagramCategories">
        <div class="container donutCell">
            <div class="row justify-content-md-center">
                <select v-model="selectedInOutCategories"
                    style="cursor: pointer; text-align-last:center;"
                    class="form-control w-50 my-5"
                >
                    <option selected>Ausgaben</option>
                    <option>Einnahmen</option>

                </select>
            </div>
            <div align="center" class="donutDiv pb-5" id="piechartCategories"></div>
            <p id="noDataAvailable" class="pb-5">Keine Daten vorhanden :-(</p>
        </div>
    </div>
</template>

<script>
/* global $ */
/* global google */
import { mapState } from "vuex";
export default {
  name: "DiagramCategories",
  data: function() {
    return {
      selectedInOutCategories: "Ausgaben",
    };
  },
  mounted() {
    this.drawChart();
  },
  computed: {
    ...mapState(["transactions", "categories", "availableBudget", "selectedMonth", "selectedYear", "monatJahr"])
  },
  watch: {
    availableBudget: function() {
      this.drawChart();
    },
    selectedInOutCategories: function() {
      this.drawChart();
    },
  },
    methods: {
        drawChart() {
            $("#noDataAvailable").hide();
            $("#piechartCategories").show();
            var arrayCategories = new Array();
            arrayCategories[0] = new Array(2);
            arrayCategories[0][0] = "Geld";
            arrayCategories[0][1] = "Euro";

            for(var a=0;a<Object.keys(this.categories).length; a++){
                arrayCategories[a+1] = new Array(2)
                var thisCategoryAmount = 0.0;
                for(var b=0;b<Object.keys(this.transactions).length;b++){
                    if(this.transactions[b].category == this.categories[a].name){
                        var thisMonth = this.transactions[b].date[3] + this.transactions[b].date[4];
                        var thisYear = this.transactions[b].date[6] + this.transactions[b].date[7] + this.transactions[b].date[8] + this.transactions[b].date[9];
                        if(this.monatJahr == "Monat"){
                            if(thisMonth == this.selectedMonth && thisYear == this.selectedYear){
                                if(this.selectedInOutCategories == "Einnahmen"){
                                    if(this.transactions[b].amount.$numberDecimal > 0){
                                        thisCategoryAmount += parseInt(this.transactions[b].amount.$numberDecimal);
                                    }
                                }
                                else{
                                    if(this.transactions[b].amount.$numberDecimal < 0){
                                        thisCategoryAmount += parseInt(this.transactions[b].amount.$numberDecimal*-1);
                                    }
                                }
                            }
                        }
                        else{
                            if(thisYear == this.selectedYear){
                                if(this.selectedInOutCategories == "Einnahmen"){
                                    if(this.transactions[b].amount.$numberDecimal > 0){
                                        thisCategoryAmount += parseInt(this.transactions[b].amount.$numberDecimal);
                                    }
                                }
                                else{
                                    if(this.transactions[b].amount.$numberDecimal < 0){
                                        thisCategoryAmount += parseInt(this.transactions[b].amount.$numberDecimal*-1);
                                    }
                                }
                            }
                        }
                    }
                }
                arrayCategories[a+1][0] = this.categories[a].name
                arrayCategories[a+1][1] = thisCategoryAmount
            }
            arrayCategories.sort(function(a, b){return b[1]-a[1]})

            var amountNullCategories = 0;
            
            for(var a=0;a<Object.keys(arrayCategories).length;a++){
                if(arrayCategories[a][1] == 0){
                    amountNullCategories += 1;
                }
            }

            if(amountNullCategories == Object.keys(arrayCategories).length-1){
                $("#noDataAvailable").show();
                $("#piechartCategories").hide();
            }
            
            // Load google charts
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(drawChart);

            // Draw the chart and set the chart values
            function drawChart() {
                var data = google.visualization.arrayToDataTable(arrayCategories);
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
                var chart = new google.visualization.PieChart(
                    document.getElementById("piechartCategories")
                );
                chart.draw(data, options);
            }
        }
    }
};
</script>

<style>
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
