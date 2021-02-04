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
    <p v-if="transactionsToDisplay.length === 0">Es konnten keine Transaktionen gefunden werden! :-(</p>
    <div class="card-columns">
      <div
        class="card m-2"
        v-for="transaction in transactionsToDisplay"
        :key="transaction.id"
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
                  $parent.modalTitle = 'Transaktion bearbeiten',
                  $parent.modalNew = false,
                  $parent.fillModal(
                    transaction._id,
                    transaction.amount.$numberDecimal,
                    transaction.date,
                    transaction.wiederkehrend,
                    transaction.category,
                    transaction.note
                  )
                "
                data-toggle="modal"
                data-target="#transactionModal"
                data-dismiss="modal"
                >Bearbeiten</a
              >
              <a
                class="btn btn-outline-primary"
                @click="transactionToDelete = transaction._id"
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
                  @click="transactionToDelete = ''"
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
      transactionsToDisplay: [],
      selectedCategory: 'Alle Kategorien',
      selectedTransaction: 'Alle Transaktionen',
      selectedMonth: 'Alle Monate',
      selectedYear: 'Alle Jahre',
      transactionToDelete: '',
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
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = String(new Date().getMonth() + 1);
    if (this.selectedMonth.length === 1) {
      this.selectedMonth = "0" + this.selectedMonth;
    }
    this.changeSelection();
  },
  methods: {
    async deleteTransaction() {
      await TransactionsService.deleteTransaction(this.transactionToDelete);
      let indexToDelete;
      await this.transactions.forEach((transaction, index) => {
        if (transaction._id === this.transactionToDelete) {
          indexToDelete = index;
        }
      })
      await this.transactions.splice(indexToDelete, 1);
      this.changeSelection();
    },
    changeSelection() {
      this.transactionsToDisplay = [];
      let bedingung; 
      this.transactions.forEach(transaction => {
        let positiveAmount = transaction.amount.$numberDecimal > 0;
        let categoryMatch = transaction.category === this.selectedCategory;
        let transactionMonth = transaction.date[3] + transaction.date[4];
        let monthMatch = transactionMonth === this.selectedMonth;
        let transactionYear = transaction.date[6] + transaction.date[7] + transaction.date[8] + transaction.date[9];
        let yearMatch = transactionYear === String(this.selectedYear);

        let bedingung = true;
        if(this.selectedYear !== "Alle Jahre"){
          bedingung = bedingung && yearMatch;
        }
        if(this.selectedMonth !== "Alle Monate"){
          bedingung = bedingung && monthMatch;
        }
        if(this.selectedCategory !== "Alle Kategorien"){
          bedingung = bedingung && categoryMatch;
        }
        if(this.selectedTransaction !== "Alle Transaktionen"){
          if (this.selectedTransaction == "Einnahmen"){
            bedingung = bedingung && positiveAmount;
          } else {
            bedingung = bedingung && !positiveAmount;
          }
        }
        if(bedingung){
          this.transactionsToDisplay.push(transaction);
        }
      })
      this.calculateAmount();
    },
    calculateAmount() {
      this.amountSelected = 0;
      this.transactionsToDisplay.forEach(transaction => {
        this.amountSelected += Number(transaction.amount.$numberDecimal);
      })
      this.$parent.calculateAmounts();
    },
  }
};
</script>

<style scoped>
.card-text {
  text-align: left;
}
</style>
