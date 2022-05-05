const path = require('path'),
      fs = require('fs-extra');

const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      appCheck = require(path.join('..', 'utils', 'app-check.js')),
      encryption = require(path.join('..', 'utils', 'encryption.js')),
      time = require(path.join('..', 'utils', 'time.js'));


// Apps folder: ensure it's there when starting, even if it's empty
const routeToAppsFolder = path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory);
// Apps state file: information about the installed apps (name, description, enabled)
const routeToAppsStateFile = path.join(__dirname, '..', ...config.locations.appsFolderRouteFromMainDirectory, 'apps.state');






/* EXPORTS */
const files = {};


files.getAppsInstalled = async () => { // Each app should correspond to a folder in the apps folder
  try {
    const basicAppsStructure = await checkBasicAppsStructure();
    if (basicAppsStructure.msgError) { return basicAppsStructure; }
    // Get the content of the apps.state file, if any
    let appsState = [];
    try {
      appsState = JSON.parse(encryption.decipher(await (await fs.readFile(routeToAppsStateFile)).toString()));
    } catch (error) {
      appsState = [];
      await fs.writeFile(routeToAppsStateFile, encryption.cipher(JSON.stringify(appsState)));
    }
    // Get the list of folders in the apps folder
    const elementsInAppsFolder = await fs.readdir(routeToAppsFolder);
    const foldersInAppsFolder = []
    for (const element of elementsInAppsFolder) {
      if (element === 'main'  || element === 'admin') {} // These app names are not allowed, ignored if present
      else if (await isFolder(path.join(routeToAppsFolder, element)))  { foldersInAppsFolder.push(element); }
    }
    // Check which folders contain apps with a valid structure
    const validApps = [];
    for (const folder of foldersInAppsFolder) {
      if (await appCheck.isAFolderApp(path.join(routeToAppsFolder, folder))) { validApps.push (folder) } 
    }
    // Extract their metadata
    let appsStateData = []; // Will be synchronized with the appState file
    let defaultIconRoute = path.join(__dirname, '..', 'utils', 'static', 'icon-generic-app.png');
    let eachValidApp = {};
    let routeToIndexHtml = '';
    let indexHtmlExists = false;
    let webPathToIndexHtml
    let infoFolder = '';
    let filesInInfoFolder = [];
    let eachMetadata = {}; // From the app.info file
    let routeToAppIcon = '';
    let routeToAdminIcon = '';
    let iconfound = false;
    let backendStaticDir = 'backend-static'; // Will be created inside each frontend app "app" subfolder, to store app icon
    let backendStaticPath = '';
    let appRoutingType; // By default, could be "managedByFrontendApp"
    for (const validApp of validApps) {
      try {
        routeToIndexHtml = path.join(routeToAppsFolder, validApp, 'app', 'index.html');
        indexHtmlExists = await fs.pathExists(routeToIndexHtml);
        webPathToIndexHtml = `/${validApp}`;
        infoFolder = path.join(routeToAppsFolder, validApp, 'backend', 'info');
        eachMetadata = await fs.readJSON(path.join(infoFolder, 'app-data.json'));
        filesInInfoFolder = await fs.readdir(infoFolder);
        iconfound = false;
        appRoutingType = 'staticFiles';
        for (const fileInInfoFolder of filesInInfoFolder) {
          if (fileInInfoFolder.includes('app-icon')) { iconfound = fileInInfoFolder; }
        }
        // Ensure frontend icon will be there
        backendStaticPath = path.join(routeToAppsFolder, validApp, 'app', 'backend-static');
        await fs.ensureDir(backendStaticPath);
        if (iconfound) { 
          await fs.copyFile(path.join(infoFolder, iconfound), path.join(backendStaticPath, iconfound));
          routeToAppIcon = `/${validApp}/${backendStaticDir}/${iconfound}`;
          routeToAdminIcon = path.join(infoFolder, iconfound);
        } else { 
          await fs.copyFile(defaultIconRoute, path.join(backendStaticPath, 'icon-generic-app.png'));
          routeToAppIcon = `/${validApp}/${backendStaticDir}/icon-generic-app.png`;
          routeToAdminIcon = defaultIconRoute;
        }
        if (eachMetadata.appRoutingType === 'managedByFrontendApp') { appRoutingType = eachMetadata.appRoutingType; }
        eachValidApp = {
          appFolder: validApp,
          appFullName: eachMetadata.appFullName || false,
          appIcon: routeToAppIcon,
          appAdminIcon: routeToAdminIcon,
          appEnabled: false,
          appLink: indexHtmlExists ? webPathToIndexHtml : false,
          appDescription: eachMetadata.appDescription || '',
          appRoutingType
        }
        if (!eachValidApp.appFullName || !eachValidApp.appLink) { throw error; } 
        // Sync enabled state with appState file
        for (const statedApp of appsState) {
          if (statedApp.appFolder === eachValidApp.appFolder && 
              statedApp.appFullName === eachValidApp.appFullName) { // The app is already registered
              eachValidApp.appEnabled = statedApp.appEnabled;
          }
        }
        appsStateData.push(eachValidApp);
      } catch (error) {
        // If something is not 100% ok with the app it will be ignored
      }
    }
    await fs.writeFile(routeToAppsStateFile, encryption.cipher(JSON.stringify(appsStateData)));
    return { result: appsStateData };
  } catch (error) {
    const msgError = `An error has happened when retrieving or managing the data of the apps installed.
    
This is the error triggered by the system:
      
${error}`;
    return { msgError };
  }
}



