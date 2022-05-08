const path = require('path');

const db = require(path.join(__dirname, 'db'));



const myFunctions = {};


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