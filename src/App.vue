<template>
  <div id="app">
    <b-navbar type="dark" variant="primary">
      <b-navbar-brand to="/">ROME Studio</b-navbar-brand>

      <b-navbar-nav>
        <b-nav-item to="/ide">IDE</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <router-view />
  </div>
</template>