files.updateAppsInstalled = async (updatedApps) => {
  try {
    await fs.writeFile(routeToAppsStateFile, encryption.cipher(JSON.stringify(updatedApps)));
    return { result: updatedApps }
  } catch (error) {
    const msgError = `An error has happened when updating the registry about the installed apps state.

This is the error triggered by the system:
      
${error}`;
    return { msgError };
  }
}



files.getAppsState = async () => {
  try {
    appsState = JSON.parse(encryption.decipher(await (await fs.readFile(routeToAppsStateFile)).toString()));
    return { result: appsState };
  } catch (error) {
    const msgError = `An error has happened when reading the apps state file (to check whether the app you want to use is installed in the server).

This is the error triggered by the system:
      
${error}`;
    return { msgError };
  }
}


files.checkAppFile = async (routeArray) => {
  return await fs.pathExists(path.join(routeToAppsFolder, ...routeArray));
}



files.logError = async (appFolder, functionName, error) => {
  try {
    const logFileName = time.getFileFormattedTimeToDay() + '(UTC_time).log'
  const logFile = path.join(routeToAppsFolder, appFolder, 'app', 'backend-static', 'error-logs',  logFileName);
  await fs.ensureFile(logFile);
  let fileContent = await fs.readFile(logFile);
  const currentError = `---

${time.getHourAndMinute('text')} (UTC time) - error at function ${functionName}:

${error}

---`;

  fileContent += currentError;
    await fs.writeFile(logFile, fileContent);
  } catch (error) {
    // If the error can't be logged the problem goes beyond this software
    console.log (`
Error when error loging:
${error}
`);
  }
}


module.exports = files;
/* END OF EXPORTS */





/* INTERNAL FUNCTIONS */
function ensureBasicAppsStructure () { // Suite start
  try {
    fs.ensureDir(routeToAppsFolder);
    fs.ensureFile(routeToAppsStateFile);
  } catch (error) {
    console.log ('***');
    console.log ('Initialization error: there has been an error when ensuring the basic apps structure exists (the common apps folder and the apps state file within it.\n');
    console.log ('This is the error: ' + error);
    console.log ('***');
    files.logError('BACKEND_SERVER-ERROR_LOGS', 'ensureBasicAppsStructure', '(Automatic backend log) Initialization error: there has been an error when ensuring the basic apps structure exists (the common apps folder and the apps state file within it.This is the error: ' + error);
  }
}
ensureBasicAppsStructure();

async function checkBasicAppsStructure () { // During execution
  try {
    await fs.ensureDir(routeToAppsFolder);
    await fs.ensureFile(routeToAppsStateFile);
    return {result: true};
  } catch (error) {
    const msgError = `There has been an error when ensuring the basic apps structure exists (the common apps folder and the apps state file within it).

      This is the error triggered by the system:
      
      ${error}`;
    return { msgError };
  }
}

async function isFolder(route) {
  const lstat = await fs.lstat(route);
  return lstat.isDirectory();
}
/* INTERNAL FUNCTIONS */