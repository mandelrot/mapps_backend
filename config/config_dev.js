
const config_dev = {}


config_dev.PASSPHRASE = 'This is the suite passphrase';

config_dev.server = {
  PORT: 3000
};

config_dev.files = {
  uploadedFileMaxSize: (10*1024*1024) // 10 Mb
}

config_dev.locations = {
  appsFolderRouteFromMainDirectory: ['APPS']
};


module.exports = config_dev;