const path = require('path');

const msgFromControl = require(path.join(__dirname, '..', 'server', 'msg-from-control.js')),
      backend = require(path.join(__dirname, 'backend-functions.js'));

const colors = require('colors'), // delete
util = require('util'); // delete
      


const control = {};




/* ADMIN FRONT ZONE - admin.html */
control.msgFromAdmin = async (message) => {
  const response = {
    app: 'control', // Not used, just to keep the communications standard
    user: 'control', // not used
    action: message.action, // not used
    data: { apps: [] }
  }
  // optional: response.data.msg { msgOk: 'Some info msg here', msgError: 'Some err msg here' }
  switch (message.action) {
    case 'checkAppsList':
      const backendList = await backend.checkAppsList();
      for (const backendApp of backendList.result) { // Remove some not needed info
        delete backendApp.appIcon;
        delete backendApp.appLink;
        delete backendApp.appRoutingType;
      }
      response.data.apps = backendList.result || []; 
      if (backendList.msgError) { response.data.msgError = backendList.msgError; }
      break;
    case 'updateAppsStatus':
      const updatedList = await backend.updateAppsList(message.data.apps);
      response.data.apps = updatedList.result || [];
      if (updatedList.msgError) { response.data.msgError = updatedList.msgError; }
      control.msgToMain('reload');
      break;
  }
  return response;
}

control.msgToAdmin = (action, msg) => {
  if (action !== 'reload' && action !== 'msg') { return; } // Everything else is forbidden
  const messageObject = {
    app: 'admin', // Not used, just to keep the communications format
    user: 'admin', // Not used
    action,
    data: { msg }
  }
  msgFromControl.send(messageObject);
}
/* END OF ADMIN FRONTS ZONE */




/* MAIN FRONT ZONE - main.html*/
control.msgFromMain = async (message) => {
  const response = {
    app: 'control', // Not used, just to keep the communications standard
    user: 'control', // not used
    action: message.action, // not used
    data: {apps: []}
  }
  // optional: response.data.msg { msgOk: 'Some info msg here', msgError: 'Some err msg here' }
  switch (message.action) {
    case 'checkAppsList':
      const backendList = await backend.checkAppsList();
      response.data.apps = backendList.result.filter(app => app.appEnabled) || []; 
      for (const filteredApp of response.data.apps) { 
        delete filteredApp.appAdminIcon;
        delete filteredApp.appEnabled; 
        delete filteredApp.appRoutingType;
      }
      if (backendList.msgError) { response.data.msgError = backendList.msgError; }
      break;
  }
  return response;
}

control.msgToMain = (action, msg) => {
  if (action !== 'reload' && action !== 'msg') { return; } // Everything else is forbidden
  const messageObject = {
    app: 'main', // Not used, just to keep the communications format
    user: 'main', // Not used
    action,
    data: { msg }
  }
  msgFromControl.send(messageObject);
}
/* END OF MAIN FRONTS ZONE */




/* CHECKING FUNCTIONS */
control.checkApp = async (appFolder) => {
  return await backend.checkAppInAppsState(appFolder);
}

control.checkAppFile = async (routeArray) => {
  return await backend.checkAppFile(routeArray);
}
/* END OF CHECKING FUNCTIONS */






module.exports = control;