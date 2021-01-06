<template>
  <nav
    class="navbar navbar-icon-top sticky-top navbar-expand-lg navbar-light bg-light"
  >
  <div class="navbar-item">
    <div class="buttons">
      
    </div>
  </div>
      <router-link v-if="!$auth.isAuthenticated" class="navbar-brand nav-link" to="/">Home</router-link>
      <router-link v-if="$auth.isAuthenticated" class="navbar-brand nav-link" to="/dashboard">Home</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active" v-if="$auth.isAuthenticated">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item active" v-if="$auth.isAuthenticated">
            <router-link class="nav-link" to="/fixcosts">Fixkosten</router-link>
          </li>
          <li class="nav-item active" v-if="$auth.isAuthenticated">
            <router-link class="nav-link" to="/transactions"
              >Transaktionen</router-link
            >
          </li>
          <li class="nav-item active" v-if="$auth.isAuthenticated">
            <router-link class="nav-link" to="/transactionsapi"
              >Transactions API</router-link
            >
          </li>
          <li>
            <!-- Check that the SDK client is not currently loading before accessing is methods -->
            <div v-if="!$auth.loading">
              <!-- show login when not authenticated -->
              <a v-if="!$auth.isAuthenticated" @click="login"><button class="btn btn-outline-primary">Login</button></a>
              <!-- show logout when authenticated -->
              <a v-if="$auth.isAuthenticated" @click="logout" class="ml-3"><button class="btn btn-outline-danger">Logout</button></a>
            </div>
          </li>
        </ul>
      </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>
