/* 

This file is NOT used by the backend. It's here just a reference
for the frontend developers who may want to use scheduled tasks
to let them know that this backend has a built-in package 
imported that will allow it. Here are the docs:

https://www.npmjs.com/package/node-cron 

Since it's already imported in package.json you can use it anywhere
in your internal/external functions:

  cron = require('node-cron');

  cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
  });

Please check the docs to see how it works.

*/