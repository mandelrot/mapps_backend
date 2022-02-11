const path = require('path');


/* COMMUNICATIONS */
  /* Send notifications to backend */
  const {ipcRenderer} = require('electron');

  function sendToBackend(action, data) {
    const message = { // This object has this structure just to keep the standard, even with unused fields
      app: 'admin',
      user: 'admin',
      action,
      data
    };
    ipcRenderer.invoke('msgFromAdmin', message)
      .then((response) => {
        const apps = response.data.apps ? response.data.apps : [];
        if (response.data.msg) {
          window.dispatchEvent(new CustomEvent('msg', { detail: { msgOk: response.data.msg.msgOk, msgError: response.data.msg.msgError } }));
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
    if (message.action === 'msg' && message.data && message.data.msg) {
      window.dispatchEvent(new CustomEvent('msg', { detail: { msgOk: message.data.msg.msgOk, msgError: message.data.msg.msgError } }));
    }
  })
/* END OF COMMUNICATIONS */


/* DISPLAY FUNCTIONS */
function waitingMode() {
  window.dispatchEvent(new CustomEvent('updatecheckingapps', { detail: {checkingApps: true} }));
  window.dispatchEvent(new CustomEvent('msgok', { detail: { msgOk: false } }));
  window.dispatchEvent(new CustomEvent('msgerror', { detail: { msgError: false } }));
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
      updatedApps.push({appFolder: app.id, appEnabled: app.checked})
    }
    
    sendToBackend('updateAppsStatus', { apps: updatedApps })
  }
/* END OF PAGE FUNCTIONS */


window.onload = function () {
  checkAppsList();
}