/* 
Each frontend app of the suite will have its own functions Control will invoke.
The "backend fronts" (admin page and suite entry point) need a few functions too
*/

const path = require('path');
const files = require(path.join(__dirname, 'files.js'));


let appsStateInMemory = false;



const backend = {};



backend.checkAppsList = async () => {
  const appsInstalled = await files.getAppsInstalled();
  if (appsInstalled.result && !appsInstalled.msgError) {
    appsStateInMemory = JSON.parse(JSON.stringify(appsInstalled.result));
  } else {
    appsInstalled = false;
  }
  return appsInstalled;
}

backend.updateAppsList = async (updatedApps) => {
  const appsInstalled = await backend.checkAppsList();
  if (appsInstalled.msgError) { 
    appsStateInMemory = false;
    return { msgError: appsInstalled.msgError }; 
  }
  const apps = JSON.parse(JSON.stringify(appsInstalled.result || []));
  for (const updatedApp of updatedApps) {
    for (const app of apps) {
      if (app.appFolder === updatedApp.appFolder &&
          app.appFullName === updatedApp.appFullName) { 
        app.appEnabled = updatedApp.appEnabled; 
        app.appHidden = updatedApp.appHidden; 
        app.idControlApp = updatedApp.idControlApp;
        app.idException = updatedApp.idException;
      }
    }
  }
  appsStateInMemory = JSON.parse(JSON.stringify(apps));
  return await files.updateAppsInstalled(apps);
}

backend.getAllAppsList = async() => {
  let appsState;
  if (appsStateInMemory) {
    appsState = { result: appsStateInMemory };
  } else {
    appsState = await backend.checkAppsList();
  }
  return appsState;
}

backend.getEnabledAppsList = async () => {
  let appsState;
  if (appsStateInMemory) {
    appsState = { result: appsStateInMemory };
  } else {
    appsState = await files.getAppsState();
    appsStateInMemory = (appsState.result && !appsState.msgError) ? appsState.result : false;
  }
  if (appsState.msgError) { return { msgError: appsState.msgError }; }
  return appsState.result;
}

backend.isAppEnabled = async (appFolder) => {
  const apps = await backend.getEnabledAppsList();
  const app = apps.find( app => app.appFolder === appFolder && app.appEnabled );
  return app ? true : false;
}

backend.checkAppInAppsState = async (appFolder) => { // Returns appRoutingType or msgError
  const apps = await backend.getEnabledAppsList();
  const app = apps.find( app => app.appFolder === appFolder && app.appEnabled );
  if (app) {
    return { result: (app.appRoutingType || 'staticFiles') };
  } else {
    return { result: false };
  }
}

backend.checkIDControlStatus = async () => {
  let appsState;
  if (appsStateInMemory) {
    appsState = { result: appsStateInMemory };
  } else {
    appsState = await files.getAppsState();
    if (appsState.result && !appsState.msgError) {
      appsStateInMemory = appsState.result;
    } else {
      appsStateInMemory = false;
      return { msgError: `There has been an error when checking the ID control status of the system (which app determines who you are and whether you have permission to do what you want to do). Please contact your system admin and transmit them this exact message so they can try to find what has happened.

This is the error found when checking the apps list and their ID control settings: 

${appsState.msgError || 'No info available. If the problem persists, maybe accessing the admin area in the server and resetting all data will solve it.'}` };
    }
  }
  const apps = JSON.parse(JSON.stringify(appsStateInMemory));
  let idControlApp = apps.find( app => app.idControlApp === true );
  if (!idControlApp) { return { result: {idControlApp: false} } }
  idControlApp = idControlApp.appFolder;
  let idExceptions = apps.filter( app => app.idException === true ).map( app => app.appFolder );
  return { result: { idControlApp, idExceptions } };
}

backend.checkAppFile = async (routeArray) => {
  return await files.checkAppFile(routeArray);
}

backend.logError = async (appFolder, functionName, error) => {
  files.logError(appFolder, functionName, error);
}


module.exports = backend;