
const config_dev = {}


config_dev.PASSPHRASE = 'This is the suite passphrase';

config_dev.msgMaxSize = 100; // In Megas

config_dev.server = {
  PORT: 3000
};

config_dev.locations = {
  appsFolderRouteFromMainDirectory: ['APPS'] // No need to change
};


module.exports = config_dev;