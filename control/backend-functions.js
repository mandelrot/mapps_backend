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
      }
    }
  }
  appsStateInMemory = JSON.parse(JSON.stringify(apps));
  return await files.updateAppsInstalled(apps);
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

backend.checkAppFile = async (routeArray) => {
  return await files.checkAppFile(routeArray);
}




module.exports = backend;