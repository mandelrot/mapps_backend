const path = require('path');


const CryptoJS = require(path.join(__dirname, 'crypto-js.min.js')); // local module



const PASSPHRASE = 'My frontend passphrase. It may be different than the backend one';
  // WARNING: if you use your own encryption module and not the one provided by the backend,
  // you are using a different encryption base. Be aware that if other elements (for example
  // your own frontend) encrypt data with the backend module you won't be able to decrypt it
  // here (and viceversa) unless the passphrase is the same.



const encryption = {};


encryption.cipher = (original) => {
  return CryptoJS.AES.encrypt(original, PASSPHRASE).toString();
};

encryption.decipher = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, PASSPHRASE);
  return bytes.toString(CryptoJS.enc.Utf8);
};



encryption.hash = (original) => {
  return CryptoJS.SHA512(original).toString(CryptoJS.enc.Hex);
}

encryption.check = (original, hashed) => {
  return encryption.hash(original) === hashed;
}


module.exports = encryption;


