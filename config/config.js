
/* THE FOLLOWING BLOCK IS MEANT TO BE CUSTOMIZED BY YOU */
const config = {};

config.server = {
  port: 3000
}

/* END OF YOUR CUSTOMIZATION. 
YOU SHOULDN'T NEED TO CHANGE ANYTHING BELOW HERE */



/* If ./config_dev is there we are in DEV environment */
const fs = require('fs-extra');
const path = require('path');

const configDev = (() => {
  try {
    return require(path.join(__dirname, 'config_dev.js'));
  } catch (error) {
    return false;
  }
})()


module.exports = configDev ? configDev : config;