<template>
    <div>
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row">
            <div class="col-xs-12 text-left"><i class="fa fa-desktop"></i>
              <small v-if="client.hostInfo.cpus.length > 0">{{ client.hostInfo.cpus[0].model }}</small>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-xs-4 text-right"><b>heartbeat:</b></div>
            <div class="col-xs-8 text-left">
              <span v-if="client.hostInfo.cpus.length > 0">{{ client.heartbeats }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4 text-right"><b>memory:</b></div>
              <div class="col-xs-8 text-left">
              {{ client.hostInfo.memory / 1073741824 }}GB
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4 text-right"><b>OS:</b></div>
            <div class="col-xs-8 text-left">
              {{ client.hostInfo.name }}
            </div>
          </div>
          <div class="row">
            <div class="col-xs-4 text-right"><b>display:</b></div>
            <div class="col-xs-8 text-left">
              {{ client.monitorInfo.primaryMonitor.monitorRect.right }} x
              {{ client.monitorInfo.primaryMonitor.monitorRect.bottom }}
            </div>
          </div>
        </div>
        <div class="panel-footer">
          <div class="row">
            <div class="col-xs-4 text-center">
              <button type="button" class="btn btn-primary btn-xs" v-on:click="showChatBox">
                <i class="fa fa-commenting"></i>
              </button>
            </div>
            <div class="col-xs-4 text-center">
              <button type="button" class="btn btn-primary btn-xs" v-on:click="showShutdownConfirmation">
                <i class="fa fa-power-off"></i>
              </button>
            </div>
            <div class="col-xs-4 text-center">
              <button type="button" class="btn btn-primary btn-xs" v-on:click="showRestartConfirmation">
                <i class="fa fa-recycle"></i>
              </button>
            </div>
        </div>
        <div class="row" v-if="showChat === true">
          <div class="col-xs-12 text-center">
            <input type="text" />
            <a class="btn btn-simple btn-primary">
            SEND<div class="ripple-container"></div>
            </a>
          </div>
        </div>
        <div class="row" v-if="showShutdown === true">
          <div class="col-xs-12 text-center">
            <a class="btn btn-simple btn-primary">
              SHUTDOWN<div class="ripple-container"></div>
            </a>
            <a class="btn btn-simple btn-primary" v-on:click="cancel">
              CANCEL<div class="ripple-container"></div>
            </a>
          </div>
        </div>
        <div class="row" v-if="showRestart === true">
          <div class="col-xs-12 text-center">
            <a class="btn btn-simple btn-primary">
              RESTART<div class="ripple-container"></div>
            </a>
            <a class="btn btn-simple btn-primary" v-on:click="cancel">
              CANCEL<div class="ripple-container"></div>
            </a>
          </div>
        </div>
      </div>
    </div>
</template>
<style>
    body{
        background-color:#ff0000;
    }
</style>
<script>
    export default{
        components:{
        },

        methods: {
          showChatBox() {
            this.showChat = !this.showChat;
            this.showShutdown = false;
            this.showShutdown = false;
          },

          showShutdownConfirmation() {
            this.showShutdown = !this.showShutdown;
            this.showChat = false;
            this.showRestart = false;
          },

          showRestartConfirmation() {
            this.showRestart = !this.showRestart;
            this.showShutdown = false;
            this.showChat = false;
          },

          cancel() {
            this.showShutdown = false;
            this.showChat = false;
            this.showRestart = false;
          }

        },
// TODO: wire up the buttons to messages to the client.
// TODO: figure out why the JS for popups are not working.
// TODO: expand out message box for sending messages to client.
// TODO: first message for handshake should not show client box.. not until info packet has been passed.

        props: ['client'],

        computed: {
        },

        data: function() {
        return {
            showChat: false,

            showShutdown: false,

            showRestart: false
          }
        }
    }
</script>
