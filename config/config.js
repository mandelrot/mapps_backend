
/* THE FOLLOWING BLOCK IS MEANT TO BE CUSTOMIZED BY YOU */
const config = {};


config.locations = {
  appsFolderRouteFromMainDirectory: ['..', '..', 'APPS']
    // In production this backend app will be a compiled Electron.js program. 
    // The previous route places the frontend apps folder in the main Electron folder, 
    // so it will be clearly visible and easy to spot for the admin
};

config.server = {
  PORT: 3000, // Change to your needs
  MSG_PASSPHRASE: 'Your password (spaces allowed) to send msgs from the backend to the apps'
};







/* END OF YOUR CUSTOMIZATION. 
YOU SHOULDN'T NEED TO CHANGE ANYTHING BELOW HERE */





/* If ./config_dev is there we are in DEV environment */
const path = require('path');

const configDev = (() => {
  try {
    return require(path.join(__dirname, 'config_dev.js'));
  } catch (error) {
    return false;
  }
})()


module.exports = configDev ? configDev : config;