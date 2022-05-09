

// In order to be able to trigger push events this module needs to access socket
const { io } = require("socket.io-client");
const socket = io(`http://127.0.0.1:3000`);



const myFunctions = {};


myFunctions.triggerPush = () => {
  
  const messageToBroadcast = {
    app: 'push',
    to: 'apps', // The other possibility would be "user", that would trigger a logout broadcasted event
    action: 'not used in this case',
    data: {
      params: [],
      // user: 'the user id' // If to.user this field would be required
    }
  }

  // "msgToBroadcast" is the event being listened by the backend to redirect to everyone connected
  socket.emit('msgToBroadcast', messageToBroadcast);
};

module.exports = myFunctions;