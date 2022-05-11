


const myFunctions = {};


// IMPORTANT:
// In order to be able to trigger push events this module needs to access the frontend socket package
// to send push messages to the server (and then make them be broadcasted). We need to use the socket
// sent from the backend with this purpose, imported with the function below:
let socket;
let backendInfo;
myFunctions.importBackendInfo = (bInfo) => {
  if (!backendInfo) { backendInfo = bInfo; }
  // We bring an instance of the Node socket-io-client module from the backend
  if (!socket) {
    socket = backendInfo.modules.socket; // and this is the socket the others functions will use
  }
};


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