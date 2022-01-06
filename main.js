/* Please note: before working with the app, you should 
configure ./config/config.js with your own data */

const path = require('path');


// Communications module
require(path.join(__dirname, 'server', 'server.js'));




/* PENDING
   =======

  server/server.js:
    - Handle apps request --> send to CONTROL (who will look for the app folder, render it and load the functions)
    - Handle 404 response


  Backend apps logs (errors registry)

  Error messages - language packs

  Delete: 
    - All the lines marked with a "delete" comment
    - package.json --> colors
    - front-fake folder
*/

