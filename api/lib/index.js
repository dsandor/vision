'use strict';

const Collector = require('./collector'),
      collector = new Collector({ autoStart: true, port: 16999 });

function diagnostics() {
  setTimeout(() => {
    console.log('## Connection count: %d', Object.keys(collector.connections).length);
    diagnostics();
  }, 5000);
}

diagnostics();
// TODO: ws.onDisconnect - remove the connection from the hashmap

