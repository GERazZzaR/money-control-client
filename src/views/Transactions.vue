<template>
  <div class="transactions container">
    <div class="row justify-content-around">
      <div class="form-group col-md-4 mb-5">
        <h4><label for="selectTransaction">Auswahl</label></h4>
        <select
          v-model="selectedTransaction"
          @change="changeSelection()"
          style="cursor:pointer;"
          id="selectTransaction"
          class="form-control"
        >
          <option>Alle Transaktionen</option>
          <option>Einnahmen</option>
          <option>Ausgaben</option>
        </select>
      </div>
      <div class="form-group col-md-4 mb-5">
        <h4><label for="selectCategory">Kategorie</label></h4>
        <select
          v-model="selectedCategory"
          @change="changeSelection()"
          style="cursor:pointer;"
          id="selectCategory"
          class="form-control"
        >
          <option>Alle Kategorien</option>
          <option v-for="category in categories" :key="category.name">{{
            category.name
          }}</option>
        </select>
      </div>
    </div>
    <div class="row justify-content-around">
      <div class="form-group col-md-4 mb-5">
        <h4><label for="selectTransaction">Monat</label></h4>
        <select
          v-model="selectedMonth"
          @change="changeSelection()"
          style="cursor:pointer;"
          id="selectMonth"
          class="form-control"
        >
          <option>Alle Monate</option>
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
        </select>
      </div>
      <div class="form-group col-md-4 mb-5">
        <h4><label for="selectCategory">Jahr</label></h4>
        <select
          v-model="selectedYear"
          @change="changeSelection()"
          style="cursor:pointer;"
          id="selectYear"
          class="form-control"
        >
          <option>Alle Jahre</option>
          <option v-for="year in years" :key="year.id">{{ year }}</option>
        </select>
      </div>
    </div>
    <div class="row justify-content-around">
      <div class="form-group col mb-3">
        <h4>
          <label for="selectTransaction"
            >Ausgewählter Betrag:
            <b
              ><u>{{ this.amountSelected }}</u></b
            >
            €</label
          >
        </h4>
      </div>
    </div>
    <p id="noTransactions">Es konnten keine Transaktionen gefunden werden! :-(</p>
    <div class="card-columns">
      <div
        class="card m-2"
        v-for="transaction in transactions"
        :key="transaction.id"
        v-bind:class="{
          plus: transaction.amount.$numberDecimal > 0,
          minus: transaction.amount.$numberDecimal < 0,
          [transaction.category]: transaction.amount.$numberDecimal != 0,
          [transaction.date[6] +
          transaction.date[7] +
          transaction.date[8] +
          transaction.date[9]]: transaction.amount.$numberDecimal != 0,
          [transaction.date[3] + transaction.date[4]]:
            transaction.amount.$numberDecimal != 0,
          ['money' + transaction.amount.$numberDecimal]:
            transaction.amount.$numberDecimal != 0
        }"
      >
        <div
          class="card-header bg-primary"
          v-bind:class="{
            'bg-success': transaction.amount.$numberDecimal > 0,
            'bg-danger': transaction.amount.$numberDecimal < 0
          }"
        >
          <h5 class="card-title my-3">{{ transaction.note }}</h5>
        </div>
        <div class="card-body">
          <div class="row m-3">
            <div class="col">
              <p class="card-text"><b>Betrag: </b></p>
            </div>
            <div class="col">
              <p class="card-text amountx">
                {{ transaction.amount.$numberDecimal }} €
              </p>
            </div>
          </div>
          <div class="row m-3">
            <div class="col">
              <p class="card-text"><b>Datum: </b></p>
            </div>
            <div class="col">
              <p class="card-text">{{ transaction.date }}</p>
            </div>
          </div>
          <div class="row m-3">
            <div class="col">
              <p class="card-text"><b>Kategorie: </b></p>
            </div>
            <div class="col">
              <p class="card-text">{{ transaction.category }}</p>
            </div>
          </div>
          <div class="row m-3">
            <div class="col">
              <p class="card-text"><b>Wiederkehrend: </b></p>
            </div>
            <div class="col">
              <p class="card-text">{{ transaction.wiederkehrend }}</p>
            </div>
          </div>
          <div class="row m-3 mt-5">
            <div class="col">
              <a
                class="btn btn-outline-primary mr-3"
                @click="
                  $parent.fillModal(
                    transaction._id,
                    transaction.amount.$numberDecimal,
                    transaction.date,
                    transaction.wiederkehrend,
                    transaction.category,
                    transaction.note
                  )
                "
                href="#"
                data-toggle="modal"
                data-target="#updateTransactionModal"
                data-dismiss="modal"
                >Bearbeiten</a
              >
              <a
                class="btn btn-outline-primary"
                href="#"
                @click="setTransactionToDelete(transaction._id)"
                data-toggle="modal"
                data-target="#deleteModal"
                >Löschen</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Modal Wirklich löschen?-->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      data-backdrop="static"
      role="dialog"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">
              Transakion wirklich löschen?
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row justify-content-between">
              <div class="col-mx-auto ml-3">
                <button
                  type="button"
                  @click="setTransactionToDelete('')"
                  class="btn btn-secondary mt-1"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  Abbrechen
                </button>
              </div>
              <div class="col-mx-auto mr-3">
                <button
                  id="deleteTransaction"
                  type="button"
                  @click="deleteTransaction()"
                  class="btn btn-danger mt-1"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import TransactionsService from "@/services/TransactionsService";
