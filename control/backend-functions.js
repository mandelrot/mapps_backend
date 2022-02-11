/* 
Each frontend app of the suite will have its own functions Control will invoke.
The "backend fronts" (admin page and suite entry point) need a few functions too
*/

const path = require('path');
const config = require(path.join(__dirname, '..', 'config', 'config.js')),
      files = require(path.join(__dirname, 'files.js'));





let adminPassword = false;


/* ENCRYPTED FILE OPERATIONS */
let encryptedFileContent = false;

const readEncryptedFile = () => {
  // To be implemented: read (sync) the file when app starts.
  // This file should contain (encrypted) one of these two: 
  //   - If no admin is created: { pass: the same pass than the config pass }
  //   - If admin is alredy created: { pass, adminPassWord }
}
const checkEncryptedFileIntegrity = () => {
  // To be implemented: decrypt encryptedFileContent, then check whether it contains the config 
}
const writeEncryptedFile = () => {
  // To be implemented: write (sync) the file when the new admin is created
}

/* END OF ENCRYPTED FILE OPERATIONS */



const backend = {};

backend.checkOrCreateAdmin = async (adminPassword) => {


  if (adminPassword) { return { result: false, error: 'An admin password is already registered.' } }
}


backend.makeAppsList = (json) => {

}





module.exports = backend;