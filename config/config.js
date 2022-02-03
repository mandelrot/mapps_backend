
const config = {};


/* THE FOLLOWING BLOCK IS MEANT TO BE CUSTOMIZED BY YOU. 
PLEASE DO NOT FORGET TO FOLLOW THE PASSPHRASE INSTRUCTIONS */

  config.locations = {
    appsFolderRouteFromMainDirectory: ['..', '..', 'APPS'],
        // No need to change, in the production Electron app this will place the APPS
        // folder in the root app directory (where the executable is)
    encryptedFile: 'system.enc' // You could change this if you want to, but there's no need
  };

  config.PASSPHRASE = 'VERY IMPORTANT - YOU SHOULD CUSTOMIZE THIS TEXT BEFORE COMPILATION';
    // Please read the security note at the end of this file!

  config.server = {
    PORT: 3000, // Change to your needs
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



/* 
Security note
=============

Before compiling the app to make a real production software customized just for you,
you should change the PASSPHRASE variable to something only you know. And right after 
doing that, you should change it again and save (to erase all trace of what it was).

The frontend apps will use the PASSPHRASE variable to store their encrypted information.
This means your database files will be linked to it: the information within them will
not be accesible from any context outside the suite. If someone steals your files, since
they will not be able to read them (and they don't have the encrypted user passwords), 
your critical information will have a reasonable protection. Absolute security doesn't 
exist of course, but something is better than nothing.

Side note: you should keep a copy of your customized PASSPHRASE somewhere else. In case
something happens to your software and you need to re-compile the basic suite app, you 
can reuse your PASSPHRASE again so you will always be able to have things working again.
*/