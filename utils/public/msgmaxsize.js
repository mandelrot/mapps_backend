// Socket.IO (and therefore the backend) sets a max size limit
// for the messages transmited. This is a total limit, meaning
// if you attach several files to a message, the limit will be
// applied to the whole message buffer size.

// More info:  https://socket.io/docs/v4/server-options/#maxhttpbuffersize

// This module tells your frontend which is this limit, 
// (set in the config.js file) so you can tell your users. 

// Please note: messages with a buffer size bigger than 
// the limit will be simply ignored, without warnings or 
// info/error messages to the user.


const path = require('path');
const { msgMaxSize } = require(path.join(__dirname, '..', '..', 'config', 'config.js'));


module.exports = {
  getMsgMaxSize: () => {
    return msgMaxSize ? msgMaxSize : 'No data';
  }
}