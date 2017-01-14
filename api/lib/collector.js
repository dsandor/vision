'use strict';

const uuid = require('uuid'),
      { Server }  = require('ws'),
      EventEmitter = require('events');


function sendMessage(socket, type, message) {
  return new Promise((resolve, reject) => {
    socket.send(JSON.stringify(Object.assign({ type }, message)), (err) => {
      if (!err) return resolve();

      console.log('COL - got error from client [%s]: %s', socket.connectionId, err.message);

      return reject(err);
    });
  });
}

function sendTicks(socket) {
  setTimeout(() => {
    sendMessage(socket, 'tick', { time: new Date() })
      .then(() => sendTicks(socket))
      .catch(() => {
        console.log('removing client connect due to failure');
        delete this.connections[socket.connectionId];
      });
  }, 1000);
}

class Collector extends EventEmitter {
  constructor(options) {
    super();
    options = options || {};
    this.port = options.port || 16999;
    this.connections = {}
    this.wsServer = new Server({ port: this.port });

    if (options.autoStart) this.initSocket();
  }

  initSocket() {
    this.wsServer.on('connection', (ws) => {
      const connectionId = uuid.v4();

      ws.connectionId = connectionId; // eslint-disable-line no-param-reassign
      this.connections[connectionId] = ws;

      sendMessage(ws, 'handshake', { connectionId });

      ws.on('message', (message) => {
        console.log('[id:%s] received: %s', connectionId, message);
        this.emit('client-message', connectionId, message);
      });

      sendTicks(ws);
    });
  }


}

module.exports = Collector;
