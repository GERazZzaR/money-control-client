<template>
  <div class="transactionsapi container">
    <h1>Datensätze importieren</h1>
    <div class="custom-file">
      <input
        type="file"
        class="custom-file-input"
        id="customFile"
        lan="de"
        @change="insertFile"
      />
      <label class="custom-file-label" for="customFile">Datei wählen</label>
    </div>
    <button class="btn btn-primary my-3" @click="fireFile">
      Abschicken
    </button>
    <br />
    <hr />
    <br />
    <h1>Datensätze exportieren</h1>
    <button class="btn btn-success my-3" @click="exportData()">
      Export
    </button>
    <br />
    <hr />
    <br />
    <h1>Alle Datensätze löschen</h1>
    <button
      class="btn btn-danger mt-3"
      data-toggle="modal"
      data-target="#deleteAllDataModal"
    >
      ALLE DATENSÄTZE LÖSCHEN!
    </button>

    <!--Modal wirklich alle Datensätze löschen? hinzufügen-->
    <div
      class="modal fade"
      id="deleteAllDataModal"
      tabindex="-1"
      data-backdrop="static"
      role="dialog"
      aria-labelledby="deleteAllDataModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteAllDataModalLabel">
              Wirklich alle Daten löschen?
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
            <form class="needs-validation-addCategory" novalidate>
              <div class="row justify-content-between">
                <div class="col-mx-auto ml-3">
                  <button
                    type="button"
                    class="btn btn-secondary mt-1"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Abbrechen
                  </button>
                </div>
                <div class="col-mx-auto mr-3">
                  <button
                    type="button"
                    @click="deleteAll()"
                    class="btn btn-danger mt-1"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    Löschen
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

<style>
h1 {
  margin-bottom: 50px;
}
</style>

<script>
import { mapState } from "vuex";
import TransactionsService from "@/services/TransactionsService";

export default {
  name: "TransactionsAPI",
  components: {},
  data() {
    return {
      file: null
    };
  },
  computed: {
    ...mapState(["transactions", "categories", "years"])
  },
  methods: {
    insertFile(ev) {
      this.file = ev.target.files[0];
    },
    fireFile() {
      const reader = new FileReader();

      reader.onload = e => {
        var result = JSON.parse(e.target.result);
        for (var a = 0; a < Object.keys(result).length; a++) {
          TransactionsService.addTransaction({
            amount: result[a].amount,
            date: this.$parent.getDatabaseFormatTime(result[a].date),
            wiederkehrend: result[a].wiederkehrend,
            category: result[a].category,
            note: result[a].note
          });
        }
        setTimeout(this.fetchNew(), 3000);
      };
      reader.readAsText(this.file);
    },
    fetchNew() {
      this.$parent.fetchAllTransactions();
    },
    exportData() {
      var f = new File([this.transactions], "export.json", {
        type: "application/json"
      });

      var anchor = document.createElement("a");

      anchor.download = "export.json";
      anchor.href = (window.webkitURL || window.URL).createObjectURL(f);
      anchor.dataset.downloadurl = [
        "application/json",
        anchor.download,
        anchor.href
      ].join(":");
      anchor.click();
    },
    deleteAll() {
      TransactionsService.deleteAllTransactions(this.transactions.length);
      setTimeout(this.fetchNew(), 5000);
    }
  }
};
</script>
