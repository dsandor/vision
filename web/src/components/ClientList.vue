<template>
  <div>
    <div class="wrap-list client-panel" v-for="client in $store.state.clients">
        <Client></Client>
    </div>
  </div>
</template>
<style>
    body{
        background-color:#ff0000;
    }
</style>
<script>
    import Client from './Client.vue'
    export default{
        components:{
            Client,
        }
    }
</script>

<style lang="sass">
  .wrap-list
    display: inline-block

  .client-panel
    margin: 10px
</style>
