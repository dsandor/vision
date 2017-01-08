<template>
  <nav class="navbar navbar-default">
    <a class="navbar-brand" href="/"> {{$store.state.appTitle}} {{$store.state.appVersion}}</a>
    <ul class="nav navbar-nav navbar-right right-padded">
      <li>
        <router-link to="/" class="nav-item nav-link"> Home </router-link>
      </li>
      <li>  </li>
    </ul>
  </nav>
</template>

<script>
  export default {
  };
</script>
<style lang="sass" scoped>
  .right-padded
    margin-right: 10px
</style>
