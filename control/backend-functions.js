/* 
Each frontend app of the suite will have its own functions Control will invoke.
The "backend fronts" (admin page and suite entry point) need a few functions too
*/

const path = require('path');
const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      files = require(path.join(__dirname, 'files.js'));



const backend = {};



backend.checkAppsList = async () => {
  return await files.getAppsInstalled();
}

backend.updateAppsList = async (updatedApps) => {
  const appsInstalled = await backend.checkAppsList();
  if (appsInstalled.msgError) { return { msgError: appsInstalled.msgError }; }
  const apps = JSON.parse(JSON.stringify(appsInstalled.result));
  for (const updatedApp of updatedApps) {
    for (const app of apps) {
      if (app.appFolder === updatedApp.appFolder &&
          app.appFullName === updatedApp.appFullName) { 
        app.appEnabled = updatedApp.appEnabled; 
      }
    }
  }
  return await files.updateAppsInstalled(apps);
}





module.exports = backend;