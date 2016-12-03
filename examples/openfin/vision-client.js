window.vision = {
  init: (options) => {
    const ERROR_HOST_REQUIRED = 'Host is a required option.';

    window.vision.options = options || {};

    if (!options || !options.host) {
      console.error(ERROR_HOST_REQUIRED);
      throw new Error(ERROR_HOST_REQUIRED);
    }

    let host = options.host,
      port = options.port || 16999;

    if (document && document.addEventListener) {
      document.addEventListener('DOMContentLoaded', function () {
        if (fin && fin.desktop) {
          fin.desktop.main(function () {
            var wsUri = `ws://${host}:${port}/`;
            websocket = new WebSocket(wsUri);
            websocket.onopen = (evnt) => {
              console.log('onopen - event:' + JSON.stringify(evnt));
              window.vision.heartbeat(websocket);
            };
            websocket.onmessage = window.vision.messageHandler;
          });
        }
      });
    }
  },

   heartbeat: (socket) => {
     setTimeout(() => {
       socket.send(JSON.stringify({type: 'heartbeat', location: window.location, connectionId: window.vision.connectionId}));
       window.vision.heartbeat(socket);
     }, window.vision.options.heartbeatInterval || 1000);

   },

  messageHandler: (event) => {
    if (!event || !event.data) return;

    console.log('message: ', event.data);
    let message = JSON.parse(event.data);

    if (message.type === 'handshake') {
      window.vision.connectionId = message.connectionId;
    }
  }
};
