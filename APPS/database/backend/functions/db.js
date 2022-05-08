
const path = require('path');

const PouchDB = require('pouchdb-node'); // Already installed in the backend
                                         // See a full basic example at /utils/pouchdb.js
  // Docs: https://www.npmjs.com/package/pouchdb-node
        // https://pouchdb.com

const routeToDB = path.join(__dirname, 'my-db-folder');
const myDB = new PouchDB(routeToDB, {auto_compaction: true});
  // Please note: PouchDB works with versions kept forever (same as Git for example). This leads
  // to an exponential db grouth, but can be avoided with the "auto-compaction" option which
  // makes it work as a standard DB keeping only the most recent changes and a minimal size.



const db = {};


db.store = async (data) => {
  try {
    const dbAllData = await myDB.allDocs({include_docs: true});
    const docs = dbAllData.rows.map( element => element = element.doc);
    let isAlreadyRegistered = false;
    for (const doc of docs) {
      if (doc._id === data) { isAlreadyRegistered = true; }
    }
    if (!isAlreadyRegistered) {
      await myDB.put({_id: data, version: 1});
    }
    return { msgOk: `${data} successfully registered.` };
  } catch (error) {
    return { msgError: 'There has been some error when storing the data in the DB: ' + error };
  }
};



db.readAll = async() => {

  try {
    const dbAllData = await myDB.allDocs({include_docs: true});
    const docs = dbAllData.rows.map( element => element = element.doc);
    return { msgOk: docs }
  } catch (error) {
    return { msgError: 'There has been some error when retrieving the data in the DB: ' + error };
  }

};



module.exports = db;


/* 
// POUCHDB EXAMPLE

const PouchDB = require('pouchdb-node');
const routeToDB = 'mydb'; // You should replace this for the path where your files will be located
const db = new PouchDB(routeToDB, {auto_compaction: true});

db.put({_id: 'foo', version: 1}).then(function () {
  return db.get('foo');
}).then(function (doc) {
  doc.extra = true;
  doc.version = 2;
  return db.put(doc);
}).then(function (doc) {
  return db.get('foo');
}).then(function (doc) {
  doc.extra = 'I am an extra';
  doc.version = 3;
  return db.put(doc);
}).then(function (doc) {
  // Revision 1 is already deleted
  return db.allDocs({include_docs: true});
}).then(function (result) {
  console.log (result.rows.map( element => element = element.doc));
});
 */