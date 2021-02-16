<template>
  <div id="app">
    <Navbar v-bind:class=" { 'mb-5': $route.path !== '/dashboard' }" style="height:80px;" />
    <Projects ref="project" class="m-3" />
    <router-view id="routerView" />

    <!--Modal Transaktion hinzufügen / bearbeiten-->
    <div
      class="modal fade"
      id="transactionModal"
      tabindex="-1"
      data-backdrop="static"
      role="dialog"
      aria-labelledby="transactionModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title" id="transactionModalLabel">
              {{ modalTitle }}
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
            <form class="needs-validation-Transaction" 
              novalidate="true"
              @submit="$event.preventDefault()"
              v-bind:class="{ 'was-validated': transactionValidated }"
            >
              <div class="form-group">
                <label>Titel *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="title"
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
                  v-bind:class="{ 'is-invalid': (amount <= 0 && amount) === 0 }"
                  type="number"
                  class="form-control"
                  v-model.number="amount"
                  min="0"
                  placeholder="Gib den Betrag ein."
                  required
                />
                <div class="invalid-feedback">
                  Bitte gib einen Betrag größer 0 ein.
                </div>
              </div>
              <div class="form-group">
                <label>Datum *</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="date"
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
                <div class="row ml-0">
                  <label>Kategorie *</label>
                </div>
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
                    id="closeTransaction"
                  >
                    Abbrechen
                  </button>
                </div>
                <div class="col-mx-auto mr-3">
                  <button
                    v-if="modalNew === true"
                    type="submit"
                    class="btn btn-primary mt-1"
                    aria-label="Close"
                    @click="transactionValidated = true, validateTransaction()"
                  >
                    Hinzufügen
                  </button>
                  <button
                    v-if="modalNew === false"
                    type="submit"
                    class="btn btn-warning mt-1"
                    aria-label="Close"
                    @click="transactionValidated = true, validateTransaction()"
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
              @submit="$event.preventDefault(), validateTransaction();"
            >
              <p>
                Bis zu welchem Datum soll die Transaktion wiederholt werden?
              </p>
              <div class="form-group">
                <label>Datum *</label>
                <input
                  v-if="wiederkehrend==='Monat'"
                  v-bind:class="{ 'is-invalid': endDateValidated }"
                  type="month"
                  class="form-control"
                  v-model="endDate"
                  id="datetimepickerEndDate"
                  placeholder="Gib das Datum ein."
                  required
                />
                <select
                  v-if="wiederkehrend==='Jahr'"
                  class="form-control my-3"
                  v-model="endDate"
                  required
                >
                <option v-for="year in availableYears" :key="year">{{year}}</option>
                </select>
                <div class="invalid-feedback">
                  Bitte gib ein gültiges Datum in der Zukunft ein.
                </div>
              </div>
              <br />
              <div class="row justify-content-between">
                <div class="col-mx-auto ml-3">
                  <button
                    type="button"
                    @click="endDateSet = false"
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
              @submit="$event.preventDefault(), addCategory()"
            >
              <div class="form-group">
                <label>Kategorie *</label>
                <input
                  v-bind:class="{ 'is-invalid': categoryValidated }"
                  type="text"
                  class="form-control"
                  v-model="newCategory"
                  placeholder="Name der Kategorie *"
                  required
                />
                <div class="invalid-feedback" v-if="newCategory === ''">
                  Gib den Namen der Kategorie an.
                </div>
                <div class="invalid-feedback" v-if="categoryExists">
                  Diese Kategorie gibt es bereits!
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
                    @click="categoryValidated = true"
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

