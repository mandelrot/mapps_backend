const path = require('path');

const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      msgFromControl = require(path.join(__dirname, '..', 'server', 'msg-from-control.js')),
      backend = require(path.join(__dirname, 'backend-functions.js'));


      


const control = {};




/* ADMIN FRONT ZONE - admin.html */
control.msgFromAdmin = async (message) => {
  const response = {
    app: 'control', // Not used, just to keep the communications standard
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
  let message;
  try {
    // Format checks
    try {
      message = JSON.parse(messageString);
    } catch (error) {
      message = {};
      throw('The message received in the backend to redirect does not have a valid format.')
    }
    const formatErrorMsg = 'The request sent to the backend does not have a correct format. There must be something wrong with the user app.';
    for (const requiredField of ['app', 'to', 'action', 'data']) {
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
    const msgError= `Your action has triggered some actions in the server that have provoked an internal error. Please contact the admins and transmit them 1) this exact message, 2) what you were doing in the moment to see this error, 3) the error time (when it happened) and 4) that they will find a log of the error in the folder APPS/${message.app || 'BACKEND_SERVER-ERROR_LOGS'}/app/backend-static/error-logs.`;
    backend.logError((message.app || 'BACKEND_SERVER-ERROR_LOGS'), `msgFromApp (when redirecting from ${message.app || '(unknown)'} to ${message.to || '(unknown)'} calling the function ${message.action || '(unknown)'})`, error);
    return { msgError };
  }
}



// control.msgToApp = (action, msg) => {
//   // This should be only reload app, reload data or logout
// }
/* END OF FRONT APPS FRONTS ZONE */







/* CHECKING FUNCTIONS */
control.checkApp = async (appFolder) => {
  return await backend.checkAppInAppsState(appFolder);
}

control.checkAppFile = async (routeArray) => {
  return await backend.checkAppFile(routeArray);
}

control.isAppEnabled = async(appFolder) => {
  return await backend.isAppEnabled(appFolder);
}
/* END OF CHECKING FUNCTIONS */






module.exports = control;