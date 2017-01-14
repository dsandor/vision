window.vision = {
  websocket: {},

  uri: '',

  connectionRetryMax: 0, // 0 = unlimited retries

  connectionRetryIntervalMax: 10 * 1000, // maximum number of milliseconds to delay a retry attempt.

  connectionRetryCount: 0,

  connectionRetryInterval: 1000,

  monitorInfo: {},

  hostInfo: {},

  processList: {},

  additionalProps: {},

  init: (options) => {
    const ERROR_HOST_REQUIRED = 'Host is a required option.';

/*
    var myNote = new fin.desktop.Notification({
        url: 'http://goo.gl/nni3sU',
        message: "Hi notification",
        onMessage: (message) => {
            // handle the message from the notification
        }
    });
*/
    window.vision.options = options || {};

    if (!options || !options.host) {
      console.error(ERROR_HOST_REQUIRED);
      throw new Error(ERROR_HOST_REQUIRED);
    }

    let host = options.host,
        port = options.port || 16999;

    window.vision.additionalProps = options.additionalProps;

    window.vision.uri = `ws://${host}:${port}/`;

    if (document && document.addEventListener) {
      document.addEventListener('DOMContentLoaded', function () {
        if (fin && fin.desktop) {
          fin.desktop.main(function () {
            window.vision.connect();

            fin.desktop.System.getEnvironmentVariable('HOSTNAME', function(value) {
              if (value) {
                window.vision.clientComputerName = value;
              }
            }, (err) => {
              console.log('ERROR getting env variable:', err);
            });
          });
        } else {
          console.log('openfin environment not found. Not connecting to vision server.');
        }
      
               // TODO: Move to a function.  Also move to a more appropriate place.  Also look into race condition with w.vision.connect();
          fin.desktop.System.getMonitorInfo((monitorInfo) => {
            window.vision.monitorInfo = monitorInfo;
          });

          fin.desktop.System.getHostSpecs((hostInfo) => {
            window.vision.hostInfo = hostInfo;
          });

          fin.desktop.System.getProcessList((processList) => {
            window.vision.processList = processList;
          });
      });
    }
  },

   heartbeat: (socket) => {
     setTimeout(() => {

       if (socket.readyState === 1) {
         socket.send(JSON.stringify({
           type: 'heartbeat',
           location: window.location,
           connectionId: window.vision.connectionId,
           processList: window.vision.processList,
           hostInfo: window.vision.hostInfo,
           monitorInfo: window.vision.monitorInfo,
           additionalProps: window.vision.additionalProps
         }));

         window.vision.heartbeat(socket);
       }

       if (socket.readyState > 1) window.vision.handleConnectionError();
      }, window.vision.options.heartbeatInterval || 1000);
   },

  messageHandler: (event) => {
    if (!event || !event.data) return;

    console.log('message: ', event.data);
    let message = JSON.parse(event.data);

    if (message.type === 'handshake') {
      window.vision.connectionId = message.connectionId;
    } else if (message.type === 'shutdown') {
      window.close();
    }else if (message.type === 'restart') {
      fin.desktop
        .Application
        .getCurrent()
        .restart();
    }
  },

  connect: (uri) => {
    var wsUri = uri || window.vision.uri;

    window.vision.websocket = new WebSocket(wsUri);
    window.vision.websocket.onerror = (event) => {
      console.log('socket failed. attempting reconnect.');
      return window.vision.handleConnectionError(uri);
    }

    if (!window.vision.websocket.onopen) {
      window.vision.websocket.onopen = (evnt) => {
        console.log('onopen - event:' + JSON.stringify(evnt));
        window.vision.connectionRetryCount = 0;
        window.vision.connectionRetryInterval = 1000;
        window.vision.heartbeat(window.vision.websocket);
      };
    }

    if (!window.vision.websocket.onmessage) {
      window.vision.websocket.onmessage = window.vision.messageHandler;
    }
  },

  handleConnectionError: (uri) => {
    console.log(`Failed connecting to vision server: ${uri}, retrying with back-off.`);

    window.vision.connectionRetryCount++;

    if (window.vision.connectionRetryMax > 0 && window.vision.connectionRetryMax > window.vision.connectionRetryCount) {
      console.log(`Connection retries exhausted. Max: ${window.vision.connectionRetryMax}`);
      return;
    }

    window.vision.connectionRetryInterval = Math.pow(2, window.vision.connectionRetryCount) * 1000;

    if (window.vision.connectionRetryInterval > window.vision.connectionRetryIntervalMax) {
      window.vision.connectionRetryInterval = window.vision.connectionRetryIntervalMax;
    }

    setTimeout(() => window.vision.connect(uri), window.vision.connectionRetryInterval);
    console.log(`Retrying connection to server in ${window.vision.connectionRetryInterval/1000} seconds.`);
  }
};