form label, .invalid-feedback {
  float:left;
  text-align: left;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
/* eslint-disable */
/* global $ */
import Navbar from "@/components/Navbar.vue";
import Projects from "@/components/Projects.vue";
import TransactionsService from "@/services/TransactionsService";
import CategoriesService from "@/services/CategoriesService";
import { mapState } from "vuex";
export default {
  name: "App",
  components: {
    Navbar,
    Projects
  },
  data: () => {
    return {
      modalTitle: '',
      modalNew: true,
      amount: null,
      date: '',
      wiederkehrend: 'Nie',
      category: 'Allgemein',
      title: '',
      endDate: new Date().getFullYear(),
      endDateSet: false,
      t_id: null,
      newCategory: '',
      transactionValidated: false,
      categoryValidated: false,
      categoryExists: false,
      endDateValidated: false,
      availableYears: [new Date().getFullYear(), new Date().getFullYear()+1, new Date().getFullYear()+2, new Date().getFullYear()+3, new Date().getFullYear()+4, new Date().getFullYear()+5]
    }
  },
  mounted() {
    this.fetchAllCategories();
    this.$refs.project.fetchAllProjects();
  },
  computed: {
    ...mapState(["transactions", "categories", "selectedMonth", "selectedYear", "monatJahr"])
  },
  watch: {
    $route: function () {
      $('.navbar-toggler').trigger('click');
    },
    newCategory: function(){
      this.categoryValidated = false;
    },
    title: function(){
      this.resetValidationTransaction();
    },
    amount: function(){
      this.resetValidationTransaction();
    },
    date: function(){
      this.resetValidationTransaction();
    },
    endDate: function(){
      this.endDateValidated = false;
      this.endDateSet = true;
    },
  },
  methods: {
    async fetchAllTransactions() {
      try {
        const response = await TransactionsService.fetchAllTransactions();
        let transactions = response.data.transactions;
        this.$store.dispatch("updateTransactions", transactions);
        this.setDate();
        this.setYears();
        this.calculateAmounts();
      } catch(e) {
        console.log(e)
      }     
    },

    setYears() {
      let years = [];
      this.transactions.forEach(transaction => {
        if (transaction.date.length > 13) {
          transaction.date = this.getNormalFormatTime(transaction.date);
          let currentYear =
            transaction.date[6] +
            transaction.date[7] +
            transaction.date[8] +
            transaction.date[9];
          if (!years.includes(currentYear)) {
            years.push(currentYear);
          }
        }
      })
      this.$store.dispatch("updateYears", years);
    },

    resetValidationTransaction() {
      if(this.transactionValidated) {
        this.transactionValidated = false;
      }
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
      let availableBudget = 0.0;
      let totalBudget = 0.0;
      let totalSpend = 0.0;
      this.transactions.forEach(transaction => {
        if (transaction.wiederkehrend === 'Jahr' && this.monatJahr === 'Monat') return;
        let transactionMonth = parseInt(transaction.date[3] + transaction.date[4])
        let transactionYear = parseInt(transaction.date[6] + transaction.date[7] + transaction.date[8] + transaction.date[9])
        let amount = Math.round(transaction.amount.$numberDecimal * 100) / 100
        if ((this.monatJahr === "Monat" && transactionMonth === this.selectedMonth && transactionYear === this.selectedYear) || (this.monatJahr !== "Monat" && transactionYear === this.selectedYear)) {
          availableBudget += amount;
          if (amount > 0) {
            totalBudget += amount;
          } else {
            totalSpend += amount;
          }
        }
      })
      this.$store.dispatch("updateAvailableBudget", this.calculateBudgetMath(availableBudget));
      this.$store.dispatch("updateTotalBudget", this.calculateBudgetMath(totalBudget));
      this.$store.dispatch("updateTotalSpend", this.calculateBudgetMath(totalSpend));
    },

    calculateBudgetMath(amount) {
      return Math.round(amount * 100) / 100
    },

    async fetchAllCategories() {
      const response = await CategoriesService.fetchAllCategories();
      let categories = response.data.categories;
      this.$store.dispatch("updateCategories", categories);
    },

    async addCategory() {
      this.categoryExists = false;
      this.categories.forEach(category => {
        if(category.name === this.newCategory){
          this.categoryExists = true;
        };
      })
      if (this.newCategory && this.categoryExists === false) {
        $("#closeCategory").trigger('click');
        await CategoriesService.addCategory({
          name: this.newCategory
        });
        this.fetchAllCategories();
        this.resetNewCategory();
      } else {
        this.categoryValidated = true;
      }
    },

    async resetTransaction() {
      this.amount = null;
      this.setDate();
      this.endDate = new Date().getFullYear();
      this.endDateSet = false;
      this.wiederkehrend = 'Nie';
      this.category = 'Allgemein';
      this.title = '';
      this.t_id = null;
      this.categoryValidated = false;
      this.transactionValidated = false;
      this.endDateValidated = false;
      this.modalNew = true;
    },

    validateTransaction() {
      let currentDate = new Date()
      let validDateInFuture = false;
      if(this.endDateSet){
        if (this.wiederkehrend === "Jahr"){
          validDateInFuture = true;
        } else {
          let endDateDate;
          endDateDate = new Date(this.endDate)
          if(currentDate < endDateDate){
            validDateInFuture = true;
          }
        }
      } 

      let finallyAddTransaction = false;
      let amountDateCategoryNoteNotNull = this.amount && this.date && this.category && this.title;
      let wiederkehrend = this.wiederkehrend !== "Nie";

      //Wenn wiederkehrend, aber kein Enddatum festgelegt wurde
      if (
        wiederkehrend &&
        !this.endDateSet &&
        amountDateCategoryNoteNotNull
      ) {
        if (this.wiederkehrend === "Monat") {
          this.endDate = new Date().getFullYear() + "-12";
        } else if (this.wiederkehrend === "Jahr") {
          this.endDate = String(new Date().getFullYear());
        }
        $("#endDateModal").modal('show');
      }
      //Wenn wiederkehrend, und gültiges Enddatum festgelegt wurde
      else if (
        wiederkehrend &&
        this.endDateSet &&
        validDateInFuture &&
        amountDateCategoryNoteNotNull
      ) {
        $("#endDateModal").modal('hide')
        finallyAddTransaction = true;
      }
      //Wenn wiederkehrend, aber Enddatum nicht gültig
      else if (
        wiederkehrend &&
        this.endDateSet &&
        amountDateCategoryNoteNotNull
      ) {
        this.endDateValidated = true;
      }
      //Wenn nicht wiederkehrend
      else if (
        !wiederkehrend &&
        amountDateCategoryNoteNotNull
      ) {
        finallyAddTransaction = true;
      }
      if(finallyAddTransaction){
        $("#transactionModal").modal('hide')
        if(this.modalNew === true){
          this.addTransaction()
        } else {
          this.updateTransaction()
        }
      }
    },

    getDate(date){
      date = new Date(date);
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      if (month > 12) {
        month = 1;
        year += 1;
      }
      return new Date(year, month, day);
    },

    async addTransaction() {
      //Bei Ausgaben wird der Betrag auf Minus gesetzt
      if (this.modalTitle === 'Neue Ausgabe hinzufügen') {
        this.amount = this.amount * -1;
      }
      let datesToAdd = []
      if (this.wiederkehrend === "Nie") {
        datesToAdd.push(this.date)
      } else {
        //Datum des Beginns festlegen
        let beginDate = this.getDate(this.date);
        beginDate.setDate(1)
        
        //End Datum festlegen
        let endingDate = this.getDate(this.endDate);
        
        let year = String(beginDate.getFullYear())
        let month = String(beginDate.getMonth()+1)
        let toAdd;

        if (this.wiederkehrend === "Monat") {
          do {
            if(month.length === 1){
              month = "0" + month;
            }
            toAdd = year + "-" + month + "-01"
            datesToAdd.push(toAdd)
            beginDate.setMonth(beginDate.getMonth()+1);
            year = String(beginDate.getFullYear())
            month = String(beginDate.getMonth()+1);
          } while(beginDate <= endingDate)
        } else if (this.wiederkehrend === "Jahr") {
          do {
            toAdd = year + "-01-01"
            datesToAdd.push(toAdd)
            beginDate.setFullYear(beginDate.getFullYear()+1);
            year = String(beginDate.getFullYear())
          } while(beginDate.getFullYear() <= endingDate.getFullYear())
        }
      }
      await datesToAdd.forEach(date => {
        this.callAddTransactionApi(date);
      })
      
      this.resetTransaction();
      this.fetchAllTransactions();
      this.calculateAmounts();
      $('#closeTransaction').trigger('click');
    },

    async callAddTransactionApi(date) {
      await TransactionsService.addTransaction({
        amount: this.amount,
        date: date,
        wiederkehrend: this.wiederkehrend,
        category: this.category,
        note: this.title
      });
    },

    async updateTransaction() {
      /**
       * Die nachfolgenden Zeilen setzten die neuen Werte der betroffenen Transaktion im Array. Anschließend erfolgt der Aufruf der Update API.
       * Dies hat den Vorteil, dass kein erneutes GET für die Transaktionen benötigt wird.
       * ALTERNATIVE: Erneuter fetchAllTransactions() Aufruf
       */
      let transactionToEdit = this.transactions.filter((transaction) => {
        if(transaction._id == this.t_id) {
          return transaction;
        }
      })[0]

      transactionToEdit.amount.$numberDecimal = this.amount;
      transactionToEdit.date = this.getNormalFormatTime(
        this.date
      );
      transactionToEdit.wiederkehrend = this.wiederkehrend;
      transactionToEdit.category = this.category;
      transactionToEdit.note = this.title;

      await TransactionsService.updateTransaction({
        id: this.t_id,
        amount: this.amount,
        date: this.date,
        wiederkehrend: this.wiederkehrend,
        category: this.category,
        note: this.title
      });
      this.resetTransaction();
      this.calculateAmounts();
      this.$store.dispatch("updateHelperReloadTransactions", 1);
    },

    fillModal(id, amount, date, wiederkehrend, category, title) {
      this.t_id = id;
      this.amount = amount;
      this.date = this.getDatabaseFormatTime(date).substring(0, 10);
      this.wiederkehrend = wiederkehrend;
      this.category = category;
      this.title = title;
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
      this.categoryValidated = false;
    },
  }
};
</script>
