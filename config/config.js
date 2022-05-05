
const config = {};


/* THE FOLLOWING BLOCK IS MEANT TO BE CUSTOMIZED BY YOU. 
PLEASE READ THE COMMENTS AND FOLLOW THE INSTRUCTIONS */

config.PASSPHRASE = 'VERY IMPORTANT - YOU SHOULD CUSTOMIZE THIS TEXT BEFORE COMPILATION';
// Please read the security note at the end of this file!

config.server = {
  PORT: 3000, // Change to your needs, but:
  // VERY IMPORTANT - PLEASE GET SURE THE PORT HERE IS THE SAME THAN THE PORT AT
  // fronts/js/main.js  -->  Both variables must match so the main page can work!
};

config.files = {
  uploadedFileMaxSize: (10*1024*1024) // 10 Mb
  // Please note: this value is not absolute (it's not a server limit) because
  // this system is based on absolute modularity and each frontend app should
  // decide how to manage their own files. But this will be a reference for
  // the apps that decide to use it.
}

/* END OF YOUR CUSTOMIZATION. 
YOU SHOULDN'T NEED TO CHANGE ANYTHING BELOW HERE */




config.locations = {
  appsFolderRouteFromMainDirectory: ['..', '..', 'APPS']
      // No need to change, in the production Electron app this will place the APPS
      // folder in the root app directory (where the executable is)
};



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

The frontend apps may use the PASSPHRASE variable to store their encrypted information
(example: passwords). If someone steals your database files they still could not see
the encripted fields. The absolute security doesn't exist of course, but this adds
a protection layer.

Anyway, you should keep your PASSPHRASE somewhere safe. In case something happens and
you have to re-compile your suite distribution (and then copy the apps folders with
their databases inside them), you will need to use the same PASSPHRASE so your suite
can decrypt those protected fields and work with them. Remember: the PASSPHRASE is
the key to access your data. 
*/
