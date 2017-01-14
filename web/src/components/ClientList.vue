<template>
  <div>
    <div class="wrap-list client-panel text-top" v-for="client in $store.state.clients">
        <Client :client=client></Client>
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
        },
        socket: {
          events: {
            stats(msg, store) {
              console.log('got stats:', msg, 'store', store);
              let message = JSON.parse(msg);
              if (message.type === 'heartbeat') {
                store.dispatch('updateClient', message);
              }
            }
          }
        }
    }
</script>

<style lang="sass">
  .wrap-list
    display: inline-block

  .client-panel
    margin: 10px
</style>
