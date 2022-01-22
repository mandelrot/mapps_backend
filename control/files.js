const path = require('path'),
      fs = require('fs-extra');

const config = require(path.join(__dirname, '..', 'config', 'config.js'));

// Apps folder: ensure it's there when starting, even if it's empty
const routeToAppsFolder = path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory);
fs.ensureDirSync(routeToAppsFolder);

const files = {};


files.appsInstalled = () => { // Each app should correspond to a folder in the apps folder
  
}



module.exports = files;