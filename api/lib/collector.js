'use strict';

const uuid = require('uuid'),
      { Server }  = require('ws'),
      EventEmitter = require('events'),
      _ = require('lodash'),
      debug = require('debug')('vision-collector');


function sendMessage(socket, type, message) {
  return new Promise((resolve, reject) => {
    socket.send(JSON.stringify(Object.assign({ type }, message)), (err) => {
      if (!err) return resolve();

      debug('COL - got error from client [%s]: %s', socket.connectionId, err.message);

      return reject(err);
    });
  });
}

function sendTicks(socket) {
  setTimeout(() => {
    sendMessage(socket, 'tick', { time: new Date() })
      .then(() => sendTicks(socket))
      .catch(() => {
        debug('removing client connect due to failure');
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
        const parsedMessage = _.attempt(JSON.parse, message);

        if (_.isError(parsedMessage)) {
          debug('Error parsing message from client.  msg:', message, '\nresult:', parsedMessage);
          return;
        }

        if (parsedMessage.type === 'heartbeat') {
          ws.lastHeartbear = parsedMessage;
        }

        debug('[id:%s] received: %s', connectionId, message);
        this.emit('client-message', connectionId, message);
      });

      sendTicks(ws);
    });
  }


}

module.exports = Collector;
