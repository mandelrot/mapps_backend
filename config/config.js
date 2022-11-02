
const config = {};


/* THE FOLLOWING BLOCK IS MEANT TO BE CUSTOMIZED BY YOU. 
PLEASE READ THE COMMENTS AND FOLLOW THE INSTRUCTIONS */

config.PASSPHRASE = 'VERY IMPORTANT - YOU SHOULD CUSTOMIZE THIS TEXT BEFORE COMPILATION';
// Please read the security note at the end of this file!

config.msgMaxSize = 100; // In Megas - Be sure to have a numeric value here!
// This limit will apply for the incoming messages. Bigger messages will be simply ignored. 
// If you have more than one file in a message this number will apply to all of them together
  // More info:  https://socket.io/docs/v4/server-options/#maxhttpbuffersize
// Anyway you can set individual file limits in your frontend app functions

config.server = {
  PORT: 3000, // Change to your needs, but:
  // VERY IMPORTANT - PLEASE GET SURE THE PORT HERE IS THE SAME THAN THE PORT AT
  // fronts/js/main.js  -->  Both variables must match so the main page can work!
};

/* END OF YOUR CUSTOMIZATION. 
YOU SHOULDN'T NEED TO CHANGE ANYTHING BELOW HERE */






config.locations = {
  appsFolderRouteFromMainDirectory: ['..', '..', 'APPS'] // No need to change
};



/* If ./config_dev is there we are in DEV environment, otherwise the app will use this file */
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
