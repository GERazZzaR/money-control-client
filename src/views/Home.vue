<template>
  <div class="home container">
    <h1 class="my-3">Home</h1>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
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
