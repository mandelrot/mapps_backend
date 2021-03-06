/* This module allows spontaneous messages to the server from other 
backend modules (actions not triggered by incoming server requests).
Example: when new apps are installed, or upon routine periodic tasks
*/

const path = require('path');
const config = require(path.join(__dirname, '..', 'config', 'config.js'));


/* Open connection with the server */
const { io } = require("socket.io-client");
const socket = io(`http://127.0.0.1:${config.server.PORT}`);




const msgFromControl = {};

msgFromControl.send = (msgObject) => {
  msgObject.pass = config.PASSPHRASE;
  socket.emit('msgFromControl', msgObject);
};

module.exports = msgFromControl;
