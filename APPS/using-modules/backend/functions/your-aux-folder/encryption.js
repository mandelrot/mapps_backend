
// The CryptoJS library is already installed in the backend environment,
// and included in package.json, so we can import it here
const CryptoJS = require("crypto-js");



const PASSPHRASE = 'My frontend passphrase. It may be different than the backend one';



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


