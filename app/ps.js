var fs = require('fs');
var PeerServer = require('peer').PeerServer;

var server = PeerServer({
  port: 7563,
    path: '/api',
    debug: 3,
    config: {
      'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]
    },
    ssl: {
      key: fs.readFileSync(__dirname + '/server.key'),
      cert: fs.readFileSync(__dirname + '/server.crt'),
      requestCert: false,
      rejectUnauthorized: false
    }
});

server.on('connection', function(id) {
  console.log(id + ' connected to the server.');
});

server.on('disconnect', function(id) {
  console.log(id + ' disconnected from the server or can no longer be reached.');
});

process.on('message', message => {
  console.log('Server received: ' + message);
});
