'use strict';

const { Server } = require('ws'),
      wss        = new Server({ port: 16999 }),
      uuid       = require('uuid');

const connections = {};

function sendMessage(socket, type, message) {
  return new Promise((resolve, reject) => {
    socket.send(JSON.stringify(Object.assign({ type }, message)), (err) => {
      if (!err) return resolve();

      console.log('got error from client [%s]: %s', socket.connectionId, err.message);

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
        delete connections[socket.connectionId];
      });
  }, 1000);
}

function diagnostics() {
  setTimeout(() => {
    console.log('## Connection count: %d', Object.keys(connections).length);
    diagnostics();
  }, 5000);
}

wss.on('connection', (ws) => {
  const connectionId = uuid.v4();

  ws.connectionId = connectionId; // eslint-disable-line no-param-reassign
  connections[connectionId] = ws;

  sendMessage(ws, 'handshake', { connectionId });

  ws.on('message', (message) => {
    console.log('[id:%s] received: %s', connectionId, message);
  });

  sendTicks(ws);
});

diagnostics();
// TODO: ws.onDisconnect - remove the connection from the hashmap

