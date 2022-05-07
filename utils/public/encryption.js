
const CryptoJS = require("crypto-js");

const path = require('path');
const { PASSPHRASE } = require(path.join(__dirname, '..', '..', 'config', 'config.js'));



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


