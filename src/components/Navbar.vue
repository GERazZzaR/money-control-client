<template>
  <nav
    class="navbar sticky-top navbar-expand-sm navbar-light bg-light"
  >
      <router-link class="navbar-brand nav-link" to="/dashboard">Home</router-link>
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
          <li class="nav-item active">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/fixcosts">Fixkosten</router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/transactions"
              >Transaktionen</router-link
            >
          </li>
        </ul>
      </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  
}
</script>
