const path = require('path'),
      fs = require('fs-extra');

const config = require(path.join(__dirname, '..', 'config', 'config.js'));


// Apps folder: ensure it's there when starting, even if it's empty
const routeToAppsFolder = path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory);
// Apps state file: information about the installed apps (name, description, enabled)
const routeToAppsStateFile = path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, 'apps.state');


function ensureBasicAppsStructure () { // Suite start
  try {
    fs.ensureDir(routeToAppsFolder);
    fs.ensureFile(routeToAppsStateFile);
  } catch (error) {
    console.log ('***')
    console.log ('Initialization error: there has been an error when ensuring the basic apps structure exists (the common apps folder and the apps state file within it.\n').
    console.log ('This is the error: ' + error)
    console.log ('***');
  }
}
ensureBasicAppsStructure();

async function checkBasicAppsStructure () { // During execution
  try {
    await fs.ensureDir(routeToAppsFolder);
    await fs.ensureFile(routeToAppsStateFile);
  } catch (error) {
    console.log ('***')
    console.log ('There has been an error when ensuring the basic apps structure exists (the common apps folder and the apps state file within it.\n').
    console.log ('This is the error: ' + error)
    console.log ('***');
  }
}



const files = {};


files.appsInstalled = () => { // Each app should correspond to a folder in the apps folder
  
}

files.appStructureIsOk = () => {

};



module.exports = files;