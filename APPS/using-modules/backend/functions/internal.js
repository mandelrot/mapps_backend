const path = require('path'); // We are in the Node environment so we can use it

const encryption = require(path.join(__dirname, 'your-aux-folder','encryption.js'));



const myFunctions = {};


myFunctions.cipherFront = (textToCipher) => {
  
  const encrypted = encryption.cipher(textToCipher);

  return { msgOk: encrypted }
  
};

module.exports = myFunctions;