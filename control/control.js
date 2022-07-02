const path = require('path');

const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      msgFromControl = require(path.join(__dirname, '..', 'server', 'msg-from-control.js')),
      backend = require(path.join(__dirname, 'backend-functions.js'));



// Tools to send to the frontend packages so they can directly use them. Right before each
// routed message, the backend will invoke an importing function in internal/external.js
// (if it exists) passing it this object, just to make sure that module can use the information
let backendInfo;
function setBackendInfo () {
  const { io } = require("socket.io-client"); 

  backendInfo = {
    socketPort: config.server.port,
    modules: {
      // Node packages present in package.json
      PouchDB: require('pouchdb-node'), // In-file database
      fs: require('fs-extra'), // Like the standard Node fs, but with more functions
      cron: require('node-cron'), // Scheduled tasks
      nodemailer: require('nodemailer'), // Email client
      // Other elements 
      encryption: require(path.join(__dirname, '..', 'utils', 'public', 'encryption.js')),
        // Important! read the readme in utils/public about the encryption backend module
      socket: io(`http://127.0.0.1:${config.server.PORT}`) // To use in push notifications
    }
  }; 
};
setBackendInfo();




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
control.msgFromApp = async (incomingMessage) => {
  let message;
  try {
    // Format checks
    try {
      message = 
        typeof incomingMessage === 'object' && !Array.isArray(incomingMessage) ? incomingMessage 
        : JSON.parse(incomingMessage);
    } catch (error) { // If it's a string it should be JSON-parseable
      message = {data:{}};
      throw(`The message received in the backend to redirect does not have a valid format. This is the message received: ${incomingMessage}`);
    }
    const formatErrorMsg = 'The request sent to the backend does not have a correct format. There must be something wrong with the user app.';
    for (const requiredField of ['app', 'to', 'action', 'data']) {
      if (!Object.keys(message).includes(requiredField)) {
        throw formatErrorMsg;
      }
    }
    if (!message.data.params || !Array.isArray(message.data.params)) { throw formatErrorMsg; }
    // Both the origin app and targeted app must be present and enabled
    if (!await backend.isAppEnabled(message.app)) { return; }
    if (!await backend.isAppEnabled(message.to)) { return; }
    // If the admin has set an ID control app, here is where it's done
    const idControlStatus = await backend.checkIDControlStatus();
      if ( !idControlStatus || (!idControlStatus.result && !idControlStatus.msgError) ) { 
        throw 'When a frontend app wants to do something (calling the backend) there is an ID control of who is calling (via token). There is a function called "backend-functions.js --> checkIDControlStatus() that reads the admin settings about it and returns either the settings list or a msgError (one of the two). In this case it has returned: ' + (typeof idControlStatus === 'object' ? JSON.stringify(idControlStatus) : idControlStatus);
      } else if (idControlStatus.msgError) {
        throw idControlStatus.msgError;
      }
    const idControlSettings = idControlStatus.result; // Just to make it clear
      let idControlOk = false;
      if (!idControlSettings.idControlApp || (Array.isArray(idControlSettings.idExceptions) && idControlSettings.idExceptions.includes(message.app)) ) { idControlOk = true; }
    if (!idControlOk) {

      console.log ('Here is where we do the token checking'); // TO DO NEXT

    }
    // Finding the right file to require, it should contain the specified function
    const file = message.app === message.to ? 'internal.js' : 'external.js';
    const functions = require(path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, message.to, 'backend', 'functions', file));
    if (functions.importBackendInfo) { functions.importBackendInfo(backendInfo); }
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


/* The backend functions in the frontend apps may require utilities available in the backend. */
control.utils = async (incomingMessage) => {
  let message;
  try {
    // Format checks
    try {
      message = 
        typeof incomingMessage === 'object' && !Array.isArray(incomingMessage) ? incomingMessage 
        : JSON.parse(incomingMessage);
    } catch (error) { // It should be a string that can be JSON-parsed
      message = {data: {}};
      throw(`The message received in the backend to redirect does not have a valid format. This is the message received: ${incomingMessage}`);
    }
    const formatErrorMsg = 'The request sent to the backend does not have a correct format. There must be something wrong with the user app.';
    for (const requiredField of ['app', 'to', 'action', 'data']) {
      if (!Object.keys(message).includes(requiredField)) {
        throw formatErrorMsg;
      }
    }
    if (message.to.includes('..')) { throw formatErrorMsg; } // To not get out of the /public folder
    if (!message.data.params || !Array.isArray(message.data.params)) { throw formatErrorMsg; }
    // Passing the data to the utils/public file and returning its value
    const file = require(path.join(__dirname, '..', 'utils', 'public', message.to));
    const whatTargetedFunctionReturns = await file[message.action](...message.data.params);
    return whatTargetedFunctionReturns;
  } catch (error) {
const msgError= `There has been an error in the control/utils function in the backend. It could most likely be because the request has some kind of mistake, or because the utility file required does not exist with that name, or maybe the function is wrongly called.

This is the error received: ${error}   

This error will be logged in the folder APPS/${message.app || 'BACKEND_SERVER-ERROR_LOGS'}/app/backend-static/error-logs.`;
backend.logError((message.app || 'BACKEND_SERVER-ERROR_LOGS'), `msgFromApp (when redirecting from ${message.app || '(unknown)'} to ${message.to || '(unknown)'} calling the function ${message.action || '(unknown)'})`, error);
return { msgError };
  }
}


control.msgToBroadcast = (incomingMessage) => {
  let message;
  // Format checks
  try {
    message = 
      typeof incomingMessage === 'object' && !Array.isArray(incomingMessage) ? incomingMessage 
      : JSON.parse(incomingMessage);
  } catch (error) {
    return;
  }
  // Key fields validations
  if (typeof message.app !== 'string') { return; }
  if (!(message.to === 'apps' || message.to === 'user')) { return; }
  if (message.to === 'user' && !(message.data && message.data.user && typeof message.data.user === 'string')) { return; }
  const msgOk = { sender: message.app};
  // Only two possible outputs:
  if (message.to === 'apps') { 
    msgOk.action = 'reload';
  } else if (message.to === 'user') {
    msgOk.action = 'logout';
    msgOk.user = message.data.user;
  }
  return { msgOk };
}
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