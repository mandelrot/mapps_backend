const path = require('path');

const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      msgFromControl = require(path.join(__dirname, '..', 'server', 'msg-from-control.js')),
      backend = require(path.join(__dirname, 'backend-functions.js'));

const colors = require('colors'), // delete
util = require('util'); // delete
      


const control = {};




/* ADMIN FRONT ZONE - admin.html */
control.msgFromAdmin = async (message) => {
  const response = {
    app: 'control', // Not used, just to keep the communications standard
    user: 'control', // not used
    to: 'admin', // not used
    action: message.action, // not used
    data: { apps: [] }
  }
  // optional: response.data.msg { msgOk: 'Some info msg here', msgError: 'Some err msg here' }
  switch (message.action) {
    case 'checkAppsList':
      const backendList = await backend.checkAppsList();
      for (const backendApp of (backendList.result || [])) { // Remove some not needed info
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
    app: 'control', // Not used, just to keep the communications format
    user: 'control', // Not used
    to: 'admin', // not used
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
    to: 'main', // not used
    action: message.action, // not used
    data: {apps: []}
  }
  // optional: response.data.msg { msgOk: 'Some info msg here', msgError: 'Some err msg here' }
  switch (message.action) {
    case 'checkAppsList':
      const backendList = await backend.checkAppsList();
      const blist = backendList.result || [];
      response.data.apps = blist.filter(app => app.appEnabled); 
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
    app: 'control', // Not used, just to keep the communications format
    user: 'control', // Not used
    to: 'main',
    action,
    data: { msg }
  }
  msgFromControl.send(messageObject);
}
/* END OF MAIN FRONTS ZONE */



/* FRONT APPS FRONT ZONE - main.html*/
/* 
To make frontend development easier, this is the communication standard suggested among the front apps:
  Request object: {
    app: 'Who makes the request (the app folder name)',
    user: 'User token (when needed)', 
    to: 'Who is the request targeted to (the app folder name)',
    action: 'functionToInvoke', 
    data: { 
      params: ['param1', 'param2'] // Will be passed to the invoked function, the content of the array can be anything
    }
  }
  Response object: { // The object to return should have only one of the two messages
    msgOk: 'The actual response', // Any type: string, object or whatever
    msgError: 'Some error message the frontend app will display'
  }
*/
control.msgFromApp = async (messageString) => {
  try {
    // Format checks
    const message = JSON.parse(messageString);
    const formatErrorMsg = 'The request sent to the backend does not have a correct format. There must be something wrong with the user app.';
    for (const requiredField of ['app', 'user', 'to', 'action', 'data']) {
      if (!Object.keys(message).includes(requiredField)) {
        throw formatErrorMsg;
      }
    }
    if (!message.data.params || !Array.isArray(message.data.params)) { throw formatErrorMsg; }
    // The targeted app must be present and enabled
    if (!await backend.isAppEnabled(message.to)) { return; }
    // Finding the right file to require, it should contain the specified function
    const file = message.app === message.to ? 'internal.js' : 'external.js';
    const functions = require(path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, message.to, 'backend', 'functions', file));
    // Execute the function said in "action", passing the "data --> params" object as argument
    const whatTargetedFunctionReturns = await functions[message.action](...message.data.params);
    // return what the function returns
    return whatTargetedFunctionReturns;
  } catch (error) {
    // return msgError
    const msgError= `Your action has invoked another app in the `
    console.log ('Salta el error:')
    console.log (error);
  }
}

control.msgToApp = (action, msg) => {
  // This should be only reload app, reload data or logout
}
/* END OF FRONT APPS FRONTS ZONE */










/* CHECKING FUNCTIONS */
control.checkApp = async (appFolder) => {
  return await backend.checkAppInAppsState(appFolder);
}

control.checkAppFile = async (routeArray) => {
  return await backend.checkAppFile(routeArray);
}
/* END OF CHECKING FUNCTIONS */






module.exports = control;