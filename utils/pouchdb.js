/* 
What you have here
==================

This file is NOT used by the backend. It's just an example for the frontend apps
developers, so they will know how to easily implement the default storage system
in the suite. Please read the docs before getting into all this, so you will
understand how this software works. 

Since the backend functions of your frontend app will be placed in the same app folder
(see docs), you could potentially use any storage system for your database. But this
backend has already installed a convenient package for that, a Node version of PouchDB
that you can use as you will see in the example below.

IMPORTANT: this package works with versions by default (same as Git does), meaning when 
you update something the previous information is never deleted. This would lead to an
infinite increase of the db size, but don't panic: as you will see below, there is an
option called "auto_compaction" that changes the default and will keep your db at its
minimal size. But don't forget to include it when creating your db!

All the PouchDB docs here: 
  Intro: https://www.npmjs.com/package/pouchdb-node
  Full documentation: https://pouchdb.com

*/



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