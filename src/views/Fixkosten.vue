<template>
  <div class="fixkosten container">
    <h1 class="my-3">Montaliche Fixkosten</h1>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TransactionsService from "@/services/TransactionsService";

export default {
  name: "Fixkosten",
  components: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapState(["transactions", "categories", "years"])
  },
  methods: {

  }
};
</script>
