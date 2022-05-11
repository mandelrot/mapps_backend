

const path = require('path'); // The server will execute this code, so this is a Node environment




const internalFunctions = {}; // You could name the object as you want

let backendInfo;
let fs; 
const filesFolder = path.join(__dirname, 'my-uploaded-files');
internalFunctions.importBackendInfo = (bInfo) => {
  if (!backendInfo) { backendInfo = bInfo; }
  fs = backendInfo.modules.fs;
    // This "fs" is actually an extended package, "fs-extra", with more useful functions
    // https://www.npmjs.com/package/fs-extra
  fs.ensureDirSync(filesFolder);
};




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