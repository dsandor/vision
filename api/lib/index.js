'use strict';

const Collector = require('./collector'),
      collector = new Collector({ autoStart: true, port: 16999 }),
      Dashboard = require('./dashboard-api'),
      dashboard = new Dashboard({ autoStart: true, port: 16998, collector });

function diagnostics() {
  setTimeout(() => {
    console.log('## Connection count: %d', Object.keys(collector.connections).length);
    diagnostics();
  }, 5000);
}

diagnostics();
// TODO: ws.onDisconnect - remove the connection from the hashmap

