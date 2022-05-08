// The backend use an extended version of fs called "fs-extra":
// you have all the standard fs functions, plus some others
// https://www.npmjs.com/package/fs-extra
const fs = require('fs-extra'); 

const path = require('path');

const filesFolder = path.join(__dirname, 'my-uploaded-files');
fs.ensureDirSync(filesFolder);



const internalFunctions = {}; // You could name the object as you want



internalFunctions.manageFormWithFiles = async (form) => {
  try {
    let response = 'Received in the backend:';

    for (const text of form.texts) {
      response += ' textfield ' + text.value + ' -';
    }

    for (const file of form.files) {
      response += ' file: ' + file.fileName + ' (' + file.fileSize + ' bytes) -';
      await fs.promises.writeFile(path.join(filesFolder, file.fileName), file.content);
    }
    response = response.slice(0,-1);
    return { msgOk: response }
  } catch (error) {
    return { msgError: `Something wrong has happened. This is the error caught in internal.js/manageFormWithFiles: ${error}`}
  }
}



module.exports = internalFunctions;