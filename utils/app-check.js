// control/files.js addon: this checks a folder within the common apps folder
// returning (boolean) if the app files structure is ok

const dirTree = require('directory-tree'),
      fs = require('fs-extra'),
      path = require('path');


/* INTERNAL TOOLS */
function removeProps(obj, keys) { // The dirTree object include info properties, not necessary
  if(Array.isArray(obj)){
    obj.forEach(function(item){
      removeProps(item,keys)
    });
  }
  else if(typeof obj === 'object' && obj != null){
    Object.getOwnPropertyNames(obj).forEach(function(key){
      if(keys.indexOf(key) !== -1)delete obj[key];
      else removeProps(obj[key],keys);
    });
  }
}
/* INTERNAL TOOLS */



/* EXPORT */

const appCheck = {};


/* 
This is the reference to create the "isAFolderApp" function
Basic app structure = [ 
  { name: 'app', children: [ { name: 'index.html' } ] },
  {
    name: 'backend',
    children: [
      { name: 'database', children: [] },
      {
        name: 'functions',
        children: [ { name: 'external.js' }, { name: 'internal.js' } ]
      },
      {
        name: 'info',
        children: [ { name: 'app-data.json' }, { name: 'app-icon' } ]
      },
      { name: 'models', children: [] }
    ]
  }
];
*/

appCheck.isAFolderApp = async (pathToFolder) => {
  try {
    const folderContent = dirTree(pathToFolder).children; 
    removeProps(folderContent, ['path']); // To delete info fields
    // Comparation folder object vs basic app structure (see above)
    for (const child of folderContent) {
      switch (child.name) {
        case 'app': 
          // The app subfolder must contain at least an "index.html" element
          let isIndexHtmlThere = false;
          for (const grandChildApp of child.children) {
            if (grandChildApp.name === 'index.html') { isIndexHtmlThere = true; }
          }
          if (!isIndexHtmlThere) { throw error; }
          break;
        case 'backend': 
          // The backend subfolder must contain at least the following four elements:
          const requiredGrandChildren = ['database', 'functions', 'info', 'models'];
          const foundGrandChildren = [];
          for(const grandChildBackend of child.children) {
            foundGrandChildren.push(grandChildBackend.name);
            // And now we check some grandchildren contain what they are suppose to:
            switch (grandChildBackend.name) {
              case 'functions':
                const requiredFunctions = ['internal.js', 'external.js'];
                const foundFunctions = [];
                for (const functionName of grandChildBackend.children) {
                  foundFunctions.push(functionName.name);
                }
                for (const rfunction of requiredFunctions) {
                  if (!foundFunctions.includes(rfunction)) { throw error; }
                }
                break;
              case 'info':
                const requiredInfo = 'app-data.json';
                const foundInfo = [];
                for (const infoFile of grandChildBackend.children) {
                  foundInfo.push(infoFile.name);
                }
                if (!foundInfo.includes(requiredInfo)) { throw error; }
                await fs.readJSON(path.join(pathToFolder, 'backend', 'info', requiredInfo)); 
                break;
            }
          }
          for (const GrandChildrenElement of requiredGrandChildren) {
            if (!foundGrandChildren.includes(GrandChildrenElement)) { throw error; }
          }
          break;
      }
    }
    return true;
  } catch (error) {
    return false; 
  }
};




module.exports = appCheck