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
      return checkAppsList ();
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


/* PAGE FUNCTIONS */
  function checkAppsList () {
    waitingMode();
    sendToBackend('checkAppsList');
  }

  function updateAppsStatus () {
    waitingMode();
    const checkboxApps = document.getElementsByClassName('checkboxApp');
    const updatedApps = []
    for (const app of checkboxApps) {
      updatedApps.push({appFolder: app.id, appFullName: app.name, appEnabled: app.checked})
    }
    
    sendToBackend('updateAppsStatus', { apps: updatedApps })
  }
/* END OF PAGE FUNCTIONS */


window.onload = function () {
  checkAppsList();
}