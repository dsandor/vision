'use strict';

const uuid = require('uuid'),
      { Server }  = require('ws');

function sendMessage(socket, type, message) {
  return new Promise((resolve, reject) => {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(Object.assign({ type }, message)), (err) => {
        if (!err) return resolve();

        console.log('D - got error from client [%s]: %s', socket.connectionId, err.message);
        return reject(err);
      });
    }
  });
}

function sendStats(socket, collector, adminConnections) {
  setTimeout(() => {
    sendMessage(socket, 'stats', { clients: collector.connections, time: new Date() })
      .then(() => sendStats(socket))
      .catch(() => {
        console.log('D - failed sending stats:', socket.connectionId);
        if (adminConnections[socket.connectionId]) {
          console.log('conn exists..', socket.connectionId, 'readyState:', socket.readyState);
        }
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

      sendMessage(ws, 'handshake', { connectionId })
        .catch((err) => {
          console.log('D - caught error sending handshake: ', err);
          delete this.connections[connectionId];
        });

      ws.on('message', (message) => {
        console.log('[id:%s] received: %s', connectionId, message);

        const msg = JSON.parse(message);

        if (msg.type === 'shutdown' || msg.type === 'restart') {
          Object.keys(this.collector.connections).forEach((cid) => {
            console.log(`sending message ADMIN -> CLIENT[${cid}]: `,message,
              '\nreadyState:', this.collector.connections[cid].readyState);

            if (this.collector.connections[cid].readyState > 1) {
              delete this.collector.connections[cid];
            } else if (this.collector.connections[cid].readyState ===1) {
              this.collector.connections[cid].send(message);
            }
          });
        }
      });

      sendStats(ws, this.collector, this.connections);
    });

    this.collector.on('client-message', this.clientMessageHandler.bind(this));
  }

  clientMessageHandler(client, message) {
    console.log('D - CLIENT-Message ->', message, client);
    this.broadcast(message);
  }

  broadcast(message) {
    if (this.connections) {
      Object.keys(this.connections).forEach((key) => {
        sendMessage(this.connections[key], 'broadcast', JSON.parse(message))
          .catch((err) => {
            console.log('D - could not send to admin client: ', err);
            delete this.connections[key];
          });
      });
    }
  }
}

module.exports = DashboardApi;
