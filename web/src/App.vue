<template>
  <div id="app" class="container text-center wrapper">

    <br />
    <navbar></navbar>
    <br />
    <router-view></router-view>

    <div class="push"></div>
    <div class="footer">
      <p>Copyright (c) 2017</p>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar';

export default {
  components: { Navbar, },
};
</script>

<style lang="sass">

  // Bootstrap
  $icon-font-path: '../node_modules/bootstrap-sass/assets/fonts/bootstrap/';

  @import 'node_modules/bootstrap-sass/assets/stylesheets/bootstrap';

  @import 'src/sass/material-kit';

  // font awesome
  $fa-font-path: '../node_modules/font-awesome/fonts/';
  @import 'node_modules/font-awesome/scss/font-awesome';

  //some styling adaptations
  p
    text-align: justify

  body
    background-color: white

</style>
