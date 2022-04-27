/* Please note: before working with the app, you should 
configure ./config/config.js with your own data */

const path = require('path');

const colors = require('colors');





/* Servers up: backend (only accesible from inside the server) and public */
const server = require(path.join(__dirname, 'server', 'server.js'));



/* Electron */
const { app, BrowserWindow, ipcMain } = require('electron');
let adminWindow;

app.disableHardwareAcceleration(); // There is an "ugly" problem with some Chromium versions,
  // they come with the WebGL disabled by default (and Electron uses hardware acceleration by
  // default); and this may cause an error message in console when the app window is open for
  // a while. The only window we need here is the admin window and it quite simple, so we will
  // avoid the problem this way and the app performance difference won't be even noticed.

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
  // adminWindow.webContents.openDevTools(); // delete in production
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
  pouchDB module

  Delete: 
    - All the lines marked with a "delete" comment
    - package.json --> colors, and all the "colors" references
    - admin-index-404.html: Tailwind CDN (switch to local optimized production version)
*/


