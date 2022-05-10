const path = require('path');



// For this example we will not use the backend encryption module sent in the "backendInfo"
// object (we could) but an independent module of our own. Just to demonstrate it can be done
const encryption = require(path.join(__dirname, 'your-aux-folder','encryption.js'));


const myFunctions = {};




myFunctions.cipherFront = (textToCipher) => {
  
  const encrypted = encryption.cipher(textToCipher);

  return { msgOk: encrypted }
  
};

module.exports = myFunctions;