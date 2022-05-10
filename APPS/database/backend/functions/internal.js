const path = require('path');

const db = require(path.join(__dirname, 'db'));




const myFunctions = {};


let backendInfo;
myFunctions.importBackendInfo = (bInfo) => {
  // We bring an instance of the Node pouchDB module from the backend
  if (!backendInfo) { backendInfo = bInfo; }
  db.importDB(backendInfo.modules.PouchDB); // and send it to our db module
};


myFunctions.store = async (dataArray) => {
  let stored;
  let error = false;
  for (const item of dataArray) {
    stored = await db.store(item);
    if (stored.msgError) { error = stored.msgError; }
  }
  if (error) {
    return { msgError: error };
  } else {
    return { msgOk: 'All data successfully registered.' };
  }
};


myFunctions.readAll = async () => {
  return await db.readAll();
};


module.exports = myFunctions;