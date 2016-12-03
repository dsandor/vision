'use strict';

const WebSocket = require('ws'),
      ws        = new WebSocket('ws://localhost:16999', undefined, {headers: { Authentication: 'Token abc'}}),
      argv      = require('minimist')(process.argv.slice(2));

let connectionId;

function sendMessage(socket, type, message) {
  socket.send(JSON.stringify(Object.assign({ type }, message)));
}

ws.on('open', () => {
  sendMessage(ws, 'identify', argv);
});

ws.on('handshake', (id) => {
  connectionId = id;
});

ws.on('message', (data) => {
  console.log('[CLIENT (%s)] < %s', connectionId, data);

  let payload = JSON.parse(data);

  if (payload && payload.type === 'handshake') {
    connectionId = payload.connectionId;
  }
});
