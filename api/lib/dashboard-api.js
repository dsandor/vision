'use strict';

const uuid = require('uuid'),
      { Server }  = require('ws');

function sendMessage(socket, type, message) {
  return new Promise((resolve, reject) => {
    socket.send(JSON.stringify(Object.assign({ type }, message)), (err) => {
      if (!err) return resolve();

      console.log('got error from client [%s]: %s', socket.connectionId, err.message);

      return reject(err);
    });
  });
}

function sendStats(socket, collector) {
  setTimeout(() => {
    sendMessage(socket, 'stats', { clients: collector.connections, time: new Date() })
      .then(() => sendStats(socket))
      .catch(() => {
        console.log('removing client connect due to failure');
        delete this.connections[socket.connectionId];
      });
  }, 1000);
}

class DashboardApi {
  constructor(options) {
    options = options || {};
    this.port = options.port || 16998;
    this.connections = {}
    this.wsServer = new Server({ port: this.port });
    this.collector = options.collector;

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
      });

      sendStats(ws, this.collector);
    });

    this.collector.on('client-message', this.clientMessageHandler.bind(this));
  }

  clientMessageHandler(client, message) {
    console.log('CLIENT-Message ->', message, client);
    this.broadcast(message);
  }

  broadcast(message) {
    if (this.connections) {
      Object.keys(this.connections).forEach((key) => {
        sendMessage(this.connections[key], 'broadcast', JSON.parse(message));
      });
    }
  }
}

module.exports = DashboardApi;
