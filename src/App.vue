<template>
  <div id="app">
    <Navbar class="mb-5" style="height:80px;" />
    <div
      class="spinner-border"
      role="status"
      v-show="this.$store.laden == true"
      label="Loading..."
    >
      <span class="sr-only">Loading...</span>
    </div>
    <router-view id="routerView" />

    <!--Modal Neue Ausgabe hinzufügen-->
    <div
      class="modal fade"
      id="newMinusModal"
      tabindex="-1"
      data-backdrop="static"
      role="dialog"
      aria-labelledby="newMinusModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title" id="newMinusModalLabel">
              Neue Ausgabe hinzufügen
            </h5>
            <button
              type="button"
              @click="resetTransaction()"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="needs-validation-Minus" 
              novalidate="true"
              @submit="validate('add', $event)"
            >
              <div class="form-group">
                <label>Titel *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="note"
                  placeholder="Gib den Titel an."
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib einen Titel an.
                </div>
              </div>
              <div class="form-group">
                <label>Betrag in Euro *</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="amount"
                  placeholder="Gib den Betrag ein."
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib einen Betrag ein.
                </div>
              </div>
              <div class="form-group">
                <label>Datum *</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="date"
                  id="datetimepickerSpend"
                  placeholder="Gib das Datum ein"
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib ein Datum ein.
                </div>
                <div class="row mt-2">
                  <div class="col-3">
                    <small>Wiederkehrend?</small>
                  </div>
                  <div class="col">
                    <small>Nie</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Nie"
                    />
                    <small class="ml-5">Monat</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Monat"
                    />
                    <small class="ml-5">Jahr</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Jahr"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Kategorie *</label>
                <div class="row">
                  <div class="col">
                    <select
                      v-model="category"
                      style="cursor:pointer;"
                      class="form-control"
                      placeholder="Wähle eine Kategorie"
                      required
                    >
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :selected="category == 'Allgemein'"
                        >{{ category.name }}</option
                      >
                    </select>
                    <div class="invalid-feedback">
                      Bitte gib eine Kategorie ein.
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-toggle="modal"
                      data-target="#addCategoryModal"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <br />
              <div class="row justify-content-between">
                <div class="col-mx-auto ml-3">
                  <button
                    type="button"
                    @click="resetTransaction()"
                    class="btn btn-secondary mt-1"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Abbrechen
                  </button>
                </div>
                <div class="col-mx-auto mr-3">
                  <button
                    id="addMinus"
                    type="submit"
                    @click="
                      positiveAmount = false
                    "
                    class="btn btn-primary mt-1"
                    aria-label="Close"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!--Modal Neue Einnahme hinzufügen-->
    <div
      class="modal fade"
      id="newPlusModal"
      tabindex="-1"
      data-backdrop="static"
      role="dialog"
      aria-labelledby="newPlusModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title" id="newPlusModalLabel">
              Neue Einnahme hinzufügen
            </h5>
            <button
              type="button"
              @click="resetTransaction()"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="needs-validation-Plus" 
              novalidate="true"
              @submit="validate('add', $event)"
            >
              <div class="form-group">
                <label>Titel *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="note"
                  placeholder="Gib den Titel an"
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib einen Titel an.
                </div>
              </div>
              <div class="form-group">
                <label>Betrag in Euro *</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="amount"
                  placeholder="Gib den Betrag ein."
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib einen Betrag ein.
                </div>
              </div>
              <div class="form-group">
                <label>Datum *</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="date"
                  id="datetimepickerBudget"
                  placeholder="Gib das Datum ein"
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib ein Datum ein.
                </div>
                <div class="row mt-2">
                  <div class="col-3">
                    <small>Wiederkehrend?</small>
                  </div>
                  <div class="col">
                    <small>Nie</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Nie"
                    />
                    <small class="ml-5">Monat</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Monat"
                    />
                    <small class="ml-5">Jahr</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Jahr"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Kategorie *</label>
                <div class="row">
                  <div class="col">
                    <select
                      v-model="category"
                      style="cursor:pointer;"
                      class="form-control"
                      placeholder="Wähle eine Kategorie"
                      required
                    >
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        >{{ category.name }}</option
                      >
                    </select>
                    <div class="invalid-feedback">
                      Bitte gib eine Kategorie ein.
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-toggle="modal"
                      data-target="#addCategoryModal"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <br />
              <div class="row justify-content-between">
                <div class="col-mx-auto ml-3">
                  <button
                    type="button"
                    @click="resetTransaction()"
                    class="btn btn-secondary mt-1"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Abbrechen
                  </button>
                </div>
                <div class="col-mx-auto mr-3">
                  <button
                    id="addPlus"
                    type="submit"
                    @click="
                      positiveAmount = true;
                    "
                    class="btn btn-primary mt-1"
                    aria-label="Close"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!--Modal Enddatum hinzufügen-->
    <div
      class="modal fade"
      style="z-index: 9999;"
      id="endDateModal"
      tabindex="-1"
      data-backdrop="static"
      role="dialog"
      aria-labelledby="endDateModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title" id="newPlusModalLabel">
              Ende der wiederkehrenden Transaktion
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
            <form class="needs-validation-Enddate"
              novalidate="novalidate"
              @submit="validate('add', $event)"
            >
              <p>
                Bis zu welchem Datum soll die Transaktion wiederholt werden?
              </p>
              <div class="form-group">
                <label>Datum *</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="endDate"
                  id="datetimepickerEndDate"
                  placeholder="Gib das Datum ein."
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib ein Datum ein.
                </div>
              </div>
              <br />
              <div class="row justify-content-between">
                <div class="col-mx-auto ml-3">
                  <button
                    type="button"
                    @click="endDate = null"
                    class="btn btn-secondary mt-1"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Abbrechen
                  </button>
                </div>
                <div class="col-mx-auto mr-3">
                  <button
                    type="submit"
                    class="btn btn-primary mt-1"
                    aria-label="Close"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!--Modal Transaktion bearbeiten-->
    <div
      class="modal fade"
      id="updateTransactionModal"
      tabindex="-1"
      data-backdrop="static"
      role="dialog"
      aria-labelledby="updateTransactionModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title" id="updateTransactionModalLabel">
              Transaktion bearbeiten
            </h5>
            <button
              type="button"
              @click="resetTransaction()"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="needs-validation-Edit" 
              novalidate="true"
              @submit="validate('edit', $event)"
            >
              <div class="form-group">
                <label>Titel *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="note"
                  placeholder="Gib den Titel an."
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib einen Titel an.
                </div>
              </div>
              <div class="form-group">
                <label>Betrag in Euro *</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="amount"
                  placeholder="Gib den Betrag ein."
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib einen Betrag ein.
                </div>
              </div>
              <div class="form-group">
                <label>Datum *</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="date"
                  id="datetimepickerEdit"
                  placeholder="Gib das Datum ein"
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib ein Datum ein.
                </div>
                <div class="row mt-2">
                  <div class="col-3">
                    <small>Wiederkehrend?</small>
                  </div>
                  <div class="col">
                    <small>Nie</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Nie"
                    />
                    <small class="ml-5">Monat</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Monat"
                    />
                    <small class="ml-5">Jahr</small>
                    <input
                      v-model="wiederkehrend"
                      type="radio"
                      class="form-check-input ml-2"
                      name="wiederkehrendOptions"
                      value="Jahr"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Kategorie *</label>
                <div class="row">
                  <div class="col">
                    <select
                      v-model="category"
                      style="cursor:pointer;"
                      class="form-control"
                      placeholder="Wähle eine Kategorie"
                      required
                    >
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        >{{ category.name }}</option
                      >
                    </select>
                    <div class="invalid-feedback">
                      Bitte gib eine Kategorie ein.
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-toggle="modal"
                      data-target="#addCategoryModal"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <br />
              <div class="row justify-content-between">
                <div class="col-mx-auto ml-3">
                  <button
                    id="closeEditTransaction"
                    type="button"
                    @click="resetTransaction()"
                    class="btn btn-secondary mt-3"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Abbrechen
                  </button>
                </div>
                <div class="col-mx-auto mr-3">
                  <button
                    id="updateTransaction"
                    type="submit"
                    class="btn btn-primary mt-3"
                    aria-label="Close"
                  >
                    Ändern
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!--Modal Kategorie hinzufügen-->
    <div
      class="modal fade"
      id="addCategoryModal"
      tabindex="-1"
      data-backdrop="static"
      role="dialog"
      aria-labelledby="addCategoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title" id="addCategoryModalLabel">
              Kategorie hinzufügen
            </h5>
            <button
              type="button"
              @click="resetNewCategory()"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="needs-validation-addCategory" 
              novalidate="true"
              @submit="validate('category', $event)"
            >
              <div class="form-group">
                <label>Kategorie *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newCategory"
                  placeholder="Name der Kategorie *"
                  required
                />
                <div class="invalid-feedback">
                  Gib den Namen der Kategorie an.
                </div>
              </div>
              <br />
              <div class="row justify-content-between">
                <div class="col-mx-auto ml-3">
                  <button
                    id="closeCategory"
                    type="button"
                    @click="resetNewCategory()"
                    class="btn btn-secondary mt-1"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Abbrechen
                  </button>
                </div>
                <div class="col-mx-auto mr-3">
                  <button
                    id="addCategory"
                    type="submit"
                    class="btn btn-primary mt-1"
                    aria-label="Close"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.centerLabel {
  font-size: 14px;
  top: 43%;
}

