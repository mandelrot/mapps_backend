/* Please note: before working with the app, you should 
configure ./config/config.js with your own data */

const path = require('path');

const colors = require('colors');





/* Servers up: backend (only accesible from inside the server) and public */
// const serverBackend = require(path.join(__dirname, 'server', 'server-backend.js')); // delete
const server = require(path.join(__dirname, 'server', 'server.js'));



/* Electron */
const { app, BrowserWindow, ipcMain } = require('electron');
let adminWindow;

// const createFakeWindow = () => { const fakeWindow = new BrowserWindow(); } // Delete in production, just for tests

const createAdminWindow = () => {
  adminWindow = new BrowserWindow({
    // width: 720, // To be implemented: uncomment in production
    // height: 540,
    backgroundColor:' #ffffff',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true, contextIsolation: false,
      // devTools: false // to be implemented: uncomment in production
    }
  });
  // adminWindow.maximize(); // to be implemented: uncomment in production
  adminWindow.webContents.openDevTools(); // delete in production
  adminWindow.once('ready-to-show', () => {
    adminWindow.show();
  });

  adminWindow.loadFile(path.join(__dirname, 'fronts', 'admin.html'));
};

app.whenReady().then(() => {
  createAdminWindow();
  // createFakeWindow(); // Delete in production, just for tests

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createAdminWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


// Communication with the admin window
ipcMain.handle('msgFromAdmin', async(e, message) => {
  return await server.msgFromAdmin(message);
});


/* PENDING
   =======

  server/server.js:
    - Handle apps request --> send to CONTROL (who will look for the app folder, render it and load the functions)
    - Handle 404 response


  Backend apps logs (errors registry)

  Error messages - language packs

  Delete: 
    - All the lines marked with a "delete" comment
    - package.json --> colors, and all the "colors" references
    - front-fake folder
    - admin-index.html: Tailwind CDN (switch to local optimized production version)
*/


