<template>
  <div class="DiagramInOut">
    <div class="container donutCell">
      <div align="center" class="donutDiv row justify-content-center" id="piechart"></div>
      <div class="centerLabel">
        <p>Verfügbar</p>
        <p>{{ availableBudget }} €</p>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
/* global google */
import { mapState } from "vuex";
export default {
  name: "DiagramInOut",
  data() {
    return {

    };
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.drawChart();
  },
  computed: {
    ...mapState(["availableBudget", "totalBudget", "totalSpend"])
  },
  watch: {
    availableBudget: function() {
      this.drawChart();
    },
    transactions: function() {
      this.drawChart();
    }
  },
  methods: {
    drawChart() {
      var budget = this.availableBudget;
      var spend = this.totalSpend * -1;
      if (budget == 0 && spend == 0) {
        budget = 0;
        spend = 1;
      } else if (this.totalBudget < spend) {
        budget = 0;
        spend = 1;
      }

      // Load google charts
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);

      // Draw the chart and set the chart values
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ["Geld", "Euro"],
          ["Ausgaben", spend],
          ["Einnahmen", budget]
        ]);

        // Optional; add a title and set the width and height of the chart
        var options = {
          pieHole: 0.9,
          width: $(window).width() * 0.5,
          height: $(window).width() * 0.5,
          legend: "none",
          pieSliceText: "none",
          tooltip: { trigger: "none" },
          slices: {
            0: { color: "#dc3545" },
            1: { color: "#28a745" }
          },
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
          document.getElementById("piechart")
        );
        chart.draw(data, options);
      }
    },
    resize(e) {
      this.drawChart()
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