@media (min-width: 576px) {
  .centerLabel {
    font-size: 24px;
    top: 40%;
  }
}

@media (min-width: 576px) {
  .card-columns {
    column-count: 2;
  }
}

#app {
  font-family: "Montserrat";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#routerView {
  text-align: center;
}
.material-icons {
  vertical-align: middle;
}
</style>

<script>
/* global $ */
import Navbar from "@/components/Navbar.vue";
import TransactionsService from "@/services/TransactionsService";
import CategoriesService from "@/services/CategoriesService";
import { mapState } from "vuex";
export default {
  name: "App",
  components: {
    Navbar
  },
  data: function() {
    return {
      availableBudget: 0,
      totalSpend: null,
      totalBudget: null,
      transactions: [],
      allTransactions: [],
      categories: [],
      amount: null,
      date: "",
      wiederkehrend: "Nie",
      category: "Allgemein",
      note: null,
      positiveAmount: null,
      endDate: null,
      t_id: null,
      newCategory: ""
    };
  },
  created() {
    this.fetchAllTransactions();
    this.fetchAllCategories();
  },
  computed: {
    ...mapState(["selectedMonth", "selectedYear", "monatJahr"])
  },
  watch: {
    $route: function () {
      $('.navbar-toggler').trigger('click');
    }
  },
  methods: {
    async fetchAllTransactions() {
      const response = await TransactionsService.fetchAllTransactions();
      this.allTransactions = response.data.transactions;
      this.updateTransactionArray(this.allTransactions);
      this.initialLoad();
    },

    initialLoad() {
      var yearsHelper = [];
      for (var i = 0; i < this.transactions.length; i++) {
        if (this.transactions[i].date.length > 13) {
          this.transactions[i].date = this.getNormalFormatTime(
            this.transactions[i].date
          );
          var currentYear =
            this.transactions[i].date[6] +
            this.transactions[i].date[7] +
            this.transactions[i].date[8] +
            this.transactions[i].date[9];
          if (!yearsHelper.includes(currentYear)) {
            yearsHelper.push(currentYear);
          }
        }
      }
      this.setDate();
      this.$store.dispatch("updateYears", yearsHelper);
      this.calculateAmounts();
    },

    setDate() {
      let d = new Date();
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      let year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      this.date = year + "-" + month + "-" + day;
    },

    calculateAmounts() {
      this.availableBudget = 0.0;
      this.totalBudget = 0.0;
      this.totalSpend = 0.0;
      for (var i = 0; i < this.transactions.length; i++) {
        if (this.monatJahr == "Monat") {
          if (
            parseInt(
              this.transactions[i].date[3] + this.transactions[i].date[4]
            ) == this.selectedMonth &&
            parseInt(
              this.transactions[i].date[6] +
                this.transactions[i].date[7] +
                this.transactions[i].date[8] +
                this.transactions[i].date[9]
            ) == this.selectedYear
          ) {
            this.availableBudget =
              this.availableBudget +
              Math.round(this.transactions[i].amount.$numberDecimal * 100) /
                100;
            if (
              Math.round(this.transactions[i].amount.$numberDecimal * 100) /
                100 >
              0
            ) {
              this.totalBudget =
                this.totalBudget +
                Math.round(this.transactions[i].amount.$numberDecimal * 100) /
                  100;
            } else {
              this.totalSpend =
                this.totalSpend +
                Math.round(this.transactions[i].amount.$numberDecimal * 100) /
                  100;
            }
          }
        } else {
          if (
            parseInt(
              this.transactions[i].date[6] +
                this.transactions[i].date[7] +
                this.transactions[i].date[8] +
                this.transactions[i].date[9]
            ) == this.selectedYear
          ) {
            this.availableBudget =
              this.availableBudget +
              Math.round(this.transactions[i].amount.$numberDecimal * 100) / 
                100;
            if (
              Math.round(this.transactions[i].amount.$numberDecimal * 100) /
                100 >
              0
            ) {
              this.totalBudget =
                this.totalBudget +
                Math.round(this.transactions[i].amount.$numberDecimal * 100) /
                  100;
            } else {
              this.totalSpend =
                this.totalSpend +
                Math.round(this.transactions[i].amount.$numberDecimal * 100) /
                  100;
            }
          }
        }
      }
      this.$store.dispatch("updateTransactions", this.transactions);

      this.availableBudget = Math.round(this.availableBudget * 100) / 100;
      this.totalBudget = Math.round(this.totalBudget * 100) / 100;
      this.totalSpend = Math.round(this.totalSpend * 100) / 100;

      this.$store.dispatch("updateAvailableBudget", this.availableBudget);
      this.$store.dispatch("updateTotalBudget", this.totalBudget);
      this.$store.dispatch("updateTotalSpend", this.totalSpend);
    },

    updateTransactionArray(transactionParameter) {
      this.transactions = transactionParameter;
    },

    async fetchAllCategories() {
      const response = await CategoriesService.fetchAllCategories();
      this.categories = response.data.categories;
      this.$store.dispatch("updateCategories", this.categories);
    },

    async addCategory() {
      if (this.newCategory != "" && this.newCategory != null) {
        await CategoriesService.addCategory({
          name: this.newCategory
        });
        this.fetchAllCategories();
        this.resetNewCategory();
      }
    },

    resetTransaction() {
      this.amount = null;
      this.setDate();
      this.endDate = null;
      this.wiederkehrend = "Nie";
      this.category = "Allgemein";
      this.note = null;
      this.t_id = null;
      this.positiveAmount = null;

      $(".needs-validation-Minus").removeClass("was-validated");
      $(".needs-validation-Plus").removeClass("was-validated");
      $(".needs-validation-Edit").removeClass("was-validated");
    },

    async addTransaction() {
      var finallyAddTransaction = false;
      console.log("TADFJJJJJJJ")
      //Wenn wiederkehrend, aber kein Enddatum festgelegt wurde
      if (
        this.wiederkehrend != "Nie" &&
        this.endDate == null &&
        this.amount != "" &&
        this.amount != null &&
        this.date != "" &&
        this.date != null &&
        this.category != "" &&
        this.category != null &&
        this.note != null
      ) {
        this.endDate = new Date().getFullYear() + 1 + "-01-01";
        $("#endDateModal").modal("show");
      }
      //Wenn wiederkehrend, und Enddatum festgelegt wurde
      else if (
        this.wiederkehrend != "Nie" &&
        this.endDate != null &&
        this.amount != "" &&
        this.amount != null &&
        this.date != "" &&
        this.date != null &&
        this.category != "" &&
        this.category != null &&
        this.note != null
      ) {
        $("#endDateModal").modal("hide");
        $("#newMinusModal").modal("hide");
        $("#newPlusModal").modal("hide");
        finallyAddTransaction = true;
      }
      //Wenn nicht wiederkehrend
      else if (
        this.wiederkehrend == "Nie" &&
        this.amount != "" &&
        this.amount != null &&
        this.date != "" &&
        this.date != null &&
        this.category != "" &&
        this.category != null &&
        this.note != null
      ) {
        finallyAddTransaction = true;
      }
      if (finallyAddTransaction == true) {
        if (this.positiveAmount == false) {
          this.amount = this.amount * -1;
        }
        if (this.wiederkehrend == "Monat" && this.endDate != null) {
          var beginDate = new Date(this.date);
          var beginDateDay = beginDate.getDate();
          var beginDateMonth = beginDate.getMonth() + 1;
          var beginDateYear = beginDate.getFullYear();

          var endingDate = new Date(this.endDate);
          var endingDateDay = endingDate.getDate();
          var endingDateMonth = endingDate.getMonth() + 1;
          var endingDateYear = endingDate.getFullYear();
          endingDate = new Date(endingDateYear, endingDateMonth, endingDateDay);
          var dateToAdd = new Array();
          while (beginDate != -1) {
            if (beginDateMonth > 12) {
              beginDateMonth = 1;
              beginDateYear += 1;
            }

            var beginDateDayHelp = beginDateDay;

            if (
              beginDateDayHelp == 31 &&
              (beginDateMonth == 4 ||
                beginDateMonth == 6 ||
                beginDateMonth == 9 ||
                beginDateMonth == 11)
            ) {
              beginDateDayHelp = 30;
              console.log("Auf 30 gesetzt" + beginDateMonth);
            } else if (beginDateDay > 28 && beginDateMonth == 2) {
              beginDateDayHelp == 28;
              console.log("Auf 28 gesetzt" + beginDateMonth);
            }
            var beginDateMonthHelp = beginDateMonth + 1;
            var beginDateDayCheck = 31;
            console.log(beginDateMonthHelp);

            if (
              beginDateMonthHelp == 4 ||
              beginDateMonthHelp == 6 ||
              beginDateMonthHelp == 9 ||
              beginDateMonthHelp == 11
            ) {
              beginDateDayCheck = 30;
            } else if (beginDateMonthHelp == 2) {
              beginDateDayCheck = 28;
            }
            console.log(beginDateDayCheck + " Check Zahl");

            var beginDateHelp = new Date(
              beginDateYear,
              beginDateMonth,
              beginDateDayCheck
            );
            console.log(beginDateHelp);
            if (beginDateHelp < endingDate) {
              //console.log(new Date(beginDateYear, beginDateMonth, beginDateDayHelp))
              dateToAdd.push(
                new Date(beginDateYear, beginDateMonth, beginDateDayHelp)
              );
              beginDateMonth += 1;
            } else {
              console.log(
                new Date(beginDateYear, beginDateMonth, beginDateDayHelp)
              );
              //dateToAdd.push(new Date(beginDateYear, beginDateMonth, beginDateDayHelp))
              break;
            }
          }
        }
        await TransactionsService.addTransaction({
          amount: this.amount,
          date: this.date,
          wiederkehrend: this.wiederkehrend,
          category: this.category,
          note: this.note
        });
        this.resetTransaction();
        this.fetchAllTransactions();

        $("#newMinusModal").modal("hide");
        $("#newPlusModal").modal("hide");
      }
    },

    async updateTransaction() {
      if (
        this.amount != "" &&
        this.amount != null &&
        this.date != "" &&
        this.date != null &&
        this.category != "" &&
        this.category != null &&
        this.note != null
      ) {
        var indexToEdit = "";
        for (var a = 0; a < this.transactions.length; a++) {
          if (this.transactions[a]._id == this.t_id) {
            indexToEdit = a;
          }
        }
        this.transactions[indexToEdit].amount.$numberDecimal = this.amount;
        this.transactions[indexToEdit].date = this.getNormalFormatTime(
          this.date
        );
        this.transactions[indexToEdit].wiederkehrend = this.wiederkehrend;
        this.transactions[indexToEdit].category = this.category;
        this.transactions[indexToEdit].note = this.note;

        await TransactionsService.updateTransaction({
          id: this.t_id,
          amount: this.amount,
          date: this.date,
          wiederkehrend: this.wiederkehrend,
          category: this.category,
          note: this.note
        });
        this.resetTransaction();
        this.calculateAmounts();
        this.$store.dispatch("updateHelperReloadTransactions", 1);
      }
    },

    fillModal(id, amount, date, wiederkehrend, category, note) {
      this.t_id = id;
      this.amount = amount;
      this.date = this.getDatabaseFormatTime(date).substring(0, 10);
      this.wiederkehrend = wiederkehrend;
      this.category = category;
      this.note = note;
    },

    getNormalFormatTime(time) {
      var timeArray = time.split("");
      var year = timeArray[0] + timeArray[1] + timeArray[2] + timeArray[3];
      var month = timeArray[5] + timeArray[6];
      var day = timeArray[8] + timeArray[9];
      return day + "." + month + "." + year;
    },
    getDatabaseFormatTime(time) {
      var timeArray = time.split("");
      var day = timeArray[0] + timeArray[1];
      var month = timeArray[3] + timeArray[4];
      var year = timeArray[6] + timeArray[7] + timeArray[8] + timeArray[9];
      var newDate = year + "-" + month + "-" + day + "T00:00:00+00:00";
      return newDate;
    },
    resetNewCategory() {
      this.newCategory = "";
      $(".needs-validation-addCategory").removeClass("was-validated");
    },
    validate: function(form, e){
      if(this.t_id != null){
        form = 'edit'
      }
      console.log(form)
      if (form == "edit"){
        e.preventDefault()
      }
      let valid = true;

      if(!this.amount){
        valid = false;
      }
      if(this.date == ""){
        valid = false;
      }
      if(!this.note){
        valid = false;
      }

      if(form == 'category') {
        e.preventDefault();
        if (this.newCategory != "") {
          this.addCategory();
          $("#closeCategory").trigger('click');
        } else {
          $(".needs-validation-addCategory").addClass("was-validated");
        }
      } else if(!valid) {
        $(".needs-validation-Edit").addClass("was-validated")
        $(".needs-validation-Minus").addClass("was-validated")
        $(".needs-validation-Plus").addClass("was-validated")
        e.preventDefault();
      } else if (!(this.wiederkehrend == "Nie") && this.endDate != null) {
        if (form == 'add') {
          this.addTransaction();
        }
        else if (form == 'edit') {
          this.updateTransaction();
        }
      } else if (!(this.wiederkehrend == "Nie")) {
        if ($('#endDateModal').is(':visible')) {
          $(".needs-validation-Enddate").addClass("was-validated");
        } else {
          $(".needs-validation-Enddate").removeClass("was-validated");
          $("#endDateModal").modal("show");
        }
        e.preventDefault();
      } else {
        if (form == 'add') {
          this.addTransaction();
        }
        else if (form == 'edit') {
          $("#closeEditTransaction").trigger('click');
          this.updateTransaction();
        }
      }
      
      
      
    }
  }
};

//       var formsMinus = $(".needs-validation-Minus");
//       var formsPlus = $(".needs-validation-Plus");
//       var formsEdit = $(".needs-validation-Edit");
//       var formsAddCategory = $(".needs-validation-addCategory");

</script>
