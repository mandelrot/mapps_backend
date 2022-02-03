const path = require('path');

const msgFromControl = require(path.join(__dirname, '..', 'server', 'msg-from-control.js')),
      backend = require(path.join(__dirname, 'backend-functions.js'));


      

/* FAKE DATA */

const apps = [
  { appFolder: 'app1', appFullName: 'Cats App', appIcon: 'https://brandeps.com/icon-download/C/Cat-icon-vector-01.svg', appEnabled: true },
  { appFolder: 'app2', appFullName: 'Dogs App', appIcon: 'https://brandeps.com/icon-download/D/Dog-icon-vector-01.svg', appEnabled: true },
  { appFolder: 'app3', appFullName: 'Birds App', appIcon: 'https://brandeps.com/icon-download/B/Bird-icon-vector-01.svg', appEnabled: false }
];

/* END OF FAKE DATA */




const control = {};




/* BACKEND FRONTS ZONE (admin.html / main.html) */
control.msgFromAdmin = async (message) => {
  const response = {
    app: 'control', // Not used, just to keep the communications standard
    user: 'control', // not used
    action: message.action, // not used
    data: {apps}
  }
  // optional: response.data.msg { msgOk: 'Some info msg here', msgError: 'Some err msg here' }
  switch (message.action) {
    case 'checkAppsList':
      response.data.apps = apps; // To be implemented: retrieve apps via backend-functions
      break;
    case 'updateAppsStatus':
      for (const updatedApp of message.data.apps) {
        for (const app of apps) {
          if (app.appFolder === updatedApp.appFolder) { app.appEnabled = updatedApp.appEnabled; }
        }
      }
      // To be implemented: update apps via backend-functions
      response.data.apps = apps; // To be implemented: retrieve apps via backend-functions
      break;
  }
  return response;
}

control.msgToAdmin = (action, msg) => {
  if (action !== 'reload' && action !== 'msg') { return; } // Everything else is forbidden
  const messageObject = {
    app: 'admin', // Not used, just to keep the communications format
    user: 'admin', // Not used
    action,
    data: { msg }
  }
  msgFromControl.send(messageObject);
}
/* END OF BACKEND FRONTS ZONE */


setTimeout(() => {
    control.msgToAdmin('reload')
}, 5000);




// setTimeout(() => {
//   msgFromControl.send(
//     {
//       app: 'admin', 
//       user: 'admin', 
//       action: 'msg',  // Not used, just to keep 
//       data: { msg: { msgError: 'Soy un mensaje de error'} }
//     }
//   );
// }, 5000);
// setTimeout(() => {
//   msgFromControl.send(
//     {
//       app: 'admin', 
//       user: 'admin', 
//       action: 'reload',
//       data: undefined
//     }
//   );
// }, 5000);







module.exports = control;