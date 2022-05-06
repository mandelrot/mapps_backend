

/* CONFIG - VERY IMPORTANT: YOU MUST CUSTOMIZE THIS TO MAKE YOUR APP WORK */
const SERVER = 'http://localhost'; // No changes here
const PORT = 3000; // This should match the PORT at the config file!




/* COMMUNICATIONS */
const socket = io(`${SERVER}:${PORT}`);


function sendToBackend(action, data) {
  const message = { // This object has this structure just to keep the standard, even with unused fields
    app: 'main',
    to: 'control', // not used
    action,
    data
  };
  socket.emit('msgFromMain', message, (response) => {
    const apps = response.data.apps ? response.data.apps : [];
      if (response.data.msgOk || response.data.msgError) {
        window.dispatchEvent(new CustomEvent('msg', { detail: { msgOk: response.data.msgOk || false, msgError: response.data.msgError || false } }));
      }
      // Switching from waiting mode (see below) to working again:
      window.dispatchEvent(new CustomEvent('appslist', { detail: { apps } }));
      window.dispatchEvent(new CustomEvent('updatecheckingapps', { detail: {checkingApps: false} }));
  });
}


socket.on('main', (message) => {
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
/* END OF PAGE FUNCTIONS */


window.onload = function () {
  checkAppsList();
}