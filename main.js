/* Please note: before compiling the app, you should 
configure ./config/config.js with your own data
See full docs, you will find everything you need there */

const path = require('path');



/* Server up - This starts the actual backend app*/
const server = require(path.join(__dirname, 'server', 'server.js'));



/* Electron */
const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
let adminWindow;
const iconpath = path.join(__dirname, 'trayicon.png');
  // The iconpath is in the root directory because of some Linux incompatibilities
let tray;

app.disableHardwareAcceleration(); // There is an "ugly" problem with some Chromium versions,
  // they come with the WebGL disabled by default (and Electron uses hardware acceleration by
  // default); and this may cause an error message in console when the app window is open for
  // a while. The only window we need here is the admin window and it quite simple, so we will
  // avoid the problem this way and the app performance difference won't be even noticed.

const createAdminWindow = () => {
  adminWindow = new BrowserWindow({
    width: 720,
    height: 540,
    icon: iconpath,
    backgroundColor:' #ffffff',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true, contextIsolation: false,
      devTools: false
    }
  });
  adminWindow.maximize();
  adminWindow.once('ready-to-show', () => {
    adminWindow.show();
  });

  adminWindow.loadFile(path.join(__dirname, 'fronts', 'admin.html'));
};

app.whenReady().then(() => {
  createAdminWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createAdminWindow();
  });

  tray = new Tray(iconpath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Admin Window', click: () => {
      if (adminWindow === null) { createAdminWindow(); }
      else { adminWindow.maximize(); }
    }},
    { label: 'Quit', click: () => {
      app.quit();
    }}
  ])
  tray.setToolTip('Mapps Admin');
  tray.setContextMenu(contextMenu);

});

app.on('window-all-closed', function (event) {
  event.preventDefault();
  adminWindow = null; 
});




// Communication with the admin window
ipcMain.handle('msgFromAdmin', async(e, message) => {
  return await server.msgFromAdmin(message);
});

