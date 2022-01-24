const path = require('path');

const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      msgFromBackend = require(path.join(__dirname, '..', 'server', 'msg-from-backend.js')),
      files = require(path.join(__dirname, 'files.js'));

// setTimeout(() => { delete
//   msgFromBackend.send({saludo: 'hola'});
// }, 5000);

