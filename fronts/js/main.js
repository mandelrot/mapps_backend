

/* CONFIG - VERY IMPORTANT: YOU MUST CUSTOMIZE THIS TO MAKE YOUR APP WORK */
const SERVER = 'http://localhost'; // No changes here
const PORT = 3000; // This should match the PORT at the config file!




/* COMMUNICATIONS */
const socket = io(`${SERVER}:${PORT}`);


function sendToBackend(action, data) {
  const message = { // This object has this structure just to keep the standard, even with unused fields
    app: 'main',
    user: 'main',
    action,
    data
  };
  socket.emit('msgFromMain', message, (response) => {
    const apps = response.data.apps ? response.data.apps : [];
      if (response.data.msg) {
        window.dispatchEvent(new CustomEvent('msg', { detail: { msgOk: response.data.msg.msgOk, msgError: response.data.msg.msgError } }));
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
/* END OF PAGE FUNCTIONS */


window.onload = function () {
  checkAppsList();
}