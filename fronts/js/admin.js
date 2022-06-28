const path = require('path');


/* COMMUNICATIONS */
  /* Send notifications to backend */
  const {ipcRenderer} = require('electron');

  function sendToBackend(action, data) {
    const message = { // This object has this structure just to keep the standard, even with unused fields
      app: 'admin',
      to: 'control', // not used
      action,
      data
    };
    ipcRenderer.invoke('msgFromAdmin', message)
      .then((response) => {
        let apps = response.data.apps ? response.data.apps : [];
        apps = apps.sort((a,b) => (a.appFullName > b.appFullName) ? 1 : ((b.appFullName > a.appFullName) ? -1 : 0));

        if (response.data.msgOk || response.data.msgError) {
          window.dispatchEvent(new CustomEvent('msg', { detail: { msgOk: response.data.msgOk || false, msgError: response.data.msgError || false } }));
        }

        // Checking ID control app (in case there is one)
        let idControlApp = apps.find( app => app.idControlApp === true );
        if (idControlApp) { idControlApp = idControlApp.appFolder; } 
          else { idControlApp = false; }
        window.dispatchEvent(new CustomEvent('setidcontrolapp', { detail: {idControlApp} }));
        
        // Switching from waiting mode (see below) to working again:
        window.dispatchEvent(new CustomEvent('appslist', { detail: { apps } }));
        window.dispatchEvent(new CustomEvent('updatecheckingapps', { detail: {checkingApps: false} }));
      });
  }


  /* Incoming notifications from backend */
  const { PORT } = require(path.join(__dirname, '..', 'config', 'config.js')).server;
  const { io } = require("socket.io-client");
  const socket = io(`http://127.0.0.1:${PORT}`);

  socket.on('admin', (message) => {
    // Only two possibilities: reload forcing or incoming message
    if (message.action === 'reload') {
      return checkAppsList();
    }
    if (message.action === 'msg' && message.data && (message.data.msgOk || message.data.msgError)) {
      window.dispatchEvent(new CustomEvent('msg', { detail: { msgOk: message.data.msgOk || false, msgError: message.data.msgError || false } }));
    }
  })
/* END OF COMMUNICATIONS */



/* DISPLAY FUNCTIONS */
function waitingMode() {
  window.dispatchEvent(new CustomEvent('updatecheckingapps', { detail: {checkingApps: true} }));
  window.dispatchEvent(new CustomEvent('msg', { detail: { msgOk: false, msgError: false } }));
}
/* END OF DISPLAY FUNCTIONS */



/* ID CONTROL APP */
function toggleActiveAppsList() {
  document.getElementById('dropdownAppsList').classList.toggle('hidden');
  document.getElementById('dropdownAppsBackground').classList.toggle('hidden');
}

function setIDControlApp(appFolder) {
  toggleActiveAppsList();
  window.dispatchEvent(new CustomEvent('setidcontrolapp', { detail: {idControlApp: appFolder === '' ? false : appFolder} }));
}

function setIDControlAppButtonText(appsText, idControlApp) {
  try {
    if (!idControlApp || idControlApp === '') { throw error; }
    const apps = JSON.parse(appsText);
    const response = apps.filter(app => app.appFolder === idControlApp).map(app => app.appFullName)[0];
    if (!response) { throw error; }
    return response;
  } catch (error) {
    window.dispatchEvent(new CustomEvent('setidcontrolapp', { detail: {idControlApp: false} }));
    uncheckIDControlExceptions();
    return 'No ID control app set';
  }
}

function resetIDControl() {
  window.dispatchEvent(new CustomEvent('setidcontrolapp', { detail: {idControlApp: false} }));
  uncheckIDControlExceptions();
}

function uncheckIDControlExceptions() {
  const idExceptions = document.getElementsByClassName('idException');
  for (const exception of idExceptions) {
    exception.checked = false;
  }
}
/* END OF ID CONTROL APP */



/* PAGE FUNCTIONS */
  function checkAppsList () {
    waitingMode();
    resetIDControl();
    sendToBackend('checkAppsList');
  }

  function updateAppsStatus (appsText, idControlApp) {
    waitingMode();
    try {
      const apps = JSON.parse(appsText);
      const checkboxApps = document.getElementsByClassName('checkboxApp');
      const idExceptions = document.getElementsByClassName('idException');
      const updatedApps = [];
      let appObject;
      for (const app of apps) {
        // Enabled status
        appObject = {appFolder: app.appFolder, appFullName: app.appFullName}
        for (const checkboxApp of checkboxApps) {
          if (checkboxApp.id === app.appFolder) { appObject.appEnabled = checkboxApp.checked ? true : false; }
        }
        // ID control status
        appObject.idControlApp = idControlApp === app.appFolder ? true : false;
        if (idControlApp && idControlApp !== '') {
          for (const idException of idExceptions) {
            if (app.appFolder === idException.id.substring(12)) { appObject.idException = idException.checked; }
          }
        } else {
          appObject.idException = false;
        }
        updatedApps.push(appObject);
      }
      sendToBackend('updateAppsStatus', { apps: updatedApps });
    } catch (error) {
      window.dispatchEvent(new CustomEvent('msg', { detail: { msgOk: false, msgError: `The updated data could NOT be sent to the backend, because there has been some mistake in the frontend processing. This is the error caught:

${error}` } }));
      window.dispatchEvent(new CustomEvent('updatecheckingapps', { detail: {checkingApps: false} }));
      window.scrollTo(0, 0);
    }
  }
/* END OF PAGE FUNCTIONS */


window.onload = function () {
  checkAppsList();
}