import { mapState } from "vuex";
export default {
  name: "Transactions",
  components: {},
  data() {
    return {
      selectedCategory: "Alle Kategorien",
      selectedTransaction: "Alle Transaktionen",
      selectedMonth: "Alle Monate",
      selectedYear: "Alle Jahre",
      transactionToDelete: "",
      amountSelected: 0
    };
  },
  computed: {
    ...mapState(["transactions", "categories", "years", "helperReloadTransactions"])
  },
  watch: {
    helperReloadTransactions: function () {
      this.changeSelection()
    }
  },
  mounted: function() {
    this.setDate();
  },
  methods: {
    async deleteTransaction() {
      await TransactionsService.deleteTransaction(this.transactionToDelete);
      var indexToDelete = "";
      for (var a = 0; a < this.transactions.length; a++) {
        if (this.transactions[a]._id == this.transactionToDelete) {
          indexToDelete = a;
        }
      }
      await this.transactions.splice(indexToDelete, 1);
      this.changeSelection()
    },
    setTransactionToDelete(id) {
      this.transactionToDelete = id;
    },
    changeSelection() {
      $("#noTransactions").hide()
      $(".minus").hide();
      $(".plus").hide();
      if (this.selectedYear == "Alle Jahre") {
        if (this.selectedMonth == "Alle Monate") {
          if (this.selectedCategory == "Alle Kategorien") {
            if (this.selectedTransaction == "Alle Transaktionen") {
              $(".plus").show();
              $(".minus").show();
            } else if (this.selectedTransaction == "Einnahmen") {
              $(".plus").show();
            } else if (this.selectedTransaction == "Ausgaben") {
              $(".minus").show();
            }
          } else {
            if (this.selectedTransaction == "Alle Transaktionen") {
              $(".plus." + this.selectedCategory).show();
              $(".minus." + this.selectedCategory).show();
            } else if (this.selectedTransaction == "Einnahmen") {
              $(".plus." + this.selectedCategory).show();
            } else if (this.selectedTransaction == "Ausgaben") {
              $(".minus." + this.selectedCategory).show();
            }
          }
        } else {
          $(".minus").hide();
          $(".plus").hide();
          if (this.selectedCategory == "Alle Kategorien") {
            if (this.selectedTransaction == "Alle Transaktionen") {
              $(".plus." + this.selectedMonth).show();
              $(".minus." + this.selectedMonth).show();
            } else if (this.selectedTransaction == "Einnahmen") {
              $(".plus." + this.selectedMonth).show();
            } else if (this.selectedTransaction == "Ausgaben") {
              $(".minus." + this.selectedMonth).show();
            }
          } else {
            if (this.selectedTransaction == "Alle Transaktionen") {
              $(
                ".plus." + this.selectedCategory + "." + this.selectedMonth
              ).show();
              $(
                ".minus." + this.selectedCategory + "." + this.selectedMonth
              ).show();
            } else if (this.selectedTransaction == "Einnahmen") {
              $(
                ".plus." + this.selectedCategory + "." + this.selectedMonth
              ).show();
            } else if (this.selectedTransaction == "Ausgaben") {
              $(
                ".minus." + this.selectedCategory + "." + this.selectedMonth
              ).show();
            }
          }
        }
      } else {
        if (this.selectedMonth == "Alle Monate") {
          if (this.selectedCategory == "Alle Kategorien") {
            if (this.selectedTransaction == "Alle Transaktionen") {
              $(".plus." + this.selectedYear).show();
              $(".minus." + this.selectedYear).show();
            } else if (this.selectedTransaction == "Einnahmen") {
              $(".plus." + this.selectedYear).show();
            } else if (this.selectedTransaction == "Ausgaben") {
              $(".minus." + this.selectedYear).show();
            }
          } else {
            if (this.selectedTransaction == "Alle Transaktionen") {
              $(
                ".plus." + this.selectedCategory + "." + this.selectedYear
              ).show();
              $(
                ".minus." + this.selectedCategory + "." + this.selectedYear
              ).show();
            } else if (this.selectedTransaction == "Einnahmen") {
              $(
                ".plus." + this.selectedCategory + "." + this.selectedYear
              ).show();
            } else if (this.selectedTransaction == "Ausgaben") {
              $(
                ".minus." + this.selectedCategory + "." + this.selectedYear
              ).show();
            }
          }
        } else {
          if (this.selectedCategory == "Alle Kategorien") {
            if (this.selectedTransaction == "Alle Transaktionen") {
              $(".plus." + this.selectedMonth + "." + this.selectedYear).show();
              $(
                ".minus." + this.selectedMonth + "." + this.selectedYear
              ).show();
            } else if (this.selectedTransaction == "Einnahmen") {
              $(".plus." + this.selectedMonth + "." + this.selectedYear).show();
            } else if (this.selectedTransaction == "Ausgaben") {
              $(
                ".minus." + this.selectedMonth + "." + this.selectedYear
              ).show();
            }
          } else {
            if (this.selectedTransaction == "Alle Transaktionen") {
              $(
                ".plus." +
                  this.selectedCategory +
                  "." +
                  this.selectedMonth +
                  "." +
                  this.selectedYear
              ).show();
              $(
                ".minus." +
                  this.selectedCategory +
                  "." +
                  this.selectedMonth +
                  "." +
                  this.selectedYear
              ).show();
            } else if (this.selectedTransaction == "Einnahmen") {
              $(
                ".plus." +
                  this.selectedCategory +
                  "." +
                  this.selectedMonth +
                  "." +
                  this.selectedYear
              ).show();
            } else if (this.selectedTransaction == "Ausgaben") {
              $(
                ".minus." +
                  this.selectedCategory +
                  "." +
                  this.selectedMonth +
                  "." +
                  this.selectedYear
              ).show();
            }
          }
        }
      }
      if($(".card").is(":visible") == false){
        $("#noTransactions").show();
      }
      this.calculateAmount();
    },
    calculateAmount() {
      this.amountSelected = 0;
      for (var a = 0; a < $("p:visible.amountx").length; a++) {
        var amount = $("p:visible.amountx")[a].textContent.slice(
          0,
          $("p:visible.amountx")[a].textContent.length - 2
        );
        this.amountSelected += parseInt(amount);
      }
    },
    setDate() {
      this.selectedYear = new Date().getFullYear();
      var currentMonth = new Date().getMonth() + 1;
      currentMonth.toString();
      if (new Date().getMonth() + 1 < 10) {
        this.selectedMonth = "0" + currentMonth;
      } else {
        this.selectedMonth = currentMonth;
      }
      this.changeSelection();
    }
  }
};
</script>

<style scoped>
.card-text {
  text-align: left;
}
</style>
